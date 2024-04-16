import * as vscode from 'vscode';
import { randomBytes } from 'crypto';
import Prism from 'prismjs';


function getNonce() {
  return randomBytes(16).toString('base64');
}

export async function getWelcomeHtml(context: vscode.ExtensionContext, webview: vscode.Webview): Promise<void> {
  try {
    const prismjsUri = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'node_modules', 'prismjs', 'prism.js'));
    const prismjsonUri = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'node_modules', 'prismjs', 'components', 'prism-json.js'));
    const prismThemeCssUri = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'node_modules', 'prismjs', 'themes', 'prism-okaidia.min.css'));
    const prismCssUri = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'node_modules', 'prismjs', 'themes', 'prism.css'));
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'webViews', 'js', 'welcome.js'));
    const fontAwesomeUri = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'node_modules', '@fortawesome', 'fontawesome-free', 'css', 'all.min.css'));
    const checkbox = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'images', 'check-mark.png'));
    const ec2 = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'images', 'EC2.png'));
    const lambda = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'images', 'Lambda.png'));
    const vpc = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'images', 'vpc.png'));
    const s3 = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'images', 's3.png'));
    const ecs = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'images', 'ecs.png'));
    const ecr = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'images', 'ecr.png'));
    const rds = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'images', 'rds.png'));
    const dynamodb = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'images', 'dynamodb.png'));
    const redshift = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'images', 'redshift.png'));

    const nonce = getNonce(); // Implement this function to generate a nonce

    webview.html = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>

    <link rel="stylesheet" type="text/css" href="${prismThemeCssUri}">
    <link rel="stylesheet" type="text/css" href="${fontAwesomeUri}">
    <script src="${prismjsUri}"></script>
    <script src="${prismjsonUri}"></script>
    <style>
    /* Grid Layout */
    .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
        gap: 0.2rem;
        padding: 1rem;
    }
    .code-container {
      position: relative;
      width: 66%;
  }

  #policyBox{
    max-height:400px;
    overflow:auto;
  }
    
.selected-service {
  background-image: url('${checkbox}');
  background-size: 15px; 
  background-position: 0px 0px;
  background-repeat: no-repeat;
}

    .card {
        border-radius: 3px;
        overflow: visible;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center; 
        align-items: center;
        padding: 0.2rem;
    }
    
    .card img {
        height: 32px;
        width: 32px;
        display: block;
    }
    
    .card h3 {
        margin: 0.5em 0;
    }
    
    /* Buttons and Interactive Elements */
    .sbutton, .copy-button {
        background-color: #1f1f1f;
        color: white;
        border-radius: 4px;
        padding: 5px;
        margin: 5px;
        cursor: pointer;
        display: inline-block;
        transition: background-color 0.3s ease;
        text-decoration: none;
    }
    
    .sbutton:hover, .copy-button:hover {
        background-color: #505ac7;
        color:#fff;
    }
    
    /* Tooltip for Copy Action */
    .tooltip {
        visibility: hidden;
        position: absolute;
        z-index: 1;
        left: 50%;
        transform: translateX(-50%);
        background-color: #555;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 8px 5px;
        opacity: 0;
        transition: opacity 0.3s, visibility 0.3s ease-in-out;
    }
    
    .tooltip.visible {
        visibility: visible;
        opacity: 1;
    }
    
  
  
    </style>
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src ${webview.cspSource}; img-src ${webview.cspSource} https://s3.eu-north-1.amazonaws.com https://i.imgur.com/; style-src ${webview.cspSource}; font-src ${webview.cspSource} https:;">
</head>
<body>
    <h1>Quick Start</h1>
    <p>How to setup your computer to Monitor AWS Services.</p>
    <h2>1. Step</h2>
    <p> Select AWS Services to Monitor </p>
<div class="grid-container">
    <div class="card" data-service="vpc">
        <img src="${vpc}" alt="vpc" />
        <span class="service-name">VPC</span>
        <a class="sbutton" href="#"><span class='mb-text' >select</span></a>
    </div>
    <div class="card" data-service="s3">
        <img src="${s3}" alt="s3" />
        <span class="service-name">S3</span>
        <a class="sbutton" href="#"><span class='mb-text' >select</span></a>
    </div>
    <div class="card" data-service="ec2">
        <img src="${ec2}" alt="EC2" />
        <span class="service-name">EC2</span>
        <a class="sbutton" href="#"><span class='mb-text' >select</span></a>
    </div>
    <div class="card" data-service="lambda">
        <img src="${lambda}" alt="Lambda" />
        <span class="service-name">Lambda</span>
        <a class="sbutton" href="#"><span class='mb-text' >select</span></a>
    </div>
    <div class="card" data-service="ecs">
        <img src="${ecs}" alt="ECS" />
        <span class="service-name">ECS</span>
        <a class="sbutton" href="#"><span class='mb-text' >select</span></a>
    </div>
    <div class="card" data-service="ecr">
        <img src="${ecr}" alt="ECR" />
        <span class="service-name">ECR</span>
        <a class="sbutton" href="#"><span class='mb-text' >select</span></a>
    </div>
    <div class="card" data-service="rds">
        <img src="${rds}" alt="RDS" />
        <span class="service-name">RDS</span>
        <a class="sbutton" href="#"><span class='mb-text' >select</span></a>
    </div>
    <div class="card" data-service="dynamodb">
        <img src="${dynamodb}" alt="DynamoDB" />
        <span class="service-name">DynamoDB</span>
        <a class="sbutton" href="#"><span class='mb-text' >select</span></a>
    </div>
    <div class="card" data-service="redshift">
        <img src="${redshift}" alt="Redshift" />
        <span class="service-name">Redshift</span>
        <a class="sbutton" href="#"><span class='mb-text' >select</span></a>
    </div>

</div>

</br></br></br>
<hr>
</br></br></br>

<h2>2. Step</h2>
<p> Copy Auto Generated IAM Read-only Policy </p>
<p> This VS Extension is Open Source. It does not collect any info about your computer. Just for your safety Please use Fine tuned IAM Read-Only Policy below.</p>

    <h4>IAM READ-ONLY Policy</h2>
    <div class="code-container">
    <button class="copy-button" id="copyButton"><i class="fa-regular fa-clipboard"></i> Copy code</button>
    <div id="copyTooltip" class="tooltip">Copied to clipboard!</div>
    <pre id="policyBox" class="code-style"><code class="language-json">{
      "Version": "2012-10-17",
      "Statement": [
          {
              "Sid": "ec2",
              "Effect": "Allow",
              "Action": [
                  "ec2:DescribeInstances",
                  "ec2:DescribeAddresses",
                  "autoscaling:DescribeAutoScalingGroups"
              ],
              "Resource": "*"
          }
      ]
  }</code></pre>
</div>
</br></br></br>
<hr>
</br></br></br>
<h3>3. Step</h1>
<p> Create a User in your AWS Account</p>
<div>
<img src="https://s3.eu-north-1.amazonaws.com/cloudtoolbox.tech/app/ctb-01.gif"></img>
</div>
</br></br></br><hr></br></br></br>
<h2>4. Step</h2>
<p> Create Access key for the Created User</p>
<p> !!! Save Access key and Secret Key</p>
<div>
<img src="https://s3.eu-north-1.amazonaws.com/cloudtoolbox.tech/app/ctb-02.gif"></img>
</div>
</br></br></br><hr></br></br></br>
<h2>5. Step</h2>
<p> Download and Install AWS CLI from <a href="https://aws.amazon.com/cli/">https://aws.amazon.com/cli/</a></p>
<div>
<img src="https://s3.eu-north-1.amazonaws.com/cloudtoolbox.tech/app/ctb-03.gif"></img>
</div>
</br></br></br><hr></br></br></br>
<h2>6. Step</h2>
<p>Setup AWS Profile using Terminal</p>
<div>
<img src="https://s3.eu-north-1.amazonaws.com/cloudtoolbox.tech/app/ctb-04.gif"></img>
</div>
</br></br></br><hr></br></br></br>
<h2>7. Step</h2>
<p>Restart VS Code. Now you can see your profile with default profile name.</p>
<div>
<img src="https://i.imgur.com/xUO4FQG.png"></img>
</div>
    <script src="${scriptUri}"></script>

</body>



</html>
`;
  } catch (error) {
    console.error('Failed to set EC2 HTML content:', error);
    vscode.window.showErrorMessage('An error occurred while setting up the EC2 dashboard.');
  }
}
