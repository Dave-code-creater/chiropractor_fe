"use client"

import { useState, useEffect, useMemo } from "react";
import {
  useCreateAppointmentMutation,
  useGetAvailableDoctorsQuery,
} from "@/api/services/appointmentApi";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getLocationByValue, DEFAULT_CLINIC_LOCATION } from "@/constants/clinicLocations";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BookingSummary from "./BookingSummary";
import DoctorSelector from "./Types";
import LocationSelector from "./Location";
import DateSelector from "./Date";

export default function DoctorBooking() {
  const [activeTab, setActiveTab] = useState("doctor");
  const [manualTabNavigation, setManualTabNavigation] = useState(false);
  const [bookingData, setBookingData] = useState({
    doctor: "",
    location: "",
    date: null,
    time: "",
    notes: "",
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useSelector((state) => state.auth);
  const [createAppointment] = useCreateAppointmentMutation();
  const {
    data: doctorsData,
    isLoading: doctorsLoading,
    isError: doctorsError,
    error: doctorsErrorDetails,
  } = useGetAvailableDoctorsQuery();



  const doctors = useMemo(() => {
    let rawDoctors = [];

    if (doctorsData?.data) {
      if (Array.isArray(doctorsData.data)) {
        rawDoctors = doctorsData.data;
      } else if (doctorsData.data.doctors && Array.isArray(doctorsData.data.doctors)) {
        rawDoctors = doctorsData.data.doctors;
      }
    } else if (doctorsData?.metadata) rawDoctors = doctorsData.metadata;
    else if (doctorsData?.doctors) rawDoctors = doctorsData.doctors;
    else if (Array.isArray(doctorsData)) rawDoctors = doctorsData;

    const transformedDoctors = rawDoctors.map(doctor => ({
      ...doctor,
      firstName: doctor.first_name || doctor.firstName,
      lastName: doctor.last_name || doctor.lastName,
      profileImage: doctor.profile_image || doctor.profileImage,
      yearsOfExperience: doctor.years_of_experience || doctor.yearsOfExperience,
      specialization: doctor.specialization || doctor.specialty || 'Chiropractor',
      specializations: doctor.specializations || {
        primary: doctor.specialization || doctor.specialty || 'Chiropractor'
      }
    }));

    return transformedDoctors;
  }, [doctorsData]);

  const updateBookingData = (newData) => {
    setBookingData((prev) => {
      const updated = { ...prev, ...newData };

      if (newData.doctor && newData.doctor !== prev.doctor) {
        updated.location = "";
        updated.date = null;
        updated.time = "";
        setManualTabNavigation(false);
      }

      if (newData.location && newData.location !== prev.location) {
        updated.date = null;
        updated.time = "";
        setManualTabNavigation(false);
      }

      if ((newData.date && newData.date !== prev.date) || (newData.time && newData.time !== prev.time)) {
        setManualTabNavigation(false);
      }

      return updated;
    });
  };

  useEffect(() => {
    if (manualTabNavigation)
      return;

    if (activeTab === "doctor" && bookingData.doctor) {
      setActiveTab("location");
    } else if (activeTab === "location" && bookingData.location) {
      setActiveTab("date");
    } else if (activeTab === "date" && bookingData.date && bookingData.time) {
      setActiveTab("summary");
    }
  }, [bookingData, activeTab, manualTabNavigation]);

  const handleTabChange = (newTab) => {
    setManualTabNavigation(true);
    setActiveTab(newTab);
  };

  const handleSubmit = async () => {
    if (
      !bookingData.doctor ||
      !bookingData.location ||
      !bookingData.date ||
      !bookingData.time
    ) {
      toast.error("Please complete all required fields");
      return;
    }

    if (!user?.userID) {
      toast.error("Please log in to book an appointment");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedLocation = getLocationByValue(bookingData.location) || DEFAULT_CLINIC_LOCATION;

      const formattedDate = bookingData.date.toISOString().split('T')[0];

      const formattedTime = bookingData.time;

      const appointmentData = {
        sender_id: user.userID,
        recipient_id: bookingData.doctor,
        appointment_date: formattedDate,
        appointment_time: formattedTime,
        reason_for_visit: bookingData.reason,
        additional_notes: bookingData.notes || "",
        status: "pending",
        location: selectedLocation.label,
        clinic_address: selectedLocation.address,
        clinic_phone: selectedLocation.phone,
        clinic_hours: selectedLocation.hours,
      };

      const result = await createAppointment(appointmentData).unwrap();

      if (result.success) {
        toast.success("Appointment booked successfully!");
        setBookingData({
          doctor: "",
          location: "",
          date: null,
          time: "",
          notes: "",
          reason: "",
        });
        setActiveTab("doctor");
      }
    } catch (error) {
      console.error('Appointment booking failed:', error);

      if (error.status === 409) {
        toast.error("This time slot is already booked. Please select a different time.");
      } else if (error.status === 400) {
        toast.error("Invalid appointment data. Please check your selections.");
      } else if (error.status === 401) {
        toast.error("Please log in to book an appointment.");
      } else {
        toast.error("Failed to book appointment. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepComplete = (step) => {
    switch (step) {
      case "doctor":
        return !!bookingData.doctor;
      case "location":
        return !!bookingData.doctor && !!bookingData.location;
      case "date":
        return !!bookingData.doctor && !!bookingData.location && !!bookingData.date && !!bookingData.time;
      default:
        return false;
    }
  };

  const canProceedToSummary = () => {
    return isStepComplete("date");
  };

  const getSelectedDoctor = () => {
    return doctors.find((doc) => doc.id === bookingData.doctor) || null;
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
      <div className="grid lg:grid-cols-3 gap-3 sm:gap-6">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-3 sm:mb-6 w-full h-auto gap-1 sm:gap-0">
              <TabsTrigger
                value="doctor"
                className={cn(
                  "text-xs sm:text-sm py-2.5 px-2 sm:px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                  isStepComplete("doctor") ? "bg-primary/10 text-primary" : ""
                )}
              >
                <span className="hidden sm:inline">Doctor</span>
                <span className="sm:hidden">Dr.</span>
              </TabsTrigger>
              <TabsTrigger
                value="location"
                disabled={!isStepComplete("doctor")}
                className={cn(
                  "text-xs sm:text-sm py-2.5 px-2 sm:px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                  isStepComplete("location") ? "bg-primary/10 text-primary" : ""
                )}
              >
                <span className="hidden sm:inline">Location</span>
                <span className="sm:hidden">Loc.</span>
              </TabsTrigger>
              <TabsTrigger
                value="date"
                disabled={!isStepComplete("location")}
                className={cn(
                  "text-xs sm:text-sm py-2.5 px-2 sm:px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground col-span-2 sm:col-span-1",
                  isStepComplete("date") ? "bg-primary/10 text-primary" : ""
                )}
              >
                <span className="hidden sm:inline">Date & Time</span>
                <span className="sm:hidden">Date & Time</span>
              </TabsTrigger>
              <TabsTrigger
                value="summary"
                disabled={!canProceedToSummary()}
                className="text-xs sm:text-sm py-2.5 px-2 sm:px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground col-span-2 sm:col-span-1"
              >
                <span className="hidden sm:inline">Summary</span>
                <span className="sm:hidden">Summary</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="doctor">
              <DoctorSelector
                bookingData={bookingData}
                updateBookingData={updateBookingData}
                doctors={doctors}
                isLoading={doctorsLoading}
                isError={doctorsError}
                error={doctorsErrorDetails}
              />

              <div className="lg:hidden mt-3 sm:mt-6">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-3">
                    <div className="text-xs sm:text-sm space-y-2">
                      <div className="font-medium text-primary">Progress:</div>
                      <div className="space-y-1">
                        <BookingSummary bookingData={bookingData} doctors={doctors} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="location">
              <LocationSelector
                bookingData={bookingData}
                updateBookingData={updateBookingData}
                selectedDoctor={getSelectedDoctor()}
              />

              <div className="lg:hidden mt-3 sm:mt-6">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-3">
                    <div className="text-xs sm:text-sm space-y-2">
                      <div className="font-medium text-primary">Progress:</div>
                      <div className="space-y-1">
                        <BookingSummary bookingData={bookingData} doctors={doctors} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="date">
              <DateSelector
                bookingData={bookingData}
                updateBookingData={updateBookingData}
                selectedDoctor={getSelectedDoctor()}
              />

              <div className="lg:hidden mt-3 sm:mt-6">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-3">
                    <div className="text-xs sm:text-sm space-y-2">
                      <div className="font-medium text-primary">Progress:</div>
                      <div className="space-y-1">
                        <BookingSummary bookingData={bookingData} doctors={doctors} />
                      </div>

                      {canProceedToSummary() && (
                        <Button
                          onClick={() => setActiveTab("summary")}
                          className="w-full mt-3"
                          size="sm"
                        >
                          Continue to Summary
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="summary">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Confirm Your Appointment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <BookingSummary bookingData={bookingData} doctors={doctors} />

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      className="w-full p-3 border rounded-lg resize-none text-sm"
                      rows={3}
                      placeholder="Any specific concerns or requests..."
                      value={bookingData.notes}
                      onChange={(e) =>
                        updateBookingData({ notes: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Reason for Visit
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg text-sm"
                      placeholder="e.g., Lower back pain, routine check-up..."
                      value={bookingData.reason}
                      onChange={(e) =>
                        updateBookingData({ reason: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("date")}
                      className="flex-1 order-2 sm:order-1 h-11 sm:h-10"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !canProceedToSummary()}
                      className="flex-1 order-1 sm:order-2 h-11 sm:h-10"
                    >
                      {isSubmitting ? "Booking..." : "Confirm Appointment"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="hidden lg:block">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <BookingSummary bookingData={bookingData} doctors={doctors} />

              {canProceedToSummary() && activeTab !== "summary" && (
                <Button
                  onClick={() => setActiveTab("summary")}
                  className="w-full"
                >
                  Review & Book
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
