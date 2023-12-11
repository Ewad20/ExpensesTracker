import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';

const TransactionForm = ({onSubmit, walletId }) => {
    const [newTransaction, setNewTransaction] = useState({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        amount: '',
        walletId: walletId,
        categoryId: ''
    });

    const [formError, setFormError] = useState('');
    const [formVisible, setFormVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [transactionType, setTransactionType] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name !== 'category') {
            setNewTransaction(prevTransaction => ({
                ...prevTransaction,
                [name]: value,
            }));
        }
    };

    const handleCategoryChange = (e) => {
        const { value } = e.target;
        const selectedCategory = categories.find(category => category.Id === parseInt(value));
        setNewTransaction(prevTransaction => ({
            ...prevTransaction,
            categoryId: selectedCategory ? selectedCategory.Id : ''
        }));
    };
    const fetchCategories = async () => {
        try {
            const response = await fetch(`https://localhost:7088/api/transaction/allCategories`, {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error during fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleTypeSelection = (type) => {
        setTransactionType(type);
        setFormVisible(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let url = '';
            if (transactionType === 'income') {
                url = 'https://localhost:7088/api/transaction/addIncome';
            } else {
                url = 'https://localhost:7088/api/transaction/addExpenditure';
            }
            console.log(newTransaction);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTransaction),
                credentials: 'include',
            });

            if (response.ok) {
                console.log('Transaction added!');
                setFormVisible(false); 
            } else {
                console.error(response);
                setFormError('Invalid form data');
            }
        } catch (error) {
            console.error('Error adding transaction:', error);
            setFormError('Error adding transaction');
        }
    };

    return (
        <div>
            <div>
                <button className='btn btn-secondary mx-1' onClick={() => handleTypeSelection('income')}>Income</button>
                <button className='btn btn-secondary mx-1' onClick={() => handleTypeSelection('expenditure')}>Expenditure</button>
            </div>
            {formVisible && (
                <div>
                    <h3>Add New Transaction</h3>
                    <form onSubmit={handleSubmit}>
                      
                        <input type="text" name="title" value={newTransaction.title} onChange={handleInputChange} placeholder="Title" required />
                        <input type="text" name="description" value={newTransaction.description} onChange={handleInputChange} placeholder="Description" />
                        <input type="number" name="amount" value={newTransaction.amount} onChange={handleInputChange} placeholder="Amount" required />
                        <input type="date" name="date" value={newTransaction.date} onChange={handleInputChange} placeholder="Date" required />
                        <select name="category" value={newTransaction.categoryId} onChange={handleCategoryChange}>
                            <option value="">Select category</option>
                            {categories.map(category => (
                                <option key={category.Id} value={category.Id}>
                                    {category.Name}
                                </option>
                            ))}
                        </select>

                        {formError && <div className="error">{formError}</div>}
                        <button type="submit">Add</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TransactionForm;
