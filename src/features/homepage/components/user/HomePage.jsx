import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AppointmentsCard from './cards/AppointmentsCard';
import DoctorNotesCard from './cards/DoctorNotesCard';
import ConditionsCard from './cards/ConditionsCard';
import MessagesCard from './cards/MessagesCard';
import BlogCard from './cards/BlogCard';

/**
 * Main user homepage layout assembling the different cards.
 */
export default function HomePage() {
    return (
        <div>
            <div className="min-h-screen bg-gray-100 p-6 font-sans grid grid-cols-9 grid-rows-9 gap-2 w-full">
                {/* Notification Bar */}
                <Alert className="col-span-9 row-span-1">
                    <AlertTitle className="text-sm text-blue-800 font-medium">Heads up!</AlertTitle>
                    <AlertDescription>You can add components and dependencies to your app using the CLI.</AlertDescription>
                </Alert>

                {/* Individual sections */}
                <AppointmentsCard />
                <DoctorNotesCard />
                <ConditionsCard />
                <MessagesCard />
                <BlogCard />
            </div>
        </div>
    );
}
