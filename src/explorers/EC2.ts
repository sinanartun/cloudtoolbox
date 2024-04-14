import * as vscode from 'vscode';
import { EC2Client, DescribeInstancesCommand, DescribeInstancesCommandOutput, DescribeAddressesCommand } from "@aws-sdk/client-ec2";
import { AutoScalingClient, DescribeAutoScalingGroupsCommand } from "@aws-sdk/client-auto-scaling";
import { RegionProvider, RegionObserver } from "../providers/RegionProvider";
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { ProfileProvider } from '../providers/ProfileProvider';

export class Ec2Explorer implements RegionObserver{
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
      console.error(`Failed to initialize   regions: ${error}`);
    }
  }

  public onRegionSelectionChanged(selectedRegions: Set<string>): void {
    
    this.selectedRegions = Array.from(selectedRegions);
    console.log('Updated selected regions in Lambda Explorer: ', this.selectedRegions);
    
    
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
      const ec2Client = new EC2Client({ region, credentials });
      const [instanceCounts, elasticIpCount, autoScalingGroupCount] = await Promise.all([
        this.getEc2InstanceCount(ec2Client),
        this.getElasticIpCount(ec2Client),
        this.getAutoScalingGroupCount(region),
      ]);

      
      return [region, instanceCounts.total, instanceCounts.running, instanceCounts.stopped, instanceCounts.terminated, elasticIpCount, autoScalingGroupCount];
    }));

    return chartData;
  }

  private async getEc2InstanceCount(ec2: EC2Client): Promise<{
    total: number;
    running: number;
    stopped: number;
    terminated: number;
  }> {
    try {
      const command = new DescribeInstancesCommand({});
      const response: DescribeInstancesCommandOutput = await ec2.send(command);
      let total = 0, running = 0, stopped = 0, terminated = 0;

      response.Reservations?.forEach((reservation) => {
        reservation.Instances?.forEach((instance) => {
          
          switch (instance.State?.Name) {
            case "running":
            case "pending":
              total++;
              running++;
              break;
            case "stopped":
            case "stopping":
              total++;
              stopped++;
              break;
            case "terminated":
            case "shutting-down":
              terminated++;
              break;
          }
        });
      });

      return { total, running, stopped, terminated };
    } catch (error) {
      console.error(`Failed to get EC2 instance count: ${error}`);
      return { total: 0, running: 0, stopped: 0, terminated: 0 };
    }
  }

  private async getElasticIpCount(ec2: EC2Client): Promise<number> {
    try {
      const command = new DescribeAddressesCommand({});
      const response = await ec2.send(command);
      return response.Addresses ? response.Addresses.length : 0;
    } catch (error) {
      console.error(`Failed to get Elastic IP count: ${error}`);
      return 0;
    }
  }

  private async getAutoScalingGroupCount(region: string): Promise<number> {
    try {
      const autoScaling = new AutoScalingClient({ region });
      const command = new DescribeAutoScalingGroupsCommand({});
      const response = await autoScaling.send(command);
      return response.AutoScalingGroups ? response.AutoScalingGroups.length : 0;
    } catch (error) {
      console.error(`Failed to get Auto Scaling group count: ${error}`);
      return 0;
    }
  }
}
