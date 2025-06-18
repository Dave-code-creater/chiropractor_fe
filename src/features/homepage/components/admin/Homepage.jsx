import data from "@/app/dashboard/data.json"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import React from "react"
import { useState, useEffect } from "react"
import { Users, FileText, MessageSquare, Smile } from "lucide-react"
import ChatPage from "../../../chat/components/Chat"
export default function AdminDashboard() {
    const [currentHour, setCurrentHour] = useState("");

    useEffect(() => {
        const now = new Date();
        const hour = now.getHours().toString().padStart(2, '0') + ":00";
        setCurrentHour(hour);

        const interval = setInterval(() => {
            const now = new Date();
            const hour = now.getHours().toString().padStart(2, '0') + ":00";
            setCurrentHour(hour);
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {/* Left Column (Main Content) */}
            <div className="md:col-span-2 space-y-4">

                <Card>
                    <CardHeader>
                        <CardTitle>Statistic</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
                            <div className="space-y-1">
                                <Users className="mx-auto text-cyan-500" />
                                <p className="text-lg font-semibold">212</p>
                                <p className="text-sm text-muted-foreground">Patients</p>
                            </div>
                            <div className="space-y-1">
                                <FileText className="mx-auto text-blue-500" />
                                <p className="text-lg font-semibold">114</p>
                                <p className="text-sm text-muted-foreground">Reports</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* Redesigned Schedule */}
                <Card>
                    <CardHeader>
                        <CardTitle>Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <div className="min-w-[770px] grid grid-cols-[80px_repeat(11,minmax(80px,1fr))] text-xs md:text-sm">
                                {/* Time Header Row */}
                                <div className="bg-white"></div>
                                {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"].map((h) => (
                                    <div
                                        key={h}
                                        className={`relative text-center font-semibold py-2 border-b border-gray-200 ${
                                            currentHour === h ? "text-blue-600" : "text-muted-foreground"
                                        }`}
                                    >
                                        {h}
                                        {currentHour === h && (
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-1 h-8 bg-blue-500 rounded-full shadow" />
                                        )}
                                    </div>
                                ))}

                                {/* Schedule Rows */}
                                {[
                                    {
                                        day: "Tues",
                                        blocks: [
                                            { label: "Monitoring", time: "09:00", color: "bg-blue-100 text-blue-800 border-blue-200" },
                                            { label: "Appointment", time: "10:00", color: "bg-pink-100 text-pink-800 border-pink-200" }
                                        ]
                                    },
                                    {
                                        day: "Thurs",
                                        blocks: [
                                            { label: "Meeting", time: "09:00", color: "bg-green-100 text-green-800 border-green-200" },
                                            { label: "Appointment", time: "10:00", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
                                            { label: "Prize", time: "12:00", color: "bg-purple-100 text-purple-800 border-purple-200" },
                                            { label: "Meeting", time: "13:00", color: "bg-orange-100 text-orange-800 border-orange-200" }
                                        ]
                                    },
                                    {
                                        day: "Satur",
                                        blocks: [
                                            { label: "Discussion", time: "09:00", color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
                                            { label: "Appointment", time: "10:00", color: "bg-red-100 text-red-800 border-red-200" },
                                            { label: "Offline session", time: "16:00", color: "bg-teal-100 text-teal-800 border-teal-200" },
                                            { label: "Offline session", time: "17:00", color: "bg-teal-100 text-teal-800 border-teal-200" },
                                            { label: "Offline session", time: "18:00", color: "bg-teal-100 text-teal-800 border-teal-200" },
                                            { label: "Offline session", time: "19:00", color: "bg-teal-100 text-teal-800 border-teal-200" }
                                        ]
                                    }
                                ].map(({ day, blocks }) => (
                                    <React.Fragment key={day}>
                                        <div className="font-bold flex items-center justify-center bg-gray-50 border-b border-gray-200 py-2">
                                            {day}
                                        </div>
                                        {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"].map((slot, i) => {
                                            const item = blocks.find(b => b.time === slot);
                                            return item ? (
                                                <div
                                                    key={i}
                                                    className={`p-2 m-1 text-center rounded-lg border font-medium shadow-sm transition-colors duration-150 ${item.color || "bg-gray-100 text-gray-700 border-gray-200"}`}
                                                >
                                                    {item.label}
                                                </div>
                                            ) : (
                                                <div key={i} className="p-2"></div>
                                            );
                                        })}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* Appointments */}
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable data={data} />
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Dr Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <button className="border-2xl">
                            Initial Report
                            
                        </button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Last Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p>Tom Curtis made an appointment <span className="text-muted-foreground">(16.09.21 @ 12:00)</span></p>
                        <p>Betty Jackson made an appointment <span className="text-muted-foreground">(15.09.21 @ 10:00)</span></p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Message</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center text-center text-4xl font-bold text-green-600 ">
                            <div className="w-full max-w-[700px] max-h-[725px] overflow-y-auto ">
                                <ChatPage className=" max-h-[800px]"/>
                            </div>
                    </CardContent>
                </Card>
            
                
            </div>
        </div>
    )
}