const INITIAL_WEALTH = 1;
const WEALTH_CHANGE_ON_WIN = 1.5;
const WEALTH_CHANGE_ON_LOSS = 0.6;
const TIME_SIMULATION_ROUNDS = 10000;
const ENSEMBLE_SIMULATION_ROUNDS = 10;
const ENSEMBLE_SIMULATION_POPULATION = 10000;
const KELLY_BET = 0.25;


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

    // Calculate Averages
    for (let r = 0; r <= ENSEMBLE_SIMULATION_ROUNDS; r++) {
        let totalWealth = 0;
        for (let p = 0; p < ENSEMBLE_SIMULATION_POPULATION; p++) {
            totalWealth += ensembleSimulationRawData[p][r][1];
        }
        const averageWealth = totalWealth / ENSEMBLE_SIMULATION_POPULATION;
        ensembleSimulation.push([r, averageWealth]);
    }

    ensembleSimulation.unshift(['Round', 'Wealth']); // Labels

    const data = google.visualization.arrayToDataTable(ensembleSimulation);
    const options = createChartOptions('Ensemble Average Simulation — Log Scale', [1, 2])
    const chart = new google.visualization.LineChart(document.getElementById('ensembleSimulation'));

    chart.draw(data, options);
}


function timeSimulation() {
    const timeSimulation = createTimeSerie(
        INITIAL_WEALTH,
        TIME_SIMULATION_ROUNDS,
        WEALTH_CHANGE_ON_WIN,
        WEALTH_CHANGE_ON_LOSS
    );

    timeSimulation.unshift(['Round', 'Wealth']); // Labels

    const data = google.visualization.arrayToDataTable(timeSimulation);
    const options = createChartOptions('Time Average Simulation — Log Scale', [0, 1])
    const chart = new google.visualization.LineChart(document.getElementById('timeSimulation'));

    chart.draw(data, options);
}


function kellySimulation() {
    const timeSimulation = createTimeSerie(
        INITIAL_WEALTH,
        TIME_SIMULATION_ROUNDS,
        WEALTH_CHANGE_ON_WIN,
        WEALTH_CHANGE_ON_LOSS,
        KELLY_BET
    );

    timeSimulation.unshift(['Round', 'Wealth']); // Labels

    const data = google.visualization.arrayToDataTable(timeSimulation);
    const options = createChartOptions('Kelly Fraction Simulation — Log Scale', [0, 1])
    const chart = new google.visualization.LineChart(document.getElementById('kellySimulation'));

    chart.draw(data, options);
}


function createTimeSerie(startValue, rounds, changeOnWin, changeOnLoss, bet = 1) {
    const timeSerie = [[0, startValue]]; // Initial Data Point

    for (let i = 1; i <= rounds; i++) {
        const wealthFromPreviousRound = timeSerie[i - 1][1];

        if (Math.random() < 0.5) {
            timeSerie.push([i, wealthFromPreviousRound * bet * changeOnWin + wealthFromPreviousRound * (1 - bet)]);
        } else {
            timeSerie.push([i, wealthFromPreviousRound * bet * changeOnLoss + wealthFromPreviousRound * (1 - bet)]);
        }
    }

    return timeSerie;
}


google.charts.load('current', { 'packages': ['corechart'] });
window.addEventListener('load', ensembleSimulation);
window.addEventListener('load', timeSimulation);
window.addEventListener('load', kellySimulation);
document.addEventListener('click', event => {
    switch (event.target.name) {
        case 'btnEnsebleSimulation':
            ensembleSimulation();
            break;
        case 'btnTimeSimulation':
            timeSimulation();
            break;
        case 'btnKellySimulation':
            kellySimulation();
            break;
    }
})


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
            title: 'Round'
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
