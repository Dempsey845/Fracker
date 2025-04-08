import React, { useEffect, useState } from "react";
import BarChart from "./BarChart";
import PopupForm from "./PopupForm";
import Transcript from "./Transcript";
import PieChart from "./PieChart";

function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [categories, setCategories] = useState({
    income: [],
    expenses: [],
  });
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // Fetch categories from default_categories.json
  useEffect(() => {
    fetch("/default_categories.json")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  // Fetch user details and income/expense data
  useEffect(() => {
    // Fetch user details from the API route (/api/dashboard)
    fetch("http://localhost:5000/api/dashboard", {
      credentials: "include", // Include cookies for session-based auth
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Authenticated") {
          setIsAuthenticated(true);
          setUser(data.user); // Set the user data from the response
          fetchIncomesAndExpenses(data.user.id); // Fetch incomes and expenses
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  const fetchIncomesAndExpenses = (userId) => {
    // Fetch Incomes
    fetch(`http://localhost:5000/api/incomes/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setIncomes(data.incomes || []);
      })
      .catch((error) => console.error("Error fetching incomes:", error));

    // Fetch Expenses
    fetch(`http://localhost:5000/api/expenses/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setExpenses(data.expenses || []);
      })
      .catch((error) => console.error("Error fetching expenses:", error));
  };

  const handleFormSubmit = (e, formData, type) => {
    e.preventDefault(); // This is a redundant line if e isn't used directly
    const { amount, note, date, category } = formData;
    const url = type === "income" ? "/api/addincome" : "/api/addexpense";
    const body = { amount, note, date, category };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include", // Include cookies for session-based auth
    })
      .then((response) => response.json())
      .then((data) => {
        if (
          data.message === "Income added successfully" ||
          data.message === "Expense added successfully"
        ) {
          fetchIncomesAndExpenses(user.id);
        } else {
          console.error("Error adding data:", data.message);
        }
      })
      .catch((error) => console.error("Error adding income/expense:", error));

    closePopup();
  };

  const openPopup = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);

  if (!isAuthenticated) {
    return (
      <div>
        <h1>You are not logged in.</h1>
        <p>Please log in to access the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="container text-center my-5">
      <h1 className="mb-4">Welcome to the Dashboard</h1>

      {user && (
        <div>
          <button onClick={openPopup} className="btn btn-primary mb-4">
            Add Income/Expense
          </button>

          <PopupForm
            show={showPopup}
            onClose={closePopup}
            onSubmit={handleFormSubmit}
            categories={categories}
          />

          <Transcript incomes={incomes} expenses={expenses} />
          <BarChart incomeData={incomes} expenseData={expenses} />
          <PieChart incomes={incomes} expenses={expenses} />
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
