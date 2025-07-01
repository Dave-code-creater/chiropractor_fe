// src/features/appointments/components/LocationSelector.jsx
"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, MapPin, User, Clock } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CLINIC_LOCATIONS, getLocationByValue } from "@/constants/clinicLocations";

export default function LocationSelector({
  bookingData,
  updateBookingData,
  selectedDoctor,
}) {
  const [open, setOpen] = useState(false);
  const selected = bookingData.location;
  const selectedLocationData = getLocationByValue(selected);

  const handleSelect = (value) => {
    updateBookingData({ location: value });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Doctor Info */}
      <div>
        <h2 className="text-xl font-semibold mb-1">Select Location</h2>
        <p className="text-muted-foreground">
          Choose your preferred clinic location
          {selectedDoctor && (
            <span className="ml-1">
              for your appointment with{" "}
              <span className="font-medium text-foreground">
                Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
              </span>
            </span>
          )}
        </p>
      </div>

      {/* Selected Doctor Card */}
      {selectedDoctor && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-green-900">
                  Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                </h4>
                <p className="text-sm text-green-700">
                  {selectedDoctor.specializations?.primary}
                </p>
                
              </div>
              <div className="text-right">
                <p className="text-sm text-green-700">Available at</p>
                <p className="text-xs text-green-600">all locations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Location Selector */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Choose Clinic Location</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between h-12"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                {selected
                  ? getLocationByValue(selected)?.label
                  : "Select clinic location"}
              </div>
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
                placeholder="Search location..."
              />
              <CommandList>
                <CommandEmpty>No location found.</CommandEmpty>
                <CommandGroup>
                  {CLINIC_LOCATIONS.map((loc) => (
                    <CommandItem
                      key={loc.value}
                      value={loc.value}
                      onSelect={handleSelect}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected === loc.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <div>
                        <div className="font-medium">{loc.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {loc.address}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Selected Location Details */}
      {selectedLocationData && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5 text-blue-600" />
              {selectedLocationData.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Address</p>
                <p className="text-sm text-blue-700">
                  {selectedLocationData.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Hours</p>
                <p className="text-sm text-blue-700">
                  {selectedLocationData.hours}
                </p>
              </div>
            </div>

            {selectedDoctor && (
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Your Doctor
                  </p>
                  <p className="text-sm text-blue-700">
                    Dr. {selectedDoctor.firstName} {selectedDoctor.lastName} -{" "}
                    {selectedDoctor.specializations?.primary}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Map */}
      {selected && selectedLocationData?.mapEmbed && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Location Map
          </h3>
          <div className="w-full h-64 rounded-lg overflow-hidden border border-border shadow-sm">
            <iframe
              title="Chiropractic Clinic Location"
              src={selectedLocationData.mapEmbed}
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

      {/* Location Benefits */}
      {selectedLocationData && (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Location Benefits:
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              {selectedLocationData.features?.map((feature, index) => (
                <li key={index}>• {feature}</li>
              ))}
              {selectedDoctor && (
                <li>
                  • Dr. {selectedDoctor.lastName} available at this location
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
