import React, { useState } from 'react';
import { useCreateAppointmentMutation } from '@/services/appointmentApi';
import DoctorBooking from './components/Booking';


function Appointments() {

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