window.addEventListener('load', function () {
  const selectAllButton = document.querySelector('#selectAll');
  const serviceButtons = document.querySelectorAll('.sbutton');
  const cards = document.querySelectorAll('.card');
  let isAllSelected = false;

  serviceButtons.forEach((button) => {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      const card = this.closest('.card');
      card.classList.toggle('selected-service');
      updateContent();
      checkIfAllSelected();
    });
  });

  selectAllButton.addEventListener('click', () => {
    isAllSelected = !isAllSelected; // Toggle the state
    cards.forEach((card) => {
      if (isAllSelected) {
        card.classList.add('selected-service');
      } else {
        card.classList.remove('selected-service');
      }
    });
    updateContent();
    updateSelectAllButtonText();
  });

  document.querySelector('#policyBox, #copyButton').addEventListener('click', () => {
    copyCodeToClipboard('#policyBox');
  });

  // Update the "Select All" button text based on the current selection state
  function updateSelectAllButtonText() {
    const selectedCount = document.querySelectorAll('.card.selected-service').length;
    if (selectedCount === cards.length) {
      selectAllButton.textContent = `Deselect All (${selectedCount})`;
    } else {
      selectAllButton.textContent = `Select All (${selectedCount})`;
    }
  }

  // Check if all services are selected and update the button text
  function checkIfAllSelected() {
    const selectedCount = document.querySelectorAll('.card.selected-service').length;
    isAllSelected = selectedCount === cards.length;
    updateSelectAllButtonText();
  }

  // Initial update in case some cards are pre-selected
  checkIfAllSelected();
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
    vpc: ['ec2:DescribeVpcs', 'ec2:DescribeSubnets', 'ec2:DescribeRouteTables', 'ec2:DescribeInternetGateways', 'ec2:DescribeNatGateways', 'ec2:DescribeVpcPeeringConnections'],
    eventbridge: ['events:ListRules', 'events:ListEventBuses', 'scheduler:ListSchedules', 'pipes:ListPipes'],
    costexplorer:["costexplorer:GetCostAndUsage","costexplorer:GetDimensionValues","sts:GetCallerIdentity"],
  };

  const statements = selectedServices
    .map((service) => {
      const actions = serviceActionMap[service];
      return actions
        ? {
            Sid: service,
            Effect: 'Allow',
            Action: actions,
            Resource: '*',
          }
        : null;
    })
    .filter((statement) => statement !== null); // Remove any null entries

  // Add the DescribeRegions action in a separate statement
  if (statements.length > 0) {
    // Check if there's at least one selected service
    statements.push({
      Sid: 'DescribeRegions',
      Effect: 'Allow',
      Action: ['ec2:DescribeRegions'],
      Resource: '*',
    });
  }

  // Construct policy object
  const policy = {
    Version: '2012-10-17',
    Statement: statements,
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
