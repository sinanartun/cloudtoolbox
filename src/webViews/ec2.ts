import * as vscode from "vscode";

export async function setEc2Html(context: vscode.ExtensionContext, webview: vscode.Webview): Promise<void> {
  try {
    const baseUri = context.extensionUri;

    const highchartsCssUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, 'dist', 'node_modules', 'highcharts', 'css', 'highcharts.css'));
    const highchartsUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, 'dist', 'node_modules', 'highcharts', 'highcharts.js'));
    const datagridUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, 'dist', 'node_modules', '@highcharts', 'dashboards', 'datagrid.js'));
    const accessibilityUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, 'dist', 'node_modules', 'highcharts', 'modules', 'accessibility.js'));
    const draggablepointsjsUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, 'dist', 'node_modules', 'highcharts', 'modules', 'draggable-points.js'));
    const dashboardsUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, 'dist', 'node_modules', '@highcharts', 'dashboards', 'dashboards.js'));
    const layoutUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, 'dist', 'node_modules', '@highcharts', 'dashboards', 'modules', 'layout.js'));
    const datagridCssUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, 'dist', 'node_modules', '@highcharts', 'dashboards', 'css', 'datagrid.css'));
    const dashboardsCssUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, 'dist', 'node_modules', '@highcharts', 'dashboards', 'css', 'dashboards.css'));
    const highchartsCustomCssUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, 'dist', 'webViews', 'css', 'highchartsGrid3.css'));
    const customCssUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, 'dist', 'webViews', 'css', 'custom.css'));
    const fontAwesomeUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, 'dist', 'node_modules', '@fortawesome', 'fontawesome-free', 'css', 'all.min.css'));

    const dtUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, 'dist', 'node_modules', 'datatables.net', 'js', 'dataTables.min.js'));
    const dtdtUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, 'dist', 'node_modules', 'datatables.net-dt', 'js', 'dataTables.dataTables.min.js'));
    const dtdtCssUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, 'dist', 'node_modules', 'datatables.net-dt', 'css', 'dataTables.dataTables.min.css'));
    const jqueryUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, 'dist', 'node_modules', 'jquery', 'dist', 'jquery.min.js'));

    const runJsPath = vscode.Uri.joinPath(baseUri, 'dist', 'webViews', 'charts', 'ec2.js');
    const runJsData = await vscode.workspace.fs.readFile(runJsPath);
    const runJs = runJsData.toString();

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
        
        <link rel="stylesheet" type="text/css" href="${highchartsCustomCssUri}">
        <link rel="stylesheet" type="text/css" href="${dtdtCssUri}">
        <link rel="stylesheet" type="text/css" href="${customCssUri}">
        
        <script src="${highchartsUri}"></script>
        <script src="${datagridUri}"></script>
        <script src="${accessibilityUri}"></script>
        <script src="${dashboardsUri}"></script>
        <script src="${layoutUri}"></script>
        <script src="${draggablepointsjsUri}"></script>
        
        <script src="${jqueryUri}"></script>
        <script src="${dtUri}"></script>
        <script src="${dtdtUri}"></script>
        

        <script>const vscode = acquireVsCodeApi();</script>
    </head>
    <body>
    <div id="control-panel" style="display: flex; gap: 10px; align-items: center;">
      <div class="control-group">
          <div class="icon-with-tooltip">
              <i class="fa-solid fa-arrows-rotate iii" id="refresh-button" title="refresh"></i>
          </div>
          <select id="interval" title="Auto Refresh" style="width: 49px; height: 19px; margin-left: 7px;">
              <option value="0" selected>0</option>
              <option value="5">5 s</option>
              <option value="30">30 s</option>
              <option value="60" >1 m</option>
              <option value="180">3 m</option>
              <option value="300">5 m</option>
          </select>
      </div>
      <div id="loading" style="display: none;">
        <span id="timer">0</span>
      </div>
    </div>
    <div id="container"></div>
    <div id="dtWrapper">
      <table id="dt" class="display" style="width:100%"></table>
    </div>
    <script>${runJs}</script>
    <script>
      window.addEventListener('load', init);
      window.addEventListener('message', (event) => handleIncomingData(event.data));
    </script>
    </body>
    </html>`;
  } catch (error) {
    console.error('Failed to set EC2 HTML content:', error);
    vscode.window.showErrorMessage('An error occurred while setting up the EC2 dashboard.');
  }
}
