import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Inbox } from "lucide-react";
import { useGetConversationsQuery } from "@/services/chatApi";
import { useSelector } from "react-redux";

export default function MessagesCard() {
    const userId = useSelector((state) => state.data.auth.userID);
    const { data, isLoading } = useGetConversationsQuery();
    const messages = data?.metadata ?? data ?? [];
    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle className="text-base font-semibold">Messages / Inbox</CardTitle>
            </CardHeader>

            <ScrollArea className="h-full max-h-[300px]">
                <CardContent className="h-full">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : messages.length > 0 ? (
                        messages.map((convo) => {
                            const other = convo.participants?.find((p) => p !== userId) || "Unknown";
                            return (
                                <div key={convo.id || convo._id || other} className="hover:bg-muted rounded p-2 transition">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm font-medium text-gray-900">{other}</p>
                                        {convo.updatedAt && (
                                            <span className="text-xs text-gray-400">{new Date(convo.updatedAt).toLocaleDateString()}</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
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