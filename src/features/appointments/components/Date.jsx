"use client"

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, AlertCircle, User } from "lucide-react";
import { useGetDoctorAvailabilityQuery } from "@/api/services/appointmentApi";

export default function DateSelector({
  bookingData,
  updateBookingData,
  selectedDoctor,
}) {
  const [selectedDate, setSelectedDate] = useState(bookingData.date);
  const [availableSlots, setAvailableSlots] = useState([]);

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
      setAvailableSlots(availabilityData.available_slots);
    } else if (availabilityData?.data?.available_slots) {
      setAvailableSlots(availabilityData.data.available_slots);
    } else if (availabilityData?.slots) {
      setAvailableSlots(availabilityData.slots);
    } else if (availabilityData?.data?.slots) {
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
      time: "",
    });
  };

  const handleTimeSelect = (time) => {
    updateBookingData({ time });
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today)
      return true;

    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    if (date > threeMonthsFromNow)
      return true;

    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
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
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-1">Select Date & Time</h2>
        <p className="text-sm sm:text-base text-foreground/70">
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
      <div className="grid lg:grid-cols-2 gap-3 lg:gap-6">
        <Card className="order-1 lg:order-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={isDateDisabled}
                className="rounded-md border w-full p-0 [&_table]:text-sm sm:[&_table]:text-base"
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
                  weekday: "text-muted-foreground rounded-md w-8 sm:w-9 font-normal text-[0.7rem] sm:text-[0.8rem]",
                  week: "flex w-full mt-2",
                  day: "h-8 w-8 sm:h-9 sm:w-9 text-center text-xs sm:text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day_button: "h-8 w-8 sm:h-9 sm:w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                  selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  today: "bg-accent text-accent-foreground font-semibold",
                  outside: "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                  disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
                  hidden: "invisible",
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-foreground/60">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span>Selected date</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/60">
                <div className="w-3 h-3 bg-accent rounded"></div>
                <span>Today</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/60">
                <div className="w-3 h-3 bg-muted rounded"></div>
                <span>Unavailable</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="order-2 lg:order-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              Available Times
              {selectedDoctor && (
                <Badge variant="outline" className="ml-auto text-xs">
                  Dr. {selectedDoctor.lastName}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoadingAvailability && (
              <div className="flex items-center justify-center py-6 sm:py-8">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-xs sm:text-sm text-foreground/60">
                  Loading available times...
                </span>
              </div>
            )}

            {availabilityError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-700">
                  Unable to load available times. Please try again.
                </span>
              </div>
            )}

            {!selectedDate && !isLoadingAvailability && (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-foreground/40 mx-auto mb-3" />
                <p className="text-foreground/60">
                  Please select a date to view available times
                </p>
              </div>
            )}

            {!bookingData.doctor && selectedDate && !isLoadingAvailability && (
              <div className="text-center py-6 sm:py-8">
                <User className="h-10 w-10 sm:h-12 sm:w-12 text-foreground/40 mx-auto mb-3" />
                <p className="text-xs sm:text-sm text-foreground/60">
                  Please select a doctor to view available times
                </p>
              </div>
            )}

            {selectedDate &&
              bookingData.doctor &&
              !isLoadingAvailability &&
              !availabilityError &&
              availableSlots.length > 0 && (
                <div className="space-y-3 sm:space-y-4">
                  {morning.length > 0 && (
                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-foreground/80 mb-2 block">
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
                              "h-9 sm:h-10 text-xs sm:text-sm font-medium",
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

                  {afternoon.length > 0 && (
                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-foreground/80 mb-2 block">
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
                              "h-9 sm:h-10 text-xs sm:text-sm font-medium",
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

                  {evening.length > 0 && (
                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-foreground/80 mb-2 block">
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
                              "h-9 sm:h-10 text-xs sm:text-sm font-medium",
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

            {selectedDate &&
              bookingData.doctor &&
              !isLoadingAvailability &&
              !availabilityError &&
              availableSlots.length === 0 && (
                <div className="text-center py-6 sm:py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No available times for this date
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Please select a different date
                  </p>
                </div>
              )}

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
