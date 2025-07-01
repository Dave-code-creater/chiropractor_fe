import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Inbox, MessageCircle, User, Stethoscope, AlertCircle, ExternalLink, ChevronRight } from "lucide-react";
import { useGetConversationsQuery } from "@/services/chatApi";
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

  const conversations = useMemo(() => extractDataFromResponse(conversationsData), [conversationsData]);

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
    <Card className="w-full h-full border-0 shadow-lg bg-gradient-to-br from-card to-muted/20 hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <MessageCircle className="w-4 h-4 text-primary" />
          </div>
          Recent Messages
          {sortedConversations.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {sortedConversations.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <ScrollArea className="h-full max-h-[300px]">
        <CardContent className="h-full">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="p-4 rounded-full bg-red-50 mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-sm text-muted-foreground">
                Unable to load messages
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {error?.status === 500 ? 'Server temporarily unavailable' : 'Please try again later'}
              </p>
            </div>
          ) : sortedConversations.length > 0 ? (
            <div className="space-y-3">
              {sortedConversations.slice(0, 5).map((conversation) => {
                const participant = getParticipantInfo(conversation);
                const lastMessage = conversation.last_message;
                const unreadCount = conversation.unread_count || 0;
                
                return (
                  <div
                    key={conversation.id || conversation.conversation_id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/50 hover:bg-background/70 hover:border-primary/30 transition-all duration-200 cursor-pointer group"
                  >
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                        {participant.type === "doctor" ? (
                          <Stethoscope className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground truncate">
                          {participant.name}
                        </p>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {participant.status === "online" && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatMessageTime(conversation.last_message_at || conversation.updated_at)}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs font-medium text-foreground/80 mt-1 truncate">
                        {conversation.subject}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={participant.type === "doctor" ? "default" : "secondary"} 
                          className="text-xs px-2 py-0"
                        >
                          {participant.type === "doctor" ? "Doctor" : "Patient"}
                        </Badge>
                        {unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs px-2 py-0">
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                      
                      {lastMessage && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {lastMessage}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="p-4 rounded-full bg-muted/50 mb-4">
                <Inbox className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                No messages yet
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Start a conversation with your healthcare team
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                Start Conversation
              </Button>
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
