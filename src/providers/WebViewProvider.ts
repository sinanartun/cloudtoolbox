import * as vscode from 'vscode';
import { Ec2Explorer } from '../explorers/EC2';
import { LambdaExplorer } from '../explorers/Lambda';
import { setLambdaHtml } from '../webViews/lambda';
import { setEc2Html } from '../webViews/ec2';
import { setS3Html } from '../webViews/s3';
import { S3Explorer } from '../explorers/S3';
import { setVpcHtml } from '../webViews/vpc';
import { setRdsHtml } from '../webViews/rds';
import { VpcExplorer } from '../explorers/VPC';
import { RDSExplorer } from '../explorers/RDS';
import { setDynamoDBHtml } from '../webViews/dynamodb';
import { DynamoDBExplorer } from '../explorers/DynamoDB';
import { ECSExplorer } from '../explorers/ECS';
import { ECRExplorer } from '../explorers/ECR';
import { RedshiftExplorer } from '../explorers/Redshift';
import { SNSExplorer } from '../explorers/SNS';
import { IAMExplorer } from '../explorers/IAM';
import { setECSHtml } from '../webViews/ecs';
import { setECRHtml } from '../webViews/ecr';
import { setRedshiftHtml } from '../webViews/redshift';
import { setSNSHtml } from '../webViews/sns';
import { setIAMHtml } from '../webViews/iam';

export class WebViewProvider {
    private context: vscode.ExtensionContext;
    private panels: Map<string, vscode.WebviewPanel> = new Map();
    private serviceMapping: { [key: string]: any } = {
        'EC2': Ec2Explorer,
        'Lambda': LambdaExplorer,
        'S3': S3Explorer,
        'VPC': VpcExplorer,
        'RDS': RDSExplorer,
        'DynamoDB': DynamoDBExplorer,
        'ECS': ECSExplorer,
        'ECR': ECRExplorer,
        'Redshift': RedshiftExplorer,
        'SNS': SNSExplorer,
        'IAM': IAMExplorer
    };

    private webViewMapping: { [key: string]: any } = {
        'EC2': setEc2Html,
        'Lambda': setLambdaHtml,
        'S3': setS3Html,
        'VPC': setVpcHtml,
        'RDS': setRdsHtml,
        'DynamoDB': setDynamoDBHtml,
        'ECS': setECSHtml,
        'ECR': setECRHtml,
        'Redshift': setRedshiftHtml,
        'SNS': setSNSHtml,
        'IAM': setIAMHtml
    };

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public async showWebview(service: string) {
        const title = service;
        let panel = this.panels.get(title);

        if (!panel) {
            panel = this.createPanel(title);
            this.panels.set(title, panel);
        }
        panel.reveal();

        

        try {
            const ServiceClass = this.serviceMapping[service];
            if (!ServiceClass) {
                throw new Error(`Unsupported service: ${service}`);
            }
            const explorer = new ServiceClass();
           
            const setHtmlForWebview = this.webViewMapping[service];
            if (!setHtmlForWebview) {
                throw new Error(`Unsupported service: ${service}`);
            }
            await setHtmlForWebview(this.context, panel.webview);
            const data = await explorer.getChartData();
            
            this.updateWebview(service, data);
            this.listenToWebviewMessages(panel, explorer);

           
        } catch (error) {
            if (error instanceof Error) {
                this.handleError(panel, error);
            }
        }
    }

    private handleError(panel: vscode.WebviewPanel, error: Error) {
        vscode.window.showErrorMessage(`Failed to show webview: ${error.message}`);
        panel.dispose();
    }

    private createPanel(title: string): vscode.WebviewPanel {
        const panel = vscode.window.createWebviewPanel(
            'awsResourceView',
            title,
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        panel.onDidDispose(() => this.panels.delete(title));

        return panel;
    }

    public updateWebview(service: string, data: any) {
        const panel = this.panels.get(service);
        if (panel) {
           
            panel.webview.postMessage({ command: 'updateData', data: data });
        }else{
            console.log('No panel found for service:', service);
        }
    }

    private listenToWebviewMessages(panel: vscode.WebviewPanel, explorer: any) {
        panel.webview.onDidReceiveMessage(
          async message => {
            if (message.command === 'requestData') {
              const data = await explorer.getChartData();
              panel.webview.postMessage({ command: 'updateData', data });
            }
          },
          undefined,
          this.context.subscriptions
        );
      }
    }

    
    

