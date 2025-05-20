import React from "react";
import dr from "../assets/images/dr.png";

const About = () => {
    return (
        <section className="relative isolate bg-gray-100 py-20 px-6 sm:py-28 lg:px-8">
            <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Doctor Bio */}
                <div className="space-y-6">
                    <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                        Meet Dr. Dieu Phan - Denver Trusted Chiropractor for Car Accident Recovery and Wellness Care.
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Welcome! I’m Dr. Dieu Phan, a dedicated chiropractor with over 20 years of hands-on experience
                        helping patients heal after car accidents, relieve chronic pain, and improve their quality of 
                        life through natural, proven chiropractic care. I received my Doctor of Chiropractic degree from 
                        Northwestern College of Chiropractic at Northwestern Health Sciences University in November 2005. 
                        Since then, I’ve proudly served the Denver community with a deep focus on results, compassion, and 
                        long-term recovery.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed"> 
                        My approach to care is rooted in personalized treatment plans tailored to each patient’s needs—whether 
                        they’re recovering from a collision, suffering from joint or muscle pain, or seeking preventive wellness care.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed"> 
                            
                                <h2 class="text-3xl font-bold text-dark-900 mb-6">My Areas of Specialization:</h2>

                                <div class="mb-6">
                                    <h3 class="text-xl font-semibold text-dark-800 mb-2">Upper Extremities including spine and head:</h3>
                                        <ul class="list-disc list-inside text-gray-800 space-y-1">
                                            <li>Shoulders, elbows, wrists, and hands</li>
                                            <li>Entire back – upper, mid, and lower regions</li>
                                            <li>Headaches and migraines related to neck or spinal misalignment</li>
                                        </ul>
                                </div>

                                {/* <!-- Lower Extremities --> */}
                                <div class="mb-6">
                                    <h3 class="text-xl font-semibold text-dark-800 mb-2">Lower Extremities:</h3>
                                    <ul class="list-disc list-inside text-gray-800 space-y-1">
                                        <li>Hips, thighs, knees, and ankles</li>
                                    </ul>
                                </div>

                                {/* <!-- Muscle Pain Treatment --> */}
                                <div class="mb-6">
                                    <h3 class="text-xl font-semibold text-dark-800 mb-2">Comprehensive Muscle Pain Treatment:</h3>
                                        <ul class="list-disc list-inside text-gray-800 space-y-1">
                                            <li>Trigger Point Pain</li>
                                            <li>Myofascial Pain Syndrome</li>
                                            <li>Strain and Overuse Injuries</li>
                                            <li>Post-Traumatic Muscle Imbalance</li>
                                            <li>Tension and Stress-Related Muscle Pain</li>
                                        </ul>
                                    </div>
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        I focus not only on relieving symptoms but also on correcting the underlying cause—whether it's spinal misalignment, joint dysfunction, or soft tissue imbalance. 
                        My goal is to help you restore mobility, reduce inflammation, and support long-lasting healing.
                    </p>

                    
                    <p className="text-lg text-gray-700 leading-relaxed">
                        In addition to injury care, I offer Wellness Chiropractic Services for patients who want to maintain their health and prevent future problems. 
                        Just like routine dental or vision checkups, regular chiropractic visits can detect small imbalances before they become major issues. 
                        This type of care is ideal for health-conscious adults and families who want to stay aligned, active, and pain-free.
                    </p>

                    <p className="text-lg text-gray-700 leading-relaxed">
                        Whether you're recovering from an auto injury, managing ongoing discomfort, or looking to improve your long-term wellness, you deserve care that’s experienced, trusted, and focused on results.
                    </p>

                    <h2><em>Schedule your visit today—your path to healing and whole-body wellness starts here.</em></h2>

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
                        className="rounded-2xl shadow-xl w-full object-cover "
                    />
                </div>
            </div>
        </section>
    );
};

export default About;