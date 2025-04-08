// Function to add income
function addIncome(amount, note, date, category) {
  const incomeData = { amount, note, date, category };

  fetch("/api/addincome", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(incomeData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Income added successfully") {
        console.log("Income added:", data.income);
      } else {
        console.error("Failed to add income:", data.message);
      }
    })
    .catch((err) => {
      console.error("An error occurred while adding income:", err);
    });
}

// Function to add expense
function addExpense(amount, note, date, category) {
  const expenseData = { amount, note, date, category };

  fetch("/api/addexpense", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expenseData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Expense added successfully") {
        console.log("Expense added:", data.expense);
      } else {
        console.error("Failed to add expense:", data.message);
      }
    })
    .catch((err) => {
      console.error("An error occurred while adding expense:", err);
    });
}

// Function to fetch all incomes for a user (pass userId as needed)
function getIncomes(userId) {
  fetch(`/api/incomes/${userId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Incomes fetched successfully") {
        console.log("Incomes:", data.incomes);
      } else {
        console.error("Failed to fetch incomes:", data.message);
      }
    })
    .catch((err) => {
      console.error("An error occurred while fetching incomes:", err);
    });
}

// Function to fetch all expenses for a user (pass userId as needed)
function getExpenses(userId) {
  fetch(`/api/expenses/${userId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Expenses fetched successfully") {
        console.log("Expenses:", data.expenses);
      } else {
        console.error("Failed to fetch expenses:", data.message);
      }
    })
    .catch((err) => {
      console.error("An error occurred while fetching expenses:", err);
    });
}

// Function to update income
function updateIncome(incomeId, amount, note, date, category) {
  const incomeData = { amount, note, date, category };

  fetch(`/api/updateincome/${incomeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(incomeData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Income updated successfully") {
        console.log("Income updated:", data.income);
      } else {
        console.error("Failed to update income:", data.message);
      }
    })
    .catch((err) => {
      console.error("An error occurred while updating income:", err);
    });
}

// Function to update expense
function updateExpense(expenseId, amount, note, date, category) {
  const expenseData = { amount, note, date, category };

  fetch(`/api/updateexpense/${expenseId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expenseData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Expense updated successfully") {
        console.log("Expense updated:", data.expense);
      } else {
        console.error("Failed to update expense:", data.message);
      }
    })
    .catch((err) => {
      console.error("An error occurred while updating expense:", err);
    });
}

// Function to delete income
function deleteIncome(incomeId) {
  fetch(`/api/deleteincome/${incomeId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Income deleted successfully") {
        console.log("Income deleted:", data.income);
      } else {
        console.error("Failed to delete income:", data.message);
      }
    })
    .catch((err) => {
      console.error("An error occurred while deleting income:", err);
    });
}

// Function to delete expense
function deleteExpense(expenseId) {
  fetch(`/api/deleteexpense/${expenseId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Expense deleted successfully") {
        console.log("Expense deleted:", data.expense);
      } else {
        console.error("Failed to delete expense:", data.message);
      }
    })
    .catch((err) => {
      console.error("An error occurred while deleting expense:", err);
    });
}

export {
  addExpense,
  addIncome,
  getIncomes,
  getExpenses,
  updateIncome,
  updateExpense,
  deleteIncome,
  deleteExpense,
};
