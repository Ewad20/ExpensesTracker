// Chart1.js
import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

const Chart1 = () => {
    useEffect(() => {
        const ctx = document.getElementById("myChart").getContext("2d");
        const xValues = ["Incomes", "Expenses"];
        const yValues = [4, 8];

        new Chart(ctx, {
            type: "pie",
            data: {
                labels: xValues,
                datasets: [{
                    fill: false,
                    lineTension: 0,
                    backgroundColor: ["pink", "lightblue"],
                    borderColor: "6C698D",
                    data: yValues
                }]
            },
            options: {
                legend: { display: false },
                scales: {
                    yAxes: [{ ticks: { min: 6, max: 16 } }],
                }
            }
        });
    }, []);

    return (
        <div className="dashboard-card dashboard-card__main-section chart-container2">
            <p style={{ fontWeight: 'bold', fontSize: '18px' }}> Incomes & Expenses</p>
            <canvas id="myChart" width="200" height="200"></canvas>
        </div>
    );
};

export default Chart1;
