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
  //console.log("Data being passed to filterDataByYear: ", data);
  //console.log("Year being passed to filterDataByYear: ", year, typeof year);
  return data.filter((entry) => {
    const date = new Date(entry.date);
    const y = date.getFullYear();
    return year === parseInt(y);
  });
}

function filterDataByMonth(data, month) {
  /* Input requires Month index (0-11) */
  return data.filter((entry) => {
    const date = new Date(entry.date);
    const m = date.getMonth();
    return month === m;
  });
}

function getMonthTotals(data) {
  //console.log("Data being passed to getMonthTotals: ", data);
  const totals = Array(12).fill(0);
  data.forEach((entry) => {
    const date = new Date(entry.date);
    const monthIndex = date.getMonth();
    const amount = parseFloat(entry.amount);

    totals[monthIndex] += amount;
  });
  //console.log("GetMonthsTotals result: ", totals);
  return totals;
}

function getMonthTotal(data, month) {
  /* Input requires Month index (0-11) */
  const totals = getMonthTotals(data);
  const inital = 0;
  const total = totals.reduce(
    (accumulator, current) => accumulator + current,
    inital
  );
  return total;
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

function getDayData(dayOfMonth, incomes, expenses) {
  //console.log("incomes being passed to getDayData: ", incomes);
  const result = {
    day: dayOfMonth,
    month: "",
    year: 1900,
    incomeTotal: 0,
    expenseTotal: 0,
    entries: [],
  };

  // Helper to filter entries and sum totals
  function processEntries(entries, type) {
    const filtered = entries.filter((entry) => {
      const date = new Date(entry.date);
      const entryDay = date.getDate(); // Day of the month (1–31)
      result.month = months[date.getMonth()]; // Set month based on the first entry
      result.year = date.getFullYear(); // Set year based on the first entry
      return entryDay === dayOfMonth;
    });

    const total = filtered.reduce(
      (sum, entry) => sum + parseInt(entry.amount),
      0
    );

    const formatted = filtered.map((entry) => ({
      id: entry.id, // Ensure that id is passed
      category: entry.category,
      type: type,
      note: entry.note,
      amount: entry.amount,
      date: entry.date, // Add date for sorting
    }));

    return { total, formatted };
  }

  const incomeData = processEntries(incomes, "income");
  const expenseData = processEntries(expenses, "expense");

  result.incomeTotal = incomeData.total;
  result.expenseTotal = expenseData.total;
  result.entries = [...incomeData.formatted, ...expenseData.formatted].sort(
    (a, b) => new Date(a.date) - new Date(b.date) // Sort entries by date
  );

  return result;
}

export {
  months,
  filterDataByYear,
  filterDataByMonth,
  getMonthTotals,
  getMonthTotal,
  filterDataByMonthRange,
  getMonthRange,
  getDayData,
};
