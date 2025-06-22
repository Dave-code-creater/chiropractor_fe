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
        <Card className="w-full h-full border-0 shadow-lg bg-gradient-to-br from-card to-muted/20 hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] backdrop-blur-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Inbox className="w-4 h-4 text-primary" />
                    </div>
                    Messages / Inbox
                </CardTitle>
            </CardHeader>

            <ScrollArea className="h-full max-h-[300px]">
                <CardContent className="h-full">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : messages.length > 0 ? (
                        messages.map((convo) => {
                            const other = convo.participants?.find((p) => p !== userId) || "Unknown";
                            return (
                                <div key={convo.id || convo._id || other} className="mb-3 p-4 rounded-lg bg-background/50 border border-border/50 hover:bg-background/70 transition-all duration-200">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm font-medium text-foreground">{other}</p>
                                        {convo.updatedAt && (
                                            <span className="text-xs text-muted-foreground">{new Date(convo.updatedAt).toLocaleDateString()}</span>
                                        )}
                                    </div>
                                    {convo.lastMessage && (
                                        <p className="text-xs text-muted-foreground mt-1 truncate">{convo.lastMessage}</p>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <div className="p-4 rounded-full bg-muted/50 mb-4">
                                <Inbox className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <p className="text-sm text-muted-foreground">You have no messages at the moment.</p>
                        </div>
                    )}
                </CardContent>
            </ScrollArea>
        </Card>
    );
}