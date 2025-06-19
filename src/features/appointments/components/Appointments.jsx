import React, { useState } from 'react'
import { useCreateAppointmentMutation } from '@/services/appointmentApi'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function Appointments() {
    const times = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
    const timesSat = ["10:00", "11:00", "12:00", "13:00", "14:00"];
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [dateError, setDateError] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [createAppointment, { isLoading: creating }] = useCreateAppointmentMutation();

    const dayOfWeek = selectedDate ? new Date(selectedDate).getDay() : null;
    const isWeekday = dayOfWeek === 2 || dayOfWeek === 4; // Tuesday or Thursday
    const isSaturday = dayOfWeek === 6;

    const availableTimes = isWeekday ? times : isSaturday ? timesSat : [];

    const handleDateChange = (date) => {
        const day = new Date(date).getDay();
        if (day === 2 || day === 4 || day === 6) {
            setSelectedDate(date);
            setDateError('');
        } else {
            setSelectedDate('');
            setDateError('Appointments are only available on Tue, Thu, and Sat.');
        }
    };

    const handleBookAppointment = async () => {
        setErrorMessage('');
        setSuccessMessage('');
        try {
            await createAppointment({ date: selectedDate, time: selectedTime }).unwrap();
            setSuccessMessage('Appointment booked successfully');
            setSelectedDate('');
            setSelectedTime('');
        } catch (err) {
            const msg = err?.data?.error || 'Failed to book appointment';
            setErrorMessage(msg);
        }
    };

    return (
        <div className="grid grid-cols-4 gap-4 w-full">
            {/* main form */}
            <div className="col-span-3">
                <Card>
                    <Tabs defaultValue="location" className="w-full">
                        <TabsList>
                            <TabsTrigger value="location">Location</TabsTrigger>
                            <TabsTrigger value="date">Dates</TabsTrigger>
                            <TabsTrigger value="doctor">Doctor</TabsTrigger>
                        </TabsList>

                        <TabsContent value="location">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Select Location</CardTitle>
                                <p className="text-sm text-muted-foreground">Choose your preferred clinic location</p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input id="location" placeholder="Enter location" />
                                </div>
                            </CardContent>
                        </TabsContent>

                        <TabsContent value="date">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Book an Appointment</CardTitle>
                                <p className="text-sm text-muted-foreground">Schedule a session with our expert chiropractors</p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Service Type */}
                                <div className="space-y-2">
                                    <Label className="text-lg font-semibold">Service Type</Label>
                                    <div className="flex gap-4">
                                        {["New patient", "Returning patient"].map((label, idx) => (
                                            <label key={label} className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 px-4 py-2 rounded-xl cursor-pointer border border-indigo-200">
                                                <input type="radio" name="patientType" defaultChecked={idx === 0} className="accent-indigo-600" />
                                                {label}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Date Picker */}
                                <div className="space-y-2">
                                    <Label htmlFor="date" className="text-lg font-semibold">Select Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => handleDateChange(e.target.value)}
                                    />
                                    {dateError && <p className="text-sm text-red-500">{dateError}</p>}
                                </div>

                                {/* Time Picker */}
                                {selectedDate && (
                                    <div className="space-y-2">
                                        <Label className="text-lg font-semibold">Select Time</Label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {availableTimes.map((time) => (
                                                <Button
                                                    key={time}
                                                    variant={selectedTime === time ? "default" : "outline"}
                                                    onClick={() => setSelectedTime(time)}
                                                >
                                                    {time}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="text-right">
                                    <Button
                                        onClick={handleBookAppointment}
                                        disabled={!selectedDate || !selectedTime || creating}
                                    >
                                        {creating ? "Booking..." : "Book Appointment"}
                                    </Button>
                                </div>
                                {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}
                                {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                            </CardContent>
                        </TabsContent>

                        <TabsContent value="doctor">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Select Doctor</CardTitle>
                                <p className="text-sm text-muted-foreground">Choose your preferred doctor</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-4">
                                    <Button variant="outline">Dr. Jane</Button>
                                    <Button variant="outline">Dr. John</Button>
                                </div>
                            </CardContent>
                        </TabsContent>
                    </Tabs>
                </Card>
            </div>

            {/* summary sidebar */}
            <div className="col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Booking Summary</CardTitle>
                    </CardHeader>
                    {/* Optionally <CardContent>…future summary details…</CardContent> */}
                </Card>
            </div>
        </div>
    )
}

export default Appointments;
