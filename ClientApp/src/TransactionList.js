import React, { useState, useEffect } from 'react';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const walletId = 2; //Id testowe

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/transaction/transactionsForWallet/${walletId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchTransactions();
  }, [walletId]);

  return (
    <div>
      <h2>Lista transakcji dla portfela {walletId}</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            ID transakcji: {transaction.id}, Tytuł: {transaction.title}, Kwota: {transaction.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
