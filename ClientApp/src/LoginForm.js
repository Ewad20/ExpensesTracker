import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginForm = () => {
    const [loginIdentifier, setLoginIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const credentials = {
            login: loginIdentifier, 
            password: password,
        };

        try {
            const response = await fetch('https://localhost:7088/api/account/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (response.ok) {
                console.log('Login successful!');
                navigate('/');
            } else {
                console.error('Login failed');
                setLoginError('Invalid username or password');
            }
        } catch (error) {
            console.error('Error during login', error);
            setLoginError('Error during login');
        }
    };

    return (
        <div className="container">
            <h2 className="mt-4">Login</h2>
            <form onSubmit={handleLogin} className="row g-3">
                <div className="col-md-6">
                    <label htmlFor="loginIdentifier" className="form-label">Username or Email:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="loginIdentifier"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        required
                    />
                </div>

                <div className="col-md-6">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {loginError && <div className="col-md-12 error">{loginError}</div>}

                <div className="col-12">
                    <button type="submit" className="btn btn-primary">Login</button>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
