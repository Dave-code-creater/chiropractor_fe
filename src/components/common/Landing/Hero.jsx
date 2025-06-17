'use client'

import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

export default function Hero() {
    const navigate = useNavigate()
    const user = useSelector((state) => state.data.auth.userID);
    const isAuthenticated = useSelector((state) => state.data.auth.isAuthenticated);

    const handleBookAppointment = () => {
        if (isAuthenticated && user?.id) {
            navigate(`dashboard/${user.id}/services/appointments/`);
        } else {
            navigate('/login');
        }
    };

    return (
        <section className="relative bg-[url('/images/background.jpg')] bg-cover bg-center bg-no-repeat min-h-screen flex items-center">
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-black/60 z-0" />

            {/* Content Wrapper */}
            <div className="relative z-10 mx-auto max-w-4xl px-6 text-center py-20 sm:py-32 lg:py-40">
                {/* Badge or sub-heading */}
                <div className="mb-6 inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-indigo-200 backdrop-blur-sm ring-1 ring-white/20">
                    Expert Chiropractic Care That Moves You Forward
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-tight">
                    Move Better, <br className="hidden sm:inline" />
                    Live Stronger
                </h1>

                {/* Subheading */}
                <p className="mt-6 text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
                    We provide clinically validated chiropractic care starting with an expert diagnosis and tailored therapy plan. Let’s get you pain-free and moving again.
                </p>

                {/* CTA Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={handleBookAppointment}
                        className="inline-block rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition"
                    >
                        Book an Appointment
                    </button>
                    <a
                        href="/about"
                        className="text-sm font-semibold text-white underline underline-offset-4 hover:text-indigo-300"
                    >
                        Learn more →
                    </a>
                </div>
            </div>
        </section>
    )
}