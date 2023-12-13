import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from "react-router";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [transactionType, setTransactionType] = useState("all");
  const [categories, setCategories] = useState([]);
  const [startingDate, setStartingDate] = useState(null);
  const [endingDate, setEndingDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { walletId } = useParams();

  const handleStartingDateChange = (event) => {
    setStartingDate(event.target.value);
  };

  const handleEndingDateChange = (event) => {
    setEndingDate(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleTransactionTypeChange = (type) => {
    setTransactionType(type);
  };

  function findCategoryName(categoryId) {
    const foundCategory = categories.find(
      (category) => category.Id === categoryId
    );
    return foundCategory ? foundCategory.Name : "Unknown";
  }

  const handleFilterClick = async () => {
    const startDate = startingDate ? new Date(startingDate) : null;
    const endDate = endingDate ? new Date(endingDate) : null;

    let formattedStartingDate = "";
    let formattedEndingDate = "";

    if (startDate) formattedStartingDate = startDate.toUTCString();

    if (endDate) formattedEndingDate = endDate.toUTCString();

    try {
      let url = `https://localhost:7088/api/transaction/`;
      if (transactionType === "income") {
        url += `incomesForWallet/${walletId}`;
      } else if (transactionType === "expenditure") {
        url += `expendituresForWallet/${walletId}`;
      } else {
        url += `transactionsForWallet/${walletId}`;
      }

      const queryParams = [
        startDate ? `startDate=${formattedStartingDate}` : null,
        endDate ? `endDate=${formattedEndingDate}` : null,
        selectedCategory ? `selectedCategory=${selectedCategory}` : null,
      ]
        .filter(Boolean)
        .join("&");

      const response = await fetch(`${url}?${queryParams}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error during fetching transactions:", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `https://localhost:7088/api/transaction/allCategories`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error during fetching transactions:", error);
      }
    };

    fetchCategories();
    handleFilterClick();
  }, [walletId]);

  useEffect(() => {
    handleFilterClick();
  }, [walletId, transactionType]);

  return (
    <div className="container-fluid">
      <h2>Transaction list for wallet {walletId}</h2>

      <div className="d-flex justify-content-center">
        <button
          className="btn btn-secondary mx-1"
          onClick={() => handleTransactionTypeChange("all")}
        >
          All Transactions
        </button>
        <button
          className="btn btn-secondary mx-1"
          onClick={() => handleTransactionTypeChange("income")}
        >
          Incomes
        </button>
        <button
          className="btn btn-secondary mx-1"
          onClick={() => handleTransactionTypeChange("expenditure")}
        >
          Expenditures
        </button>
      </div>
      <div className="d-flex flex-column">
        <h3>Filter results:</h3>
        <div className="mx-auto">
          <span className="mx-2">Starting date:</span>
          <input
            type="date"
            name="startingDatePicker"
            value={startingDate || ""}
            onChange={handleStartingDateChange}
          />
          <span className="mx-2">Ending date:</span>{" "}
          <input
            type="date"
            name="endingDatePicker"
            value={endingDate || ""}
            onChange={handleEndingDateChange}
          />
          <span className="mx-2">Category:</span>{" "}
          <select id="categorySelect" onChange={handleCategoryChange}>
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.Id} value={category.Id}>
                {category.Name}
              </option>
            ))}
          </select>{" "}
          <button
            className="btn btn-secondary mx-1"
            onClick={handleFilterClick}
          >
            Filter
          </button>
        </div>
      </div>
      <div className="row d-flex justify-content-center">
        {transactions.map((transaction, i) => (
          <li key={i} className="mx-5 my-3 card w-25">
            <h2>{transaction.Title}</h2>
            <h5>{transaction.Amount} PLN</h5>
            <p>{new Date(transaction.Date).toISOString().split("T")[0]}</p>
            <p>{findCategoryName(transaction.CategoryId)}</p>
          </li>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
