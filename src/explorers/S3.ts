import * as vscode from 'vscode';
import {
  S3Client,
  ListBucketsCommand,
  GetBucketLocationCommand,
  ListObjectsV2Command,
  ListObjectsV2Output
} from "@aws-sdk/client-s3";
import { RegionProvider, RegionObserver } from "../providers/RegionProvider";
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { ProfileProvider } from '../providers/ProfileProvider';
import { AwsCredentialIdentityProvider } from '@smithy/types';

export class S3Explorer implements RegionObserver {
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
  }

  public onProfileChanged(newProfile: string): void {
    if (this.selectedProfile !== newProfile) {
        this.selectedProfile = newProfile;
        console.log(`Updated AWS profile in ${this.constructor.name}: ${newProfile}`);
    }
  }
  

  public async getChartData(): Promise<any[]> {
    const credentials = fromIni({ profile: this.selectedProfile });
  
    
    return Promise.all(this.selectedRegions.map(async region => {
      const s3ClientGlobal = new S3Client({ credentials, region: region });
      
      
      const s3AllData = await this.getS3Data(s3ClientGlobal, credentials);
  
      
      const bucketsInRegion = s3AllData.filter(data => data.region === region);
      const bucketCount = bucketsInRegion.length;
      const totalObjectCount = bucketsInRegion.reduce((acc, curr) => acc + curr.totalObjectCount, 0);
      const totalSize = bucketsInRegion.reduce((acc, curr) => acc + curr.totalSize, 0);
  
      return [ region, bucketCount, totalObjectCount, totalSize ];
    }));
  }
  


  private async getS3Data(s3Global: S3Client, credentials: AwsCredentialIdentityProvider): Promise<any[]> {
    try {
      const bucketResponse = await s3Global.send(new ListBucketsCommand({}));
      let bucketData = [];
  
      for (const bucket of bucketResponse.Buckets ?? []) {
        const locationResponse = await s3Global.send(new GetBucketLocationCommand({ Bucket: bucket.Name }));
        let bucketRegion = locationResponse.LocationConstraint || 'us-east-1';
        if (bucketRegion === '') {
          bucketRegion = 'us-east-1';
        }
        const s3BucketSpecific = new S3Client({ region: bucketRegion, credentials: credentials});
  
        let totalObjectCount = 0;
        let totalSize = 0;
        let continuationToken: string | undefined = undefined;
  
        do {
          
          const objectsResponse: ListObjectsV2Output = await s3BucketSpecific.send(new ListObjectsV2Command({
            Bucket: bucket.Name,
            ContinuationToken: continuationToken,
          }));
  
          
          
          
        } while (continuationToken);
  
        bucketData.push({
          bucketName: bucket.Name,
          region: bucketRegion,
          
          
        });
      }
  
      return bucketData;
    } catch (error) {
      console.error(`Failed to get S3 data: ${error}`);
      return [];
    }
  }



}
