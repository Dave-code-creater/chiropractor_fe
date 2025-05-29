import React, { useState } from "react";

export default function Notifications() {
    const [reminders, setReminders] = useState({
        Email: false,
        SMS: false,
        "Phone Call": false,
    });

    const [reminderTimes, setReminderTimes] = useState(["08:00", "18:00"]);
    const [followUp, setFollowUp] = useState("1day");
    const [leadTime, setLeadTime] = useState("24h");

    const handleReminderChange = (label) => {
        setReminders((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    const handleTimeChange = (index, newTime) => {
        const newTimes = [...reminderTimes];
        newTimes[index] = newTime;
        setReminderTimes(newTimes);
    };

    const addReminderTime = () => {
        setReminderTimes([...reminderTimes, ""]);
    };

    const removeReminderTime = (index) => {
        const updated = reminderTimes.filter((_, i) => i !== index);
        setReminderTimes(updated);
    };

    const selectedReminders = Object.keys(reminders).filter((key) => reminders[key]);

    return (
        <div className="w-full space-y-8">
            <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl p-8 border border-gray-200">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Configure how you want to receive appointment updates and health alerts.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Communication Methods */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Appointment Reminders</h3>
                        <div className="space-y-2">
                            {["Email", "SMS", "Phone Call"].map((label) => (
                                <label key={label} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={reminders[label]}
                                        onChange={() => handleReminderChange(label)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Reminder Times */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Reminder Times</h3>
                        <div className="space-y-2">
                            {reminderTimes.map((time, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => handleTimeChange(index, e.target.value)}
                                        className="px-3 py-1 border rounded-lg text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeReminderTime(index)}
                                        className="text-sm text-red-500 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addReminderTime}
                                className="text-indigo-600 hover:underline text-sm"
                            >
                                + Add Time
                            </button>
                        </div>
                    </div>

                    {/* Follow-Up */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Follow-Up Check-Ins</h3>
                        <div className="flex gap-4">
                            {["1day", "3days", "none"].map((value) => (
                                <label key={value} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="followUp"
                                        value={value}
                                        checked={followUp === value}
                                        onChange={() => setFollowUp(value)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700">
                                        {value === "1day" ? "1 Day" : value === "3days" ? "3 Days" : "None"}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Lead Time */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Reminder Lead Time</h3>
                        <div className="flex gap-6">
                            {["24h", "2h", "30m"].map((value) => (
                                <label key={value} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="leadTime"
                                        value={value}
                                        checked={leadTime === value}
                                        onChange={() => setLeadTime(value)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700">
                                        {value === "24h" ? "24 hours" : value === "2h" ? "2 hours" : "30 minutes"}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="mt-8 text-sm text-gray-600 space-y-1">
                    <p>
                        <span className="font-medium text-gray-800">Reminders via:</span>{" "}
                        {selectedReminders.length > 0 ? selectedReminders.join(", ") : "None"}
                    </p>
                    <p>
                        <span className="font-medium text-gray-800">Reminder Times:</span>{" "}
                        {reminderTimes.length > 0 ? reminderTimes.join(", ") : "None"}
                    </p>
                    <p>
                        <span className="font-medium text-gray-800">Follow-Up:</span> {followUp}
                    </p>
                    <p>
                        <span className="font-medium text-gray-800">Lead Time:</span> {leadTime}
                    </p>
                </div>
            </div>
        </div>
    );
}