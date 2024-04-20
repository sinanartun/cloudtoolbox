let dashboardChart = null;
let mapChart = null;
let dashboardType = 'dashboard';

let eventBridgeObj = {
  intervalValue : 60,
  timerInterval : null,
  updateOnFly : false,
};

const t1 = 'Rules';
const t2 = 'Busses';
const t3 = 'Pipes';
const t4 = 'Schedules';


let data = null;

async function initializeDashboardChart() {

  data = [
    ['us-east-1', 0, 0, 0, 0],
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
              columnNames: ['Region', t1, t2, t3],
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
                    return this.y === 0 ? '0' : this.y;
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
                    return this.y === 0 ? '0' : this.y;
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
                    return this.y === 0 ? '0' : this.y;
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
  if (eventBridgeObj.updateOnFly) {
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
     eventBridgeObj.intervalValue = parseInt(this.value, 10);
     if (eventBridgeObj.intervalValue < 1) {
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
  if (eventBridgeObj.timerInterval) {
    clearInterval(eventBridgeObj.timerInterval);
  }
  if (eventBridgeObj.intervalValue > 0) {
    eventBridgeObj.timerInterval = setInterval(() => {
      requestChartData();
    }, eventBridgeObj.intervalValue * 1000);
  }

};

const stopDashboardChartInterval = () => {
  if (eventBridgeObj.timerInterval) {
    clearInterval(eventBridgeObj.timerInterval);
  }
};

function startLoading() {
  eventBridgeObj.updateOnFly = true;

  const refreshButton = document.getElementById('refresh-button');
  if (refreshButton && refreshButton.classList && !refreshButton.classList.contains('rotating')) {
    refreshButton.classList.add('rotating');
  }
  const loadingDiv = document.getElementById('loading');
  const timerSpan = document.getElementById('timer');
  let startTime = Date.now();
  timerSpan.textContent = '00:00:00';
  loadingDiv.style.display = 'block';

  eventBridgeObj.timerInterval = setInterval(() => {
      let timeElapsed = Date.now() - startTime;
      let minutes = Math.floor(timeElapsed / 60000);
      let seconds = Math.floor((timeElapsed % 60000) / 1000);
      let milliseconds = Math.floor((timeElapsed % 1000) / 10);
      timerSpan.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
  }, 10);
}




function stopLoading() {
  eventBridgeObj.updateOnFly = false;

  const refreshButton = document.getElementById('refresh-button');
  if (refreshButton && refreshButton.classList && refreshButton.classList.contains('rotating')) {
    refreshButton.classList.remove('rotating');
  }
  const loadingDiv = document.getElementById('loading');
    if (loadingDiv && loadingDiv.style) {
        loadingDiv.style.display = 'none';
    }
    if (eventBridgeObj.timerInterval) {
      clearInterval(eventBridgeObj.timerInterval);
      eventBridgeObj.timerInterval = null;
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
