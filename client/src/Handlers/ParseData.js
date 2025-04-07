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

function FilterDataByYear(data, year) {
  console.log("Data being passed to FilterDataByYear: ", data);
  console.log("Year being passed to FilterDataByYear: ", year, typeof year);
  return data.filter((entry) => {
    const date = new Date(entry.date);
    const y = date.getFullYear();
    return year === parseInt(y);
  });
}

function GetMonthTotals(data) {
  console.log("Data being passed to GetMonthTotals: ", data);
  return data.map((entry) => {
    return parseInt(entry.amount);
  });
}

export { FilterDataByYear, GetMonthTotals };
