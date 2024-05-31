let dashboardChart = null;
let mapChart = null;
let dashboardType = 'dashboard';

let ecsObj = {
  intervalValue: 0,
  timerInterval: null,
  updateOnFly: false,
};

let dt = null;
const t0 = 'Region';
const t1 = 'Cluster';
const t2 = 'Service';
const t3 = 'Task';

let data = null;

async function initializeDashboardChart() {
  data = [['us-east-1', 0, 0, 0]];

  dashboardChart = await Dashboards.board(
    'container',
    {
      dataPool: {
        connectors: [
          {
            id: t0,
            type: 'JSON',
            options: {
              columnNames: [t0, t1, t2, t3],
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
                  easing: 'easeOutBounce',
                },
                events: {
                  click: function (event) {
                    const region = event.point.name;
                    const type = 'cluster';
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
            id: t0,
            columnAssignment: [
              {
                seriesId: 'v2',
                data: [t0, t2],
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
                  easing: 'easeOutBounce',
                },
                events: {
                  click: function (event) {
                    const region = event.point.name;
                    const type = 'service';
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
            id: t0,
            columnAssignment: [
              {
                seriesId: 'v3',
                data: [t0, t3],
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
                  easing: 'easeOutBounce',
                },
                events: {
                  click: function (event) {
                    const region = event.point.name;
                    const type = 'task';
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
    const regionConnector = await dashboardChart.dataPool.getConnector(t0);

    const dashboardComponents = await dashboardChart.mountedComponents;
    if (regionConnector && regionConnector.options) {
      regionConnector.options.data = newData;

      dashboardComponents.forEach((comp, i) => {
        if (comp.component && comp.component.chart && comp.component.chart.series[0] && comp.component.type && comp.component.type === 'Highcharts') {
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
  try {
    if (newData.args.type === 'cluster') {
      transformedData = await transformClusterData(newData);
    } else if (newData.args.type === 'service') {
      transformedData = await transformServiceData(newData);
    } else if (newData.args.type === 'task') {
      transformedData = await transformTaskData(newData);
    }
    
    await renderDataTable(transformedData.rows, transformedData.columns);
    await updateTableTitle(newData.args.type);
  } catch (error) {
    console.error('Failed to update dashboard data:', error);
  }
}

async function transformClusterData(clusterList) {
  const dataTableRows = clusterList.data.map((cluster) => {
    return {
      Region: clusterList.args.region,
      ClusterName: cluster.clusterName,
      ClusterArn: cluster.clusterArn,
      Status: cluster.status,
      ActiveServicesCount: cluster.activeServicesCount,
      RunningTasksCount: cluster.runningTasksCount,
      PendingTasksCount: cluster.pendingTasksCount,
      RegisteredContainerInstancesCount: cluster.registeredContainerInstancesCount,
    };
  });

  const columns = [
    {
      className: 'dt-control ctb no-wrap',
      orderable: false,
      data: null,
      defaultContent: '',
    },
    { title: t0, data: t0, visible: true, className: 'ctb-nw' },
    { title: 'ClusterName', data: 'ClusterName', visible: true, className: 'ctb-nw' },
    { title: 'ClusterArn', data: 'ClusterArn', visible: false },
    { title: 'Status', data: 'Status', visible: true },
    { title: 'ActiveServicesCount', data: 'ActiveServicesCount', visible: true },
    { title: 'RunningTasksCount', data: 'RunningTasksCount', visible: true },
    { title: 'PendingTasksCount', data: 'PendingTasksCount', visible: true },
    { title: 'RegisteredContainerInstancesCount', data: 'RegisteredContainerInstancesCount', visible: true },
  ];

  return { columns, rows: dataTableRows };
}

async function transformServiceData(serviceList) {
  console.log(serviceList);
  const dataTableRows = serviceList.data.map((service) => {
    return {
      Region: serviceList.args.region,
      ServiceName: service.serviceName,
      ServiceArn: service.serviceArn,
      ClusterArn: service.clusterArn,
      Status: service.status,
      DesiredCount: service.desiredCount,
      RunningCount: service.runningCount,
      PendingCount: service.pendingCount,
      CreatedAt: formatDate(service.createdAt, false),
      CreatedBy: service.createdBy,
      DeploymentConfiguration: JSON.stringify(service.deploymentConfiguration),
      DeploymentController: service.deploymentController.type,
      Deployments: service.deployments.map((d) => ({
        id: d.id,
        desiredCount: d.desiredCount,
        runningCount: d.runningCount,
        pendingCount: d.pendingCount,
        status: d.status,
        taskDefinition: d.taskDefinition,
        createdAt: new Date(d.createdAt).toISOString(),
        updatedAt: new Date(d.updatedAt).toISOString(),
        rolloutState: d.rolloutState,
        rolloutStateReason: d.rolloutStateReason,
      })),
      Events: service.events.map((e) => ({
        id: e.id,
        createdAt: new Date(e.createdAt).toISOString(),
        message: e.message,
      })),
      NetworkConfiguration: JSON.stringify(service.networkConfiguration),
      PlatformFamily: service.platformFamily,
      PlatformVersion: service.platformVersion,
      RoleArn: service.roleArn,
      SchedulingStrategy: service.schedulingStrategy,
      TaskDefinition: service.taskDefinition,
      HealthCheckGracePeriodSeconds: service.healthCheckGracePeriodSeconds,
      LoadBalancers: JSON.stringify(service.loadBalancers),
      PlacementConstraints: JSON.stringify(service.placementConstraints),
      PlacementStrategy: JSON.stringify(service.placementStrategy),
      EnableExecuteCommand: service.enableExecuteCommand,
      EnableECSManagedTags: service.enableECSManagedTags,
      ServiceRegistries: JSON.stringify(service.serviceRegistries),
    };
  });

  const columns = [
    {
      className: 'dt-control ctb no-wrap',
      orderable: false,
      data: null,
      defaultContent: '',
    },
    { title: t0, data: t0, visible: true, className: 'ctb-nw' },
    { title: 'ServiceName', data: 'ServiceName', visible: true },
    { title: 'ServiceArn', data: 'ServiceArn', visible: false },
    { title: 'ClusterArn', data: 'ClusterArn', visible: false },
    { title: 'Status', data: 'Status', visible: true },
    { title: 'DesiredCount', data: 'DesiredCount', visible: true },
    { title: 'RunningCount', data: 'RunningCount', visible: true },
    { title: 'PendingCount', data: 'PendingCount', visible: true },
    { title: 'CreatedAt', data: 'CreatedAt', visible: true, className: 'ctb-nw' },
    { title: 'CreatedBy', data: 'CreatedBy', visible: true },
    { title: 'DeploymentConfiguration', data: 'DeploymentConfiguration', visible: false },
    { title: 'DeploymentController', data: 'DeploymentController', visible: false },
    { title: 'Deployments', data: 'Deployments', visible: false },
    { title: 'Events', data: 'Events', visible: false },
    { title: 'NetworkConfiguration', data: 'NetworkConfiguration', visible: false },
    { title: 'PlatformFamily', data: 'PlatformFamily', visible: false },
    { title: 'PlatformVersion', data: 'PlatformVersion', visible: false },
    { title: 'RoleArn', data: 'RoleArn', visible: false },
    { title: 'SchedulingStrategy', data: 'SchedulingStrategy', visible: false },
    { title: 'TaskDefinition', data: 'TaskDefinition', visible: false },
    { title: 'HealthCheckGracePeriodSeconds', data: 'HealthCheckGracePeriodSeconds', visible: false },
    { title: 'LoadBalancers', data: 'LoadBalancers', visible: false },
    { title: 'PlacementConstraints', data: 'PlacementConstraints', visible: false },
    { title: 'PlacementStrategy', data: 'PlacementStrategy', visible: false },
    { title: 'EnableExecuteCommand', data: 'EnableExecuteCommand', visible: false },
    { title: 'EnableECSManagedTags', data: 'EnableECSManagedTags', visible: false },
    { title: 'ServiceRegistries', data: 'ServiceRegistries', visible: false },
  ];

  return { columns, rows: dataTableRows };
}

async function transformTaskData(taskList) {
  console.log(taskList);
  const dataTableRows = taskList.data.map((task) => {
    return {
      Attachments: JSON.stringify(task.attachments),
      Attributes: JSON.stringify(task.attributes),
      AvailabilityZone: task.availabilityZone,
      CapacityProviderName: task.capacityProviderName,
      ClusterArn: task.clusterArn,
      Connectivity: task.connectivity,
      ConnectivityAt:formatDate( task.connectivityAt,false),
      Containers: task.containers.map((c) => ({
        containerArn: c.containerArn,
        cpu: c.cpu,
        healthStatus: c.healthStatus,
        image: c.image,
        imageDigest: c.imageDigest,
        lastStatus: c.lastStatus,
        name: c.name,
        networkBindings: JSON.stringify(c.networkBindings),
        networkInterfaces: JSON.stringify(c.networkInterfaces),
        runtimeId: c.runtimeId,
        taskArn: c.taskArn,
      })),
      Cpu: task.cpu,
      CreatedAt: formatDate( task.createdAt,false),
      DesiredStatus: task.desiredStatus,
      EnableExecuteCommand: task.enableExecuteCommand,
      EphemeralStorage: JSON.stringify(task.ephemeralStorage),
      Group: task.group,
      HealthStatus: task.healthStatus,
      LastStatus: task.lastStatus,
      LaunchType: task.launchType,
      Memory: task.memory,
      Overrides: JSON.stringify(task.overrides),
      PlatformFamily: task.platformFamily,
      PlatformVersion: task.platformVersion,
      PullStartedAt:formatDate( task.pullStartedAt,false),
      PullStoppedAt: formatDate( task.pullStoppedAt,false),
      StartedAt: formatDate( task.startedAt,false),
      StartedBy: task.startedBy,
      Tags: JSON.stringify(task.tags),
      TaskArn: task.taskArn,
      TaskDefinitionArn: task.taskDefinitionArn,
      Version: task.version,
    };
  });

  const columns = [
    {
      className: 'dt-control ctb no-wrap',
      orderable: false,
      data: null,
      defaultContent: '',
    },

    { title: 'Attachments', data: 'Attachments', visible: false },
    { title: 'Attributes', data: 'Attributes', visible: false },
    { title: 'AvailabilityZone', data: 'AvailabilityZone', visible: true },
    { title: 'HealthStatus', data: 'HealthStatus', visible: true },
    { title: 'LastStatus', data: 'LastStatus', visible: true },
    { title: 'CapacityProviderName', data: 'CapacityProviderName', visible: false },
    { title: 'ClusterArn', data: 'ClusterArn', visible: false },
    { title: 'Connectivity', data: 'Connectivity', visible: false },
    { title: 'ConnectivityAt', data: 'ConnectivityAt', visible: false, className: 'ctb-nw' },
    { title: 'Containers', data: 'Containers', visible: false },
    { title: 'Cpu', data: 'Cpu', visible: false },
    { title: 'CreatedAt', data: 'CreatedAt', visible: true, className: 'ctb-nw' },
    { title: 'StartedAt', data: 'StartedAt', visible: true, className: 'ctb-nw' },
    { title: 'DesiredStatus', data: 'DesiredStatus', visible: true },
    { title: 'EnableExecuteCommand', data: 'EnableExecuteCommand', visible: false },
    { title: 'EphemeralStorage', data: 'EphemeralStorage', visible: false },
    { title: 'Group', data: 'Group', visible: false },

   
    { title: 'LaunchType', data: 'LaunchType', visible: false },
    { title: 'Memory', data: 'Memory', visible: true },
    { title: 'Overrides', data: 'Overrides', visible: false },
    { title: 'PlatformFamily', data: 'PlatformFamily', visible: false },
    { title: 'PlatformVersion', data: 'PlatformVersion', visible: false },
    { title: 'PullStartedAt', data: 'PullStartedAt', visible: false, className: 'ctb-nw' },
    { title: 'PullStoppedAt', data: 'PullStoppedAt', visible: false, className: 'ctb-nw' },
    
    { title: 'StartedBy', data: 'StartedBy', visible: false },
    { title: 'Tags', data: 'Tags', visible: false },
    { title: 'TaskArn', data: 'TaskArn', visible: false },
    { title: 'TaskDefinitionArn', data: 'TaskDefinitionArn', visible: false },
    { title: 'Version', data: 'Version', visible: true },
  ];

  return { columns, rows: dataTableRows };
}

function drillDown(args) {
  if (ecsObj.updateOnFly) {
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
  } else if (message.command === 'drillDown') {
    await renderDrillDown(message.data);
  }
}

const requestChartData = () => {
  if (ecsObj.updateOnFly) {
    return;
  } else {
    startLoading();

    vscode.postMessage({
      command: 'requestData',
    });
  }
};

const init = () => {
  initializeDashboardChart();
  document.getElementById('interval').addEventListener('change', function () {
    ecsObj.intervalValue = parseInt(this.value, 10);
    if (ecsObj.intervalValue < 1) {
      stopDashboardChartInterval();
    } else {
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

  let defColumns = [{ title: t0 }, { title: t1 }, { title: t2 }, { title: t3 }];

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

// Initialize the DataTable and use the custom feature
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
    console.log('dt');
    console.log(dt.settings());

    if (row.child.isShown()) {
      row.child.hide();
    } else {
      row.child(reFormatRow(row.data())).show();
    }
  });
};

function reFormatRow(data) {
  const table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  console.log('reFormatRow');
  console.log(data);
  const regionName = data?.Region || 'us-east-1';
  function padKey(key, length) {
    return key + ' '.repeat(length - key.length);
  }

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      let celval = multiFormatCell(data[key]);
      if (Array.isArray(celval)) {
        if (celval.length === 1) {
          const row = table.insertRow();
          const cellKey = row.insertCell();
          const cellValue = row.insertCell();

          cellKey.style.border = cellValue.style.border = '1px solid black';
          cellKey.style.padding = cellValue.style.padding = '5px';
          cellKey.className = cellValue.className = 'code-block';
          if (key === 'Role') {
            const link = `https://us-east-1.console.aws.amazon.com/iam/home?#/roles/details/${roleName}?section=permissions`;
            cellKey.textContent = `${capitalizeFirstLetter(key)}:`;
            cellValue.innerHTML = celval[0] + ` <a href="${link}" target="_blank" rel="noopener noreferrer"><i class="fa fa-link"></i></a>`;
          } else if (key === 'ServiceName') {
            if (data?.Region && celval[0]) {
              //https://eu-central-1.console.aws.amazon.com/ecs/v2/clusters/ays-be-test-cluster/services/ays-be-test-service/health?region=eu-central-1
              const clusterName = data.ClusterArn.split('/').pop();
              const link = `https://${data?.Region}.console.aws.amazon.com/ecs/v2/clusters/${clusterName}/services/${celval[0]}/deployments?region=${data?.Region}`;
              cellKey.textContent = `${key}:`;
              cellValue.innerHTML = `${celval[0]} <a href="${link}" target="_blank" rel="noopener noreferrer"><i class="fa fa-link"></i></a>`;
            } else {
              cellKey.textContent = `${key}:`;
              cellValue.textContent = celval[0];
            }
          } else if (key === 'Deployments') {
            if (typeof celval[0] === 'object') {
              cellKey.textContent = `${key}:`;
              cellValue.innerHTML = '';
              let deploymentHtml = '<pre>';

              const maxLength = Math.max(...Object.keys(celval[0]).map((k) => k.length));
              for (const [dKey, dValue] of Object.entries(celval[0])) {
                if (dKey === 'createdAt' || dKey === 'updatedAt') {
                  deploymentHtml += `${padKey(dKey, maxLength)} : ${formatDate(dValue)}\n`;
                } else {
                  deploymentHtml += `${padKey(dKey, maxLength)} : ${dValue}\n`;
                }
              }

              deploymentHtml += '</pre>';
              cellValue.innerHTML = deploymentHtml;
            } else {
              cellKey.textContent = `${key}:`;
              cellValue.innerHTML = `${celval[0]}`;
            }
          } else if (['DeploymentConfiguration', 'NetworkConfiguration', 'LoadBalancers', 'Attachments', 'Attributes', 'Overrides', 'Tags'].includes(key)) {
            console.log('DeploymentConfiguration');
            console.log(typeof celval[0]);
            const celVal = JSON.parse(celval[0]);
            const celValString = JSON.stringify(celVal, undefined, 2);
            cellKey.textContent = `${key}:`;
            cellValue.innerHTML = `<pre>${celValString}</pre>`;
          } else if (['CreatedAt', 'ConnectivityAt', 'PullStartedAt', 'PullStoppedAt', 'StartedAt'].includes(key)) {
            cellKey.textContent = `${key}:`;
            cellValue.textContent = `${formatDate(celval[0])}`;
          } else {
            cellKey.textContent = `${key}:`;
            cellValue.textContent = celval[0];
          }
        } else {
          celval.forEach((item, index) => {
            const additionalRow = table.insertRow();
            const additionalCellKey = additionalRow.insertCell();
            const additionalCellValue = additionalRow.insertCell();
            if (typeof item === 'object') {
              additionalCellKey.textContent = `${key}_${index}:`;

              let deploymentHtml = '<pre>';

              const maxLength = Math.max(...Object.keys(item).map((k) => k.length));
              for (const [dKey, dValue] of Object.entries(item)) {
                if (dKey === 'createdAt' || dKey === 'updatedAt') {
                  deploymentHtml += `${padKey(dKey, maxLength)} : ${formatDate(dValue)}\n`;
                } else {
                  deploymentHtml += `${padKey(dKey, maxLength)} : ${dValue}\n`;
                }
              }

              deploymentHtml += '</pre>';
              additionalCellValue.innerHTML = deploymentHtml;
            } else {
              additionalCellKey.textContent = `${key}_${index}:`;
              additionalCellValue.innerHTML = `${item}`;
            }

            additionalCellKey.style.border = additionalCellValue.style.border = '1px solid black';
            additionalCellKey.style.padding = additionalCellValue.style.padding = '5px';
            additionalCellKey.className = additionalCellValue.className = 'code-block';
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
function multiFormatCell(val) {
  if (typeof val === 'string') {
    return val.split('<br/>');
  }
  return Array.isArray(val) ? val : [val]; // Ensuring this always returns an array
}

function formatDate(createdDate, ago = true) {
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
  return `${formattedDate}${ago ? ' ( ' + timeAgo + ' )' : ''}`;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const startDashboardChartInterval = () => {
  if (ecsObj.timerInterval) {
    clearInterval(ecsObj.timerInterval);
  }
  if (ecsObj.intervalValue > 0) {
    ecsObj.timerInterval = setInterval(() => {
      requestChartData();
    }, ecsObj.intervalValue * 1000);
  }
};

const stopDashboardChartInterval = () => {
  if (ecsObj.timerInterval) {
    clearInterval(ecsObj.timerInterval);
  }
};

function startLoading() {
  ecsObj.updateOnFly = true;

  const refreshButton = document.getElementById('refresh-button');
  if (refreshButton && refreshButton.classList && !refreshButton.classList.contains('rotating')) {
    refreshButton.classList.add('rotating');
  }
  const loadingDiv = document.getElementById('loading');
  const timerSpan = document.getElementById('timer');
  let startTime = Date.now();
  timerSpan.textContent = '00:00:00';
  loadingDiv.style.display = 'block';

  ecsObj.timerInterval = setInterval(() => {
    let timeElapsed = Date.now() - startTime;
    let minutes = Math.floor(timeElapsed / 60000);
    let seconds = Math.floor((timeElapsed % 60000) / 1000);
    let milliseconds = Math.floor((timeElapsed % 1000) / 10);
    timerSpan.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
  }, 10);
}

function stopLoading() {
  ecsObj.updateOnFly = false;

  const refreshButton = document.getElementById('refresh-button');
  if (refreshButton && refreshButton.classList && refreshButton.classList.contains('rotating')) {
    refreshButton.classList.remove('rotating');
  }
  const loadingDiv = document.getElementById('loading');
  if (loadingDiv && loadingDiv.style) {
    loadingDiv.style.display = 'none';
  }
  if (ecsObj.timerInterval) {
    clearInterval(ecsObj.timerInterval);
    ecsObj.timerInterval = null;
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
