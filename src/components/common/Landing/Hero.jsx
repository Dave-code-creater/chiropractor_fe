"use client";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { selectUserId, selectIsAuthenticated } from "../../../state/data/authSlice";

// Lazy load images - only load what's needed
const backgroundImages = [
  { url: () => import('../../../assets/background-1.jpg'), loaded: false },
  { url: () => import('../../../assets/background-2.jpg'), loaded: false },
  { url: () => import('../../../assets/background-3.jpg'), loaded: false },
  { url: () => import('../../../assets/background-4.jpg'), loaded: false }
];

export default function Hero() {
  const navigate = useNavigate();
  const user = useSelector(selectUserId);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [isImageLoading, setIsImageLoading] = useState(true);
  const preloadedImages = useRef(new Set());

  // Preload current and next image
  useEffect(() => {
    const preloadImage = async (index) => {
      if (preloadedImages.current.has(index) || loadedImages[index]) {
        return;
      }

      try {
        const imageModule = await backgroundImages[index].url();
        setLoadedImages(prev => ({
          ...prev,
          [index]: imageModule.default
        }));
        preloadedImages.current.add(index);
        
        if (index === 0) {
          setIsImageLoading(false);
        }
      } catch (error) {
        console.error(`Failed to load image ${index}:`, error);
      }
    };

    // Load current image first
    preloadImage(currentImageIndex);
    
    // Preload next image in background
    const nextIndex = (currentImageIndex + 1) % backgroundImages.length;
    setTimeout(() => preloadImage(nextIndex), 100);
  }, [currentImageIndex, loadedImages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex >= 3 ? 0 : prevIndex + 1 // Fixed to use constant instead of array length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []); // No dependencies needed

  const handleBookAppointment = () => {
    if (isAuthenticated && user?.id) {
      navigate(`dashboard/${user.id}/services/appointments/`);
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Only render images that have been loaded */}
      {Object.entries(loadedImages).map(([index, imageUrl]) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
            parseInt(index) === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      ))}
      
      {/* Loading state for first image */}
      {isImageLoading && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 z-0" />
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center py-20 sm:py-32 lg:py-40">
        <div className="mb-6 inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-earthfire-clay-200 backdrop-blur-sm ring-1 ring-white/20">
          Expert Chiropractic Care That Moves You Forward
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-tight">
          Move Better, <br className="hidden sm:inline" />
          Live Stronger
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
          We provide clinically validated chiropractic care starting with an
          expert diagnosis and tailored therapy plan. Let's get you pain-free
          and moving again.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleBookAppointment}
            className="inline-block rounded-md bg-earthfire-brick-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-earthfire-brick-500 transition"
          >
            Book an Appointment
          </button>
          <a
            href="/about"
            className="text-sm font-semibold text-white underline underline-offset-4 hover:text-earthfire-clay-300"
          >
            Learn more →
          </a>
        </div>
      </div>
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
