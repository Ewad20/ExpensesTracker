import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const MonthlySummary = () => {
  const [walletId, setWalletId] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const handleGenerateClick = async () => {
    try {
      const response = await fetch(
        `https://localhost:7088/api/transaction/monthlySummary/${walletId}/${year}/${month}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setSummary(data);
      setTransactions(data.transactions);
    } catch (error) {
      console.error("Error during fetching summary:", error);
    }
  };

  return (
    <div className="container">
      <h1>Monthly Summary</h1>
      <div>
        <input
          type="text"
          placeholder="Wallet ID"
          value={walletId}
          onChange={(e) => setWalletId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <input
          type="text"
          placeholder="Month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <button onClick={handleGenerateClick}>Generate</button>
      </div>
      {summary && (
        <div>
          <p>
            <span style={{ color: "green" }}>
              Total Income: {summary.totalIncome}
            </span>
            ,&nbsp;
            <span style={{ color: "red" }}>
              Total Expenditure: {summary.totalExpenditure}
            </span>
            ,&nbsp; Net Balance: {summary.netBalance}
          </p>
        </div>
      )}
      {transactions.length > 0 && (
        <div>
          <h3>Transactions:</h3>
          {transactions.map((transaction, index) => (
            <div key={index}>
              <p>
                {transaction.date} - {transaction.title} - {transaction.amount}{" "}
                PLN&nbsp;
                <span
                  style={{
                    color: transaction.type === "income" ? "green" : "red",
                  }}
                >
                  ({transaction.type === "income" ? "Income" : "Expenditure"})
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MonthlySummary;
