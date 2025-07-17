// src/features/appointments/components/Date.jsx
"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock, CalendarDays, AlertCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetDoctorAvailabilityQuery } from "@/api/services/appointmentApi";

export default function DateSelector({
  bookingData,
  updateBookingData,
  selectedDoctor,
}) {
  const [selectedDate, setSelectedDate] = useState(bookingData.date);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Get doctor availability when date and doctor are selected
  const { data: availabilityData, isLoading: isLoadingAvailability, error: availabilityError } =
    useGetDoctorAvailabilityQuery(
      {
        doctor_id: bookingData.doctor,
        date: selectedDate?.toISOString().split("T")[0],
      },
      {
        skip: !bookingData.doctor || !selectedDate,
      },
    );

  useEffect(() => {
    if (availabilityData?.available_slots) {
      // Handle direct available_slots in response
      setAvailableSlots(availabilityData.available_slots);
    } else if (availabilityData?.data?.available_slots) {
      // Handle nested available_slots in data object
      setAvailableSlots(availabilityData.data.available_slots);
    } else if (availabilityData?.slots) {
      // Handle legacy slots format
      setAvailableSlots(availabilityData.slots);
    } else if (availabilityData?.data?.slots) {
      // Handle legacy nested slots format
      setAvailableSlots(availabilityData.data.slots);
    } else {
      setAvailableSlots([]);
    }
  }, [availabilityData, selectedDate, bookingData.doctor]);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    updateBookingData({
      date: date,
      time: "", // Reset time when date changes
    });
  };

  const handleTimeSelect = (time) => {
    updateBookingData({ time });
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Disable past dates
    if (date < today) return true;

    // Disable dates more than 3 months in advance
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    if (date > threeMonthsFromNow) return true;

    // Disable weekends (assuming clinic is closed)
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
  };

  const getTimeSlotsByPeriod = () => {
    const morning = [];
    const afternoon = [];
    const evening = [];

    availableSlots.forEach((slot) => {
      const hour = parseInt(slot.time.split(":")[0]);
      if (hour < 12) {
        morning.push(slot);
      } else if (hour < 17) {
        afternoon.push(slot);
      } else {
        evening.push(slot);
      }
    });

    return { morning, afternoon, evening };
  };

  const { morning, afternoon, evening } = getTimeSlotsByPeriod();

  return (
    <div className="space-y-6">
      {/* Header with Doctor Info */}
      <div>
        <h2 className="text-xl font-semibold mb-1">Select Date & Time</h2>
        <p className="text-muted-foreground">
          Choose your preferred appointment date and time
          {selectedDoctor && (
            <span className="ml-1">
              with{" "}
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
              <div>
                <h4 className="font-medium text-green-900">
                  Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                </h4>
                <p className="text-sm text-green-700">
                  {selectedDoctor.specializations?.primary}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Calendar */}
        <Card className="order-1 lg:order-1">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="h-5 w-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={isDateDisabled}
                className="rounded-md border w-full p-0"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 relative w-full",
                  month: "space-y-4 w-full",
                  month_caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  button_previous: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-input hover:bg-accent hover:text-accent-foreground absolute left-1 top-1 rounded-md z-10",
                  button_next: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-input hover:bg-accent hover:text-accent-foreground absolute right-1 top-1 rounded-md z-10",
                  month_grid: "w-full border-collapse space-y-1",
                  weekdays: "flex",
                  weekday: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                  week: "flex w-full mt-2",
                  day: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day_button: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                  selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  today: "bg-accent text-accent-foreground font-semibold",
                  outside: "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                  disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
                  hidden: "invisible",
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span>Selected date</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-3 h-3 bg-accent rounded"></div>
                <span>Today</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-3 h-3 bg-muted rounded"></div>
                <span>Unavailable</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card className="order-2 lg:order-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              Available Times
              {selectedDoctor && (
                <Badge variant="outline" className="ml-auto text-xs">
                  Dr. {selectedDoctor.lastName}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Loading State */}
            {isLoadingAvailability && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-muted-foreground">
                  Loading available times...
                </span>
              </div>
            )}

            {/* Error State */}
            {availabilityError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-700">
                  Unable to load available times. Please try again.
                </span>
              </div>
            )}

            {/* No Date Selected */}
            {!selectedDate && !isLoadingAvailability && (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Please select a date to view available times
                </p>
              </div>
            )}

            {/* No Doctor Selected */}
            {!bookingData.doctor && selectedDate && !isLoadingAvailability && (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Please select a doctor to view available times
                </p>
              </div>
            )}

            {/* Available Times */}
            {selectedDate && 
             bookingData.doctor && 
             !isLoadingAvailability && 
             !availabilityError && 
             availableSlots.length > 0 && (
              <div className="space-y-4">
                {/* Morning */}
                {morning.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Morning
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {morning.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={
                            bookingData.time === slot.time
                              ? "default"
                              : slot.available
                                ? "outline"
                                : "secondary"
                          }
                          size="sm"
                          disabled={!slot.available}
                          onClick={() => handleTimeSelect(slot.time)}
                          className={cn(
                            "h-10 text-sm",
                            bookingData.time === slot.time &&
                              "bg-primary text-primary-foreground",
                            !slot.available &&
                              "opacity-50 cursor-not-allowed bg-muted",
                          )}
                        >
                          {formatTime(slot.time)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Afternoon */}
                {afternoon.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Afternoon
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {afternoon.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={
                            bookingData.time === slot.time
                              ? "default"
                              : slot.available
                                ? "outline"
                                : "secondary"
                          }
                          size="sm"
                          disabled={!slot.available}
                          onClick={() => handleTimeSelect(slot.time)}
                          className={cn(
                            "h-10 text-sm",
                            bookingData.time === slot.time &&
                              "bg-primary text-primary-foreground",
                            !slot.available &&
                              "opacity-50 cursor-not-allowed bg-muted",
                          )}
                        >
                          {formatTime(slot.time)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Evening */}
                {evening.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Evening
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {evening.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={
                            bookingData.time === slot.time
                              ? "default"
                              : slot.available
                                ? "outline"
                                : "secondary"
                          }
                          size="sm"
                          disabled={!slot.available}
                          onClick={() => handleTimeSelect(slot.time)}
                          className={cn(
                            "h-10 text-sm",
                            bookingData.time === slot.time &&
                              "bg-primary text-primary-foreground",
                            !slot.available &&
                              "opacity-50 cursor-not-allowed bg-muted",
                          )}
                        >
                          {formatTime(slot.time)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* No Available Times */}
            {selectedDate && 
             bookingData.doctor && 
             !isLoadingAvailability && 
             !availabilityError && 
             availableSlots.length === 0 && (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No available times for this date
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please select a different date
                </p>
              </div>
            )}

            {/* Selected Time Info */}
            {bookingData.time && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center gap-2 text-green-800">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Selected: {formatTime(bookingData.time)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
