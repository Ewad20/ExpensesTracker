import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

const Chart2 = () => {
    useEffect(() => {
        const ctx2 = document.getElementById("myChart2").getContext("2d");
        const xValues = ["Food", "Clothes", "Fuel", "Cosmetics"];
        const yValues = [4, 8, 10, 6];

        new Chart(ctx2, {
            type: "bar",
            data: {
                labels: xValues,
                datasets: [{
                    fill: false,
                    lineTension: 0,
                    backgroundColor: ["pink", "lightblue", "cyan", "grey"],
                    borderColor: "6C698D",
                    data: yValues,
                }],
            },
            options: {
                legend: { display: false },
                scales: {
                    yAxes: [{ ticks: { min: 0, max: 16 } }],
                },
            },
        });
    }, []);

    return (
        <div className="dashboard-card dashboard-card__main-section chart-container">
            <p style={{ fontWeight: 'bold', fontSize: '18px' }}>Expense Categories</p>
            <canvas id="myChart2" width="200" height="200"></canvas>
        </div>
    );
};

export default Chart2;
