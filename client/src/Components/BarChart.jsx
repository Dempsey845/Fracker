import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; // Required to register chart types
import {
  getMonthRange,
  getMonthTotals,
  filterDataByYear,
} from "../Handlers/ParseData";
import ChartOptions from "./ChartOptions";

function BarChart({ incomeData, expenseData }) {
  const currentYear = parseInt(new Date().getFullYear());

  const [startMonth, setStartMonth] = useState(0);
  const [endMonth, setEndMonth] = useState(11);
  const [year, setYear] = useState(currentYear);

  const [filteredIncomeData, setFilteredIncomeData] = useState(
    filterDataByYear(incomeData, currentYear)
  );

  const [filteredExpenseData, setFilteredExpenseData] = useState(
    filterDataByYear(expenseData, currentYear)
  );

  const backgroundColor2 = "rgba(255, 99, 132, 0.2)";
  const backgroundColor = "rgba(99, 255, 132, 0.2)";
  const borderColor2 = "rgba(255, 99, 132, 1)";
  const borderColor = "rgba(99, 255, 132, 1)";
  const borderWidth = 1;

  const [displayData, setDisplayData] = useState({
    labels: getMonthRange(startMonth, endMonth),
    datasets: [
      {
        label: "Income",
        data: getMonthTotals(filteredIncomeData),
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: borderWidth,
      },
    ],
  });

  useEffect(() => {
    setDisplayData({
      labels: getMonthRange(startMonth, endMonth),
      datasets: [
        {
          label: "Income",
          data: getMonthTotals(filteredIncomeData),
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: borderWidth,
        },
        {
          label: "Expenses",
          data: getMonthTotals(filteredExpenseData),
          backgroundColor: backgroundColor2,
          borderColor: borderColor2,
          borderWidth: borderWidth,
        },
      ],
    });
  }, [
    startMonth,
    endMonth,
    incomeData,
    filteredIncomeData,
    expenseData,
    filteredExpenseData,
  ]);

  useEffect(() => {
    setFilteredIncomeData(filterDataByYear(incomeData, year));
    setFilteredExpenseData(filterDataByYear(expenseData, year));
  }, [year, incomeData, expenseData]);

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div
      className="barchart"
      style={{
        backgroundColor: "#f9f9f9",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        margin: "20px auto",
        maxWidth: "1200px",
      }}
    >
      <ChartOptions
        onChangeStartMonth={setStartMonth}
        onChangeEndMonth={setEndMonth}
        onYearChange={setYear}
      />
      <Bar data={displayData} options={options} />
    </div>
  );
}

export default BarChart;
