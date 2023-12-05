import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import RootElement from './RootElement';
import TransactionList from './TransactionList';
import LoginForm from './LoginForm';
import WalletPage from './WalletPage';
import Export from './Export';
import Import from './Import';


const App = () => {
    const [user, setUser] = useState(null);

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        setUser(null);
    };

    return (
        <Router>
            <RootElement user={user} onLogout={handleLogout} />
            <div>
                <Routes>
                    <Route path='/' Component={<App />}/>
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/transaction/:walletId" element={<TransactionList />} />
                    <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
                    <Route path="/wallet" element={<WalletPage />} />
                    <Route path="/export" element={<Export />} />
                    <Route path="/import" element={<Import />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
