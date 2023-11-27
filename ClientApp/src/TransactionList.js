import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const walletId = 1; //Id testowe

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch(`https://localhost:7088/api/transaction/transactionsForWallet/${walletId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTransactions(data);
            } catch (error) {
                console.error('Error during fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [walletId]);


  return (
    <div>
      <h2>Lista transakcji dla portfela {walletId}</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.Id}>
                ID transakcji: {transaction.Id}, Tytuł: {transaction.Title}, Kwota: {transaction.Amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
