import React from "react";
import { getDayData } from "../Handlers/ParseData";

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

function Day({ day, incomes, expenses }) {
  const dayData = getDayData(day, incomes, expenses);
  console.log(dayData);

  // Helper function to determine the text color for amount
  const getAmountColor = (type) => {
    if (type === "income") {
      return "text-primary"; // Blue for income
    }
    return "text-danger"; // Red for expenses
  };

  return (
    <div
      className="d-flex flex-column p-4 py-md-3 bg-light rounded shadow-sm mb-4"
      id={`day-${day}`}
    >
      <label class="list-group-item rounded-3 py-3">
        {day} {getDayOfWeek(day, getMonthIndex(dayData.month))}
        <span className="d-block small opacity-50">
          Income: {dayData.incomeTotal} | Expenses: {dayData.expenseTotal}
        </span>
        <span className="d-block small opacity-50">
          {dayData.month} {day} {dayData.year}
        </span>
      </label>
      <hr />
      <div id={`${day}`} className="list-group">
        {dayData.entries.map((entry, i) => (
          <div key={i}>
            <a
              href="#"
              className="list-group-item list-group-item-action d-flex gap-3 py-3"
              aria-current="true"
            >
              <div className="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 className="mb-0">
                    {entry.type} :{" "}
                    <span className={getAmountColor(entry.type)}>
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
    </div>
  );
}

export default Day;
