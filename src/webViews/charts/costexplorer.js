let dashboardChart = null;
let mapChart = null;
let dashboardType = 'dashboard';
let resultData = null;
let costextplorerObj = {
  intervalValue: 60,
  timerInterval: null,
  updateOnFly: false,
};

const t1 = 'Users';
const t2 = 'Roles';
const t3 = 'Groups';

const csvData = `
1546300800000;7000000;6200000;8200000;;;;
1548979200000;7500000;5800000;8700000;;;;
1551398400000;7000000;7500000;8200000;;;;
1554076800000;7000000;6400000;8200000;;;;
1556668800000;7500000;6700000;8700000;;;;
1559347200000;7000000;7300000;8200000;;;;
1561939200000;7500000;6900000;8700000;;;;
1564617600000;7000000;7100000;8200000;;;;
1567296000000;7500000;6800000;8700000;;;;
1569888000000;7000000;5900000;8200000;;;;
1572566400000;7000000;6300000;8200000;;;;
1575158400000;7500000;6500000;8700000;;;;
1577836800000;7000000;7200000;8200000;;;;
1580515200000;7000000;6600000;8200000;;;;
1583020800000;7500000;5700000;8700000;;;;
1585699200000;7000000;7000000;8200000;;;;
1588291200000;7500000;6300000;8700000;;;;
1590969600000;7000000;6800000;8200000;;;;
1593561600000;7500000;6200000;8700000;;;;
1596240000000;7000000;7400000;8200000;;;;
1598918400000;7500000;6900000;8700000;;;;
1601510400000;7000000;7100000;8200000;;;;
1604188800000;7500000;7300000;8700000;;;;
1606780800000;7000000;6800000;8200000;;;;
1609459200000;7500000;6200000;8700000;;;;
1612137600000;7000000;6500000;8200000;;;;
1614556800000;7500000;6700000;8700000;;;;
1617235200000;7000000;7200000;8200000;;;;
1619827200000;7500000;6400000;8700000;;;;
1622505600000;7000000;5900000;8200000;;;;
1625097600000;7500000;6100000;8700000;;;;
1627776000000;8000000;6300000;9200000;;;;
1630454400000;8500000;7000000;9700000;;;;
1633046400000;8000000;8500000;9200000;;;;
1635724800000;8500000;8000000;9700000;;;;
1638316800000;8000000;8300000;9200000;;;;
1640995200000;8500000;8600000;9700000;;;;
1643673600000;8000000;8800000;9200000;;;;
1646092800000;8500000;8500000;9700000;;;;
1648771200000;8000000;7500000;9200000;;;;
1651363200000;8500000;8700000;9700000;;;;
1654041600000;8000000;9500000;10200000;;;;
1656633600000;8500000;8200000;8700000;;;;
1659312000000;8000000;8900000;10700000;;;;
1661990400000;8500000;9200000;9200000;;;;
1664582400000;8000000;7800000;7800000;;;;
1667260800000;8500000;8500000;8000000;;;;
1669852800000;8000000;7800000;8000000;;;;
1672531200000;8500000;6900000;8700000;;;;
1675209600000;8000000;7100000;8900000;;;;
1677628800000;8500000;7200000;8000000;;;;
1680307200000;8000000;7400000;8000000;;;;
1682899200000;8500000;6900000;8700000;;;;
1685577600000;8000000;7100000;8900000;;;;
1688169600000;8500000;7500000;8000000;;;;
1690848000000;8000000;7300000;8700000;;;;
1693526400000;8500000;7600000;8900000;;;;
1696118400000;8000000;7600000;8900000;;;;
1698796800000;7500000;;;7900000;8200000;6900000;9000000
1701388800000;7600000;;;8000000;8300000;7000000;9200000
1704067200000;;;;7900000;8300000;7000000;9100000
1706745600000;;;;8000000;8000000;7400000;9200000
1709251200000;;;;8200000;8100000;7300000;9400000
1711929600000;;;;8100000;8400000;7400000;9200000
1714521600000;;;;7900000;8200000;7200000;9200000
1717200000000;;;;8100000;8200000;7300000;9000000
1719792000000;;;;8200000;8300000;7400000;9100000
1722470400000;;;;8400000;8500000;7500000;9200000
1725148800000;;;;8300000;8500000;7400000;9300000
1727740800000;;;;8200000;8200000;7500000;9300000
1730419200000;;;;8300000;8300000;7400000;9200000
1733011200000;;;;8100000;8400000;7500000;9300000
`;

// Split the data into rows
const wwrows = csvData.trim().split('\n');
// console.log(wwrows);

// Map each row to an array of values
const dataArray = wwrows.map((row) => row.split(';').map((value) => Number(value.trim())));

let data = null;
const currentMonth = Date.UTC(2024, 4);
console.log('currentMonth: ', currentMonth);
const revTarget = 105;
const costTarget = 89;
const currentYear = new Date(currentMonth).getFullYear();

async function initDashboard() {
  const commonGaugeOptions = {
    chart: {
      type: 'gauge',
      className: 'highcharts-gauge-chart',
      marginBottom: 0,
    },
    pane: {
      startAngle: -90,
      endAngle: 89.9,
      background: null,
      center: ['50%', '64%'],
      size: '90%',
    },
    yAxis: {
      visible: true,
      min: 0,
      minorTickInterval: null,
      labels: {
        distance: 18,
        allowOverlap: false,
      },
    },
    tooltip: {
      enabled: false,
    },
    plotOptions: {
      series: {
        dial: {
          baseWidth: 12,
          baseLength: 0,
          rearLength: 0,
        },
        pivot: {
          radius: 5,
        },
        dataLabels: {
          useHTML: true,
          format: '${y}',
        },
      },
    },
  };

  const commonColumnOptions = {
    accessibility: {
      point: {
        valuePrefix: '$',
      },
    },
    chart: {
      type: 'column',
      className: 'highcharts-column-chart',
      zoomType: 'x',
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      type: 'datetime',
      min: Date.UTC(currentYear),
      max: Date.UTC(currentYear, 11),
    },
    yAxis: {
      tickInterval: 2e6,
    },
    series: [
      {
        name: 'Budget',
        id: 'budget-series',
        colorIndex: 1,
      },
    ],
    tooltip: {
      format: `<span style="font-size: 10px">{x:%B %Y}</span><br>
          <span class="highcharts-color-{colorIndex}">&#9679;</span>&nbsp;
          {series.name}: {(divide y 1000000):.2f}M
      `,
    },
    plotOptions: {
      column: {
        point: {
          events: {
            click: () => {
              togglePopup(true);
            },
          },
        },
      },
    },
  };
  const fd = [[1706745600000, 0, 0, 0, 0, 0, 0, 0]];

  const se2data = [
    ['AWS Secrets Manager', 0.0157960752],
    ['EC2 - Other', 0.8565616842],
    ['Amazon Elastic Compute Cloud - Compute', 3.1826806041999998],
    ['Amazon Relational Database Service', 2.1806090687],
    ['Amazon Simple Storage Service', 0.011485462700000004],
    ['Amazon Virtual Private Cloud', 2.6622008319000003],
    ['AWS CloudShell', 0.0010360020999999999],
    ['AWS Step Functions', 1.7489999999999998e-7],
    ['Amazon Kinesis', 0.0988065],
    ['AWS Lambda', 6.84e-8],
    ['Amazon Simple Notification Service', 0.87708],
    ['Amazon Elastic Container Service', 0.3489076072],
    ['Tax', 9.17],
    ['Amazon Elastic Load Balancing', 4.8369314081],
    ['Amazon Route 53', 1.0073320000000001],
    ['Amazon API Gateway', 0.00004876],
    ['Amazon EC2 Container Registry (ECR)', 0.042242806900000006],
    ['Amazon SageMaker', 2.5493481913],
    ['AWS Key Management Service', 0.3972222254],
    ['Amazon Elastic Container Service for Kubernetes', 17.500192054000003],
    ['AWS Cost Explorer', 3.65],
    ['AmazonCloudWatch', 0.3307391716],
  ];

  dashboardChart = Dashboards.board(
    'container',
    {
      dataPool: {
        connectors: [
          {
            type: 'JSON',
            id: 'data',
            options: {
              data: fd,
              columnNames: ['Date', 'Cost', 'Accumulation'],
              firstRowAsNames: false,
              dataModifier: {
                type: 'Math',
                columnFormulas: [
                  
                  {
                    column: 'Accumulation',
                    formula: 'SUMIF(A$1:A1, TEXT(A1, "MMM YYYY"), B1:B1)',
                  },
                
                ],
              },
            },
          },
          {
            type: 'JSON',
            id: 'se2data',
            options: {
              data: [],
              columnNames: ['ServiceName', 'Cost'],
              firstRowAsNames: false,
            },
          },
        ],
      },
      gui: {
        layouts: [
          {
            id: 'layout-1',
            rows: [
              {
                cells: [
                  {
                    id: 'kpi-layout-cell',
                    layout: {
                      rows: [
                        {
                          cells: [
                            {
                              id: 'SA1',
                       
                      
                            },
                            {
                              id: 'SA2',
                            
                          
                            },
                            {
                              id: 'SA3',
                          
                     
                            },
                          ],
                        },
                        {
                          cells: [
                            {
                              id: 'SB1',
                            },
                            {
                              id: 'SB2',
                            },
                            {
                              id: 'SB3',
                            },
                          ],
                        },
                        {
                          cells: [
                            {
                              id: 'SC1',
                            },
                            {
                              id: 'SC2',
                            },
                            {
                              id: 'SC3',
                            },
                          ],
                        },
                      ],
                    },
                  },
                  {
                    id: 'cost-categories-cell',
                    layout: {
                     
                      rows: [
                        
                        {
                          cells: [
                            {
                              id: 'cost-categories'
                       
                      
                            },
                          ]
                        }
                      ]
                    }
                  },
                ],
              },
              {
                cells: [
                  {
                    id: 'cost-timeline',
                  },
                ],
              },
            ],
          },
        ],
      },
      components: [
        {
          renderTo: 'SA1',
          type: 'KPI',
          title: {
            text: 'Current',
          },
          chartOptions: Highcharts.merge(commonGaugeOptions, {
            accessibility: {
              point: {
                valueDescriptionFormat: 'Current Month.',
              },
            },
            yAxis: {
              max: 100,
              tickPositions: [0, 100],

              plotBands: [
                {
                  from: 0,
                  to: 100,
                  className: 'null-band',
                },
              ],
            },
            series: [
              {
                name: 'Current Month',
                data: [],
              },
            ],
          }),
        },
        {
          renderTo: 'SA2',
          type: 'KPI',
          title: {
            enabled: true,
            text: '',
            useHTML: true,
          },
          subtitle: {
            text: '',
          },
          valueFormat: '${value}',
        },
        {
          renderTo: 'SA3',
          type: 'KPI',
          title: {
            enabled: true,
            text: '',
            useHTML: true,
          },
          subtitle: {
            text: '',
          },
          valueFormat: '${value}',
        },
        {
          renderTo: 'SB1',
          type: 'KPI',
          chartOptions: Highcharts.merge(commonGaugeOptions, {
            accessibility: {
              point: {
                valueDescriptionFormat: '',
              },
            },
            yAxis: {
              max: 100,
              tickPositions: [0, 100],
              plotBands: [
                {
                  from: 0,
                  to: 100,
                  className: 'null-band',
                },
              ],
            },
            series: [
              {
                name: 'One Month before',
                data: [],
              },
            ],
          }),
        },
        {
          renderTo: 'SB2',
          type: 'KPI',
          title: '',
          valueFormat: '${value}',
        },
        {
          renderTo: 'SB3',
          type: 'KPI',
          title: '',
        },
        {
          renderTo: 'SC1',
          type: 'KPI',
          chartOptions: Highcharts.merge(commonGaugeOptions, {
            title: {
              text: '',
            },
            accessibility: {
              point: {
                valueDescriptionFormat: '',
              },
            },
            yAxis: {
              max: 100,
              tickPositions: [0, 100],
              plotBands: [
                {
                  from: 0,
                  to: 100,
                  className: 'null-band',
                },
              ],
            },
            series: [
              {
                name: 'Two Month before',
                data: [],
              },
            ],
          }),
        },
        {
          renderTo: 'SC2',
          type: 'KPI',
          title: '',
          valueFormat: '${value}',
        },
        {
          renderTo: 'SC3',
          type: 'KPI',
          title: '',
        },
        {
          title: {
            text: '',
            useHTML: true,
            style: {
              fontSize: '14px',
              fontWeight: '200',
            },
          },

          sync: {},
          connector: {
            id: 'se2data',
            columnAssignment: [
              {
                seriesId: 'budget-series',
                data: ['ServiceName', 'Cost'],
              },
            ],
          },
          renderTo: 'cost-categories',
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
              width: '100%',
              showLastLabel: false,
              tickAmount: 7,
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
                  width: '50%',
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
              highlight: true,
            },
          },
        },

        {
          renderTo: 'cost-timeline',
          type: 'Highcharts',
          chartConstructor: 'stockChart',
          connector: {
            id: 'data',
            columnAssignment: [
              {
                seriesId: 'result',
                data: ['Date', 'Cost'],
              },
            ],
          },
          sync: {
            highlight: true,
          },
          tooltip: {
            useHTML: true,
          },
          chartOptions: {
            chart: {
              className: 'highcharts-stock-chart',
              zoomType: 'x',
              panning: true,
              panKey: 'shift',
              cursor: 'pointer',
              events: {
                selection: function (event) {
                  var min = Highcharts.dateFormat('%Y-%m-%d', event.xAxis[0].min);
                  var max = Highcharts.dateFormat('%Y-%m-%d', event.xAxis[0].max);

                  // Update the second chart here based on the selected range (min, max)
                  updateSecondChart(min, max);
              
                },
                update: function () {
                  var seriesData = this.series[0].data; // Assumes data is in the first series
                  console.log('this.series[0]',this.series[0]);
                  console.log('this.xAxis[0]',this.xAxis[0]);
                  
                  
                  
                
                }
                
              },
            },
            title: {
              text: '',
            },
            subtitle: {
              text: '',
            },
            accessibility: {
              point: {
                valuePrefix: '$',
              },
            },
            xAxis: {
              cursor: 'pointer',
              events: {
                afterSetExtremes: function (e) {
                  const minDate = Highcharts.dateFormat('%Y-%m-%d', e.min);
                  const maxDate = Highcharts.dateFormat('%Y-%m-%d', e.max);
                  updateSecondChart(minDate, maxDate);
                 
                     const plotLines = generateMonthlyPlotLines(new Date(e.min), new Date(e.max));
                    e.target.series[0].xAxis.update({plotLines});
                  
                },
                
              },
            },
            rangeSelector: {
              buttons: [
                {
                  type: 'week',
                  count: 1,
                  text: '1w',
                  title: 'View 1 week',
                },
                {
                  type: 'month',
                  count: 1,
                  text: '1mo',
                  title: 'View 1 month',
                },
                {
                  type: 'month',
                  count: 3,
                  text: '3mo',
                  title: 'View 3 month',
                },
                {
                  type: 'ytd',
                  text: 'YTD',
                  title: 'View year to date',
                },
                {
                  type: 'all',
                  text: 'All',
                  title: 'View all',
                },
              ],
              selected: 4,
            },
            tooltip: {
              formatter: function () {
                const color = (s, color) => `<span class="highcharts-color-${color}">${s}</span>`;
                const date = Highcharts.dateFormat('%Y-%m-%d %A', this.x);
                return `<span style="font-size: 10px">${date}</span><br>
                          ${color('&#9679;', 0)}&nbsp;
                          Cost: $${this.y.toFixed(2)}
                      `;
              },
            },
            credits: {
              enabled: false,
            },
           
            series: [
              {
                name: 'Result',
                id: 'result',
                colorIndex: 0,
                point: {
                  cursor: 'pointer',
                  events: {
                    click: function () {
                      const min = Highcharts.dateFormat('%Y-%m-%d', this.x);
                      const max = Highcharts.dateFormat('%Y-%m-%d', this.x + 24 * 3600 * 1000);

                      updateSecondChart(min, max);
                      return true;
                    },
                  },
                },
                
              },
            ],
          },
        },
      ],
    },
    true,
  );



  const popup = document.getElementById('popup');

  popup.addEventListener('click', (e) => {
    if (e.target === popup || e.target.className === 'close') {
      togglePopup(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.style.display !== 'none') {
      popup.style.display = 'none';
    }
  });

  async function togglePopup(open) {
    if (!open) {
      popup.style.display = 'none';
      return;
    }
    popup.style.display = 'flex';

    popup.children[0].children['datagrid-container'].innerHTML = '';

    const formatNumbers = function () {
      return Highcharts.isNumber(this.value) ? `$${(this.value / 1e6).toFixed(2)}M` : '-';
    };

    new DataGrid.DataGrid('datagrid-container', {
      dataTable: (await dashboardChart).dataPool.connectors.data.table,
      editable: false,
      columns: {
        Date: {
          cellFormatter: function () {
            return this.value ? new Date(this.value).toISOString().substring(0, 10) : '?';
          },
        },
        Budget: {
          show: true,
          cellFormatter: formatNumbers,
        },
        Cost: {
          show: true,
          cellFormatter: formatNumbers,
        },
        Revenue: {
          show: true,
          cellFormatter: formatNumbers,
        },
        Result: {
          show: true,
          cellFormatter: formatNumbers,
        },
        CostPredP: {
          show: false,
        },
        RevPredP: {
          show: false,
        },
        CostPredO: {
          show: false,
        },
        RevPredO: {
          show: false,
        },
        AccResult: {
          show: false,
        },
        CostPredA: {
          show: false,
        },
        RevPredA: {
          show: false,
        },
        AccResPredP: {
          show: false,
        },
        AccResPredO: {
          show: false,
        },
        ResPredA: {
          show: false,
        },
        AccResPredA: {
          show: false,
        },
      },
    });
  }
}

function generateMonthlyPlotLines(startDate, endDate) {
  let plotLines = [];
  let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);


  
  while (currentDate <= endDate) {
    plotLines.push({
      value: currentDate.getTime(),
      color: 'red',
      width: 2,
      label: {
        text: Highcharts.dateFormat('%b %Y', currentDate.getTime()),
        align: 'left'
      }
    });

    // Increment to the next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return plotLines;
}

function getDateRange(data) {
  var dates = data.map(function(point) { return point[0]; });
  var minDate = Math.min.apply(null, dates);
  var maxDate = Math.max.apply(null, dates);
  return { min: minDate, max: maxDate };
}

function formatLastAction(jsonString) {
  try {
    const json = JSON.parse(jsonString);
    return `Action: ${json[0]}\nTime: ${json[1]}`;
  } catch (error) {
    return jsonString;
  }
}

function getDateInfo() {
  const currentDate = new Date();

  const firstDayOfMonth = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1));

  const formatDate = (date) => `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`;

  const daysBetween = currentDate.getUTCDate() - firstDayOfMonth.getUTCDate() + 1;

  return [formatDate(firstDayOfMonth), formatDate(currentDate), `${daysBetween}`];
}

async function createServiceCostsArray(jsonData) {
  let services = {};

  jsonData.forEach((entry) => {
    entry.Groups.forEach((group) => {
      const serviceName = group.Keys[0];
      const cost = parseFloat(group.Metrics.UnblendedCost.Amount);
      const date = entry.TimePeriod.Start;

      if (!services[serviceName]) {
        services[serviceName] = {};
      }

      services[serviceName][date] = cost;
    });
  });

  return Object.keys(services).map((serviceName) => {
    const serviceData = { Service: serviceName };
    let serviceTotal = 0;

    Object.entries(services[serviceName]).forEach(([date, cost]) => {
      serviceData[date] = cost;
      serviceTotal += cost;
    });

    serviceData['Service total'] = serviceTotal;
    return serviceData;
  });
}

function calculateCostsByMonth(serviceCostsArray) {
  const monthlyTotals = {};

  serviceCostsArray.forEach((service) => {
    Object.keys(service).forEach((key) => {
      if (key !== 'Service' && key !== 'Service total') {
        const [year, month] = key.split('-').slice(0, 2);
        const monthYearKey = `${year}-${month}`;

        if (!monthlyTotals[monthYearKey]) {
          monthlyTotals[monthYearKey] = 0;
        }

        monthlyTotals[monthYearKey] += service[key];
      }
    });
  });

  Object.keys(monthlyTotals).forEach((monthYearKey) => {
    monthlyTotals[monthYearKey] = Number(monthlyTotals[monthYearKey].toFixed(2));
  });

  return monthlyTotals;
}

function getUTCMonthDetails(monthName) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthIndex = monthNames.indexOf(monthName); // Convert month name to index
  if (monthIndex === -1) {
    throw new Error('Invalid month name');
  }

  const now = new Date();
  const year = now.getUTCFullYear(); // Use the current year in UTC

  // First day of the specified month
  const firstDayFormatted = `${year}-${String(monthIndex + 1).padStart(2, '0')}-01`;

  // Last day of the specified month
  const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0)); // Use monthIndex to find last day
  const lastDayFormatted = `${year}-${String(lastDay.getUTCMonth() + 1).padStart(2, '0')}-${String(lastDay.getUTCDate()).padStart(2, '0')}`;

  // Number of days in the specified month
  const numberOfDays = lastDay.getUTCDate();

  // Return the formatted first and last day, and the number of days
  return {
    firstDay: firstDayFormatted,
    lastDay: lastDayFormatted,
    numberOfDays,
  };
}

function getMonthCosts(monthlyTotals) {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();

  function formatYearMonthKey(offset) {
    const adjustedDate = new Date(year, month - offset, 1);
    const adjustedYear = adjustedDate.getFullYear();
    const adjustedMonth = (adjustedDate.getMonth() + 1).toString().padStart(2, '0');
    return `${adjustedYear}-${adjustedMonth}`;
  }

  const currentMonthKey = formatYearMonthKey(0);
  const oneMonthAgoKey = formatYearMonthKey(1);
  const twoMonthsAgoKey = formatYearMonthKey(2);

  return {
    currentMonthCost: monthlyTotals[currentMonthKey] || 0,
    oneMonthAgoCost: monthlyTotals[oneMonthAgoKey] || 0,
    twoMonthsAgoCost: monthlyTotals[twoMonthsAgoKey] || 0,
  };
}

function calculateAverageExcludingCurrentMonth(monthlyTotals) {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const currentMonthKey = `${year}-${month}`;

  let sum = 0;
  let count = 0;

  Object.keys(monthlyTotals).forEach((monthYearKey) => {
    if (monthYearKey !== currentMonthKey) {
      sum += Number(monthlyTotals[monthYearKey]);
      count++;
    }
  });

  return count > 0 ? (sum / count).toFixed(2) : 0;
}

function getMonthlyStats(monthlyTotals) {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const currentMonthKey = `${year}-${month}`;

  let sum = 0;
  let count = 0;

  Object.keys(monthlyTotals).forEach((monthYearKey) => {
    if (monthYearKey !== currentMonthKey) {
      sum += monthlyTotals[monthYearKey];
      count++;
    }
  });

  if (count > 0) {
    const averageExcludingCurrent = sum / count;
    const averagePlus10Percent = averageExcludingCurrent * 1.1;
    const averageMinus10Percent = averageExcludingCurrent * 0.9;
    return [Number(averageMinus10Percent.toFixed(2)), Number(averagePlus10Percent.toFixed(2)), Number(averageExcludingCurrent.toFixed(2))];
  }

  return [0, 0, 0];
}

function estimateMaxMonthlyCost(currentMonthCost) {
  const currentDate = new Date();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const dayOfMonth = currentDate.getDate();
  const dailyCostRate = currentMonthCost / dayOfMonth;
  const estimatedMaxCost = dailyCostRate * daysInMonth;

  return estimatedMaxCost.toFixed(2);
}

function calculateAverageDailyCost(monthName, totalCost) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthIndex = monthNames.indexOf(monthName);
  if (monthIndex === -1) {
    throw new Error('Invalid month name');
  }

  const now = new Date();
  const year = now.getUTCFullYear(); // Consider using the current year

  // Determine the number of days in the month
  const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0));
  const numberOfDays = lastDay.getUTCDate();

  // Calculate average daily cost
  const averageDailyCost = (totalCost / numberOfDays).toFixed(2);

  return averageDailyCost;
}

function getMonthNames() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const now = new Date();
  const currentMonthIndex = now.getMonth();
  const oneMonthsAgoIndex = (currentMonthIndex - 1 + 12) % 12;
  const twoMonthsAgoIndex = (currentMonthIndex - 2 + 12) % 12;
  const threeMonthsAgoIndex = (currentMonthIndex - 3 + 12) % 12;

  const currentMonthName = months[currentMonthIndex];
  const oneMonthsAgoName = months[oneMonthsAgoIndex];
  const twoMonthsAgoName = months[twoMonthsAgoIndex];
  const threeMonthsAgoName = months[threeMonthsAgoIndex];

  return {
    currentMonthName,
    oneMonthsAgoName,
    twoMonthsAgoName,
    threeMonthsAgoName,
  };
}

async function filterServicesByDate(minDate, maxDate) {
  let maxStartDate = new Date(-8640000000000);
  let maxEndDate = new Date(8640000000000);
  if (!resultData) {
    return;
  }

  if (!minDate || !maxDate) {
    resultData.forEach((item) => {
      const itemStartDate = new Date(item.TimePeriod.Start);
      const itemEndDate = new Date(item.TimePeriod.End);
      if (itemStartDate < maxStartDate) {
        maxStartDate = itemStartDate;
      }
      if (itemEndDate > maxEndDate) {
        maxEndDate = itemEndDate;
      }
    });
  }

  const start = minDate ? new Date(minDate) : maxStartDate;
  const end = maxDate ? new Date(maxDate) : maxEndDate;
  const serviceCosts = {};

  resultData.forEach((item) => {
    const itemStartDate = new Date(item.TimePeriod.Start);
    const itemEndDate = new Date(item.TimePeriod.End);
    if (itemStartDate >= start && itemEndDate <= end) {
      item.Groups.forEach((group) => {
        let serviceName = group.Keys[0];
        // Remove "Amazon " and "AWS " from the service name
        serviceName = serviceName.replace(/^Amazon\s+/, '').replace(/^AWS\s+/, '');
        const serviceCost = parseFloat(group.Metrics.UnblendedCost.Amount);
        if (serviceCost > 0) {
          if (!serviceCosts[serviceName]) {
            serviceCosts[serviceName] = 0;
          }
          serviceCosts[serviceName] += serviceCost;
        }
      });
    }
  });

  // Exclude services with a cost of 0 from the result
  let filteredServiceCosts = Object.entries(serviceCosts)
    .filter(([_, cost]) => parseFloat(cost) > 0.01)
    .map(([serviceName, serviceCost]) => [serviceName, parseFloat(serviceCost.toFixed(2))]);

  return filteredServiceCosts.sort((a, b) => b[1] - a[1]);
}

function summarizeDailyTotalCosts(data) {
  const dailySummary = {};

  // Loop through each record
  data.forEach((entry) => {
    const start = new Date(entry.TimePeriod.Start + 'T00:00:00Z').getTime();

    // Initialize the daily total for the start date if it hasn't been already
    if (!dailySummary[start]) {
      dailySummary[start] = 0;
    }

    // Aggregate total costs for the day across all services
    entry.Groups.forEach((group) => {
      const amount = parseFloat(group.Metrics.UnblendedCost.Amount);
      dailySummary[start] += amount;
    });
  });

  // Convert the summary object into an array sorted by day
  const result = Object.keys(dailySummary)
    .sort((a, b) => a - b)
    .map((day) => {
      return [parseInt(day), Number(dailySummary[day].toFixed(6))];
    });

  return result;
}

async function updateSecondChart(min, max) {
  let ss = await filterServicesByDate(min, max);
  const board = await dashboardChart;
  const boardComponents = await board.mountedComponents;
  const chart9 = boardComponents[9];
  await chart9.component.chart.series[0].setData(ss);
  await chart9.component.chart.update({ subtitle: { text: `Range: ${min}  ${max}` } });
  await chart9.component.chart.redraw();
}

async function updateDashboardData(newData) {
  stopLoading();
  if (!dashboardChart) {
    console.error('Dashboard is not initialized 2.');
    return;
  }

  try {
    const data1 = newData[0];
    resultData = newData[0];
    const fdata1 = await createServiceCostsArray(data1);
    const data1Monthly = calculateCostsByMonth(fdata1);

    const [mAveMinus10, mAvePlus10, mAve] = getMonthlyStats(data1Monthly);

    const maxMontlyCost = Math.max(...Object.values(data1Monthly));
    const monthCosts = getMonthCosts(data1Monthly);
    const estimatedMaxCost = estimateMaxMonthlyCost(monthCosts.currentMonthCost);

    const chartMax = Math.max(estimatedMaxCost, maxMontlyCost);
    const board = await dashboardChart;
    const boardComponents = await board.mountedComponents;

    const chart0 = boardComponents[0];
    const chart1 = boardComponents[1];
    const chart2 = boardComponents[2];
    const chart3 = boardComponents[3];
    const chart4 = boardComponents[4];
    const chart5 = boardComponents[5];
    const chart6 = boardComponents[6];
    const chart7 = boardComponents[7];
    const chart8 = boardComponents[8];
    const chart9 = boardComponents[9];
    const chart10 = boardComponents[10];

    const months = getMonthNames();

    const chart0_title = `${months.currentMonthName}`;
    const chart1_title = `${months.currentMonthName}`;
    const chart2_title = `${months.currentMonthName} Estimated`;
    const chart3_title = `${months.oneMonthsAgoName}`;
    const chart4_title = `${months.oneMonthsAgoName}`;
    const chart5_title = `${months.currentMonthName} / ${months.oneMonthsAgoName}`;
    const chart6_title = `${months.twoMonthsAgoName}`;
    const chart7_title = `${months.twoMonthsAgoName}`;
    const chart8_title = `${months.currentMonthName} / ${months.twoMonthsAgoName}`;

    const [sdate, edate, days] = getDateInfo();
    const chart1_adc = (monthCosts.currentMonthCost / days).toFixed(2);
    const chart1_subtitle = `<span class='csub'>${sdate} <i class="fa-solid fa-arrow-right"></i> ${edate}<br> Total: <span class='bw'>${days}</span> days <br> Daily Cost:  <span class='bw'>$${chart1_adc}</span></span>`;

    const cm = getUTCMonthDetails(months.currentMonthName);
    const chart2_adc = (estimatedMaxCost / cm.numberOfDays).toFixed(2);
    const chart2_subtitle = `<span class='csub'>${cm.firstDay} <i class="fa-solid fa-arrow-right"></i> ${cm.lastDay}<br> Total: <span class='bw'>${cm.numberOfDays}</span> days<br> Daily Cost:  <span class='bw'>$${chart2_adc}</span></span>`;

    const oma = getUTCMonthDetails(months.oneMonthsAgoName);
    const chart4_adc = calculateAverageDailyCost(months.oneMonthsAgoName, monthCosts.oneMonthAgoCost);
    const tma = getUTCMonthDetails(months.twoMonthsAgoName);
    const chart4_subtitle = `<span class='csub'>${oma.firstDay} <i class="fa-solid fa-arrow-right"></i> ${oma.lastDay}<br> Total: <span class='bw'>${oma.numberOfDays}</span> days<br> Daily Cost:  <span class='bw'>$${chart4_adc}</span></span>`;

    const chart7_adc = calculateAverageDailyCost(months.twoMonthsAgoName, monthCosts.twoMonthsAgoCost);
    const chart7_subtitle = `<span class='csub'>${tma.firstDay} <i class="fa-solid fa-arrow-right"></i> ${tma.lastDay}<br> Total: <span class='bw'>${tma.numberOfDays}</span> days<br> Daily Cost: <span class='bw'>$${chart7_adc}</span></span>`;

    const chart0_data = {
      yAxis: {
        max: chartMax,
        tickPositions: [0, mAve, monthCosts.currentMonthCost, monthCosts.oneMonthAgoCost, estimatedMaxCost, chartMax],
        plotBands: [
          {
            from: 0,
            to: mAveMinus10,
            className: 'null-band',
          },
          {
            from: mAveMinus10,
            to: mAvePlus10,
            className: 'opt-band',
          },
          {
            from: mAvePlus10,
            to: monthCosts.currentMonthCost,
            className: 'cool-band',
          },
          {
            from: monthCosts.currentMonthCost,
            to: chartMax,
            className: 'warn-band',
          },
        ],
      },
    };

    const chart3_data = {
      yAxis: {
        max: chartMax,
        tickPositions: [0, mAve, monthCosts.oneMonthAgoCost, maxMontlyCost, chartMax],
        plotBands: [
          {
            from: 0,
            to: mAveMinus10,
            className: 'null-band',
          },
          {
            from: mAveMinus10,
            to: mAvePlus10,
            className: 'opt-band',
          },
          {
            from: mAvePlus10,
            to: monthCosts.currentMonthCost,
            className: 'cool-band',
          },
          {
            from: monthCosts.currentMonthCost,
            to: chartMax,
            className: 'warn-band',
          },
        ],
      },
    };

    const chart6_data = {
      yAxis: {
        max: chartMax,
        tickPositions: [0, mAve, monthCosts.twoMonthsAgoCost, maxMontlyCost, chartMax],
        plotBands: [
          {
            from: 0,
            to: mAveMinus10,
            className: 'null-band',
          },
          {
            from: mAveMinus10,
            to: mAvePlus10,
            className: 'opt-band',
          },
          {
            from: mAvePlus10,
            to: monthCosts.currentMonthCost,
            className: 'cool-band',
          },
          {
            from: monthCosts.currentMonthCost,
            to: chartMax,
            className: 'warn-band',
          },
        ],
      },
    };

    const chart0_options = {
      title: {
        text: chart0_title,
      },
    };
    const chart3_options = {
      title: {
        text: chart3_title,
      },
    };
    const chart6_options = {
      title: {
        text: chart6_title,
      },
    };

    const chart1_options = {
      title: {
        text: chart1_title,
      },
      value: monthCosts.currentMonthCost,
      subtitle: chart1_subtitle,
    };

    const chart2_options = {
      title: {
        text: chart2_title,
      },
      value: estimatedMaxCost,
      subtitle: chart2_subtitle,
    };

    const chart4_options = {
      title: {
        text: chart4_title,
      },
      value: monthCosts.oneMonthAgoCost,
      subtitle: chart4_subtitle,
    };
    const chart7_options = {
      title: {
        text: chart7_title,
      },
      value: monthCosts.twoMonthsAgoCost,
      subtitle: chart7_subtitle,
    };

    const chart5_ep = ((estimatedMaxCost / monthCosts.oneMonthAgoCost) * 100).toFixed(0);
    const chart5_cp = ((monthCosts.currentMonthCost / monthCosts.oneMonthAgoCost) * 100).toFixed(0);
    const chart5_ec = chart5_ep > 100 ? 'danger' : 'success';
    const chart5_cc = chart5_cp > 100 ? 'danger' : 'success';
    const chart5_es = chart5_ep > 0 ? '+' : '-';
    const chart5_cs = chart5_cp > 0 ? '+' : '-';
    const chart5_diff = (monthCosts.currentMonthCost - monthCosts.oneMonthAgoCost).toFixed(2);
    const chart5_diff_cc = chart5_diff > 0 ? 'danger' : 'success';
    const chart5_diff_cs = chart5_diff > 0 ? '+' : '-';
    const chart5_diff_e = (estimatedMaxCost - monthCosts.oneMonthAgoCost).toFixed(2);
    const chart5_diff_ec = chart5_diff_e > 0 ? 'danger' : 'success';
    const chart5_diff_es = chart5_diff_e > 0 ? '+' : '-';
    let chart5_value = 'Estimated <br>';
    if(monthCosts.oneMonthAgoCost.toFixed(2) > 0.5){
      chart5_value +=`$${estimatedMaxCost} / $${monthCosts.oneMonthAgoCost} = <span class='${chart5_ec}'>${chart5_es}${chart5_ep}%</span><br>`;
    }
    
    chart5_value += `$${estimatedMaxCost} - $${monthCosts.oneMonthAgoCost} = <span class='${chart5_diff_ec}'>${chart5_diff_es}$${chart5_diff_e}</span><br><hr>`;
    if(monthCosts.oneMonthAgoCost.toFixed(2) > 0.5){
      chart5_value += `Current <br>$${monthCosts.currentMonthCost} / $${monthCosts.oneMonthAgoCost} = <span class='${chart5_cc}'>${chart5_cs}${chart5_cp}%</span><br>`;
    }
    
    chart5_value += `$${monthCosts.currentMonthCost} - $${monthCosts.oneMonthAgoCost} = <span class='${chart5_diff_cc}'>${chart5_diff_cs}$${chart5_diff}</span>`;

    const chart5_options = {
      title: {
        text: chart5_title,
      },
      value: '',
      subtitle: chart5_value,
    };

    const chart8_ep = ((estimatedMaxCost / monthCosts.twoMonthsAgoCost) * 100).toFixed(0);
    const chart8_cp = ((monthCosts.currentMonthCost / monthCosts.twoMonthsAgoCost) * 100).toFixed(0);
    const chart8_ec = chart8_ep > 100 ? 'danger' : 'success';
    const chart8_cc = chart8_cp > 100 ? 'danger' : 'success';
    const chart8_es = chart8_ep > 0 ? '+' : '-';
    const chart8_cs = chart8_cp > 0 ? '+' : '-';
    const chart8_diff = (monthCosts.currentMonthCost - monthCosts.twoMonthsAgoCost).toFixed(2);
    const chart8_diff_cc = chart8_diff > 0 ? 'danger' : 'success';
    const chart8_diff_cs = chart8_diff > 0 ? '+' : '-';
    const chart8_diff_e = (estimatedMaxCost - monthCosts.twoMonthsAgoCost).toFixed(2);
    const chart8_diff_ec = chart8_diff_e > 0 ? 'danger' : 'success';
    const chart8_diff_es = chart8_diff_e > 0 ? '+' : '-';
    let chart8_value = 'Estimated <br>';
    if (monthCosts.twoMonthsAgoCost.toFixed(2) > 0.01){
      chart8_value += `$${estimatedMaxCost} / $${monthCosts.twoMonthsAgoCost} = <span class='${chart8_ec}'>${chart8_es}${chart8_ep}%</span><br>`;
    }
    
    chart8_value += `$${estimatedMaxCost} - $${monthCosts.twoMonthsAgoCost} = <span class='${chart8_diff_ec}'>${chart8_diff_es}$${chart8_diff_e}</span><br><hr>`;
    chart8_value += `Current <br>`;
    
    if (monthCosts.twoMonthsAgoCost.toFixed(2) > 0.01){

      chart8_value += `$${monthCosts.currentMonthCost} / $${monthCosts.twoMonthsAgoCost} = <span class='${chart8_cc}'>${chart8_cs}${chart8_cp}%</span><br>`;
    }
    chart8_value += `$${monthCosts.currentMonthCost} - $${monthCosts.twoMonthsAgoCost} = <span class='${chart8_diff_cc}'>${chart8_diff_cs}$${chart8_diff}</span>`;

    const chart8_options = {
      title: {
        text: chart8_title,
      },
      value: '',
      subtitle: chart8_value,
    };

    const dailyTotalCosts = summarizeDailyTotalCosts(data1);
    // console.log('dailyTotalCosts', dailyTotalCosts);
    await chart0.component.chart.series[0].setData([monthCosts.currentMonthCost]);
    await chart0.component.chart.update(chart0_data);
    await chart0.component.update(chart0_options);

    await chart1.component.update(chart1_options);
    await chart2.component.update(chart2_options);
    await chart3.component.chart.series[0].setData([monthCosts.oneMonthAgoCost]);
    await chart3.component.chart.update(chart3_data);
    await chart3.component.update(chart3_options);

    await chart4.component.update(chart4_options);
    await chart5.component.update(chart5_options);
    await chart6.component.chart.series[0].setData([monthCosts.twoMonthsAgoCost]);
    await chart6.component.chart.update(chart6_data);
    await chart6.component.update(chart6_options);

    await chart7.component.update(chart7_options);
    await chart8.component.update(chart8_options);

    var dateRange = getDateRange(dailyTotalCosts);
                 
                    
                
    await chart10.component.chart.series[0].setData(dailyTotalCosts);
    // await chart10.component.chart.update({series:{plotLines: generateMonthlyPlotLines(new Date(dateRange.min), new Date(dateRange.max))}});
    const se2DataConnector = await board.dataPool.getConnector('se2data');
    const se2Data = await filterServicesByDate();
    se2DataConnector.options.data = se2Data;

    await chart9.component.chart.series[0].setData(se2Data);
    let c9Subtitle = '';
    c9Subtitle += `Range: ${data1[0].TimePeriod.Start} - ${data1[data1.length - 1].TimePeriod.End}`;

    await chart9.component.chart.update({ title: { text: '' }, subtitle: { text: c9Subtitle } });
  } catch (error) {
    console.error('Failed to update dashboard data2:', error);
  }
}

function handleIncomingData(message) {
  if (message.command === 'updateData') {
    updateDashboardData(message.data);
  }
}

const requestChartData = () => {
  if (costextplorerObj.updateOnFly) {
    return;
  } else {
    startLoading();

    vscode.postMessage({
      command: 'requestData',
    });
  }
};

const init = async () => {
  await initDashboard();
  stopDashboardChartInterval();
  document.getElementById('interval').addEventListener('change', function () {
    costextplorerObj.intervalValue = parseInt(this.value, 10);
    if (costextplorerObj.intervalValue < 1) {
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
  if (costextplorerObj.timerInterval) {
    clearInterval(costextplorerObj.timerInterval);
  }
  if (costextplorerObj.intervalValue > 0) {
    costextplorerObj.timerInterval = setInterval(() => {
      requestChartData();
    }, costextplorerObj.intervalValue * 1000);
  }
};

const stopDashboardChartInterval = () => {
  if (costextplorerObj.timerInterval) {
    clearInterval(costextplorerObj.timerInterval);
  }
};

function startLoading() {
  costextplorerObj.updateOnFly = true;

  const refreshButton = document.getElementById('refresh-button');
  if (refreshButton && refreshButton.classList && !refreshButton.classList.contains('rotating')) {
    refreshButton.classList.add('rotating');
  }
  const loadingDiv = document.getElementById('loading');
  const timerSpan = document.getElementById('timer');
  let startTime = Date.now();
  timerSpan.textContent = '00:00:00';
  loadingDiv.style.display = 'block';

  costextplorerObj.timerInterval = setInterval(() => {
    let timeElapsed = Date.now() - startTime;
    let minutes = Math.floor(timeElapsed / 60000);
    let seconds = Math.floor((timeElapsed % 60000) / 1000);
    let milliseconds = Math.floor((timeElapsed % 1000) / 10);
    timerSpan.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
  }, 10);
}

function stopLoading() {
  costextplorerObj.updateOnFly = false;

  const refreshButton = document.getElementById('refresh-button');
  if (refreshButton && refreshButton.classList && refreshButton.classList.contains('rotating')) {
    refreshButton.classList.remove('rotating');
  }
  const loadingDiv = document.getElementById('loading');
  if (loadingDiv && loadingDiv.style) {
    loadingDiv.style.display = 'none';
  }
  if (costextplorerObj.timerInterval) {
    clearInterval(costextplorerObj.timerInterval);
    costextplorerObj.timerInterval = null;
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
