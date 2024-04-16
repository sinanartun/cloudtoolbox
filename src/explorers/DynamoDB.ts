import * as vscode from "vscode";
import { DynamoDBClient, ListTablesCommand, DescribeTableCommand, ListBackupsCommand } from "@aws-sdk/client-dynamodb";
import { RegionProvider, RegionObserver } from "../providers/RegionProvider";
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { ProfileProvider } from '../providers/ProfileProvider';



export class DynamoDBExplorer implements RegionObserver {
  private selectedRegions: string[] = [];
  private selectedProfile: string | undefined;

  constructor(private context: vscode.ExtensionContext) {
    this.initialize().catch(error => console.error(`Failed to initialize DynamoDBExplorer: ${error}`));
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

  public onProfileChanged(newProfile: string): void {
    if (this.selectedProfile !== newProfile) {
        this.selectedProfile = newProfile;
    }
}


  public onRegionSelectionChanged(selectedRegions: Set<string>): void {
    this.selectedRegions = Array.from(selectedRegions);
  }

  public async getChartData(): Promise<any[]> {
    if (this.selectedRegions.length === 0) {
        vscode.window.showWarningMessage('No region selected. Please select a region on Sidebar');
        return [];
    }

    try {
        const selectedProfile = await this.getSelectedProfile();
        if (!selectedProfile) {
            vscode.window.showWarningMessage('No profile selected. Please select a profile.');
            return [];
        }
        // const credentialsProvider = this.getCredentialsProvider(selectedProfile);

        return await this.fetchChartData(selectedProfile);
    } catch (error) {
        vscode.window.showErrorMessage(`Error fetching chart data: ${error}`);
        return [];
    }
  }


private async getSelectedProfile(): Promise<string | undefined> {
  const profileProvider = await ProfileProvider.getInstance(this.context);
  return profileProvider.selectedProfile;
}



private async fetchChartData(selectedProfile:string): Promise<any[]> {
  const chartDataPromises = this.selectedRegions.map(region => this.fetchRegionData(region,selectedProfile));
  return Promise.all(chartDataPromises);
}

private async fetchRegionData(region: string,selectedProfile:string): Promise<any[]> {
  try {

    const dynamoDBClient = new DynamoDBClient({region, credentials: fromIni({profile: selectedProfile})});

      // const dynamoDBClient = new DynamoDBClient({ credentials: fromIni({profile: selectedProfile, clientConfig: { region }})});
      const tableData = await this.getTableData(dynamoDBClient);

      return [
          region, 
          tableData.tableCount, 
          tableData.totalSizeMB, 
          tableData.totalItemCount,
          tableData.backupCount, 
          tableData.totalBackupSize,
      ];
  } catch (error) {
      vscode.window.showErrorMessage(`Error fetching data for region ${region}: ${error}`);
      return [region, 0, 0, 0, 0, 0]; 
  }
}








  private async getTableData(dynamoDBClient: DynamoDBClient): Promise<any> {
    let totalSizeBytes = 0, totalItemCount = 0;
    const tableNames = await this.listAllTables(dynamoDBClient);

    for (const tableName of tableNames) {
      const describeTableCommand = new DescribeTableCommand({ TableName: tableName });
      const tableDetails = await dynamoDBClient.send(describeTableCommand);
      totalSizeBytes += tableDetails.Table?.TableSizeBytes || 0;
      totalItemCount += tableDetails.Table?.ItemCount || 0;
    }

    const backupData = await this.getBackupData(dynamoDBClient);

    return {
      tableCount: tableNames.length,
      totalSizeMB: totalSizeBytes,
      totalItemCount,
      totalBackupSize: backupData.totalBackupSize,
      backupCount: backupData.backupCount,
    };
  }

  private async listAllTables(dynamoDBClient: DynamoDBClient): Promise<string[]> {
    let tableNames: string[] = [];
    let lastEvaluatedTableName: string | undefined;

    do {
      const listTablesCommand = new ListTablesCommand({ ExclusiveStartTableName: lastEvaluatedTableName });
      const listTablesOutput = await dynamoDBClient.send(listTablesCommand);
      tableNames = tableNames.concat(listTablesOutput.TableNames || []);
      lastEvaluatedTableName = listTablesOutput.LastEvaluatedTableName;
    } while (lastEvaluatedTableName);

    return tableNames;
  }

  private async getBackupData(dynamoDBClient: DynamoDBClient): Promise<{backupCount: number, totalBackupSize: number}> {
    try {
      const command = new ListBackupsCommand({});
      const response = await dynamoDBClient.send(command);
      const backups = response.BackupSummaries || [];

      let totalBackupSizeBytes = backups.reduce((acc, curr) => acc + (curr.BackupSizeBytes || 0), 0);
      let totalBackupSizeMB = totalBackupSizeBytes;

      return {
        backupCount: backups.length,
        totalBackupSize: totalBackupSizeMB
      };
    } catch (error) {
      console.error(`Failed to get DynamoDB backup data: ${error}`);
      return { backupCount: 0, totalBackupSize: 0 };
    }
  }
}
