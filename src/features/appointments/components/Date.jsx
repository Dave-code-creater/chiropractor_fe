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
import { useGetDoctorAvailabilityQuery } from "@/services/appointmentApi";

export default function DateSelector({
  bookingData,
  updateBookingData,
  selectedDoctor,
}) {
  const [selectedDate, setSelectedDate] = useState(bookingData.date);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Get doctor availability when date and doctor are selected
  const { data: availabilityData, isLoading: isLoadingAvailability } =
    useGetDoctorAvailabilityQuery(
      {
        doctorId: bookingData.doctor,
        date: selectedDate?.toISOString().split("T")[0],
      },
      {
        skip: !bookingData.doctor || !selectedDate,
      },
    );

  // Generate default time slots if no API data is available
  const generateDefaultTimeSlots = () => {
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    const slotDuration = 30; // 30 minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        slots.push({
          time: timeString,
          available: Math.random() > 0.3, // 70% chance of being available
          label: formatTime(timeString),
        });
      }
    }
    return slots;
  };

  useEffect(() => {
    if (availabilityData?.slots) {
      setAvailableSlots(availabilityData.slots);
    } else if (selectedDate && bookingData.doctor) {
      // Use default slots if no API data
      setAvailableSlots(generateDefaultTimeSlots());
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
          <CardContent>
            {!selectedDate ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Please select a date first</p>
              </div>
            ) : !bookingData.doctor ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Please select a doctor first</p>
              </div>
            ) : isLoadingAvailability ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                <p className="text-sm text-muted-foreground">
                  Loading{" "}
                  {selectedDoctor ? `Dr. ${selectedDoctor.lastName}'s` : ""}{" "}
                  availability...
                </p>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  No available times for{" "}
                  {selectedDoctor
                    ? `Dr. ${selectedDoctor.lastName}`
                    : "this doctor"}{" "}
                  on this date
                </p>
                <p className="text-xs mt-2">Please select a different date</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Morning Slots */}
                {morning.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground mb-3 block">
                      Morning
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {morning.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={
                            bookingData.time === slot.time
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          disabled={!slot.available}
                          onClick={() => handleTimeSelect(slot.time)}
                          className={cn(
                            "justify-center text-xs sm:text-sm h-8 sm:h-9",
                            !slot.available && "opacity-50 cursor-not-allowed",
                          )}
                        >
                          {slot.label || formatTime(slot.time)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Afternoon Slots */}
                {afternoon.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground mb-3 block">
                      Afternoon
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {afternoon.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={
                            bookingData.time === slot.time
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          disabled={!slot.available}
                          onClick={() => handleTimeSelect(slot.time)}
                          className={cn(
                            "justify-center text-xs sm:text-sm h-8 sm:h-9",
                            !slot.available && "opacity-50 cursor-not-allowed",
                          )}
                        >
                          {slot.label || formatTime(slot.time)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Evening Slots */}
                {evening.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground mb-3 block">
                      Evening
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {evening.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={
                            bookingData.time === slot.time
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          disabled={!slot.available}
                          onClick={() => handleTimeSelect(slot.time)}
                          className={cn(
                            "justify-center text-xs sm:text-sm h-8 sm:h-9",
                            !slot.available && "opacity-50 cursor-not-allowed",
                          )}
                        >
                          {slot.label || formatTime(slot.time)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Selected Time Display */}
            {bookingData.time && (
              <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Selected Time</Badge>
                  <span className="font-medium">
                    {formatTime(bookingData.time)}
                  </span>
                  {selectedDoctor && (
                    <span className="text-sm text-muted-foreground ml-auto">
                      with Dr. {selectedDoctor.lastName}
                    </span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Booking Guidelines */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Booking Guidelines:
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Appointments can be scheduled up to 3 months in advance</li>
            <li>• Same-day appointments may be available for urgent needs</li>
            <li>• Weekend appointments are currently not available</li>
            <li>• You will receive a confirmation email once booked</li>
            {selectedDoctor && (
              <li>
                • Dr. {selectedDoctor.lastName} specializes in{" "}
                {selectedDoctor.specializations?.primary}
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
