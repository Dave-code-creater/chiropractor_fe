import React from "react";
import dr from "../assets/images/dr.png";

const About = () => {
    return (
        <section className="relative isolate bg-gray-100 py-20 px-6 sm:py-28 lg:px-8">
            <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Doctor Bio */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-5xl">
                        Meet Dr. Dieu Phan.
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Welcome! I’m Dr. Dieu Phan, a dedicated chiropractor with over 20 years of hands-on experience
                        helping patients heal after car accidents, relieve chronic pain, and improve their quality of 
                        life through natural, proven chiropractic care. I received my Doctor of Chiropractic degree from 
                        Northwestern College of Chiropractic at Northwestern Health Sciences University in November 2005. 
                        Since then, I’ve proudly served the Denver community with a deep focus on results, compassion, and 
                        long-term recovery.
                    </p>
                    <p className="text-md text-gray-700 leading-relaxed"> 
                            
                        <h2 class="text-2xl font-semibold text-dark-800 mb-3">Specialties Include:</h2>

                            <ul class="text-md list-disc list-inside text-gray-800 space-y-1 mb-4">
                                <li class="text-lg"><strong>Upper extremities:</strong> shoulders, elbows, wrists, hands, full spine, and headaches</li>
                                <li class="text-lg"><strong>Lower extremities:</strong> hips, thighs, knees, ankles</li>
                                <li class="text-lg"><strong>Muscle pain:</strong> trigger points, myofascial pain, post-traumatic and overuse injuries</li>
                            </ul>
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        I focus not only on relieving symptoms but also on correcting the underlying cause—whether it's spinal misalignment, joint dysfunction, or soft tissue imbalance. 
                        My goal is to help you restore mobility, reduce inflammation, and support long-lasting healing.
                    </p>

                    <p className="text-lg text-gray-700 leading-relaxed">
                       I also offer Wellness Care to help patients maintain alignment, prevent future issues, and live pain-free.
                    </p>

                    <h2><em>Schedule your visit today—your path to healing and whole-body wellness starts here.</em></h2>

                    <div className="flex justify-center">
                        <a
                            href="/login"
                            className="mt-8 pt-1 px-6 bg-indigo-600 text-white font-semibold rounded shadow hover:bg-indigo-500 transition"
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