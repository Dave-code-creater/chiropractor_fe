// src/features/appointments/components/Booking.jsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCreateAppointmentMutation, useGetDoctorsQuery } from "@/services/appointmentApi";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import LocationSelector from "./Location";
import DateSelector from "./Date";
import DoctorSelector from "./Types";
import BookingSummary from "./BookingSummary";

export default function DoctorBooking() {
    const [activeTab, setActiveTab] = useState("doctor"); // Start with doctor selection
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingData, setBookingData] = useState({
        doctor: "",        // Doctor first
        location: "",      // Then location
        date: null,        // Then date
        time: "",          // And time
        notes: "",
        reason: "",
        type: "initial"
    });

    const user = useSelector((state) => state.data.auth);
    const [createAppointment] = useCreateAppointmentMutation();
    const { data: doctorsData, isLoading: doctorsLoading, isError: doctorsError } = useGetDoctorsQuery();
    
    // Ensure doctors is always an array with fallback data
    const doctors = useMemo(() => {
        if (doctorsData?.doctors) return doctorsData.doctors;
        if (Array.isArray(doctorsData)) return doctorsData;
        
        // Fallback doctors data when API fails
        return [
            {
                id: 'dr-001',
                name: 'Dr. Sarah Johnson',
                specialty: 'General Chiropractic',
                experience: '8 years',
                rating: 4.9,
                image: '/images/dr.png',
                locations: ['Downtown Clinic', 'Westside Branch'],
                availability: {
                    'Downtown Clinic': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
                    'Westside Branch': ['08:00', '09:00', '10:00', '13:00', '14:00', '15:00']
                }
            },
            {
                id: 'dr-002',
                name: 'Dr. Michael Chen',
                specialty: 'Sports Chiropractic',
                experience: '12 years',
                rating: 4.8,
                image: '/images/dr.png',
                locations: ['Downtown Clinic', 'Sports Center'],
                availability: {
                    'Downtown Clinic': ['10:00', '11:00', '14:00', '15:00', '16:00'],
                    'Sports Center': ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00']
                }
            }
        ];
    }, [doctorsData]);

    const updateBookingData = (newData) => {
        setBookingData(prev => {
            const updated = { ...prev, ...newData };
            
            // If doctor changes, reset location, date, and time since availability might be different
            if (newData.doctor && newData.doctor !== prev.doctor) {
                updated.location = "";
                updated.date = null;
                updated.time = "";
            }
            
            // If location changes, reset date and time
            if (newData.location && newData.location !== prev.location) {
                updated.date = null;
                updated.time = "";
            }
            
            return updated;
        });
    };

    // Auto-advance tabs when required fields are filled
    useEffect(() => {
        if (activeTab === "doctor" && bookingData.doctor) {
            setActiveTab("location");
        } else if (activeTab === "location" && bookingData.location) {
            setActiveTab("date");
        } else if (activeTab === "date" && bookingData.date && bookingData.time) {
            setActiveTab("summary");
        }
    }, [bookingData, activeTab]);

    const handleSubmit = async () => {
        if (!bookingData.doctor || !bookingData.location || !bookingData.date || !bookingData.time) {
            toast.error("Please complete all required fields");
            return;
        }

        if (!user?.userID) {
            toast.error("Please log in to book an appointment");
            return;
        }

        setIsSubmitting(true);
        
        try {
            // Format the appointment data according to API specification
            const appointmentData = {
                doctorId: bookingData.doctor,
                patientId: user.userID,
                datetime: new Date(`${bookingData.date.toISOString().split('T')[0]}T${bookingData.time}:00Z`).toISOString(),
                duration: 30, // Default 30 minutes
                type: bookingData.type || "initial",
                notes: bookingData.notes || "",
                reason: bookingData.reason || "Chiropractic consultation",
                location: bookingData.location
            };

            const response = await createAppointment(appointmentData).unwrap();
            
            if (response.success) {
                toast.success("Appointment booked successfully!");
                // Reset form
                setBookingData({
                    doctor: "",
                    location: "",
                    date: null,
                    time: "",
                    notes: "",
                    reason: "",
                    type: "initial"
                });
                setActiveTab("doctor"); // Reset to first step
            }
        } catch (error) {
            console.error("Booking error:", error);
            
            // Handle specific API errors
            if (error.status === 409) {
                toast.error("This time slot is no longer available. Please select a different time.");
            } else if (error.status === 404) {
                toast.error("Doctor not found. Please select a different doctor.");
            } else if (error.status === 400) {
                const errorDetails = error.data?.error?.details;
                if (Array.isArray(errorDetails)) {
                    errorDetails.forEach(detail => {
                        toast.error(`${detail.field}: ${detail.message}`);
                    });
                } else {
                    toast.error(error.data?.message || "Invalid appointment data");
                }
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
                return !!bookingData.location;
            case "date":
                return !!bookingData.date && !!bookingData.time;
            default:
                return false;
        }
    };

    const canProceedToSummary = () => {
        return bookingData.doctor && bookingData.location && bookingData.date && bookingData.time;
    };

    const getSelectedDoctor = () => {
        // Ensure doctors is an array before calling find
        if (!Array.isArray(doctors) || doctors.length === 0) {
            return null;
        }
        return doctors.find(doc => doc.id === bookingData.doctor) || null;
    };

    return (
        <div className="grid md:grid-cols-3 gap-6">
            {/* Left: Form Steps */}
            <div className="md:col-span-2">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-4 mb-6">
                        <TabsTrigger 
                            value="doctor" 
                            className={isStepComplete("doctor") ? "bg-primary/10 text-primary" : ""}
                        >
                            Doctor
                        </TabsTrigger>
                        <TabsTrigger 
                            value="location"
                            disabled={!isStepComplete("doctor")}
                            className={isStepComplete("location") ? "bg-primary/10 text-primary" : ""}
                        >
                            Location
                        </TabsTrigger>
                        <TabsTrigger 
                            value="date"
                            disabled={!isStepComplete("location")}
                            className={isStepComplete("date") ? "bg-primary/10 text-primary" : ""}
                        >
                            Date & Time
                        </TabsTrigger>
                        <TabsTrigger 
                            value="summary" 
                            disabled={!canProceedToSummary()}
                        >
                            Summary
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="doctor">
                        <DoctorSelector
                            bookingData={bookingData}
                            updateBookingData={updateBookingData}
                            doctors={doctors}
                        />
                    </TabsContent>

                    <TabsContent value="location">
                        <LocationSelector
                            bookingData={bookingData}
                            updateBookingData={updateBookingData}
                            selectedDoctor={getSelectedDoctor()}
                        />
                    </TabsContent>

                    <TabsContent value="date">
                        <DateSelector
                            bookingData={bookingData}
                            updateBookingData={updateBookingData}
                            selectedDoctor={getSelectedDoctor()}
                        />
                    </TabsContent>

                    <TabsContent value="summary">
                        <Card>
                            <CardHeader>
                                <CardTitle>Confirm Your Appointment</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <BookingSummary bookingData={bookingData} doctors={doctors} />
                                
                                {/* Additional Notes */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Additional Notes (Optional)</label>
                                    <textarea
                                        className="w-full p-3 border rounded-lg resize-none"
                                        rows={3}
                                        placeholder="Any specific concerns or requests..."
                                        value={bookingData.notes}
                                        onChange={(e) => updateBookingData({ notes: e.target.value })}
                                    />
                                </div>

                                {/* Reason for Visit */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Reason for Visit</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="e.g., Lower back pain, routine check-up..."
                                        value={bookingData.reason}
                                        onChange={(e) => updateBookingData({ reason: e.target.value })}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setActiveTab("date")}
                                        className="flex-1"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || !canProceedToSummary()}
                                        className="flex-1"
                                    >
                                        {isSubmitting ? "Booking..." : "Confirm Appointment"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Right: Booking Summary Sidebar */}
            <div>
                <Card className="sticky top-6">
                    <CardHeader>
                        <CardTitle className="text-lg">Booking Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BookingSummary bookingData={bookingData} doctors={doctors} />
                        
                        {canProceedToSummary() && activeTab !== "summary" && (
                            <Button
                                onClick={() => setActiveTab("summary")}
                                className="w-full mt-4"
                            >
                                Review & Book
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}