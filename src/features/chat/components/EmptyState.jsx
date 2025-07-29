import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Plus, WifiOff } from "lucide-react";

const EmptyState = ({
    type = "no-conversation",
    onNewConversation,
    isBackendAvailable = true
}) => {
    if (type === "no-conversation") {
        return (
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="text-center max-w-sm sm:max-w-md mx-auto">
                    <div className="relative mb-6 sm:mb-8">
                        <div className="p-4 sm:p-5 lg:p-6 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 mx-auto w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center">
                            <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary" />
                        </div>
                        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 p-1.5 sm:p-2 rounded-full bg-background border shadow-sm">
                            <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                        </div>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-foreground">
                        No conversation selected
                    </h3>
                    <p className="text-muted-foreground mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                        Choose a conversation from the sidebar to start chatting, or create a new conversation to connect with your healthcare team.
                    </p>
                    <div className="space-y-2 sm:space-y-3">
                        <Button
                            onClick={onNewConversation}
                            disabled={!isBackendAvailable}
                            className="h-10 sm:h-12 px-4 sm:px-6 text-sm font-medium shadow-sm"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Start New Conversation
                        </Button>
                        {!isBackendAvailable && (
                            <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center justify-center gap-2">
                                <WifiOff className="h-3 w-3" />
                                Chat service is currently offline
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (type === "no-messages") {
        return (
            <div className="flex flex-col items-center justify-center h-40 sm:h-60 lg:h-80 text-center">
                <div className="p-4 sm:p-5 lg:p-6 rounded-full bg-muted/30 mb-4 sm:mb-6">
                    <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-muted-foreground" />
                </div>
                <p className="text-base sm:text-lg font-medium text-foreground">No messages yet</p>
                <p className="text-sm sm:text-base text-muted-foreground mt-2">
                    Start the conversation below to begin chatting
                </p>
            </div>
        );
    }

    if (type === "service-unavailable") {
        return (
            <div className="flex flex-col items-center justify-center h-32 sm:h-48 lg:h-64 px-3 sm:px-6 text-center">
                <div className="p-3 sm:p-4 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-3 sm:mb-4">
                    <WifiOff className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <p className="text-sm font-medium text-foreground">Service Unavailable</p>
                <p className="text-xs text-muted-foreground mt-1">Chat service is temporarily offline</p>
            </div>
        );
    }

    return null;
};

export default EmptyState;
