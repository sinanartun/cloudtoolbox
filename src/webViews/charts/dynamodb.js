let dashboardChart = null;
let mapChart = null;
let dashboardType = 'dashboard';

let dynamodbObj = {
  intervalValue : 60,
  timerInterval : null,
  updateOnFly : false,
};

const t1 = 'Tables';
const t2 = 'Size (6 Hours Delay)';
const t3 = 'Items (6 Hours Delay)';
const t4 = 'Backups';
const t5 = 'Backup Size';


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
  data = [['us-east-1', 0, 0, 0, 0, 0]];

  dashboardChart = await Dashboards.board(
    'container',
    {
      dataPool: {
        connectors: [
          {
            id: 'Region',
            type: 'JSON',
            options: {
              columnNames: ['Region', t1, t2, t3],
              firstRowAsNames: false,
              data,
            },
          },
          {
            id: 'datagridConnector',
            type: 'JSON',
            options: {
              columnNames: ['Region', t1, t2, t3, t4, t5],
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
              {
                cells: [
                  {
                    id: 'dashboard-col-3',
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
            useHTML: true,
            style: {
              fontSize: '14px',
              fontWeight: '200',
            },
            
          },
          
          sync: {

          },
          connector: {
            id: 'Region',
            columnAssignment: [
              {
                seriesId: 'v1',
                data: ['Region', t1],
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
              type: 'linear',
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
                  showLastLabel: false,
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
              highlight: true

            },
          },
        },
        {
          renderTo: 'dashboard-col-1',
          connector: {
            id: 'Region',
            columnAssignment: [
              {
                seriesId: 'v2',
                data: ['Region', t2],
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
          events: {},
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
              type: 'linear',
              labels: {
                enabled: true,
                  align: 'middle',
                  horizontalAlign: 'right',
                  verticalAlign: 'middle',
                  crop: false,
                  overflow: 'justify',
                  showLastLabel: false,
                formatter: function () {
                  const formattedValue = formatBytes(this.value, 0);
                  return `<span class="ctb-label-sm">${formattedValue[0]} ${formattedValue[1]}</span>`;
                },
              },
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
                cursor: 'pointer',
                point: {
                  events: {
                    click: function () {
                      
                    },
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
                  overflow: 'justify',
                  formatter: function () {
                    const formattedValue = formatBytes(this.y, 0);
                  return `<span>${formattedValue[0]} ${formattedValue[1]}</span>`;
                    
                  },
                },
              },
            },
            tooltip: {
              formatter: function () {
                const formated = formatBytes(this.y, 2);

                return `<b>${formated[0]}</b> ${formated[1]}`;
              },
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
            highlight: true
          },
          connector: {
            id: 'Region',
            columnAssignment: [
              {
                seriesId: 'v3',
                data: ['Region', t3],
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
              type: 'linear',
              
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
              highlight: true
            },
          },
        },

        {
          renderTo: 'dashboard-col-3',
          connector: {
            id: 'datagridConnector',
          },
          type: 'DataGrid',
         
          
          dataGridOptions: {
            editable: false,
            cellHeight: 15,
            sync: {
              highlight: true
            },
          },
        },
      ],
    },
    true,
  );
  requestChartData();
}
let transformedData = null;
async function updateDashboardData(newData) {
  if (!dashboardChart) {
    console.error('Dashboard is not initialized.');
    return;
  }

  stopLoading();

  try {
    const regionConnector = await dashboardChart.dataPool.getConnector('Region');
    const dataGridConnector = await dashboardChart.dataPool.getConnector('datagridConnector');
    const dashboardComponents = await dashboardChart.mountedComponents;

    if (regionConnector && regionConnector.options) {
       transformedData = newData.map((row) => {
        // Assume row format is ['Region', bucketCount, totalObjectCount, totalSizeInBytes]
        const tableSize = formatBytes(row[2], 2); // Assuming row[3] is totalSizeInBytes
        const BackupSize = formatBytes(row[5], 2); // Assuming row[3] is totalSizeInBytes
        // Replace the total size in bytes with formatted size
        return [row[0],row[1], `${tableSize[0]} ${tableSize[1]}`, row[3], row[4], `${BackupSize[0]} ${BackupSize[1]}`];
      });

      regionConnector.options.data = newData;
      dataGridConnector.options.data = transformedData;
      dashboardComponents.forEach((comp, i) => {
        if (
          comp.component &&
          comp.component.chart &&
          comp.component.chart.series[0] &&
          comp.component.type &&
          comp.component.type === 'Highcharts'
        ) {
          const datapart = newData.map((data) => [data[0], data[i + 1]]);

          comp.component.chart.series[0].setData(datapart);
        } else if (
          comp.component &&
          comp.component.type &&
          comp.component.type === 'DataGrid' &&
          comp.component.dataGrid
        ) {
          comp.component.dataGrid.dataTable.deleteRows();

          comp.component.dataGrid.dataTable.setRows(transformedData);
          comp.component.dataGrid.update({});



        }
      });
    } else {
      console.error('connector not found or cannot be updated.');
    }
  } catch (error) {
    console.error('Failed to update dashboard data:', error);
  }
}




function handleIncomingData(message) {
  if (message.command === 'updateData') {
    updateDashboardData(message.data);
  }
}

const requestChartData = () => {
  if (dynamodbObj.updateOnFly) {
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
    dynamodbObj.dynamodbObj = parseInt(this.value, 10);
    if (dynamodbObj.dynamodbObj < 1000) {
      stopDashboardChartInterval();
    } else {
      startDashboardChartInterval();
    }
  });

  document.getElementById('refresh-button').addEventListener('click', function () {
    requestChartData();
  });

  startDashboardChartInterval();
};

const startDashboardChartInterval = () => {
  if (dynamodbObj.timerInterval) {
    clearInterval(dynamodbObj.timerInterval);
  }
  if (dynamodbObj.dynamodbObj > 0) {
    dynamodbObj.timerInterval = setInterval(() => {
      requestChartData();
    }, dynamodbObj.dynamodbObj * 1000);
  }
};

const stopDashboardChartInterval = () => {
  if (dynamodbObj.timerInterval) {
    clearInterval(dynamodbObj.timerInterval);
  }
};

function startLoading() {
  dynamodbObj.updateOnFly = true;

  const refreshButton = document.getElementById('refresh-button');
  if (refreshButton && refreshButton.classList && !refreshButton.classList.contains('rotating')) {
    refreshButton.classList.add('rotating');
  }
  const loadingDiv = document.getElementById('loading');
  const timerSpan = document.getElementById('timer');
  let startTime = Date.now();
  timerSpan.textContent = '00:00:00';
  loadingDiv.style.display = 'block';

  dynamodbtimerInterval = setInterval(() => {
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
  dynamodbObj.updateOnFly = false;

  const refreshButton = document.getElementById('refresh-button');
  if (refreshButton && refreshButton.classList && refreshButton.classList.contains('rotating')) {
    refreshButton.classList.remove('rotating');
  }
  const loadingDiv = document.getElementById('loading');
  if (loadingDiv && loadingDiv.style) {
    loadingDiv.style.display = 'none';
  }
  if (dynamodbtimerInterval) {
    clearInterval(dynamodbtimerInterval);
    dynamodbtimerInterval = null;
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

