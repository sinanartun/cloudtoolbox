import * as vscode from 'vscode';
import * as path from 'path';

export class ServiceProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<vscode.TreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined> = this._onDidChangeTreeData.event;
    private options: string[] = [
        'VPC',
        'S3',
        'Lambda',
        'EC2',
        'ECS',
        'ECR',
        'RDS',
        // 'DynamoDB',
        // 'Redshift',
        // 'SNS',
        // 'IAM'

    ];

    constructor() {

    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }


    getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
        if (!element) {
            return Promise.resolve(this.options.map(option => {
                const treeItem: vscode.TreeItem = new vscode.TreeItem(option);
                switch (option) {
                    case 'VPC':
                        treeItem.command = { command: 'cloudtoolbox.showVPC', title: 'Show VPC', arguments: [] };
                        treeItem.iconPath = {
                            light: path.join(__dirname,  'images',  'VPC.png'),
                            dark: path.join(__dirname,   'images',  'VPC.png'),
                        };
                        break;
                    case 'EC2':
                        treeItem.iconPath = {
                            light: path.join(__dirname,   'images',  'EC2.png'),
                            dark: path.join(__dirname,   'images',  'EC2.png'),
                        };
                        treeItem.command = { command: 'cloudtoolbox.showEC2', title: 'Show EC2', arguments: [] };
                        break;
                    case 'Lambda':
                        treeItem.iconPath = {
                            light: path.join(__dirname,   'images',  'Lambda.png'),
                            dark: path.join(__dirname,   'images',  'Lambda.png'),
                        };
                        treeItem.command = { command: 'cloudtoolbox.showLambda', title: 'Show Lambda', arguments: [] };
                        break;
                    case 'S3':
                        treeItem.command = { command: 'cloudtoolbox.showS3', title: 'Show S3', arguments: [] };
                        treeItem.iconPath = {
                            light: path.join(__dirname,   'images',  'S3.png'),
                            dark: path.join(__dirname,   'images',  'S3.png'),
                        };
                        break;
                    case 'ECS':
                        treeItem.command = { command: 'cloudtoolbox.showECS', title: 'Show ECS', arguments: [] };
                        treeItem.iconPath = {
                            light: path.join(__dirname,   'images',  'ECS.png'),
                            dark: path.join(__dirname,   'images',  'ECS.png'),
                        };
                        break;    
                    case 'ECR':
                        treeItem.command = { command: 'cloudtoolbox.showECR', title: 'Show ECR', arguments: [] };
                        treeItem.iconPath = {
                            light: path.join(__dirname,   'images',  'ECR.png'),
                            dark: path.join(__dirname,   'images',  'ECR.png'),
                        };
                        break;        
                    case 'RDS':
                        treeItem.command = { command: 'cloudtoolbox.showRDS', title: 'Show RDS', arguments: [] };
                        treeItem.iconPath = {
                            light: path.join(__dirname,   'images',  'RDS.png'),
                            dark: path.join(__dirname,   'images',  'RDS.png'),
                        };
                        break;
                    case 'DynamoDB':
                        treeItem.command = { command: 'cloudtoolbox.showDynamoDB', title: 'Show DynamoDB', arguments: [] };
                        treeItem.iconPath = {
                            light: path.join(__dirname,   'images',  'DynamoDB.png'),
                            dark: path.join(__dirname,   'images',  'DynamoDB.png'),
                        };
                        break;
                    case 'Redshift':
                        treeItem.command = { command: 'cloudtoolbox.showRedshift', title: 'Show Redshift', arguments: [] };
                        treeItem.iconPath = {
                            light: path.join(__dirname,   'images',  'redshift.png'),
                            dark: path.join(__dirname,   'images',  'redshift.png'),
                        };
                        break; 
                    case 'SNS':
                        treeItem.command = { command: 'cloudtoolbox.showSNS', title: 'Show SNS', arguments: [] };
                        treeItem.iconPath = {
                            light: path.join(__dirname,   'images',  'SNS.png'),
                            dark: path.join(__dirname,   'images',  'SNS.png'),
                        };
                        break;  
                    case 'IAM':
                        treeItem.command = { command: 'cloudtoolbox.showIAM', title: 'Show IAM', arguments: [] };
                        treeItem.iconPath = {
                            light: path.join(__dirname, 'images',  'IAM.png'),
                            dark: path.join(__dirname, 'images',  'IAM.png'),
                        };
                        break;        
                    // add more cases here for other options
                }
                return treeItem;
            }));
        } else {
            return Promise.resolve([]);
        }
    }

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }
}