// src/features/appointments/components/DoctorSelector.jsx
"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// list of practitioners
const doctors = [
    {
        value: "dr-emily-smith",
        name: "Dr. Emily Smith",
        service: "Chiropractor",
    },
    {
        value: "dr-robert-jones",
        name: "Dr. Robert Jones",
        service: "Physical Therapist",
    },
    {
        value: "dr-maria-garcia",
        name: "Dr. Maria Garcia",
        service: "Sports Medicine Specialist",
    },
    // …add more as needed
];

export default function DoctorSelector({ bookingData, updateBookingData }) {
    const [open, setOpen] = useState(false);
    const selectedKey = bookingData.doctor;
    const selectedDoc = doctors.find((d) => d.value === selectedKey);

    const handleSelect = (value) => {
        updateBookingData({ doctor: value });
        setOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* header */}
            <div>
                <h2 className="text-xl font-semibold mb-1">Select Your Provider</h2>
                <p className="text-muted-foreground">
                    Choose the practitioner you’d like to book with.
                </p>
            </div>

            {/* dropdown */}
            <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            id="provider"
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                        >
                            {selectedDoc ? selectedDoc.name : "Select a provider"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent
                        side="bottom"
                        align="start"
                        className="[min-width:var(--radix-popover-trigger-width)] p-0"
                    >
                        <Command>
                            <CommandInput
                                className="w-full"
                                placeholder="Search provider..."
                            />
                            <CommandList>
                                <CommandEmpty>No provider found.</CommandEmpty>
                                <CommandGroup>
                                    {doctors.map((doc) => (
                                        <CommandItem
                                            key={doc.value}
                                            value={doc.value}
                                            onSelect={handleSelect}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedKey === doc.value
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                            {doc.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            {/* selected doctor info */}
            {selectedDoc && (
                <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-medium">Provider Details</h3>
                    </div>
                    <div className="grid gap-2">
                        <div>
                            <div className="text-sm text-muted-foreground">Name</div>
                            <div>{selectedDoc.name}</div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">Service</div>
                            <Badge variant="outline">{selectedDoc.service}</Badge>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}