import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Site.css';

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
            const response = await fetch('api/account/getWallets', {
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
            const response = await fetch('api/account/addWallet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(cred),
            });
            if (response.ok) {
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
        <div className="container">
            <div className='row my-3'>
                {wallets.map((wallet, i) => (
                    <div key={i} className='col my-2' style={{minWidth:"30%"}}>
                        <div onClick={() => handleWalletClick(wallet.id)} className="card h-100 w-100 text-center m-auto">
                            <img
                                className="icons"
                                src="https://cdn-icons-png.flaticon.com/512/493/493389.png"
                                alt={`icon-${i}`}
                            />
                            <p className='w-50' style={{ marginBottom: '0', paddingBottom: '0' }}>{wallet.name}</p>
                            <p>{wallet.accountBalance} PLN</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="card w-50 h-auto m-auto mb-5 p-3 pt-3">
                <form onSubmit={submitNewWallet} className="row w-100 g-3">
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
        </div>


    );
};

export default WalletPage;