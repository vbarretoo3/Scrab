import React, { useState } from "react";
import CompanyInfo from "../components/Settings/CompanyInfo";
import Billing from "../components/Settings/Billing";
import StaffSettings from "../components/Settings/StaffSettings";

function Settings() {
  const [visibleComponent, setVisibleComponent] = useState("CompanyInfo"); // Default to CompanyInfo

  return (
    <div className="protected-route-container">
      <h3>Settings</h3>
      <div className="settings-container">
        <div className="nav-bar-container">
          <button
            className="settings-navbar"
            onClick={() => setVisibleComponent("CompanyInfo")}
          >
            Company info
          </button>
          <button
            className="settings-navbar"
            onClick={() => setVisibleComponent("Billing")}
          >
            Billing
          </button>
          <button
            className="settings-navbar"
            onClick={() => setVisibleComponent("Staff")}
          >
            Staff
          </button>
        </div>
        <div className="divider" />
        <div>
          {visibleComponent === "CompanyInfo" && <CompanyInfo />}
          {visibleComponent === "Billing" && <Billing />}
          {visibleComponent === "Staff" && <StaffSettings />}
        </div>
      </div>
    </div>
  );
}

export default Settings;
