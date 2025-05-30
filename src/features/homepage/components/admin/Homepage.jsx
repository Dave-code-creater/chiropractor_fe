import data from "@/app/dashboard/data.json"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import React from "react"
import { useState, useEffect } from "react"
import { Users, FileText, MessageSquare, Smile } from "lucide-react"
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
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
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
                            <div className="space-y-1">
                                <MessageSquare className="mx-auto text-purple-500" />
                                <p className="text-lg font-semibold">182</p>
                                <p className="text-sm text-muted-foreground">Consultations</p>
                            </div>
                            <div className="space-y-1">
                                <Smile className="mx-auto text-pink-500" />
                                <p className="text-lg font-semibold">127</p>
                                <p className="text-sm text-muted-foreground">Experience</p>
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
                            <div className="grid grid-cols-[60px_repeat(7,minmax(100px,1fr))] text-sm">
                                <div></div>
                                {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"].map((h) => (
                                    <div key={h} className="relative text-center font-medium text-muted-foreground">
                                        {h}
                                        {currentHour === h && (
                                            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-1 h-24 bg-black rounded-full" />
                                        )}
                                    </div>
                                ))}

                                {[
                                    {
                                        day: "Mon",
                                        blocks: [
                                            { label: "Monitoring", time: "08:00", color: "bg-blue-100 text-blue-800" },
                                            { label: "Appointment", time: "10:00", color: "bg-pink-100 text-pink-800" }
                                        ]
                                    },
                                    {
                                        day: "Tue",
                                        blocks: [
                                            { label: "Meeting", time: "08:00" },
                                            { label: "Appointment", time: "09:00" },
                                            { label: "Prize", time: "11:00" },
                                            { label: "Meeting", time: "13:00" }
                                        ]
                                    },
                                    {
                                        day: "Wed",
                                        blocks: [
                                            { label: "Discussion", time: "08:00" },
                                            { label: "Appointment", time: "10:00" },
                                            { label: "Offline session", time: "13:00" }
                                        ]
                                    }
                                ].map(({ day, blocks }) => (
                                    <React.Fragment key={day}>
                                        <div className="font-medium flex items-center">{day}</div>
                                        {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"].map((slot, i) => {
                                            const item = blocks.find(b => b.time === slot);
                                            return item ? (
                                                <div key={i} className={`p-2 text-center rounded ${item.color || "bg-gray-100"}`}>
                                                    {item.label}
                                                </div>
                                            ) : (
                                                <div key={i}></div>
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

            {/* Right Sidebar */}
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Calendar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Calendar mode="single" selected={new Date()} className="rounded-md border" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-4xl font-bold text-green-600">
                        80%
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
            </div>
        </div>
    )
}