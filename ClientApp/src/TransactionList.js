import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
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

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    function findCategoryName(categoryId) {
        const foundCategory = categories.find(category => category.id === categoryId);
        return foundCategory ? foundCategory.name : 'Unknown';
    }

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    function findCategoryName(categoryId) {
        const foundCategory = categories.find(category => category.id === categoryId);
        return foundCategory ? foundCategory.name : 'Unknown';
    }

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    function findCategoryName(categoryId) {
        const foundCategory = categories.find(category => category.id === categoryId);
        return foundCategory ? foundCategory.name : 'Unknown';
    }

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
                const queryParams = [
                    startDate ? `startDate=${formattedStartingDate}` : null,
                    endDate ? `endDate=${formattedEndingDate}` : null,
                    selectedCategory ? `selectedCategory=${selectedCategory}` : null
                ].filter(Boolean).join('&');

            const response = await fetch(`${url}?${queryParams}`, {
                credentials: "include"
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
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

        const fetchCategories = async () => {
            try {
                const response = await fetch(`https://localhost:7088/api/transaction/allCategories`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error during fetching transactions:', error);
            }
        };

        fetchCategories();
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
          /> Category: <select
              id="categorySelect"
              value={selectedCategory}
              onChange={handleCategoryChange}
          >
              <option value="">Select a category</option>
              {categories.map(category => (
                  <option key={category.id} value={category.id}>
                      {category.name}
                  </option>
              ))}
          </select> <button onClick={handleFilterClick}>Filter</button>
      <ul>
                {transactions.map((transaction) => (
              <li key={transaction.Id}>
                        Transaction ID: {transaction.Id}, Title: {transaction.Title}, Amount: {transaction.Amount}, Date: {new Date(transaction.Date).toLocaleString()}, Category: {findCategoryName(transaction.categoryId)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
