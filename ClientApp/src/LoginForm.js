import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginForm = ({ onLogin }) => {
    const [loginIdentifier, setLoginIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [authKey, setAuthKey] = useState(null);
    const [loginError, setLoginError] = useState('');
    const [visibleAuth, setVisibleAuth] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const credentials = {
            login: loginIdentifier,
            password: password,
            authKey: authKey,
        };

        try {
             const response = await fetch('/api/account/login', {
             method: 'POST',
               headers: {
                   'Content-Type': 'application/json'
                 },
               credentials: 'include',
               body: JSON.stringify(credentials),
            });

            if (response.status === 202) {
                // Redirect to Two-Factor authentication form
                setVisibleAuth(true);
            }
            else if (response.ok) {
                console.log('Login successful!');
                onLogin({ username: loginIdentifier });
                navigate('/');
            }
            else if (visibleAuth) {
                setVisibleAuth(false);
                setAuthKey(null);
                setLoginError('Invalid Two-Factor code');
            }
            else {
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
        {!visibleAuth ?
            <div>
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

                        {loginError && <div className="col-md-12 alert alert-danger">{loginError}</div>}

                    <div className="col-12">
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                </form>
            </div>
        :
                <div className="">
                <h2 className="mt-4">Two Factor Authentication</h2>
                <form onSubmit={handleLogin} className="row g-3">
                    <div className="col-md-6">
                        <label htmlFor="authKey" className="form-label">Code:</label>
                        <input
                            type="number"
                            className="form-control"
                            id="authKey"
                            value={authKey}
                            onChange={(e) => setAuthKey(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary">Verify</button>
                    </div>
                </form>
            </div>        
        }
        </div>
    );
};

export default LoginForm;
