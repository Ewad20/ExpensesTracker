import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import RootElement from './RootElement';
import TransactionList from './TransactionList';
import LoginForm from './LoginForm';
import WalletPage from './WalletPage';
import Export from './Export';
import Import from './Import';
import FinancialReport from './FinancialReport';
import TwoFactorAuthentication from './account/settings/TwoFactorAuthentication';


const App = () => {
    return (

        <Router>
            <RootElement />
            <Routes>
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/transaction/:walletId" element={<TransactionList />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/export" element={<Export />} />
                <Route path="/import" element={<Import />} />
                <Route path="/report" element={<FinancialReport />} />
                <Route path="/account/settings/twoFactorAuthentication" element={<TwoFactorAuthentication />} />
            </Routes>
        </Router>

    );
};

export default App;
