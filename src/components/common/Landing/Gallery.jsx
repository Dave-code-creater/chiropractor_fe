import React, { useState, useEffect } from 'react';

const Gallery = () => {
    // Real chiropractic process images from external sources
    const images = [
        {
            src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Initial Consultation",
            title: "Step 1: Initial Consultation",
            description: "Comprehensive health assessment and discussion of your concerns"
        },
        {
            src: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Physical Examination",
            title: "Step 2: Physical Examination",
            description: "Thorough physical examination to identify problem areas"
        },
        {
            src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Diagnostic Testing",
            title: "Step 3: Diagnostic Analysis",
            description: "Advanced diagnostic testing including X-rays if necessary"
        },
        {
            src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Treatment Planning",
            title: "Step 4: Treatment Planning",
            description: "Personalized treatment plan tailored to your specific needs"
        },
        {
            src: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Spinal Adjustment",
            title: "Step 5: Spinal Adjustment",
            description: "Precise spinal adjustments to restore proper alignment"
        },
        {
            src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Therapeutic Exercise",
            title: "Step 6: Therapeutic Exercise",
            description: "Guided exercises to strengthen and support recovery"
        },
        {
            src: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Follow-up Care",
            title: "Step 7: Follow-up & Maintenance",
            description: "Ongoing care and wellness maintenance programs"
        }
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Auto-rotate images every 5 seconds (no manual control needed)
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000); // 5 seconds rotation

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <section className="py-16 bg-gradient-to-br from-earthfire-clay-50 to-earthfire-clay-100 relative overflow-hidden">
            {/* Decorative background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-earthfire-brick-500/10 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Your Chiropractic Journey
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover our comprehensive 7-step process designed to get you back to optimal health and wellness
                    </p>
                </div>

                {/* Main Gallery Container - Seneca Style */}
                <div className="relative max-w-6xl mx-auto">
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white">
                        {/* Main Image with Content Overlay */}
                        <div className="relative h-[500px] lg:h-[600px]">
                            <img
                                src={images[currentImageIndex].src}
                                alt={images[currentImageIndex].alt}
                                className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
                            />

                            {/* Content Overlay - Left Side Like Seneca */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center">
                                <div className="max-w-xl p-8 lg:p-12 text-white">
                                    <h3 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                                        {images[currentImageIndex].title}
                                    </h3>
                                    <p className="text-lg lg:text-xl mb-6 leading-relaxed opacity-90">
                                        {images[currentImageIndex].description}
                                    </p>

                                    {/* Call to Action */}
                                    <button className="bg-earthfire-brick-600 hover:bg-earthfire-brick-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
                                        Book Consultation
                                    </button>
                                </div>
                            </div>

                            {/* Progress indicator on the right */}
                            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
                                {images.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-1 h-8 rounded-full transition-all duration-500 ${index === currentImageIndex
                                            ? 'bg-white'
                                            : 'bg-white/30'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Step Counter */}
                    <div className="flex justify-center mt-8">
                        <div className="bg-white rounded-full px-6 py-3 shadow-lg">
                            <span className="text-earthfire-brick-600 font-bold text-lg">
                                {currentImageIndex + 1} of {images.length}
                            </span>
                            <span className="text-gray-600 ml-2">
                                • Auto-advancing every 5 seconds
                            </span>
                        </div>
                    </div>
                </div>

                {/* Process Overview Cards */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-200">
                        <div className="w-16 h-16 bg-earthfire-clay-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🩺</span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Expert Assessment</h4>
                        <p className="text-gray-600">Comprehensive evaluation of your condition using advanced diagnostic techniques</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-200">
                        <div className="w-16 h-16 bg-earthfire-clay-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">⚡</span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Targeted Treatment</h4>
                        <p className="text-gray-600">Personalized treatment plans designed specifically for your unique needs</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-200">
                        <div className="w-16 h-16 bg-earthfire-clay-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🎯</span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Long-term Wellness</h4>
                        <p className="text-gray-600">Ongoing support and maintenance to keep you healthy and pain-free</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Gallery;
