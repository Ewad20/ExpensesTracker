import 'bootstrap/dist/js/bootstrap.js';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './../styles/Site.css';

const RootElement = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const [user, setUser] = useState(null);
    const isUserLogged = localStorage.getItem('token') !== null;

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token) {
            setUser({ token });
        }

        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleLogout = async () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');

        const response = await fetch('https://localhost:7088/api/account/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        });
        if (!response.ok) {
            console.info(response.message);
        }

        setUser(null);
        navigate("/");
    };


    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark w-100">
            <div className="container">
                <Link className="navbar-brand" to={isUserLogged ? "/dashboard" : "/"}>Expenses tracker application</Link>
                <button className="navbar-toggler d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavId" aria-controls="collapsibleNavId"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="collapsibleNavId">
                    {isUserLogged ? (
                        <ul className="navbar-nav me-auto mt-2 mt-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard" aria-current="page">Home <span className="visually-hidden">(current)</span></Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/export">Export</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/import">Import</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/wallet">Wallet</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/account/settings/twoFactorAuthentication">TwoFactor</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/report">Report</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/categories">Categories</Link>
                            </li>
                        </ul>) :
                        (
                            <ul className="navbar-nav me-auto mt-2 mt-lg-0">
                                <li className="nav-item">
                                    <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/" aria-current="page">Home <span className="visually-hidden">(current)</span></Link>
                                </li>
                            </ul>)}
                    {isUserLogged ? (
                        <>
                            <ul className="navbar-nav navbar-nav__profile-button">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">Profile</Link>
                                </li>
                            </ul>
                            <button className="btn btn-outline-light" onClick={() => handleLogout()}>Logout</button>
                        </>
                    ) : null}
                </div>
            </div>
        </nav>
    );
};

export default RootElement;