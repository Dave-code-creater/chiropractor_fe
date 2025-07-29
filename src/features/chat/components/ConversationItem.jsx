import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Clock, MoreVertical, Trash2 } from "lucide-react";
import { formatConversationType, formatPriority, canUpdateConversationStatus } from "../constants/roles";
import { formatMessageTime, getRoleIconComponent } from "../utils/chatUtils";

const ConversationItem = ({
    conversation,
    selectedConversation,
    onSelect,
    onDelete,
    onUpdateStatus,
    userRole,
    getParticipantInfo
}) => {
    const participant = getParticipantInfo(conversation);
    const unreadCount = conversation.unread_count || 0;
    const isSelected = selectedConversation?.id === conversation.id;

    const handleClick = () => {
        onSelect(conversation);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(conversation.id);
    };

    const handleUpdateStatus = (e, status) => {
        e.stopPropagation();
        onUpdateStatus(conversation.id, status);
    };

    return (
        <div
            onClick={handleClick}
            className={`mx-1 sm:mx-2 lg:mx-3 mb-2 sm:mb-3 p-3 sm:p-4 lg:p-6 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${isSelected
                    ? "bg-primary/10 border border-primary/20 shadow-md"
                    : "bg-background/60 hover:bg-muted/40 border border-transparent"
                }`}
        >
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-5">
                <div className="relative">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 ring-2 ring-background shadow-sm">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm sm:text-base lg:text-lg">
                            {participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 p-1 sm:p-1.5 rounded-full bg-background shadow-sm">
                        {getRoleIconComponent(participant.role)}
                    </div>
                </div>

                <div className="flex-1 min-w-0 space-y-1 sm:space-y-2 lg:space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 min-w-0 flex-1">
                            <h4 className="font-semibold text-sm sm:text-base text-foreground truncate">
                                {participant.name}
                            </h4>
                            <Badge variant="outline" className="text-xs px-1 sm:px-2 lg:px-3 py-0.5 sm:py-1 hidden sm:inline-flex">
                                {formatConversationType(conversation.conversation_type)}
                            </Badge>
                        </div>
                        {conversation.priority && conversation.priority !== 'normal' && (
                            <Badge
                                variant={conversation.priority === 'urgent' ? 'destructive' : 'secondary'}
                                className="text-xs px-1 sm:px-2 py-0.5 sm:py-1 ml-1"
                            >
                                {formatPriority(conversation.priority)}
                            </Badge>
                        )}
                    </div>

                    <p className="text-sm sm:text-base font-medium text-foreground truncate">
                        {conversation.subject}
                    </p>

                    {conversation.last_message && (
                        <p className="text-xs sm:text-sm text-muted-foreground truncate leading-relaxed">
                            {conversation.last_message}
                        </p>
                    )}

                    <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                            {formatMessageTime(conversation.last_message_at || conversation.updated_at)}
                        </span>

                        <div className="flex items-center gap-1 sm:gap-2">
                            {unreadCount > 0 && (
                                <Badge variant="destructive" className="text-xs h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center shadow-sm">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </Badge>
                            )}

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-5 w-5 sm:h-6 sm:w-6 p-0 hover:bg-muted/60">
                                        <MoreVertical className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40 sm:w-48">
                                    {canUpdateConversationStatus(userRole) && conversation.status === 'active' && (
                                        <DropdownMenuItem
                                            onClick={(e) => handleUpdateStatus(e, 'closed')}
                                            className="text-xs sm:text-sm"
                                        >
                                            Close Conversation
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                        onClick={handleDelete}
                                        className="text-destructive text-xs sm:text-sm"
                                    >
                                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConversationItem;
