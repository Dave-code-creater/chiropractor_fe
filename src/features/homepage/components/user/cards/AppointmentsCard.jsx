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
        <Card className="h-full border-0 shadow-lg bg-gradient-to-br from-card to-muted/20 hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] backdrop-blur-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <CalendarDays className="w-4 h-4 text-primary" />
                    </div>
                    Upcoming Appointment
                </CardTitle>
            </CardHeader>
            {!rescheduling ? (
                <CardContent className="space-y-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : appointments.length > 0 ? (
                        appointments.map((appt) => (
                            <div key={appt.id || appt.date} className="space-y-3 p-4 rounded-lg bg-background/50 border border-border/50">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                                        <AvatarImage src={appt.doctorImage || '/avatars/1.png'} />
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {appt.doctorName ? appt.doctorName[0] : 'D'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-foreground">{appt.doctorName || 'Doctor'}</p>
                                        {appt.specialty && (
                                            <p className="text-xs text-muted-foreground">{appt.specialty}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    {appt.date && (
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-foreground">Date:</span>
                                            <span className="text-muted-foreground">{appt.date}</span>
                                        </div>
                                    )}
                                    {appt.time && (
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-foreground">Time:</span>
                                            <span className="text-muted-foreground">{appt.time}</span>
                                            {appt.duration && (
                                                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">⏱ {appt.duration}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {appt.location && (
                                    <div className="pt-2 border-t border-border/50">
                                        <p className="text-xs font-medium text-muted-foreground mb-1">Location</p>
                                        <p className="text-sm text-foreground">{appt.location}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <div className="p-4 rounded-full bg-muted/50 mb-4">
                                <CalendarDays className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <p className="text-sm text-muted-foreground">No appointment exist.</p>
                        </div>
                    )}
                </CardContent>
            ) : (
                <CardContent className="space-y-4">
                    <Calendar />
                    <div className="flex justify-between">
                        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                        <button onClick={() => setRescheduling(false)} className="text-sm text-primary hover:text-primary/80 transition-colors">
                            Back
                        </button>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}