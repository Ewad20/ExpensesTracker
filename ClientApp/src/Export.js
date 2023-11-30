import React, { useState } from 'react';
import {useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Export(){
    
    
    const [selectedWallets, setSelectedWallets] = useState([]);
    const [wallets, setWallets] = useState([]);
    const [nothingSelected, setNothingSelected] = useState(null);
    const [clearAll, setClearAll] = useState(false);
    const [alert, setAlert] = useState(null);
    
    
    useEffect(() => {
        //[TODO] dodac przypisanie dla Id uzytkownika jego Id z cookies. Narazie cookies nie ma!
        let tempId = "5af3b420-bba0-4f54-9864-43825d68e49b"

        const loadAllUserWallets = async () => {
        try {
            const response = await fetch('http://localhost:5169/api/export/Wallets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tempId),
            });

            if (response.ok) {
            const data = await response.json();
            console.log("All wallets were successfuly added.");
            setAlert(null);
            setWallets(data);
            } else {
            setAlert('Nie udało się pobrać portfeli uzytkownika. Sprobuj ponownie!');
            console.error('Failed to load user wallets:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error exporting wallets:', error.message);
        }
        };
        loadAllUserWallets();
    }, []);
    
    useEffect(() => {
        if (selectedWallets.length === 0) {
            console.log('No wallets selected!');
            setClearAll(false);
        } else {
            console.log('Wallets selected:', selectedWallets);
            setClearAll(true);
        }
    }, [selectedWallets]);

    const handleRowClick = (id) => {
        setSelectedWallets((prevSelectedWallets) => {
            if (prevSelectedWallets.includes(id)) {
                return prevSelectedWallets.filter((selectedId) => selectedId !== id);
            } else {
                return [...prevSelectedWallets, id];
            }
        });
    }

    const handleSelectAll = () => {
        if (selectedWallets.length > 0) {
            setSelectedWallets([]);
            setClearAll(false);
            
        } else {
            const allWalletIds = wallets.map((wallet) => wallet.Id);
            setSelectedWallets(allWalletIds);
            setClearAll(true);
        }
    };

    const handleJsonExport = () => {
        let fileName = "userWallet.json";

        if (selectedWallets.length === 0) {
            setNothingSelected(true);
            console.log('No wallets selected!');
        } else {
            const selectedWalletData = wallets.filter((wallet) => selectedWallets.includes(wallet.Id));
            const jsonBlob = new Blob([JSON.stringify(selectedWalletData)], { type: 'application/json' });
            const url = URL.createObjectURL(jsonBlob);

            const a = document.createElement('a');
            a.href = url;
            a.download = fileName || 'download.json';
            document.body.appendChild(a);
            a.click();

            // Cleanup
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // Reset selection after export
            setSelectedWallets([]);
            setNothingSelected(false);
        }
      };

    return (<>
        <style>
            {`
                .table-active-custom {
                    background-color: #cfe2ff;
                    padding-x: 1rem;
                    adding-y: 1rem;
                    margin-bottom: 1rem;
                    border: 1px solid #b6d4fe;
                    border-radius: 0.375rem;
                }
            `}
        </style>
        <div className="container">
            <h2 className="mt-4">Export</h2>
            {clearAll ? 
                <button className="btn btn-secondary" onClick={handleSelectAll}> Clear all</button>
            :
                <button className="btn btn-secondary" onClick={handleSelectAll}>Select all</button>}
            <table className="table">
                <thead>
                    <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Icon</th>
                    <th scope="col">Name</th>
                    <th scope="col">AccountBalance</th>
                    <th scope="col">Incomes</th>
                    <th scope="col">Expenditures</th>
                    </tr>
                </thead>
                {wallets.map((wallet) => (
                <tbody key={wallet.Id} className={selectedWallets.includes(wallet.Id) ? 'table-active-custom' 
                : undefined} onClick={() => handleRowClick(wallet.Id)}>
                    <tr>
                        <th>{wallet.Id}</th>
                        <td>{wallet.IconId}</td>
                        <td>{wallet.Name}</td>
                        <td>{wallet.AccountBalance}</td>
                        <td>{wallet.Incomes}</td>
                        <td>{wallet.Expenditures}</td>
                    </tr>
                </tbody>
                ))}
            </table>
            <button className="btn btn-primary" onClick={handleJsonExport}>Export Wallet</button>
            {nothingSelected ? <div className="alert alert-danger" role="alert">
                Nie wybrano zadnego portfela do eksporu!
            </div>
            : undefined}
            {alert != null ?
                <div className="alert alert-danger" role="alert">
                    {alert}
                </div>
            : undefined}
        </div>
    </>);
};

export default Export;
