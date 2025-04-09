import React, { useEffect, useState } from "react";
import { getDayData } from "../Handlers/ParseData";
import EditPopupForm from "./EditPopupForm";
import {
  addExpense,
  addIncome,
  updateIncome,
  updateExpense,
  deleteIncome,
  deleteExpense,
} from "../Handlers/APIHandler";

function getDaySuffix(day) {
  if (day >= 11 && day <= 13) {
    return "th";
  }

  const lastDigit = day % 10;

  switch (lastDigit) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

// Helper function to get the day of the week
function getDayOfWeek(dayOfMonth, month) {
  const date = new Date(new Date().getFullYear(), month, dayOfMonth);
  const dayOfWeek = date.getDay();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return daysOfWeek[dayOfWeek];
}

// Helper function to get the index of a month name
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getMonthIndex(monthName) {
  return monthNames.indexOf(monthName);
}

// day 1 - 31
function formatDay(day) {
  return day < 10 ? `0${day}` : `${day}`;
}

function getMonthNumber(monthName) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthIndex = months.indexOf(monthName);

  // If the month name is found, return the month number (adding a leading zero for single digits)
  if (monthIndex !== -1) {
    return (monthIndex + 1).toString().padStart(2, "0");
  }

  return "";
}

function Day({ day, incomes, expenses, currency, onDataUpdated }) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [categories, setCategories] = useState({
    income: [],
    expenses: [],
  });
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    fetch("/default_categories.json")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const dayData = getDayData(day, incomes, expenses);
  const formatedDate = `${dayData.year}-${getMonthNumber(
    dayData.month
  )}-${formatDay(day)}`; // pass this to edit popup form as date
  console.log(formatedDate);

  function handleClose() {
    setShowEditForm(false);
    setSelectedEntry(null);
  }

  function handleEditSubmit(e, formData, type, prevType) {
    console.log("e=", e);
    console.log("formData: ", formData);
    console.log("type: ", type);
    console.log("prevType", prevType);

    if ((type !== "income") & (type !== "expense")) {
      console.error("Invalid type passed: ", type);
      return;
    }

    if (type !== prevType) {
      // Type has changed
      // Delete old income/expense
      // Add new expense/income
      prevType === "income"
        ? deleteIncome(formData.id)
        : deleteExpense(formData.id);
      type === "expense"
        ? addExpense(
            formData.amount,
            formData.note,
            formData.date,
            formData.category
          )
        : addIncome(
            formData.amount,
            formData.note,
            formData.date,
            formData.category
          );
    } else {
      type === "income"
        ? updateIncome(
            formData.id,
            formData.amount,
            formData.note,
            formData.date,
            formData.category
          )
        : updateExpense(
            formData.id,
            formData.amount,
            formData.note,
            formData.date,
            formData.category
          );
    }
    onDataUpdated();
    setShowEditForm(false);
    setSelectedEntry(null);
  }

  function onDelete(id, type) {
    if ((type !== "income") & (type !== "expense")) {
      console.error("Invalid type passed: ", type);
      return;
    }

    type === "income" ? deleteIncome(id) : deleteExpense(id);
    onDataUpdated();
    setShowEditForm(false);
    setSelectedEntry(null);
  }

  return (
    <div
      className="d-flex flex-column p-4 py-md-3 bg-light rounded shadow-sm mb-4"
      id={`day-${day}`}
    >
      <label className="list-group-item rounded-3 py-3">
        {day}
        {getDaySuffix(day)} | {getDayOfWeek(day, getMonthIndex(dayData.month))}
        <span className="d-block small opacity-50">
          Income: {currency}
          {dayData.incomeTotal} | Expenses: {currency}
          {dayData.expenseTotal}
        </span>
        <span className="d-block small opacity-50">
          {dayData.month} {day}
          {getDaySuffix(day)} {dayData.year}
        </span>
      </label>
      <hr />
      <div id={`${day}`} className="list-group">
        {dayData.entries.map((entry, i) => (
          <div key={i}>
            <a
              onClick={() => {
                const data = {
                  ...entry,
                  date: formatedDate,
                };
                setSelectedEntry(data);
                setShowEditForm(true);
              }}
              className="list-group-item list-group-item-action d-flex gap-3 py-3"
              aria-current="true"
            >
              <div className="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 className="mb-0">
                    {entry.type} :{" "}
                    <span className={getAmountColor(entry.type)}>
                      {currency}
                      {entry.amount}
                    </span>
                  </h6>
                  <p className="mb-0 opacity-75">{entry.note}</p>
                </div>
                <small className="opacity-50 text-nowrap">
                  {entry.category}
                </small>
              </div>
            </a>
          </div>
        ))}
      </div>
      {Object.keys(categories).length > 0 && selectedEntry && (
        <EditPopupForm
          show={showEditForm}
          onClose={handleClose}
          onSubmit={handleEditSubmit}
          categories={categories}
          data={selectedEntry}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}

// Helper function to determine the text color for amount
const getAmountColor = (type) => {
  if (type === "income") {
    return "text-primary"; // Blue for income
  }
  return "text-danger"; // Red for expenses
};

export default Day;
