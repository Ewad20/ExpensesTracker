import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './/styles/Site.css';

const WalletPage = () => {

    const wallets = [];
    const wallet1 = new Wallet('wallet1');
    const wallet2 = new Wallet('wallet2');
    const wallet3 = new Wallet('wallet3');
    wallets.push(wallet1);
    wallets.push(wallet2);
    wallets.push(wallet3);

    return (
        <div className="container mt-5">
            <div className="cards-container">
                {
                    Object.keys(wallets).map((keyname, i) => (<div className="card">
                        <img className="wallet-icon" src='https://cdn-icons-png.flaticon.com/512/493/493389.png' />
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
