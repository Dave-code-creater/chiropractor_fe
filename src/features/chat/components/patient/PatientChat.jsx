import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import BaseChat from "../BaseChat";
import {
  useGetAvailableUsersQuery,
  useCreateConversationMutation,
  useGetConversationUsersQuery,
} from "@/api/services/chatApi";
import {
  CONVERSATION_TYPES,
  PRIORITY_LEVELS,
  canStartConversation,
  validateConversationData,
  getRoleRestrictionError,
  formatPriority,
  getAllowedRoles,
} from "../../constants/roles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  Users,
  Stethoscope,
  Shield,
  Search,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Helper function to extract data from API response
const extractDataFromResponse = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.data && Array.isArray(data.data)) return data.data;
  if (data.data && data.data.users && Array.isArray(data.data.users)) return data.data.users;
  if (data.users && Array.isArray(data.users)) return data.users;
  return [];
};

// Helper function to get role display name
const getRoleDisplayName = (role) => {
  const roleNames = {
    patient: "Patient",
    doctor: "Doctor", 
    staff: "Staff Member",
    admin: "Administrator"
  };
  return roleNames[role?.toLowerCase()] || role || "User";
};

// New Conversation Modal Component
const NewConversationModal = ({ isOpen, onClose, onSubmit, isCreating, currentUserRole, refetchConversations }) => {
  const [formData, setFormData] = useState({
    target_user_id: "",
    subject: "",
    conversation_type: CONVERSATION_TYPES.GENERAL,
    priority: PRIORITY_LEVELS.NORMAL,
    initial_message: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Debounce search term to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Get available users based on role restrictions
  const { 
    data: availableUsersData, 
    isLoading: isLoadingUsers, 
    error: usersError 
  } = useGetConversationUsersQuery({ 
    search_term: debouncedSearchTerm,
    role: roleFilter === 'all' ? undefined : roleFilter,
    per_page: 50 
  }, {
    skip: !isOpen,
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  const availableUsers = useMemo(() => {
    const users = extractDataFromResponse(availableUsersData);
    
    // Filter users based on current user's role restrictions
    if (currentUserRole === 'patient') {
      // Patients can only see doctors, staff, and admins
      return users.filter(user => {
        const userRole = user.role || user.type;
        return ['doctor', 'staff', 'admin'].includes(userRole?.toLowerCase());
      });
    }
    
    return users;
  }, [availableUsersData, currentUserRole]);

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    setFormData({
      target_user_id: "",
      subject: "",
      conversation_type: CONVERSATION_TYPES.GENERAL,
      priority: PRIORITY_LEVELS.NORMAL,
      initial_message: "",
    });
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setRoleFilter("all");
  };

  const handleSubmit = async () => {
    // Validate form data
    const validation = validateConversationData(formData);
    
    if (!validation.isValid) {
      toast.error(validation.errorMessage);
      return;
    }

    // Find selected user to validate role restrictions
    const selectedUser = availableUsers.find(user => user.id.toString() === formData.target_user_id.toString());
    
    if (!selectedUser) {
      toast.error("Please select a valid user");
      return;
    }

    // Get the target user's role
    const targetUserRole = selectedUser.role || selectedUser.type;

    // Client-side role validation
    const canStart = canStartConversation(currentUserRole, targetUserRole);
    
    if (!canStart) {
      const errorMessage = getRoleRestrictionError(currentUserRole, targetUserRole);
      toast.error(errorMessage);
      return;
    }

    await onSubmit(formData);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const selectedUser = availableUsers.find(user => user.id.toString() === formData.target_user_id.toString());

  // Role filter options
  const roleFilterOptions = [
    { value: "all", label: "All Healthcare Professionals", icon: Users },
    { value: "doctor", label: "Doctors Only", icon: Stethoscope },
    { value: "staff", label: "Staff Only", icon: Users },
    { value: "admin", label: "Administrators Only", icon: Shield },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Start New Conversation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Role Info Alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              As a {getRoleDisplayName(currentUserRole)}, you can chat with: {getAllowedRoles(currentUserRole).map(getRoleDisplayName).join(', ')}
            </AlertDescription>
          </Alert>

          {/* Role Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Filter by Role</label>
            <Select 
              value={roleFilter} 
              onValueChange={setRoleFilter}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleFilterOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* User Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Search Users</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Available Users */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Recipient *</label>
            <div className="max-h-48 overflow-y-auto border rounded-lg">
              {isLoadingUsers ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Loading users...</p>
                </div>
              ) : availableUsers.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">No users found</p>
                </div>
              ) : (
                availableUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => updateFormData({ target_user_id: user.id.toString() })}
                    className={`p-3 cursor-pointer transition-colors ${
                      formData.target_user_id === user.id.toString()
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {(user.first_name?.[0] || user.name?.[0] || "U").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {user.first_name && user.last_name 
                            ? `${user.first_name} ${user.last_name}` 
                            : user.name || user.email}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {getRoleDisplayName(user.role || user.type)} • {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject *</label>
            <Input
              placeholder="e.g., Appointment inquiry, Follow-up question..."
              value={formData.subject}
              onChange={(e) => updateFormData({ subject: e.target.value })}
              maxLength={200}
            />
            <div className="text-xs text-muted-foreground text-right">
              {formData.subject.length}/200 characters
            </div>
          </div>

          {/* Initial Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Initial Message</label>
            <Textarea
              placeholder="Start your conversation..."
              value={formData.initial_message}
              onChange={(e) => updateFormData({ initial_message: e.target.value })}
              rows={3}
              maxLength={2000}
            />
            <div className="text-xs text-muted-foreground text-right">
              {formData.initial_message.length}/2000 characters
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isCreating || !formData.target_user_id || !formData.subject}
              className="flex-1"
            >
              {isCreating ? "Creating..." : "Start Conversation"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const PatientChat = () => {
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  
  // Get current user from Redux store
  const user = useSelector((state) => state?.auth);
  const userRole = user?.role || 'patient';

  // Create conversation mutation
  const [createConversation, { isLoading: creatingConversation }] = useCreateConversationMutation();

  const {
    // Extract all needed props from BaseChat
    selectedConversation,
    setSelectedConversation,
    messageInput,
    setMessageInput,
    searchTerm,
    setSearchTerm,
    messagesEndRef,
    conversations,
    messages,
    isBackendAvailable,
    conversationsLoading,
    messagesLoading,
    sendingMessage,
    handleSendMessage,
    formatMessageTime,
    useMessageStatus,
    isPolling,
    // Components
    Button,
    Input,
    Textarea,
    ScrollArea,
    Avatar,
    AvatarFallback,
    Card,
    CardContent,
    // Icons
    Send,
    MessageCircle,
    Clock,
    Check,
    CheckCheck,
    WifiOff,
    Plus,
  } = BaseChat({
    roleSpecificProps: {
      conversationQueryParams: {
        status: 'active',
        per_page: 50,
        page: 1,
        // The backend will handle role-based filtering using the auth token
      },
    },
  });

  // Handle creating new conversation
  const handleCreateConversation = async (formData) => {
    if (!isBackendAvailable) {
      toast.error("Chat service is currently unavailable.");
      return;
    }

    try {
      const result = await createConversation(formData).unwrap();
      toast.success("Conversation created successfully!");
      setShowNewConversationModal(false);
      
      // Handle different response structures from backend
      let newConversation = null;
      if (result?.data) {
        newConversation = result.data;
      } else if (result) {
        newConversation = result;
      }
      
      // Set as selected conversation if we have valid data
      if (newConversation?.id) {
        setSelectedConversation(newConversation);
      }
      
    } catch (error) {
      console.error('Failed to create conversation:', error);
      if (error?.data?.error_code === '4031' || error?.data?.error_code === '4032') {
        toast.error(error.data.message || "You are not authorized to start this conversation");
      } else {
        toast.error("Failed to create conversation. Please try again.");
      }
    }
  };

  return (
    <div className="h-screen min-h-screen max-h-screen mx-auto max-w-full">
      <Card className="h-full shadow-xl border-0 overflow-hidden rounded-none">
        <div className="flex h-full">
          {/* Conversations Sidebar */}
          <div className="w-[400px] border-r bg-gradient-to-b from-muted/10 to-muted/30 flex flex-col">
            <div className="p-8 border-b bg-background/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div className="p-4 rounded-lg bg-primary/10">
                    <MessageCircle className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Messages</h2>
                    <p className="text-base text-muted-foreground">Chat with your healthcare team</p>
                    {isPolling && selectedConversation && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600">Live</span>
                      </div>
                    )}
                  </div>
                </div>
                
              </div>

              <div className="relative">
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-4 h-14 text-base bg-background/60"
                  disabled={!isBackendAvailable}
                />
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              {(() => {
                if (conversationsLoading) {
                  return (
                    <div className="flex items-center justify-center h-32">
                      <MessageCircle className="h-8 w-8 text-primary animate-spin" />
                    </div>
                  );
                }
                
                if (!isBackendAvailable) {
                  return (
                    <div className="text-center p-4">
                      <p className="text-muted-foreground mb-4">Chat service is currently unavailable</p>
                    </div>
                  );
                }
                
                if (conversations.length === 0) {
                  return (
                    <div className="text-center p-4">
                      <p className="text-muted-foreground mb-4">No conversations yet</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowNewConversationModal(true)}
                        disabled={!isBackendAvailable}
                        className="w-full"
                      >
                        <Plus className="h-3 w-3 mr-2" />
                        Start New Conversation
                      </Button>
                    </div>
                  );
                }
                
                return conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => {
                      setSelectedConversation(conversation);
                    }}
                    className={`p-6 rounded-xl mb-3 cursor-pointer transition-all duration-200 ${
                      selectedConversation?.id === conversation.id
                        ? "bg-primary/10 border-l-4 border-primary shadow-sm"
                        : "hover:bg-muted/50 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="text-lg font-semibold">
                          {conversation.doctor_name?.[0] || "D"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-lg truncate mb-1">
                          {conversation.doctor_name || "Healthcare Provider"}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.last_message || conversation.subject || conversation.title || conversation.description || "No message yet"}
                        </p>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-gradient-to-br from-background to-muted/20">
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
                  <p className="text-muted-foreground mb-4">
                    Select a conversation or start a new one to begin chatting
                  </p>
                  <Button 
                    onClick={() => setShowNewConversationModal(true)}
                    disabled={!isBackendAvailable}
                    className="h-10"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Start New Conversation
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {selectedConversation.doctor_name?.[0] || "D"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">
                        {selectedConversation.doctor_name || "Healthcare Provider"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedConversation.subject || selectedConversation.title || selectedConversation.description || "Conversation"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-6">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <MessageCircle className="h-8 w-8 text-primary animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center">
                      <p className="text-muted-foreground">No messages yet</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {messages.map((message) => {
                        const isCurrentUser = message.sender_type === "patient" || message.sender_id === user?.userID;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${
                              isCurrentUser ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[85%] rounded-xl p-5 ${
                                isCurrentUser
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <p className="text-base leading-relaxed">{message.content || message.message_content}</p>
                              <div className="flex items-center gap-2 mt-3 text-xs opacity-70">
                                <Clock className="h-3 w-3" />
                                {formatMessageTime(message.sent_at || message.created_at)}
                                {isCurrentUser && (
                                  <div className="flex items-center ml-2">
                                    {message.is_read || message.read_at ? (
                                      <CheckCheck className="h-3 w-3 text-blue-400" />
                                    ) : message.is_delivered || message.delivered_at ? (
                                      <CheckCheck className="h-3 w-3" />
                                    ) : (
                                      <Check className="h-3 w-3" />
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
                  )}
                </ScrollArea>

                {/* Message Input */}
                <div className="p-8 border-t bg-background/80 backdrop-blur-sm">
                  <form onSubmit={handleSendMessage} className="flex gap-4">
                    <Textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      placeholder="Type your message..."
                      className="min-h-[60px] max-h-40 text-base"
                      disabled={!isBackendAvailable}
                    />
                    <Button
                      type="submit"
                      size="lg"
                      disabled={!messageInput.trim() || sendingMessage || !isBackendAvailable}
                    >
                      {sendingMessage ? (
                        <MessageCircle className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
                  </form>
                  <div className="mt-3 flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      {!isBackendAvailable 
                        ? "⚠️ Chat service currently unavailable"
                        : "💡 Press Enter to send, Shift + Enter for new line"
                      }
                    </p>
                    {isBackendAvailable && (
                      <p className="text-sm text-muted-foreground">
                        {messageInput.length}/2000 characters
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* New Conversation Modal */}
      <NewConversationModal
        isOpen={showNewConversationModal}
        onClose={() => setShowNewConversationModal(false)}
        onSubmit={handleCreateConversation}
        isCreating={creatingConversation}
        currentUserRole={userRole}
        refetchConversations={() => {}} // Placeholder, actual refetch would be handled by BaseChat or a separate hook
      />
    </div>
  );
};

export default PatientChat;