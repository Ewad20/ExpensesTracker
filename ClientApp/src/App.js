import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterForm from './RegisterForm';

const App = () => {
    return (
        <Router>
            <div>
                <h1>Expenses Tracker app</h1>
                <Routes>
                    <Route path="/register" element={<RegisterForm />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
