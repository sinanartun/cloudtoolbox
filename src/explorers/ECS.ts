import * as vscode from 'vscode';
import { ECSClient, ListClustersCommand, ListClustersCommandOutput, ListServicesCommand, ListTaskDefinitionsCommand, ListTasksCommand } from "@aws-sdk/client-ecs";
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
        console.log(`Updated AWS profile in ${this.constructor.name}: ${newProfile}`);

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
      const clusterCount = await this.getECSClusterCount(ecsClient);
      const serviceCounts = await this.getServiceCounts(ecsClient);
      const taskCounts = await this.getTaskCounts(ecsClient);

      return [region, clusterCount, serviceCounts, taskCounts];
    }));

    return chartData;
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
  }


  private async getTaskCounts(ecsClient: ECSClient): Promise<number> {
    const command = new ListClustersCommand({});
    const clusterResponse = await ecsClient.send(command);
    let taskCounts = 0;

    if (clusterResponse.clusterArns) {
      for (const clusterArn of clusterResponse.clusterArns) {
        const tasksCommand = new ListTasksCommand({ cluster: clusterArn });
        const tasksResponse = await ecsClient.send(tasksCommand);
        taskCounts+=(tasksResponse.taskArns ? tasksResponse.taskArns.length : 0);
      }
    }

    return taskCounts;
  }

}
