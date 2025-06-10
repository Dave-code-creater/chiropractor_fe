import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * Inbox listing of recent messages from doctors and staff.
 */
const messages = [
    {
        from: "Dr. Ramadi",
        date: "28 May, 2025",
        text: "\u201cPlease follow up on the blood test results as soon as possible.\u201d",
    },
    {
        from: "Lab Services",
        date: "26 May, 2025",
        text: "\u201cYour recent lab results are now available in the system.\u201d",
    },
    {
        from: "Admin",
        date: "20 May, 2025",
        text: "\u201cYour next appointment has been confirmed.\u201d",
    },
];

export default function MessagesCard() {
    return (
        <Card className="col-span-3 col-start-4 row-span-4 row-start-6">
            <CardHeader>
                <CardTitle className="text-sm">Messages / Inbox</CardTitle>
            </CardHeader>
            <ScrollArea className="max-h-[300px]">
                <CardContent className="space-y-4 py-2">
                    {messages.map(({ from, date, text }) => (
                        <div key={date + from} className="hover:bg-muted rounded p-2 transition">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium text-gray-900">{from}</p>
                                <span className="text-xs text-gray-400">{date}</span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">{text}</p>
                        </div>
                    ))}
                </CardContent>
            </ScrollArea>
        </Card>
    );
}
