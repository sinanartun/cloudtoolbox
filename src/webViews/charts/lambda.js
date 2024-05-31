let dashboardChart = null;
let mapChart = null;
let dashboardType = 'dashboard';
let dt = null;

let lObj = {
  intervalValue: 0,
  timerInterval: null,
  updateOnFly: false,
};
const t0 = 'Region';
const t1 = 'Functions';
const t2 = 'Layers';
const t3 = 'Applications';
const t4 = 'Code Storage KB';

let data = null;

async function initializeDashboardChart() {
  data = [['us-east-1', 0, 0, 0, 0]];

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
                animation: {
                  duration: 1000,
                  easing: 'easeOutBounce',
                },
                dataLabels: {
                  enabled: true,
                },
                events: {
                  click: function (event) {
                    const region = event.point.name;
                    const type = 'function';
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
          connector: {
            id: t0,
            columnAssignment: [
              {
                seriesId: 'v2',
                data: [t0, t2],
              },
            ],
          },
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
              animation: {
                duration: 1000,
                easing: 'easeOutBounce',
              },
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
                    const type = 'layer';
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
          },
        },
        {
          renderTo: 'dashboard-col-2',
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
          connector: {
            id: t0,
            columnAssignment: [
              {
                seriesId: 'v3',
                data: [t0, t3],
              },
            ],
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
              animation: {
                duration: 1000,
                easing: 'easeOutBounce',
              },
            },
            plotOptions: {
              series: {
                dataLabels: {
                  enabled: true,
                },
                colorByPoint: true,
                animation: {
                  duration: 1000,
                  easing: 'easeOutBounce',
                },
                events: {
                  // click: function (event) {
                  //   const region = event.point.name;
                  //   const type = 'application';
                  //   const args = {
                  //     region,
                  //     type,
                  //   };

                  //   drillDown(args);
                  // },
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
            sync: {
              extremes: true,
              data: true,
              dataGrid: true,
              dataGridColumns: true,
              updatedData: true,
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

    if (!regionConnector || !regionConnector.options) {
      console.error('Required connectors not found or cannot be updated.');
      return;
    }

    regionConnector.options.data = newData;

    dashboardComponents.forEach((comp, i) => {
      if (comp.component) {
        if (comp.component.type === 'Highcharts' && comp.component.chart && comp.component.chart.series[0]) {
          const datapart = newData.map((data) => [data[0], data[i + 1]]);
          comp.component.chart.series[0].setData(datapart, {});
        }
      }
    });

    renderDataTable(newData);
  } catch (error) {
    console.error('Failed to update dashboard data:', error);
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
    if (newData.args.type === 'function') {
      console.log(newData);
      transformedData = await transformLambdaData(newData);
    } else if (newData.args.type === 'layer') {
     
      transformedData = await transformLayerData(newData);
    }else if (newData.args.type === 'application') {
      transformedData = await transformLayerData(newData);
    } 

    renderDataTable(transformedData.rows, transformedData.columns);
  } catch (error) {
    console.error('Failed to update dashboard data:', error);
  }
}

async function transformLambdaData(lambdaList) {
  const dateFormat = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
    hour12: false,
  });

  const dataTableRows = lambdaList.data.map((lambda) => {
    const Tags = lambda.Tags?.map((tag) => `${tag.Key}: ${tag.Value}`).join(', ') || '';
    const dateParts = dateFormat.formatToParts(new Date(lambda.LastModified));
    const parts = dateParts.reduce((acc, part) => {
      if (part.type !== 'literal') {
        acc[part.type] = part.value;
      }
      return acc;
    }, {});
    const formattedDate = `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;

    const environmentVariables = lambda.Environment?.Variables
      ? Object.entries(lambda.Environment.Variables)
          .map(([key, value]) => `${key}: ${value}`)
          .join('<br/>')
      : '';

    return {
      Region: lambdaList.args.region,
      FunctionName: lambda.FunctionName,
      Runtime: lambda.Runtime,
      Version: lambda.Version,
      PackageType: lambda.PackageType,
      MemorySize: `${lambda.MemorySize} MB`,
      Timeout: `${lambda.Timeout} seconds`,
      Handler: lambda.Handler,
      Description: lambda.Description,
      TracingConfig: lambda.TracingConfig.Mode,
      SnapStart: `${lambda.SnapStart.OptimizationStatus}, ${lambda.SnapStart.ApplyOn}`,
      RevisionId: lambda.RevisionId,
      LastModified: formattedDate,
      FunctionArn: lambda.FunctionArn,
      Role: lambda.Role,
      CodeSize: `${lambda.CodeSize} bytes`,
      LoggingConfig: `${lambda.LoggingConfig.LogFormat} format in ${lambda.LoggingConfig.LogGroup}`,
      EnvironmentVariables: environmentVariables,
      EphemeralStorage: `${lambda.EphemeralStorage.Size} MB`,
      Architectures: lambda.Architectures.join('<br/>'),
      Tags: Tags,
    };
  });

  const columns = [
    {
      className: 'dt-control ctb no-wrap',
      orderable: false,
      data: null,
      defaultContent: '',
    },
    { title: 'Region', data: 'Region', visible: true, className: 'ctb-nw' },
    { title: 'FunctionName', data: 'FunctionName', visible: true, className: 'ctb-nw' },
    { title: 'Runtime', data: 'Runtime', visible: true },
    { title: 'Version', data: 'Version', visible: true },
    { title: 'PackageType', data: 'PackageType', visible: true },
    { title: 'MemorySize', data: 'MemorySize', visible: true },
    { title: 'Timeout', data: 'Timeout', visible: true },
    { title: 'Handler', data: 'Handler', visible: false },
    { title: 'Description', data: 'Description', visible: true },
    { title: 'TracingConfig', data: 'TracingConfig', visible: false },
    { title: 'SnapStart', data: 'SnapStart', visible: false },
    { title: 'RevisionId', data: 'RevisionId', visible: false },
    { title: 'LastModified', data: 'LastModified', visible: true, className: 'ctb-nw' },
    { title: 'FunctionArn', data: 'FunctionArn', visible: false },
    { title: 'Role', data: 'Role', visible: false },
    { title: 'CodeSize', data: 'CodeSize', visible: true },
    { title: 'LoggingConfig', data: 'LoggingConfig', visible: false },
    { title: 'EnvironmentVariables', data: 'EnvironmentVariables', visible: false },
    { title: 'EphemeralStorage', data: 'EphemeralStorage', visible: false },
    { title: 'Architectures', data: 'Architectures', visible: true },
    { title: 'Tags', data: 'Tags', visible: true },
  ];

  return { columns, rows: dataTableRows };
}


async function transformLayerData(layerList) {
  const dateFormat = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
    hour12: false,
  });

  const dataTableRows = layerList.data.map((layer) => {
    const latestVersion = layer.LatestMatchingVersion;
    const dateParts = dateFormat.formatToParts(new Date(latestVersion.CreatedDate));
    const parts = dateParts.reduce((acc, part) => {
      if (part.type !== 'literal') {
        acc[part.type] = part.value;
      }
      return acc;
    }, {});
    const formattedDate = `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;

    return {
      Region: layerList.args.region,
      LayerName: layer.LayerName,
      LayerArn: layer.LayerArn,
      Version: latestVersion.Version,
      CreatedDate: formattedDate,
      CompatibleRuntimes: latestVersion.CompatibleRuntimes.join(', '),
      CompatibleArchitectures: latestVersion.CompatibleArchitectures.join(', '),
      LayerVersionArn: latestVersion.LayerVersionArn
    };
  });

  const columns = [
    {
      className: 'dt-control ctb no-wrap',
      orderable: false,
      data: null,
      defaultContent: '',
    },
    { title: 'Region', data: 'Region', visible: true, className: 'ctb-nw' },
    { title: 'LayerName', data: 'LayerName', visible: true, className: 'ctb-nw' },
    { title: 'LayerArn', data: 'LayerArn', visible: true },
    { title: 'Version', data: 'Version', visible: true },
    { title: 'CreatedDate', data: 'CreatedDate', visible: true, className: 'ctb-nw' },
    { title: 'CompatibleRuntimes', data: 'CompatibleRuntimes', visible: true },
    { title: 'CompatibleArchitectures', data: 'CompatibleArchitectures', visible: true },
    { title: 'LayerVersionArn', data: 'LayerVersionArn', visible: true }
  ];

  return { columns, rows: dataTableRows };
}


function drillDown(args) {
  if (lObj.updateOnFly) {
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
    stopLoading();
    await renderDrillDown(message.data);
  }
}

const requestChartData = () => {
  if (lObj.updateOnFly) {
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
    lObj.intervalValue = parseInt(this.value, 10);
    if (lObj.intervalValue < 500) {
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

const renderDataTable = (rows = null, iColumns = null) => {
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

  let defColumns = [{ title: t0 }, { title: t1 }, { title: t2 }, { title: t3 }, { title: t4 }];

  let defRows = [];

  dt = new DataTable('#dt', {
    responsive: true,
    columns: iColumns ?? defColumns,
    data: rows ?? defRows,
    scrollY: 'auto',
    scrollCollapse: true,
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
  return [val];
}

function formatDate(createdDate) {
  if (!createdDate) {
    return '';
  }


  const date = new Date(createdDate);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffMinutes = Math.ceil(diffTime / (1000 * 60));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const formattedDate = date.toISOString().replace('T', ' ').slice(0, 19);
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
  return `${formattedDate} (${timeAgo})`;
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
            const roleLink = `https://us-east-1.console.aws.amazon.com/iam/home?#/roles/details/${roleName}?section=permissions`;
            cellKey.textContent = `${capitalizeFirstLetter(key)}:`;
            cellValue.innerHTML = celval[0] + ` <a href="${roleLink}" target="_blank" rel="noopener noreferrer"><i class="fa fa-link"></i></a>`;
          } else if (key === 'EnvironmentVariables') {
            if(data?.FunctionName && celval[0]){
              const functionName = encodeURIComponent(data?.FunctionName) || '';
              const logGroupLink = `https://${regionName}.console.aws.amazon.com/lambda/home?region=${regionName}#/functions/${functionName}/edit/environment-variables?tab=configure`;
              cellKey.textContent = `${key}:`;
              cellValue.innerHTML = `${celval[0]} <a href="${logGroupLink}" target="_blank" rel="noopener noreferrer"><i class="fa fa-link"></i></a>`;
            }else{
              cellKey.textContent = `${key}:`;
              cellValue.textContent = celval[0];
            }
            

          }else if (key === 'FunctionName') {

            const functionName = encodeURIComponent(celval[0]);
            const functionLink = `https://${regionName}.console.aws.amazon.com/lambda/home?#/functions/${functionName}?tab=code`;
            cellKey.textContent = `${capitalizeFirstLetter(key)}:`;
            cellValue.innerHTML = celval[0] + ` <a href="${functionLink}" target="_blank" rel="noopener noreferrer"><i class="fa fa-link"></i></a>`;
          } else if (key === 'LoggingConfig') {
            
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
  if (lObj.timerInterval) {
    clearInterval(lObj.timerInterval);
  }
  if (lObj.intervalValue > 0) {
    lObj.timerInterval = setInterval(() => {
      requestChartData();
    }, lObj.intervalValue * 1000);
  }
};

const stopDashboardChartInterval = () => {
  if (lObj.timerInterval) {
    clearInterval(lObj.timerInterval);
  }
};

function startLoading() {
  lObj.updateOnFly = true;

  const refreshButton = document.getElementById('refresh-button');
  if (refreshButton && refreshButton.classList && !refreshButton.classList.contains('rotating')) {
    refreshButton.classList.add('rotating');
  }
  const loadingDiv = document.getElementById('loading');
  const timerSpan = document.getElementById('timer');
  let startTime = Date.now();
  timerSpan.textContent = '00:00:00';
  loadingDiv.style.display = 'block';

  lObj.timerInterval = setInterval(() => {
    let timeElapsed = Date.now() - startTime;
    let minutes = Math.floor(timeElapsed / 60000);
    let seconds = Math.floor((timeElapsed % 60000) / 1000);
    let milliseconds = Math.floor((timeElapsed % 1000) / 10);
    timerSpan.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
  }, 10);
}

function stopLoading() {
  lObj.updateOnFly = false;

  const refreshButton = document.getElementById('refresh-button');
  if (refreshButton && refreshButton.classList && refreshButton.classList.contains('rotating')) {
    refreshButton.classList.remove('rotating');
  }
  const loadingDiv = document.getElementById('loading');
  if (loadingDiv && loadingDiv.style) {
    loadingDiv.style.display = 'none';
  }
  if (lObj.timerInterval) {
    clearInterval(lObj.timerInterval);
    lObj.timerInterval = null;
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
