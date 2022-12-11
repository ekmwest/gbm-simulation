/*  =====================================================================
    Constants
    ===================================================================== */

const INITIAL_WEALTH = 1;

const PROBABILITY_OF_WIN = 0.5;

const WEALTH_CHANGE_ON_WIN = 1.5;
const WEALTH_CHANGE_ON_LOSS = 0.6;

const ENSEMBLE_SIMULATION_ROUNDS = 10;
const ENSEMBLE_SIMULATION_POPULATION = 10000;

const TIME_SIMULATION_ROUNDS = 10000;

const KELLY_BET = PROBABILITY_OF_WIN / (1 - WEALTH_CHANGE_ON_LOSS) - (1 - PROBABILITY_OF_WIN) / (WEALTH_CHANGE_ON_WIN - 1);



/*  =====================================================================
    Simulations
    ===================================================================== */

function ensembleSimulation() {

    // 1. Run Ensemble Simulations

    const ensembleSimulations = [];

    for (let i = 0; i < ENSEMBLE_SIMULATION_POPULATION; i++) {
        ensembleSimulations.push(
            simulateBrownianMotion(
                INITIAL_WEALTH,
                ENSEMBLE_SIMULATION_ROUNDS,
                WEALTH_CHANGE_ON_WIN,
                WEALTH_CHANGE_ON_LOSS
            ));
    }

    // 2. Compute Ensemble Average

    const ensembleAverage = [];

    for (let r = 0; r <= ENSEMBLE_SIMULATION_ROUNDS; r++) {
        let totalWealth = 0;

        for (let p = 0; p < ENSEMBLE_SIMULATION_POPULATION; p++) {
            totalWealth += ensembleSimulations[p][r][1];
        }

        const averageWealth = totalWealth / ENSEMBLE_SIMULATION_POPULATION;

        ensembleAverage.push([r, averageWealth]);
    }

    return ensembleAverage;
}


function timeSimulation() {
    const timeSimulation = simulateBrownianMotion(
        INITIAL_WEALTH,
        TIME_SIMULATION_ROUNDS,
        WEALTH_CHANGE_ON_WIN,
        WEALTH_CHANGE_ON_LOSS
    );

    return timeSimulation;
}


function kellySimulation() {
    const kellySimulation = simulateBrownianMotion(
        INITIAL_WEALTH,
        TIME_SIMULATION_ROUNDS,
        WEALTH_CHANGE_ON_WIN,
        WEALTH_CHANGE_ON_LOSS,
        KELLY_BET
    );

    return kellySimulation;
}



/*  =====================================================================
    Simulate Brownian Motion
    ===================================================================== */

function simulateBrownianMotion(startValue, rounds, changeOnWin, changeOnLoss, bet = 1) {
    const randomWalk = [[0, startValue]]; // Initial Data Point

    for (let i = 1; i <= rounds; i++) {
        const valueFromPreviousRound = randomWalk[i - 1][1];

        if (Math.random() < 0.5) {
            randomWalk.push([i, valueFromPreviousRound * bet * changeOnWin + valueFromPreviousRound * (1 - bet)]);
        } else {
            randomWalk.push([i, valueFromPreviousRound * bet * changeOnLoss + valueFromPreviousRound * (1 - bet)]);
        }
    }

    return randomWalk;
}



/*  =====================================================================
    Render Simulations
    ===================================================================== */

function renderEnsembleSimulation() {
    const simulationData = ensembleSimulation();

    simulationData.unshift(['Round', 'Wealth']); // Labels

    const chartData = google.visualization.arrayToDataTable(simulationData);
    const chartOtions = createChartOptions('Ensemble Average Simulation — Log Scale', [1, 2])
    const chart = new google.visualization.LineChart(document.getElementById('ensembleSimulation'));

    chart.draw(chartData, chartOtions);
}


function renderTimeSimulation() {
    const simulationData = timeSimulation();

    simulationData.unshift(['Round', 'Wealth']); // Labels

    const chartData = google.visualization.arrayToDataTable(simulationData);
    const chartOtions = createChartOptions('Time Average Simulation — Log Scale', [0, 1])
    const chart = new google.visualization.LineChart(document.getElementById('timeSimulation'));

    chart.draw(chartData, chartOtions);
}


function renderKellySimulation() {
    const simulationData = kellySimulation();

    simulationData.unshift(['Round', 'Wealth']); // Labels

    const chartData = google.visualization.arrayToDataTable(simulationData);
    const chartOtions = createChartOptions('Kelly Fraction Simulation — Log Scale', [0, 1])
    const chart = new google.visualization.LineChart(document.getElementById('kellySimulation'));

    chart.draw(chartData, chartOtions);
}


/*  =====================================================================
    Chart Helpers
    ===================================================================== */

function createChartOptions(title, ticks) {
    return {
        title: title,
        curveType: 'function',
        colors: ['#1d77f4'],
        width: chartWidth(),
        height: chartHeight(),
        legend: 'none',
        chartArea: { 'width': '100%', 'height': '80%' },
        hAxis: {
            title: null
        },
        vAxis: {
            title: null,
            textPosition: 'none',
            scaleType: 'log',
            ticks: ticks
        }
    };
}


function chartWidth() {
    const padding = 16;
    const bodyClientWidth = document.body.clientWidth;

    if (bodyClientWidth > 768) {
        return 768 - 2 * padding;
    } else {
        return bodyClientWidth - 2 * padding;
    }
}


function chartHeight() {
    return chartWidth() * 0.4;
}



/*  =====================================================================
    Event Handlers
    ===================================================================== */

window.addEventListener('load', renderEnsembleSimulation);
window.addEventListener('load', renderTimeSimulation);
window.addEventListener('load', renderKellySimulation);

document.addEventListener('click', event => {
    switch (event.target.name) {
        case 'btnEnsebleSimulation':
            renderEnsembleSimulation();
            break;
        case 'btnTimeSimulation':
            renderTimeSimulation();
            break;
        case 'btnKellySimulation':
            renderKellySimulation();
            break;
    }
});



/*  =====================================================================
    Load Chart Library
    ===================================================================== */

google.charts.load('current', { 'packages': ['corechart'] });
