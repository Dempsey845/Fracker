import React, { useEffect, useState } from "react";
import {
  filterDataByMonth,
  filterDataByYear,
  getMonthTotal,
  getDayData,
} from "../Handlers/ParseData";
import { getCurrencySymbol } from "../Handlers/GetUserCurrency";
import Day from "./Day";

function Transcript({ incomes, expenses, onDataUpdated }) {
  console.log("Incomes being passed to transcript: ", incomes);
  const date = new Date();
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [total, setTotal] = useState(0);

  const [currency, setCurrency] = useState();

  useEffect(() => {
    const fetchCurrency = async () => {
      const userCurrency = await getCurrencySymbol(); // Get the user's currency symbol
      setCurrency(userCurrency); // Set currency state
    };
    fetchCurrency(); // Fetch currency on component mount
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Filter incomes and expenses when month/year changes
  useEffect(() => {
    const yearFilteredIncomes = filterDataByYear(incomes, year);
    const yearFilteredExpenses = filterDataByYear(expenses, year);

    setFilteredIncomes(filterDataByMonth(yearFilteredIncomes, month));
    setFilteredExpenses(filterDataByMonth(yearFilteredExpenses, month));
  }, [month, year, incomes, expenses]);

  // Recalculate totals
  useEffect(() => {
    setIncomeTotal(getMonthTotal(filteredIncomes));
    setExpenseTotal(getMonthTotal(filteredExpenses));
  }, [filteredIncomes, filteredExpenses]);

  useEffect(() => {
    setTotal((incomeTotal - expenseTotal).toFixed(2));
  }, [incomeTotal, expenseTotal]);

  // Days in selected month
  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  const daysInMonth = getDaysInMonth(year, month);

  // Filter out days with no entries
  const daysWithEntries = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dayData = getDayData(day, filteredIncomes, filteredExpenses);
    return { day, hasEntries: dayData.entries.length > 0 };
  }).filter((day) => day.hasEntries);

  return (
    <div
      id="transcript"
      className="transcript"
      style={{
        minHeight: "700px",
        backgroundColor: "#f9f9f9", // Light background color for the transcript
        padding: "20px", // Padding around the content
        borderRadius: "8px", // Rounded corners for the container
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
        margin: "20px auto", // Center the container horizontally with some margin
        maxWidth: "1200px", // Ensure the content doesn't stretch too wide
      }}
    >
      <div
        className="container py-4" // Container for spacing and alignment
        style={{
          marginBottom: "20px", // Spacing between the header and the rest of the content
          padding: "15px",
          backgroundColor: "#fff", // White background for header area
          borderRadius: "8px", // Rounded corners for the header
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
        }}
      >
        <h3 className="mb-4">Select Month and Year</h3>

        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="month" className="form-label">
              Month
            </label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="form-select"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="year" className="form-label">
              Year
            </label>
            <input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="form-control"
            />
          </div>
        </div>
      </div>

      <div
        className="financial-summary"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "30px",
          padding: "15px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="summary-item">
          <h5 className="income" style={{ color: "#007bff" }}>
            Income
          </h5>
          <h5 className="income" style={{ color: "#007bff" }}>
            {currency}
            {incomeTotal}
          </h5>
        </div>
        <div className="summary-item">
          <h5 className="expense" style={{ color: "#dc3545" }}>
            Expenses
          </h5>
          <h5 className="expense" style={{ color: "#dc3545" }}>
            {currency}
            {expenseTotal}
          </h5>
        </div>
        <div className="summary-item">
          <h5>Total</h5>
          <h5>
            {currency}
            {total}
          </h5>
        </div>
      </div>

      <div
        className="days-grid d-grid gap-4"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", // Flexible columns
          justifyContent: "center", // Horizontally centers the grid
          width: "100%", // Ensures the grid container takes up the full width
          maxWidth: "1200px",
          margin: "0 auto", // Horizontally center the grid container
        }}
      >
        {daysWithEntries.map(({ day }) => (
          <Day
            key={day}
            day={day}
            incomes={filteredIncomes}
            expenses={filteredExpenses}
            currency={currency}
            onDataUpdated={onDataUpdated}
          />
        ))}
      </div>
    </div>
  );
}

export default Transcript;
