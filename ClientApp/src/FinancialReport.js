import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChartReport from './ChartReport';


const MonthlySummary = () => {
    const [wallets, setWallets] = useState([]);
    const [walletId, setWalletId] = useState('');
    const [walletName, setWalletName] = useState('');
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() zwraca miesi¹ce od 0 do 11, wiêc dodajemy 1
    const [month, setMonth] = useState(currentMonth.toString());
    const currentYear = currentDate.getFullYear();
    const [year, setYear] = useState(currentYear.toString());
    const [summary, setSummary] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [dataGenerated, setDataGenerated] = useState(false);
    const [months] = useState([
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]);
    const years = [];
    const startYear = 2018; // zaczynamy od roku 2020
    for (let year = currentYear; startYear <= year; year--) {
        years.push(year.toString());
    }

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
                // Ustaw domyœlny portfel na pierwszy na liœcie (jeœli istnieje)
                if (walletData.length > 0) {
                    setWalletId(walletData[0].id);
                }
            } else {
                console.error(response);
            }
        } catch (error) {
            console.error('Error fetching wallets:', error);
        }
    };
    useEffect(() => {
        fetchWallets();
    }, []);


    const handleGenerateClick = async () => {
        try {
            let apiEndpoint = '';
            if (month === 'All') {
                apiEndpoint = `api/transaction/yearlySummary/${walletId}/${year}`;
            } else {
                apiEndpoint = `api/transaction/monthlySummary/${walletId}/${year}/${month}`;
            }

            const response = await fetch(apiEndpoint, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSummary(data);
            setTransactions(data.transactions);
            setDataGenerated(true);
            const selectedWallet = wallets.find((wallet) => wallet.id === walletId);
            const walletName = selectedWallet ? selectedWallet.name : '';
            setWalletName(walletName);
        } catch (error) {
            console.error('Error during fetching summary:', error);
        }
    };

    const handleGenerateReportClick = async () => {
        try {
            const response = await fetch(`api/transaction/generateMonthlyReportPDF/${walletId}/${year}/${month}`, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Pobierz zawartoœæ pliku PDF z odpowiedzi
            const blob = await response.blob();
            const wallet = wallets.find((wallet) => wallet.id === walletId);
            const walletName = wallet ? wallet.name.replace(/ /g, '_') : 'wallet';

            const fileName = `monthly_report_${walletName}_${month}_${year}.pdf`;

            // Utwórz link do pobrania pliku i rozpocznij pobieranie
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();

            // Zwolnij zasoby
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error during fetching PDF:', error);
        }
    };

    const handleGenerateExcelClick = async () => {
        try {
            const response = await fetch(`api/transaction/generateMonthlyReportExcel/${walletId}/${year}/${month}`, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Pobierz zawartoœæ pliku Excel z odpowiedzi
            const blob = await response.blob();
            const wallet = wallets.find((wallet) => wallet.id === walletId);
            const walletName = wallet ? wallet.name.replace(/ /g, '_') : 'wallet';

            const fileName = `monthly_report_${walletName}_${month}_${year}.xlsx`;

            // Utwórz link do pobrania pliku i rozpocznij pobieranie
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();

            // Zwolnij zasoby
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error during fetching Excel:', error);
        }
    };

    

    return (
        <div className='container'>
            <h1 style={{ color: '#AA968A', borderBottom: '2px solid #AA968A', paddingBottom: '10px' }}>Monthly Summary</h1>

            <div className="select-container" style={{ border: `1px solid #AA968A`, borderRadius: '5px', padding: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <select
                    className="form-select"
                    value={walletId}
                    onChange={(e) => setWalletId(e.target.value)}
                    style={{ marginRight: '10px' }}
                >
                    {wallets.map((wallet) => (
                        <option key={wallet.id} value={wallet.id}>
                            {wallet.name}
                        </option>
                    ))}
                </select>
                <select
                    className="form-select"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    style={{ marginRight: '10px' }}
                >
                    {years.map((yearOption) => (
                        <option key={yearOption} value={yearOption}>
                            {yearOption}
                        </option>
                    ))}
                </select>
                <select
                    className="form-select"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                >
                    <option value="All">All</option>
                    {months.map((month, index) => (
                        <option key={index} value={index + 1}>
                            {month}
                        </option>
                    ))}
                </select>
            </div>

            <div className="button-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                {month === 'All' ? (
                    <button className="btn btn-primary" style={{ backgroundColor: '#6C698D' }} onClick={handleGenerateClick}>
                        Generate
                    </button>
                ) : (
                    <>
                        <button className="btn btn-primary" style={{ backgroundColor: '#6C698D', marginRight: '10px' }} onClick={handleGenerateClick}>
                            Generate
                        </button>
                        <button className="btn btn-primary" style={{ backgroundColor: '#BFAFA6', marginRight: '10px' }} onClick={handleGenerateReportClick}>
                            Generate Monthly Report (PDF)
                        </button>
                        <button className="btn btn-primary" style={{ backgroundColor: '#D4D2D5' }} onClick={handleGenerateExcelClick}>
                            Generate Monthly Report (Excel)
                        </button>
                    </>
                )}
            </div>
                
            {summary && dataGenerated &&(
                <div style={{ border: `1px solid #AA968A`, borderRadius: '5px', padding: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <h3>Total Income: <span style={{ color: 'lightgreen' }}>{summary.totalIncome}</span></h3>
                            <h3>Total Expenditure: <span style={{ color: 'lightcoral' }}>{summary.totalExpenditure}</span></h3>
                        </div>
                        <div style={{ flex: 1, textAlign: 'right' }}>
                            <h3>Net Balance: {summary.netBalance}</h3>
                        </div>
                    </div>
                    <ChartReport summary={summary} />
                </div>
            )}

            {summary && ((summary.incomeByCategory && summary.incomeByCategory.length > 0) || (summary.expenditureByCategory && summary.expenditureByCategory.length > 0)) && (
                <div style={{ border: `1px solid #6C698D`, borderRadius: '5px', padding: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', marginBottom: '20px' }}>
                        {summary.incomeByCategory && summary.incomeByCategory.length > 0 && (
                            <div style={{ flex: 1, marginRight: '10px' }}>
                                <div style={{ border: `1px solid #AA968A`, borderRadius: '5px', padding: '10px', marginBottom: '20px' }}>
                                    <h3>Income by Category:</h3>
                                    {summary.incomeByCategory.map((category, index) => (
                                        <div key={index}>
                                            <p>
                                                <strong>{category.categoryName}</strong> - {category.totalAmount} PLN
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {summary.expenditureByCategory && summary.expenditureByCategory.length > 0 && (
                            <div style={{ flex: 1, marginLeft: '10px' }}>
                                <div style={{ border: `1px solid #AA968A`, borderRadius: '5px', padding: '10px', marginBottom: '20px' }}>
                                    <h3>Expenditure by Category:</h3>
                                    {summary.expenditureByCategory.map((category, index) => (
                                        <div key={index}>
                                            <p>
                                                <strong>{category.categoryName}</strong> - {category.totalAmount} PLN
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div style={{ border: `1px solid #6C698D`, borderRadius: '5px', padding: '20px', display: transactions.length > 0 ? 'block' : 'none' }}>
                    {transactions.length > 0 && (
                        <div>
                            <h3>Transactions:</h3>
                            {transactions.map((transaction, index) => (
                                <div key={index}>
                                    <p>
                                        {new Date(transaction.date).toLocaleDateString('pl-PL', { year: 'numeric', month: '2-digit', day: '2-digit' })} - {transaction.title} - {transaction.description} - {transaction.amount} PLN &nbsp;
                                        <span style={{ color: transaction.type === 'income' ? 'green' : 'red' }}>
                                            ({transaction.type === 'income' ? 'Income' : 'Expenditure'})
                                        </span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
            </div>

        </div>
    );
};

export default MonthlySummary;