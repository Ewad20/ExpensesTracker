import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const Comparison = ({ walletId }) => {
    const chartRef = useRef(null);
    const [comparisonData, setComparisonData] = useState([]);
    const targetYear = 2024; // Grudzień 2023
    const targetMonth = 1; // Grudzień

    useEffect(() => {
        const fetchComparisonData = async () => {
            try {
                const response = await fetch(`api/transaction/monthlyComparison/${walletId}/${targetYear}/${targetMonth}`, {
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setComparisonData(data);
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Error fetching comparison data:', error);
            }
        };

        fetchComparisonData();
    }, [walletId, targetYear, targetMonth]);

    useEffect(() => {
        if (comparisonData.length > 0) {
            console.log(comparisonData)
            const ctx = chartRef.current.getContext('2d');

            const months = comparisonData.map(item => `${item.month}-${item.year}`);
            const incomes = comparisonData.map(item => item.income);
            const expenditures = comparisonData.map(item => item.expenditure);
            
            console.log('Incomes:', incomes);
            console.log(months, expenditures, incomes);

            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: months,
                    datasets: [
                        {
                            label: 'Incomes',
                            backgroundColor: 'lightgreen',
                            borderColor: 'green',
                            borderWidth: 1,
                            data: incomes,
                            barPercentage: 0.9, // Grubość słupków
                            categoryPercentage: 0.9, // Odległość między słupkami
                        },
                        {
                            label: 'Expenditures',
                            backgroundColor: 'lightcoral',
                            borderColor: 'red',
                            borderWidth: 1,
                            data: expenditures,
                            barPercentage: 0.9, // Grubość słupków
                            categoryPercentage: 0.9, // Odległość między słupkami
                        },
                        
                    ],
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
                    scales: {
                        y: {
                            beginAtZero: true, // Zacznij od zera
                            suggestedMin: 0, // Sugerowana minimalna wartość
                            suggestedMax: Math.max(...expenditures, ...incomes) + 100, // Maksymalna wartość (wartość wydatków + wartość wpływów + margines)
                        },
                    },
                },
            });
        }
    }, [comparisonData]);

    return (
        <div className="card mx-auto my-5 h-auto background-my w-75">
            <p style={{ fontWeight: 'bold', fontSize: '18px' }}>Monthly Expenditure Comparison</p>
            <div style={{ height: '300px' }}>
                <canvas ref={chartRef} width="400" height="400"></canvas>
            </div>
        </div>
    );
};

export default Comparison;
