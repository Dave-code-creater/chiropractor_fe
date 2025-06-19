// src/features/appointments/components/Booking.jsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LocationSelector from "./Location";
import DateSelector from "./Date";
import DoctorSelector from "./Types";
import BookingSummary from "./BookingSummary";
import { Button } from "@/components/ui/button";

export default function Booking() {
    const [activeTab, setActiveTab] = useState("location");
    const [bookingData, setBookingData] = useState({
        location: "",      // clinic location
        date: undefined, // JS Date
        time: "",        // e.g. "14:00"
        doctor: "",      // provider key
    });

    const updateBookingData = (data) =>
        setBookingData((prev) => ({ ...prev, ...data }));

    const handleNext = () => {
        if (activeTab === "location") setActiveTab("date");
        else if (activeTab === "date") setActiveTab("types");
        else if (activeTab === "types") setActiveTab("summary");
    };

    const handleBack = () => {
        if (activeTab === "date") setActiveTab("location");
        else if (activeTab === "types") setActiveTab("date");
        else if (activeTab === "summary") setActiveTab("types");
    };

    const isNextDisabled = () => {
        if (activeTab === "location") return !bookingData.location;
        if (activeTab === "date") return !bookingData.date || !bookingData.time;
        if (activeTab === "types") return !bookingData.doctor;
        return false;
    };

    return (
        <div className="grid md:grid-cols-3 gap-6">
            {/* === Left: Form Steps === */}
            <div className="md:col-span-2">
                <Card>
                    <CardContent className="p-6">
                        <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full"
                        >
                            <TabsList className="grid grid-cols-4 mb-6">
                                <TabsTrigger value="location">Location</TabsTrigger>
                                <TabsTrigger value="date">Dates</TabsTrigger>
                                <TabsTrigger value="types">Types</TabsTrigger>
                                <TabsTrigger value="summary" disabled>
                                    Summary
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="location">
                                <LocationSelector
                                    bookingData={bookingData}
                                    updateBookingData={updateBookingData}
                                />
                            </TabsContent>

                            <TabsContent value="date">
                                <DateSelector
                                    bookingData={bookingData}
                                    updateBookingData={updateBookingData}
                                />
                            </TabsContent>

                            <TabsContent value="types">
                                <DoctorSelector
                                    bookingData={bookingData}
                                    updateBookingData={updateBookingData}
                                />
                            </TabsContent>

                            <TabsContent value="summary">
                                <BookingSummary bookingData={bookingData} />
                            </TabsContent>

                            {/* Back / Next / Confirm */}
                            <div className="flex justify-between mt-6">
                                {activeTab !== "location" && (
                                    <Button variant="outline" onClick={handleBack}>
                                        Back
                                    </Button>
                                )}
                                {activeTab !== "summary" ? (
                                    <Button
                                        onClick={handleNext}
                                        disabled={isNextDisabled()}
                                        className="ml-auto"
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    <Button className="ml-auto">Confirm Appointment</Button>
                                )}
                            </div>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            {/* === Right: Live Summary === */}
            <div>
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-2xl font-bold mb-2">Booking Summary</h2>
                        <BookingSummary bookingData={bookingData} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}