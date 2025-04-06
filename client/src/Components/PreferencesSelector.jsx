import React, { useState, useEffect } from "react";

async function updatePreferences(currency, theme) {
  try {
    const response = await fetch(
      "http://localhost:5000/api/updatepreferences",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currency, theme }),
        credentials: "include", // Include cookies for session-based authentication
      }
    );

    const data = await response.json();
    if (response.ok) {
      console.log("Preferences updated successfully:", data);
    } else {
      console.error("Failed to update preferences:", data.message);
    }
  } catch (error) {
    console.error("Error updating preferences:", error);
  }
}

function PreferencesSelector() {
  const [currency, setCurrency] = useState("GBP"); // Default value for currency
  const [theme, setTheme] = useState("light"); // Default value for theme
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // To store any errors

  // Fetch user's preferences from the backend (currency and theme)
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch("/api/user/preferences");
        if (!response.ok) {
          throw new Error("Failed to fetch preferences");
        }

        const data = await response.json();
        setCurrency(data.currency); // Set the currency state to the user's preference
        setTheme(data.theme); // Set the theme state to the user's preference
      } catch (error) {
        setError("Error fetching preferences. Please try again later.");
        console.error("Error fetching preferences:", error);
      } finally {
        setLoading(false); // Stop loading after the fetch is complete
      }
    };

    fetchPreferences();
  }, []);

  const handleCurrencyChange = (e) => {
    const selectedCurrency = e.target.value;
    setCurrency(selectedCurrency);
    updatePreferences(selectedCurrency, theme); // Update the preferences on the server with the updated currency and current theme
  };

  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
    updatePreferences(currency, selectedTheme); // Update the preferences on the server with the current currency and updated theme
  };

  if (loading) return <div>Loading...</div>; // Optionally show a loading message
  if (error) return <div>{error}</div>; // Show error message if there's any issue

  return (
    <div className="mb-3">
      <label htmlFor="currency" className="form-label">
        Select Currency:
      </label>
      <select
        id="currency"
        className="form-select"
        value={currency}
        onChange={handleCurrencyChange}
      >
        <option value="GBP">GBP (£)</option>
        <option value="USD">USD ($)</option>
        <option value="EUR">EUR (€)</option>
        <option value="JPY">JPY (¥)</option>
        <option value="AUD">AUD (A$)</option>
        <option value="CAD">CAD (C$)</option>
        <option value="INR">INR (₹)</option>
      </select>

      <label htmlFor="theme" className="form-label">
        Select Theme:
      </label>
      <select
        id="theme"
        className="form-select"
        value={theme}
        onChange={handleThemeChange}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}

export default PreferencesSelector;
