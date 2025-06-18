import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookText } from "lucide-react";
import { useFetchPostsQuery } from "@/services/blogApi";

export default function BlogCard() {
    const { data, isLoading } = useFetchPostsQuery();
    const posts = data?.metadata ?? data ?? [];

    return (
        <Card className="h-full w-full">
            <CardHeader>
                <CardTitle className="text-base font-semibold">Blog</CardTitle>
            </CardHeader>
            <ScrollArea className="max-h-[300px] h-full">
                <CardContent className="h-full">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : posts.length > 0 ? (
                        posts.map(({ id, title, date, summary }) => (
                            <div key={id || title} className="space-y-1 mb-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium text-gray-900">{title}</p>
                                    {date && <span className="text-xs text-gray-400">{date}</span>}
                                </div>
                                {summary && <p className="text-sm text-gray-700">{summary}</p>}
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