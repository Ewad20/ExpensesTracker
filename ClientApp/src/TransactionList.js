import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import TransactionForm from './TransactionForm';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [transactionType, setTransactionType] = useState('all');
    const [categories, setCategories] = useState([]);
    const [startingDate, setStartingDate] = useState(null);
    const [endingDate, setEndingDate] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [minValue, setMinValue] = useState(null);
    const [maxValue, setMaxValue] = useState(null);
    const [showForm, setShowForm] = useState(false);
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

    const handleMinValueChange = (event) => {
        setMinValue(event.target.value);
    };

    const handleMaxValueChange = (event) => {
        setMaxValue(event.target.value);
    };

    const handleAddTransaction = async (newTransactionData) => {
        try {
            let url = '';
            if (newTransactionData.type === 'income') {
                url = 'api/transaction/addIncome';
            } else {
                url = 'api/transaction/addExpenditure';
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTransactionData),
                credentials: 'include',
            });

            if (response.ok) {
                console.log('Transaction added!');
                handleFilterClick(); // Refresh transaction list after adding a new transaction
                setShowForm(false); // Hide the form after adding a transaction
            } else {
                console.error(response);
            }
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };


    function findCategoryName(categoryId) {
        const foundCategory = categories.find(category => category.Id === categoryId);
        return foundCategory ? foundCategory.Name : 'Unknown';
    }

    const handleFilterClick = async () => {
        const startDate = startingDate ? new Date(startingDate) : null;
        const endDate = endingDate ? new Date(endingDate) : null;

        let formattedStartingDate = '';
        let formattedEndingDate = '';

        if (startDate)
            formattedStartingDate = startDate.toISOString().split('T')[0];

        if (endDate)
            formattedEndingDate = endDate.toISOString().split('T')[0];

        try {
            let url = `api/transaction/`;
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
                selectedCategory ? `selectedCategory=${selectedCategory}` : null,
                minValue ? `minValue=${minValue}` : null,
                maxValue ? `maxValue=${maxValue}` : null
            ].filter(Boolean).join('&');

            const response = await fetch(`${url}?${queryParams}`, {
                credentials: 'include',
            });
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
                const response = await fetch(`api/transaction/allCategories`, {
                    credentials: 'include',
                });
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

            <div className='d-flex justify-content-between' style={{ width: "100%", marginTop: 10, marginBottom: 30 }}>
                <div className='d-flex'>
                    <button className='btn btn-secondary mx-1' onClick={() => handleTransactionTypeChange('all')}>All Transactions</button>
                    <button className='btn btn-secondary mx-1' onClick={() => handleTransactionTypeChange('income')}>Incomes</button>
                    <button className='btn btn-secondary mx-1' onClick={() => handleTransactionTypeChange('expenditure')}>Expenditures</button>
                </div>
                 <div className='d-flex'>
                    <button className='btn btn-secondary mx-1' onClick={() => setShowForm(true)}>Add Transaction</button>
                  
                </div>
             
            </div>
            <div className='d-flex justify-content-between' style={{ width: "100%", marginTop: 10, marginBottom: 10 }}>
                {showForm && (
                    <TransactionForm
                        categories={categories}
                        walletId={walletId}
                        onSubmit={(newTransactionData) => handleAddTransaction(newTransactionData)}
                        onCancel={() => setShowForm(false)}
                    />
                )}
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
                    <option value="">No category</option>
                    {categories.map(category => (
                        <option key={category.Id} value={category.Id}>
                            {category.Name}
                        </option>
                    ))}
                    </select> <span className='mx-2'>Min value:</span> <input
                        type="number"
                        name="minValuePicker"
                        step="any"
                        onChange={handleMinValueChange}
                    />
                    <span className='mx-2'>Max value:</span> <input
                        type="number"
                        name="maxValuePicker"
                        step="any"
                        onChange={handleMaxValueChange}
                    /> <button className='btn btn-secondary mx-1' onClick={handleFilterClick}>Filter</button>
                </div>
            </div>
            <div className='row my-3'>
                {transactions.map((transaction, i) => (
                    <div key={i} className='col my-3' style={{minWidth:"30%"}}>
                        <div className='card h-100 w-100 text-center'>
                            <h2 className='w-75'>{transaction.Title}</h2>
                            <h4 className='w-75'>{transaction.TransactionType}</h4>
                            <h5>{transaction.Amount} PLN</h5>
                            <p>{new Date(transaction.Date).toISOString().split('T')[0]}</p>
                            <p>{findCategoryName(transaction.CategoryId)}</p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default TransactionList;