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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DoctorSelector({
  bookingData,
  updateBookingData,
  doctors = [],
  isLoading = false,
  isError = false,
  error = null,
}) {
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
        <h2 className="text-xl font-semibold mb-1">
          Select Healthcare Provider
        </h2>
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
              className="w-full justify-between h-12 p-4 text-base"
            >
              {selectedDoctor ? (
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedDoctor.profileImage} />
                    <AvatarFallback>
                      {selectedDoctor.firstName?.[0]}
                      {selectedDoctor.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="font-medium">
                      Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedDoctor.specializations?.primary ||
                        selectedDoctor.specialization}
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

          <PopoverContent 
            className="w-[var(--radix-popover-trigger-width)] p-0" 
            align="start" 
            side="bottom" 
            sideOffset={8}
            avoidCollisions={true}
            collisionPadding={20}
          >
            <Command className="w-full">
              <CommandInput
                className="w-full h-12 text-base"
                placeholder="Search by name, specialization, certification, language..."
              />
              <CommandList className="max-h-[400px]">
                <CommandEmpty className="py-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="text-sm text-muted-foreground">Loading available doctors...</p>
                      </>
                    ) : isError ? (
                      <>
                        <User className="h-8 w-8 text-red-500" />
                        <p className="text-sm text-muted-foreground">Unable to load doctors</p>
                        <p className="text-xs text-muted-foreground">
                          {error?.status === 500 ? 'Backend server unavailable' : 
                           error?.status === 404 ? 'Doctors endpoint not found' :
                           'Please check your connection and try again'}
                        </p>
                        <p className="text-xs text-blue-600 mt-2">
                          Check console for detailed error information
                        </p>
                      </>
                    ) : (
                      <>
                        <User className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">No doctors found.</p>
                        <p className="text-xs text-muted-foreground">Try searching by name, specialization, or certification</p>
                      </>
                    )}
                  </div>
                </CommandEmpty>
                <CommandGroup>
                  {doctors.map((doctor) => {
                    // Create comprehensive search string including all doctor information
                    const searchString = [
                      doctor.firstName,
                      doctor.lastName,
                      doctor.specializations?.primary || doctor.specialization,
                      doctor.specializations?.specializations?.join(' '),
                      doctor.specializations?.certifications?.join(' '),
                      doctor.languages?.join(' '),
                      doctor.education?.map(edu => `${edu.degree} ${edu.institution}`).join(' '),
                      doctor.email,
                      'chiropractor', // Default searchable term
                      'doctor',
                      'dr'
                    ].filter(Boolean).join(' ').toLowerCase();

                    return (
                      <CommandItem
                        key={doctor.id}
                        value={searchString}
                        onSelect={() => handleSelect(doctor.id)}
                        className="p-4 cursor-pointer hover:bg-muted/50 border-b border-border/50 last:border-b-0"
                      >
                        <div className="flex items-center gap-4 w-full">
                          <Check
                            className={cn(
                              "h-4 w-4 flex-shrink-0",
                              selectedDoctorId === doctor.id
                                ? "opacity-100 text-primary"
                                : "opacity-0",
                            )}
                          />
                          <Avatar className="h-12 w-12 flex-shrink-0 border-2 border-border">
                            <AvatarImage src={doctor.profileImage} />
                            <AvatarFallback className="text-sm font-medium">
                              {doctor.firstName?.[0]}
                              {doctor.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="font-semibold text-base truncate">
                                Dr. {doctor.firstName} {doctor.lastName}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground truncate">
                              {doctor.specializations?.primary || doctor.specialization}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              {doctor.languages?.length > 0 && (
                                <span className="flex items-center gap-1">
                                  <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                                  {doctor.languages.slice(0, 2).join(', ')}
                                  {doctor.languages.length > 2 && ` +${doctor.languages.length - 2}`}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CommandItem>
                    );
                  })}
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
                    {selectedDoctor.firstName?.[0]}
                    {selectedDoctor.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">
                      Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedDoctor.specializations?.primary ||
                        selectedDoctor.specialization}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
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
                    {selectedDoctor.specializations.specializations.map(
                      (spec, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {spec}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {selectedDoctor.specializations?.certifications?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Certifications:</h4>
                  <div className="space-y-1">
                    {selectedDoctor.specializations.certifications.map(
                      (cert, index) => (
                        <div
                          key={index}
                          className="text-sm text-muted-foreground flex items-center gap-1"
                        >
                          <Check className="h-3 w-3 text-primary" />
                          {cert}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Education */}
              {selectedDoctor.education?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Education:</h4>
                  <div className="space-y-1">
                    {selectedDoctor.education.map((edu, index) => (
                      <div
                        key={index}
                        className="text-sm text-muted-foreground"
                      >
                        <div className="font-medium">{edu.degree}</div>
                        <div>
                          {edu.institution} ({edu.year})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
