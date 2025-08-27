// src/features/appointments/components/BookingSummary.jsx
"use client";

import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getLocationByValue } from "@/constants/clinicLocations";

export default function BookingSummary({ bookingData, doctors = [] }) {
  const selectedDoctor = doctors.find((doc) => doc.id === bookingData.doctor);

  const formatDate = (date) => {
    if (!date) return "Not selected";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "Not selected";
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getLocationDetails = (locationValue) => {
    return getLocationByValue(locationValue);
  };

  const isEmpty =
    !bookingData.doctor &&
    !bookingData.location &&
    !bookingData.date &&
    !bookingData.time;

  if (isEmpty) {
    return (
      <div className="text-center py-4 sm:py-8 text-foreground/60">
        <CalendarDays className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 opacity-50" />
        <p className="text-xs sm:text-sm">
          Your appointment details will appear here as you make selections.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-4">
      {/* Doctor - First in the flow */}
      {selectedDoctor && (
        <div className="flex items-start gap-2 sm:gap-3">
          <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="flex-1 space-y-1 sm:space-y-2">
            <p className="font-medium text-xs sm:text-sm">Healthcare Provider</p>
            <div className="flex items-center gap-2 sm:gap-3">
              <Avatar className="h-6 w-6 sm:h-10 sm:w-10">
                <AvatarImage src={selectedDoctor.profileImage} />
                <AvatarFallback className="text-xs">
                  {selectedDoctor.firstName?.[0]}
                  {selectedDoctor.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs sm:text-sm font-medium">
                  Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                </p>
                <p className="text-xs text-foreground/70">
                  {selectedDoctor.specializations?.primary ||
                    selectedDoctor.specialization}
                </p>
                <div className="flex items-center gap-1 sm:gap-2 mt-1">
                  {selectedDoctor.rating && (
                    <span className="text-xs">⭐ {selectedDoctor.rating}</span>
                  )}
                  {selectedDoctor.yearsOfExperience && (
                    <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                      {selectedDoctor.yearsOfExperience}+ years
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location - Second in the flow */}
      {bookingData.location && (
        <>
          {selectedDoctor && <Separator className="my-2 sm:my-3" />}
          <div className="flex items-start gap-2 sm:gap-3">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-xs sm:text-sm">Location</p>
              <p className="text-xs sm:text-sm text-foreground/70">
                {getLocationDetails(bookingData.location)?.label || bookingData.location}
              </p>
              <p className="text-xs text-foreground/60 mt-1">
                {getLocationDetails(bookingData.location)?.address || "1385 W Alameda Ave, Denver, CO 80223"}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Date & Time - Third in the flow */}
      {(bookingData.date || bookingData.time) && (
        <>
          {(selectedDoctor || bookingData.location) && <Separator className="my-2 sm:my-3" />}
          <div className="space-y-2 sm:space-y-3">
            {bookingData.date && (
              <div className="flex items-start gap-2 sm:gap-3">
                <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-xs sm:text-sm">Date</p>
                  <p className="text-xs sm:text-sm text-foreground/70">
                    {formatDate(bookingData.date)}
                  </p>
                </div>
              </div>
            )}

            {bookingData.time && (
              <div className="flex items-start gap-2 sm:gap-3">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-xs sm:text-sm">Time</p>
                  <p className="text-xs sm:text-sm text-foreground/70">
                    {formatTime(bookingData.time)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Reason for Visit */}
      {bookingData.reason && (
        <>
          <Separator className="my-2 sm:my-3" />
          <div className="flex items-start gap-2 sm:gap-3">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-xs sm:text-sm">Reason for Visit</p>
              <p className="text-xs sm:text-sm text-foreground/70">
                {bookingData.reason}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Additional Notes */}
      {bookingData.notes && (
        <>
          <Separator className="my-2 sm:my-3" />
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Additional Notes</p>
              <p className="text-sm text-foreground/70">
                {bookingData.notes}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Estimated Duration */}
      {(selectedDoctor ||
        bookingData.location ||
        bookingData.date ||
        bookingData.time) && (
          <>
            <Separator />
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Duration</p>
                <p className="text-sm text-foreground/70">
                  30 minutes (estimated)
                </p>
              </div>
            </div>
          </>
        )}

      {/* Important Notes */}
      {(selectedDoctor ||
        bookingData.location ||
        bookingData.date ||
        bookingData.time) && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mt-4">
            <h4 className="text-sm font-medium text-primary mb-2">
              Important Reminders:
            </h4>
            <ul className="text-xs text-foreground/80 space-y-1">
              <li>• Please arrive 15 minutes early for check-in</li>
              <li>• Bring a valid ID and insurance card</li>
              <li>• Wear comfortable clothing</li>
              <li>• You can reschedule up to 24 hours in advance</li>
              {selectedDoctor && (
                <li>
                  • Dr. {selectedDoctor.lastName} specializes in{" "}
                  {selectedDoctor.specializations?.primary ||
                    selectedDoctor.specialization}
                </li>
              )}
            </ul>
          </div>
        )}
    </div>
  );
}
