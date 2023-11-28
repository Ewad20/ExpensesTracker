import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import RootElement from './RootElement';
import TransactionList from './TransactionList';
import LoginForm from './LoginForm';
import Export from './Export';
import Import from './Import';import WalletPage from './WalletPage';


const App = () => {
    return (
        <Router>
            <RootElement />
            <div>
                <Routes>
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/transaction" element={<TransactionList />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/export" element={<Export />} />
                    <Route path="/import" element={<Import />} />
                    <Route path="/wallet" element={<WalletPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;