import {React, useState} from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";



export default function Notifications() {
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
                        <div className=" rounded-lg ">
                            <dt className="text-lg font-semibold">Appointment Reminders</dt>
                            <dd className="mt-4 space-y-2">
                                {["Email", "SMS", "Phone Call"].map((label) => (
                                    <label key={label} className="inline-flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={label === "SMS"}
                                            readOnly
                                            className="form-checkbox h-5 w-5 text-blue-600"
                                        />
                                        <span className="text-gray-800">{label}</span>
                                    </label>
                                ))}
                            </dd>
                        </div>

                        {/* Follow-Up Check-Ins */}
                        <div className="rounded-lg ">
                            <dt className="text-lg font-semibold">Follow-Up Check-Ins</dt>
                            <dd className="mt-4 text-gray-700">
                                Automatic call/text after <strong>1 day</strong> / <strong>3 days</strong> / <strong>None</strong>
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
                        <div className="rounded-lg ">
                            <dt className="text-lg font-semibold">Newsletters &amp; Health Tips</dt>
                            <dd className="mt-4 text-gray-700">
                                Subscribe via <strong>Email</strong> / <strong>SMS</strong>
                            </dd>
                        </div>

                        {/* Reminder Lead Time */}
                        <div className="rounded-lg sm:col-span-2">
                            <dt className="text-lg font-semibold">Reminder Lead Time</dt>
                            <dd className="mt-4 text-gray-700">
                                Remind <strong>24 hours</strong> / <strong>2 hours</strong> / <strong>30 minutes</strong> before
                            </dd>
                        </div>
                    </dl>
                </div>

            </div>
        </div>
    );
}
