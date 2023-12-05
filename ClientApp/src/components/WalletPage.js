import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/Site.css';

const WalletPage = () => {
    const [walletName, setWalletName] = useState('');
    const [walletFormError, setWalletFormError] = useState('');
    const navigate = useNavigate();

    const wallets = [];
    const wallet1 = new Wallet('wallet1');
    const wallet2 = new Wallet('wallet2');
    wallets.push(wallet1);
    wallets.push(wallet2);

    const submitNewWallet = async (e) => {
        e.preventDefault();

        const walletdata = {
            
        };

        try {
            const response = await fetch('https://localhost:7088/api/account/addWallet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(walletdata),
            });

            if (response.ok) {
                console.log('Wallet added!');
                navigate('/');
            } else {
                console.error('Failed adding wallet');
                setWalletFormError('Invalid form data');
            }
        } catch (error) {
            console.error('Error during adding wallet', error);
            setWalletFormError('Error during adding wallet');
        }
    }


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
                        <button type="submit" className="btn btn-primary col-12">Add</button>
                    </form>
                </div>
                {
                    Object.keys(wallets).map((keyname, i) => (
                    <div className="card">
                        <img className="icons" src='https://cdn-icons-png.flaticon.com/512/493/493389.png' />
                        <p>{wallets[i].name}</p>
                    </div>))
                }
            </div>
        </div>
    );
};
class Wallet {
    constructor(name) {
        this.name = name;
    }
}

export default WalletPage;
