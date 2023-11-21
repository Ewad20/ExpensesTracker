import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import RootElement from './RootElement';

const App = () => {
    return (
        <Router>
            <RootElement/>
            <div>
                <Routes>
                    <Route path="/register" element={<RegisterForm />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
