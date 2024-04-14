import * as vscode from 'vscode';
import * as ini from 'ini';
import * as os from 'os';
import * as path from 'path';
import { RegionProvider } from './RegionProvider'; // Ensure path is correct
import { out } from './log';

export class Profile extends vscode.TreeItem {
    constructor(label: string, public readonly profileName: string, isSelected: boolean) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.contextValue = 'profile';
        this.command = {
            command: 'cloudtoolbox.changeProfile',
            title: 'Change Profile',
            arguments: [this.profileName]
        };
        
        const iconName = isSelected ? '_green' : '';
        this.iconPath = {
            light: path.join(__dirname, 'images', `User_Light${iconName}.png`),
            dark:  path.join(__dirname, 'images', `User_Dark${iconName}.png` ),
        };
    }
}

export interface ProfileObserver {
    onProfileChanged(newProfile: string): void;
}

export class ProfileProvider implements vscode.TreeDataProvider<Profile> {
    
    private static instance: ProfileProvider;
    private observers: ProfileObserver[] = [];
    private _onDidChangeTreeData: vscode.EventEmitter<Profile | undefined | void> = new vscode.EventEmitter<Profile | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<Profile | undefined | void> = this._onDidChangeTreeData.event;

    public selectedProfile?: string;
    private regionProvider?: RegionProvider;

    private constructor(private context: vscode.ExtensionContext) {


    }

    async getChildren(element?: Profile): Promise<Profile[]> {
        if (element) {return [];}
        
        const profiles = await this.loadAwsProfiles();
        return profiles.map(profile => new Profile(profile, profile, profile === this.selectedProfile));
    }

    getTreeItem(element: Profile): vscode.TreeItem {
        return element;
    }


    public static async getInstance(context: vscode.ExtensionContext): Promise<ProfileProvider> {
        if (!ProfileProvider.instance) {
            ProfileProvider.instance = new ProfileProvider(context);
            await ProfileProvider.instance.selectDefaultProfile();
        }
        return ProfileProvider.instance;
    }

    setRegionProvider(regionProvider: RegionProvider) {
        this.regionProvider = regionProvider;
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    

    public registerObserver(observer: ProfileObserver): void {
        this.observers.push(observer);
    }

    public notifyObservers(): void {
        this.observers.forEach(observer => observer.onProfileChanged(this.selectedProfile || ''));
    }

    async loadAwsProfiles(): Promise<string[]> {
        const credentialsPath = vscode.Uri.joinPath(vscode.Uri.file(os.homedir()), '.aws', 'credentials');
    
        try {
            // Read the file using VS Code's filesystem API
            const credentialsFileUint8Array = await vscode.workspace.fs.readFile(credentialsPath);
            // Convert Uint8Array to string
            const credentialsFile = Buffer.from(credentialsFileUint8Array).toString('utf-8');
            // Parse the credentials file
            const credentials = ini.parse(credentialsFile);
            console.log(`Loaded AWS profiles: ${Object.keys(credentials).join(', ')}`);
            return Object.keys(credentials);
        } catch (error) {
            console.error(`Error loading AWS profiles: ${error instanceof Error ? error.message : String(error)}`);
            return [];
        }
    }

    public getSelectedProfile(): string | undefined {
        return this.selectedProfile;
    }

    async selectDefaultProfile(): Promise<void> {
        const storedProfile = this.context.globalState.get<string>('selectedProfile');
        console.log(`Stored profile: ${storedProfile}`);
        const profiles = await this.loadAwsProfiles();
        this.selectedProfile = storedProfile && profiles.includes(storedProfile) ? storedProfile : (profiles.length > 0 ? profiles[0] : undefined);
        if (this.selectedProfile) {
            out(`Default AWS profile selected: ${this.selectedProfile}`);
        } else {
            out('No AWS profiles found.');
        }
        this.notifyObservers();
        this.refresh();
    }

    async changeProfile(newProfileName: string): Promise<void> {
        
        if (!newProfileName) {
            vscode.window.showErrorMessage(`Invalid profile name: "${newProfileName}"`);
            return;
        }

        if (this.selectedProfile === newProfileName) {
            out(`Profile "${newProfileName}" is already selected.`);
            return;
        }

        this.selectedProfile = newProfileName;
        out(`Profile changed to: "${newProfileName}"`);

       
        this.context.globalState.update('selectedProfile', newProfileName);
        

        if (this.regionProvider) {
            try {
                await this.regionProvider.onProfileChanged();
            } catch (error) {
                out(`Error updating AWS credentials: ${error instanceof Error ? error.message : String(error)}`);
            }
        } else {
            console.log('RegionProvider not set in ProfileProvider. Unable to propagate profile change.');
        }
        this.notifyObservers();
        this.refresh(); 
    }
}
