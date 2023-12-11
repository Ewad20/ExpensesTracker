import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddIncomeForm = ({ categories, onSubmit, onCancel }) => {
    const [newIncome, setNewIncome] = useState({
        title: '',
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        categoryId: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewIncome({ ...newIncome, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(newIncome);
    };

    return (
        <div>
            <h3>Add New Income</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    <input type="text" name="title" value={newIncome.title} onChange={handleChange} />
                </label>
                <label>
                    Description:
                    <input type="text" name="description" value={newIncome.description} onChange={handleChange} />
                </label>
                <label>
                    Amount:
                    <input type="number" name="amount" value={newIncome.amount} onChange={handleChange} />
                </label>
                <label>
                    Date:
                    <input type="date" name="date" value={newIncome.date} onChange={handleChange} />
                </label>
                <label>
                    Category:
                    <select name="categoryId" value={newIncome.categoryId} onChange={handleChange}>
                        <option value="">Select Category</option>
                        {categories
                            .filter(category => category.Type === 'Income') // Wyœwietlanie tylko kategorii typu Income
                            .map(category => (
                                <option key={category.Id} value={category.Id}>
                                    {category.Name}
                                </option>
                            ))}
                    </select>
                </label>
                <button type="submit" className='btn btn-secondary mx-1'>Add</button>
                <button type="button" className='btn btn-secondary mx-1' onClick={onCancel}>Cancel</button>
            </form>
        </div>
    );
};

export default AddIncomeForm;
