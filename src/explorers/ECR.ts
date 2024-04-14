import * as vscode from 'vscode';
import { ECRClient, DescribeRepositoriesCommand, DescribeImagesCommand, ImageDetail } from "@aws-sdk/client-ecr";
import { RegionProvider, RegionObserver } from "../providers/RegionProvider";
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { ProfileProvider } from '../providers/ProfileProvider';

export class ECRExplorer implements RegionObserver {
  private selectedRegions: string[] = [];
  private selectedProfile: string | undefined;

  constructor(private context: vscode.ExtensionContext) {
    this.initialize().catch(error => console.error(`Failed to initialize ${this.constructor.name}: ${error}`));
  }

  private async initialize() {
    const regionProvider = await RegionProvider.getInstance(this.context);
    regionProvider.registerObserver(this);
    this.selectedRegions = await regionProvider.getSelectedRegions();

    const profileProvider = await ProfileProvider.getInstance(this.context);
    profileProvider.registerObserver(this);
    this.selectedProfile = profileProvider.getSelectedProfile();
  }

  public onRegionSelectionChanged(selectedRegions: Set<string>): void {
    this.selectedRegions = Array.from(selectedRegions);
  }

  public onProfileChanged(newProfile: string): void {
    this.selectedProfile = newProfile;
    console.log(`Updated AWS profile in ${this.constructor.name}: ${newProfile}`);
  }

  public async getChartData(): Promise<any[]> {
    if (this.selectedRegions.length === 0) {
      vscode.window.showWarningMessage('No region selected. Please select a region on Sidebar');
      return [];
    }

    const credentials = fromIni({ profile: this.selectedProfile });

    const chartData = await Promise.all(this.selectedRegions.map(async (region) => {
      const ecrClient = new ECRClient({ region, credentials });
      const repositories = await this.getECRRepositoryData(ecrClient);
      return { region, repositories };
    }));
    console.log('ecr',chartData);
    return chartData;
  }

  private async getECRRepositoryData(ecrClient: ECRClient): Promise<{ name: string, imageCount: number, totalSize: number }[]> {
    try {
      const command = new DescribeRepositoriesCommand({});
      const { repositories } = await ecrClient.send(command);
      
      return Promise.all((repositories || []).map(async repo => {
        if (repo.repositoryName) {
          const mData = await this.getMetaDataRepository(ecrClient, repo.repositoryName);
          return { name: repo.repositoryName, imageCount:mData.imageCount, totalSize: mData.totalSize };
        }
        
        return { name: 'Unknown', imageCount: 0, totalSize: 0 };
      }));
    } catch (error) {
      console.error(`Failed to get ECR repository data: ${error}`);
      return [];
    }
  }

  private async getMetaDataRepository(ecrClient: ECRClient, repositoryName: string): Promise<{ imageCount: number, totalSize: number }> {
    try {
      const command = new DescribeImagesCommand({ repositoryName });
      const response = await ecrClient.send(command);
  
      
  
      let totalSize = 0;
      const imageCount = response.imageDetails?.length ?? 0;
  
      if (response.imageDetails) {
        totalSize = response.imageDetails.reduce((sum, image: ImageDetail) => {
          return sum + (image.imageSizeInBytes ?? 0);
        }, 0);
      }
  
      return {
        imageCount,
        totalSize 
      };
    } catch (error) {
      console.error(`Failed to get metadata for repository '${repositoryName}': ${error}`);
      return { imageCount: 0, totalSize: 0 };
    }
  }
}
