import * as vscode from 'vscode';
import { Ec2Explorer } from '../explorers/EC2';
import { LambdaExplorer } from '../explorers/Lambda';
import { DynamoDBExplorer } from '../explorers/DynamoDB';
import { ECSExplorer } from '../explorers/ECS';
import { ECRExplorer } from '../explorers/ECR';
import { SNSExplorer } from '../explorers/SNS';
import { IAMExplorer } from '../explorers/IAM';
import { VpcExplorer } from '../explorers/VPC';
import { RDSExplorer } from '../explorers/RDS';
import { RedshiftExplorer } from '../explorers/Redshift';
import { S3Explorer } from '../explorers/S3';
import { EventBridgeExplorer } from '../explorers/EventBridge';
import { CostExplorer } from '../explorers/CostExplorer';

import { setLambdaHtml } from '../webViews/lambda';
import { setEc2Html } from '../webViews/ec2';
import { setS3Html } from '../webViews/s3';
import { setVpcHtml } from '../webViews/vpc';
import { setRdsHtml } from '../webViews/rds';
import { setDynamoDBHtml } from '../webViews/dynamodb';
import { setECSHtml } from '../webViews/ecs';
import { setECRHtml } from '../webViews/ecr';
import { setRedshiftHtml } from '../webViews/redshift';
import { setSNSHtml } from '../webViews/sns';
import { setIAMHtml } from '../webViews/iam';
import { getWelcomeHtml } from '../webViews/welcome';
import { setEventBridgeHtml } from '../webViews/eventbridge';
import { setCostExplorerHtml } from '../webViews/costexplorer';

export class WebViewProvider {
  private context: vscode.ExtensionContext;
  private panels: Map<string, vscode.WebviewPanel> = new Map();
  private serviceMapping: { [key: string]: any } = {
    EC2: Ec2Explorer,
    Lambda: LambdaExplorer,
    S3: S3Explorer,
    VPC: VpcExplorer,
    RDS: RDSExplorer,
    DynamoDB: DynamoDBExplorer,
    ECS: ECSExplorer,
    ECR: ECRExplorer,
    Redshift: RedshiftExplorer,
    IAM: IAMExplorer,
    EventBridge: EventBridgeExplorer,
    CostExplorer: CostExplorer
  };

  private webViewMapping: { [key: string]: any } = {
    EC2: setEc2Html,
    Lambda: setLambdaHtml,
    S3: setS3Html,
    VPC: setVpcHtml,
    RDS: setRdsHtml,
    DynamoDB: setDynamoDBHtml,
    ECS: setECSHtml,
    ECR: setECRHtml,
    Redshift: setRedshiftHtml,
    SNS: setSNSHtml,
    IAM: setIAMHtml,
    EventBridge: setEventBridgeHtml,
    CostExplorer: setCostExplorerHtml

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
      const explorer = new ServiceClass(this.context);

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
    const panel = vscode.window.createWebviewPanel('awsResourceView', title, vscode.ViewColumn.One, { enableScripts: true });

    panel.onDidDispose(() => this.panels.delete(title));

    return panel;
  }

  public updateWebview(service: string, data: any) {
    const panel = this.panels.get(service);
    if (panel) {
      console.log('update:',data );
      panel.webview.postMessage({ command: 'updateData', data: data });
    } else {
    }
  }

  private listenToWebviewMessages(panel: vscode.WebviewPanel, explorer: any) {
    panel.webview.onDidReceiveMessage(
      async (message) => {
        if (message.command === 'requestData') {
          const data = await explorer.getChartData();
          panel.webview.postMessage({ command: 'updateData', data });
        }else if (message.command ==='drillDown') {
          console.log('drillDown',message);
          const data = await explorer.drillDown(message.args);
          console.log('drillDownData',data);
          panel.webview.postMessage({ command: 'drillDown', data });
        }
      },
      undefined,
      this.context.subscriptions,
    );
  }

  async showWelcomePage() {
    const panel = vscode.window.createWebviewPanel('Quick Start', 'Quick Start', vscode.ViewColumn.One, {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, 'dist')],
    });

    await getWelcomeHtml(this.context, panel.webview);
    // await setCostExplorerHtml(this.context, panel.webview);
  }
}
