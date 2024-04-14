const vscode = acquireVsCodeApi();
let dashboardChart = null;
let mapChart = null;
let dashboardType = 'dashboard';
let intervalValue = 60;
let dynamodbtimerInterval = null;
let dynamodbUpdateOnFly = false;

const t1 = 'Tables';
const t2 = 'Size (6 Hours Delay)';
const t3 = 'Items (6 Hours Delay)';
const t4 = 'Backups';
const t5 = 'Backup Size';

const dataGridColumns = {
  Region: {
    headerFormat: '{text} name',
  },
  [t1]: {
    headerFormat: '{text}',
  },
  [t2]: {
    headerFormat: '{text}',
  },
  [t3]: {
    headerFormat: '{text}',
  },
  [t4]: {
    headerFormat: '{text}',
  },
  [t5]: {
    headerFormat: '{text}',
  },
  metaData: {
    show: false,
  },
};
let data = null;

function isColorLight(color) {
  let r, g, b;

  // Check if color is in hexadecimal format
  if (color.indexOf('#') === 0) {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    if (hex.length === 3) {
      // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
      r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
      g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
      b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    }
  }
  // Check if color is in 'rgb' or 'rgba' format
  else if (color.indexOf('rgb') === 0) {
    // Find numbers in the rgb(a) string, split them, convert to integer
    const match = color.match(/\d+/g).map(Number);
    r = match[0];
    g = match[1];
    b = match[2];
    // Ignore alpha channel if present
  } else {
    // Unsupported color format, default to light color
    console.warn('Unsupported color format:', color);
    return true;
  }

  // Calculate the luminance of the color
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  

  // Return true if light, false if dark
  return luminance > 0.5;
}

function renderBarDataLabels(colors, colorIndex, value) {
  if (value === 0) {
    return `<span class="cbt-bar-white">0 Bytes</span>`;
  }

  let lightColor = false;

  if (colors && colors[colorIndex]) {
    const color = colors[colorIndex];
    lightColor = isColorLight(color);
  }

  const cl = lightColor ? 'ctb-bar-black' : 'cbt-bar-white';
  const formated = formatBytes(value, 2);
  return `<span class="${cl}">${formated[0]} ${formated[1]}</span>`;
}

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
            extremes: true,
            data: true,
            dataGrid: true,
            dataGridColumns: true,
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
              labels: {
                enabled: true,
                  align: 'middle',
                  horizontalAlign: 'right',
                  verticalAlign: 'middle',
                  crop: false,
                  overflow: 'justify',
                formatter: function () {
                  const formattedValue = formatBytes(this.value, 0);
                  return `<span class="ctb-label-sm">${formattedValue[0]} ${formattedValue[1]}</span>`;
                },
              },
              tickPositioner: function () {
                const max = this.dataMax;
                const end = this.dataMax * 1.1;
                const min = this.dataMin;
                const tickCount = 7;
                const interval = (end - min) / (tickCount - 1);
                let positions = [];

                for (let i = 0; i < tickCount; i++) {
                  positions.push(min + interval * i);
                }

                return positions;
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
                      console.log('Point clicked:', this);
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
                    return renderBarDataLabels(this.series.chart.options.colors, this.colorIndex, this.y);
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
            extremes: true,
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
          renderTo: 'dashboard-col-3',
          connector: {
            id: 'datagridConnector',
          },
          type: 'DataGrid',
          sync: {
            extremes: true,
          },
          dataGridOptions: {
            editable: false,
            cellHeight: 15,
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
    const dataGridConnector = await dashboardChart.dataPool.getConnector('datagridConnector');
    const dashboardComponents = await dashboardChart.mountedComponents;

    if (regionConnector && regionConnector.options) {
      const transformedData = newData.map((row) => {
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

          comp.component.chart.series[0].setData(datapart, {
            animation: {
              duration: 1000,
              easing: 'easeInOutQuint',
            },
          });
        } else if (
          comp.component &&
          comp.component.type &&
          comp.component.type === 'DataGrid' &&
          comp.component.dataGrid
        ) {
          comp.component.dataGrid.dataTable.deleteRows();
          comp.component.dataGrid.dataTable.setRows(transformedData);
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
  if (dynamodbUpdateOnFly) {
    return;
  } else {
    startLoading();

    vscode.postMessage({
      command: 'requestData',
    });
  }
};

window.addEventListener('message', (event) => {
  const message = event.data;
  console.log('Message received:', message.data);
  switch (message.command) {
    case 'updateData':
      updateDashboardData(message.data);
      break;
  }
});

const init = () => {
  initializeDashboardChart();
  document.getElementById('interval').addEventListener('change', function () {
    intervalValue = parseInt(this.value, 10);
    if (intervalValue < 1) {
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
  if (window.dashboardChartUpdateInterval) {
    clearInterval(window.dashboardChartUpdateInterval);
  }
  if (intervalValue > 0) {
    window.dashboardChartUpdateInterval = setInterval(() => {
      requestChartData();
    }, intervalValue * 1000);
  }
};

const stopDashboardChartInterval = () => {
  if (window.dashboardChartUpdateInterval) {
    clearInterval(window.dashboardChartUpdateInterval);
  }
};

function startLoading() {
  dynamodbUpdateOnFly = true;

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
  dynamodbUpdateOnFly = false;

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

window.addEventListener('load', init);
window.addEventListener('message', (event) => handleIncomingData(event.data));
