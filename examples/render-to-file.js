const { Chart } = require('../lib/index')

const option = {
    title: {
        text: 'ECharts entry example'
    },
    backgroundColor: 'white',
    tooltip: {},
    legend: {
        data:['Sales']
    },
    xAxis: {
        data: ["shirt","cardign","chiffon shirt","pants","heels","socks"]
    },
    yAxis: {},
    series: [{
        name: 'Sales',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
    }]
};

const chart = new Chart(800, 600);
chart.renderToFileSync(option, 'render-to-file.png');