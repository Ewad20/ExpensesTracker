import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddExpenditureForm = ({ categories, onSubmit, onCancel }) => {
    const [newExpenditure, setNewExpenditure] = useState({
        title: '',
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        categoryId: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewExpenditure({ ...newExpenditure, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(newExpenditure);
    };

    return (
        <div>
            <h3>Add New Expenditure</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    <input type="text" name="title" value={newExpenditure.title} onChange={handleChange} />
                </label>
                <label>
                    Description:
                    <input type="text" name="description" value={newExpenditure.description} onChange={handleChange} />
                </label>
                <label>
                    Amount:
                    <input type="number" name="amount" value={newExpenditure.amount} onChange={handleChange} />
                </label>
                <label>
                    Date:
                    <input type="date" name="date" value={newExpenditure.date} onChange={handleChange} />
                </label>
                <label>
                    Category:
                    <select name="categoryId" value={newExpenditure.categoryId} onChange={handleChange}>
                        <option value="">Select Category</option>
                        {categories
                            .filter(category => category.Type === 'Expenditure') // Wyœwietlanie tylko kategorii typu Expenditure
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

export default AddExpenditureForm;
