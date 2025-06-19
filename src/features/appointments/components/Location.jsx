// src/features/appointments/components/LocationSelector.jsx
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

// your list of clinic locations
const locations = [
    { value: "colorado-denver", label: "Colorado (Denver)" },
    // add more if needed:
    // { value: "new-york",      label: "New York" },
];

// map from location.value → Google-Maps embed URL
const mapEmbeds = {
    "colorado-denver":
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.6073091246165!2d-105.01387722423165!3d39.70335607157403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876c7eabc151aa0d%3A0x4ccaf1c8b3969739!2s1385%20W%20Alameda%20Ave%2C%20Denver%2C%20CO%2080223!5e0!3m2!1sen!2sus!4v1716832445696!5m2!1sen!2sus",
    // "new-york": "https://www.google.com/maps/embed?pb=…",
};

export default function LocationSelector({ bookingData, updateBookingData }) {
    const [open, setOpen] = useState(false);
    const selected = bookingData.location;

    const handleSelect = (value) => {
        updateBookingData({ location: value });
        setOpen(false);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-4">Select clinic location</h2>
                <p className="text-muted-foreground mb-6">
                    Choose your preferred clinic for appointment.
                </p>
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {selected
                            ? locations.find((loc) => loc.value === selected)?.label
                            : "Select clinic location"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    side="bottom"
                    align="start"
                    className="[min-width:var(--radix-popover-trigger-width)] p-0"
                >
                    <Command>
                        <CommandInput className="w-full" placeholder="Search location..." />
                        <CommandList>
                            <CommandEmpty>No location found.</CommandEmpty>
                            <CommandGroup>
                                {locations.map((loc) => (
                                    <CommandItem key={loc.value} value={loc.value} onSelect={handleSelect}>
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selected === loc.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {loc.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* only render the map when a location is chosen */}
            {selected && mapEmbeds[selected] && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-indigo-700 mb-2">
                        📍 Location Map
                    </h3>
                    <div className="w-full h-64 rounded-lg overflow-hidden border border-indigo-200 shadow-sm">
                        <iframe
                            title="Chiropractic Clinic Location"
                            src={mapEmbeds[selected]}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}