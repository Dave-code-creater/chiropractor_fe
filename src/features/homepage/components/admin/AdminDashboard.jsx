import data from "@/app/dashboard/data.json"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import React from "react"
import { useState, useEffect } from "react"
import { Users, FileText, MessageSquare, Smile } from "lucide-react"
import ScheduleGrid from "./ScheduleGrid"
export default function AdminDashboard() {
    const [currentHour, setCurrentHour] = useState("");

    useEffect(() => {
        const updateHour = () => {
            const now = new Date();
            setCurrentHour(now.getHours().toString().padStart(2, "0") + ":00");
        };

        updateHour();
        const interval = setInterval(updateHour, 60000); // Update every minute
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
                        <ScheduleGrid currentHour={currentHour} />
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