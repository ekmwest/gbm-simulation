const INITIAL_WEALTH = 1;
const WEALTH_CHANGE_ON_WIN = 1.5;
const WEALTH_CHANGE_ON_LOSS = 0.6;
const TIME_SIMULATION_ROUNDS = 10000;
const ENSEMBLE_SIMULATION_ROUNDS = 10;
const ENSEMBLE_SIMULATION_POPULATION = 10000;

google.charts.load('current', { 'packages': ['corechart'] });
window.addEventListener('load', ensembleSimulation);
window.addEventListener('load', timeSimulation);

function ensembleSimulation() {
    const ensembleSimulationRawData = [];

    for (let i = 0; i < ENSEMBLE_SIMULATION_POPULATION; i++) {
        ensembleSimulationRawData.push(createTimeSerie(
            INITIAL_WEALTH,
            ENSEMBLE_SIMULATION_ROUNDS,
            WEALTH_CHANGE_ON_WIN,
            WEALTH_CHANGE_ON_LOSS
        ));
    }

    const ensembleSimulation = [];

    // Calculate averages
    for (let r = 0; r <= ENSEMBLE_SIMULATION_ROUNDS; r++) {
        let totalWealth = 0;
        for (let p = 0; p < ENSEMBLE_SIMULATION_POPULATION; p++) {
            totalWealth += ensembleSimulationRawData[p][r][1];
        }
        const averageWealth = totalWealth / ENSEMBLE_SIMULATION_POPULATION;
        ensembleSimulation.push([r, averageWealth]);
    }

    ensembleSimulation.unshift(['Round', 'Wealth']); // Add labels

    var data = google.visualization.arrayToDataTable(ensembleSimulation);

    var options = {
        title: 'Ensemble Simulation — Log Scale',
        curveType: 'function',
        width: chartWidth(),
        height: chartHeight(),
        legend: 'none',
        chartArea: { 'width': '100%', 'height': '80%' },
        hAxis: {
            title: 'Round'
        },
        vAxis: {
            title: null,
            textPosition: 'none',
            scaleType: 'log',
            ticks: [1, 2]
        }
    };

    var chart = new google.visualization.LineChart(document.getElementById('ensembleSimulation'));

    chart.draw(data, options);
}

function timeSimulation() {
    const timeSimulation = createTimeSerie(
        INITIAL_WEALTH,
        TIME_SIMULATION_ROUNDS,
        WEALTH_CHANGE_ON_WIN,
        WEALTH_CHANGE_ON_LOSS
    );

    timeSimulation.unshift(['Round', 'Wealth']); // Add labels

    var data = google.visualization.arrayToDataTable(timeSimulation);

    var options = {
        title: 'Time Simulation — Log Scale',
        curveType: 'function',
        width: chartWidth(),
        height: chartHeight(),
        legend: 'none',
        chartArea: { 'width': '100%', 'height': '80%' },
        hAxis: {
            title: 'Round'
        },
        vAxis: {
            title: null,
            textPosition: 'none',
            scaleType: 'log',
            ticks: [0, 1]
        }
    };

    var chart = new google.visualization.LineChart(document.getElementById('timeSimulation'));

    chart.draw(data, options);
}

function createTimeSerie(startValue, rounds, changeOnWin, changeOnLoss) {
    // Initial Data Point
    const timeSerie = [[0, startValue]];

    for (let i = 1; i <= rounds; i++) {
        if (Math.random() < 0.5) {
            timeSerie.push([i, timeSerie[i - 1][1] * changeOnWin]);
        } else {
            timeSerie.push([i, timeSerie[i - 1][1] * changeOnLoss]);
        }
    }

    return timeSerie;
}

function chartWidth() {
    const bodyClientWidth = document.body.clientWidth;

    if (bodyClientWidth > 768) {
        return 768;
    } else {
        return bodyClientWidth;
    }
}

function chartHeight() {
    return chartWidth() * 0.3;
}
