import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [startingDate, setStartingDate] = useState(null);
    const [endingDate, setEndingDate] = useState(null);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const walletId = 1; //Id testowe

    const handleStartingDateChange = (event) => {
        setStartingDate(event.target.value);
    };

    const handleEndingDateChange = (event) => {
        setEndingDate(event.target.value);
    };

    const handleFilterClick = () => {
        if (!startingDate && !endingDate) {
            setFilteredTransactions(transactions);
        } else if (!startingDate) {
            const filtered = transactions.filter((transaction) => {
                let jsDate = new Date(transaction.Date);
                return jsDate <= endingDate;
            });
            setFilteredTransactions(filtered);
        } else if (!endingDate) {
            const filtered = transactions.filter((transaction) => {
                let jsDate = new Date(transaction.Date);
                return jsDate >= startingDate;
            });
            setFilteredTransactions(filtered);
        } else {
            const filtered = transactions.filter((transaction) => {
                let jsDate = new Date(transaction.Date);
                if (jsDate >= startingDate && jsDate <= endingDate)
                    return true;
                return false;
            });
            setFilteredTransactions(filtered);
        }
        const sortedTransactions = filteredTransactions.slice().sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        setFilteredTransactions(sortedTransactions);
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
                setFilteredTransactions(data);
            } catch (error) {
                console.error('Error during fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [walletId]);


    useEffect(() => {
        setFilteredTransactions([...filteredTransactions]);
    }, [filteredTransactions]);

  return (
    <div>
          <h2>Transaction list for wallet {walletId}</h2>
          <h3>Filter results:</h3>
          Starting date:
          <input
              type="date"
              name="startingDatePicker"
              value={startingDate || ''}
              onChange={handleStartingDateChange}
          />
          <input
              type="date"
              name="endingDatePicker"
              value={endingDate || ''}
              onChange={handleEndingDateChange}
          />
          <button onClick={handleFilterClick}>Filter</button>
      <ul>
          {filteredTransactions.map((transaction) => (
              <li key={transaction.Id}>
                  Transaction ID: {transaction.Id}, Title: {transaction.Title}, Amount: {transaction.Amount}, Date: {transaction.Date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
