import React, { useState } from 'react'
import { Calendar } from "@/components/ui/calendar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Assuming you're using shadcn's Button

function Homepage() {
    const [rescheduling, setRescheduling] = useState(false)

    return (
        <div>


            <div className="min-h-screen bg-gray-100 p-6 font-sans grid grid-cols-9 grid-rows-9 gap-2 w-full">

                {/* Notification Bar */}
                <Alert className="col-span-9 row-span-1">
                    <AlertTitle className="text-sm text-blue-800 font-medium">Heads up!</AlertTitle>
                    <AlertDescription>
                        You can add components and dependencies to your app using the CLI.
                    </AlertDescription>
                </Alert>

                {/* Appointments */}
                <Card className="col-span-3 col-start-1 row-span-4 row-start-2">
                    <CardHeader>
                        <CardTitle className="text-sm">Appointments</CardTitle>
                    </CardHeader>

                    {!rescheduling ? (
                        <CardContent className="space-y-3 text-sm text-gray-700">

                            {/* Doctor Info */}
                            <div className="flex items-center gap-2">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src="/avatars/1.png" />
                                    <AvatarFallback>RE</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">Dr Ramadi Entersiliokaz</p>
                                    <p className="text-xs text-gray-500">Gastroenterologist</p>
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div>
                                <p><strong>Date:</strong> Friday 17 May, 2020</p>
                                <p className="flex items-center gap-2">
                                    <strong>Time:</strong> 9:30am - 10:00am <span className="text-xs text-blue-500">⏱ 30mins</span>
                                </p>
                            </div>

                            {/* Address & Interests */}
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <p className="font-medium text-xs text-gray-500">Address</p>
                                    <p>Suite 405, Level 4/188<br />Edward St, Sydney<br />NSW</p>
                                </div>
                                <div>
                                    <p className="font-medium text-xs text-gray-500">Areas of Interest</p>
                                    <ul className="list-disc list-inside text-sm">
                                        <li>Mens health</li>
                                        <li>Travel medicine</li>
                                        <li>Travel advice</li>
                                        <li>General practice</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between pt-4">
                                <button className="text-sm text-gray-600 hover:underline">Cancel Booking</button>
                                <button onClick={() => setRescheduling(true)} className="text-sm text-blue-500 hover:underline">
                                    Reschedule
                                </button>
                            </div>

                        </CardContent>
                    ) : (
                        <CardContent className="flex flex-col justify-between">
                            <div className="flex-1 flex flex-col items-center justify-center h-full">
                                <Calendar />
                            </div>
                            <div className="flex justify-between py-4">
                                <button className="text-sm text-gray-600 hover:underline">Cancel Booking</button>
                                <button onClick={() => setRescheduling(false)} className="text-sm text-blue-500 hover:underline">
                                    Back
                                </button>
                            </div>
                        </CardContent>
                    )}
                </Card>

                <Card className="col-span-6 col-start-4 row-span-4 row-start-2">
                    <CardHeader>
                        <CardTitle className="text-sm">Doctor Notes</CardTitle>
                    </CardHeader>
                    <ScrollArea className="h-full max-h-[300px]">
                        <CardContent className="h-full">
                            {/* Entry 1 */}
                            <div className="flex items-start gap-4 mb-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src="/avatars/1.png" />
                                    <AvatarFallback>DE</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Dr Entersiliokaz</p>
                                        <span className="text-xs text-muted-foreground">03 May, 2020</span>
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        Dr Ramadi Entersiliokaz added two new conditions to your health record on the 09 May regarding your symptoms.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 mb-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src="/avatars/1.png" />
                                    <AvatarFallback>DE</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Dr Entersiliokaz</p>
                                        <span className="text-xs text-muted-foreground">03 May, 2020</span>
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        Dr Ramadi Entersiliokaz added two new conditions to your health record on the 09 May regarding your symptoms.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 mb-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src="/avatars/1.png" />
                                    <AvatarFallback>DE</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Dr Entersiliokaz</p>
                                        <span className="text-xs text-muted-foreground">03 May, 2020</span>
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        Dr Ramadi Entersiliokaz added two new conditions to your health record on the 09 May regarding your symptoms.
                                    </p>
                                </div>
                            </div>

                            {/* Entry 2 */}
                            <div className="flex items-start gap-4 mb-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src="/medicare-logo.png" />
                                    <AvatarFallback>M</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Medicare</p>
                                        <span className="text-xs text-muted-foreground">24 Apr, 2020</span>
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        Medicare has sent a benefit of $132.44 for item <Badge variant="outline">3566</Badge>
                                    </p>
                                </div>
                            </div>

                            {/* Entry 3 */}
                            <div className="flex items-start gap-4 mb-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src="/avatars/2.png" />
                                    <AvatarFallback>DK</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Dr Kalish</p>
                                        <span className="text-xs text-muted-foreground">17 Apr, 2020</span>
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        Dr Kalish has updated the prescription of <Badge variant="outline">Alfousin</Badge> from 8mg to 10mg
                                    </p>
                                    <div className="mt-2 p-3 text-sm text-muted-foreground border rounded bg-muted">
                                        <em>Note:</em> This increase should help manage some of the pain as well as the inflammation.
                                        Be sure to take with food and try and avoid direct sun exposure if possible.
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </ScrollArea>
                </Card>

                {/* Current Conditions */}
                <Card className="col-span-3 col-start-1 row-span-4 row-start-6">
                    <CardHeader>
                        <CardTitle className="text-sm">Current Conditions</CardTitle>
                    </CardHeader>
                    <ScrollArea className="max-h-[300px]">
                        <CardContent className="space-y-4 py-2">

                            {/* Condition 1 */}
                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium text-gray-900">Sinusitis</p>
                                    <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">
                                        Moderate
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700">
                                    Inflammation of the nasal passages causing congestion and discomfort.
                                </p>
                                <p className="text-xs text-gray-500">Primary: Dr Steven Kalish</p>
                            </div>

                            {/* Condition 2 */}
                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium text-gray-900">Hypertension</p>
                                    <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">
                                        Severe
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700">
                                    Elevated blood pressure requiring medication and monitoring.
                                </p>
                                <p className="text-xs text-gray-500">Primary: Dr Amanda Chu</p>
                            </div>

                            {/* Condition 3 */}
                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium text-gray-900">Vitamin D Deficiency</p>
                                    <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                                        Mild
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700">
                                    Low vitamin D levels affecting bone health and immunity.
                                </p>
                                <p className="text-xs text-gray-500">Primary: Dr Steven Kalish</p>
                            </div>

                        </CardContent>
                    </ScrollArea>
                </Card>

                {/* Messages / Inbox */}
                <Card className="col-span-3 col-start-4 row-span-4 row-start-6">
                    <CardHeader>
                        <CardTitle className="text-sm">Messages / Inbox</CardTitle>
                    </CardHeader>
                    <ScrollArea className="max-h-[300px]">
                        <CardContent className="space-y-4 py-2">

                            {/* Message 1 */}
                            <div className="hover:bg-muted rounded p-2 transition">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium text-gray-900">Dr. Ramadi</p>
                                    <span className="text-xs text-gray-400">28 May, 2025</span>
                                </div>
                                <p className="text-sm text-gray-700 mt-1">
                                    “Please follow up on the blood test results as soon as possible.”
                                </p>
                            </div>

                            {/* Message 2 */}
                            <div className="hover:bg-muted rounded p-2 transition">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium text-gray-900">Lab Services</p>
                                    <span className="text-xs text-gray-400">26 May, 2025</span>
                                </div>
                                <p className="text-sm text-gray-700 mt-1">
                                    “Your recent lab results are now available in the system.”
                                </p>
                            </div>

                            {/* Message 3 */}
                            <div className="hover:bg-muted rounded p-2 transition">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium text-gray-900">Admin</p>
                                    <span className="text-xs text-gray-400">20 May, 2025</span>
                                </div>
                                <p className="text-sm text-gray-700 mt-1">
                                    “Your next appointment has been confirmed.”
                                </p>
                            </div>

                        </CardContent>
                    </ScrollArea>
                </Card>

                {/* Blog */}
                <Card className="col-span-3 col-start-7 row-span-4 row-start-6">
                    <CardHeader>
                        <CardTitle className="text-sm">Blog</CardTitle>
                    </CardHeader>
                    <ScrollArea className="max-h-[300px]">
                        <CardContent className="space-y-4 py-2">

                            {/* Blog Post 1 */}
                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium text-gray-900">How to manage sinus symptoms</p>
                                    <span className="text-xs text-gray-400">28 May, 2025</span>
                                </div>
                                <p className="text-sm text-gray-700">
                                    Natural remedies and modern treatments to relieve sinus pressure and improve breathing.
                                </p>
                            </div>

                            {/* Blog Post 2 */}
                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium text-gray-900">Benefits of seasonal checkups</p>
                                    <span className="text-xs text-gray-400">15 May, 2025</span>
                                </div>
                                <p className="text-sm text-gray-700">
                                    Learn why routine visits matter for long-term health and chronic issue prevention.
                                </p>
                            </div>

                            {/* Blog Post 3 */}
                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium text-gray-900">Understanding chiropractic care</p>
                                    <span className="text-xs text-gray-400">03 May, 2025</span>
                                </div>
                                <p className="text-sm text-gray-700">
                                    A beginner-friendly guide to what chiropractors do and how it can help.
                                </p>
                            </div>

                        </CardContent>
                    </ScrollArea>
                </Card>
            </div>
        </div >
    )
}

export default Homepage