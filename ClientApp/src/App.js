import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import RootElement from './components/RootElement';
import TransactionList from './components/TransactionList';
import LoginForm from './components/LoginForm';
import WalletPage from './components/WalletPage';
import Export from './components/Export';
import Import from './components/Import';

const App = () => {
    return (
        <Router>
            <RootElement />
            <div>
                <Routes>
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/transaction" element={<TransactionList />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/wallet" element={<WalletPage />} />
                    <Route path="/export" element={<Export />} />
                    <Route path="/import" element={<Import />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;