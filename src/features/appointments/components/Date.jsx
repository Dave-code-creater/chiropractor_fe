// src/features/appointments/components/Date.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// ——————————————————————————————————————————————
// Mock “server” data: already booked slots
// Replace this with your real API fetch later
const mockBookedAppointments = [
    { date: new Date(2025, 5, 24), time: "09:00" }, // June 24, 2025 @09:00
    { date: new Date(2025, 5, 26), time: "10:00" }, // June 26, 2025 @10:00
    { date: new Date(2025, 5, 28), time: "12:00" }, // June 28, 2025 @12:00
];
// ——————————————————————————————————————————————

// Helper: compare two dates by year/month/day only
function sameDay(a, b) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

export default function DateSelector({ bookingData, updateBookingData }) {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [date, setDate] = useState(bookingData.date || null);

    // sync date back up
    useEffect(() => {
        if (
            date &&
            (!bookingData.date || date.getTime() !== new Date(bookingData.date).getTime())
        ) {
            updateBookingData({ date, time: null });
        }
    }, [date, bookingData.date, updateBookingData]);

    // Determine which base times apply
    const timesWeek = useMemo(
        () => ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
        []
    );
    const timesSat = useMemo(() => ["10:00", "11:00", "12:00", "13:00", "14:00"], []);

    const day = date?.getDay();
    const availableTimes = useMemo(() => {
        if (day === 2 || day === 4) return timesWeek;    // Tue or Thu
        if (day === 6) return timesSat;                // Sat
        return [];
    }, [day, timesWeek, timesSat]);

    // Filter mock bookings for the currently selected date
    const bookingsForDate = useMemo(
        () =>
            date
                ? mockBookedAppointments.filter((b) => sameDay(b.date, date))
                : [],
        [date]
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-semibold mb-1">Select Appointment</h2>
                <p className="text-muted-foreground">
                    Pick a date, then select a time slot
                </p>
            </div>

            {/* Calendar popover */}
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select a date"}
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    side="bottom"
                    align="center"
                    className="[min-width:var(--radix-popover-trigger-width)] p-0"
                    onCloseAutoFocus={(e) => e.preventDefault()}
                >
                    <div className="flex justify-center p-4">
                        <Calendar
                            initialFocus
                            mode="single"
                            selected={date}
                            onSelect={(d) => {
                                setDate(d);
                                setIsCalendarOpen(false);
                            }}
                            defaultMonth={date || undefined}
                            disabled={[
                                { before: new Date() },
                                { daysOfWeek: [0, 1, 3, 5] }, // only Tue/Thu/Sat
                            ]}
                        />
                    </div>
                </PopoverContent>
            </Popover>

            {/* Time slots */}
            {availableTimes.length > 0 && (
                <div className="space-y-2">
                    <div className="text-sm font-medium">Available Times</div>
                    <div className="grid grid-cols-3 gap-2">
                        {availableTimes.map((t) => {
                            const isBooked = bookingsForDate.some((b) => b.time === t);
                            return (
                                <button
                                    key={t}
                                    disabled={isBooked}
                                    onClick={() => updateBookingData({ time: t })}
                                    className={cn(
                                        "px-3 py-2 rounded-md border transition-all text-center",
                                        isBooked
                                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                            : bookingData.time === t
                                                ? "bg-indigo-500 text-white border-indigo-500"
                                                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                                    )}
                                >
                                    {t} {isBooked && "(Booked)"}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}