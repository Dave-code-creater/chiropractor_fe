import React from "react";
import dr from "../assets/images/dr.png";

const About = () => {
    return (
        <section className="relative isolate bg-gray-100 py-20 px-6 sm:py-28 lg:px-8">
            <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Doctor Bio */}
                <div className="space-y-6">
                    <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                        Hi! I'm Dr. Dieu Phan D.C.
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Hi, my name is Dieu Phan and I am a chiropractor. I completed my Doctor of Chiropractic at the Canadian Memorial Chiropractic College and earned my Bachelor of Kinesiology from the University of Toronto.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        I have been involved in sports and wellness for most of my life. My experience has taught me how powerful personalized care can be in transforming lives. I’m passionate about helping patients reach their goals through tailored treatments, deep tissue release, mobilization, adjustments, and acupuncture.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        When I’m not in the clinic, you’ll find me running, training, or exploring new adventures. My aim is to empower every patient to live stronger, move better, and enjoy pain-free movement.
                    </p>
                    <div className="flex justify-center">
                        <a
                            href="/login"
                            className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded shadow hover:bg-indigo-500 transition"
                        >
                            Book Your Appointment
                        </a>
                    </div>
                </div>

                {/* Doctor Image */}
                <div className="w-full">
                    <img
                        src={dr}
                        alt="Dr. Dieu Phan"
                        className="rounded-3xl shadow-xl w-full object-cover"
                    />
                </div>
            </div>
        </section>
    );
};

export default About;