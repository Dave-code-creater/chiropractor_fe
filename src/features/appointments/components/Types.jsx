// src/features/appointments/components/DoctorSelector.jsx
"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, User } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DoctorSelector({ bookingData, updateBookingData, doctors = [] }) {
    const [open, setOpen] = useState(false);
    const selectedDoctorId = bookingData.doctor;

    // Find the selected doctor
    const selectedDoctor = doctors.find((doc) => doc.id === selectedDoctorId);

    const handleSelect = (doctorId) => {
        updateBookingData({ doctor: doctorId });
        setOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-semibold mb-1">Select Healthcare Provider</h2>
                <p className="text-muted-foreground">
                    Choose your preferred doctor for this appointment
                </p>
            </div>

            {/* Doctor Selection */}
            <div className="space-y-3">
                <Label htmlFor="doctor-select" className="text-sm font-medium">
                    Available Doctors
                </Label>
                
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            id="doctor-select"
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between h-auto p-4"
                        >
                            {selectedDoctor ? (
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={selectedDoctor.profileImage} />
                                        <AvatarFallback>
                                            {selectedDoctor.firstName?.[0]}{selectedDoctor.lastName?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-left">
                                        <div className="font-medium">
                                            Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {selectedDoctor.specializations?.primary || selectedDoctor.specialization}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <User className="h-4 w-4" />
                                    Select a doctor...
                                </div>
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    
                    <PopoverContent className="w-full p-0" align="start">
                        <Command>
                            <CommandInput className="w-full" placeholder="Search doctors..." />
                            <CommandList>
                                <CommandEmpty>No doctors found.</CommandEmpty>
                                <CommandGroup>
                                    {doctors.map((doctor) => (
                                        <CommandItem
                                            key={doctor.id}
                                            value={`${doctor.firstName} ${doctor.lastName} ${doctor.specializations?.primary || doctor.specialization}`}
                                            onSelect={() => handleSelect(doctor.id)}
                                            className="p-3 cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3 w-full">
                                                <Check
                                                    className={cn(
                                                        "h-4 w-4",
                                                        selectedDoctorId === doctor.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={doctor.profileImage} />
                                                    <AvatarFallback>
                                                        {doctor.firstName?.[0]}{doctor.lastName?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="font-medium">
                                                        Dr. {doctor.firstName} {doctor.lastName}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {doctor.specializations?.primary || doctor.specialization}
                                                    </div>
                                                    {doctor.yearsOfExperience && (
                                                        <div className="text-xs text-muted-foreground">
                                                            {doctor.yearsOfExperience} years experience
                                                        </div>
                                                    )}
                                                </div>
                                                {doctor.rating && (
                                                    <div className="text-sm">
                                                        ⭐ {doctor.rating}
                                                    </div>
                                                )}
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Selected Doctor Details */}
            {selectedDoctor && (
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-16 w-16 border-2 border-primary/20">
                                    <AvatarImage src={selectedDoctor.profileImage} />
                                    <AvatarFallback className="text-lg">
                                        {selectedDoctor.firstName?.[0]}{selectedDoctor.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                
                                <div className="flex-1 space-y-2">
                                    <div>
                                        <h3 className="text-lg font-semibold text-primary">
                                            Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedDoctor.specializations?.primary || selectedDoctor.specialization}
                                        </p>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        {selectedDoctor.yearsOfExperience && (
                                            <Badge variant="secondary">
                                                {selectedDoctor.yearsOfExperience} years experience
                                            </Badge>
                                        )}
                                        {selectedDoctor.rating && (
                                            <Badge variant="secondary">
                                                ⭐ {selectedDoctor.rating} rating
                                            </Badge>
                                        )}
                                        {selectedDoctor.languages?.length > 0 && (
                                            <Badge variant="outline">
                                                {selectedDoctor.languages.join(", ")}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Specializations */}
                            {selectedDoctor.specializations?.specializations?.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium mb-2">Specializations:</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedDoctor.specializations.specializations.map((spec, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {spec}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Certifications */}
                            {selectedDoctor.specializations?.certifications?.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium mb-2">Certifications:</h4>
                                    <div className="space-y-1">
                                        {selectedDoctor.specializations.certifications.map((cert, index) => (
                                            <div key={index} className="text-sm text-muted-foreground flex items-center gap-1">
                                                <Check className="h-3 w-3 text-primary" />
                                                {cert}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Education */}
                            {selectedDoctor.education?.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium mb-2">Education:</h4>
                                    <div className="space-y-1">
                                        {selectedDoctor.education.map((edu, index) => (
                                            <div key={index} className="text-sm text-muted-foreground">
                                                <div className="font-medium">{edu.degree}</div>
                                                <div>{edu.institution} ({edu.year})</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Appointment Type Selection */}
            <div className="space-y-3">
                <Label className="text-sm font-medium">Appointment Type</Label>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { value: "initial", label: "Initial Consultation", description: "First visit or new condition" },
                        { value: "follow_up", label: "Follow-up", description: "Continuing treatment" },
                        { value: "emergency", label: "Emergency", description: "Urgent care needed" },
                        { value: "consultation", label: "Consultation", description: "Second opinion or advice" }
                    ].map((type) => (
                        <Card
                            key={type.value}
                            className={cn(
                                "cursor-pointer border-2 transition-all",
                                bookingData.type === type.value
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                            )}
                            onClick={() => updateBookingData({ type: type.value })}
                        >
                            <CardContent className="p-4">
                                <div className="text-sm font-medium">{type.label}</div>
                                <div className="text-xs text-muted-foreground mt-1">{type.description}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}