import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AppointmentsCard() {
    const [rescheduling, setRescheduling] = useState(false);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-base font-semibold">Upcoming Appointment</CardTitle>
            </CardHeader>
            {!rescheduling ? (
                <CardContent className="space-y-4 text-sm text-gray-700">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="/avatars/1.png" />
                            <AvatarFallback>RE</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">Dr Ramadi Entersiliokaz</p>
                            <p className="text-xs text-gray-500">Gastroenterologist</p>
                        </div>
                    </div>
                    <div>
                        <p><strong>Date:</strong> Friday 17 May, 2020</p>
                        <p><strong>Time:</strong> 9:30am – 10:00am <span className="text-xs text-blue-600">⏱ 30mins</span></p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500">Location</p>
                        <p className="text-sm">Suite 405, Level 4/188 Edward St, Sydney, NSW</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500">Areas of Interest</p>
                        <ul className="list-disc list-inside text-sm">
                            <li>Mens health</li>
                            <li>Travel medicine</li>
                            <li>Travel advice</li>
                            <li>General practice</li>
                        </ul>
                    </div>
                    <div className="flex justify-between pt-4">
                        <button className="text-sm text-red-500 hover:underline">Cancel</button>
                        <button onClick={() => setRescheduling(true)} className="text-sm text-blue-600 hover:underline">
                            Reschedule
                        </button>
                    </div>
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