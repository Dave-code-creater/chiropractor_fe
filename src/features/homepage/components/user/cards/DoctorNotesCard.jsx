import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * Displays recent notes added by doctors or other providers.
 */
const notes = [
    {
        avatar: "/avatars/1.png",
        fallback: "DE",
        author: "Dr Entersiliokaz",
        date: "03 May, 2020",
        text: "Dr Ramadi Entersiliokaz added two new conditions to your health record on the 09 May regarding your symptoms."
    },
    {
        avatar: "/avatars/1.png",
        fallback: "DE",
        author: "Dr Entersiliokaz",
        date: "03 May, 2020",
        text: "Dr Ramadi Entersiliokaz added two new conditions to your health record on the 09 May regarding your symptoms."
    },
    {
        avatar: "/avatars/1.png",
        fallback: "DE",
        author: "Dr Entersiliokaz",
        date: "03 May, 2020",
        text: "Dr Ramadi Entersiliokaz added two new conditions to your health record on the 09 May regarding your symptoms."
    },
    {
        avatar: "/medicare-logo.png",
        fallback: "M",
        author: "Medicare",
        date: "24 Apr, 2020",
        text: (
            <>
                Medicare has sent a benefit of $132.44 for item <Badge variant="outline">3566</Badge>
            </>
        )
    },
    {
        avatar: "/avatars/2.png",
        fallback: "DK",
        author: "Dr Kalish",
        date: "17 Apr, 2020",
        text: (
            <>Dr Kalish has updated the prescription of <Badge variant="outline">Alfousin</Badge> from 8mg to 10mg</>
        ),
        extra: (
            <div className="mt-2 p-3 text-sm text-muted-foreground border rounded bg-muted">
                <em>Note:</em> This increase should help manage some of the pain as well as the inflammation.
                Be sure to take with food and try and avoid direct sun exposure if possible.
            </div>
        )
    }
];

export default function DoctorNotesCard() {
    return (
        <Card className="col-span-6 col-start-4 row-span-4 row-start-2">
            <CardHeader>
                <CardTitle className="text-sm">Doctor Notes</CardTitle>
            </CardHeader>
            <ScrollArea className="h-full max-h-[300px]">
                <CardContent className="h-full">
                    {notes.map(({ avatar, fallback, author, date, text, extra }, idx) => (
                        <div key={idx} className="flex items-start gap-4 mb-4">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={avatar} />
                                <AvatarFallback>{fallback}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">{author}</p>
                                    <span className="text-xs text-muted-foreground">{date}</span>
                                </div>
                                <p className="text-sm text-gray-700">{text}</p>
                                {extra}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </ScrollArea>
        </Card>
    );
}
