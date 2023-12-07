import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function MonthlySummaryComponent() {
    const [summary, setSummary] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(1);
    const [selectedYear, setSelectedYear] = useState(2023);
    const WalletId = 1;
    const [selectedWallet, setSelectedWallet] = useState(WalletId);

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    /*const handleWalletChange = (e) => {
        setSelectedWallet(e.target.value);
    };*/

    const fetchData = async () => {
        setLoading(true);

        try {
            /*const walletsResponse = await fetch(`https://localhost:7088/api/wallets`);
            if (!walletsResponse.ok) {
                throw new Error('Network response was not ok');
            }
            const walletsData = await walletsResponse.json();

            // Ustawienie listy portfeli w opcjach wyboru
            setWalletOptions(walletsData.map(wallet => ({ id: wallet.id, name: wallet.name })));*/


            const [summaryResponse, transactionsResponse] = await Promise.all([
                fetch(`https://localhost:7088/api/monthlySummary/${selectedWallet}/${selectedYear}/${selectedMonth}`),
                fetch(`https://localhost:7088/api/transactions/${selectedWallet}/${selectedYear}/${selectedMonth}`)
            ]);

            if (!summaryResponse.ok || !transactionsResponse.ok) {
                throw new Error('Network response was not ok');
            }

            const summaryData = await summaryResponse.json();
            const transactionsData = await transactionsResponse.json();

            setSummary(summaryData);
            setTransactions(transactionsData);
            setLoading(false);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setLoading(false);
            // Obsługa błędów z pobieraniem danych
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedMonth, selectedYear]);

    return (
        <div>
            <h2>Monthly Summary</h2>
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="month">Month:</label>
                <select id="month" value={selectedMonth} onChange={handleMonthChange} style={{ marginLeft: '10px', marginRight: '10px' }}>
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                            {new Date(2000, i).toLocaleString('en', { month: 'long' })}
                        </option>
                    ))}
                </select>
                <label htmlFor="year">Year:</label>
                <select id="year" value={selectedYear} onChange={handleYearChange} style={{ marginLeft: '10px', marginRight: '10px' }}>
                    {Array.from({ length: 10 }, (_, i) => (
                        <option key={i + 1} value={2023 - i}>
                            {2023 - i}
                        </option>
                    ))}
                </select>
                <label htmlFor="wallet">Wallet:{WalletId}</label>
                
                <button onClick={fetchData} style={{ marginLeft: '10px' }}>Get Summary</button>
            </div>
            {!loading && summary && (
                <div>
                    <h3>Summary:</h3>
                    <p>Income: {summary.TotalIncome}</p>
                    <p>Balance: {summary.NetBalance}</p>
                    <p>Expenditure: {summary.TotalExpenditure}</p>
                </div>
            )}
            {!loading && transactions.length > 0 && (
                <div>
                    <h3>Transactions:</h3>
                    <ul>
                        {transactions.map(transaction => (
                            <li key={transaction.id}>
                                Transaction ID: {transaction.Id},
                                Title: {transaction.Title},
                                Amount: {transaction.Amount},
                                Date: {new Date(transaction.Date).toLocaleString()}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {loading && <p>Loading...</p>}
            {!loading && transactions.length === 0 && (
                <p>No transactions found for the selected criteria.</p>
            )}
        </div>
    );
}

export default MonthlySummaryComponent;


/*wybór portfela
<select id="wallet" value={selectedWallet} onChange={handleWalletChange} style={{ marginLeft: '10px', marginRight: '10px' }}>
    {/*Opcje wyboru portfela }
</>*/


