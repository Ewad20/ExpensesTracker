import React, { useState } from "react";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Export() {
  const [selectedWallets, setSelectedWallets] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [nothingSelected, setNothingSelected] = useState(null);
  const [clearAll, setClearAll] = useState(false);
  const [alert, setAlert] = useState(null);
  const [numberOfIncomesArr, setNumberOfIncomesArr] = useState([]);
  const [numberOfExpendituresArr, setNumberOfExpendituresArr] = useState([]);

  useEffect(() => {
    const loadAllUserWallets = async () => {
      try {
        const response = await fetch("/api/export/Wallets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          //body: JSON.stringify(tempId),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("All wallets were successfuly added.");
          setAlert(null);
          setWallets(data);

          const numberOfIncomesArr = [];
          const numberOfExpendituresArr = [];
          for (const wallet of data) {
            const numberOfIncomes = await getNumberOfIncomes(wallet.Id);
            const numberOfExpenditures = await getNumberOfExpenditures(
              wallet.Id
            );
            numberOfIncomesArr.push(numberOfIncomes);
            numberOfExpendituresArr.push(numberOfExpenditures);
          }
          setNumberOfIncomesArr(numberOfIncomesArr);
          setNumberOfExpendituresArr(numberOfExpendituresArr);
        } else if (response.status === 401) {
          setAlert("Uzytkownik nie jest zalogowany!");
          console.error(
            "Uzytkownik nie jest zalogowany",
            response.status,
            response.statusText
          );
        } else {
          setAlert(
            "Nie udało się pobrać portfeli uzytkownika. Sprobuj ponownie!"
          );
          console.error(
            "Failed to load user wallets:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error exporting wallets:", error.message);
      }
    };
    loadAllUserWallets();
  }, []);

  useEffect(() => {
    if (selectedWallets.length === 0) {
      console.log("No wallets selected!");
      setClearAll(false);
    } else {
      console.log("Wallets selected:", selectedWallets);
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

  const handleJsonExport = () => {
    let fileName = "userWallet.json";

    if (selectedWallets.length === 0) {
      setNothingSelected(true);
      console.log("No wallets selected!");
    } else {
      const selectedWalletData = wallets.filter((wallet) =>
        selectedWallets.includes(wallet.Id)
      );
      const selectedWalletDataWithoutId = selectedWalletData.map(
        ({ Id, ...rest }) => rest
      );

      const jsonBlob = new Blob([JSON.stringify(selectedWalletDataWithoutId)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(jsonBlob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "download.json";
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

  async function getNumberOfIncomes(walletId) {
    let numberOfIncomesInWallet = 0;
    try {
      const response = await fetch("/api/export/numberOfIncomesInWallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(walletId),
      });

      if (response.ok) {
        const data = await response.json();
        numberOfIncomesInWallet = parseInt(data);
        console.log(
          "Number of incomes in wallet " +
            walletId +
            " is: " +
            numberOfIncomesInWallet
        );
      } else {
        console.error("Server responded with an error:", response.statusText);
      }
    } catch (error) {
      console.error("Error exporting wallets:", error.message);
    }

    return numberOfIncomesInWallet;
  }

  async function getNumberOfExpenditures(walletId) {
    let numberOfExpendituresInWallet = 0;
    try {
      const response = await fetch("/api/export/numberOfExpendituresInWallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(walletId),
      });

      if (response.ok) {
        const data = await response.json();
        numberOfExpendituresInWallet = parseInt(data);
        console.log(
          "Number of Expenditures in wallet " +
            walletId +
            " is: " +
            numberOfExpendituresInWallet
        );
      } else {
        console.error("Server responded with an error:", response.statusText);
      }
    } catch (error) {
      console.error("Error exporting wallets:", error.message);
    }

    return numberOfExpendituresInWallet;
  }

  function seeMore(walletId) {
    var newPageUrl = "https://0.0.0.0:44485/transaction/" + walletId;
    window.open(newPageUrl, "_blank");
  }

  return (
    <>
      <div className="container">
        <h2 className="mt-4">Export</h2>
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
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">AccountBalance</th>
                <th scope="col">Incomes</th>
                <th scope="col">Expenditures</th>
                <th scope="col">Link</th>
              </tr>
            </thead>

            <tbody>
              {wallets.map((wallet, index) => (
                <tr
                  key={wallet.Id}
                  className={
                    selectedWallets.includes(wallet.Id)
                      ? "table-primary"
                      : undefined
                  }
                  onClick={() => handleRowClick(wallet.Id)}
                >
                  <th>{index + 1}</th>
                  <td>{wallet.Name}</td>
                  <td>{wallet.AccountBalance}</td>
                  <td>{numberOfIncomesArr[index]}</td>
                  <td>{numberOfExpendituresArr[index]}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => seeMore(wallet.Id)}
                    >
                      See more
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn btn-primary" onClick={handleJsonExport}>
          Export Wallet
        </button>
        {nothingSelected ? (
          <div className="alert alert-danger" role="alert">
            Nie wybrano zadnego portfela do eksporu!
          </div>
        ) : undefined}
        {alert != null ? (
          <div className="alert alert-danger" role="alert">
            {alert}
          </div>
        ) : undefined}
      </div>
    </>
  );
}

export default Export;
