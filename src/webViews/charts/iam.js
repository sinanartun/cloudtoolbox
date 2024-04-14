

const vscode = acquireVsCodeApi();
let dashboardChart = null;
let mapChart = null;
let dashboardType = 'dashboard';
let intervalValue = 60;
let iamtimerInterval = null;
let iamUpdateOnFly = false;

const t1 = 'Users';
const t2 = 'Roles';
const t3 = 'Groups';


let data = null;




async function initializeDashboardChart() {
  let data1 = [['-', '-', '-', '-', '-', '-']];
  let data2 = [['-', '-', '-', '-']];

  dashboardChart = await Dashboards.board(
    'container',
    {
      dataPool: {
        connectors: [
          {
            id: 'usersConnector',
            type: 'JSON',
            options: {
              columnNames: ['User Name', 'Created', 'Groups', 'Policies', 'Password Last Used','last action'],
              firstRowAsNames: false,
              data: data1,
            },
          },
          {
            id: 'rolesConnector',
            type: 'JSON',
            options: {
              columnNames: ['Role Name', 'Created', 'Max Session Duration', 'Description'],
              firstRowAsNames: false,
              data: data2,
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
                    type: 'DataGrid',
                  },
                 
                ],
              },
              {
                cells: [
                  {
                    id: 'dashboard-col-1',
                    type: 'DataGrid',
                  },
                ],
              },
            ],
          },
        ],
      },
      components: [
        {
          renderTo: 'dashboard-col-0',
          title: {
            text: 'Users',
            style: { fontSize: '12px' }
          },
          connector: {
            id: 'usersConnector',
          },
          type: 'DataGrid',
          dataGridOptions: {
            editable: false,
            cellHeight: 15,
            resizable: false,

          },
          sync: {
            extremes: true,
          },
        },
        {
          renderTo: 'dashboard-col-1',
          title: {
            text: 'Roles',
            style: { fontSize: '12px' } // Assuming you want consistent font size
          },
          connector: {
            id: 'rolesConnector',
          },
          type: 'DataGrid',
          dataGridOptions: {
            editable: false,
            cellHeight: 15,
            resizable: true,

          },
          sync: {
            extremes: true,
          },
        },
      ],
    },
    true,
  );
  requestChartData();
}

function formatLastAction(jsonString) {
  try {
    const json = JSON.parse(jsonString);
    return `Action: ${json[0]}\nTime: ${json[1]}`;
  } catch (error) {
    return jsonString;
  }
}

async function updateDashboardData(newData) {
  console.log('updateDashboardData', newData);
  if (!dashboardChart) {
    console.error('Dashboard is not initialized.');
    return;
  }

  stopLoading();

  try {
    const usersConnector = await dashboardChart.dataPool.getConnector('usersConnector');
    const rolesConnector = await dashboardChart.dataPool.getConnector('rolesConnector');

    console.log('usersConnector', usersConnector);
    console.log('rolesConnector', rolesConnector);
    const dashboardComponents = await dashboardChart.mountedComponents;
    console.log('dashboardComponents', dashboardComponents);

    if (usersConnector && usersConnector.options && usersConnector.options.data && rolesConnector && rolesConnector.options && rolesConnector.options.data) {
      const transformedData = newData[0].map((row) => {
        // Assume row format is ['Region', bucketCount, totalObjectCount, totalSizeInBytes]
        const formattedSize = formatLastAction(row[5]); // Assuming row[3] is totalSizeInBytes
        // Replace the total size in bytes with formatted size
        return [...row.slice(0, 5), formattedSize];
      });
      console.log('inside if' );
      
      usersConnector.options.data = newData[0];
      dashboardComponents[0].component.dataGrid.dataTable.deleteRows();
      dashboardComponents[0].component.dataGrid.dataTable.setRows(transformedData);
      rolesConnector.options.data = newData[1];
      dashboardComponents[1].component.dataGrid.dataTable.deleteRows();
      dashboardComponents[1].component.dataGrid.dataTable.setRows(newData[1]);
      
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
  if (iamUpdateOnFly) {
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
  iamUpdateOnFly = true;

  const refreshButton = document.getElementById('refresh-button');
  if (refreshButton && refreshButton.classList && !refreshButton.classList.contains('rotating')) {
    refreshButton.classList.add('rotating');
  }
  const loadingDiv = document.getElementById('loading');
  const timerSpan = document.getElementById('timer');
  let startTime = Date.now();
  timerSpan.textContent = '00:00:00';
  loadingDiv.style.display = 'block';

  iamtimerInterval = setInterval(() => {
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
  iamUpdateOnFly = false;

  const refreshButton = document.getElementById('refresh-button');
  if (refreshButton && refreshButton.classList && refreshButton.classList.contains('rotating')) {
    refreshButton.classList.remove('rotating');
  }
  const loadingDiv = document.getElementById('loading');
  if (loadingDiv && loadingDiv.style) {
    loadingDiv.style.display = 'none';
  }
  if (iamtimerInterval) {
    clearInterval(iamtimerInterval);
    iamtimerInterval = null;
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
