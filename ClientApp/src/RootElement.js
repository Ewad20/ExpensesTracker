import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LoginForm from './LoginForm'; 
import './/styles/Site.css';
import Calendar from './Calendar';
import $ from 'jquery'
import Chart from 'chart.js/auto'

const RootElement = () => {
    const location = useLocation();
    const [user, setUser] = useState(null);

    const handleLogin = (userData) => {
        setUser(userData);

        //$("#demo-calendar-basic").zabuto_calendar({
        //    classname: 'table table-bordered lightgrey-weekends'
        //});

        $(document).ready(function () {
            var ctx = document.getElementById("myChart").getContext("2d");
            const xValues = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 150];
            const yValues = [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15, 15];

            new Chart(ctx, {
                type: "pie",
                data: {
                    labels: xValues,
                    datasets: [{
                        fill: false,
                        lineTension: 0,
                        backgroundColor: "rgba(200,200,200,1.0)",
                        borderColor: "rgba(0,0,0,0.1)",
                        data: yValues
                    }]
                },
                options: {
                    legend: { display: false },
                    scales: {
                        yAxes: [{ ticks: { min: 6, max: 16 } }],
                    }
                }
            });
        });
    };

    const handleLogout = () => {
        setUser(null);
    };

    return (
        <div>
            <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">Expenses tracker application</Link>
                    <button className="navbar-toggler d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavId" aria-controls="collapsibleNavId"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="collapsibleNavId">
                        <ul className="navbar-nav me-auto mt-2 mt-lg-0">
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/" aria-current="page">Home <span className="visually-hidden">(current)</span></Link>
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
                                <Link className="nav-link" to="/transaction">Transaction</Link>
                            </li>
                        </ul>
                        {user ? (
                            <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
                        ) : null}
                    </div>
                </div>
            </nav>
            <div className="container mt-4">
                {user && location.pathname === '/' && (
                    <><div className="mb-3">
                        <span class="fs-4"><strong>Welcome, {user.username}!</strong></span>
                        <p className="mt-2"><em>Explore your dashboard and manage your financial activities with ease.</em></p>
                        <div className="d-flex mt-3">
                            <Link to="/wallet" className="link me-4">
                                <div className="dashboard-card">
                                    <img className="icons" src='https://cdn-icons-png.flaticon.com/512/493/493389.png' alt="Wallet Icon" />
                                    <span>My Wallets</span>
                                </div>
                            </Link>
                            <Link to="/import" className="link me-4">
                                <div className="dashboard-card">
                                    <img className="icons" src='https://cdn-icons-png.flaticon.com/128/4013/4013427.png' alt="Import Icon" />
                                    <span>Import Data</span>
                                </div>
                            </Link>
                            <Link to="/export" className="link me-4">
                                <div className="dashboard-card">
                                    <img className="icons" src='https://cdn-icons-png.flaticon.com/128/5859/5859742.png' alt="Export Icon" />
                                    <span>Export Data</span>
                                </div>
                            </Link>
                            <Link to="/transaction" className="link me-4">
                                <div className="dashboard-card">
                                    <img className="icons" src='https://cdn-icons-png.flaticon.com/128/3186/3186858.png' alt="Transaction Icon" />
                                    <span>My Transaction</span>
                                </div>
                            </Link>
                            <Link to="/" className="link">
                                <div className="dashboard-card">
                                    <img className="icons" src='https://cdn-icons-png.flaticon.com/128/217/217905.png' alt="Receipt Icon" />
                                    <span>My Receipt</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                        <div className="main-page-dashboard">
                            <div className="dashboard-card dashboard-card__main-section">
                                <canvas id="myChart" width="400" height="400"></canvas>
                            </div>
                            <div className="dashboard-card dashboard-card__main-section">
                                <Calendar>

                                </Calendar>
                            </div>
                        </div></>
                )}
                {!user && location.pathname === '/' && (
                    <div className="mt-4">
                        <LoginForm onLogin={handleLogin} />
                        <div className="d-flex flex-column align-items-center justify-content-center">
                            <strong>
                                <p className="my-text"> If you don't have an account, you can register here:</p>
                            </strong>
                            <Link to="/register" className="btn btn-primary">Register</Link>
                        </div>
                        <div className="mt-4">
                            <div className="my-card">
                                <img className="my-icons" src='https://cdn-icons-png.flaticon.com/128/4256/4256662.png' alt="Icon" />
                                <p className="my-card-text">
                                    The Expense Tracker Application is designed to help you effectively manage your finances with ease. Whether you're tracking daily expenses,
                                    managing multiple wallets, or organizing your financial transactions, this application provides a comprehensive solution for your financial management needs.</p>
                            </div>
                        </div>
                    </div>
                )}
                {!user && location.pathname === '/' && (
                    <div className="mt-4">
                        <LoginForm onLogin={handleLogin} />
                        <div className="d-flex flex-column align-items-center justify-content-center">
                            <strong>
                                <p className="my-text"> If you don't have an account, you can register here:</p>
                                </strong>
                            <Link to="/register" className="btn btn-primary">Register</Link>
                        </div>
                        <div className="mt-4">
                            <div className="my-card">
                                <img className="my-icons" src='https://cdn-icons-png.flaticon.com/128/4256/4256662.png' alt="Icon" />
                                <p className="my-card-text">
                                    The Expense Tracker Application is designed to help you effectively manage your finances with ease. Whether you're tracking daily expenses,
                                    managing multiple wallets, or organizing your financial transactions, this application provides a comprehensive solution for your financial management needs.</p>
                             </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RootElement;