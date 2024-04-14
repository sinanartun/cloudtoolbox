import * as vscode from 'vscode';
import { SNSClient, ListTopicsCommand, ListSubscriptionsCommand } from "@aws-sdk/client-sns";
import { RegionProvider, RegionObserver } from "../providers/RegionProvider";
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { ProfileProvider } from '../providers/ProfileProvider';

export class SNSExplorer implements RegionObserver {
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
            console.error(`Failed to initialize regions: ${error}`);
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
            const snsClient = new SNSClient({ region, credentials });
            const topicCount = await this.getTopicCount(snsClient);
            const subscriptionCount = await this.getSubscriptionCount(snsClient);
            const confirmedSubscriptionCount = await this.getConfirmedSubscriptionCount(snsClient);
            return [region, topicCount, subscriptionCount, confirmedSubscriptionCount];
        }));

        return chartData;
    }

    private async getTopicCount(snsClient: SNSClient): Promise<number> {
        try {
            const command = new ListTopicsCommand({});
            const response = await snsClient.send(command);
            return response.Topics ? response.Topics.length : 0;
        } catch (error) {
            console.error(`Failed to get SNS topic count: ${error}`);
            return 0;
        }
    }

    private async getSubscriptionCount(snsClient: SNSClient): Promise<number> {
        try {
            const command = new ListSubscriptionsCommand({});
            const response = await snsClient.send(command);
            return response.Subscriptions ? response.Subscriptions.length : 0;
        } catch (error) {
            console.error(`Failed to get SNS subscription count: ${error}`);
            return 0;
        }
    }

    private async getConfirmedSubscriptionCount(snsClient: SNSClient): Promise<number> {
        try {
            const command = new ListSubscriptionsCommand({});
            const response = await snsClient.send(command);
            // Filter subscriptions to count only those that are confirmed
            const confirmedSubscriptions = response.Subscriptions?.filter(sub => sub.SubscriptionArn !== "PendingConfirmation");
            return confirmedSubscriptions ? confirmedSubscriptions.length : 0;
        } catch (error) {
            console.error(`Failed to get confirmed SNS subscription count: ${error}`);
            return 0;
        }
    }
}
