import React, { useState } from "react";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Import() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [wallets, setWallets] = useState(null);
  const [selectedWallets, setSelectedWallets] = useState([]);
  const [clearAll, setClearAll] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    //handle if user isn't logged in
    const isUserLogged = async () => {
      try {
        const response = await fetch("https://localhost:7088/api/import/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          //body: JSON.stringify(tempId),
        });

        if (response.status === 401) {
          setAlert("Uzytkownik nie jest zalogowany!");
          console.error(
            "Uzytkownik nie jest zalogowany!",
            response.status,
            response.statusText
          );

          if (response.ok) {
            setAlert(null);
          }
        }
      } catch (error) {
        console.error("Error importing wallets:", error.message);
      }
    };
    isUserLogged();
  }, []);

  const handleFile = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        // e.target.result contains the content of the file
        const fileContent = e.target.result;

        // Now you can process the file content, e.g., parse it as JSON
        try {
          const parsedData = JSON.parse(fileContent);
          createWalletArray(parsedData);
          console.log("Imported data:", parsedData);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };

      reader.readAsText(file);
      setSelectedFile(file);
    }
  };

  function createWalletArray(parsedData) {
    var counterId = 0;
    var walletsArray = parsedData.map((walletData) => {
      counterId++;
      return {
        Id: counterId,
        Name: walletData.Name,
        IconId: walletData.IconId,
        AccountBalance: walletData.AccountBalance,
        UserId: walletData.UserId,
        Expenditures: walletData.Expenditures,
        Incomes: walletData.Incomes,
      };
    });
    setWallets(walletsArray);
  }

  const handleRowClick = (id) => {
    setSelectedWallets((prevSelectedWallets) => {
      if (prevSelectedWallets.includes(id)) {
        return prevSelectedWallets.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelectedWallets, id];
      }
    });

    console.log(selectedWallets);
  };

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

  useEffect(() => {
    if (selectedWallets.length === 0 && clearAll) {
      console.log("No wallets selected!");
      setClearAll(false);
    } else if (selectedWallets.length > 0 && !clearAll) {
      console.log("Wallets selected:", selectedWallets);
      setClearAll(true);
    }
  }, [selectedWallets, clearAll]);

  function handleImport() {
    if (selectedWallets.length === 0) {
      setAlert("No wallets selected to import! Select some!");
      console.log("No wallets selected!");
    } else {
      setAlert(null);
      console.log("Save selected wallets to new account!");
      //call a backend to save new wallets to the database
    }
  }

  return (
    <>
      <div className="container">
        <h2 className="mt-4">Import</h2>
        <div className="mb-3">
          <input
            className="form-control"
            type="file"
            id="formFile"
            onChange={handleFile}
          ></input>
        </div>

        {wallets && (
          <>
            {clearAll ? (
              <button className="btn btn-secondary" onClick={handleSelectAll}>
                {" "}
                Clear all
              </button>
            ) : (
              <button className="btn btn-secondary" onClick={handleSelectAll}>
                Select all
              </button>
            )}

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
              <tbody>
                {wallets.map((wallet, index) => (
                  <tr
                    key={index}
                    className={
                      selectedWallets.includes(wallet.Id)
                        ? "table-primary"
                        : undefined
                    }
                    onClick={() => handleRowClick(wallet.Id)}
                  >
                    <th>{index + 1}</th>
                    <td>{wallet.IconId}</td>
                    <td>{wallet.Name}</td>
                    <td>{wallet.AccountBalance}</td>
                    <td>{wallet.Incomes}</td>
                    <td>{wallet.Expenditures}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn btn-primary" onClick={handleImport}>
              Import Selected Wallets
            </button>
          </>
        )}
        {alert != null ? (
          <div className="alert alert-danger" role="alert">
            {alert}
          </div>
        ) : undefined}
      </div>
    </>
  );
}
export default Import;
