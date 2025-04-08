const currencyMap = {
  GBP: "£",
  USD: "$",
  EUR: "€",
  INR: "₹",
  JPY: "¥",
  CAD: "$",
  AUD: "$",
  // Add more if needed
};

async function getCurrencySymbol() {
  try {
    const response = await fetch("/api/user/preferences");

    if (!response.ok) {
      console.error("Failed to fetch preferences");
      return "£"; // Default to GBP
    }

    const data = await response.json();
    const currencyCode = data.currency || "GBP";
    return currencyMap[currencyCode] || "£";
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return "£";
  }
}

export { getCurrencySymbol };
