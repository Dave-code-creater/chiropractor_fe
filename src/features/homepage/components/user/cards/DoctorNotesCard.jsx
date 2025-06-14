import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotebookPen } from "lucide-react";

const notes = [
    // Uncomment to test real content
    // {
    //   avatar: "/avatars/1.png",
    //   fallback: "DE",
    //   author: "Dr Entersiliokaz",
    //   date: "03 May, 2020",
    //   text: "Added two new conditions to your record on 09 May based on recent symptoms."
    // },
    // {
    //   avatar: "/medicare-logo.png",
    //   fallback: "M",
    //   author: "Medicare",
    //   date: "24 Apr, 2020",
    //   text: <>Benefit of $132.44 processed for item <Badge variant="outline">3566</Badge></>
    // },
    // {
    //   avatar: "/avatars/2.png",
    //   fallback: "DK",
    //   author: "Dr Kalish",
    //   date: "17 Apr, 2020",
    //   text: <>Updated Alfousin dosage from 8mg to 10mg</>,
    //   extra: (
    //     <div className="mt-2 p-3 text-sm text-muted-foreground border rounded bg-muted">
    //       <em>Note:</em> Take with food. Avoid sun exposure.
    //     </div>
    //   )
    // }
];

export default function DoctorNotesCard() {
    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <NotebookPen className="w-4 h-4 text-gray-500" />
                    Doctor Notes
                </CardTitle>
            </CardHeader>

            <ScrollArea className="max-h-[300px] h-full">
                <CardContent className="h-full">
                    {notes.length > 0 ? (
                        notes.map(({ avatar, fallback, author, date, text, extra }, idx) => (
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
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-sm text-muted-foreground text-center py-6">
                            <NotebookPen className="w-6 h-6 mb-2 text-gray-400" />
                            No doctor notes available.
                        </div>
                    )}
                </CardContent>
            </ScrollArea>
        </Card>
    );
}