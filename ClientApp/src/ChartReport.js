import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

const ChartReport = ({ summary }) => {
    useEffect(() => {
        if (summary) {
            const ctx = document.getElementById("myChart").getContext("2d");
            const xValues = ["Incomes", "Expenses"];
            const yValues = [summary.totalIncome, summary.totalExpenditure];

            new Chart(ctx, {
                type: "pie",
                data: {
                    labels: xValues,
                    datasets: [{
                        fill: false,
                        lineTension: 0,
                        backgroundColor: ["lightgreen", "lightcoral"],
                        borderColor: "6C698D",
                        data: yValues,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                        },
                    },
                },
            });
        }
    }, [summary]);

    return (
        <div className="card mx-auto my-5 h-auto background-my w-75">
            <p style={{ fontWeight: 'bold', fontSize: '18px' }}>Financial Summary</p>
            <div style={{ height: '300px' }}>
                <canvas id="myChart" width="400" height="400"></canvas>
            </div>
        </div>
    );
};

export default ChartReport;