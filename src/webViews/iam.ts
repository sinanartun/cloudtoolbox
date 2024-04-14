import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';

export async function setIAMHtml(
  context: vscode.ExtensionContext,
  webview: vscode.Webview,
): Promise<void> {
  try {
    const highchartsUri = webview.asWebviewUri(
      vscode.Uri.file(path.join(context.extensionPath, 'node_modules', 'highcharts', 'highcharts.js')),
    );
    const datagridUri = webview.asWebviewUri(
      vscode.Uri.file(path.join(context.extensionPath, 'node_modules', '@highcharts', 'dashboards', 'datagrid.js')),
    );
    const accessibilityUri = webview.asWebviewUri(
      vscode.Uri.file(path.join(context.extensionPath, 'node_modules', 'highcharts', 'modules', 'accessibility.js')),
    );
    const dashboardsUri = webview.asWebviewUri(
      vscode.Uri.file(path.join(context.extensionPath, 'node_modules', '@highcharts', 'dashboards', 'dashboards.js')),
    );
    const layoutUri = webview.asWebviewUri(
      vscode.Uri.file(
        path.join(context.extensionPath, 'node_modules', '@highcharts', 'dashboards', 'modules', 'layout.js'),
      ),
    );
    const highchartsCssUri = webview.asWebviewUri(
      vscode.Uri.file(path.join(context.extensionPath, 'node_modules', 'highcharts', 'css', 'highcharts.css')),
    );
    const datagridCssUri = webview.asWebviewUri(
      vscode.Uri.file(
        path.join(context.extensionPath, 'node_modules', '@highcharts', 'dashboards', 'css', 'datagrid.css'),
      ),
    );
    const dashboardsCssUri = webview.asWebviewUri(
      vscode.Uri.file(
        path.join(context.extensionPath, 'node_modules', '@highcharts', 'dashboards', 'css', 'dashboards.css'),
      ),
    );

    const scriptPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, 'src', 'webViews', 'charts', 'iam.js'));
    const scriptContent = await fs.readFile(scriptPathOnDisk.fsPath, 'utf8');

    const customCssPath = vscode.Uri.file(
      path.join(context.extensionPath, 'src', 'webViews', 'components', 'custom.css'),
    );
    const customCss = await fs.readFile(customCssPath.fsPath, 'utf8');

    const iamTablePath = vscode.Uri.file(
      path.join(context.extensionPath, 'src', 'webViews', 'components', 'iamTable.css'),
    );
    const iamTableCss = await fs.readFile(iamTablePath.fsPath, 'utf8');

    const fontAwesomeUri = webview.asWebviewUri(
      vscode.Uri.file(
        path.join(context.extensionPath, 'node_modules', '@fortawesome', 'fontawesome-free', 'css', 'all.min.css'),
      ),
    );

    webview.html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="
            default-src 'none'; 
            img-src ${webview.cspSource} https:;
            script-src 'unsafe-inline' ${webview.cspSource}; 
            style-src 'unsafe-inline' ${webview.cspSource};
            font-src ${webview.cspSource} https:;
        ">
        <link rel="stylesheet" type="text/css" href="${highchartsCssUri}">
        <link rel="stylesheet" type="text/css" href="${datagridCssUri}">
        <link rel="stylesheet" type="text/css" href="${dashboardsCssUri}">
        <link rel="stylesheet" type="text/css" href="${fontAwesomeUri}">
        <script src="${highchartsUri}"></script>
        <script src="${datagridUri}"></script>
        <script src="${accessibilityUri}"></script>
        <script src="${dashboardsUri}"></script>
        <script src="${layoutUri}"></script>
        <script src="${iamTableCss}"></script>
        <style>

        ${customCss}
        ${iamTableCss}
        </style>
    </head>
    <body>
    <div id="control-panel" style="display: flex; gap: 10px; align-items: center;">
      <div class="control-group">
          <div class="icon-with-tooltip">
              <i class="fa-solid fa-arrows-rotate iii" id="refresh-button" title="refresh"></i>
          </div>
          <select id="interval" title="Auto Refresh" style="width: 49px; height: 19px; margin-left: 7px;">
              <option value="0" >stop</option>
              <option value="5">5 s</option>
              <option value="10">10 s</option>
              <option value="15">15 s</option>
              <option value="30">30 s</option>
              <option value="60" selected>1 m</option>
              <option value="180">3 m</option>
              <option value="300">5 m</option>
          </select>

      </div>
      <div id="loading" style="display: none;">
        <span id="timer">0</span>
      </div>
    </div>
    <div id="container" style="height:90vh"></div>
    <script>
        ${scriptContent}
    </script>
    </body>
    </html>`;
  } catch (error) {
    console.error('Failed to set VPC HTML content:', error);
    vscode.window.showErrorMessage('An error occurred while setting up the VPC dashboard.');
  }
}
