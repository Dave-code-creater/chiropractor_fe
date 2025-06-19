// src/features/appointments/components/DoctorSelector.jsx
"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

// your list of providers
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
    // …add more providers here
];

export default function DoctorSelector({ bookingData, updateBookingData }) {
    const [open, setOpen] = useState(false);
    const selectedKey = bookingData.doctor; // e.g. "dr-emily-smith"
    const selectedDoc = doctors.find((d) => d.value === selectedKey);

    const handleSelect = (value) => {
        updateBookingData({ doctor: value });
        setOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* Title */}
            <div>
                <h2 className="text-xl font-semibold mb-2">Select Your Provider</h2>
                <p className="text-muted-foreground">
                    Choose the practitioner you’d like to book with.
                </p>
            </div>

            {/* Dropdown */}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
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
                        <CommandInput className="w-full" placeholder="Search provider..." />
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
                                                selectedKey === doc.value ? "opacity-100" : "opacity-0"
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

            {/* Render doctor info once one is selected */}
            {selectedDoc && (
                <div className="mt-8 space-y-2">
                    <h3 className="text-lg font-semibold text-indigo-700">
                        👤 {selectedDoc.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                        Service: <span className="font-medium">{selectedDoc.service}</span>
                    </p>
                </div>
            )}
        </div>
    );
}