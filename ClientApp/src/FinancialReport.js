import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChartReport from './ChartReport';
import './styles/FinancialReport.css'; 
import Comparison from './MonthlyComparison';


const MonthlySummary = () => {
    const [wallets, setWallets] = useState([]);
    const [walletId, setWalletId] = useState('');
    const [walletName, setWalletName] = useState('');
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() zwraca miesi�ce od 0 do 11, wi�c dodajemy 1
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
    const [activeTab, setActiveTab] = useState('summary');
    const [quarterOrHalfYear, setQuarterOrHalfYear] = useState('All'); // Dodaj nowy stan dla kwarta�u, p�rocza lub ca�ego roku

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
                // Ustaw domy�lny portfel na pierwszy na li�cie (je�li istnieje)
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
            //setWalletName(walletName);
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

            // Pobierz zawarto�� pliku PDF z odpowiedzi
            const blob = await response.blob();
            const wallet = wallets.find((wallet) => wallet.id === walletId);
            const walletName = wallet ? wallet.name.replace(/ /g, '_') : 'wallet';

            const fileName = `monthly_report_${walletName}_${month}_${year}.pdf`;

            // Utw�rz link do pobrania pliku i rozpocznij pobieranie
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

            // Pobierz zawarto�� pliku Excel z odpowiedzi
            const blob = await response.blob();
            const wallet = wallets.find((wallet) => wallet.id === walletId);
            const walletName = wallet ? wallet.name.replace(/ /g, '_') : 'wallet';

            const fileName = `monthly_report_${walletName}_${month}_${year}.xlsx`;

            // Utw�rz link do pobrania pliku i rozpocznij pobieranie
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
            {/* Tutaj dodajemy zak�adki dla raportu miesi�cznego i por�wnania miesi�cznego */}
            <div className="tabs">
                <button className={activeTab === 'summary' ? 'active-tab' : 'inactive-tab'} onClick={() => setActiveTab('summary')}>Monthly Summary</button>
                <div className="tab-divider" />
                <button className={activeTab === 'comparison' ? 'active-tab' : 'inactive-tab'} onClick={() => setActiveTab('comparison')}>Monthly Comparison</button>

            </div>
            {activeTab === 'summary' && (
                <div>
                    <h1 className="divider"></h1>

                    <div className="select-container">
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

                    <div className="btn-container">
                        {month === 'All' ? (
                            <button className="btn btn-primary" onClick={handleGenerateClick}>
                                Generate
                            </button>
                        ) : (
                            <>
                                <button className="btn btn-primary" style={{ marginRight: '10px' }} onClick={handleGenerateClick}>
                                    Generate
                                </button>
                                <button className="btn btn-secondary" style={{ marginRight: '10px' }} onClick={handleGenerateReportClick}>
                                    Generate Monthly Report (PDF)
                                </button>
                                <button className="btn btn-tertiary" onClick={handleGenerateExcelClick}>
                                    Generate Monthly Report (Excel)
                                </button>
                            </>
                        )}
                    </div>

                    {summary && dataGenerated && (
                        <div className="summary-section">
                            <div>
                                <div>
                                    <h3>Total Income: <span style={{ color: 'lightgreen' }}>{summary.totalIncome}</span></h3>
                                    <h3>Total Expenditure: <span style={{ color: 'lightcoral' }}>{summary.totalExpenditure}</span></h3>
                                </div>
                                <div style={{ textAlign: 'right'}}>
                                    <h3>Net Balance: {summary.netBalance}</h3>
                                </div>
                            </div>
                            <ChartReport summary={summary} />
                        </div>
                    )}

                    {summary && ((summary.incomeByCategory && summary.incomeByCategory.length > 0) || (summary.expenditureByCategory && summary.expenditureByCategory.length > 0)) && (
                        <div className="data-container1">
                            <div className="color-data-section">
                                {summary.incomeByCategory && summary.incomeByCategory.length > 0 && (
                                    <div>
                                        <div>
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
                                    <div>
                                        <div>
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

                    <div className="transaction-list" style={{ display: transactions.length > 0 ? 'block' : 'none' }}>
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
            )}

            {activeTab === 'comparison' && (
                <div>
                <h1 className="divider"></h1>
                    <Comparison />
                </div>
            )}
        </div>
    );
};

export default MonthlySummary;