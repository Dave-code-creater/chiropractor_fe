import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays } from "lucide-react";
import { useListAppointmentsQuery } from "@/services/appointmentApi";

export default function AppointmentsCard() {
    const [rescheduling, setRescheduling] = useState(false);
    const { data, isLoading } = useListAppointmentsQuery();
    const appointments = data?.metadata ?? data ?? [];

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-base font-semibold">Upcoming Appointment</CardTitle>
            </CardHeader>
            {!rescheduling ? (
                <CardContent className="space-y-4 text-sm text-gray-700">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : appointments.length > 0 ? (
                        appointments.map((appt) => (
                            <div key={appt.id || appt.date} className="mb-4 space-y-1">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={appt.doctorImage || '/avatars/1.png'} />
                                        <AvatarFallback>
                                            {appt.doctorName ? appt.doctorName[0] : 'D'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{appt.doctorName || 'Doctor'}</p>
                                        {appt.specialty && (
                                            <p className="text-xs text-gray-500">{appt.specialty}</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    {appt.date && <p><strong>Date:</strong> {appt.date}</p>}
                                    {appt.time && (
                                        <p>
                                            <strong>Time:</strong> {appt.time}
                                            {appt.duration && (
                                                <span className="text-xs text-blue-600"> ⏱ {appt.duration}</span>
                                            )}
                                        </p>
                                    )}
                                </div>
                                {appt.location && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500">Location</p>
                                        <p className="text-sm">{appt.location}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-sm text-muted-foreground py-6">
                            <CalendarDays className="w-6 h-6 mb-2 text-gray-400" />
                            No appointment exist.
                        </div>
                    )}
                </CardContent>
            ) : (
                <CardContent className="space-y-4">
                    <Calendar />
                    <div className="flex justify-between">
                        <button className="text-sm text-gray-500 hover:underline">Cancel</button>
                        <button onClick={() => setRescheduling(false)} className="text-sm text-blue-600 hover:underline">
                            Back
                        </button>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}