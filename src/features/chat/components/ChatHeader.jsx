import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { formatConversationType, formatPriority } from "../constants/roles";
import { getRoleIconComponent } from "../utils/chatUtils";

const ChatHeader = ({
    selectedConversation,
    onClose,
    getParticipantInfo,
    showCloseButton = false
}) => {
    if (!selectedConversation) return null;

    const participant = getParticipantInfo(selectedConversation);

    return (
        <div className="p-3 sm:p-4 lg:p-8 border-b bg-background/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-6">
                    {/* Back button for mobile */}
                    {showCloseButton && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="lg:hidden p-1 h-8 w-8"
                            onClick={onClose}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}

                    <div className="relative">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 ring-2 ring-background shadow-sm">
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm sm:text-base lg:text-lg">
                                {participant.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 p-1 sm:p-1.5 rounded-full bg-background shadow-sm">
                            {getRoleIconComponent(participant.role)}
                        </div>
                    </div>

                    <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
                        <h3 className="font-bold text-lg sm:text-xl lg:text-2xl text-foreground truncate">
                            {participant.name}
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground truncate">
                            {selectedConversation.subject}
                        </p>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-green-500"></div>
                            <span className="text-xs sm:text-sm text-muted-foreground">Online</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <Badge variant="outline" className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm hidden sm:inline-flex">
                        {formatConversationType(selectedConversation.conversation_type)}
                    </Badge>
                    {selectedConversation.priority && selectedConversation.priority !== 'normal' && (
                        <Badge
                            variant={selectedConversation.priority === 'urgent' ? 'destructive' : 'secondary'}
                            className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm"
                        >
                            {formatPriority(selectedConversation.priority)}
                        </Badge>
                    )}
                    <Badge
                        variant={selectedConversation.status === 'active' ? 'default' : 'secondary'}
                        className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm"
                    >
                        {selectedConversation.status || 'Active'}
                    </Badge>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
