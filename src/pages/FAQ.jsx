import React, { useState } from 'react';
import MainLayout from '../layouts/DefaultLayout.jsx';
import {
    FAQ_QUESTION_GENERAL,
    FAQ_TYPES_QUESTION,
    FAQ_QUESTION_ACCOUNT,
    FAQ_QUESTION_PRIVACY,
    FAQ_QUESTION_TECHNICAL,
    FAQ_QUESTION_OTHER,
} from '../constants/faq.js';

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState(null);
    const [activeType, setActiveType] = useState(FAQ_TYPES_QUESTION.types[0]);

    function getActiveFAQs() {
        switch (activeType) {
            case 'general': return FAQ_QUESTION_GENERAL;
            case 'technical': return FAQ_QUESTION_TECHNICAL;
            case 'account': return FAQ_QUESTION_ACCOUNT;
            case 'privacy': return FAQ_QUESTION_PRIVACY;
            case 'other': return FAQ_QUESTION_OTHER;
            default: return [];
        }
    }

    const toggle = (index) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    return (
        <section className="py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-center items-center gap-x-16 gap-y-5 xl:gap-28 lg:flex-row lg:justify-between max-lg:max-w-2xl mx-auto max-w-full">
                    <div className="w-full lg:w-1/2">
                        <img
                            src="https://pagedone.io/asset/uploads/1696230182.png"
                            alt="FAQ section"
                            className="w-full rounded-xl object-cover"
                        />
                    </div>

                    <div className="w-full lg:w-1/2">
                        <div className="lg:max-w-xl">
                            <div className="mb-6 lg:mb-8">
                                <h2 className="text-4xl text-center font-bold text-gray-900 leading-[3.25rem] mb-5 lg:text-left">
                                    Looking for answers?
                                </h2>
                            </div>

                            <div className="flex items-center gap-x-4 mb-6 justify-center">
                                {FAQ_TYPES_QUESTION.types.map((type, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setActiveType(type)}
                                        className="inline-flex items-center rounded-md px-6 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset focus:text-gray-900 focus:bg-gray-200 hover:text-gray-900 transition-colors duration-200"
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-4">
                                {getActiveFAQs().map((item, index) => (
                                    <div key={index} className="border rounded-lg">
                                        <button
                                            onClick={() => toggle(index)}
                                            className="w-full text-left px-5 py-4 font-medium text-gray-800 hover:bg-gray-50 focus:outline-none"
                                        >
                                            {item.question}
                                        </button>
                                        {activeIndex === index && (
                                            <div className="px-5 pb-4 text-gray-600">{item.answer}</div>
                                        )}
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}