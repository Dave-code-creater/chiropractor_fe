import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookText } from "lucide-react";
const posts = [
    // {
    //     title: "How to manage sinus symptoms",
    //     date: "28 May, 2025",
    //     summary: "Natural remedies and modern treatments to relieve sinus pressure."
    // },
    // {
    //     title: "Benefits of seasonal checkups",
    //     date: "15 May, 2025",
    //     summary: "Why routine visits matter for long-term health."
    // },
    // {
    //     title: "Understanding chiropractic care",
    //     date: "03 May, 2025",
    //     summary: "A beginner's guide to chiropractic benefits."
    // }
];

export default function BlogCard() {
    return (
        <Card className="h-full w-full">
            <CardHeader>
                <CardTitle className="text-base font-semibold">Blog</CardTitle>
            </CardHeader>
            <ScrollArea className="max-h-[300px] h-full">
                <CardContent className="h-full">
                    {posts.length > 0 ? (
                        posts.map(({ title, date, summary }) => (
                            <div key={title} className="space-y-1 mb-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium text-gray-900">{title}</p>
                                    <span className="text-xs text-gray-400">{date}</span>
                                </div>
                                <p className="text-sm text-gray-700">{summary}</p>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-sm text-muted-foreground text-center py-6">
                            <BookText className="w-6 h-6 mb-2 text-gray-400" />
                            No blog posts available.
                        </div>
                    )}
                </CardContent>
            </ScrollArea>
        </Card>
    );
}