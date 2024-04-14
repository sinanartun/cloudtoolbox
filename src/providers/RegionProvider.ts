import * as vscode from 'vscode';
import { EventEmitter, Event } from 'vscode';
import { EC2Client, DescribeRegionsCommand, Region } from '@aws-sdk/client-ec2';
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { out } from './log';
import { regionCategoryMapping } from '../classes/regionCategoryMapping';
import { ProfileProvider } from './ProfileProvider';

interface RegionCategory {
  category: string;
  region: string;
}

export interface RegionObserver {
  onRegionSelectionChanged(selectedRegions: Set<string>): void;
}

export class RegionProvider implements vscode.TreeDataProvider<RegionCategory> {
  private static instancePromise: Promise<RegionProvider>;
  private _onDidChangeTreeData: vscode.EventEmitter<void | RegionCategory | RegionCategory[] | null | undefined> = new vscode.EventEmitter<
    void | RegionCategory | RegionCategory[] | null | undefined
  >();
  readonly onDidChangeTreeData: vscode.Event<void | RegionCategory | RegionCategory[] | null | undefined> = this._onDidChangeTreeData.event;
  private _onDidFinish: EventEmitter<void> = new EventEmitter<void>();
  readonly onDidFinish: Event<void> = this._onDidFinish.event;
  private _regions: string[] = [];
  public selectedRegions: Set<string> = new Set();
  private profileProvider?: ProfileProvider;
  private regionCategoryMapping: Map<string, string>;
  private observers: RegionObserver[] = [];

  private constructor(private context: vscode.ExtensionContext) {
    this.regionCategoryMapping = regionCategoryMapping;
    this.initialize = this.initialize.bind(this);
    this.clearAllRegions = this.clearAllRegions.bind(this);
    this.toggleRegion = this.toggleRegion.bind(this);
    this.selectAllRegions = this.selectAllRegions.bind(this);
    this.toggleGroup = this.toggleGroup.bind(this);
    this.fetchRegions = this.fetchRegions.bind(this);
    this.refresh = this.refresh.bind(this);
    this.getSelectedRegions = this.getSelectedRegions.bind(this);
  }

  private async initialize(): Promise<RegionProvider> {
    this.profileProvider = await ProfileProvider.getInstance(this.context);
    await this.fetchRegions();
    this.restoreSelectedRegions();
    this._onDidFinish.fire();
    return this;
  }

  public registerObserver(observer: RegionObserver): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  private notifyObservers(): void {
    for (const observer of this.observers) {
      observer.onRegionSelectionChanged(new Set(this.selectedRegions));
    }
  }

  public static getInstance(context: vscode.ExtensionContext): Promise<RegionProvider> {
    if (!RegionProvider.instancePromise) {
      const provider = new RegionProvider(context);
      RegionProvider.instancePromise = provider.initialize();
    }
    return RegionProvider.instancePromise;
  }

  get regions(): string[] {
    return [...this._regions].sort();
  }

  set regions(value: string[]) {
    this._regions = value;
  }

  private async saveSelectedRegions(): Promise<void> {
    if (!this.profileProvider) {
      console.error('ProfileProvider is not initialized.');
      return;
    }
    const selectedProfile = this.profileProvider.getSelectedProfile();
    if (!selectedProfile) {
      console.error('No selected profile available to restore regions.');
      return;
    }

    const profileKey = `selectedRegions_${selectedProfile}`;
    

    this.context.globalState.update(profileKey, Array.from(this.selectedRegions));
    console.log(`Saved regions for profile ${this.profileProvider.getSelectedProfile()}:`, Array.from(this.selectedRegions));
  }

  private async restoreSelectedRegions(): Promise<void> {
    if (!this.profileProvider) {
      console.error('ProfileProvider is not initialized.');
      return;
    }

    const selectedProfile = this.profileProvider.getSelectedProfile();
    if (!selectedProfile) {
      console.error('No selected profile available to restore regions.');
      return;
    }

    const profileKey = `selectedRegions_${selectedProfile}`;
    const storedRegions = this.context.globalState.get<string[]>(profileKey) || [];
    console.log(`Restoring regions for profile ${selectedProfile}:`, storedRegions);

    this.selectedRegions = new Set(storedRegions.filter((region) => this.regions.includes(region)));
    console.log(`Active selected regions:`, Array.from(this.selectedRegions));
  }

  public async fetchRegions(): Promise<void> {
    try {
      const selectedProfile = this.profileProvider?.selectedProfile ?? 'default';

      const credentials = fromIni({ profile: selectedProfile });

      const client = new EC2Client({ region: 'us-east-1', credentials });
      const command = new DescribeRegionsCommand({});
      const data = await client.send(command);

      if (data.Regions) {
        this.regions = data.Regions.map((region: Region) => {
          if (region.RegionName) {
            return region.RegionName;
          } else {
            out(`Region name is undefined for region: ${JSON.stringify(region)}`);
            return '';
          }
        });
      } else {
        out(`Regions property is undefined in the response: ${JSON.stringify(data)}`);
        this.regions = [];
      }

      out(`Fetched regions: ${JSON.stringify(this.regions)}`);
      out(`Fetched regions for profile: ${selectedProfile}`);
      this.refresh();
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to fetch regions: ${error}`);
      out(`Failed to fetch regions: ${error}`);
    }
  }

  public async selectAllRegions(defaultRegions: boolean = true): Promise<void> {
    if (defaultRegions) {
      this.regions.filter((region) => region.startsWith('eu-')).forEach((region) => this.selectedRegions.add(region));
    } else {
      this.regions.forEach((region) => this.selectedRegions.add(region));
    }

    this._onDidChangeTreeData.fire(undefined);
    this._onDidFinish.fire();
    this.notifyObservers();
  }

  getTreeItem(element: RegionCategory): vscode.TreeItem {
    if (element.region === '') {
      // element is a region group
      let treeItem = new vscode.TreeItem(
        element.category,
        vscode.TreeItemCollapsibleState.Expanded, // Always expanded
      );
      treeItem.command = {
        command: 'cloudtoolbox.toggleGroup',
        title: 'Toggle Group',
        arguments: [element.category],
      };
      return treeItem;
    } else {
      // element is a region
      let treeItem = new vscode.TreeItem(element.region, vscode.TreeItemCollapsibleState.None);
      if (this.selectedRegions.has(element.region)) {
        treeItem.iconPath = new vscode.ThemeIcon('check');
      }
      treeItem.command = {
        command: 'cloudtoolbox.toggleRegion',
        title: 'Toggle Region',
        arguments: [element.region],
      };
      return treeItem;
    }
  }

  getChildren(element?: RegionCategory): vscode.ProviderResult<RegionCategory[]> {
    if (element) {
      // element is a region group, return regions in this group
      return this.regions.filter((region) => this.regionCategoryMapping.get(region) === element.category).map((region) => ({ category: element.category, region }));
    } else {
      // no element, return region groups
      const regionGroups = new Set(this.regionCategoryMapping.values());
      return Array.from(regionGroups)
        .filter((regionGroup) => this.regions.some((region) => this.regionCategoryMapping.get(region) === regionGroup))
        .map((regionGroup) => ({ category: regionGroup, region: '' }));
    }
  }

  public toggleGroup(category: string): void {
    const regionsInGroup = this.regions.filter((region) => this.regionCategoryMapping.get(region) === category);

    const allSelected = regionsInGroup.every((region) => this.selectedRegions.has(region));

    if (allSelected) {
      // If all regions in the group are selected, deselect them
      regionsInGroup.forEach((region) => this.selectedRegions.delete(region));
    } else {
      // If not all regions in the group are selected, select them
      regionsInGroup.forEach((region) => this.selectedRegions.add(region));
    }

    this.saveSelectedRegions();
    this._onDidChangeTreeData.fire(undefined);
    this.notifyObservers();
    

  }

  public toggleRegion(region: string): void {
    if (!this.regions) {
      vscode.window.showErrorMessage('Regions have not been fetched yet.');
      return;
    }

    if (this.selectedRegions.has(region)) {
      this.selectedRegions.delete(region);
    } else {
      this.selectedRegions.add(region);
    }
    console.log('toggle region', region, this.selectedRegions);
    this.saveSelectedRegions();

    this._onDidChangeTreeData.fire(undefined);
    this.notifyObservers();
    
  }

  public async onProfileChanged(): Promise<void> {
    console.log('Profile changed detected in RegionProvider');

    this.selectedRegions.clear();
    await this.fetchRegions();
    await this.restoreSelectedRegions();


    this.refresh();
    // Make sure to notify observers about the update
  }

  public async getSelectedRegions(): Promise<string[]> {
    return Array.from(this.selectedRegions);
  }

  public clearAllRegions(): void {
    this.selectedRegions.clear();
    this.refresh();
  }

  public refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
    this.notifyObservers();
  }
}
