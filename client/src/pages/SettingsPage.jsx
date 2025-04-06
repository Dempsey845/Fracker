import React from "react";
import PreferencesSelector from "../Components/PreferencesSelector";

function SettingsPage() {
  return (
    <div>
      <h2 className="d-flex align-items-center justify-content-center">
        Settings
      </h2>
      <div className="d-flex flex-column flex-md-row p-4 gap-4 py-md-5 align-items-center justify-content-center">
        {/* Currency Selection */}
        <PreferencesSelector />
      </div>
    </div>
  );
}

export default SettingsPage;
