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
        categoryId: '',
    });

    const [formError, setFormError] = useState('');
    const [formVisible, setFormVisible] = useState(false);
    const [transactionType, setTransactionType] = useState('');
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [useCategoryInput, setUseCategoryInput] = useState(false);
    const [customCategory, setCustomCategory] = useState('');
    const [information, setInformation] = useState('');
    const [newCategory, setNewCategory] = useState({
        name: '',
        type: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name !== 'category') {
            setNewTransaction(prevTransaction => ({
                ...prevTransaction,
                [name]: value,
            }));
        }
        if (name === 'name' && useCategoryInput) {
            setNewCategory(prevCategory => ({
                ...prevCategory,
                [name]: value,
            }));
        }
    };

    const handleCategoryChange = (e) => {
        const { value } = e.target;
        setNewTransaction(prevTransaction => ({
            ...prevTransaction,
            categoryId: value,
        }));
    };

    const resetForm = () => {
        setNewTransaction({
            title: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            amount: '',
            walletId: walletId,
            categoryId: ''
        });
        setCustomCategory('');
        setFormError('');
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

    const handleTypeSelection = (type) => {
        setTransactionType(type);
        setFormVisible(true);
        fetchCategories(); 
    };

    const findCategoryId = (cat) => {
        const foundCategory = categories.find(
            (category) => category.Name === cat
        );
        return foundCategory ? foundCategory.Id : 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (useCategoryInput) {
            if (transactionType === 'income') {
                setNewCategory(prevCategory => ({
                    ...prevCategory,
                    type: "Income",
                }));
            } else {
                setNewCategory(prevCategory => ({
                    ...prevCategory,
                    type: "Expenditure",
                }));
            }
            const foundCategory = categories.find(
                (category) => category.Name === newCategory.name
            );

            if (foundCategory === null || foundCategory === undefined) {
                try {
                    const response = await fetch('/api/transaction/addCategory', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newCategory),
                        credentials: 'include',
                    });

                    if (!response.ok) {
                        setInformation('Error during adding category.');
                        throw new Error('Failed to add category');
                    }

                    setInformation('Category added successfully.');
                } catch (error) {
                    console.error('Error during adding category:', error);
                    setInformation('Error during adding category.');
                }
            }
            else {
                setInformation('Category with that name already exists!');
            }
            fetchCategories();
            setNewTransaction(prevTransaction => ({
                ...prevTransaction,
                categoryId: findCategoryId(customCategory),
            }));
        }

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
                resetForm();
                setFormVisible(false);
                setConfirmationVisible(true);
                setTimeout(() => {
                    setConfirmationVisible(false);
                }, 1500);
                document.getElementById('FilterButton').click();
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

                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="checkbox"
                                id="useCategoryInput"
                                checked={useCategoryInput}
                                onChange={() => setUseCategoryInput(!useCategoryInput)}
                            />
                            <label htmlFor="useCategoryInput" style={{ marginLeft: '8px' }}>
                                Create new category
                            </label>
                        </div>
                        {useCategoryInput ? (
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={newCategory.name}
                                onChange={handleInputChange}
                                placeholder="Enter new category name"
                                required={useCategoryInput}
                            />
                        ) : (
                            <select
                                className="form-select"
                                name="category"
                                value={newTransaction.categoryId}
                                onChange={handleCategoryChange}
                                required={!useCategoryInput}
                            >
                            <option value="">Select category</option>
                            {categories.map((category) => (
                                (transactionType === 'income' && category.Type === 'Income') ||
                                    (transactionType === 'expenditure' && category.Type === 'Expenditure')
                                    ? (
                                        <option key={category.Id} value={category.Id}>
                                            {category.Name}
                                        </option>
                                    ) : null
                            ))}
                            </select>
                        )}
                        {information && <div className="error">{information}</div>}
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
