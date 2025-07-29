import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Clock, Check, CheckCheck } from "lucide-react";
import { formatMessageTime } from "../utils/chatUtils";

const MessagesList = ({
    messages,
    loading,
    currentUserId,
    userRole
}) => {
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages.length]);

    if (loading) {
        return (
            <ScrollArea className="flex-1 p-3 sm:p-4 lg:p-8">
                <div className="flex flex-col items-center justify-center h-40 sm:h-60 lg:h-80">
                    <div className="p-4 sm:p-5 lg:p-6 rounded-full bg-primary/10 mb-4 sm:mb-6">
                        <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary animate-spin" />
                    </div>
                    <p className="text-base sm:text-lg font-medium text-foreground">Loading messages...</p>
                    <p className="text-sm sm:text-base text-muted-foreground mt-2">Please wait while we fetch your conversation</p>
                </div>
            </ScrollArea>
        );
    }

    if (messages.length === 0) {
        return (
            <ScrollArea className="flex-1 p-3 sm:p-4 lg:p-8">
                <div className="flex flex-col items-center justify-center h-40 sm:h-60 lg:h-80 text-center">
                    <div className="p-4 sm:p-5 lg:p-6 rounded-full bg-muted/30 mb-4 sm:mb-6">
                        <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-muted-foreground" />
                    </div>
                    <p className="text-base sm:text-lg font-medium text-foreground">No messages yet</p>
                    <p className="text-sm sm:text-base text-muted-foreground mt-2">Start the conversation below to begin chatting</p>
                </div>
            </ScrollArea>
        );
    }

    return (
        <ScrollArea className="flex-1 p-3 sm:p-4 lg:p-8">
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                {messages.map((message) => {
                    const isCurrentUser = message.sender_id === currentUserId || message.sender_type === userRole;

                    return (
                        <div
                            key={message.id}
                            className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`max-w-[85%] sm:max-w-md lg:max-w-lg ${isCurrentUser ? "order-2" : "order-1"}`}>
                                <div
                                    className={`px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 rounded-2xl shadow-sm ${isCurrentUser
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-background border"
                                        }`}
                                >
                                    <p className="text-sm sm:text-base leading-relaxed">
                                        {message.message_content || message.content}
                                    </p>
                                </div>
                                <div className={`flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground ${isCurrentUser ? "justify-end" : "justify-start"
                                    }`}>
                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span>{formatMessageTime(message.sent_at || message.created_at)}</span>
                                    {isCurrentUser && (
                                        <div className="flex items-center ml-1 sm:ml-2">
                                            {message.is_read || message.read_at ? (
                                                <CheckCheck className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                                            ) : (
                                                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
        </ScrollArea>
    );
};

export default MessagesList;
