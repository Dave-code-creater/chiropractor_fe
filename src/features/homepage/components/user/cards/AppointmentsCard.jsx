import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * Shows upcoming appointment information with ability to reschedule.
 */
export default function AppointmentsCard() {
    const [rescheduling, setRescheduling] = useState(false);

    return (
        <Card className="col-span-3 col-start-1 row-span-4 row-start-2">
            <CardHeader>
                <CardTitle className="text-sm">Appointments</CardTitle>
            </CardHeader>
            {!rescheduling ? (
                <CardContent className="space-y-3 text-sm text-gray-700">
                    {/* Doctor Info */}
                    <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="/avatars/1.png" />
                            <AvatarFallback>RE</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">Dr Ramadi Entersiliokaz</p>
                            <p className="text-xs text-gray-500">Gastroenterologist</p>
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div>
                        <p><strong>Date:</strong> Friday 17 May, 2020</p>
                        <p className="flex items-center gap-2">
                            <strong>Time:</strong> 9:30am - 10:00am <span className="text-xs text-blue-500">⏱ 30mins</span>
                        </p>
                    </div>

                    {/* Address & Interests */}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <p className="font-medium text-xs text-gray-500">Address</p>
                            <p>Suite 405, Level 4/188<br />Edward St, Sydney<br />NSW</p>
                        </div>
                        <div>
                            <p className="font-medium text-xs text-gray-500">Areas of Interest</p>
                            <ul className="list-disc list-inside text-sm">
                                <li>Mens health</li>
                                <li>Travel medicine</li>
                                <li>Travel advice</li>
                                <li>General practice</li>
                            </ul>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between pt-4">
                        <button className="text-sm text-gray-600 hover:underline">Cancel Booking</button>
                        <button onClick={() => setRescheduling(true)} className="text-sm text-blue-500 hover:underline">
                            Reschedule
                        </button>
                    </div>
                </CardContent>
            ) : (
                <CardContent className="flex flex-col justify-between">
                    <div className="flex-1 flex flex-col items-center justify-center h-full">
                        <Calendar />
                    </div>
                    <div className="flex justify-between py-4">
                        <button className="text-sm text-gray-600 hover:underline">Cancel Booking</button>
                        <button onClick={() => setRescheduling(false)} className="text-sm text-blue-500 hover:underline">
                            Back
                        </button>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
