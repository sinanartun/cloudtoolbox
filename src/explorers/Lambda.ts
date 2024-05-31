import * as vscode from 'vscode';
import { LambdaClient, ListFunctionsCommand, ListLayersCommand, GetFunctionCommand } from "@aws-sdk/client-lambda";
import { ServerlessApplicationRepositoryClient, ListApplicationsCommand } from "@aws-sdk/client-serverlessapplicationrepository";
import { noservice } from './noservice';
import { RegionProvider, RegionObserver } from '../providers/RegionProvider';
import { ProfileProvider, ProfileObserver } from '../providers/ProfileProvider';
import { fromIni } from '@aws-sdk/credential-provider-ini';


export class LambdaExplorer {
    private selectedRegions: string[] = [];
    private selectedProfile: string | undefined;


    constructor(private context: vscode.ExtensionContext) {

        this.initialize().catch(error => console.error(`Failed to initialize ${this.constructor.name}: ${error}`));
    }

    private async initialize() {
        try {
            const regionProvider =  await RegionProvider.getInstance(this.context);
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
            
            this.refreshData();
        }
    }

    public async getChartData(): Promise<any[]> {
        const data: any[] = [];
        const credentials = fromIni({ profile: this.selectedProfile });

        for (const region of this.selectedRegions) {
            const lambda = new LambdaClient({ region, credentials});
            const { functionCount, codeStorage } = await this.getLambdaFunctionCountAndCodeStorage(lambda);
            const layers = await this.getLayerCount(lambda);
            const applications = await this.getServerlessApplicationCount(region);

            
            data.push([region, functionCount,layers, applications, codeStorage]);
        }

        return data;
    }


    public async drillDown(args: {region: string, type: string}): Promise<any> {
        const regionName = args.region;
        const credentials = fromIni({ profile: this.selectedProfile });
        const lambdaClient = new LambdaClient({ region: regionName, credentials });
        if (args.type === 'function') {

          const [lambda] = await Promise.all([lambdaClient.send(new ListFunctionsCommand({}))]);
          const data = lambda.Functions?.map(lambda => lambda);
          console.log(data);
          return {data, args};
    
        }else if (args.type ==='application') {
            if (noservice[args.region]?.includes('serverlessrepo')) {
                 return {data:[], args};
            }
            const sarClient = new ServerlessApplicationRepositoryClient({ region:args.region, credentials });
            const [serverlessApp] = await Promise.all([sarClient.send(new ListApplicationsCommand({}))]);
            const data = serverlessApp.Applications?.map(application => application);
          
          return {data, args};
        }else if (args.type ==='layer') {
          const [layer] = await Promise.all([lambdaClient.send(new ListLayersCommand({}))]);
          const data = layer.Layers?.map(layer => layer);
          return {data, args};
        }
    
    
      }
    

    private async getLambdaFunctionCountAndCodeStorage(lambda: LambdaClient): Promise<{ functionCount: number, codeStorage: number }> {
        try {
            const command = new ListFunctionsCommand({});
            const response = await lambda.send(command);
            let functionCount = 0;
            let totalSize = 0;
    
            if (response.Functions) {
                functionCount = response.Functions.length;
    
                for (const func of response.Functions) {
                    const getFunctionCommand = new GetFunctionCommand({ FunctionName: func.FunctionName });
                    const functionResponse = await lambda.send(getFunctionCommand);
                    totalSize += functionResponse.Configuration?.CodeSize || 0;
                }
            }
            const codeStorage = parseFloat((totalSize / 1024).toFixed(2));
    
            return { functionCount, codeStorage };
        } catch (error) {
            console.error(`Failed to get Lambda function count and code storage: ${error}`);
            return { functionCount: 0, codeStorage: 0 };
        }
    }

    private async getLayerCount(lambda: LambdaClient): Promise<number> {
        try {
            const command = new ListLayersCommand({});
            const response = await lambda.send(command);
            
            return response.Layers ? response.Layers.length : 0;
        } catch (error) {
            console.error(`Failed to get Lambda layer count: ${error}`);
            return 0;
        }
    }

    private async getServerlessApplicationCount(region: string): Promise<number> {
        if (noservice[region]?.includes('serverlessrepo')) {
            return 0;
        }
        try {
            const sar = new ServerlessApplicationRepositoryClient({ region });
            const command = new ListApplicationsCommand({});
            const response = await sar.send(command);
            return response.Applications ? response.Applications.length : 0;
        } catch (error) {
            console.error(`Failed to get application count: ${error}`);
            return 0;
        }
    }

    public async refreshData(): Promise<void> {
        
        
       
    }
    


}