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
    const ec2 = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'images', 'ec2.png'));
    const lambda = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'images', 'lambda.png'));
    const vpc = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'images', 'vpc.png'));
    const s3 = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'images', 's3.png'));
    const ecs = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'images', 'ecs.png'));
    const ecr = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'images', 'ecr.png'));
    const rds = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'images', 'rds.png'));
    const dynamodb = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'images', 'dynamodb.png'));
    const redshift = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'images', 'redshift.png'));
    const iam = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'images', 'iam.png'));
    const eventbridge = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'images', 'eventbridge.png'));
    const costexplorer = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'images', 'costexplorer.png'));
    const onePageCss = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'webViews', 'welcome', 'css', 'one-page-wonder.css'));
    const welcomeCss = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'webViews', 'welcome', 'css', 'welcome.css'));
    const bootstrapCss = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'webViews', 'welcome', 'css', 'bootstrap.css'));
    const jquery = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'webViews', 'welcome', 'js', 'jquery-1.10.2.js'));
    const bootstrap = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'webViews', 'welcome', 'js', 'bootstrap.js'));
    const cloud = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'webViews', 'welcome', 'images', 'cloud.png'));
    const logo = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'webViews', 'welcome', 'images', 'logo.png'));
    const aurora = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'webViews', 'welcome', 'images', 'auora.mp4'));

    const nonce = getNonce();

    webview.html = `


    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="">
        <meta name="author" content="">
    
        <title>Basic Company Template for Bootstrap 3</title>
    
        <link href="${bootstrapCss}" rel="stylesheet">
        
    
        <link rel="stylesheet" type="text/css" href="${prismThemeCssUri}">
        <link rel="stylesheet" type="text/css" href="${fontAwesomeUri}">
        <link rel="stylesheet" type="text/css" href="${welcomeCss}">
        <script src="${prismjsUri}"></script>
        <script src="${prismjsonUri}"></script>

        <style>
        /* Grid Layout */
        .grid-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
            gap: 0.5rem;
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
      background-position: 5px 5px;
      background-repeat: no-repeat;
    }
    
        .card {
          height: 60px;
            border-radius: 3px;
            overflow: visible;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center; 
            align-items: center;
            padding: 10px;
        }
        
        .card img {
          height: 32px;
          width: 32px;
          object-fit: contain; /* or 'cover' depending on your need */
      }
        
        .card h3 {
            margin: 0.5em 0;
        }
        
        /* Buttons and Interactive Elements */
       .copy-button {
            background-color:#272822;
            color: white;
            border-radius: 4px;
            padding: 5px;
            margin: 5px;
            cursor: pointer;
            display: inline-block;
            transition: background-color 0.3s ease;
            text-decoration: none;
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
        
      .service-name{
        color:#fff !important;
        text-decoration: none !important;
      }
      .service-name:hover, active{
        color:#fff !important;
        text-decoration: none !important;
      }
      
        </style>

        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src ${webview.cspSource}; img-src ${webview.cspSource} https://s3.eu-north-1.amazonaws.com https://i.imgur.com https://www.placeholder.com http://via.placeholder.com; style-src ${webview.cspSource}; font-src ${webview.cspSource} https:; media-src 'self' https://*.vscode-resource.vscode-cdn.net;">

      </head>
    
      <body>
      <video autoplay muted loop id="background-video"><source src="${aurora}" type="video/mp4"></video>


        

        
        <header>
        <div class="logo"><img src="${logo}" width="128" height="128" alt=""/></div>
        <section class="profileHeader">
        <h1>AWS Toolbox</h1>
          <img src="${cloud}" alt="" width="300" height="276" class="cloud"/>
            <h3>Open-Source Real-time AWS Resource Monitoring</h3>
        <p>AWS Toolbox is an innovative, open-source Visual Studio Code extension designed to enable developers and cloud engineers to manage and interact with AWS services directly within their editor. It offers a streamlined workflow for AWS resource management, making it an indispensable tool for enhancing AWS operations within VS Code.</p>
        </section>
         
        </header>
        

        <section class="mainContent"> 
  
  <section class="section1">
    <h2 class="sectionTitle">Step 1</h2>
    
    <hr class="sectionTitleRule2">
    <div class="section1Content">
    <h2 class="sectionContentTitle">Select AWS services to monitor</h2>
    <button class="copy-button" id="selectAll"> <i class="fa-solid fa-check-double"></i> Select All</button>
    <div class="grid-container">
    <div class="card" data-service="costexplorer">
      <a class="sbutton" href="#">
        <img src="${costexplorer}" alt="CostExplorer" />
        <span class="service-name">CostExplorer</span>
      </a>
    </div>
    <div class="card" data-service="vpc">
      <a class="sbutton" href="#">
        <img src="${vpc}" alt="vpc" />
        <span class="service-name">VPC</span>
      </a>
    </div>
    <div class="card" data-service="s3">
      <a class="sbutton" href="#">
        <img src="${s3}" alt="s3" />
        <span class="service-name">S3</span>
      </a>
    </div>
    <div class="card" data-service="ec2">
      <a class="sbutton" href="#">
        <img src="${ec2}" alt="EC2" />
        <span class="service-name">EC2</span>
      </a>
    </div>
    <div class="card" data-service="lambda">
      <a class="sbutton" href="#">
        <img src="${lambda}" alt="Lambda" />
        <span class="service-name">Lambda</span>
      </a>
    </div>
    <div class="card" data-service="ecs">
      <a class="sbutton" href="#">
        <img src="${ecs}" alt="ECS" />
        <span class="service-name">ECS</span>
      </a>
    </div>
    <div class="card" data-service="ecr">
      <a class="sbutton" href="#">
        <img src="${ecr}" alt="ECR" />
        <span class="service-name">ECR</span>
      </a>
    </div>
    <div class="card" data-service="rds">
    <a class="sbutton" href="#">
        <img src="${rds}" alt="RDS" />
        <span class="service-name">RDS</span>
        </a>
    </div>
    <div class="card" data-service="dynamodb">
    <a class="sbutton" href="#">
        <img src="${dynamodb}" alt="DynamoDB" />
        <span class="service-name">DynamoDB</span>
        </a>
    </div>
    <div class="card" data-service="redshift">
    <a class="sbutton" href="#">
        <img src="${redshift}" alt="Redshift" />
        <span class="service-name">Redshift</span>
        </a>
    </div>
    <div class="card" data-service="iam">
    <a class="sbutton" href="#">
        <img src="${iam}" alt="IAM" />
        <span class="service-name">IAM</span>
        </a>
    </div>
    <div class="card" data-service="eventbridge">
    <a class="sbutton" href="#">
        <img src="${eventbridge}" alt="EventBridge" />
        <span class="service-name">EventBridge</span>
        </a>
    </div>

</div>
      
    </div>
  </section>
  
  <section class="section2">
    <h2 class="sectionTitle">Step 2</h2>
    
    <hr class="sectionTitleRule2">
    
    <article class="section2Content">
      <h2 class="sectionContentTitle">Copy Auto Generated IAM Read-only Policy</h2>
      
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
  </div>    </article>
    
    
  </section>
  
	  
  <section class="section2">
    <h2 class="sectionTitle">Step 3</h2>
    <hr class="sectionTitleRule2">
    
    <article class="section2Content">
      <h2 class="sectionContentTitle">Create a User in your AWS Account</h2>
      <div>
          <img src="https://s3.eu-north-1.amazonaws.com/cloudtoolbox.tech/app/ctb-01.gif"></img>
      </div>
    </article>
  </section>

  <section class="section2">
  <h2 class="sectionTitle">Step 4</h2>
  <hr class="sectionTitleRule2">
  
  <article class="section2Content">
    <h2 class="sectionContentTitle">Create Access key for the Created User</h2>
    <p> !!! Save Access key and Secret Key</p>
    <div>
      <img src="https://s3.eu-north-1.amazonaws.com/cloudtoolbox.tech/app/ctb-02.gif"></img>
    </div>
  </article>
</section>
  
<section class="section2">
<h2 class="sectionTitle">Step 5</h2>
<hr class="sectionTitleRule2">

<article class="section2Content">
  <h2 class="sectionContentTitle">Install AWS CLI</h2>
  <p> Download and Install AWS CLI from <a href="https://aws.amazon.com/cli/">https://aws.amazon.com/cli/</a></p>
  <div>
  <img src="https://s3.eu-north-1.amazonaws.com/cloudtoolbox.tech/app/ctb-03.gif"></img>
  </div>
</article>
</section>


<section class="section2">
<h2 class="sectionTitle">Step 6</h2>
<hr class="sectionTitleRule2">

<article class="section2Content">
  <h2 class="sectionContentTitle">Setup AWS Profile using Terminal</h2>
  <p > <code>aws configure</code></p>
  <div>
  <img src="https://s3.eu-north-1.amazonaws.com/cloudtoolbox.tech/app/ctb-04.gif"></img>
  </div>
</article>
</section>



<section class="section2">
<h2 class="sectionTitle">Step 7</h2>
<hr class="sectionTitleRule2">

<article class="section2Content">
  <h2 class="sectionContentTitle">Restart VS Code. Now you can see your profile with default profile name.</h2>
  <div>
  <img src="https://i.imgur.com/xUO4FQG.png"></img>
  </div>
</article>
</section>


  <aside class="externalResourcesNav">

    <div class="externalResources"><a href="https://github.com/sinanartun/cloudtoolbox" title="Github Link">GITHUB</a> </div>
  </aside>
</section>
        <script src="${jquery}"></script>
        <script src="${bootstrap}"></script>
        <script src="${scriptUri}"></script>
      </body>
    
    </html>



`;
  } catch (error) {
    console.error('Failed to set EC2 HTML content:', error);
    vscode.window.showErrorMessage('An error occurred while setting up the EC2 dashboard.');
  }
}
