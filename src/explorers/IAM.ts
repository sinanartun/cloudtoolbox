import * as vscode from 'vscode';
import { IAMClient, ListUsersCommand, ListRolesCommand, ListGroupsForUserCommand, ListAttachedUserPoliciesCommand, GetUserCommand } from "@aws-sdk/client-iam";
import { CloudTrailClient, LookupEventsCommand, LookupEventsCommandInput } from "@aws-sdk/client-cloudtrail";


import { RegionProvider, RegionObserver } from "../providers/RegionProvider";
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { ProfileProvider } from '../providers/ProfileProvider';

export class IAMExplorer implements RegionObserver {
  private selectedRegions: string[] = [];
  private cloudTrailClient!: CloudTrailClient;
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
      console.error(`Failed to initialize CloudTrailClient: ${error}`);
    }
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
        console.log(`Updated AWS profile in ${this.constructor.name}: ${newProfile}`);

    }
  }

  public async getChartData(): Promise<any[]> {
    if (this.selectedRegions.length === 0) {
      vscode.window.showWarningMessage('No region selected. Please select a region on Sidebar');
      return [];
    }

    const credentials = fromIni({ profile: this.selectedProfile });

    const globalRegion = 'us-east-1';
    const iamClient = new IAMClient({ region: globalRegion, credentials });
    this.cloudTrailClient = new CloudTrailClient({ region: globalRegion, credentials });

    const users = await this.getIAMUser(iamClient);
    const roles = await this.getIAMRole(iamClient);

    return [users,roles];

  }


  private async getUserLastAction( userName: string): Promise<string[]> {
    try {
      const params: LookupEventsCommandInput = {
        LookupAttributes: [
          {
            AttributeKey: 'Username',
            AttributeValue: userName,
          },
        ],
        MaxResults: 1,
      };
  
      const command = new LookupEventsCommand(params);
      const response = await this.cloudTrailClient.send(command);
      console.log('last action',response);
      if (!response.Events || response.Events.length === 0) {
        return ['No action found', 'N/A'];
      }
  
      const lastEvent = response.Events[0];
      const eventName = lastEvent.EventName || 'Unknown Event';
      return [eventName, this.formatDate(lastEvent.EventTime)];
    } catch (error) {
      console.error(`Failed to get last action for ${userName}: ${error}`);
      return ['Error fetching last action'];
    }
  }

  private async getIAMUserDetails(iamClient: IAMClient, userName: string): Promise<{groups: string, attachedPolicies: string, lastUsed: string, lastAction:string}> {
    try {
      
      const groupsCommand = new ListGroupsForUserCommand({ UserName: userName });
      const groupsResponse = await iamClient.send(groupsCommand);
      const groups = groupsResponse.Groups?.map(group => group.GroupName).join(',\n') || 'No group';
      
      
      const policiesCommand = new ListAttachedUserPoliciesCommand({ UserName: userName });
      const policiesResponse = await iamClient.send(policiesCommand);
        const attachedPolicies = policiesResponse.AttachedPolicies?.map(policy => policy.PolicyName).join(',\n') || 'No attached policies';

        const userCommand = new GetUserCommand({ UserName: userName });
        const userResponse = await iamClient.send(userCommand);
        const lastUsed = userResponse.User?.PasswordLastUsed ? 
              this.formatDate(userResponse.User.PasswordLastUsed) : 'Never Used';

        const la = await this.getUserLastAction(userName);
        const lastAction = JSON.stringify(la);
      return { 
        groups, 
        attachedPolicies,
        lastUsed,
        lastAction
      };
  
    } catch (error) {
      console.error(`Failed to get IAM user details for ${userName}: ${error}`);
      return { groups: 'Error fetching groups', attachedPolicies: 'Error fetching attached policies', lastUsed: 'Error fetching last used', lastAction: 'Error fetching last action'};
    }
  }
  

  private async getIAMUser(iamClient: IAMClient): Promise<string[][]> {
    try {
      const command = new ListUsersCommand({});
      const response = await iamClient.send(command);
      if (!response.Users || response.Users.length < 1) {
        return [['No users found', 'N/A', 'N/A', 'N/A', 'N/A']];
      }
  
      
      const usersWithDetails = await Promise.all(response.Users.map(async user => {
        const { groups, attachedPolicies, lastUsed, lastAction } = await this.getIAMUserDetails(iamClient, user.UserName || '');
        return [
          user.UserName || 'N/A',
          this.formatDate(user.CreateDate) || 'N/A',
          groups,
          attachedPolicies,
          lastUsed,
          lastAction
        ];
      }));
  
      return usersWithDetails;
    } catch (error) {
      console.error(`Failed to get IAM user count: ${error}`);
      return [['No users found', 'N/A', 'N/A', 'N/A', 'N/A']];
    }
  }
  

  private async getIAMRole(iamClient: IAMClient): Promise<string[][]> {
    try {
      const command = new ListRolesCommand({});
      const response = await iamClient.send(command);
      if (!response.Roles || response.Roles.length < 1) {
        return [['No Roles found', 'N/A', 'N/A', 'N/A']];
      }
      return response.Roles.map(role => [
        role.RoleName || 'N/A', 
        this.formatDate(role.CreateDate) || 'N/A', 
        role.MaxSessionDuration?.toString() || 'N/A', 
        role.Description || 'N/A'
      ]);
      
    } catch (error) {
      console.error(`Failed to get IAM role count: ${error}`);
      return [['No Roles found', 'N/A', 'N/A', 'N/A']];
    }
  }
}
