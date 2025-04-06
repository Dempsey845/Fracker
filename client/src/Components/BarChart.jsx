import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; // Required to register chart types

const data = {
  labels: ["January", "February", "March", "April", "May"],
  datasets: [
    {
      label: "Income",
      data: [65, 59, 80, 81, 56],
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

function BarChart() {
  return (
    <div>
      <h2>Income for the Year</h2>
      <Bar data={data} options={options} />
    </div>
  );
}

export default BarChart;
