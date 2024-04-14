let dashboardChart = null;
let mapChart = null;
let dashboardType = 'dashboard';
let intervalValue = 60;
let ecrtimerInterval = null;
let ecrUpdateOnFly = false;

const t1 = 'Repositories';
const t2 = 'Images';
const t3 = 'Total Size';

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
  data = [['us-east-1', 0, 0, 0]];

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
              columnNames: ['Region', t1, t2, t3],
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
          events: {},
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
              type: 'linear',
              showLastLabel: false,
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
                    const formated = formatBytes(this.y, 2);
                    return `${formated[0]} ${formated[1]}`;
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
                chartContainerLabel: t3,
              },
            },
            accessibility: {
              description: t3,
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
  console.log('newData', newData );
  stopLoading();

  try {
    const regionConnector = await dashboardChart.dataPool.getConnector('Region');
    const dataGridConnector = await dashboardChart.dataPool.getConnector('datagridConnector');
    const dashboardComponents = await dashboardChart.mountedComponents;

    if (regionConnector && regionConnector.options) {
      const transformedData = newData.map((row) => {
        console.log('row',row);
        // Assume row format is ['Region', bucketCount, totalObjectCount, totalSizeInBytes]
        const repoTotalSize = row.repositories.reduce((sum, repository) => {
          return sum + repository.totalSize;
        }, 0);

        const regionTotalImage = row.repositories.reduce((sum, repository) => {
          return sum + repository.imageCount;
        }, 0);
        // const formatedSize = formatBytes(repoTotalSize,2);
        
        // Replace the total size in bytes with formatted size
        const lastRow = [row.region, row.repositories.length, regionTotalImage, repoTotalSize];
        console.log('lastRow', lastRow);
        return lastRow;
      });

      regionConnector.options.data = transformedData;
      dataGridConnector.options.data = transformedData;
      dashboardComponents.forEach((comp, i) => {
        if (
          comp.component &&
          comp.component.chart &&
          comp.component.chart.series[0] &&
          comp.component.type &&
          comp.component.type === 'Highcharts'
        ) {


    

          const datapart = transformedData.map((row) => [row[0], row[i+1]]);

          comp.component.chart.series[0].setData(datapart);
        } else if (
          comp.component &&
          comp.component.type &&
          comp.component.type === 'DataGrid' &&
          comp.component.dataGrid
        ) {
          // comp.component.dataGrid.dataTable.clearRows();
          const tableData = transformedData.map((row) =>{
            const fd = formatBytes(row[3]);

            return [row[0], row[1], row[2], `${fd[0]} ${fd[1]}`];
          }
          
           
          
          );
          comp.component.dataGrid.dataTable.deleteRows();

          
          console.log('tableData', tableData);
          comp.component.dataGrid.dataTable.setRows(tableData);
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
  if (ecrUpdateOnFly) {
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
  ecrUpdateOnFly = true;

  const refreshButton = document.getElementById('refresh-button');
  if (refreshButton && refreshButton.classList && !refreshButton.classList.contains('rotating')) {
    refreshButton.classList.add('rotating');
  }
  const loadingDiv = document.getElementById('loading');
  const timerSpan = document.getElementById('timer');
  let startTime = Date.now();
  timerSpan.textContent = '00:00:00';
  loadingDiv.style.display = 'block';

  ecrtimerInterval = setInterval(() => {
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
  ecrUpdateOnFly = false;

  const refreshButton = document.getElementById('refresh-button');
  if (refreshButton && refreshButton.classList && refreshButton.classList.contains('rotating')) {
    refreshButton.classList.remove('rotating');
  }
  const loadingDiv = document.getElementById('loading');
  if (loadingDiv && loadingDiv.style) {
    loadingDiv.style.display = 'none';
  }
  if (ecrtimerInterval) {
    clearInterval(ecrtimerInterval);
    ecrtimerInterval = null;
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
