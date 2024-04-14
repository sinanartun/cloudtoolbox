import * as vscode from 'vscode';
import {
  RedshiftClient,
  DescribeClusterSnapshotsCommand,
  DescribeClustersCommand
} from "@aws-sdk/client-redshift";
import { RedshiftServerlessClient, ListWorkgroupsCommand } from "@aws-sdk/client-redshift-serverless";
import { RegionProvider, RegionObserver } from "../providers/RegionProvider";
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { ProfileProvider } from '../providers/ProfileProvider';

export class RedshiftExplorer implements RegionObserver {
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

    
    const credentials = fromIni({ profile:this.selectedProfile });

    const chartDataPromises = this.selectedRegions.map(async (region) => {
      const redshiftClient = new RedshiftClient({ region, credentials });
      const serverlessClient = new RedshiftServerlessClient({ region, credentials });
      const clusterCount = await this.getRedshiftClusterCount(redshiftClient);
      const serverlessCount = await this.getServerlessCount(serverlessClient);
      const backupData = await this.getBackupData(redshiftClient);
      
      return [ region, clusterCount, serverlessCount, backupData.backupCount, backupData.totalBackupSize ];
    });

    return Promise.all(chartDataPromises);
  }

  private async getRedshiftClusterCount(redshiftClient: RedshiftClient): Promise<number> {
    try {
      const command = new DescribeClustersCommand({});
      const response = await redshiftClient.send(command);
      return response.Clusters ? response.Clusters.length : 0;
    } catch (error) {
      console.error(`Failed to get Redshift cluster count: ${error}`);
      return 0;
    }
  }

  private async getBackupData(redshiftClient: RedshiftClient): Promise<{ backupCount: number, totalBackupSize: number }> {
    try {
      const command = new DescribeClusterSnapshotsCommand({});
      const response = await redshiftClient.send(command);
      const backupCount = response.Snapshots?.length || 0;
      const totalBackupSize = response.Snapshots?.reduce((sum, snapshot) => sum + (snapshot.TotalBackupSizeInMegaBytes || 0), 0);
      return { backupCount, totalBackupSize: totalBackupSize || 0 };
    } catch (error) {
      console.error(`Failed to get backup data: ${error}`);
      return { backupCount: 0, totalBackupSize: 0 };
    }
  }

  private async getServerlessCount(serverlessClient: RedshiftServerlessClient): Promise<number> {
    try {
      const command = new ListWorkgroupsCommand({});
      const response = await serverlessClient.send(command);
      return response.workgroups?.length || 0;
    } catch (error) {
      console.error(`Failed to get Redshift Serverless workgroup count: ${error}`);
      return 0;
    }
  }
}
