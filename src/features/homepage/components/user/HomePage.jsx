// src/features/homepage/components/user/HomePage.jsx
import React from 'react'
import AppointmentsCard from './cards/AppointmentsCard'
import DoctorNotesCard from './cards/DoctorNotesCard'
import ConditionsCard from './cards/ConditionsCard'
import MessagesCard from './cards/MessagesCard'
import BlogCard from './cards/BlogCard'
import { Link } from 'react-router-dom'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full auto-rows-fr">
                <Link to="services/appointments" className="md:col-span-1 group">
                    <AppointmentsCard />
                </Link>
                <Link to="services/doctor-notes" className="md:col-span-2 group">
                    <DoctorNotesCard />
                </Link>
                <Link to="services/initial-report" className="md:col-span-1 group">
                    <ConditionsCard />
                </Link>
                <Link to="services/inbox" className="md:col-span-1 group">
                    <MessagesCard />
                </Link>
                <Link to="services/blog" className="md:col-span-1 group">
                    <BlogCard />
                </Link>
            </div>
        </div>
    )
}