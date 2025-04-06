import React, { useState, useEffect } from "react";

// Function to update preferences on the backend
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

function SettingsPage() {
  const [currency, setCurrency] = useState("GBP"); // Default currency
  const [theme, setTheme] = useState("light"); // Default theme

  // Handle currency selection change
  const handleCurrencyChange = (e) => {
    const selectedCurrency = e.target.value;
    setCurrency(selectedCurrency);
    updatePreferences(selectedCurrency, theme); // Update the preferences on the server
  };

  // Handle theme (dark mode) selection
  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
    updatePreferences(currency, selectedTheme); // Update the preferences on the server
  };

  return (
    <div>
      <h2 className="d-flex align-items-center justify-content-center">
        Settings
      </h2>
      <div className="d-flex flex-column flex-md-row p-4 gap-4 py-md-5 align-items-center justify-content-center">
        {/* Currency Selection */}
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
        </div>

        {/* Theme (Dark Mode) Selection */}
        <div className="mb-3">
          <label htmlFor="theme" className="form-label">
            Select Theme:
          </label>
          <select
            id="theme"
            className="form-select"
            value={theme}
            onChange={handleThemeChange}
          >
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
