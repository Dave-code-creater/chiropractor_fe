// Setting.jsx
import React, { useState } from "react";

import Account from "./Account";
import Appearance from "./Appearance";
import Notifications from "./Notifications";
import Profile from "./ProfileSection";
import Display from "./Display";
// …

export default function Setting() {
  const [tab, setTab] = useState("profile");

  const renderTab = () => {
    switch (tab) {
      case "account":
        return <Account/>;
      case "appearance":
        return <Appearance/>;
      case "notifications":
        return <Notifications/>;
      case "display":
        return <Display/>;
      default:
        return <Profile/>;
    }
  };

  return (
    <div className="hidden space-y-6 p-8 pb-16 md:block">
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
                            onClick={() => setTab("profile")}
                            className={`${tab === "profile" ? "bg-muted" : ""} inline-flex items-center rounded-md text-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 bg-muted hover:bg-muted justify-start`}
                        >Profile</button>
                        <button
                            onClick={() => setTab("account")}
                            className={`${tab === "account" ? "bg-muted" : ""} inline-flex items-center rounded-md text-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 bg-muted hover:bg-muted justify-start`}
                            >Account</button>
                        <button
                            onClick={() => setTab("appearance")}
                            className={`${tab === "appearance" ? "bg-muted" : ""} inline-flex items-center rounded-md text-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 bg-muted hover:bg-muted justify-start`}
                            >Appearance</button>
                        <button
                            onClick={() => setTab("notifications")}
                            className={`${tab === "Notifications" ? "bg-muted" : ""} inline-flex items-center rounded-md text-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 bg-muted hover:bg-muted justify-start`}
                            >Notifications</button>
                        <button
                            onClick={() => setTab("display")}
                            className={`${tab === "display" ? "bg-muted" : ""} inline-flex items-center rounded-md text-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 bg-muted hover:bg-muted justify-start`}
                            >Display</button>
                    </nav>
                    <div className="flex-1">{renderTab()}</div>
                </div>
    </div>
  );
}
