import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [startingDate, setStartingDate] = useState(null);
    const [endingDate, setEndingDate] = useState(null);
    const [transactionType, setTransactionType] = useState('all'); // 'all', 'income', 'expenditure'
    const { walletId } = useParams();

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

            const response = await fetch(`${url}?${queryParams}`, {
                credentials: "include"
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            if (data != "")
                setTransactions(data);
            else
                setTransactions([]);
        } catch (error) {
            console.error('Error during fetching transactions:', error);
        }
    };

    const handleTransactionTypeChange = (type) => {
        setTransactionType(type);
    };

    useEffect(() => {
        handleFilterClick();
    }, [walletId, transactionType]); // Dodanie transactionType do zale�no�ci useEffect dla automatycznego filtrowania

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
                {transactions.map((transaction, i) => (
                    <li key={i}>
                        Transaction ID: {transaction.id}, Title: {transaction.title}, Amount: {transaction.amount}, Date: {transaction.date}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionList;
