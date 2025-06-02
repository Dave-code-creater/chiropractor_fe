// Profile.jsx
import React, { useState } from "react";

import PersonalInfo from "./PersonalInfo";
import ContactInfo from "./ContactInfo";

export default function Profile() {
    const [tab, setTab] = useState();

    const renderTab = () => {
        switch (tab) {
            case "profile":
                return <PersonalInfo />;
            case "contact":
                return <ContactInfo />;
            case "medical":
                return <div>Notification Settings</div>;
            default:
                return <PersonalInfo />;
        }
    };

    return (
        <div className="hidden mt-8 space-y-6 p-8 pb-16 md:block">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight ">Profile</h2>
                <p className="text-muted-foreground">
                    Update your profiles information from personal details to medical and emergency contacts.
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
                        className={`inline-flex items-center rounded-md text-md font-medium h-9 px-4 justify-start focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none hover:text-accent-foreground focus:text-gray-900 focus:bg-gray-200 ${tab === "account" ? "bg-accent text-accent-foreground" : ""
                            }`}
                    >
                        Profile
                    </button>

                    <button
                        onClick={() => setTab("contact")}
                        className={`inline-flex items-center rounded-md text-md font-medium h-9 px-4 justify-start focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none hover:text-accent-foreground focus:text-gray-900 focus:bg-gray-200 ${tab === "appearance" ? "bg-accent text-accent-foreground" : ""
                            }`}
                    >
                        Contact
                    </button>

                    <button
                        onClick={() => setTab("medical")}
                        className={`inline-flex items-center rounded-md text-md font-medium h-9 px-4 justify-start focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none hover:text-accent-foreground focus:text-gray-900 focus:bg-gray-200 ${tab === "notifications" ? "bg-accent text-accent-foreground" : ""
                            }`}
                    >
                        Medical
                    </button>

                </nav>
                <div className="flex-1">{renderTab()}</div>
            </div>
        </div>
    );
}
