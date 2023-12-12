import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({
        name: '',
        type: 'Expenditure',
    });
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingCategory, setEditingCategory] = useState({
        name: '',
        type: 'Expenditure',
    });

    const handleInputChange = (e, isEditing = false) => {
        const { name, value } = e.target;

        if (isEditing) {
            setEditingCategory({ ...editingCategory, [name]: value });
        } else {
            setNewCategory({ ...newCategory, [name]: value });
        }
    };

    const handleAddCategory = async () => {
        try {
            const response = await fetch('/api/transaction/addCategory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCategory),
            });

            if (!response.ok) {
                throw new Error('Failed to add category');
            }

            fetchCategories();
            setNewCategory({ name: '', type: 'Expenditure' });
        } catch (error) {
            console.error('Error during adding category:', error);
        }
    };

    const handleEditCategory = async () => {
        try {
            const response = await fetch(`/api/transaction/editCategory/${editingCategoryId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingCategory),
            });

            if (!response.ok) {
                throw new Error('Failed to edit category');
            }

            fetchCategories();
            setEditingCategoryId(null);
            setEditingCategory({ name: '', type: 'Expenditure' });
        } catch (error) {
            console.error('Error during editing category:', error);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            const response = await fetch(`/api/transaction/deleteCategory/${categoryId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to delete category');
            }

            fetchCategories();
        } catch (error) {
            console.error('Error during deleting category:', error);
        }
    };

    const handleStartEditingCategory = (category) => {
        setEditingCategoryId(category.Id);
        setEditingCategory({
            name: category.Name,
            type: category.Type,
        });
    };

    const handleCancelEditingCategory = () => {
        setEditingCategoryId(null);
        setEditingCategory({ name: '', type: 'Expenditure' });
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('api/transaction/allCategories', {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch categories');
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

    return (
        <div className="container mt-4">
            <h2 className="mb-4"> Categories</h2>
            <div className="mb-4">
                <h4>Add New Category:</h4>
                <div className="mb-3">
                    <label className="form-label">
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={newCategory.name}
                            onChange={(e) => handleInputChange(e)}
                            className="form-control"
                        />
                    </label>
                </div>
                <div className="mb-3">
                    <label className="form-label">
                        Type:
                        <select
                            name="type"
                            value={newCategory.type}
                            onChange={(e) => handleInputChange(e)}
                            className="form-select"
                        >
                            <option value="Expenditure">Expenditure</option>
                            <option value="Income">Income</option>
                        </select>
                    </label>
                </div>
                <button onClick={handleAddCategory} className="btn btn-primary">Add Category</button>
            </div>
            <div>
                <h3>Existing Categories:</h3>
                <ul className="list-group">
                    {categories.map((category) => (
                        <li key={category.Id} className="list-group-item d-flex justify-content-between align-items-center">
                            {editingCategoryId === category.Id ? (
                                <>
                                    <div className="d-flex flex-column">
                                        <input
                                            type="text"
                                            name="name"
                                            value={editingCategory.name}
                                            onChange={(e) => handleInputChange(e, true)}
                                            className="form-control mb-2"
                                        />
                                        <select
                                            name="type"
                                            value={editingCategory.type}
                                            onChange={(e) => handleInputChange(e, true)}
                                            className="form-select mb-2"
                                        >
                                            <option value="Expenditure">Expenditure</option>
                                            <option value="Income">Income</option>
                                        </select>
                                    </div>
                                    <div className="d-flex">
                                        <button onClick={handleEditCategory} className="btn btn-success me-2">Save</button>
                                        <button onClick={handleCancelEditingCategory} className="btn btn-secondary">Cancel</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex-grow-1">{category.Name} ({category.Type})</div>
                                    {!category.IsDefault && (
                                        <div className="btn-group">
                                            <button onClick={() => handleStartEditingCategory(category)} className="btn btn-warning me-2">Edit</button>
                                            <button onClick={() => handleDeleteCategory(category.Id)} className="btn btn-danger">Delete</button>
                                        </div>
                                    )}
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ManageCategories;
