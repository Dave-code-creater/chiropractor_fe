import React from 'react'
import Hero from '../components/common/Landing/Hero'
import Services from '../components/common/Landing/Services'
import Review from '../components/common/Landing/Review'
import About from './About'

export default function LandingPage() {
    return (
        <div className="bg-gray-100">
            <Hero />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <About />
            </div>
            <Services />
            <Review />
        </div>
    )
}
