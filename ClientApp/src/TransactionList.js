import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [transactionType, setTransactionType] = useState('all');
    const [categories, setCategories] = useState([]);
    const [startingDate, setStartingDate] = useState(null);
    const [endingDate, setEndingDate] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
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

    const handleTransactionTypeChange = (type) => {
        setTransactionType(type);
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
            formattedStartingDate = startDate.toUTCString();

        if (endDate)
            formattedEndingDate = endDate.toUTCString();

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
                endDate ? `endDate=${formattedEndingDate}` : null,
                selectedCategory ? `selectedCategory=${selectedCategory}` : null
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

    useEffect(() => {

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
        handleFilterClick()
    }, [walletId]);

    useEffect(() => {
        handleFilterClick();
    }, [walletId, transactionType]);

    return (
        <div className='container'>
            <h2>Transaction list for wallet {walletId}</h2>

            <div className='d-flex justify-content-center'>
                <button className='btn btn-secondary mx-1' onClick={() => handleTransactionTypeChange('all')}>All Transactions</button>
                <button className='btn btn-secondary mx-1' onClick={() => handleTransactionTypeChange('income')}>Incomes</button>
                <button className='btn btn-secondary mx-1' onClick={() => handleTransactionTypeChange('expenditure')}>Expenditures</button>
            </div>
            <div className='d-flex flex-column'>
                <h3>Filter results:</h3>
                <div className='mx-auto'>
                    <span className='mx-2'>Starting date:</span><input
                        type="date"
                        name="startingDatePicker"
                        value={startingDate || ''}
                        onChange={handleStartingDateChange}
                    />
                    <span className='mx-2'>Ending date:</span> <input
                        type="date"
                        name="endingDatePicker"
                        value={endingDate || ''}
                        onChange={handleEndingDateChange}
                    />
                    <span className="mx-2">Category:</span> <select
                        id="categorySelect"
                        onChange={handleCategoryChange}
                    >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select> <button className='btn btn-secondary mx-1' onClick={handleFilterClick}>Filter</button>
                </div>
            </div>
            <div className='row my-3'>
                {transactions.map((transaction, i) => (
                    <div key={i} className='col my-3'>
                        <div className='card h-100 text-center'>
                            <h2 className='w-75'>{transaction.Title}</h2>
                            <h5>{transaction.Amount} PLN</h5>
                            <p>{new Date(transaction.Date).toISOString().split('T')[0]}</p>
                            <p>{findCategoryName(transaction.categoryId)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionList;