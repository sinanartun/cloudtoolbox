import * as vscode from "vscode";
import { ProfileProvider } from "./providers/ProfileProvider";
import { RegionProvider } from "./providers/RegionProvider";
import { ServiceProvider } from "./providers/ServiceProvider";
import { WebViewProvider } from "./providers/WebViewProvider";


const globalStorageKey = 'cloudtoolbox';


export async function activate(context: vscode.ExtensionContext): Promise<void> {


    // Initialize the providers
    const profileProvider = await ProfileProvider.getInstance(context);
    const regionProvider = await RegionProvider.getInstance(context);

    // Set RegionProvider to ProfileProvider
    profileProvider.setRegionProvider(regionProvider);

    // Additional providers
    const serviceProvider = new ServiceProvider();
    const webViewProvider = new WebViewProvider(context);

    // Register Tree Data Providers
    registerTreeDataProviders(profileProvider, regionProvider, serviceProvider);

    // Register Commands
    registerCommands(context, profileProvider, regionProvider, webViewProvider);
}

function registerTreeDataProviders(
    profileProvider: ProfileProvider,
    regionProvider: RegionProvider,
    serviceProvider: ServiceProvider,
): void {
    vscode.window.registerTreeDataProvider("awsProfileSelector", profileProvider);
    vscode.window.registerTreeDataProvider("awsRegionSelector", regionProvider);
    vscode.window.registerTreeDataProvider("awsServiceSelector", serviceProvider);
}

function registerCommands(
    context: vscode.ExtensionContext,
    profileProvider: ProfileProvider,
    regionProvider: RegionProvider,
    viewProvider: WebViewProvider,
): void {
    const commands = [
        {
            name: "cloudtoolbox.changeProfile",
            callback: async (selectedProfile: string): Promise<void> => {
                if (!selectedProfile || selectedProfile.trim().length === 0) {
                    vscode.window.showErrorMessage("No AWS profile selected. Please select a profile and try again.");
                    return;
                }

                const selectedRegions: string[] | undefined = await regionProvider.getSelectedRegions();
                if (!selectedRegions || selectedRegions.length === 0) {
                    vscode.window.showErrorMessage("No AWS region selected. Please select at least one region and try again.");
                    return;
                }
                profileProvider.changeProfile(selectedProfile.trim());
            }
        },
        {
            name: "cloudtoolbox.toggleRegion",
            callback: (regionName: string): void => {
                if (!regionName) {
                    vscode.window.showErrorMessage("Region name not provided.");
                    return;
                }
                regionProvider.toggleRegion(regionName);
            }
        },
        {
            name: "cloudtoolbox.toggleGroup",
            callback: (category: string): void => {
                if (!category) {
                    vscode.window.showErrorMessage("Category not provided.");
                    return;
                }
                regionProvider.toggleGroup(category);
            }
        },
        {
            name: "cloudtoolbox.clearAllRegions",
            callback: (): void => {
                regionProvider.clearAllRegions();
            }
        },
        {
            name: "cloudtoolbox.selectAllRegions",
            callback: (): void => {
                regionProvider.selectAllRegions(false);
            }
        },
        {
            name: "cloudtoolbox.refreshAwsProfileSelector",
            callback: (): void => {
                profileProvider.refresh();
            }
        },
        {
            name: "cloudtoolbox.showVPC",
            callback: async (): Promise<void> => {
                await viewProvider.showWebview('VPC');
            }
        },
        {
            name: "cloudtoolbox.showEC2",
            callback: async (): Promise<void> => {
                await viewProvider.showWebview('EC2');
            }
        },
        {
            name: "cloudtoolbox.showLambda",
            callback: async (): Promise<void> => {
                await viewProvider.showWebview('Lambda');
            }
        },
        {
            name: "cloudtoolbox.showS3",
            callback: async (): Promise<void> => {
                await viewProvider.showWebview('S3');
            }
        },
        {
            name: "cloudtoolbox.showRDS",
            callback: (): void => {
                viewProvider.showWebview('RDS');
            }
        },
        {
            name: "cloudtoolbox.showDynamoDB",
            callback: (): void => {
                viewProvider.showWebview('DynamoDB');
            }
        },
        {
            name: "cloudtoolbox.showECS",
            callback: (): void => {
                viewProvider.showWebview('ECS');
            }
        },
        {
            name: "cloudtoolbox.showECR",
            callback: (): void => {
                viewProvider.showWebview('ECR');
            }
        },
        {
            name: "cloudtoolbox.showRedshift",
            callback: (): void => {
                viewProvider.showWebview('Redshift');
            }
        },
        {
            name: "cloudtoolbox.showSNS",
            callback: (): void => {
                viewProvider.showWebview('SNS');
            }
        },
        {
            name: "cloudtoolbox.showIAM",
            callback: (): void => {
                viewProvider.showWebview('IAM');
            }
        },
    ];

    commands.forEach(({ name, callback }) => {
        const disposable = vscode.commands.registerCommand(name, (arg1: any) => {
            callback(arg1);
            
        });
        context.subscriptions.push(disposable);
    });
    
}


export function deactivate(): void {}




