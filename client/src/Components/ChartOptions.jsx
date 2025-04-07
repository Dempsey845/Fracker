import React, { useState } from "react";
import { months } from "../Handlers/ParseData";

function getYears() {
  const currentYear = parseInt(new Date().getFullYear());
  const amountOfYearOptions = 20;
  const years = [];
  for (var i = 0; i < amountOfYearOptions; i++) {
    years.push(currentYear - i);
  }
  return years;
}

function ChartOptions({ onChangeStartMonth, onChangeEndMonth, onYearChange }) {
  const [startMonth, setStartMonth] = useState(0);
  const [endMonth, setEndMonth] = useState(11);
  const [year, setYear] = useState(2025);

  // Get options for the start month (January to November)
  function getStartMonthOptions() {
    const slicedMonths = months.slice(0, 11); // Ignore December
    return slicedMonths.map((month, index) => {
      return (
        <option key={index} value={index}>
          {month}
        </option>
      );
    });
  }

  // Get options for the end month (based on startMonth)
  function getEndMonthOptions() {
    const slicedMonths = months.slice(startMonth + 1, 12); // From next month after startMonth to December
    return slicedMonths.map((month, index) => {
      return (
        <option key={index} value={startMonth + 1 + index}>
          {month}
        </option>
      );
    });
  }

  // Handle month change for both start and end month
  function handleMonthChange(event) {
    const index = parseInt(event.target.value);
    const name = event.target.name;
    if (name === "startMonth") {
      setStartMonth(index);
      onChangeStartMonth?.(index);
    } else if (name === "endMonth") {
      setEndMonth(index);
      onChangeEndMonth?.(index);
    }
  }

  function handleYearChange(event) {
    const newYear = parseInt(event.target.value);
    setYear(newYear);
    onYearChange?.(newYear);
  }

  function getYearOptions() {
    return getYears().map((y, index) => {
      return (
        <option key={index} value={y}>
          {y}
        </option>
      );
    });
  }

  return (
    <div id="chartOptions">
      <label>Select Start Month</label>
      <select name="startMonth" onChange={handleMonthChange} value={startMonth}>
        {getStartMonthOptions()}
      </select>
      <label>Select End Month</label>
      <select name="endMonth" onChange={handleMonthChange} value={endMonth}>
        {getEndMonthOptions()}
      </select>
      <label>Select Year</label>
      <select name="year" onChange={handleYearChange} value={year}>
        {getYearOptions()}
      </select>
    </div>
  );
}

export default ChartOptions;
