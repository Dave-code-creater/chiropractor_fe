import React, { useState } from 'react';
import { useCreateAppointmentMutation } from '@/services/appointmentApi';
import DoctorBooking from './components/Booking';
import { Car } from 'lucide-react';

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
        <main className="min-h-screen p-4 md:p-8 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Booking Appointment</h1>
                <DoctorBooking />
            </div>
        </main>
    );
}

export default Appointments;