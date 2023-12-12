import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChartReport from './ChartReport';


const MonthlySummary = () => {
    const [walletId, setWalletId] = useState('');
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [summary, setSummary] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [dataGenerated, setDataGenerated] = useState(false);



    const handleGenerateClick = async () => {
        try {
            const response = await fetch(`api/transaction/monthlySummary/${walletId}/${year}/${month}`, {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSummary(data);
            setTransactions(data.transactions);
            setDataGenerated(true);
        } catch (error) {
            console.error('Error during fetching summary:', error);
        }
    };

    return (
        <div className='container'>
            <h1>Monthly Summary</h1>
            <div style={{ marginBottom: '20px' }}>
                <input type="text" placeholder="Wallet ID" value={walletId} onChange={(e) => setWalletId(e.target.value)} />
                <input type="text" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
                <input type="text" placeholder="Month" value={month} onChange={(e) => setMonth(e.target.value)} />
                <button onClick={handleGenerateClick}>Generate</button>
            </div>
            {summary && (
                <div style={{ width: '100%', fontSize: '18px' }}>
                    <p>
                        <span style={{ color: 'green', fontWeight: 'bold' }}>Total Income: {summary.totalIncome}</span>&nbsp;
                        <span style={{ fontWeight: 'bold' }}>Net Balance: {summary.netBalance}</span>&nbsp;
                        <span style={{ color: 'red', fontWeight: 'bold' }}>Total Expenditure: {summary.totalExpenditure}</span>&nbsp;
                    </p>
                </div>

            )}
            {dataGenerated && summary && (
                <ChartReport summary={summary} />
            )}
            <div style={{ display: 'flex' }}>
                {summary && summary.incomeByCategory && summary.incomeByCategory.length > 0 && (
                    <div style={{ flex: 1 }}>
                        <h3>Income by Category:</h3>
                        {summary.incomeByCategory.map((category, index) => (
                            <div key={index}>
                                <p>
                                    <strong>{category.categoryName}</strong> - {category.totalAmount} PLN
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {summary && summary.expenditureByCategory && summary.expenditureByCategory.length > 0 && (
                    <div style={{ flex: 1 }}>
                        <h3>Expenditure by Category:</h3>
                        {summary.expenditureByCategory.map((category, index) => (
                            <div key={index}>
                                <p>
                                    <strong>{category.categoryName}</strong> - {category.totalAmount} PLN
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {transactions.length > 0 && (
                <div>
                    <h3>Transactions:</h3>
                    {transactions.map((transaction, index) => (
                        <div key={index}>
                            <p>
                                {new Date(transaction.date).toLocaleDateString('pl-PL', { year: 'numeric', month: '2-digit', day: '2-digit' })} - {transaction.title} - {transaction.amount} PLN &nbsp;
                                <span style={{ color: transaction.type === 'income' ? 'green' : 'red' }}>
                                    ({transaction.type === 'income' ? 'Income' : 'Expenditure'})
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            )}




        </div>
    );
};

export default MonthlySummary;