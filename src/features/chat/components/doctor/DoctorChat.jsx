import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import BaseChat from "../BaseChat";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input as UIInput } from "@/components/ui/input";


import {
  useGetConversationUsersQuery,
  useCreateConversationMutation,
} from "@/api/services/chatApi";
import {
  CONVERSATION_TYPES,
  PRIORITY_LEVELS,
  validateConversationData,
} from "../../constants/roles";


import {
  Users,
  Stethoscope,
  Shield,
  Search,
  AlertCircle,
  Filter,
  UserPlus,
  AlertTriangle,
} from "lucide-react";

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

const NewConversationModal = ({ isOpen, onClose, onSubmit, isCreating, currentUserRole }) => {
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
  } = useGetConversationUsersQuery({
    search_term: debouncedSearchTerm,
    role: roleFilter === 'all' ? 'patient' : roleFilter,
    per_page: 50
  }, {
    skip: !isOpen,
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  const availableUsers = useMemo(() => {
    const users = extractDataFromResponse(availableUsersData);
    return users;
  }, [availableUsersData]);

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

    await onSubmit(formData);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const roleFilterOptions = [
    { value: "all", label: "All Users", icon: Users },
    { value: "patient", label: "Patients Only", icon: Users },
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
              As a {getRoleDisplayName(currentUserRole)}, you can start conversations with patients, colleagues, and administrators.
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
              <UIInput
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
            <label className="text-xs sm:text-sm font-medium">Priority</label>
            <Select
              value={formData.priority}
              onValueChange={(value) => updateFormData({ priority: value })}
            >
              <SelectTrigger className="h-8 sm:h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PRIORITY_LEVELS.LOW}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Low Priority
                  </div>
                </SelectItem>
                <SelectItem value={PRIORITY_LEVELS.NORMAL}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Normal Priority
                  </div>
                </SelectItem>
                <SelectItem value={PRIORITY_LEVELS.HIGH}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    High Priority
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium">Subject *</label>
            <Input
              placeholder="e.g., Patient consultation, Follow-up, Medical advice..."
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

const DoctorChat = () => {
  const [statusFilter, setStatusFilter] = useState("active");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);

  const user = useSelector((state) => state?.auth);
  const userRole = user?.role || 'doctor';

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
    Button: BaseChatButton,
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
    refetchConversations,
  } = BaseChat({
    roleSpecificProps: {
      conversationQueryParams: {
        status: statusFilter,
        priority: priorityFilter !== "all" ? priorityFilter : undefined,
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

      if (result?.conversation) {
        setSelectedConversation(result.conversation);
      } else if (result?.data?.conversation) {
        setSelectedConversation(result.data.conversation);
      } else if (result?.id) {
        setSelectedConversation(result);
      }

      // Refresh the conversation list without a full page reload
      try {
        await refetchConversations();
      } catch { }
    } catch (error) {
      console.error('Failed to create conversation:', error);
      toast.error(error?.data?.message || "Failed to create conversation. Please try again.");
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <Card className="flex-1 shadow-none border-0 overflow-hidden">
        <div className="flex h-full">
          <div className={`${selectedConversation ? 'hidden lg:flex' : 'flex'} w-full lg:w-[360px] border-r bg-gradient-to-b from-muted/10 to-muted/30 flex-col`}>
            <div className="p-3 sm:p-4 lg:p-6 border-b bg-background/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 rounded-lg bg-primary/10">
                    <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-foreground">Patient Messages</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">Manage patient communications</p>
                    {isPolling && selectedConversation && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600">Live</span>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 sm:h-10 sm:w-10"
                  onClick={() => setShowNewConversationModal(true)}
                  disabled={!isBackendAvailable}
                  title="Start new conversation"
                >
                  <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <div className="flex gap-1 sm:gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm h-8 sm:h-9">
                        <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Status: {statusFilter}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                        Active
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("resolved")}>
                        Resolved
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                        Pending
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Priority: {priorityFilter}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setPriorityFilter("all")}>
                        All
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPriorityFilter("high")}>
                        High
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPriorityFilter("medium")}>
                        Medium
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPriorityFilter("low")}>
                        Low
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="relative">
                  <Input
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-4 h-10 text-sm bg-background/60"
                    disabled={!isBackendAvailable}
                  />
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
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
                      <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm sm:text-base text-muted-foreground mb-3">No conversations yet</p>
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
                    className={`p-4 rounded-xl mb-3 cursor-pointer transition-all duration-200 ${selectedConversation?.id === conversation.id
                      ? "bg-primary/10 border-l-4 border-primary"
                      : "hover:bg-muted/50"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="text-lg font-semibold">
                          {conversation.patient_name?.[0] || conversation.doctor_name?.[0] || "P"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-base truncate mb-1">
                            {conversation.patient_name || conversation.doctor_name || "Patient"}
                          </p>
                          {conversation.priority && (
                            <Badge className={`${getPriorityBadge(conversation.priority)} text-xs`}>
                              {conversation.priority}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.last_message || conversation.subject || conversation.title || conversation.description || "Start a conversation"}
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
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">Select a conversation or start a new one</p>
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
                <div className="p-3 sm:p-4 border-b bg-background/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <BaseChatButton
                        variant="ghost"
                        size="sm"
                        className="lg:hidden p-1 h-8 w-8"
                        onClick={() => setSelectedConversation(null)}
                      >
                        <X className="h-4 w-4" />
                      </BaseChatButton>

                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                        <AvatarFallback>
                          {selectedConversation.patient_name?.[0] || selectedConversation.doctor_name?.[0] || "P"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <h3 className="font-medium text-sm sm:text-base truncate">
                            {selectedConversation.patient_name || selectedConversation.doctor_name || "Patient"}
                          </h3>
                          {selectedConversation.priority && (
                            <Badge className={`${getPriorityBadge(selectedConversation.priority)} text-xs`}>
                              {selectedConversation.priority}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          {selectedConversation.subject || selectedConversation.title || "Conversation"}
                        </p>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <BaseChatButton variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                        </BaseChatButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Set Priority
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                  {(() => {
                    if (messagesLoading) {
                      return (
                        <div className="flex items-center justify-center h-32">
                          <MessageCircle className="h-8 w-8 text-primary animate-spin" />
                        </div>
                      );
                    }

                    if (messages.length === 0) {
                      return (
                        <div className="text-center py-8">
                          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No messages yet</p>
                          <p className="text-sm text-muted-foreground mt-2">Start the conversation by sending a message below</p>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        {messages.map((message) => {
                          const senderType = (message?.sender_type || "").toString().toLowerCase();
                          const isCurrentUser = isFromCurrentUser(message) || senderType === "doctor";

                          // Read/delivered status using available fields
                          const isRead = Boolean(message?.is_read || message?.read_at);
                          const isDelivered = Boolean(message?.is_delivered || message?.delivered_at);

                          return (
                            <div
                              key={message.id}
                              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[85%] sm:max-w-md lg:max-w-lg rounded-xl p-3 sm:p-4 ${isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                              >
                                <p className="text-sm leading-relaxed">
                                  {message.content || message.message_content}
                                </p>
                                <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                                  <Clock className="h-3 w-3" />
                                  {formatMessageTime(message.sent_at || message.created_at)}
                                  {isCurrentUser && (
                                    <span className="flex items-center ml-2">
                                      {isRead ? (
                                        <CheckCheck className="h-3 w-3 text-blue-400" />
                                      ) : isDelivered ? (
                                        <CheckCheck className="h-3 w-3" />
                                      ) : (
                                        <Check className="h-3 w-3" />
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    );
                  })()}
                </ScrollArea>

                <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <Textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type your message..."
                      className="min-h-[40px] max-h-32 text-sm resize-none"
                      disabled={!isBackendAvailable}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    />
                    <BaseChatButton
                      type="submit"
                      size="sm"
                      disabled={!messageInput.trim() || sendingMessage || !isBackendAvailable}
                    >
                      {sendingMessage ? (
                        <MessageCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </BaseChatButton>
                  </form>
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
      />
    </div>
  );
};

export default DoctorChat; 
