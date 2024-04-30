import * as vscode from "vscode";

export async function setCostExplorerHtml(
  context: vscode.ExtensionContext,
  webview: vscode.Webview
): Promise<void> {
  try {
    
    const baseUri = context.extensionUri;
    const highchartsCssUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, "dist", "node_modules", "highcharts", "css", "highcharts.css"));
    const datagridUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, "dist", "node_modules", "@highcharts", "dashboards", "datagrid.js"));
    const accessibilityUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, "dist", "node_modules", "highcharts", "modules", "accessibility.js"));
    const highchartsMorejsUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, "dist", "node_modules", "highcharts", "highcharts-more.js"));
    const dashboardsUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, "dist", "node_modules", "@highcharts", "dashboards", "dashboards.js"));
    const mathModifierJsUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, "dist", "node_modules", "@highcharts", "dashboards", "modules", "math-modifier.js"));
    const highStockJsUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, "dist", "node_modules", "highcharts", "highstock.js"));
    const layoutJsUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, "dist", "node_modules", "@highcharts", "dashboards", "modules", "layout.js"));
    const datagridCssUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, "dist", "node_modules", "@highcharts", "dashboards", "css", "datagrid.css"));
    const dashboardsCssUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, "dist", "node_modules", "@highcharts", "dashboards", "css", "dashboards.css"));
    const highchartsCustomCssUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, "dist", "webViews", "css", "highchartsGrid3.css"));
    const costExplorerCssUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, "dist", "webViews", "css", "costexplorer.css"));
    const customCssUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, "dist", "webViews", "css", "custom.css"));
    const fontAwesomeUri = webview.asWebviewUri(vscode.Uri.joinPath(baseUri, "dist", "node_modules", "@fortawesome", "fontawesome-free", "css", "all.min.css"));

    const runJsPath = vscode.Uri.joinPath(baseUri, "dist", "webViews", "charts", "costexplorer.js");
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
        <link rel="stylesheet" type="text/css" href="${customCssUri}">
        <link rel="stylesheet" type="text/css" href="${costExplorerCssUri}">
        <script src="${datagridUri}"></script>
        <script src="${highStockJsUri}"></script>
        <script src="${highchartsMorejsUri}"></script>
        <script src="${dashboardsUri}"></script>

        <script src="${layoutJsUri}"></script>
        <script src="${mathModifierJsUri}"></script>

        
        <script src="${accessibilityUri}"></script>

        
        
        <script>const vscode = acquireVsCodeApi();</script>
    </head>
    <body>
    <div id="control-panel" style="display: flex; gap: 10px; align-items: center;">
      <div class="control-group">
          <div class="icon-with-tooltip">
              <i class="fa-solid fa-arrows-rotate iii" id="refresh-button" title="refresh"></i>
          </div>
          <select id="interval" title="Auto Refresh" style="width: 49px; height: 19px; margin-left: 7px;">
              <option value="0" selected>stop</option>
              
          </select>
      </div>
      <div id="loading" style="display: none;">
        <span id="timer">0</span>
      </div>
    </div>
    <div id="container"></div>

<div id="popup">
    <div class="container">
        <div id="datagrid-container"></div>
        <button class="close">×</button>
    </div>
</div>


    <script>${runJs}</script>
    <script>
      window.addEventListener('load', init);
      window.addEventListener('message', (event) => handleIncomingData(event.data));
    </script>
    </body>
    </html>`;
  } catch (error) {
    console.error("Failed to set EC2 HTML content:", error);
    vscode.window.showErrorMessage("An error occurred while setting up the Lambda dashboard.");
  }
}
