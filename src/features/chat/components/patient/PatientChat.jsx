import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import BaseChat from "../BaseChat";
import {
  useCreateConversationMutation,
  useGetConversationUsersQuery,
} from "@/api/services/chatApi";
import {
  CONVERSATION_TYPES,
  PRIORITY_LEVELS,
  canStartConversation,
  validateConversationData,
  getRoleRestrictionError,
  getAllowedRoles,
} from "../../constants/roles";
import {
  Users,
  Stethoscope,
  Shield,
  AlertCircle,
  Search,
  X,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";



const extractDataFromResponse = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.data && Array.isArray(data.data)) return data.data;
  if (data.data && data.data.users && Array.isArray(data.data.users)) return data.data.users;
  if (data.users && Array.isArray(data.users)) return data.users;
  return [];
};

const getRoleDisplayName = (role) => {
  const roleNames = {
    patient: "Patient",
    doctor: "Doctor",

    admin: "Administrator"
  };
  return roleNames[role?.toLowerCase()] || role || "User";
};

const NewConversationModal = ({ isOpen, onClose, onSubmit, isCreating, currentUserRole, _refetchConversations }) => {
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: availableUsersData,
    isLoading: isLoadingUsers,
    error: _usersError
  } = useGetConversationUsersQuery({
    search_term: debouncedSearchTerm,
    role: roleFilter === 'all' ? 'doctor' : roleFilter,
    per_page: 50
  }, {
    skip: !isOpen,
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  const availableUsers = useMemo(() => {
    const users = extractDataFromResponse(availableUsersData);

    if (currentUserRole === 'patient') {
      return users.filter(user => {
        const userRole = user.role || user.type;
        return ['doctor', 'admin'].includes(userRole?.toLowerCase());
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
    const validation = validateConversationData(formData);

    if (!validation.isValid) {
      toast.error(validation.errorMessage);
      return;
    }

    const selectedUser = availableUsers.find(user => user.id.toString() === formData.target_user_id.toString());

    if (!selectedUser) {
      toast.error("Please select a valid user");
      return;
    }

    const targetUserRole = selectedUser.role || selectedUser.type;

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

  

  const roleFilterOptions = [
    { value: "all", label: "All Healthcare Professionals", icon: Users },
    { value: "doctor", label: "Doctors Only", icon: Stethoscope },

    { value: "admin", label: "Administrators Only", icon: Shield },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <Card className="w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            Start New Conversation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6 pt-0">

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              As a {getRoleDisplayName(currentUserRole)}, you can chat with: {getAllowedRoles(currentUserRole).map(getRoleDisplayName).join(', ')}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium">Filter by Role</label>
            <Select
              value={roleFilter}
              onValueChange={setRoleFilter}
            >
              <SelectTrigger className="h-8 sm:h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleFilterOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm">{option.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium">Search Users</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 sm:pl-10 h-8 sm:h-10 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium">Select Recipient *</label>
            <div className="max-h-32 sm:max-h-48 overflow-y-auto border rounded-lg">
              {isLoadingUsers ? (
                <div className="p-3 sm:p-4 text-center">
                  <p className="text-xs sm:text-sm text-muted-foreground">Loading users...</p>
                </div>
              ) : availableUsers.length === 0 ? (
                <div className="p-3 sm:p-4 text-center">
                  <p className="text-xs sm:text-sm text-muted-foreground">No users found</p>
                </div>
              ) : (
                availableUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => updateFormData({ target_user_id: user.id.toString() })}
                    className={`p-2 sm:p-3 cursor-pointer transition-colors ${formData.target_user_id === user.id.toString()
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-muted/50"
                      }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                        <AvatarFallback className="text-xs">
                          {(user.first_name?.[0] || user.name?.[0] || "U").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs sm:text-sm truncate">
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

          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium">Subject *</label>
            <Input
              placeholder="e.g., Appointment inquiry, Follow-up question..."
              value={formData.subject}
              onChange={(e) => updateFormData({ subject: e.target.value })}
              maxLength={200}
              className="h-8 sm:h-10 text-xs sm:text-sm"
            />
            <div className="text-xs text-muted-foreground text-right">
              {formData.subject.length}/200 characters
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium">Initial Message</label>
            <Textarea
              placeholder="Start your conversation..."
              value={formData.initial_message}
              onChange={(e) => updateFormData({ initial_message: e.target.value })}
              rows={3}
              maxLength={2000}
              className="text-xs sm:text-sm resize-none"
            />
            <div className="text-xs text-muted-foreground text-right">
              {formData.initial_message.length}/2000 characters
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2 sm:pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1 h-8 sm:h-10 text-xs sm:text-sm">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isCreating || !formData.target_user_id || !formData.subject}
              className="flex-1 h-8 sm:h-10 text-xs sm:text-sm"
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

  const user = useSelector((state) => state?.auth);
  const userRole = user?.role || 'patient';

  const [createConversation, { isLoading: creatingConversation }] = useCreateConversationMutation();

  const {
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
    isPolling,
    isFromCurrentUser,
    Button,
    Input,
    Textarea,
    ScrollArea,
    Avatar,
    AvatarFallback,
    Card,
    CardContent,
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
      },
    },
  });

  const handleCreateConversation = async (formData) => {
    if (!isBackendAvailable) {
      toast.error("Chat service is currently unavailable.");
      return;
    }

    try {
      const result = await createConversation(formData).unwrap();
      toast.success("Conversation created successfully!");
      setShowNewConversationModal(false);

      let newConversation = null;
      if (result?.data) {
        newConversation = result.data;
      } else if (result) {
        newConversation = result;
      }

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
      <Card className="h-full shadow-none border-0 overflow-hidden rounded-none">
        <div className="flex h-full">
          <div className={`${selectedConversation ? 'hidden lg:flex' : 'flex'} w-full lg:w-[400px] border-r bg-gradient-to-b from-muted/10 to-muted/30 flex-col`}>
            <div className="p-3 sm:p-4 lg:p-8 border-b bg-background/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
                <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                  <div className="p-2 sm:p-3 lg:p-4 rounded-lg bg-primary/10">
                    <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Messages</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">Chat with your healthcare team</p>
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
                  className="pl-4 h-10 sm:h-12 lg:h-14 text-sm sm:text-base bg-background/60"
                  disabled={!isBackendAvailable}
                />
              </div>
            </div>

            <ScrollArea className="flex-1 p-3 sm:p-4 lg:p-6">
              {(() => {
                if (conversationsLoading) {
                  return (
                    <div className="flex items-center justify-center h-32">
                      <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary animate-spin" />
                    </div>
                  );
                }

                if (!isBackendAvailable) {
                  return (
                    <div className="text-center p-4">
                      <p className="text-sm sm:text-base text-muted-foreground mb-4">Chat service is currently unavailable</p>
                    </div>
                  );
                }

                if (conversations.length === 0) {
                  return (
                    <div className="text-center p-4">
                      <p className="text-sm sm:text-base text-muted-foreground mb-4">No conversations yet</p>
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
                    className={`p-3 sm:p-4 lg:p-6 rounded-xl mb-2 sm:mb-3 cursor-pointer transition-all duration-200 ${selectedConversation?.id === conversation.id
                        ? "bg-primary/10 border-l-4 border-primary shadow-sm"
                        : "hover:bg-muted/50 hover:shadow-sm"
                      }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                        <AvatarFallback className="text-sm sm:text-lg font-semibold">
                          {conversation.doctor_name?.[0] || "D"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm sm:text-base lg:text-lg truncate mb-1">
                          {conversation.doctor_name || "Healthcare Provider"}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          {conversation.last_message || conversation.subject || conversation.title || conversation.description || "No message yet"}
                        </p>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </ScrollArea>
          </div>

          <div className={`${selectedConversation ? 'flex' : 'hidden lg:flex'} flex-1 flex-col bg-gradient-to-br from-background to-muted/20`}>
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-4">
                  <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-medium mb-2">No conversation selected</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">
                    Select a conversation or start a new one to begin chatting
                  </p>
                  <Button
                    onClick={() => setShowNewConversationModal(true)}
                    disabled={!isBackendAvailable}
                    className="h-8 sm:h-10"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Start New Conversation
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="p-3 sm:p-4 lg:p-6 border-b">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="lg:hidden p-1 h-8 w-8"
                      onClick={() => setSelectedConversation(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12">
                      <AvatarFallback>
                        {selectedConversation.doctor_name?.[0] || "D"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm sm:text-base lg:text-lg truncate">
                        {selectedConversation.doctor_name || "Healthcare Provider"}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {selectedConversation.subject || selectedConversation.title || selectedConversation.description || "Conversation"}
                      </p>
                    </div>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-3 sm:p-4 lg:p-6">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center">
                      <p className="text-sm sm:text-base text-muted-foreground">No messages yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                      {messages.map((message) => {
                        const senderType = (message?.sender_type || "").toString().toLowerCase();
                        const isCurrentUser = isFromCurrentUser(message) || senderType === "patient";
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[85%] sm:max-w-md lg:max-w-lg rounded-xl p-3 sm:p-4 lg:p-5 ${isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                            >
                              <p className="text-sm sm:text-base leading-relaxed">{message.content || message.message_content}</p>
                              <div className="flex items-center gap-2 mt-2 sm:mt-3 text-xs opacity-70">
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

                <div className="p-3 sm:p-4 lg:p-8 border-t bg-background/80 backdrop-blur-sm">
                  <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3 lg:gap-4">
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
                      className="min-h-[40px] sm:min-h-[48px] lg:min-h-[60px] max-h-32 sm:max-h-36 lg:max-h-40 text-sm sm:text-base resize-none"
                      disabled={!isBackendAvailable}
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="h-10 sm:h-12 lg:h-16 px-3 sm:px-4 lg:px-6"
                      disabled={!messageInput.trim() || sendingMessage || !isBackendAvailable}
                    >
                      {sendingMessage ? (
                        <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </Button>
                  </form>
                  <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {!isBackendAvailable
                        ? "⚠️ Chat service currently unavailable"
                        : "💡 Press Enter to send, Shift + Enter for new line"
                      }
                    </p>
                    {isBackendAvailable && (
                      <p className="text-xs sm:text-sm text-muted-foreground">
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
      <NewConversationModal
        isOpen={showNewConversationModal}
        onClose={() => setShowNewConversationModal(false)}
        onSubmit={handleCreateConversation}
        isCreating={creatingConversation}
        currentUserRole={userRole}
        refetchConversations={() => { }}
      />
    </div>
  );
};

export default PatientChat;
