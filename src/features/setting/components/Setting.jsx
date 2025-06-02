// Setting.jsx
import React, { useState } from "react";

import Account from "./Account";
import Appearance from "./Appearance";
import Notifications from "./Notifications";
import Display from "./Display";
// …

export default function Setting() {
  const [tab, setTab] = useState();

  const renderTab = () => {
    switch (tab) {
      case "account":
        return <Account />;
      case "appearance":
        return <Appearance />;
      case "notifications":
        return <Notifications />;
      default:
        return <Display />;

    }
  };

  return (
    <div className="hidden mt-8 space-y-6 p-8 pb-16 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight ">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      {/* <!-- Seperator --> */}
      <div className="shrink-0 bg-border h-[1px]"></div>
      <div
        className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0"
      >
        <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 mb-10">
          <button
            onClick={() => setTab("account")}
            className={`inline-flex items-center rounded-md text-md font-medium h-9 px-4 justify-start focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none hover:text-accent-foreground focus:text-gray-900 focus:bg-gray-200 ${tab === "account" ? "bg-accent text-accent-foreground" : ""
              }`}
          >
            Account
          </button>

          <button
            onClick={() => setTab("appearance")}
            className={`inline-flex items-center rounded-md text-md font-medium h-9 px-4 justify-start focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none hover:text-accent-foreground focus:text-gray-900 focus:bg-gray-200 ${tab === "appearance" ? "bg-accent text-accent-foreground" : ""
              }`}
          >
            Appearance
          </button>

          <button
            onClick={() => setTab("notifications")}
            className={`inline-flex items-center rounded-md text-md font-medium h-9 px-4 justify-start focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none hover:text-accent-foreground focus:text-gray-900 focus:bg-gray-200 ${tab === "notifications" ? "bg-accent text-accent-foreground" : ""
              }`}
          >
            Notifications
          </button>

          <button
            onClick={() => setTab("display")}
            className={`inline-flex items-center rounded-md text-md font-medium h-9 px-4 justify-start focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none hover:text-accent-foreground focus:text-gray-900 focus:bg-gray-200 ${tab === "display" ? "bg-accent text-accent-foreground" : ""
              }`}
          >
            Display
          </button>
        </nav>
        <div className="flex-1">{renderTab()}</div>
      </div>
    </div>
  );
}
