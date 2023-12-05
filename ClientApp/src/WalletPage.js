import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/Site.css';

const WalletPage = () => {
    const [walletName, setWalletName] = useState('');
    const [walletFormError, setWalletFormError] = useState('');
    const [wallets, setWallets] = useState([]);
    const navigate = useNavigate();

    const handleWalletClick = (walletId) => {
        navigate(`/transaction/${walletId}`);
      };

    const fetchWallets = async () => {
        try {
            const response = await fetch('https://localhost:7088/api/account/getWallets', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                const walletData = await response.json();
                setWallets(walletData);
            } else {
                console.error(response);
                setWalletFormError('Error fetching wallets');
            }
        } catch (error) {
            console.error('Error during fetching wallets', error);
            setWalletFormError('Error fetching wallets');
        }
    };

    useEffect(() => {
        fetchWallets();
    }, []); // Run only once on component mount

    const submitNewWallet = async (e) => {
        e.preventDefault();

        try {
            const cred = {
                name: walletName,
            };
            const response = await fetch('https://localhost:7088/api/account/addWallet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(cred),
            });
            if (response.ok) {
                console.log('Wallet added!');
                navigate('/');
                fetchWallets(); // Fetch updated wallets after adding a new wallet
            } else {
                console.error(response);
                setWalletFormError('Invalid form data');
            }
        } catch (error) {
            console.error('Error during adding wallet', error);
            setWalletFormError('Error during adding wallet');
        }
    };

    return (
        <div className="container mt-5">
            <div className="cards-container">
                <div className="card p-3 pt-3">
                    <form onSubmit={submitNewWallet} className="row g-3">
                        <h5>Add new wallet</h5>

                        <input
                            type="text"
                            className="form-control"
                            id="walletName"
                            value={walletName}
                            onChange={(e) => setWalletName(e.target.value)}
                            placeholder="Enter new wallet name"
                            required
                        />
                        {walletFormError && <div className="col-md-12 error">{walletFormError}</div>}
                        <button type="submit" className="btn btn-primary col-12">
                            Add
                        </button>
                    </form>
                </div>
                {wallets.map((wallet, i) => (
                    <div key={i} onClick={() => handleWalletClick(wallet.id)} className="card">
                        <img
                            className="icons"
                            src="https://cdn-icons-png.flaticon.com/512/493/493389.png"
                            alt={`icon-${i}`}
                        />
                        <p>{wallet.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WalletPage;