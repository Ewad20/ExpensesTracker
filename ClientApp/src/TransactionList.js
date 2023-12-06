import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [startingDate, setStartingDate] = useState(null);
    const [endingDate, setEndingDate] = useState(null);
    const [transactionType, setTransactionType] = useState('all'); // 'all', 'income', 'expenditure'
    const { walletId } = useParams();

    const handleStartingDateChange = (event) => {
        setStartingDate(event.target.value);
    };

    const handleEndingDateChange = (event) => {
        setEndingDate(event.target.value);
    };

    const handleFilterClick = async () => {
        const startDate = startingDate ? new Date(startingDate) : null;
        const endDate = endingDate ? new Date(endingDate) : null;

        let formattedStartingDate = '';
        let formattedEndingDate = '';

        if (startDate)
            formattedStartingDate = startDate.toISOString().split("T")[0];

        if (endDate)
            formattedEndingDate = endDate.toISOString().split("T")[0];

        try {
            let url = `https://localhost:7088/api/transaction/`;
            if (transactionType === 'income') {
                url += `incomesForWallet/${walletId}`;
            } else if (transactionType === 'expenditure') {
                url += `expendituresForWallet/${walletId}`;
            } else {
                url += `transactionsForWallet/${walletId}`;
            }

            const queryParams = [
                startDate ? `startDate=${formattedStartingDate}` : null,
                endDate ? `endDate=${formattedEndingDate}` : null
            ].filter(Boolean).join('&');

            const response = await fetch(`${url}?${queryParams}`, {
                credentials: "include"
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data != "")
                setTransactions(data);
            else
                setTransactions([]);
        } catch (error) {
            console.error('Error during fetching transactions:', error);
        }
    };

    const handleTransactionTypeChange = (type) => {
        setTransactionType(type);
    };

    useEffect(() => {
        handleFilterClick();
    }, [walletId, transactionType]);

    return (
        <div className='container-fluid'>
            <h2 >Transaction list for wallet {walletId}</h2>

            <div className='d-flex justify-content-center'>
                <button className='btn btn-secondary mx-1' onClick={() => handleTransactionTypeChange('all')}>All Transactions</button>
                <button className='btn btn-secondary mx-1' onClick={() => handleTransactionTypeChange('income')}>Incomes</button>
                <button className='btn btn-secondary mx-1' onClick={() => handleTransactionTypeChange('expenditure')}>Expenditures</button>
            </div>
            <div className='d-flex flex-column'>
                <h3>Filter results:</h3>
                <div className='mx-auto'>
                    <span className='mx-2'>Starting date:</span><input
                        type="date"
                        name="startingDatePicker"
                        value={startingDate || ''}
                        onChange={handleStartingDateChange}
                    />
                    <span className='mx-2'>Ending date:</span> <input
                        type="date"
                        name="endingDatePicker"
                        value={endingDate || ''}
                        onChange={handleEndingDateChange}
                    /> <button className='btn btn-secondary mx-1' onClick={handleFilterClick}>Filter</button>
                </div>

            </div>
            <div className='row d-flex justify-content-center'>
                {transactions.map((transaction, i) => (
                    <li key={i} className='mx-5 my-3 card w-25'>
                        <h2>{transaction.title}</h2>
                        <h5>{transaction.amount} PLN</h5>
                        <p>{new Date(transaction.date).toISOString().split('T')[0]}</p>
                    </li>
                ))}
            </div>

        </div>
    );
};

export default TransactionList;
