import * as vscode from 'vscode';
import { EventBridgeClient, ListRulesCommand, ListEventBusesCommand } from '@aws-sdk/client-eventbridge';
import { PipesClient, ListPipesCommand } from '@aws-sdk/client-pipes'; // Import the PipesClient and commands
import { RegionProvider, RegionObserver } from '../providers/RegionProvider';
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { ProfileProvider } from '../providers/ProfileProvider';
import { noservice } from './noservice';
import { ListSchedulesCommand, SchedulerClient } from '@aws-sdk/client-scheduler';

export class EventBridgeExplorer implements RegionObserver {
  private selectedRegions: string[] = [];
  private selectedProfile: string | undefined;

  constructor(private context: vscode.ExtensionContext) {
    this.initialize().catch((error) => console.error(`Failed to initialize ${this.constructor.name}: ${error}`));
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
    const data = await Promise.all(
      this.selectedRegions.map(async (region) => {
        const eventBridgeClient = new EventBridgeClient({ region, credentials });

        const rulesCommand = new ListRulesCommand({});
        const busesCommand = new ListEventBusesCommand({});

        try {
          const [rulesResponse, busesResponse, pipesCount, schedulerCount] = await Promise.all([
            eventBridgeClient.send(rulesCommand),
            eventBridgeClient.send(busesCommand),
            this.getPipesCount(region, credentials),
            this.getSchedulerCount(region, credentials),
          ]);

          return [region, rulesResponse.Rules?.length || 0, busesResponse.EventBuses?.length || 0, pipesCount, schedulerCount];
        } catch (error) {
          console.error(`Failed to get EventBridge data for region ${region}: ${error}`);
          return [region, 0, 0, 0, 0];
        }
      }),
    );

    return data;
  }

  private async getPipesCount(region: string, credentials: any): Promise<number> {
    try {
      if (noservice[region]?.includes('pipes')) {
        return 0;
      }
      const pipesClient = new PipesClient({ region, credentials }); // Initialize the PipesClient
      const pipesCommand = new ListPipesCommand({});
      const response = await pipesClient.send(pipesCommand);

      return response.Pipes?.length || 0;
    } catch (error) {
      console.error(`Failed to get Redshift Serverless workgroup count in ${region}: ${error}`);
      return 0;
    }
  }

  private async getSchedulerCount(region: string, credentials: any): Promise<number> {
    try {
      if (noservice[region]?.includes('scheduler')) {
        return 0;
      }
      const schedulerClient = new SchedulerClient({ region, credentials });
      const schedulesCommand = new ListSchedulesCommand({});
      const response = await schedulerClient.send(schedulesCommand);

      return response.Schedules?.length || 0;
    } catch (error) {
      console.error(`Failed to get Redshift Serverless workgroup count in ${region}: ${error}`);
      return 0;
    }
  }
}
