import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Chart1 from '../components/AccountTrafficChart';
import Chart2 from '../components/CategoriesChart';

const DashboardPage = () => {
    const user = localStorage.getItem('user');
    const navigate = useNavigate();

    useEffect(() => {
        if (user == null) {
            navigate("/");
        }
    }, [navigate]);
    return (
        user !== null ?
            <div className='container'>
                <div className="mb-3">
                    <span className="fs-4"><strong>Welcome, {user.username}!</strong></span>
                    <p className="mt-2"><em>Explore your dashboard and manage your financial activities with ease.</em></p>
                    <div className="row mt-5">
                        <Link to="/wallet" className="link col mb-5" style={{ minWidth: "50%" }}>
                            <div className="card background-my w-100 m-auto text-center">
                                <img className="icons" src='https://cdn-icons-png.flaticon.com/512/493/493389.png' alt="Wallet Icon" />
                                <span>My Wallets</span>
                            </div>
                        </Link>
                        <Link to="/import" className="link col mb-5" style={{ minWidth: "50%" }}>
                            <div className="card background-my m-auto text-center">
                                <img className="icons" src='https://cdn-icons-png.flaticon.com/128/4013/4013427.png' alt="Import Icon" />
                                <span>Import Data</span>
                            </div>
                        </Link>
                        <Link to="/export" className="link col mb-5" style={{ minWidth: "50%" }}>
                            <div className="card background-my m-auto text-center">
                                <img className="icons" src='https://cdn-icons-png.flaticon.com/128/5859/5859742.png' alt="Export Icon" />
                                <span>Export Data</span>
                            </div>
                        </Link>
                        <Link to="/" className="link col " style={{ minWidth: "50%" }}>
                            <div className="card background-my m-auto text-center">
                                <img className="icons" src='https://cdn-icons-png.flaticon.com/128/217/217905.png' alt="Receipt Icon" />
                                <span>My Receipt</span>
                            </div>
                        </Link>
                    </div>
                    <div className="row">
                        <div className='col'>
                            <Chart1 />
                        </div>
                        <div className='col'>
                            <Chart2 />
                        </div>
                    </div>
                </div>
            </div>
            : <></>
    );
}

export default DashboardPage;