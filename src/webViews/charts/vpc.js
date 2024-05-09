let dashboardChart = null;
let mapChart = null;
let dashboardType = 'dashboard';
let vpcObj = {
  intervalValue: 0,
  timerInterval: null,
  updateOnFly: false,
};

let dt = null;
const t0 = 'Region';
const t1 = 'VPCs';
const t2 = 'Subnets';
const t3 = 'Route Tables';
const t4 = 'Internet Gateways';
const t5 = 'NAT Gateways';
const t6 = 'VPC Peering';

let data = null;

async function initializeDashboardChart() {
  data = [
    ['eu-central-1', 0, 0, 0, 0, 0, 0],
    ['eu-north-1', 0, 0, 0, 0, 0, 0],
    ['eu-west-1', 0, 0, 0, 0, 0, 0],
    ['eu-west-2', 0, 0, 0, 0, 0, 0],
    ['eu-west-3', 0, 0, 0, 0, 0, 0],
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
              columnNames: ['Region', t1, t2, t3, t4],
              firstRowAsNames: false,
              data,
            },
          },
          {
            id: 'datagridConnector',
            type: 'JSON',
            options: {
              columnNames: ['Region', t1, t2, t3, t4, t5, t6],
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
                  // {
                  //   id: 'dashboard-col-3',
                  // },
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
                events: {
                  click: function (event) {
                    console.log(event.point.name);
                    const region = event.point.name;
                    const type = 'vpc';
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
                events: {
                  click: function (event) {
                    console.log(event.point.name);
                    const region = event.point.name;
                    const type = 'subnet';
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
  console.log('updateDashboardData', newData);

  if (!dashboardChart) {
    console.error('Dashboard is not initialized.');
    return;
  }

  stopLoading();

  try {
    const regionConnector = await dashboardChart.dataPool.getConnector('Region');
    const dataGridConnector = await dashboardChart.dataPool.getConnector('datagridConnector');
    const dashboardComponents = await dashboardChart.mountedComponents;

    if (!regionConnector || !regionConnector.options || !dataGridConnector) {
      console.error('Required connectors not found or cannot be updated.');
      return;
    }

    // Update connectors with new data
    regionConnector.options.data = newData;

    // Update components
    dashboardComponents.forEach((comp, i) => {
      if (comp.component) {
        if (comp.component.type === 'Highcharts' && comp.component.chart && comp.component.chart.series[0]) {
          // Update Highcharts components
          const datapart = newData.map((data) => [data[0], data[i + 1]]);
          comp.component.chart.series[0].setData(datapart, {
            animation: {
              duration: 1000,
              easing: 'easeInOutQuint',
            },
          });
        }
      }
    });


    renderDataTable(newData);
  } catch (error) {
    console.error('Failed to update dashboard data:', error);
  }
}

async function renderDrillDown(newData) {
  console.log('renderDrillDown', newData);

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
    if(newData.args.type === 'vpc') {
      transformedData = await transformVPCData(newData);
    }else if(newData.args.type ==='subnet') {
      transformedData = await transformSubnetData(newData);
    }
    
    console.log('transformedData:', transformedData);

    renderDataTable(transformedData.rows, transformedData.columns);
  } catch (error) {
    console.error('Failed to update dashboard data:', error);
  }
}



async function transformVPCData(vpcList) {
  // Prepare the array to hold each row's data for DataTables
  const dataTableRows = vpcList.data.map(vpc => {
      // Extract the first CidrBlockAssociation if it exists
      const firstCidrBlockAssoc = vpc.CidrBlockAssociationSet?.[0];
      const assocData = firstCidrBlockAssoc ? {
          AssociationId: firstCidrBlockAssoc.AssociationId,
          AssociatedCidrBlock: firstCidrBlockAssoc.CidrBlock,
          CidrBlockState: firstCidrBlockAssoc.CidrBlockState.State
      } : {};

      // Find the 'Name' tag and compile other tags into a single string
      const nameTag = vpc.Tags?.find(tag => tag.Key === "Name")?.Value || '';
      const Tags = vpc.Tags?.filter(tag => tag.Key !== "Name")
                                 .map(tag => `${tag.Key}: ${tag.Value}`)
                                 .join(', ');

      // Flatten the structure into a single object for each row
      return {
          Name: nameTag,
          CidrBlock: vpc.CidrBlock,
          DhcpOptionsId: vpc.DhcpOptionsId,
          State: vpc.State,
          VpcId: vpc.VpcId,
          OwnerId: vpc.OwnerId,
          InstanceTenancy: vpc.InstanceTenancy,
          IsDefault: vpc.IsDefault ? "Yes" : "No",
          ...assocData,
          Tags: Tags
      };
  });

  // Define the columns for DataTables
  const columns = [
      { title: "Name", data: "Name" , visible: true},
      { title: "CIDR", data: "CidrBlock" , visible: true},
      { title: "DhcpOptionsId", data: "DhcpOptionsId" , visible: true},
      { title: "State", data: "State" , visible: true},
      { title: "VPC ID", data: "VpcId" , visible: true},
      { title: "OwnerId", data: "OwnerId" , visible: true},
      { title: "InstanceTenancy", data: "InstanceTenancy", visible: true },
      { title: "IsDefault", data: "IsDefault", visible: true },
      { title: "AssociationId", data: "AssociationId" , visible: true},
      { title: "AssociatedCidrBlock", data: "AssociatedCidrBlock", visible: true },
      { title: "CidrBlockState", data: "CidrBlockState" , visible: true},
      { title: "Tags", data: "Tags" , visible: true}
  ];

  return { columns, rows: dataTableRows };
}



async function transformSubnetData(subnetList) {
  const dataTableRows = subnetList.data.map(subnet => {
      const dnsOptions = subnet.PrivateDnsNameOptionsOnLaunch;
      const nameTag = subnet.Tags?.find(tag => tag.Key === "Name")?.Value || '';
      const Tags = subnet.Tags?.filter(tag => tag.Key !== "Name")
                                 .map(tag => `${tag.Key}: ${tag.Value}`)
                                 .join(', ');

      return {
          Name: nameTag,
          AvailabilityZone: subnet.AvailabilityZone,
          AvailabilityZoneId: subnet.AvailabilityZoneId,
          AvailableIpAddressCount: subnet.AvailableIpAddressCount,
          CidrBlock: subnet.CidrBlock,
          DefaultForAz: subnet.DefaultForAz ? "Yes" : "No",
          MapPublicIpOnLaunch: subnet.MapPublicIpOnLaunch ? "Yes" : "No",
          MapCustomerOwnedIpOnLaunch: subnet.MapCustomerOwnedIpOnLaunch ? "Yes" : "No",
          State: subnet.State,
          SubnetId: subnet.SubnetId,
          VpcId: subnet.VpcId,
          OwnerId: subnet.OwnerId,
          AssignIpv6AddressOnCreation: subnet.AssignIpv6AddressOnCreation ? "Yes" : "No",
          SubnetArn: subnet.SubnetArn,
          EnableDns64: subnet.EnableDns64 ? "Yes" : "No",
          Ipv6Native: subnet.Ipv6Native ? "Yes" : "No",
          HostnameType: dnsOptions ? dnsOptions.HostnameType : "",
          EnableResourceNameDnsARecord: dnsOptions ? (dnsOptions.EnableResourceNameDnsARecord ? "Yes" : "No") : "No",
          EnableResourceNameDnsAAAARecord: dnsOptions ? (dnsOptions.EnableResourceNameDnsAAAARecord ? "Yes" : "No") : "No",
          Tags: Tags ?? "",
      };
  });

  const columns = [
    {
      className: 'dt-control ctb',
      orderable: false,
      data: null,
      defaultContent: '',
  },
      { title: "Name", data: "Name", visible: true },
      { title: "VpcId", data: "VpcId", visible: true },
      { title: "SubnetId", data: "SubnetId", visible: true  },
      { title: "CidrBlock", data: "CidrBlock", visible: true  },
      { title: "AvailabilityZone", data: "AvailabilityZone" , visible: true },
      { title: "AvailabilityZoneId", data: "AvailabilityZoneId" , visible: true },
      { title: "AvailableIp", sTitle:"AvailableIpAddressCount", data: "AvailableIpAddressCount", visible: true  },
      { title: "DefaultForAz", data: "DefaultForAz" , visible: true },
      { title: "MapPublicIpOnLaunch", data: "MapPublicIpOnLaunch", visible: true  },
      { title: "MapCustomerOwnedIpOnLaunch", data: "MapCustomerOwnedIpOnLaunch", visible: false  },
      { title: "State", data: "State" , visible: false },
      { title: "OwnerId", data: "OwnerId" , visible: false },
      { title: "AssignIpv6AddressOnCreation", data: "AssignIpv6AddressOnCreation", visible: false  },
      { title: "SubnetArn", data: "SubnetArn", visible: false  },
      { title: "EnableDns64", data: "EnableDns64", visible: false  },
      { title: "Ipv6Native", data: "Ipv6Native" , visible: false },
      { title: "HostnameType", data: "HostnameType", visible: false  },
      { title: "EnableResourceNameDnsARecord", data: "EnableResourceNameDnsARecord", visible: false  },
      { title: "EnableResourceNameDnsAAAARecord", data: "EnableResourceNameDnsAAAARecord" , visible: false },
      { title: "Tags", data: "Tags" , visible: false }
  ];

  return { columns, rows: dataTableRows };
}





function drillDown(args) {
  if (vpcObj.updateOnFly) {
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
    console.log('drillDown comes back');

    stopLoading();
    await renderDrillDown(message.data);
  }
}

const requestChartData = () => {
  if (vpcObj.updateOnFly) {
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
    vpcObj.intervalValue = parseInt(this.value, 10);
    if (vpcObj.intervalValue < 1) {
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
  newDtTable.classList.add('compact');
  newDtTable.classList.add('hover');
  newDtTable.style = 'width: 100%;';

  dtWrapper.appendChild(newDtTable);
  console.log('renderDataTable');
  console.log(rows);
  console.log(iColumns);
  let defColumns = [{ title: t0 }, { title: t1 }, { title: t2 }, { title: t3 }, { title: t4 }, { title: t5 }, { title: t6 }];

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
          // This row is already open - close it
          row.child.hide();
      }
      else {
          // Open this row
          row.child(reFormatRow(row.data())).show();
      }
  });
 
};

function reFormatRow(d) {
  // `d` is the original data object for the row
  let html = '<dl>'; // Start the definition list
  for (const key in d) {
    if (d.hasOwnProperty(key)) { // Ensure the key is a direct property of `d`
      html += '<dt>' + capitalizeFirstLetter(key) + ': <span style="color:yellow;">'+ d[key] +'</span></dt>'; // Add the term with a capitalized first letter
    
    }
  }
  html += '</dl>'; // Close the definition list
  return html;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const startDashboardChartInterval = () => {
  if (vpcObj.timerInterval) {
    clearInterval(vpcObj.timerInterval);
  }
  if (vpcObj.intervalValue > 0) {
    vpcObj.timerInterval = setInterval(() => {
      requestChartData();
    }, vpcObj.intervalValue * 1000);
  }
};

const stopDashboardChartInterval = () => {
  if (vpcObj.timerInterval) {
    clearInterval(vpcObj.timerInterval);
  }
};

function startLoading() {
  vpcObj.updateOnFly = true;

  const refreshButton = document.getElementById('refresh-button');
  if (refreshButton && refreshButton.classList && !refreshButton.classList.contains('rotating')) {
    refreshButton.classList.add('rotating');
  }
  const loadingDiv = document.getElementById('loading');
  const timerSpan = document.getElementById('timer');
  let startTime = Date.now();
  timerSpan.textContent = '00:00:00';
  loadingDiv.style.display = 'block';

  vpcObj.timerInterval = setInterval(() => {
    let timeElapsed = Date.now() - startTime;
    let minutes = Math.floor(timeElapsed / 60000);
    let seconds = Math.floor((timeElapsed % 60000) / 1000);
    let milliseconds = Math.floor((timeElapsed % 1000) / 10);
    timerSpan.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
  }, 10);
}

function stopLoading() {
  vpcObj.updateOnFly = false;

  const refreshButton = document.getElementById('refresh-button');
  if (refreshButton && refreshButton.classList && refreshButton.classList.contains('rotating')) {
    refreshButton.classList.remove('rotating');
  }
  const loadingDiv = document.getElementById('loading');
  if (loadingDiv && loadingDiv.style) {
    loadingDiv.style.display = 'none';
  }
  if (vpcObj.timerInterval) {
    clearInterval(vpcObj.timerInterval);
    vpcObj.timerInterval = null;
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
