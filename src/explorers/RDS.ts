import * as vscode from 'vscode';
import { RDSClient, DescribeDBSnapshotsCommand, DescribeDBClustersCommand, DescribeDBInstancesCommand, DescribeDBClusterSnapshotsCommand, DescribeDBClusterAutomatedBackupsCommand } from "@aws-sdk/client-rds";
import { RegionProvider, RegionObserver } from "../providers/RegionProvider";
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { ProfileProvider } from '../providers/ProfileProvider';

export class RDSExplorer implements RegionObserver {
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
      const rdsClient = new RDSClient({ region, credentials });
      const dbClusterData = await this.getDBClusterData(rdsClient);
      const dbInstanceData = await this.getDBInstanceData(rdsClient);
      const snapshotData = await this.getSnapshotData(rdsClient);
      
      return [
        region,
        dbClusterData.totalDBClusters,
        dbInstanceData.totalDBInstances,
        snapshotData.totalSnapshotsAndBackups,
        snapshotData.DBClusterSnapshots,
        snapshotData.DBClusterAutomatedBackups,
        snapshotData.DBSnapshots,
      ];
    }));

    return chartData;
  }

  private async getDBInstanceData(rdsClient: RDSClient): Promise<any> {
    try {
      const command = new DescribeDBInstancesCommand({});
      const response = await rdsClient.send(command);
      
      return {
        totalDBInstances: response.DBInstances ? response.DBInstances.length : 0,
      };
    } catch (error) {
      console.error(`Failed to get DB instance data: ${error}`);
      return { totalDBInstances: 0 };
    }
  }

  private async getDBClusterData(rdsClient: RDSClient): Promise<any> {
    try {
      const command = new DescribeDBClustersCommand({});
      const response = await rdsClient.send(command);
      
      return {
        totalDBClusters: response.DBClusters ? response.DBClusters.length : 0,
      };
    } catch (error) {
      console.error(`Failed to get DB cluster data: ${error}`);
      return { totalDBClusters: 0 };
    }
  }

  private async getSnapshotData(rdsClient: RDSClient): Promise<any> {
    try {
      const command = new DescribeDBSnapshotsCommand({});
      const command2 = new DescribeDBClusterSnapshotsCommand({});
      const command3 = new DescribeDBClusterAutomatedBackupsCommand({});
      
      const response = await rdsClient.send(command);
      const response2 = await rdsClient.send(command2);
      const response3 = await rdsClient.send(command3);
      const DBSnapshots = response.DBSnapshots ?? [];
      const DBClusterSnapshots = response2.DBClusterSnapshots ?? [];
      const DBClusterAutomatedBackups = response3.DBClusterAutomatedBackups ?? [];

      
      
      
      return {
        totalSnapshotsAndBackups: DBSnapshots.length + DBClusterSnapshots.length + DBClusterAutomatedBackups.length ,
        DBClusterSnapshots:DBClusterSnapshots.length,
        DBClusterAutomatedBackups:DBClusterAutomatedBackups.length,
        DBSnapshots:DBSnapshots.length,

      };
    } catch (error) {
      console.error(`Failed to get snapshot data: ${error}`);
      return {
        totalSnapshotsAndBackups: 0,
        DBClusterSnapshots: 0,
        DBClusterAutomatedBackups: 0,
        DBSnapshots: 0,
      };
    }
  }
}
