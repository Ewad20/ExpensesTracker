import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import RootElement from './RootElement';
import LoginForm from './LoginForm';

import TransactionList from './TransactionList';

const App = () => {
    return (
        <Router>
            <RootElement/>
            <div>
                <Routes>
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/transaction" element={<TransactionList />} />
                </Routes>

            </div>
        </Router>
    );
};

export default App;
