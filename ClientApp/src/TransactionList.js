import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [startingDate, setStartingDate] = useState(null);
    const [endingDate, setEndingDate] = useState(null);
    const [transactionType, setTransactionType] = useState('all'); // 'all', 'income', 'expenditure'
    const walletId = 1; // Id testowe

    const handleStartingDateChange = (event) => {
        setStartingDate(event.target.value);
    };

    const handleEndingDateChange = (event) => {
        setEndingDate(event.target.value);
    };

    const handleFilterClick = async () => {
        const startDate = startingDate ? new Date(startingDate) : null;
        const endDate = endingDate ? new Date(endingDate) : null;

        let formattedStartingDate = '';
        let formattedEndingDate = '';

        if (startDate)
            formattedStartingDate = startDate.toISOString().split("T")[0];

        if (endDate)
            formattedEndingDate = endDate.toISOString().split("T")[0];

        try {
            let url = `https://localhost:7088/api/transaction/`;
            if (transactionType === 'income') {
                url += `incomesForWallet/${walletId}`;
            } else if (transactionType === 'expenditure') {
                url += `expendituresForWallet/${walletId}`;
            } else {
                url += `transactionsForWallet/${walletId}`;
            }

            const queryParams = [
                startDate ? `startDate=${formattedStartingDate}` : null,
                endDate ? `endDate=${formattedEndingDate}` : null
            ].filter(Boolean).join('&');

            const response = await fetch(`${url}?${queryParams}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error('Error during fetching transactions:', error);
        }
    };

    const handleTransactionTypeChange = (type) => {
        setTransactionType(type);
    };

    useEffect(() => {
        handleFilterClick();
    }, [walletId, transactionType]); // Dodanie transactionType do zale¿noœci useEffect dla automatycznego filtrowania

    return (
        <div>
            <h2>Transaction list for wallet {walletId}</h2>

            <div>
                <button onClick={() => handleTransactionTypeChange('all')}>All Transactions</button>
                <button onClick={() => handleTransactionTypeChange('income')}>Incomes</button>
                <button onClick={() => handleTransactionTypeChange('expenditure')}>Expenditures</button>
            </div>

            <h3>Filter results:</h3>
            Starting date: <input
                type="date"
                name="startingDatePicker"
                value={startingDate || ''}
                onChange={handleStartingDateChange}
            /> Ending date: <input
                type="date"
                name="endingDatePicker"
                value={endingDate || ''}
                onChange={handleEndingDateChange}
            /> <button onClick={handleFilterClick}>Filter</button>

            <ul>
                {transactions.map((transaction) => (
                    <li key={transaction.Id}>
                        Transaction ID: {transaction.Id}, Title: {transaction.Title}, Amount: {transaction.Amount}, Date: {new Date(transaction.Date).toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionList;
