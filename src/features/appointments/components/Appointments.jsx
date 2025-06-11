import React, { useState } from 'react';

function Appointments() {
    const times = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
    const timesSat = ["10:00", "11:00", "12:00", "13:00", "14:00"];
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const dayOfWeek = selectedDate ? new Date(selectedDate).getDay() : null;
    const isWeekday = dayOfWeek === 2 || dayOfWeek === 4; // Tuesday or Thursday
    const isSaturday = dayOfWeek === 6;

    const availableTimes = isWeekday ? times : isSaturday ? timesSat : [];

    const handleDateChange = (date) => {
        const day = new Date(date).getDay();
        if (day === 2 || day === 4 || day === 6) {
            setSelectedDate(date);
            setErrorMessage('');
        } else {
            setSelectedDate('');
            setErrorMessage('Appointments are only available on Tue, Thu, and Sat.');
        }
    };

    return (
        <div className="min-h-screen bg-background mt-12 px-6 md:px-16 font-sans">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 bg-card shadow-xl rounded-2xl overflow-hidden">

                {/* Left: Appointments form */}
                <div className="p-10">
                    <h1 className="text-4xl font-bold text-indigo-800 mb-4">Book an Appointment</h1>
                    <p className="text-muted-foreground mb-8">Schedule a session with our expert chiropractors</p>

                    {/* Service Type */}
                    <div className="mb-6">
                        <label className="block text-lg font-semibold text-foreground mb-2">Service Type</label>
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
                    <div className="mb-6">
                        <label className="block text-lg font-semibold text-foreground mb-2">Select Date</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="w-full px-4 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        {errorMessage && <p className="text-sm text-red-500 mt-2">{errorMessage}</p>}
                    </div>

                    {/* Time Picker */}
                    {selectedDate && (
                        <div className="mb-8">
                            <label className="block text-lg font-semibold text-foreground mb-2">Select Time</label>
                            <div className="grid grid-cols-3 gap-3">
                                {availableTimes.map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={`px-4 py-2 rounded-lg border transition-all duration-150
                      ${selectedTime === time
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-card text-indigo-800 border-indigo-300 hover:bg-indigo-100'}`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Book Button */}
                    <button
                        disabled={!selectedDate || !selectedTime}
                        className={`w-full py-3 rounded-xl font-semibold text-lg transition 
              ${selectedDate && selectedTime
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                : 'bg-indigo-300 text-white cursor-not-allowed'}`}
                    >
                        Book Appointment
                    </button>
                </div>

                {/* Right: Contact Info + Office Hours */}
                <div className=" p-10 flex flex-col justify-center">
                    <div>
                        <h2 className="text-2xl font-bold text-indigo-800 mb-4">Contact Us</h2>
                        <p className="text-foreground mb-2">Phone: <strong>+1 720-579-7655</strong></p>
                        <p className="text-foreground mb-2">Email: <strong>drdieuphanchiropractor@gmail.com</strong></p>
                        <p className="text-foreground mb-6">Address: <strong>1385W Alameda Ave, Denver, CO, 80223</strong></p>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-indigo-700 mb-2">📍 Location Map</h3>
                        <div className="w-full h-64 rounded-lg overflow-hidden border border-indigo-200 shadow-sm">
                            <iframe
                                title="Chiropractic Clinic Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.6073091246165!2d-105.01387722423165!3d39.70335607157403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876c7eabc151aa0d%3A0x4ccaf1c8b3969739!2s1385%20W%20Alameda%20Ave%2C%20Denver%2C%20CO%2080223!5e0!3m2!1sen!2sus!4v1716832445696!5m2!1sen!2sus"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-indigo-800 mb-4">Office Hours</h2>
                        <div className="grid grid-cols-2 gap-3 text-foreground">
                            <div>Tuesday - Thursday:</div>
                            <div>9:00 AM – 5:00 PM</div>
                            <div>Saturday:</div>
                            <div>10:00 AM – 3:00 PM</div>
                            <div>Sunday:</div>
                            <div>Closed</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Appointments;