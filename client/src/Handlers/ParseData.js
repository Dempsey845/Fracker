/*
Filter data by year
Get month totals
*/

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

function filterDataByYear(data, year) {
  console.log("Data being passed to filterDataByYear: ", data);
  console.log("Year being passed to filterDataByYear: ", year, typeof year);
  return data.filter((entry) => {
    const date = new Date(entry.date);
    const y = date.getFullYear();
    return year === parseInt(y);
  });
}

function getMonthTotals(data) {
  console.log("Data being passed to getMonthTotals: ", data);
  const totals = Array(12).fill(0);
  data.forEach((entry) => {
    const date = new Date(entry.date);
    const monthIndex = date.getMonth();
    const amount = parseFloat(entry.amount);

    totals[monthIndex] += amount;
  });
  console.log("GetMonthsTotals result: ", totals);
  return totals;
}

function filterDataByMonthRange(data, startMonth, endMonth) {
  if (endMonth > startMonth) {
    console.error("End month shouldn't be less then start month!");
  }

  return data.filter((entry) => {
    const date = new Date(entry.date);
    const entryMonth = date.getMonth(); // Get the month index (0 = January, 11 = December)
    return entryMonth >= startMonth && entryMonth <= endMonth;
  });
}

function getMonthRange(startMonth, endMonth) {
  return months.slice(startMonth, endMonth + 1);
}

export {
  months,
  filterDataByYear,
  getMonthTotals,
  filterDataByMonthRange,
  getMonthRange,
};
