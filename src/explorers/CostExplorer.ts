import * as vscode from 'vscode';
import { CostExplorerClient, Dimension, GetCostAndUsageCommand, Granularity, GroupDefinitionType } from "@aws-sdk/client-cost-explorer";

import { RegionProvider, RegionObserver } from "../providers/RegionProvider";
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { ProfileProvider } from '../providers/ProfileProvider';
import { dd } from './CostData';

export class CostExplorer implements RegionObserver {
  private selectedRegions: string[] = [];
  private selectedProfile: string | undefined;
  private costExplorerClient!: CostExplorerClient;

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
      console.error(`Failed to initialize : ${error}`);
    }
  }

  private isCacheValid(cacheKey: string, maxAgeMinutes: number): boolean {
    const cacheEntry = this.context.globalState.get(cacheKey) as { timestamp: number; data: any[] } | undefined;
    if (!cacheEntry) {
      return false;
    }
    const age = (Date.now() - cacheEntry.timestamp) / 1000 / 60;
    return age < maxAgeMinutes;
  }

  public formatDate(createdDate: string | number | Date | undefined) {
    if (!createdDate) {
      return '';
    }
    
    const date = new Date(createdDate);
    const now = new Date().getTime(); 
    const diffTime = Math.abs(now - date.getTime()); 
    
    
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    
    const formattedDate = date.toISOString().replace('T', ' ').slice(0, 19);
  
    
    let timeAgo = '';
    if (diffDays > 1) {
      timeAgo = `${diffDays}\ndays ago`;
    } else if (diffHours > 1) {
      timeAgo = `${diffHours}\nhours ago`;
    } else if (diffMinutes > 1) {
      timeAgo = `${diffMinutes}\nminutes ago`;
    } else {
      timeAgo = '\njust now';
    }
  
    return `${formattedDate} (${timeAgo})`;
  }

  public onRegionSelectionChanged(selectedRegions: Set<string>): void {
    this.selectedRegions = Array.from(selectedRegions);
  }


  public onProfileChanged(newProfile: string): void {
    if (this.selectedProfile !== newProfile) {
        this.selectedProfile = newProfile;
        

    }
  }

  public getFormattedDate(): string {
    const date = new Date();
    const year = date.getFullYear(); 
    let month = date.getMonth() + 1; 
    let day = date.getDate(); 

    
    const month_s = String(month < 10 ? '0' + month : month);
    const day_s= String(day < 10 ? '0' + day : day);

    
    return `${year}-${month_s}-${day_s}`;
  }


  public async getFirstDayTwoMonthsAgoUTC() {
    const now = new Date(); 
    
    const utcYear = now.getUTCFullYear();
    const utcMonth = now.getUTCMonth();

    
    const twoMonthsAgo = new Date(Date.UTC(utcYear, utcMonth - 2, 1));

    
    const year = twoMonthsAgo.getUTCFullYear(); 
    const month = twoMonthsAgo.getUTCMonth() + 1; 
    const formattedMonth = month < 10 ? '0' + month : month; 

    return `${year}-${formattedMonth}-01`; 
}

public async getFirstDayOneYearAgoUTC() {
  const now = new Date(); 
  
  const utcYear = now.getUTCFullYear();
  const utcMonth = now.getUTCMonth();

  
  const twoMonthsAgo = new Date(Date.UTC(utcYear-1, utcMonth, 1));

  
  const year = twoMonthsAgo.getUTCFullYear(); 
  const month = twoMonthsAgo.getUTCMonth() + 1; 
  const formattedMonth = month < 10 ? '0' + month : month; 

  return `${year}-${formattedMonth}-01`; 
}


  public async getChartData(): Promise<any[]> {
    if (this.selectedRegions.length === 0) {
      vscode.window.showWarningMessage('No region selected. Please select a region on Sidebar');
      return [];
    }



    const credentials = fromIni({ profile: this.selectedProfile });

    const globalRegion = 'us-east-1';

    this.costExplorerClient = new CostExplorerClient({ region: globalRegion, credentials });

    const today = this.getFormattedDate();
    const firstDayTwoMonthsAgo = await this.getFirstDayTwoMonthsAgoUTC();
    // const firstDayOneYearAgo = await this.getFirstDayOneYearAgoUTC();
    const costDataDaily = await this.getCostData(firstDayTwoMonthsAgo,today, Granularity.DAILY);
    // const costDataMonthly = await this.getCostData(firstDayOneYearAgo,today, Granularity.MONTHLY);


    return [costDataDaily];

  }


  public async getCostData(startDate: string, endDate: string, Granularity: Granularity): Promise<any[]> {

    const cacheKey = `costData2-${this.selectedProfile}-${startDate}-${endDate}-${Granularity}`;
    if (this.isCacheValid(cacheKey, 60 * 12)) {
      const cacheEntry = this.context.globalState.get(cacheKey) as { timestamp: number; data: any[] };
      console.log(`Using cache for ${cacheKey}`);
      return cacheEntry.data;
    }

    try {
        const params = {
            TimePeriod: {
                Start: startDate,
                End: endDate,
            },
            Granularity: Granularity,
            Metrics: ["UnblendedCost"],
            GroupBy: [
                { 
                    Type: GroupDefinitionType.DIMENSION, 
                    Key: "SERVICE" 
                }
            ],
        };

        const command = new GetCostAndUsageCommand(params);
        const data = await this.costExplorerClient.send(command);

        


        const results = data.ResultsByTime || [];
        console.log('results', results);

      await this.context.globalState.update(cacheKey, {
        timestamp: Date.now(),
        data: results,
      });

      return results;
    } catch (error) {
        console.error(`Failed to get cost data: ${error}`);
        vscode.window.showErrorMessage('Failed to retrieve cost data.');
        return [];
    }
}



}
