import * as vscode from 'vscode';
import {
  S3Client,
  ListBucketsCommand,
  GetBucketLocationCommand,
} from "@aws-sdk/client-s3";
import { RegionProvider, RegionObserver } from "../providers/RegionProvider";
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { ProfileProvider } from '../providers/ProfileProvider';
import { AwsCredentialIdentityProvider } from '@smithy/types';
interface BucketCounts {
  [key: string]: number; // This index signature states that any string key returns a number
}
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
        
    }
  }
  

  public async getChartData(): Promise<(string | number)[][]> {
    if (!this.selectedProfile) {
        console.error("No AWS profile selected.");
        return [['No Profile', 0]];
    }
    const credentials = fromIni({ profile: this.selectedProfile });
    const s3ClientGlobal = new S3Client({ credentials, region: 'us-east-1' });

    const allBuckets = await this.getS3Data(s3ClientGlobal);

    // Initialize bucketCounts with an index signature
    const bucketCounts: BucketCounts = this.selectedRegions.reduce((acc, region) => {
        acc[region] = allBuckets.filter(bucket => bucket.region === region).length;
        return acc;
    }, {} as BucketCounts); // Casting as BucketCounts to satisfy TypeScript

    const results = Object.keys(bucketCounts).map(region => [region, bucketCounts[region]]);
    return results;
}

private async getS3Data(s3Client: S3Client): Promise<any[]> {
  try {
      const bucketResponse = await s3Client.send(new ListBucketsCommand({}));
      const bucketData = await Promise.all(bucketResponse.Buckets?.map(async (bucket) => {
          const locationResponse = await s3Client.send(new GetBucketLocationCommand({ Bucket: bucket.Name }));
          const bucketRegion = locationResponse.LocationConstraint || 'us-east-1'; // Defaulting to 'us-east-1'
          return {
              bucketName: bucket.Name,
              region: bucketRegion
          };
      }) || []);

      return bucketData;
  } catch (error) {
      console.error(`Failed to get S3 data: ${error}`);
      return [];
  }
}


public async drillDown(args: {region: string, type: string}): Promise<any> {
  const regionName = args.region;
  const credentials = fromIni({ profile: this.selectedProfile });
  const s3Client = new S3Client({ region: regionName, credentials });
  if (args.type === 'bucket') {
    const s3Promise = s3Client.send(new ListBucketsCommand({}));
    const [buckets] = await Promise.all([s3Promise]);
    const data = buckets.Buckets?.map(bucket => bucket);
    return {data, args};

  }

}



}
