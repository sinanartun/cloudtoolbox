import * as vscode from 'vscode';
import * as path from 'path';

export class ServiceProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<vscode.TreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined> = this._onDidChangeTreeData.event;
    private options: string[] = [
        'CostExplorer',
        'VPC',
        'S3',
        'Lambda',
        'EC2',
        'ECS',
        'ECR',
        'RDS',
        'DynamoDB',
        'Redshift',
        // 'SNS',
        'IAM',
        'EventBridge',
        'CloudWatch',

        

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
                            light: path.join(__dirname,  'images',  'vpc.png'),
                            dark: path.join(__dirname,   'images',  'vpc.png'),
                        };
                        break;
                    case 'EC2':
                        treeItem.iconPath = {
                            light: path.join(__dirname,   'images',  'ec2.png'),
                            dark: path.join(__dirname,   'images',  'ec2.png'),
                        };
                        treeItem.command = { command: 'cloudtoolbox.showEC2', title: 'Show EC2', arguments: [] };
                        break;
                    case 'Lambda':
                        treeItem.iconPath = {
                            light: path.join(__dirname,   'images',  'lambda.png'),
                            dark: path.join(__dirname,   'images',  'lambda.png'),
                        };
                        treeItem.command = { command: 'cloudtoolbox.showLambda', title: 'Show Lambda', arguments: [] };
                        break;
                    case 'S3':
                        treeItem.command = { command: 'cloudtoolbox.showS3', title: 'Show S3', arguments: [] };
                        treeItem.iconPath = {
                            light: path.join(__dirname,   'images',  's3.png'),
                            dark: path.join(__dirname,   'images',  's3.png'),
                        };
                        break;
                    case 'ECS':
                        treeItem.command = { command: 'cloudtoolbox.showECS', title: 'Show ECS', arguments: [] };
                        treeItem.iconPath = {
                            light: path.join(__dirname,   'images',  'ecs.png'),
                            dark: path.join(__dirname,   'images',  'ecs.png'),
                        };
                        break;    
                    case 'ECR':
                        treeItem.command = { command: 'cloudtoolbox.showECR', title: 'Show ECR', arguments: [] };
                        treeItem.iconPath = {
                            light: path.join(__dirname,   'images',  'ecr.png'),
                            dark: path.join(__dirname,   'images',  'ecr.png'),
                        };
                        break;        
                    case 'RDS':
                        treeItem.command = { command: 'cloudtoolbox.showRDS', title: 'Show RDS', arguments: [] };
                        treeItem.iconPath = {
                            light: path.join(__dirname,   'images',  'rds.png'),
                            dark: path.join(__dirname,   'images',  'rds.png'),
                        };
                        break;
                    case 'DynamoDB':
                        treeItem.command = { command: 'cloudtoolbox.showDynamoDB', title: 'Show DynamoDB', arguments: [] };
                        treeItem.iconPath = {
                            light: path.join(__dirname,   'images',  'dynamodb.png'),
                            dark: path.join(__dirname,   'images',  'dynamodb.png'),
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
                            light: path.join(__dirname,   'images',  'sns.png'),
                            dark: path.join(__dirname,   'images',  'sns.png'),
                        };
                        break;  
                    case 'IAM':
                        treeItem.command = { command: 'cloudtoolbox.showIAM', title: 'Show IAM', arguments: [] };
                        treeItem.iconPath = {
                            light: path.join(__dirname, 'images',  'iam.png'),
                            dark: path.join(__dirname, 'images',  'iam.png'),
                        };
                        break;  
                    case 'EventBridge':
                        treeItem.command = { command: 'cloudtoolbox.showEventBridge', title: 'Show EventBridge', arguments: [] };
                        treeItem.iconPath = {
                            light: path.join(__dirname, 'images',  'eventbridge.png'),
                            dark: path.join(__dirname, 'images',  'eventbridge.png'),
                        };
                        break;            
                    case 'CostExplorer':
                        treeItem.command = { command: 'cloudtoolbox.showCostExplorer', title: 'Show CostExplorer', arguments: [] };
                        treeItem.iconPath = {
                            light: path.join(__dirname, 'images',  'costexplorer.png'),
                            dark: path.join(__dirname, 'images',  'costexplorer.png'),
                        };
                        break;
                    case 'CloudWatch':
                        treeItem.command = { command: 'cloudtoolbox.showCloudWatch', title: 'Show CloudWatch', arguments: [] };
                        treeItem.iconPath = {
                            light: path.join(__dirname, 'images',  'cloudwatch.png'),
                            dark: path.join(__dirname, 'images',  'cloudwatch.png'),
                        };
                        break;      
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