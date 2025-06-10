import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * Simple list of blog posts for the homepage.
 */
const posts = [
    {
        title: "How to manage sinus symptoms",
        date: "28 May, 2025",
        summary: "Natural remedies and modern treatments to relieve sinus pressure and improve breathing."
    },
    {
        title: "Benefits of seasonal checkups",
        date: "15 May, 2025",
        summary: "Learn why routine visits matter for long-term health and chronic issue prevention."
    },
    {
        title: "Understanding chiropractic care",
        date: "03 May, 2025",
        summary: "A beginner-friendly guide to what chiropractors do and how it can help."
    }
];

export default function BlogCard() {
    return (
        <Card className="col-span-3 col-start-7 row-span-4 row-start-6">
            <CardHeader>
                <CardTitle className="text-sm">Blog</CardTitle>
            </CardHeader>
            <ScrollArea className="max-h-[300px]">
                <CardContent className="space-y-4 py-2">
                    {posts.map(({ title, date, summary }) => (
                        <div key={title} className="space-y-1">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium text-gray-900">{title}</p>
                                <span className="text-xs text-gray-400">{date}</span>
                            </div>
                            <p className="text-sm text-gray-700">{summary}</p>
                        </div>
                    ))}
                </CardContent>
            </ScrollArea>
        </Card>
    );
}
