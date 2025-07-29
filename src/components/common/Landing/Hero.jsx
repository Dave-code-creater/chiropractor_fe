"use client";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { selectUserId, selectIsAuthenticated } from "../../../state/data/authSlice";


import background1 from '../../../../public/background-1.jpg';
import background2 from '../../../../public/background-2.jpg';
import background3 from '../../../../public/background-3.jpg';
import background4 from '../../../../public/background-4.jpg';


export default function Hero() {
  const navigate = useNavigate();
  const user = useSelector(selectUserId);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Use your local images for the rotating background
  const backgroundImages = [
    { url: background1 },
    { url: background2 },
    { url: background3 },
    { url: background4 }

  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate background images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const handleBookAppointment = () => {
    if (isAuthenticated && user?.id) {
      navigate(`dashboard/${user.id}/services/appointments/`);
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Rotating Background Images */}
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          style={{ backgroundImage: `url(${image.url})` }}
        />
      ))}

      {/* Enhanced Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 z-0" />

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
          We provide clinically validated chiropractic care starting with an
          expert diagnosis and tailored therapy plan. Let's get you pain-free
          and moving again.
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

      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {backgroundImages.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImageIndex
              ? 'bg-white scale-125'
              : 'bg-white/50 hover:bg-white/75'
              }`}
          />
        ))}
      </div>
    </section>
  );
}
