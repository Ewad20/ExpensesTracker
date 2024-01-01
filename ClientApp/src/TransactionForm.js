import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TransactionForm = ({ onSubmit, onCancel, walletId }) => {
    const navigate = useNavigate();

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
    const [transactionType, setTransactionType] = useState('');
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [categories, setCategories] = useState([]);

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
            const response = await fetch(`api/transaction/allCategories`, {
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
        const filteredCategories = categories.filter(category => {
            return type === 'income' ? category.Type === 'Income' : category.Type === 'Expenditure';
        });
        setCategories(filteredCategories);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let url = '';
            if (transactionType === 'income') {
                url = 'api/transaction/addIncome';
            } else {
                url = 'api/transaction/addExpenditure';
            }

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
                setConfirmationVisible(true);

                setTimeout(() => {
                    setConfirmationVisible(false);
                    navigate(`/wallet`);
                }, 1500);
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
            <div className="mb-3">
                <button className="btn btn-secondary mx-1" onClick={() => handleTypeSelection('income')}>
                    Income
                </button>
                <button className="btn btn-secondary mx-1" onClick={() => handleTypeSelection('expenditure')}>
                    Expenditure
                </button>
            </div>
            {formVisible && (
                <div className="card w-50 h-auto m-auto mb-5 p-3 pt-3">
                    <form onSubmit={handleSubmit} className="row w-100 g-3">
                        <h5>Add New Transaction</h5>

                        <input
                            type="text"
                            className="form-control"
                            name="title"
                            value={newTransaction.title}
                            onChange={handleInputChange}
                            placeholder="Enter title"
                            required
                        />
                        <input
                            type="text"
                            className="form-control"
                            name="description"
                            value={newTransaction.description}
                            onChange={handleInputChange}
                            placeholder="Enter description"
                        />
                        <input
                            type="number"
                            className="form-control"
                            name="amount"
                            value={newTransaction.amount}
                            onChange={handleInputChange}
                            placeholder="Enter amount"
                            required
                        />
                        <input
                            type="date"
                            className="form-control"
                            name="date"
                            value={newTransaction.date}
                            onChange={handleInputChange}
                            required
                        />
                        <select
                            className="form-select"
                            name="category"
                            value={newTransaction.categoryId}
                            onChange={handleCategoryChange}
                            required
                        >
                            <option value="">Select category</option>
                            {categories.map((category) => (
                                <option key={category.Id} value={category.Id}>
                                    {category.Name}
                                </option>
                            ))}
                        </select>

                        {formError && <div className="col-md-12 error">{formError}</div>}
                        <button type="submit" className="btn btn-primary col-12">
                            Add
                        </button>
                    </form>
                </div>
            )}
            {confirmationVisible && (
                <div className="alert alert-success" role="alert">
                    Transaction added successfully!
                </div>
            )}
        </div>
    );
};

export default TransactionForm;
