import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Clock, User, Stethoscope, Eye, Users, AlertCircle } from "lucide-react";
import { useGetConversationsQuery } from "@/api/services/chatApi";
import { useGetDoctorsQuery } from "@/api/services/appointmentApi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectUserId, selectUserRole } from "../../state/data/authSlice";

export default function RecentChatMessages({ 
  title = "Recent Messages", 
  limit = 5, 
  showViewAll = true,
  className = "",
  height = "h-[400px]" 
}) {
  const userId = useSelector(selectUserId);
  const userRole = useSelector(selectUserRole);
  const { data: conversationsData, isLoading, error } = useGetConversationsQuery(
    { 
      limit: limit * 2,
      status: 'active'
    },
    {
      // Prevent constant refetching on error
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }
  );
  const { data: appointmentDoctors } = useGetDoctorsQuery(
    { is_available: true },
    {
      // Prevent constant refetching on error
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }
  );
  
  // Extract conversations from response
  const conversations = useMemo(() => {
    if (!conversationsData) return [];
    
    let conversationsArray = [];
    
    if (Array.isArray(conversationsData)) {
      conversationsArray = conversationsData;
    } else if (conversationsData.metadata && Array.isArray(conversationsData.metadata.conversations)) {
      conversationsArray = conversationsData.metadata.conversations;
    } else if (conversationsData.metadata && Array.isArray(conversationsData.metadata)) {
      conversationsArray = conversationsData.metadata;
    } else if (conversationsData.conversations && Array.isArray(conversationsData.conversations)) {
      conversationsArray = conversationsData.conversations;
    }
    
    // Filter to only show active conversations
    return conversationsArray.filter(conv => conv.status === 'active');
  }, [conversationsData]);

  // Get available doctors for name resolution
  const availableDoctors = useMemo(() => {
    let doctors = [];
    
    if (appointmentDoctors?.metadata && Array.isArray(appointmentDoctors.metadata)) {
      doctors = appointmentDoctors.metadata;
    } else if (appointmentDoctors?.doctors && Array.isArray(appointmentDoctors.doctors)) {
      doctors = appointmentDoctors.doctors;
    } else if (Array.isArray(appointmentDoctors)) {
      doctors = appointmentDoctors;
    }

    return doctors.map(doctor => ({
      ...doctor,
      id: doctor.id || doctor.userID,
      firstName: doctor.first_name || doctor.firstName,
      lastName: doctor.last_name || doctor.lastName,
      name: doctor.name || `Dr. ${doctor.first_name || doctor.firstName} ${doctor.last_name || doctor.lastName}`,
      profileImage: doctor.profile_image || doctor.profileImage,
    }));
  }, [appointmentDoctors]);

  // Helper function to get participant info
  const getParticipantInfo = (conversation) => {
    if (!conversation) return { name: "Unknown", avatar: null, type: "user", status: "offline" };
    
    // First, try to get doctor info from available doctors list if we have a doctor ID
    if (conversation.metadata?.doctorId) {
      const doctorId = conversation.metadata.doctorId;
      const matchedDoctor = availableDoctors.find(doc => doc.id === doctorId || doc.userID === doctorId);
      if (matchedDoctor) {
        return {
          name: matchedDoctor.name,
          avatar: matchedDoctor.profileImage || matchedDoctor.avatar,
          type: "doctor",
          status: matchedDoctor.isOnline ? "online" : "offline",
        };
      }
    }
    
    // Look for doctor participant in the participants array
    if (conversation.participants && Array.isArray(conversation.participants)) {
      const doctor = conversation.participants.find(p => p.role === "doctor");
      if (doctor) {
        // Try to match with available doctors list using userId
        if (doctor.userId) {
          const matchedDoctor = availableDoctors.find(doc => doc.id === doctor.userId || doc.userID === doctor.userId);
          if (matchedDoctor) {
            return {
              name: matchedDoctor.name,
              avatar: matchedDoctor.profileImage || matchedDoctor.avatar,
              type: "doctor",
              status: matchedDoctor.isOnline ? "online" : "offline",
            };
          }
        }
        
        // Handle different name formats from backend
        let doctorName = "Healthcare Provider";
        
        if (doctor.firstName && doctor.lastName && doctor.firstName !== "Dr." && doctor.lastName !== "Doctor 1") {
          doctorName = `Dr. ${doctor.firstName} ${doctor.lastName}`;
        } else if (doctor.name && !doctor.name.includes("Doctor") && doctor.name !== "Dr.") {
          doctorName = doctor.name.startsWith("Dr.") ? doctor.name : `Dr. ${doctor.name}`;
        } else if (doctor.first_name && doctor.last_name) {
          doctorName = `Dr. ${doctor.first_name} ${doctor.last_name}`;
        }
        
        return {
          name: doctorName,
          avatar: doctor.profileImage || doctor.avatar,
          type: "doctor",
          status: doctor.isOnline ? "online" : "offline",
        };
      }
      
      // Look for patient participant if current user is doctor/admin
      if ((userRole === "doctor" || userRole === "admin") && conversation.participants.length > 0) {
        const patient = conversation.participants.find(p => p.role === "patient" || p.role === "user");
        if (patient) {
          return {
            name: patient.name || `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || "Patient",
            avatar: patient.profileImage || patient.avatar,
            type: "patient",
            status: patient.isOnline ? "online" : "offline",
          };
        }
      }
    }
    
    // Fallback to existing logic
    return {
      name: conversation.participant_name || "Healthcare Provider",
      avatar: conversation.participant_avatar,
      type: conversation.participant_type || "doctor",
      status: conversation.participant_status || "online",
    };
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

  // Sort conversations by most recent activity
  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const aTime = new Date(a.updated_at || a.updatedAt || a.created_at || a.createdAt);
      const bTime = new Date(b.updated_at || b.updatedAt || b.created_at || b.createdAt);
      return bTime - aTime;
    });
  }, [conversations]);

  // Get the role-specific icon
  const getParticipantIcon = (type) => {
    switch (type) {
      case "doctor":
        return <Stethoscope className="h-4 w-4" />;
      case "patient":
        return <User className="h-4 w-4" />;
      case "staff":
        return <Users className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            {title}
            {sortedConversations.length > 0 && (
              <Badge variant="secondary">
                {sortedConversations.length}
              </Badge>
            )}
          </div>
          {showViewAll && (
            <Button variant="outline" size="sm" asChild>
              <Link to="/services/inbox">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Link>
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className={height}>
          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Unable to load messages
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {error?.status === 500 ? 'Server temporarily unavailable' : 'Please try again later'}
                </p>
              </div>
            ) : sortedConversations.length > 0 ? (
              <div className="space-y-3">
                {sortedConversations.slice(0, limit).map((conversation) => {
                  const participant = getParticipantInfo(conversation);
                  const lastMessage = conversation.last_message || conversation.lastMessage;
                  const unreadCount = conversation.unread_count || 0;
                  
                  return (
                    <div
                      key={conversation.id || conversation._id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-all duration-200 cursor-pointer border border-border/50"
                    >
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback className="text-xs">
                          {getParticipantIcon(participant.type)}
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
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {formatMessageTime(conversation.updated_at || conversation.updatedAt)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 mt-1">
                          <Badge 
                            variant={
                              participant.type === "doctor" ? "default" : 
                              participant.type === "patient" ? "secondary" : 
                              "outline"
                            } 
                            className="text-xs px-2 py-0"
                          >
                            {participant.type === "doctor" ? "Doctor" : 
                             participant.type === "patient" ? "Patient" : 
                             "Staff"}
                          </Badge>
                          {unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs px-2 py-0">
                              {unreadCount} new
                            </Badge>
                          )}
                        </div>
                        
                        {lastMessage && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {typeof lastMessage === 'string' ? lastMessage : lastMessage.content}
                          </p>
                        )}
                        
                        {conversation.title && (
                          <p className="text-xs font-medium text-foreground/80 mt-1 truncate">
                            Subject: {conversation.title}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 rounded-full bg-muted/50 mb-4">
                  <MessageCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  No recent messages
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Messages will appear here when you start conversations
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 