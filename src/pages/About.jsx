import React from "react";
import dr from "../assets/images/dr.png";

const About = () => {
    return (
        <section className=" py-24 px-6 sm:py-28 lg:px-8">
            <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left: Text Content */}
                <div className="space-y-6">
                    <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Meet Dr. Dieu Phan
                    </h2>

                    <p className="text-muted-foreground text-lg leading-relaxed">
                        I’m Dr. Dieu Phan, a dedicated chiropractor with 20+ years of experience helping patients recover after car accidents, reduce chronic pain, and live healthier lives through proven chiropractic methods.
                    </p>

                    <p className="text-muted-foreground text-lg leading-relaxed">
                        I earned my Doctor of Chiropractic from Northwestern Health Sciences University in 2005 and have been proudly serving the Denver community since then—focused on results, compassion, and long-term wellness.
                    </p>

                    <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Specialties:</h3>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li><strong>Upper extremities:</strong> shoulders, elbows, wrists, hands, spine, and headaches</li>
                            <li><strong>Lower extremities:</strong> hips, thighs, knees, ankles</li>
                            <li><strong>Muscle pain:</strong> trigger points, myofascial pain, overuse and post-traumatic injuries</li>
                        </ul>
                    </div>

                    <p className="text-muted-foreground text-lg leading-relaxed">
                        My goal is not just symptom relief — I target root causes like spinal misalignment and soft tissue dysfunction to help you restore mobility, reduce inflammation, and heal fully.
                    </p>

                    <p className="text-muted-foreground text-lg leading-relaxed">
                        I also provide ongoing wellness care to help patients stay aligned, prevent pain, and maintain a vibrant, active lifestyle.
                    </p>

                    <em className="block text-base text-muted-foreground">
                        Schedule your visit today — your path to whole-body wellness starts here.
                    </em>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button

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

                {/* Right: Image */}
                <div>
                    <img
                        src={dr}
                        alt="Dr. Dieu Phan"
                        className="rounded-xl shadow-md w-full object-cover"
                    />
                </div>
            </div>
        </section>
    );
};

export default About;