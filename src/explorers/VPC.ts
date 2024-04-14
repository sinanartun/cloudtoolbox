import * as vscode from 'vscode';
import { 
  EC2Client, 
  DescribeVpcsCommand, 
  DescribeSubnetsCommand, 
  DescribeRouteTablesCommand, 
  DescribeInternetGatewaysCommand, 
  DescribeNatGatewaysCommand,
  DescribeVpcPeeringConnectionsCommand 
} from "@aws-sdk/client-ec2";
import { RegionProvider, RegionObserver } from "../providers/RegionProvider";
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { ProfileProvider } from '../providers/ProfileProvider';

export class VpcExplorer implements RegionObserver{
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
    if (this.selectedRegions.length === 0) {
      vscode.window.showWarningMessage('No region selected. Please select a region on Sidebar');
      return [];
    }
    
    const credentials = fromIni({ profile: this.selectedProfile });
    const chartData = await Promise.all(this.selectedRegions.map(async (region) => {
      const ec2Client = new EC2Client({ region, credentials });
      const [vpc] = await Promise.all([
        this.getVpcData(ec2Client),

      ]);
      return [region, vpc.vpc, vpc.subnet, vpc.routeTable, vpc.internetGateway, vpc.natGateway, vpc.peeringConnection];
    }));

    return chartData;
  }


  private async getVpcData(ec2: EC2Client): Promise<{
    vpc: number;
    subnet: number;
    routeTable: number;
    internetGateway: number;
    natGateway: number;
    peeringConnection: number;
  }> {
    try {
      // Initialize all the required describe commands
      const vpcsPromise = ec2.send(new DescribeVpcsCommand({}));
      const subnetsPromise = ec2.send(new DescribeSubnetsCommand({}));
      const routeTablesPromise = ec2.send(new DescribeRouteTablesCommand({}));
      const internetGatewaysPromise = ec2.send(new DescribeInternetGatewaysCommand({}));
      const natGatewaysPromise = ec2.send(new DescribeNatGatewaysCommand({}));
      const peeringConnectionsPromise = ec2.send(new DescribeVpcPeeringConnectionsCommand({}));
  
      // Await all promises to resolve
      const [
        vpcsResponse, 
        subnetsResponse, 
        routeTablesResponse, 
        internetGatewaysResponse,
        natGatewaysResponse,
        peeringConnectionsResponse
      ] = await Promise.all([
        vpcsPromise, 
        subnetsPromise, 
        routeTablesPromise, 
        internetGatewaysPromise,
        natGatewaysPromise,
        peeringConnectionsPromise
      ]);
  
      // Extract and count the resources from the responses
      const vpc = vpcsResponse.Vpcs?.length ?? 0;
      const subnet = subnetsResponse.Subnets?.length ?? 0;
      const routeTable = routeTablesResponse.RouteTables?.length ?? 0;
      const internetGateway = internetGatewaysResponse.InternetGateways?.length ?? 0;
      const natGateway = natGatewaysResponse.NatGateways?.length ?? 0;
      const peeringConnection = peeringConnectionsResponse.VpcPeeringConnections?.length ?? 0;
  
      return { vpc, subnet, routeTable, internetGateway, natGateway, peeringConnection };
    } catch (error) {
      console.error(`Failed to get VPC data: ${error}`);
      return { vpc: 0, subnet: 0, routeTable: 0, internetGateway: 0, natGateway: 0, peeringConnection: 0 };
    }
  }




  
}
