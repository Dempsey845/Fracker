import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; // Required to register chart types
import {
  getMonthRange,
  getMonthTotals,
  filterDataByYear,
} from "../Handlers/ParseData";
import ChartOptions from "./ChartOptions";
import { use } from "react";

function BarChart({ data }) {
  const currentYear = parseInt(new Date().getFullYear());

  const [startMonth, setStartMonth] = useState(0);
  const [endMonth, setEndMonth] = useState(11);
  const [year, setYear] = useState(currentYear);

  const [filteredData, setFilteredData] = useState(
    filterDataByYear(data, currentYear)
  );

  const backgroundColor = "rgba(255, 99, 132, 0.2)";
  const borderColor = "rgba(255, 99, 132, 1)";
  const borderWidth = 1;

  const [displayData, setDisplayData] = useState({
    labels: getMonthRange(startMonth, endMonth),
    datasets: [
      {
        label: "Income",
        data: getMonthTotals(filteredData),
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
          data: getMonthTotals(filteredData),
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: borderWidth,
        },
      ],
    });
  }, [startMonth, endMonth, data, filteredData]);

  useEffect(() => {
    setFilteredData(filterDataByYear(data, year));
  }, [year, data]);

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
      <ChartOptions
        onChangeStartMonth={setStartMonth}
        onChangeEndMonth={setEndMonth}
        onYearChange={setYear}
      />
      <h2>Income for the Year</h2>
      <Bar data={displayData} options={options} />
    </div>
  );
}

export default BarChart;
