window.addEventListener('load', function () {
  document.querySelectorAll('.sbutton').forEach((button) => {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      const card = this.closest('.card');
      card.classList.toggle('selected-service');

      updateContent();
    });
  });

  document.querySelector('#policyBox, #copyButton').addEventListener('click', () => {
    copyCodeToClipboard('#policyBox');
  });
});

function updateContent() {
  const selectedServiceCards = document.querySelectorAll('.card.selected-service');
  const selectedServices = Array.from(selectedServiceCards).map((card) => card.getAttribute('data-service'));
  renderPolicy(selectedServices);
}

function renderPolicy(selectedServices) {
    const serviceActionMap = {
      ec2: ['ec2:DescribeInstances', 'ec2:DescribeAddresses', 'autoscaling:DescribeAutoScalingGroups'],
      ecs: ['ecs:ListClusters', 'ecs:ListServices', 'ecs:ListTasks'],
      ecr: ['ecr:DescribeRepositories', 'ecr:DescribeImages'],
      dynamodb: ['dynamodb:ListTables', 'dynamodb:DescribeTable', 'dynamodb:ListBackups'],
      iam: ['iam:ListUsers', 'iam:GetUser', 'iam:ListGroupsForUser', 'iam:ListAttachedUserPolicies', 'iam:ListRoles', 'cloudtrail:LookupEvents'],
      lambda: ['lambda:ListFunctions', 'lambda:GetFunction', 'lambda:ListLayers', 'serverlessrepo:ListApplications'],
      rds: ['rds:DescribeDBInstances', 'rds:DescribeDBClusters', 'rds:DescribeDBClusterSnapshots', 'rds:DescribeDBClusterAutomatedBackups', 'rds:DescribeDBSnapshots'],
      redshift: ['redshift:DescribeClusters', 'redshift:DescribeClusterSnapshots', 'redshift-serverless:ListWorkgroups'],
      s3: ['s3:ListAllMyBuckets', 's3:GetBucketLocation'],
      sns: ['sns:ListTopics'],
      vpc: ['ec2:DescribeVpcs', 'ec2:DescribeSubnets', 'ec2:DescribeRouteTables', 'ec2:DescribeInternetGateways', 'ec2:DescribeNatGateways', 'ec2:DescribeVpcPeeringConnections']
    };
  

    Object.keys(serviceActionMap).forEach(service => {
      serviceActionMap[service].push('ec2:DescribeRegions');
    });
  
  
    const statements = selectedServices.map(service => {
      const actions = serviceActionMap[service];
      return actions ? {
        Sid: service,
        Effect: 'Allow',
        Action: actions,
        Resource: '*'
      } : null;
    }).filter(statement => statement !== null); // Remove any null entries
  
    // Construct policy object
    const policy = {
      Version: '2012-10-17',
      Statement: statements
    };
  
    // Convert policy to JSON string
    const policyStr = JSON.stringify(policy, null, 4);
    const policyElement = document.getElementById('policyBox');
    policyElement.textContent = policyStr;
  
    // Highlight syntax using Prism
    Prism.highlightElement(policyElement);
  }
  

/**
 * Copies text from a specified code block to the clipboard.
 * @param {string} selector - The selector for the code block element.
 */
function copyCodeToClipboard(selector) {
  const codeElement = document.querySelector(selector);
  if (!codeElement) {
    console.error('Copy failed: No element found with the selector', selector);
    return;
  }

  const codeToCopy = codeElement.innerText;
  navigator.clipboard
    .writeText(codeToCopy)
    .then(() => {
      showTooltip('Copied to clipboard!');
      console.log('Copy successful');
    })
    .catch((err) => {
      showTooltip('Failed to copy!', true);
      console.error('Failed to copy text', err);
    });
}

/**
 * Shows a tooltip near the copying area.
 * @param {string} message - Message to display in the tooltip.
 * @param {boolean} error - Is this an error tooltip?
 */
function showTooltip(message, error = false) {
  const tooltip = document.querySelector('#copyTooltip');
  if (!tooltip) {
    console.error('Tooltip element not found');
    return;
  }

  tooltip.textContent = message;
  tooltip.style.backgroundColor = error ? 'red' : 'green';
  tooltip.classList.add('visible');

  setTimeout(() => {
    tooltip.classList.remove('visible');
  }, 2000);
}
