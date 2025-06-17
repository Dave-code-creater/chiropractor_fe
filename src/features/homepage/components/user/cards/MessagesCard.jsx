import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Inbox } from "lucide-react";

const messages = [
    // Example messages structure
    // {
    //     from: "Dr Entersiliokaz",
    //     date: "03 May, 2020",
    //     text: "Your appointment has been confirmed for 09 May at 9:30am."
    // },
    // {
    //     from: "Medicare",
    //     date: "24 Apr, 2020",
    //     text: "Benefit of $132.44 processed for item 3566."
    // },
    // {
    //     from: "Dr Kalish",
    //     date: "17 Apr, 2020",
    //     text: "Updated Alfousin dosage from 8mg to 10mg."
    // }
]; 

export default function MessagesCard() {
    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle className="text-base font-semibold">Messages / Inbox</CardTitle>
            </CardHeader>

            <ScrollArea className="h-full max-h-[300px]">
                <CardContent className="h-full">
                    {messages.length > 0 ? (
                        messages.map(({ from, date, text }) => (
                            <div key={date + from} className="hover:bg-muted rounded p-2 transition">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium text-gray-900">{from}</p>
                                    <span className="text-xs text-gray-400">{date}</span>
                                </div>
                                <p className="text-sm text-gray-700 mt-1">{text}</p>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-sm text-muted-foreground text-center py-6">
                            <Inbox className="w-6 h-6 mb-2 text-gray-400" />
                            You have no messages at the moment.
                        </div>
                    )}
                </CardContent>
            </ScrollArea>
        </Card>
    );
}