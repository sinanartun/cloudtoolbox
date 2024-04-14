let dashboardChart = null;
let mapChart = null;
let dashboardType = 'dashboard';


let lObj = {
  intervalValue : 60,
  timerInterval : null,
  updateOnFly : false,
};

const t1 = 'Functions';
const t2 = 'Applications';
const t3 = 'Layers';
const t4 = 'Code Storage KB';


let data = null;

async function initializeDashboardChart() {

  data = [
    ['eu-central-1', 0, 0, 0, 0],
    ['eu-north-1', 0, 0, 0, 0],
    ['eu-west-1', 0, 0, 0, 0],
    ['eu-west-2', 0, 0, 0, 0],
    ['eu-west-3', 0, 0, 0, 0],
  ];
 

  dashboardChart = await Dashboards.board(
    'container',
    {
      dataPool: {
        connectors: [
          {
            id: 'Region',
            type: 'JSON',
            options: {
              columnNames: ['Region', t1, t2, t3, t4],
              firstRowAsNames: false,
              data,
            },
          },
          {
            id: 'datagridConnector',
            type: 'JSON',
            options: {
              columnNames: ['Region', t1, t2, t3, t4],
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
            },
            credits: {
              enabled: false,
            },
            chart: {
              type: 'bar', // Specifies the chart type as bar
              zoomType: null,
            },
            plotOptions: {
              series: {
                colorByPoint: true,
                dataLabels: {
                  enabled: true, // Enables data labels for all series
                },
              },
              bar: {
                // Applies specific options for bar chart type
                pointPadding: 0.2,
                borderWidth: 0,
                dataLabels: {
                  enabled: true,
                  align: 'right', // Positions the label to the right of the bar, which is actually "above" for a horizontal bar
                  verticalAlign: 'middle', // Aligns vertically to the top of the bar
                  inside: true, // Places the label inside the bar
                  horizontalAlign: 'middle', // Aligns the data label horizontally
                  crop: false, // Allows the data label to overflow the bar
                  overflow: 'none', // Allows the data label to overflow the bar
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
                // Applies specific options for bar chart type
                pointPadding: 0.2,
                borderWidth: 0,
                dataLabels: {
                  enabled: true,
                  align: 'right', // Positions the label to the right of the bar, which is actually "above" for a horizontal bar
                  verticalAlign: 'middle', // Aligns vertically to the top of the bar
                  inside: true, // Places the label inside the bar
                  horizontalAlign: 'middle', // Aligns the data label horizontally
                  crop: false, // Allows the data label to overflow the bar
                  overflow: 'none', // Allows the data label to overflow the bar
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
      regionConnector.options.data = newData;
      dataGridConnector.options.data = newData;
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
              duration: 1000, // Animation duration in milliseconds
              easing: 'easeInOutQuint', // Easing function for the animation
            },
          });
        } else if (
          comp.component &&
          comp.component.type &&
          comp.component.type === 'DataGrid' &&
          comp.component.dataGrid
        ) {
          comp.component.dataGrid.dataTable.deleteRows();
          comp.component.dataGrid.dataTable.setRows(newData);
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
  if (lObj.updateOnFly) {
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
     lObj.intervalValue = parseInt(this.value, 10);
     if (lObj.intervalValue < 1) {
      stopDashboardChartInterval();
     }else {
      startDashboardChartInterval();
      }
    
  });

  document.getElementById('refresh-button').addEventListener('click', function () {
    requestChartData();
  });

  startDashboardChartInterval();
};

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


