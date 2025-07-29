import React from "react";
import Testimonials from "../components/common/Landing/Testimonials";

export default function TestimonialsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            What Our Patients Say
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Real stories from real patients who have experienced the transformative care at our clinic
                        </p>
                    </div>
                </div>
            </div>

            {/* Testimonials Component */}
            <Testimonials />

            {/* Additional Patient Stories Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            More Patient Success Stories
                        </h2>
                        <p className="text-lg text-gray-600">
                            Discover how our comprehensive care has helped patients achieve their health goals
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Quick testimonial cards */}
                        {[
                            {
                                name: "Jennifer Martinez",
                                condition: "Lower Back Pain",
                                result: "90% pain reduction in 6 weeks",
                                quote: "I can finally play with my kids again without constant pain."
                            },
                            {
                                name: "Robert Kim",
                                condition: "Neck Stiffness",
                                result: "Full mobility restored",
                                quote: "The personalized treatment plan was exactly what I needed."
                            },
                            {
                                name: "Lisa Wang",
                                condition: "Sports Injury",
                                result: "Returned to marathon training",
                                quote: "Dr. Phan helped me come back stronger than ever."
                            },
                            {
                                name: "Tom Anderson",
                                condition: "Chronic Headaches",
                                result: "Headache-free for 3 months",
                                quote: "Life-changing treatment. I wish I had come sooner."
                            },
                            {
                                name: "Maria Gonzalez",
                                condition: "Shoulder Pain",
                                result: "Full range of motion",
                                quote: "Professional, caring, and incredibly effective treatment."
                            },
                            {
                                name: "James Mitchell",
                                condition: "Sciatica",
                                result: "Pain eliminated",
                                quote: "The comprehensive approach made all the difference."
                            }
                        ].map((story, index) => (
                            <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition duration-200">
                                <div className="mb-4">
                                    <h3 className="font-semibold text-gray-900">{story.name}</h3>
                                    <p className="text-sm text-blue-600 font-medium">{story.condition}</p>
                                </div>
                                <div className="mb-4">
                                    <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full inline-block">
                                        {story.result}
                                    </div>
                                </div>
                                <blockquote className="text-gray-700 italic">
                                    "{story.quote}"
                                </blockquote>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-blue-600">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Start Your Healing Journey?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join thousands of patients who have found relief and improved their quality of life
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-50 transition duration-200 transform hover:scale-105">
                            Schedule Consultation
                        </button>
                        <button className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition duration-200">
                            Learn More About Our Services
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
