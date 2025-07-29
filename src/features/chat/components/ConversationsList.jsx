import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Search, Plus, WifiOff } from "lucide-react";
import ConversationItem from "./ConversationItem";

const ConversationsList = ({
    conversations,
    selectedConversation,
    onSelectConversation,
    onDeleteConversation,
    onUpdateStatus,
    onNewConversation,
    searchTerm,
    onSearchChange,
    loading,
    isBackendAvailable,
    userRole,
    getParticipantInfo,
}) => {
    return (
        <div className={`${selectedConversation ? 'hidden lg:flex' : 'flex'} lg:w-96 w-full lg:border-r bg-gradient-to-b from-muted/10 to-muted/30 flex-col`}>
            {/* Header */}
            <div className="p-3 sm:p-4 lg:p-8 border-b bg-background/80 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                        <div className="p-2 sm:p-2.5 lg:p-3 rounded-lg bg-primary/10">
                            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Messages</h2>
                            <p className="text-sm sm:text-base text-muted-foreground">Stay connected with your healthcare team</p>
                        </div>
                        {!isBackendAvailable && <WifiOff className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />}
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 sm:pl-12 h-10 sm:h-12 lg:h-14 text-sm sm:text-base bg-background/60 border-muted-foreground/20 focus:border-primary"
                        disabled={!isBackendAvailable}
                    />
                </div>
            </div>

            {/* Conversations List */}
            <ScrollArea className="flex-1 px-1 sm:px-2">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-32 sm:h-48 lg:h-64 px-3 sm:px-6">
                        <div className="p-3 sm:p-4 rounded-full bg-primary/10 mb-3 sm:mb-4">
                            <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary animate-spin" />
                        </div>
                        <p className="text-sm font-medium text-foreground">Loading conversations...</p>
                        <p className="text-xs text-muted-foreground mt-1">Please wait while we fetch your messages</p>
                    </div>
                ) : !isBackendAvailable ? (
                    <div className="flex flex-col items-center justify-center h-32 sm:h-48 lg:h-64 px-3 sm:px-6 text-center">
                        <div className="p-3 sm:p-4 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-3 sm:mb-4">
                            <WifiOff className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        <p className="text-sm font-medium text-foreground">Service Unavailable</p>
                        <p className="text-xs text-muted-foreground mt-1">Chat service is temporarily offline</p>
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 sm:h-48 lg:h-64 px-3 sm:px-6 text-center">
                        <div className="p-3 sm:p-4 rounded-full bg-muted/30 mb-3 sm:mb-4">
                            <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-foreground">No conversations found</p>
                        <p className="text-xs text-muted-foreground mt-1">Start a new conversation to get started</p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 sm:mt-4 h-8 sm:h-10 text-xs sm:text-sm"
                            onClick={onNewConversation}
                            disabled={!isBackendAvailable}
                        >
                            <Plus className="h-3 w-3 mr-1 sm:mr-2" />
                            New Conversation
                        </Button>
                    </div>
                ) : (
                    <div className="py-1 sm:py-2">
                        {conversations.map((conversation) => (
                            <ConversationItem
                                key={conversation.id}
                                conversation={conversation}
                                selectedConversation={selectedConversation}
                                onSelect={onSelectConversation}
                                onDelete={onDeleteConversation}
                                onUpdateStatus={onUpdateStatus}
                                userRole={userRole}
                                getParticipantInfo={getParticipantInfo}
                            />
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
};

export default ConversationsList;
