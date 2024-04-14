import * as vscode from 'vscode';
import { DynamoDBClient, ListTablesCommand, DescribeTableCommand, ListBackupsCommand } from "@aws-sdk/client-dynamodb";
import { RegionProvider, RegionObserver } from "../providers/RegionProvider";
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { ProfileProvider } from '../providers/ProfileProvider';

export class DynamoDBExplorer implements RegionObserver {
  private selectedRegions: string[] = [];

  constructor(private context: vscode.ExtensionContext) {
    this.initialize().catch(error => console.error(`Failed to initialize DynamoDBExplorer: ${error}`));
  }

  private async initialize() {
    try {
      const regionProvider = await RegionProvider.getInstance(this.context);
      regionProvider.registerObserver(this);
      this.selectedRegions = await regionProvider.getSelectedRegions();
    } catch (error) {
      console.error(`Failed to initialize regions: ${error}`);
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

    const selectedProfile = (await ProfileProvider.getInstance(this.context)).selectedProfile;
    const credentials = fromIni({ profile: selectedProfile });

    const chartData = await Promise.all(this.selectedRegions.map(async (region) => {
      const dynamoDBClient = new DynamoDBClient({ region, credentials });
      const tableData = await this.getTableData(dynamoDBClient);
      return [
        region, 
        tableData.tableCount, 
        tableData.totalSizeMB, 
        tableData.totalItemCount,
        tableData.backupCount, 
        tableData.totalBackupSize,
      ];
    }));

    return chartData;
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
