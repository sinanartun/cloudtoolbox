import * as vscode from 'vscode';
import { ECSClient, ListClustersCommand, ListServicesCommand, ListTasksCommand, DescribeClustersCommand, DescribeServicesCommand, DescribeTasksCommand } from "@aws-sdk/client-ecs";
import { RegionProvider, RegionObserver } from "../providers/RegionProvider";
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { ProfileProvider } from '../providers/ProfileProvider';

export class ECSExplorer implements RegionObserver {
  private selectedRegions: string[] = [];
  private selectedProfile: string | undefined;

  constructor(private context: vscode.ExtensionContext) {
    this.initialize().catch(error => console.error(`Failed to initialize ${this.constructor.name}: ${error}`));
  }

  private async initialize() {
    try {
      const regionProvider = await RegionProvider.getInstance(this.context);
      regionProvider.registerObserver(this);
      this.selectedRegions = await regionProvider.getSelectedRegions();
      const profileProvider = await ProfileProvider.getInstance(this.context);
      profileProvider.registerObserver(this);
      this.selectedProfile = profileProvider.getSelectedProfile();
    } catch (error) {
      console.error(`Failed to initialize regions: ${error}`);
    }
  }

  public onRegionSelectionChanged(selectedRegions: Set<string>): void {
    this.selectedRegions = Array.from(selectedRegions);
  }

  public onProfileChanged(newProfile: string): void {
    if (this.selectedProfile !== newProfile) {
      this.selectedProfile = newProfile;
    }
  }

  public async getChartData(): Promise<any[]> {
    if (this.selectedRegions.length === 0) {
      vscode.window.showWarningMessage('No region selected. Please select a region on Sidebar');
      return [];
    }

    const credentials = fromIni({ profile: this.selectedProfile });
    const chartData = await Promise.all(this.selectedRegions.map(async (region) => {
      const ecsClient = new ECSClient({ region, credentials });
      const [clusterCount, serviceCounts, taskCounts] = await Promise.all([
        this.getECSClusterCount(ecsClient),
        this.getServiceCounts(ecsClient),
        this.getTaskCounts(ecsClient)
      ]);

      return [region, clusterCount, serviceCounts, taskCounts];
    }));

    return chartData;
  }

  public async drillDown(args: { region: string, type: string }): Promise<any> {
    const { region, type } = args;
    const credentials = fromIni({ profile: this.selectedProfile });
    const ecsClient = new ECSClient({ region, credentials });

    switch (type) {
      case 'cluster':
        return this.getClusterData(ecsClient, args);
      case 'service':
        return this.getServiceData(ecsClient, args);
      case 'task':
        return this.getTaskData(ecsClient, args);
      default:
        throw new Error(`Unsupported drill down type: ${type}`);
    }
  }

  private async getClusterData(ecsClient: ECSClient, args: { region: string, type: string }) {
    try {
      const command = new ListClustersCommand({});
      const response = await ecsClient.send(command);
      const data = await this.describeClusters(ecsClient, response.clusterArns || []);
      return { data, args };
    } catch (error) {
      console.error(`Failed to get cluster data: ${error}`);
      return { data: [], args };
    }
  }

  private async describeClusters(ecsClient: ECSClient, clusterArns: string[]): Promise<any[]> {
    if (clusterArns.length === 0) {return [];}
    const command = new DescribeClustersCommand({ clusters: clusterArns });
    const response = await ecsClient.send(command);
    return response.clusters?.map(cluster => cluster) || [];
  }

  private async getServiceData(ecsClient: ECSClient, args: { region: string, type: string }) {
    try {
      const listClustersCommand = new ListClustersCommand({});
      const listClustersResponse = await ecsClient.send(listClustersCommand);
      const clusterArns = listClustersResponse.clusterArns || [];
      
      if (clusterArns.length === 0) {return { data: [], args };}

      const services = await Promise.all(clusterArns.map(async (clusterArn) => {
        const listServicesCommand = new ListServicesCommand({ cluster: clusterArn });
        const listServicesResponse = await ecsClient.send(listServicesCommand);
        const serviceArns = listServicesResponse.serviceArns || [];
        
        if (serviceArns.length === 0) {return [];}

        const describeServicesCommand = new DescribeServicesCommand({ cluster: clusterArn, services: serviceArns });
        const describeServicesResponse = await ecsClient.send(describeServicesCommand);
        return describeServicesResponse.services || [];
      }));

      const data = services.flat();
      return { data, args };
    } catch (error) {
      console.error(`Failed to get service data: ${error}`);
      return { data: [], args };
    }
  }



private async getTaskData(ecsClient: ECSClient, args: { region: string, type: string }) {
  
  try {
    const data = [];
    const clusterResponse = await ecsClient.send(new ListClustersCommand({}));
    if (clusterResponse.clusterArns) {
      for (const clusterArn of clusterResponse.clusterArns) {
        // Fetch the cluster details to confirm its region
        try {
          const describeClusterResponse = await ecsClient.send(new DescribeClustersCommand({ clusters: [clusterArn] }));
          if (describeClusterResponse.clusters && describeClusterResponse.clusters.length > 0) {
            const cluster = describeClusterResponse.clusters[0];
            if (cluster.clusterArn === clusterArn && cluster.clusterArn.includes(args.region)) {
              // List tasks for the cluster
              const listTasksResponse = await ecsClient.send(new ListTasksCommand({ cluster: clusterArn }));
              console.log('ListTasksCommand');
              console.log(listTasksResponse);
              if (listTasksResponse.taskArns && listTasksResponse.taskArns.length > 0) {
                // Describe tasks for the listed tasks
                const describeTasksResponse = await ecsClient.send(new DescribeTasksCommand({
                  cluster: clusterArn,
                  tasks: listTasksResponse.taskArns,
                  include: ["TAGS"]
                }));
                data.push(...(describeTasksResponse.tasks || []));
              }
            }
          }
        } catch (clusterError) {
          console.error(`Failed to process cluster ${clusterArn}: ${clusterError}`);
        }
      }
    }
    return { data, args };
  } catch (error) {
    console.error(`Failed to get task data: ${error}`);
    return { data: [], args };
  }
}

  private async getECSClusterCount(ecsClient: ECSClient): Promise<number> {
    try {
      const command = new ListClustersCommand({});
      const response = await ecsClient.send(command);
      return response.clusterArns ? response.clusterArns.length : 0;
    } catch (error) {
      console.error(`Failed to get ECS cluster count: ${error}`);
      return 0;
    }
  }

  private async getServiceCounts(ecsClient: ECSClient): Promise<number> {
    try {
      const command = new ListClustersCommand({});
      const clusterResponse = await ecsClient.send(command);
      let serviceCounts = 0;

      if (clusterResponse.clusterArns) {
        for (const clusterArn of clusterResponse.clusterArns) {
          const servicesCommand = new ListServicesCommand({ cluster: clusterArn });
          const servicesResponse = await ecsClient.send(servicesCommand);
          serviceCounts += (servicesResponse.serviceArns ? servicesResponse.serviceArns.length : 0);
        }
      }

      return serviceCounts;
    } catch (error) {
      console.error(`Failed to get service counts: ${error}`);
      return 0;
    }
  }

  private async getTaskCounts(ecsClient: ECSClient): Promise<number> {
    try {
      const command = new ListClustersCommand({});
      const clusterResponse = await ecsClient.send(command);
      let taskCounts = 0;

      if (clusterResponse.clusterArns) {
        for (const clusterArn of clusterResponse.clusterArns) {
          const tasksCommand = new ListTasksCommand({ cluster: clusterArn });
          const tasksResponse = await ecsClient.send(tasksCommand);
          taskCounts += (tasksResponse.taskArns ? tasksResponse.taskArns.length : 0);
        }
      }

      return taskCounts;
    } catch (error) {
      console.error(`Failed to get task counts: ${error}`);
      return 0;
    }
  }
}
