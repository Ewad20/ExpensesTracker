import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [startingDate, setStartingDate] = useState(null);
    const [endingDate, setEndingDate] = useState(null);
    const walletId = 1; //Id testowe

    const handleStartingDateChange = (event) => {
        setStartingDate(event.target.value);
    };

    const handleEndingDateChange = (event) => {
        setEndingDate(event.target.value);
    };

    const handleFilterClick = () => {
        const startDate = startingDate ? new Date(startingDate) : null;
        const endDate = endingDate ? new Date(endingDate) : null;

        let formattedStartingDate = '';
        let formattedEndingDate = '';

        if (startDate)
            formattedStartingDate = startDate.toISOString().split("T")[0];

        if (endDate)
            formattedEndingDate = endDate.toISOString().split("T")[0];

        const fetchTransactions = async () => {
            try {
                const url = `https://localhost:7088/api/transaction/transactionsForWallet/${walletId}?`;

                const queryParams = [
                    startDate ? `startDate=${formattedStartingDate}` : null,
                    endDate ? `endDate=${formattedEndingDate}` : null
                ].filter(Boolean).join('&');

                const response = await fetch(`${url}${queryParams}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTransactions(data);
            } catch (error) {
                console.error('Error during fetching transactions:', error);
        }
        };

        fetchTransactions();
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch(`https://localhost:7088/api/transaction/transactionsForWallet/${walletId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTransactions(data);
            } catch (error) {
                console.error('Error during fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [walletId]);

  return (
    <div>
          <h2>Transaction list for wallet {walletId}</h2>
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
