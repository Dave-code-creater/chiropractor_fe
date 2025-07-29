import React from "react";
import { StarIcon } from "@heroicons/react/24/solid";

const testimonials = [
    {
        id: 1,
        name: "Side Hustle Addict",
        username: "@Side Hustle Addict",
        rating: 5,
        text: "Dr. Phan is an excellent chiropractor. He takes his time to treat his patients. He has a lot of attention to details when working with his patients. I highly recommend anyone with an auto accident to come give him a shot.",
        date: "2018"
    },
    {
        id: 2,
        name: "Joe Pineda",
        username: "@Joe Pineda",
        rating: 5,
        text: "Dr. Phan and his team are wonderful! His team of professionals are friendly, helpful and care about our well being. Dr. Phan gave wonderful advice and listened to our needs. I would highly recommend his facility for anyone that had a car accident or just needs chiropractic care.",
        date: "2015"
    },
    {
        id: 3,
        name: "Kitty Tran",
        username: "@Kitty Tran",
        rating: 5,
        text: "Dr. Phan is a good chiropractor.",
        date: "2022"
    },
    {
        id: 4,
        name: "Zulyn Monge",
        username: "@Zulyn Monge",
        rating: 4,
        text: "Professional and caring service. Dr. Phan provides excellent chiropractic care with attention to detail.",
        date: "2017"
    }
];

export default function Testimonials() {
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <StarIcon
                key={i}
                className={`h-4 w-4 ${i < rating ? 'text-amber-400' : 'text-gray-300'}`}
            />
        ));
    };

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">

                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Meet our happy clients
                    </h2>
                    <p className="text-lg text-gray-600 mb-6">
                        Here are some of the testimonials from our satisfied clients.
                    </p>

                </div>

                {/* Scrolling Testimonials Banner */}
                <div className="relative overflow-hidden">
                    <div className="flex animate-scroll space-x-6">
                        {/* First set of testimonials */}
                        {testimonials.map((testimonial) => (
                            <div
                                key={`first-${testimonial.id}`}
                                className="bg-white border border-indigo-200 rounded-2xl p-6 min-w-[400px] shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                        <p className="text-sm text-indigo-600">{testimonial.username}</p>
                                    </div>
                                </div>

                                <div className="flex items-center mb-3">
                                    {renderStars(testimonial.rating)}
                                </div>

                                <p className="text-gray-700 text-sm leading-relaxed">
                                    "{testimonial.text}"
                                </p>

                                <p className="text-xs text-gray-500 mt-3">{testimonial.date}</p>
                            </div>
                        ))}

                        {/* Duplicate set for seamless scrolling */}
                        {testimonials.map((testimonial) => (
                            <div
                                key={`second-${testimonial.id}`}
                                className="bg-white border border-indigo-200 rounded-2xl p-6 min-w-[400px] shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                        <p className="text-sm text-indigo-600">{testimonial.username}</p>
                                    </div>
                                </div>

                                <div className="flex items-center mb-3">
                                    {renderStars(testimonial.rating)}
                                </div>

                                <p className="text-gray-700 text-sm leading-relaxed">
                                    "{testimonial.text}"
                                </p>

                                <p className="text-xs text-gray-500 mt-3">{testimonial.date}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                
                .animate-scroll {
                    animation: scroll 30s linear infinite;
                    width: calc(400px * 8 + 6 * 24px); /* 8 cards + gaps */
                }
                
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
