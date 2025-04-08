import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { filterDataByYear, totalsByCategory } from "../Handlers/ParseData";
import ChartOptions from "./ChartOptions";

function PieChart({ incomes, expenses }) {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [selectedType, setSelectedType] = useState("income");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const rawData = selectedType === "income" ? incomes : expenses;
    const yearFiltered = filterDataByYear(rawData, year);
    setFilteredData(yearFiltered);
  }, [year, selectedType, incomes, expenses]);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const categoryTotals = totalsByCategory(filteredData);
    const labels = Object.keys(categoryTotals);
    const values = Object.values(categoryTotals);

    const backgroundColors = labels.map(
      (_, i) => `hsl(${(i * 360) / labels.length}, 70%, 70%)`
    );

    setChartData({
      labels,
      datasets: [
        {
          label: `${
            selectedType === "income" ? "Income" : "Expenses"
          } by Category`,
          data: values,
          backgroundColor: backgroundColors,
          borderColor: "#fff",
          borderWidth: 1,
        },
      ],
    });
  }, [filteredData, selectedType]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div
      className="piechart"
      style={{
        backgroundColor: "#f9f9f9",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        margin: "20px auto",
        maxWidth: "800px",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <ChartOptions onYearChange={setYear} include={["year"]} />
        <select
          className="form-select w-auto"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="income">Income</option>
          <option value="expense">Expenses</option>
        </select>
      </div>
      <Pie data={chartData} options={options} />
    </div>
  );
}

export default PieChart;
