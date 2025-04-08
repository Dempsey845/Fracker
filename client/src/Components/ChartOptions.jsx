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

function ChartOptions({
  onChangeStartMonth,
  onChangeEndMonth,
  onYearChange,
  include = ["month", "year"],
}) {
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

  function showStartMonthOption() {
    return (
      <div className="col-md-4">
        <label htmlFor="startMonth" className="form-label">
          Select Start Month
        </label>
        <select
          id="startMonth"
          name="startMonth"
          onChange={handleMonthChange}
          value={startMonth}
          className="form-select"
        >
          {getStartMonthOptions()}
        </select>
      </div>
    );
  }

  function showEndMonthOption() {
    return (
      <div className="col-md-4">
        <label htmlFor="endMonth" className="form-label">
          Select End Month
        </label>
        <select
          id="endMonth"
          name="endMonth"
          onChange={handleMonthChange}
          value={endMonth}
          className="form-select"
        >
          {getEndMonthOptions()}
        </select>
      </div>
    );
  }

  function showYearOption() {
    return (
      <div className="col-md-4">
        <label htmlFor="year" className="form-label">
          Select Year
        </label>
        <select
          id="year"
          name="year"
          onChange={handleYearChange}
          value={year}
          className="form-select"
        >
          {getYearOptions()}
        </select>
      </div>
    );
  }

  return (
    <div
      id="chartOptions"
      className="container py-4" // Container with some vertical padding
    >
      <h3>Select Chart Options</h3>
      <div className="row g-3">
        {include.includes("month") && showStartMonthOption()}

        {include.includes("month") && showEndMonthOption()}

        {include.includes("year") && showYearOption()}
      </div>
    </div>
  );
}

export default ChartOptions;
