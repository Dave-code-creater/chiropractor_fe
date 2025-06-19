// src/features/appointments/components/BookingSummary.jsx
"use client";

import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    Calendar as CalendarIcon,
    User as UserIcon,
} from "lucide-react";

export default function BookingSummary({ bookingData = {} }) {
    // 1) pull the right fields
    const {
        location, // your selected clinic
        date,
        time,
        doctor,
    } = bookingData;

    // 2) map your clinic keys → labels
    const locations = [
        { value: "colorado-denver", label: "Colorado (Denver)" },
        // …etc
    ];
    const getLocationLabel = (val) =>
        locations.find((l) => l.value === val)?.label || val;

    // 3) providers lookup (same as in DoctorSelector)
    const providers = [
        { value: "dr-emily-smith", name: "Dr. Emily Smith", service: "Chiropractor" },
        { value: "dr-robert-jones", name: "Dr. Robert Jones", service: "Physical Therapist" },
        { value: "dr-maria-garcia", name: "Dr. Maria Garcia", service: "Sports Medicine Specialist" },
    ];
    const selectedDoc = providers.find((p) => p.value === doctor);

    return (
        <div className="space-y-6">
            {/* Clinic Location */}
            {location && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-medium">Clinic</h3>
                    </div>
                    <div>{getLocationLabel(location)}</div>
                </div>
            )}

            {/* Appointment */}
            {date && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-medium">Appointment</h3>
                    </div>
                    <div className="grid gap-2">
                        <div>
                            <div className="text-sm text-muted-foreground">Date</div>
                            <div>{format(date, "EEE, MMM d, yyyy")}</div>
                        </div>
                        {time && (
                            <div>
                                <div className="text-sm text-muted-foreground">Time</div>
                                <Badge variant="outline">{time}</Badge>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Provider */}
            {selectedDoc && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <UserIcon className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-medium">Provider</h3>
                    </div>
                    <div className="grid gap-2">
                        <div>
                            <div className="text-sm text-muted-foreground">Name</div>
                            <div>{selectedDoc.name}</div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">Service</div>
                            <div>{selectedDoc.service}</div>
                        </div>
                    </div>
                </div>
            )}

            <Separator />
        </div>
    );
}