import {React, useState} from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";



export default function Notifications() {
    const [reminders, setReminders] = useState({
        Email: false,
        SMS: false,
        "Phone Call": false,
    });
    const [followUp, setFollowUp] = useState("1day"); // "1day", "3days", "none"
    const [leadTime, setLeadTime] = useState("24h"); // "24h", "2h", "30m"

    const handleReminderChange = (label) => {
        setReminders((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    // Lấy danh sách đã chọn
    const selectedReminders = Object.keys(reminders).filter((key) => reminders[key]);

    return (
        <div className="hidden space-y-6 w-full md:block">
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <div className="flex-1 pb-2 lg:max-w-5xl mb-10">
                    <header className="mb-4">
                        <h2 className="text-lg font-bold">Notifications</h2>
                        <p className="text-gray-600">Configure your reminders & health follow-ups</p>
                    </header>

                    <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* Appointment Reminders */}
                        <div className="rounded-lg">
                            <dt className="text-lg font-semibold">Appointment Reminders</dt>
                            <dd className="mt-4 space-y-2">
                                {["Email", "SMS", "Phone Call"].map((label) => (
                                    <label key={label} className="inline-flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={reminders[label]}
                                            onChange={() => handleReminderChange(label)}
                                            className="form-checkbox h-5 w-5 text-blue-600"
                                        />
                                        <span className="text-gray-800">{label}</span>
                                    </label>
                                ))}
                            </dd>
                        </div>

                        {/* Follow-Up Check-Ins */}
                        <div className="rounded-lg">
                            <dt className="text-lg font-semibold">Follow-Up Check-Ins</dt>
                            <dd className="mt-4 flex gap-6 text-gray-700">
                                <label className="inline-flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="followUp"
                                        value="1day"
                                        checked={followUp === "1day"}
                                        onChange={() => setFollowUp("1day")}
                                        className="form-radio h-5 w-5 text-blue-600"
                                    />
                                    <span>1 day</span>
                                </label>
                                <label className="inline-flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="followUp"
                                        value="3days"
                                        checked={followUp === "3days"}
                                        onChange={() => setFollowUp("3days")}
                                        className="form-radio h-5 w-5 text-blue-600"
                                    />
                                    <span>3 days</span>
                                </label>
                                <label className="inline-flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="followUp"
                                        value="none"
                                        checked={followUp === "none"}
                                        onChange={() => setFollowUp("none")}
                                        className="form-radio h-5 w-5 text-blue-600"
                                    />
                                    <span>None</span>
                                </label>
                            </dd>
                        </div>

                        {/* Medication Reminders */}
                        <div className="rounded-lg">
                            <dt className="text-lg font-semibold">Medication Reminders</dt>
                            <dd className="mt-4 text-gray-700">
                                Scheduled times (e.g. <em>8:00 AM</em> / <em>6:00 PM</em>)
                            </dd>
                        </div>

                        {/* Newsletters & Health Tips */}
                        <div className="rounded-lg">
                            <dt className="text-lg font-semibold">Newsletters &amp; Health Tips</dt>
                            <dd className="mt-4 text-gray-700">
                                Subscribe via <strong>Email</strong> / <strong>SMS</strong>
                            </dd>
                        </div>

                        {/* Reminder Lead Time */}
                        <div className="rounded-lg sm:col-span-2">
                            <dt className="text-lg font-semibold">Reminder Lead Time</dt>
                            <dd className="mt-4 flex gap-6 text-gray-700">
                                <label className="inline-flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="leadTime"
                                        value="24h"
                                        checked={leadTime === "24h"}
                                        onChange={() => setLeadTime("24h")}
                                        className="form-radio h-5 w-5 text-blue-600"
                                    />
                                    <span>24 hours</span>
                                </label>
                                <label className="inline-flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="leadTime"
                                        value="2h"
                                        checked={leadTime === "2h"}
                                        onChange={() => setLeadTime("2h")}
                                        className="form-radio h-5 w-5 text-blue-600"
                                    />
                                    <span>2 hours</span>
                                </label>
                                <label className="inline-flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="leadTime"
                                        value="30m"
                                        checked={leadTime === "30m"}
                                        onChange={() => setLeadTime("30m")}
                                        className="form-radio h-5 w-5 text-blue-600"
                                    />
                                    <span>30 minutes</span>
                                </label>
                            </dd>
                        </div>
                    </dl>
                    {/* Hiển thị các loại đã chọn */}
                    <div className="mt-4">
                        <span className="font-semibold">Selected reminders:</span>
                        <span className="ml-2">{selectedReminders.join(", ") || "None"}</span>
                        <br />
                        <span className="font-semibold">Follow-Up Check-Ins:</span>
                        <span className="ml-2">{followUp}</span>
                        <br />
                        <span className="font-semibold">Reminder Lead Time:</span>
                        <span className="ml-2">{leadTime}</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
