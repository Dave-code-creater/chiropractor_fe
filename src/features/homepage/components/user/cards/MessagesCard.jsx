import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Inbox, MessageCircle, User, Stethoscope, AlertCircle, ExternalLink, ChevronRight } from "lucide-react";
import { useGetConversationsQuery } from "@/api/services/chatApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function MessagesCard() {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.userID);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Navigation handlers
  const handleNavigateToChat = () => {
    navigate('/chat');
  };
  
  // API query - using exact same pattern as NewChat component
  const { 
    data: conversationsData, 
    isLoading, 
    error 
  } = useGetConversationsQuery({ 
    limit: 10,
    status: 'active'
  }, { 
    skip: !isAuthenticated || !userId
  });



  // Extract conversations using the same helper function from NewChat
  const extractDataFromResponse = (data) => {
    if (!data) return [];
    
    if (Array.isArray(data)) return data;
    
    // Handle API response structure from your backend
    if (data.data) {
      if (Array.isArray(data.data)) return data.data;
      if (data.data.conversations) return data.data.conversations;
      if (data.data.messages) return data.data.messages;
      if (data.data.users) return data.data.users;
    }
    
    if (data.conversations) return data.conversations;
    if (data.messages) return data.messages;
    if (data.users) return data.users;
    if (data.metadata) {
      if (Array.isArray(data.metadata)) return data.metadata;
      if (data.metadata.conversations) return data.metadata.conversations;
      if (data.metadata.messages) return data.metadata.messages;
    }
    
    return [];
  };

  const conversations = useMemo(() => {
    const allConversations = extractDataFromResponse(conversationsData);
    // Filter to only show active conversations
    return allConversations.filter(conv => conv.status === 'active');
  }, [conversationsData]);

  // Get current user role (same as NewChat component)
  const userRole = useSelector((state) => state?.auth?.role) || 'patient';

  // Get participant info using same logic as NewChat component
  const getParticipantInfo = (conversation) => {
    const isCurrentUserPatient = userRole === 'patient';
    
    if (isCurrentUserPatient) {
      // Current user is patient, show doctor info
      const doctorName = conversation.doctor_name || 
                        (conversation.doctor_first_name && conversation.doctor_last_name 
                          ? `${conversation.doctor_first_name} ${conversation.doctor_last_name}` 
                          : "Healthcare Provider");
      return {
        name: doctorName,
        role: "doctor",
        avatar: null,
        type: "doctor",
        status: "online"
      };
    } else {
      // Current user is doctor/staff/admin, show patient info
      const patientName = conversation.patient_name || 
                         (conversation.patient_first_name && conversation.patient_last_name 
                           ? `${conversation.patient_first_name} ${conversation.patient_last_name}` 
                           : "Patient");
      return {
        name: patientName,
        role: "patient",
        avatar: null,
        type: "patient", 
        status: "online"
      };
    }
  };

  // Format time helper
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  // Sort conversations by most recent activity (same as NewChat)
  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const aTime = new Date(a.last_message_at || a.updated_at || a.created_at);
      const bTime = new Date(b.last_message_at || b.updated_at || b.created_at);
      return bTime - aTime;
    });
  }, [conversations]);

  return (
    <Card className="h-[400px] border-0 shadow-lg bg-gradient-to-br from-card to-muted/20 hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] backdrop-blur-sm flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
          <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
          </div>
          <span className="hidden sm:inline">Recent Messages</span>
          <span className="sm:hidden">Messages</span>
          {sortedConversations.length > 0 && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {sortedConversations.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <ScrollArea className="flex-1">
        <CardContent className="p-3 sm:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-6 sm:py-8">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8 sm:py-12">
              <div className="p-3 sm:p-4 rounded-full bg-red-50 mb-3 sm:mb-4">
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Unable to load messages
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {error?.status === 500 ? 'Server temporarily unavailable' : 'Please try again later'}
              </p>
            </div>
          ) : sortedConversations.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {sortedConversations.slice(0, 5).map((conversation) => {
                const participant = getParticipantInfo(conversation);
                const lastMessage = conversation.last_message;
                const unreadCount = conversation.unread_count || 0;
                
                return (
                  <div
                    key={conversation.id || conversation.conversation_id}
                    className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-background/50 border border-border/50 hover:bg-background/70 hover:border-primary/30 transition-all duration-200 cursor-pointer group"
                  >
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                        {participant.type === "doctor" ? (
                          <Stethoscope className="h-3 w-3 sm:h-4 sm:w-4" />
                        ) : (
                          <User className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                          {participant.name}
                        </p>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {participant.status === "online" && (
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatMessageTime(conversation.last_message_at || conversation.updated_at)}
                          </span>
                        </div>
                      </div>

                      {lastMessage && (
                        <p className="text-xs sm:text-sm text-muted-foreground truncate mt-1">
                          {lastMessage.length > 40 
                            ? lastMessage.substring(0, 40) + '...'
                            : lastMessage
                          }
                        </p>
                      )}

                      {unreadCount > 0 && (
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-5">
                            {unreadCount} new
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-8 sm:py-12">
              <div className="p-3 sm:p-4 rounded-full bg-muted/50 mb-3 sm:mb-4">
                <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                No recent messages.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Start a conversation with your healthcare provider.
              </p>
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
