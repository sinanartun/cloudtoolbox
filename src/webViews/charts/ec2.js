let dashboardChart = null;
let mapChart = null;
let dashboardType = 'dashboard';

let ec2Obj = {
  intervalValue : 0,
  timerInterval : null,
  updateOnFly : false,
};

let dt = null;
const t0 = 'Region';
const t1 = 'All EC2';
const t2 = 'Running EC2';
const t3 = 'Stopped EC2';
const t4 = 'Terminated EC2';
const t5 = 'Elastic IP';
const t6 = 'Auto Scaling Groups';


let data = null;

async function initializeDashboardChart() {

  data = [
    ['us-east-1', 0, 0, 0, 0, 0, 0],
  ];
 

  dashboardChart = await Dashboards.board(
    'container',
    {
      dataPool: {
        connectors: [
          {
            id: t0,
            type: 'JSON',
            options: {
              columnNames: [t0, t1, t2, t3, t4, t5, t6],
              firstRowAsNames: false,
              data,
            },
          },
        ],
      },
      gui: {
        layouts: [
          {
            rows: [
              {
                cells: [
                  {
                    id: 'dashboard-col-0',
                  },
                  {
                    id: 'dashboard-col-1',
                  },
                  {
                    id: 'dashboard-col-2',
                  },
                ],
              },
            ],
          },
        ],
      },
      components: [
        {
          title: {
            text: t1,
            style: {
              fontSize: '14px',
              fontWeight: '200',
            },
          },
          sync: {
            extremes: true,
            data: true,
            dataGrid: true,
            dataGridColumns: true,
          },
          connector: {
            id: t0,
            columnAssignment: [
              {
                seriesId: 'v1',
                data: [t0, t1],
              },
            ],
          },
          renderTo: 'dashboard-col-0',
          type: 'Highcharts',
          chartOptions: {
            xAxis: {
              type: 'category',
              accessibility: {
                description: t1,
              },
            },
            yAxis: {
              title: {
                text: '',
              },
              width: '80%',
              showLastLabel: false,
              tickAmount: 5,
              tickInterval: 1,
            },
            credits: {
              enabled: false,
            },
            chart: {
              type: 'bar', 
              zoomType: null,
            },
            plotOptions: {
              series: {
                colorByPoint: true,
                dataLabels: {
                  enabled: true, 
                },
                animation: {
                  duration: 1000,
                  easing: 'easeOutBounce'
                },
                events: {
                  click: function (event) {
                    const region = event.point.name;
                    const type = 'allEc2';
                    const args = {
                      region,
                      type,
                    };

                    drillDown(args);
                  },
                },
              },
              bar: {
                
                pointPadding: 0.2,
                borderWidth: 0,
                dataLabels: {
                  enabled: true,
                  align: 'left', 
                  verticalAlign: 'middle', 
                  inside: false, 
                  horizontalAlign: 'middle', 
                  crop: false, 
                  overflow: 'none', 
                  formatter: function () {
                    return this.y === 0 ? '' : this.y;
                  },
                },
              },
            },
            title: {
              text: '',
            },
            tooltip: {
              pointFormat: '<b>{point.y}</b>',
              stickOnContact: true,
            },
            legend: {
              enabled: false,
            },
            lang: {
              accessibility: {
                chartContainerLabel: 'by Region',
              },
            },
            accessibility: {
              description: t1,
            },
            sync: {
              extremes: true,
              data: true,
            },
          },
        },
        {
          renderTo: 'dashboard-col-1',
          title: {
            text: t2,
            style: {
              fontSize: '14px',
              fontWeight: '200',
            },
          },
          sync: {
            extremes: true,
          },
          connector: {
            id: 'Region',
            columnAssignment: [
              {
                seriesId: 'v2',
                data: ['Region', t2],
              },
            ],
          },
          type: 'Highcharts',
          chartOptions: {
            xAxis: {
              type: 'category',
              accessibility: {
                description: t2,
              },
            },
            yAxis: {
              title: {
                text: '',
              },
              width: '80%',
              showLastLabel: false,
              tickAmount: 5,
              tickInterval: 1,
            },
            credits: {
              enabled: false,
            },
            chart: {
              type: 'bar',
              zoomType: null,
            },
            plotOptions: {
              series: {
                colorByPoint: true,
                animation: {
                  duration: 1000,
                  easing: 'easeOutBounce'
                },
                events: {
                  click: function (event) {
                    
                    const region = event.point.name;
                    const type = 'runningEc2';
                    const args = {
                      region,
                      type,
                    };
                    drillDown(args);
                  },
                },
              },
              bar: {
                
                pointPadding: 0.2,
                borderWidth: 0,
                dataLabels: {
                  enabled: true,
                  align: 'left', 
                  verticalAlign: 'middle', 
                  inside: false, 
                  horizontalAlign: 'middle', 
                  crop: false, 
                  overflow: 'none', 
                  formatter: function () {
                    return this.y === 0 ? '' : this.y;
                  },
                },
              },
            },
            tooltip: {
              pointFormat: '<b>{point.y}</b>',
              stickOnContact: true,
            },
            title: {
              text: '',
            },
            legend: {
              enabled: false,
            },
            lang: {
              accessibility: {
                chartContainerLabel: t2,
              },
            },
            accessibility: {
              description: t2,
            },
            sync: {
              extremes: true,
              data: true,
              dataGrid: true,
              dataGridColumns: true,
              updatedData: true,
            },
          },
        },
        {
          renderTo: 'dashboard-col-2',
          connector: {
            id: 'Region',
            columnAssignment: [
              {
                seriesId: 'v3',
                data: ['Region', t3],
              },
            ],
          },
          title: {
            text: t3,
            style: {
              fontSize: '14px',
              fontWeight: '200',
            },
          },
          sync: {
            extremes: true,
          },
          type: 'Highcharts',
          chartOptions: {
            xAxis: {
              type: 'category',
              accessibility: {
                description: t3,
              },
            },
            yAxis: {
              title: {
                text: '',
              },
              width: '80%',
              showLastLabel: false,
              tickAmount: 5,
              tickInterval: 1,
            },
            credits: {
              enabled: false,
            },
            chart: {
              type: 'bar',
              zoomType: null,
            },
            plotOptions: {
              series: {
                colorByPoint: true,
                animation: {
                  duration: 1000,
                  easing: 'easeOutBounce'
                },
                events: {
                  click: function (event) {
                    const region = event.point.name;
                    const type = 'stoppedEc2';
                    const args = {
                      region,
                      type,
                    };

                    drillDown(args);
                  },
                },
              },
              bar: {
                
                pointPadding: 0.2,
                borderWidth: 0,
                dataLabels: {
                  enabled: true,
                  align: 'left', 
                  verticalAlign: 'middle', 
                  inside: false, 
                  horizontalAlign: 'middle', 
                  crop: false, 
                  overflow: 'none', 
                  formatter: function () {
                    return this.y === 0 ? '' : this.y;
                  },
                },
              },
            },
            tooltip: {
              pointFormat: '<b>{point.y}</b>',
              stickOnContact: true,
            },
            title: {
              text: '',
            },
            legend: {
              enabled: false,
            },
            lang: {
              accessibility: {
                chartContainerLabel: t3,
              },
            },
            accessibility: {
              description: t3,
            },
          },
        },
      ],
    },
    true,
  );
  requestChartData();
}

  




async function updateDashboardData(newData) {
  if (!dashboardChart) {
    console.error('Dashboard is not initialized.');
    return;
  }

  stopLoading();


  try {
    const regionConnector = await dashboardChart.dataPool.getConnector('Region');
    
    const dashboardComponents = await dashboardChart.mountedComponents;
    if (regionConnector && regionConnector.options) {
      regionConnector.options.data = newData;
      
      dashboardComponents.forEach((comp, i) => {
        if (
          comp.component &&
          comp.component.chart &&
          comp.component.chart.series[0] &&
          comp.component.type &&
          comp.component.type === 'Highcharts'
        ) {
          const datapart = newData.map((data) => [data[0], data[i + 1]]);

          comp.component.chart.series[0].setData(datapart, {});
        }
      });
      renderDataTable(newData);
    } else {
      console.error('connector not found or cannot be updated.');
    }
  } catch (error) {
    console.error('Failed to update dashboard data:', error);
  }
}

async function updateTableTitle(newTitle) {
  let settings = dt.settings()[0];
  if (settings.tableTitleContainer) {
      settings.tableTitleContainer.innerText = newTitle;
  }
}


async function renderDrillDown(newData) {
  

  if (!dashboardChart) {
    console.error('Dashboard is not initialized.');
    return;
  }

  if (!Array.isArray(newData.data) || !newData.data.length || typeof newData.data[0] !== 'object') {
    console.error('Invalid or empty newData provided.');
    return;
  }

  stopLoading();
  let transformedData = '';
  let title = '';
  try {
    if (newData.args.type === 'allEc2') {
      transformedData = await transformEC2Data(newData);
      title = t1;
    } else if (newData.args.type === 'runningEc2') {
      transformedData = await transformEC2Data(newData);
      title = t2;
    } else if (newData.args.type === 'stoppedEc2') {
      transformedData = await transformEC2Data(newData);
      title = t3;
    }

    

    await renderDataTable(transformedData.rows, transformedData.columns);
    await updateTableTitle(title);
    
  } catch (error) {
    console.error('Failed to update dashboard data:', error);
  }
}


async function transformEC2Data(ec2List) {
  console.log('Transform', ec2List);
  const dataTableRows = ec2List.data.flatMap((reservation) => {
    return reservation.Instances.map((instance) => {
      // Extracting tags
     
      const nameTag = instance.Tags?.find((tag) => tag.Key === 'Name')?.Value || '';
      const Tags = instance.Tags?.filter((tag) => tag.Key !== 'Name').map((tag) => `${tag.Key}: ${tag.Value}`).join(', ');
      // Additional details
      const networkInterfaces = instance.NetworkInterfaces.map(ni => {
        return `${ni.NetworkInterfaceId}: ${ni.PrivateIpAddress} (Public IP: ${ni.Association?.PublicIp || 'N/A'})`;
      }).join('; ');

      const securityGroups = instance.SecurityGroups.map(sg => `${sg.GroupName} (${sg.GroupId})`).join(', ');

      // Extract instance block device mappings
      const blockDevices = instance.BlockDeviceMappings.map(bd => {
        return `${bd.DeviceName} - ${bd.Ebs.VolumeId} (Status: ${bd.Ebs.Status})`;
      }).join('; ');

      // Formatting LaunchTime
      const launchTime = new Date(instance.LaunchTime).toISOString().replace('T', ' ').slice(0, 19);

      return {
        
        Region: ec2List.args.region,
        Name: nameTag,
        InstanceId: instance.InstanceId,
        ImageId: instance.ImageId,
        InstanceType: instance.InstanceType,
        KeyName: instance.KeyName,
        LaunchTime: launchTime,
        State: instance.State.Name,
        PublicIpAddress: instance.PublicIpAddress || 'N/A',
        PrivateIpAddress: instance.PrivateIpAddress,
        VpcId: instance.VpcId,
        SubnetId: instance.SubnetId,
        SecurityGroups: securityGroups,
        NetworkInterfaces: networkInterfaces,
        BlockDeviceMappings: blockDevices,
        Hypervisor: instance.Hypervisor,
        VirtualizationType: instance.VirtualizationType,
        PlatformDetails: instance.PlatformDetails,
        RootDeviceType: instance.RootDeviceType,
        RootDeviceName: instance.RootDeviceName,
        EbsOptimized: instance.EbsOptimized ? 'Yes' : 'No',
        ENASupport: instance.EnaSupport ? 'Yes' : 'No',
        CPUOptions: `${instance.CpuOptions.CoreCount} cores, ${instance.CpuOptions.ThreadsPerCore} threads per core`,
        Tags: Tags,
      };
    });
  });

  const columns = [
    {
      className: 'dt-control ctb no-wrap',
      orderable: false,
      data: null,
      defaultContent: '',
    },
    { title: 'Region', data: 'Region', visible: true, className: 'ctb-nw'},
    { title: 'Name', data: 'Name', visible: true, className: 'ctb-nw'},
    { title: 'InstanceId', data: 'InstanceId', visible: true, className: 'ctb-nw'},
    { title: 'ImageId', data: 'ImageId', visible: false, className: 'ctb-nw' },
    { title: 'InstanceType', data: 'InstanceType', visible: true },
    { title: 'KeyName', data: 'KeyName', visible: true },
    { title: 'LaunchTime', data: 'LaunchTime', visible: false },
    { title: 'State', data: 'State', visible: true },
    { title: 'PublicIpAddress', data: 'PublicIpAddress', visible: true },
    { title: 'PrivateIpAddress', data: 'PrivateIpAddress', visible: false },
    { title: 'VpcId', data: 'VpcId', visible: false },
    { title: 'SubnetId', data: 'SubnetId', visible: false },
    { title: 'SecurityGroups', data: 'SecurityGroups', visible: false },
    { title: 'NetworkInterfaces', data: 'NetworkInterfaces', visible: false },
    { title: 'BlockDeviceMappings', data: 'BlockDeviceMappings', visible: false },
    { title: 'Hypervisor', data: 'Hypervisor', visible: false },
    { title: 'VirtualizationType', data: 'VirtualizationType', visible: false },
    { title: 'PlatformDetails', data: 'PlatformDetails', visible: false },
    { title: 'RootDeviceType', data: 'RootDeviceType', visible: false },
    { title: 'RootDeviceName', data: 'RootDeviceName', visible: false },
    { title: 'EbsOptimized', data: 'EbsOptimized', visible: false },
    { title: 'ENASupport', data: 'ENASupport', visible: false },
    { title: 'CPUOptions', data: 'CPUOptions', visible: false },
    { title: 'Tags', data: 'Tags', visible: true },
  ];

  return { columns, rows: dataTableRows };
}



function drillDown(args) {
  if (ec2Obj.updateOnFly) {
    return;
  } else {
    startLoading();

    vscode.postMessage({
      command: 'drillDown',
      args: args,
    });
  }
}


async function handleIncomingData(message) {
  if (message.command === 'updateData') {
    updateDashboardData(message.data);
  }else if (message.command === 'drillDown') {
    
    await renderDrillDown(message.data);
  }
}

function formatDate(createdDate) {
  if (!createdDate) {
    return '';
  }

  // Append 'Z' to indicate UTC if no timezone is specified
  const normalizedDate = createdDate.endsWith('Z') ? createdDate : `${createdDate}Z`;

  // Create date object using the normalized UTC date string
  const date = new Date(normalizedDate);
  const now = new Date();

  // Get the UTC date and time for 'now' to ensure comparison in UTC
  const nowUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));

  // Calculate the difference in time using UTC dates
  const diffTime = Math.abs(nowUTC - date);
  const diffMinutes = Math.ceil(diffTime / (1000 * 60));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Format the date as a readable string without the 'Z' (as it's already in UTC)
  const formattedDate = date.toISOString().replace('T', ' ').slice(0, 19);

  // Generate a 'time ago' string based on the UTC time difference
  let timeAgo = '';
  if (diffDays > 1) {
    timeAgo = `${diffDays} days ago`;
  } else if (diffHours > 1) {
    timeAgo = `${diffHours} hours ago`;
  } else if (diffMinutes > 1) {
    timeAgo = `${diffMinutes} minutes ago`;
  } else {
    timeAgo = 'just now';
  }

  // Return the UTC formatted date with the 'time ago' context
  return `${formattedDate} (${timeAgo})`;
}




const requestChartData = () => {
  if (ec2Obj.updateOnFly) {
    return;
  }else {

    startLoading();

    vscode.postMessage({
      command: 'requestData',
    });
  }
};


const init = () => {
  initializeDashboardChart();
  document.getElementById('interval').addEventListener('change', function () {
     ec2Obj.intervalValue = parseInt(this.value, 10);
     if (ec2Obj.intervalValue < 1) {
      stopDashboardChartInterval();
     }else {
      startDashboardChartInterval();
      }
    
  });

  document.getElementById('refresh-button').addEventListener('click', function () {
    requestChartData();
  });

  startDashboardChartInterval();

  renderDataTable();
};

const renderDataTable = async (rows = null, iColumns = null) => {
  if (dt) {
    dt.clear();
    dt.destroy();
  }

  const dtWrapper = document.getElementById('dtWrapper');
  if (!dtWrapper) {
    console.error('dtWrapper does not exist on the page.');
    return;
  }

  let oldDtTable = document.getElementById('dt');
  if (oldDtTable) {
    dtWrapper.removeChild(oldDtTable);
  }

  const newDtTable = document.createElement('table');
  newDtTable.id = 'dt';
  newDtTable.classList.add('display');
  newDtTable.classList.add('hover');
  newDtTable.style.width = '100vw';


  dtWrapper.appendChild(newDtTable);

  let defColumns = [{ title: t0 }, { title: t1 }, { title: t2 }, { title: t3 }, { title: t4 }, { title: t5 }, { title: t6 }];

  let defRows = [];

  DataTable.feature.register('tableTitle', function (settings, opts) {
    // Define defaults
    let options = Object.assign({
        title: t1
    }, opts);

    let container = document.createElement('div');
    container.id = 'table-title';
    container.innerText = options.title;

    // Insert the container into the DataTable's wrapper
    let tableWrapper = settings.nTableWrapper;
    tableWrapper.parentNode.insertBefore(container, tableWrapper);

    // Store the container reference in the settings
    settings.tableTitleContainer = container;

    return container;
});

  dt = new DataTable('#dt', {
    responsive: true,
    columns: iColumns ?? defColumns,
    data: rows ?? defRows,
    scrollY: 'auto',
    scrollCollapse: true,
    layout: {
        topStart: 'tableTitle',
        topEnd: 'search',
        bottomStart: 'pageLength',
        bottomEnd: 'paging'
    }
});

  dt.on('click', 'td.dt-control', function (e) {
    let tr = e.target.closest('tr');
    let row = dt.row(tr);

    if (row.child.isShown()) {
      
      row.child.hide();
    } else {
      
      row.child(reFormatRow(row.data())).show();
    }
  });
};

function multiFormatCell(val) {
  if (typeof val === 'string') {
    return val.split('<br/>');
  }
  return [val]; // Ensuring this always returns an array
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function reFormatRow(data) {
  const table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  console.log('reFormatRow');
  console.log(data);
  const regionName = data?.Region || 'us-east-1';
  
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const row = table.insertRow();
      const cellKey = row.insertCell();
      const cellValue = row.insertCell();

      cellKey.style.border = cellValue.style.border = '1px solid black';
      cellKey.style.padding = cellValue.style.padding = '5px';
      cellKey.className = cellValue.className = 'code-block';

      let celval = multiFormatCell(data[key]);
      if (Array.isArray(celval)) {
        if (celval.length === 1) {
          if (key === 'Role') {
            const roleName = celval[0].split('/').pop();
            const link = `https://us-east-1.console.aws.amazon.com/iam/home?#/roles/details/${roleName}?section=permissions`;
            cellKey.textContent = `${capitalizeFirstLetter(key)}:`;
            cellValue.innerHTML = celval[0] + ` <a href="${link}" target="_blank" rel="noopener noreferrer"><i class="fa fa-link"></i></a>`;
          } else if (key === 'InstanceId') {
            if(data?.Region && celval[0]){
              
              const link = `https://${data?.Region}.console.aws.amazon.com/ec2/home?region=${data?.Region}#InstanceDetails:instanceId=${celval[0]}`;
              cellKey.textContent = `${key}:`;
              cellValue.innerHTML = `${celval[0]} <a href="${link}" target="_blank" rel="noopener noreferrer"><i class="fa fa-link"></i></a>`;
            }else{
              cellKey.textContent = `${key}:`;
              cellValue.textContent = celval[0];
            }
            

          }else if (key === 'ImageId') {
            if(data?.Region && celval[0]){
              //https://eu-north-1.console.aws.amazon.com/ec2/home?region=eu-north-1#ImageDetails:imageId=ami-03c3351e3ce9d04eb
              const link = `https://${data?.Region}.console.aws.amazon.com/ec2/home?region=${data?.Region}#ImageDetails:imageId=${celval[0]}`;
              cellKey.textContent = `${key}:`;
              cellValue.innerHTML = `${celval[0]} <a href="${link}" target="_blank" rel="noopener noreferrer"><i class="fa fa-link"></i></a>`;
            }else{
              cellKey.textContent = `${key}:`;
              cellValue.textContent = celval[0];
            }
            

          }else if (key === 'KeyName') {
            if(data?.Region && celval[0]){
              //https://eu-north-1.console.aws.amazon.com/ec2/home?region=eu-north-1#KeyPairs:keyName=test
              const link = `https://${data?.Region}.console.aws.amazon.com/ec2/home?region=${data?.Region}#KeyPairs:keyName=${encodeURIComponent(celval[0])}`;
              cellKey.textContent = `${key}:`;
              cellValue.innerHTML = `${celval[0]} <a href="${link}" target="_blank" rel="noopener noreferrer"><i class="fa fa-link"></i></a>`;
            }else{
              cellKey.textContent = `${key}:`;
              cellValue.textContent = celval[0];
            }
            

          }else if (key === 'LaunchTime') {
            cellKey.textContent = `${key}:`;
            cellValue.textContent = `${formatDate(celval[0])}`;

          }else if (key === 'VpcId') {
            if(data?.Region && celval[0]){
              //https://eu-north-1.console.aws.amazon.com/vpcconsole/home?region=eu-north-1#VpcDetails:VpcId=vpc-05056c0ab36a56008
              const link = `https://${data?.Region}.console.aws.amazon.com/vpcconsole/home?region=${data?.Region}#VpcDetails:VpcId=${celval[0]}`;
              cellKey.textContent = `${key}:`;
              cellValue.innerHTML = `${celval[0]} <a href="${link}" target="_blank" rel="noopener noreferrer"><i class="fa fa-link"></i></a>`;
            }else{
              cellKey.textContent = `${key}:`;
              cellValue.textContent = celval[0];
            }
            

          }else if (key === 'SubnetId') {
            if(data?.Region && celval[0]){
              //https://eu-north-1.console.aws.amazon.com/vpcconsole/home?region=eu-north-1#SubnetDetails:subnetId=subnet-070cc0a0f3e587b0d
              const link = `https://${data?.Region}.console.aws.amazon.com/vpcconsole/home?region=${data?.Region}#SubnetDetails:subnetId=${celval[0]}`;
              cellKey.textContent = `${key}:`;
              cellValue.innerHTML = `${celval[0]} <a href="${link}" target="_blank" rel="noopener noreferrer"><i class="fa fa-link"></i></a>`;
            }else{
              cellKey.textContent = `${key}:`;
              cellValue.textContent = celval[0];
            }
            

          }else if (key === 'KeyName') {
            if(data?.Region && celval[0]){
              //https://eu-north-1.console.aws.amazon.com/ec2/home?region=eu-north-1#KeyPairs:keyName=test
              const link = `https://${data?.Region}.console.aws.amazon.com/ec2/home?region=${data?.Region}#KeyPairs:keyName=${encodeURIComponent(celval[0])}`;
              cellKey.textContent = `${key}:`;
              cellValue.innerHTML = `${celval[0]} <a href="${link}" target="_blank" rel="noopener noreferrer"><i class="fa fa-link"></i></a>`;
            }else{
              cellKey.textContent = `${key}:`;
              cellValue.textContent = celval[0];
            }
            

          }else if (key === 'LoggingConfig') {
            
            const logGroupName = celval[0].split('format in ').pop();
            const encodedLogGroupName = encodeURIComponent(logGroupName);
            const logGroupLink = `https://${regionName}.console.aws.amazon.com/cloudwatch/home?region=${regionName}#logsV2:log-groups/log-group/${encodedLogGroupName}`;
            cellKey.textContent = `${key}:`;
            cellValue.innerHTML = `${celval[0]} <a href="${logGroupLink}" target="_blank" rel="noopener noreferrer"><i class="fa fa-link"></i></a>`;

          }else if (key === 'LayerName' || key === 'CreatedDate') {

            const layerName = encodeURIComponent(celval[0]);
            const version = data?.Version || '1';
            const layerLink = `https://${regionName}.console.aws.amazon.com/lambda/home?region=${regionName}#/layers/${layerName}/versions/${version}?tab=versions`;
            cellKey.textContent = `${key}:`;
            cellValue.innerHTML = `${celval[0]} <a href="${layerLink}" target="_blank" rel="noopener noreferrer"><i class="fa fa-link"></i></a>`;

          }else if (key === 'LastModified') {

            cellKey.textContent = `${key}:`;
            cellValue.textContent = `${formatDate(celval[0])}`;

          } else {
            cellKey.textContent = `${key}:`;
            cellValue.textContent = celval[0];
          }

        } else {
          celval.forEach((item, index) => {
            if (index > 0) {
              const additionalRow = table.insertRow();
              const additionalCellKey = additionalRow.insertCell();
              const additionalCellValue = additionalRow.insertCell();

              additionalCellKey.textContent = `${key}_${index}:`;
              additionalCellValue.textContent = item;

              additionalCellKey.style.border = additionalCellValue.style.border = '1px solid black';
              additionalCellKey.style.padding = additionalCellValue.style.padding = '5px';
              additionalCellKey.className = additionalCellValue.className = 'code-block';
            } else {
              cellKey.textContent = `${key}_0:`;
              cellValue.textContent = item;
            }
          });
        }
      } else {
        cellKey.textContent = `${key}:`;
        cellValue.textContent = celval.toString();
      }
    }
  }

  return table.outerHTML;
}

const startDashboardChartInterval = () => {
  if (ec2Obj.timerInterval) {
    clearInterval(ec2Obj.timerInterval);
  }
  if (ec2Obj.intervalValue > 0) {
    ec2Obj.timerInterval = setInterval(() => {
      requestChartData();
    }, ec2Obj.intervalValue * 1000);
  }

};

const stopDashboardChartInterval = () => {
  if (ec2Obj.timerInterval) {
    clearInterval(ec2Obj.timerInterval);
  }
};

function startLoading() {
  ec2Obj.updateOnFly = true;

  const refreshButton = document.getElementById('refresh-button');
  if (refreshButton && refreshButton.classList && !refreshButton.classList.contains('rotating')) {
    refreshButton.classList.add('rotating');
  }
  const loadingDiv = document.getElementById('loading');
  const timerSpan = document.getElementById('timer');
  let startTime = Date.now();
  timerSpan.textContent = '00:00:00';
  loadingDiv.style.display = 'block';

  ec2Obj.timerInterval = setInterval(() => {
      let timeElapsed = Date.now() - startTime;
      let minutes = Math.floor(timeElapsed / 60000);
      let seconds = Math.floor((timeElapsed % 60000) / 1000);
      let milliseconds = Math.floor((timeElapsed % 1000) / 10);
      timerSpan.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
  }, 10);
}




function stopLoading() {
  ec2Obj.updateOnFly = false;

  const refreshButton = document.getElementById('refresh-button');
  if (refreshButton && refreshButton.classList && refreshButton.classList.contains('rotating')) {
    refreshButton.classList.remove('rotating');
  }
  const loadingDiv = document.getElementById('loading');
    if (loadingDiv && loadingDiv.style) {
        loadingDiv.style.display = 'none';
    }
    if (ec2Obj.timerInterval) {
      clearInterval(ec2Obj.timerInterval);
      ec2Obj.timerInterval = null;
  }
}


const destroyDashboardChart = async () => {
  if (!dashboardChart) {
    console.error('Dashboard is not initialized.');
    return;
  }
  await dashboardChart.destroy();
  dashboardChart = null;
};
