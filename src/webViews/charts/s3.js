let dashboardChart = null;
let mapChart = null;
let dashboardType = 'dashboard';
let dt = null;
let s3Obj = {
  intervalValue : 0,
  timerInterval : null,
  updateOnFly : false,
};
const t0 = 'Region';
const t1 = 'Buckets';
const t2 = 'Objects';
const t3 = 'Size';

let data = null;



function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) {
    return [0, 'Bytes'];
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return [parseFloat((bytes / Math.pow(k, i)).toFixed(dm)), sizes[i]];
}

async function initializeDashboardChart() {
  data = [['us-east-1', 0]];

  dashboardChart = await Dashboards.board(
    'container',
    {
      dataPool: {
        connectors: [
          {
            id: t0,
            type: 'JSON',
            options: {
              columnNames: [t0, t1, t2],
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
                  }
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
              tickInterval:1
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
                    console.log(event.point.name);
                    const region = event.point.name;
                    const type = 'bucket';
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

      ],
    },
    true,
  );
  requestChartData();
}

async function renderDrillDown(newData) {
  console.log('renderDrillDown');
  console.log(newData);
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
    if (newData.args.type === 'bucket') {
      transformedData = await transformBucketData(newData);
    }

    

    renderDataTable(transformedData.rows, transformedData.columns);
  } catch (error) {
    console.error('Failed to update dashboard data:', error);
  }
}


async function transformBucketData(bucketList) {
  // Create the DateTimeFormat object once outside the map loop
  const dateFormat = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
    hour12: false 
  });

  // Process each bucket to format its data
  const dataTableRows = bucketList.data.map((bucket) => {
    // Use formatToParts for better control and performance
    const dateParts = dateFormat.formatToParts(new Date(bucket.CreationDate));
    const parts = dateParts.reduce((acc, part) => {
      if (part.type !== 'literal') {
        acc[part.type] = part.value;
      }
      return acc;
    }, {});

    // Manually construct the date string in the desired format
    const formattedDate = `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;

    return {
      Region: bucketList.args.region,
      Name: bucket.Name,
      CreationDate: formattedDate
    };
  });

  // Define the columns for table display
  const columns = [
    {
      className: 'dt-control ctb',
      orderable: false,
      data: null,
      defaultContent: '',
    },
    { title: 'Region', data: 'Region', className: 'no-wrap', visible: true },
    { title: 'Name', data: 'Name', className: 'no-wrap', visible: true },
    { title: 'CreationDate', data: 'CreationDate', className: 'no-wrap', visible: true }
  ];

  // Return the structured data for table display
  return { columns, rows: dataTableRows };
}


function drillDown(args) {
  if (s3Obj.updateOnFly) {
    return;
  } else {
    startLoading();

    vscode.postMessage({
      command: 'drillDown',
      args: args,
    });
  }
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
    } else {
      console.error('connector not found or cannot be updated.');
    }
    renderDataTable(newData);
  } catch (error) {
    console.error('Failed to update dashboard data:', error);
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

  let defColumns = [{ title: t0 },{ title: t1 , type: 'string'}];

  let defRows = [];
  let order= [[1, 'asc']];
  if(!iColumns){
    order = [[0, 'asc']];
  }

  dt = new DataTable('#dt', {
    responsive: true,
    columns: iColumns ?? defColumns,
    data: rows ?? defRows,
    scrollY: 'auto',
    scrollCollapse: true,
    order
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
          // Only one value, display without index
          cellKey.textContent = `${capitalizeFirstLetter(key)}:`;
          cellValue.textContent = celval[0];
        } else {
          // Multiple values, use index in the key
          celval.forEach((item, index) => {
            if (index > 0) {
              // For subsequent items, add new rows
              const additionalRow = table.insertRow();
              const additionalCellKey = additionalRow.insertCell();
              const additionalCellValue = additionalRow.insertCell();

              additionalCellKey.textContent = `${capitalizeFirstLetter(key)}_${index}:`;
              additionalCellValue.textContent = item;

              additionalCellKey.style.border = additionalCellValue.style.border = '1px solid black';
              additionalCellKey.style.padding = additionalCellValue.style.padding = '5px';
              additionalCellKey.className = additionalCellValue.className = 'code-block';

            } else {
              // First item uses the initially created cells
              cellKey.textContent = `${capitalizeFirstLetter(key)}_0:`;
              cellValue.textContent = item;
            }
          });
        }
      } else {
        cellKey.textContent = `${capitalizeFirstLetter(key)}:`;
        cellValue.textContent = celval.toString();
      }
    }
  }

  return table.outerHTML; // Return the HTML content of the table
}


const requestChartData = () => {
  if (s3Obj.updateOnFly) {
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
     s3Obj.intervalValue = parseInt(this.value, 10);
     if (s3Obj.intervalValue < 1) {
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

const startDashboardChartInterval = () => {
  if (s3Obj.timerInterval) {
    clearInterval(s3Obj.timerInterval);
  }
  if (s3Obj.intervalValue > 0) {
    s3Obj.timerInterval = setInterval(() => {
      requestChartData();
    }, s3Obj.intervalValue * 1000);
  }

};

const stopDashboardChartInterval = () => {
  if (s3Obj.timerInterval) {
    clearInterval(s3Obj.timerInterval);
  }
};

function startLoading() {
  s3Obj.updateOnFly = true;

  const refreshButton = document.getElementById('refresh-button');
  if (refreshButton && refreshButton.classList && !refreshButton.classList.contains('rotating')) {
    refreshButton.classList.add('rotating');
  }
  const loadingDiv = document.getElementById('loading');
  const timerSpan = document.getElementById('timer');
  let startTime = Date.now();
  timerSpan.textContent = '00:00:00';
  loadingDiv.style.display = 'block';

  s3Obj.timerInterval= setInterval(() => {
    let timeElapsed = Date.now() - startTime;
    let minutes = Math.floor(timeElapsed / 60000);
    let seconds = Math.floor((timeElapsed % 60000) / 1000);
    let milliseconds = Math.floor((timeElapsed % 1000) / 10);
    timerSpan.textContent = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
  }, 10);
}

function stopLoading() {
  s3Obj.updateOnFly = false;

  const refreshButton = document.getElementById('refresh-button');
  if (refreshButton && refreshButton.classList && refreshButton.classList.contains('rotating')) {
    refreshButton.classList.remove('rotating');
  }
  const loadingDiv = document.getElementById('loading');
  if (loadingDiv && loadingDiv.style) {
    loadingDiv.style.display = 'none';
  }
  if (s3Obj.timerInterval) {
    clearInterval(s3Obj.timerInterval);
    s3Obj.timerInterval= null;
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

