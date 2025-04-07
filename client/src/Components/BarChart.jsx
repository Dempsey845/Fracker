import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; // Required to register chart types
import { GetMonthRange, GetMonthTotals } from "../Handlers/ParseData";

function BarChart({ data, startMonth, endMonth }) {
  const displayData = {
    labels: GetMonthRange(startMonth, endMonth),
    datasets: [
      {
        label: "Income",
        data: GetMonthTotals(data),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>Income for the Year</h2>
      <Bar data={displayData} options={options} />
    </div>
  );
}

export default BarChart;
