import React, { useState, useRef, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  useGetAvailableUsersQuery,
  useGetConversationsQuery,
  useSendMessageMutation,
  useCreateConversationMutation,
  useUpdateConversationStatusMutation,
  useDeleteConversationMutation,
} from "@/api/services/chatApi";
import {
  CHAT_ROLES,
  CONVERSATION_TYPES,
  PRIORITY_LEVELS,
  canStartConversation,
  validateConversationData,
  getRoleRestrictionError,
  formatConversationType,
  formatPriority,
  getAllowedRoles,
  canUpdateConversationStatus,
  MESSAGE_TYPES
} from "../constants/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Send,
  Plus,
  Search,
  MoreVertical,
  Trash2,
  MessageCircle,
  Clock,
  Check,
  CheckCheck,
  AlertCircle,
  WifiOff,
  Minus,
  X,
  Users,
  UserCheck,
  Stethoscope,
  Shield,
  Star,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Helper functions
const extractDataFromResponse = (data) => {
  if (!data) return [];
  
  if (Array.isArray(data)) return data;
  
  // Handle different response structures from API
  if (data.data) {
    if (Array.isArray(data.data)) return data.data;
    if (data.data.conversations) return data.data.conversations;
    if (data.data.messages) return data.data.messages;
    if (data.data.users) return data.data.users;
    
    // Handle role-filtered responses from chat/staff-admin-doctors endpoint
    if (data.data.doctors && Array.isArray(data.data.doctors)) return data.data.doctors;
    if (data.data.staff && Array.isArray(data.data.staff)) return data.data.staff;
    if (data.data.admin && Array.isArray(data.data.admin)) return data.data.admin;
    
    // Handle combined response when role=all
    if (data.data.doctors || data.data.staff || data.data.admin) {
      const combined = [];
      if (data.data.doctors) combined.push(...data.data.doctors);
      if (data.data.staff) combined.push(...data.data.staff);
      if (data.data.admin) combined.push(...data.data.admin);
      return combined;
    }
  }
  
  if (data.conversations) return data.conversations;
  if (data.messages) return data.messages;
  if (data.users) return data.users;
  
  // Direct role-based arrays
  if (data.doctors && Array.isArray(data.doctors)) return data.doctors;
  if (data.staff && Array.isArray(data.staff)) return data.staff;
  if (data.admin && Array.isArray(data.admin)) return data.admin;
  
  // Combined response when role=all (top level)
  if (data.doctors || data.staff || data.admin) {
    const combined = [];
    if (data.doctors) combined.push(...data.doctors);
    if (data.staff) combined.push(...data.staff);  
    if (data.admin) combined.push(...data.admin);
    return combined;
  }
  
  if (data.metadata) {
    if (Array.isArray(data.metadata)) return data.metadata;
    if (data.metadata.conversations) return data.metadata.conversations;
    if (data.metadata.messages) return data.metadata.messages;
  }
  
  return [];
};

const formatMessageTime = (timestamp) => {
  if (!timestamp) return "";
  
  const messageDate = new Date(timestamp);
  const now = new Date();
  const diffMs = now - messageDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return messageDate.toLocaleDateString();
};

const getRoleDisplayName = (role) => {
  const roleMap = {
    'patient': 'Patient',
    'doctor': 'Doctor', 
    'staff': 'Staff',
    'admin': 'Administrator'
  };
  return roleMap[role?.toLowerCase()] || role;
};

const getRoleIconComponent = (role) => {
  switch (role?.toLowerCase()) {
    case 'doctor':
      return <Stethoscope className="h-4 w-4" />;
    case 'staff':
      return <Users className="h-4 w-4" />;
    case 'admin':
      return <Shield className="h-4 w-4" />;
    case 'patient':
      return <UserCheck className="h-4 w-4" />;
    default:
      return <Users className="h-4 w-4" />;
  }
};

// New Conversation Modal Component
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
  } = useGetAvailableUsersQuery({ 
    search: debouncedSearchTerm,
    role: roleFilter === 'all' ? undefined : roleFilter, // Don't send 'all' to API
    limit: 50 
  }, {
    skip: !isOpen, // Only fetch when modal is open
    refetchOnMountOrArgChange: false, // Prevent excessive refetching
    refetchOnFocus: false, // Prevent refetch when window gains focus
    refetchOnReconnect: false, // Prevent refetch on reconnect
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

  const handleSubmit = () => {

    // Validate form data
    const validation = validateConversationData(formData);
    
    if (!validation.isValid) {
      console.log('❌ Validation failed:', validation.errorMessage);
      toast.error(validation.errorMessage);
      return;
    }

    // Find selected user to validate role restrictions
    const selectedUser = availableUsers.find(user => user.id.toString() === formData.target_user_id.toString());
    console.log('🎯 Selected User:', selectedUser);
    
    if (!selectedUser) {
      console.log('❌ No valid user selected');
      toast.error("Please select a valid user");
      return;
    }

    // Get the target user's role (handle both 'role' and 'type' properties)
    const targetUserRole = selectedUser.role || selectedUser.type;
    console.log('🎭 Target User Role:', targetUserRole, 'from properties:', { role: selectedUser.role, type: selectedUser.type });

    // Client-side role validation (redundant with server-side but provides better UX)
    const canStart = canStartConversation(currentUserRole, targetUserRole);
    console.log('🔐 Can start conversation:', canStart);
    
    if (!canStart) {
      const errorMessage = getRoleRestrictionError(currentUserRole, targetUserRole);
      console.log('❌ Role restriction:', errorMessage);
      toast.error(errorMessage);
      return;
    }

    console.log('✅ All validations passed, calling onSubmit');
    onSubmit(formData);
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
            <MessageCircle className="h-5 w-5" />
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
              onValueChange={(value) => {
                try {
                  setRoleFilter(value);
                } catch (error) {
                  console.error('Error changing role filter:', error);
                }
              }}
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
                onChange={(e) => {
                  try {
                    setSearchTerm(e.target.value);
                  } catch (error) {
                    console.error('Error updating search term:', error);
                  }
                }}
                className="pl-10"
              />
            </div>
          </div>

          {/* Available Users */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Select User *</label>
              {!isLoadingUsers && availableUsers.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {availableUsers.length} user{availableUsers.length !== 1 ? 's' : ''} found
                </span>
              )}
            </div>
            {isLoadingUsers ? (
              <div className="p-4 text-center text-muted-foreground">
                <MessageCircle className="h-6 w-6 mx-auto mb-2 animate-spin" />
                Loading available users...
              </div>
            ) : usersError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load available users. Please try again.
                </AlertDescription>
              </Alert>
            ) : availableUsers.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No users found</p>
                <p className="text-xs">
                  {searchTerm ? "Try adjusting your search terms" : 
                   roleFilter !== "all" ? `No ${roleFilter}s available` : "No healthcare professionals available"}
                </p>
              </div>
            ) : (
              <div className="border rounded-lg max-h-48 overflow-y-auto">
                {availableUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      updateFormData({ target_user_id: user.id.toString() });
                    }}
                    className={`w-full p-3 text-left hover:bg-muted/50 border-b last:border-b-0 transition-colors ${
                      formData.target_user_id === user.id.toString()
                        ? "bg-primary/10 border-primary/20"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.full_name?.split(' ').map(n => n[0]).join('') || user.username?.[0] || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {user.full_name || user.username}
                        </div>
                                                 <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                           {getRoleIconComponent(user.role || user.type)}
                           {getRoleDisplayName(user.role || user.type)}
                           {user.email && ` • ${user.email}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {formData.target_user_id === user.id.toString() && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                        <div className={`h-2 w-2 rounded-full ${
                          user.status === 'active' ? "bg-green-500" : "bg-gray-400"
                        }`} title={user.status === 'active' ? "Active" : "Inactive"} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected User Display */}
                     {selectedUser && (
             <div className="p-3 bg-muted/50 rounded-lg">
               <div className="flex items-center gap-2 text-sm">
                 {getRoleIconComponent(selectedUser.role || selectedUser.type)}
                 <span className="font-medium">Selected:</span>
                 <span>{selectedUser.full_name || selectedUser.username}</span>
                 <Badge variant="secondary" className="ml-auto">
                   {getRoleDisplayName(selectedUser.role || selectedUser.type)}
                 </Badge>
               </div>
             </div>
           )}

          {/* Conversation Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Conversation Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select 
                value={formData.conversation_type} 
                onValueChange={(value) => updateFormData({ conversation_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(CONVERSATION_TYPES).map((type) => (
                    <SelectItem key={type} value={type}>
                      {formatConversationType(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => updateFormData({ priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PRIORITY_LEVELS).map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {formatPriority(priority)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              onMouseEnter={() => {
                console.log('🔍 Button hover - disabled state:', {
                  isCreating,
                  noTargetUser: !formData.target_user_id,
                  noSubject: !formData.subject,
                  totalDisabled: isCreating || !formData.target_user_id || !formData.subject
                });
              }}
            >
              {isCreating ? "Creating..." : "Start Conversation"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Chat Component
export default function NewChat() {
  // State management
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  const messagesEndRef = useRef(null);

  // Get current user from Redux store
  const user = useSelector((state) => state?.auth);
  const userRole = user?.role || 'patient';

  // API hooks
  const { 
    data: conversationsData, 
    isLoading: conversationsLoading, 
    error: conversationsError, 
    refetch: refetchConversations 
  } = useGetConversationsQuery({ 
    limit: 50,
    status: 'active'
  });

  const { 
    data: messagesData, 
    isLoading: messagesLoading, 
    refetch: refetchMessages 
  } = useGetConversationsQuery(
    selectedConversation?.conversation_id ? { conversationId: selectedConversation.conversation_id } : undefined,
    { skip: !selectedConversation?.id }
  );

  // Mutation hooks
  const [createConversation, { isLoading: creatingConversation }] = useCreateConversationMutation();
  const [sendMessage, { isLoading: sendingMessage }] = useSendMessageMutation();
  const [updateConversationStatus] = useUpdateConversationStatusMutation();
  const [deleteConversation] = useDeleteConversationMutation();

  // Data extraction with memoization
  const conversations = useMemo(() => extractDataFromResponse(conversationsData), [conversationsData]);
  const messages = useMemo(() => extractDataFromResponse(messagesData), [messagesData]);
  const isBackendAvailable = !conversationsError || conversationsError?.status !== 404;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Event handlers
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversation || !isBackendAvailable) {
      if (!isBackendAvailable) toast.error("Chat service is currently unavailable.");
      return;
    }

    const messageData = {
      conversation_id: selectedConversation.conversation_id || selectedConversation.id,
      content: messageInput.trim(),
      sender_type: userRole,
      message_type: MESSAGE_TYPES.TEXT,
    };

    try {
      await sendMessage(messageData).unwrap();
      setMessageInput("");
      await refetchMessages();
      await refetchConversations(); // Update conversation list with new last message
    } catch (error) {
      console.error('Failed to send message:', error);
      if (error?.data?.error_code === '4031' || error?.data?.error_code === '4032') {
        toast.error(error.data.message || "You are not authorized to send messages in this conversation");
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    }
  };

  const handleCreateConversation = async (formData) => {
    console.log('🌐 Creating conversation with data:', formData);
    console.log('🔗 Backend available:', isBackendAvailable);
    
    if (!isBackendAvailable) {
      console.log('❌ Backend not available');
      toast.error("Chat service is currently unavailable.");
      return;
    }

    try {
      console.log('📡 Making API call to create conversation...');
      const result = await createConversation(formData).unwrap();
      console.log('✅ API call successful:', result);
      
      toast.success("Conversation created successfully!");
      setShowNewConversationModal(false);
      
      // Handle different response structures from backend
      let newConversation = null;
      if (result?.data) {
        newConversation = result.data;
      } else if (result) {
        newConversation = result;
      }
      console.log('💬 New conversation object:', result);
      console.log('💬 New conversation object:', newConversation);
      
      // Set as selected conversation if we have valid data
      if (newConversation?.id) {
        setSelectedConversation(newConversation);
      }
      
      // Refresh conversations list
      await refetchConversations();
      
    } catch (error) {
      console.error('❌ Failed to create conversation:', error);
      console.error('📋 Error details:', {
        status: error?.status,
        data: error?.data,
        message: error?.message
      });
      
      // Handle specific role-based errors
      if (error?.data?.error_code === '4031') {
        toast.error(error.data.message || "You are not authorized to start conversations with this user type");
      } else if (error?.data?.error_code === '4032') {
        toast.error(error.data.message || "Invalid conversation target");
      } else if (error?.data?.error_code === '4044') {
        toast.error(error.data.message || "Target user not found");
      } else {
        toast.error("Failed to create conversation. Please try again.");
      }
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    if (!confirm("Are you sure you want to delete this conversation?")) return;

    try {
      await deleteConversation(conversationId).unwrap();
      toast.success("Conversation deleted successfully!");
      
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
      }
      refetchConversations();
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      toast.error("Failed to delete conversation.");
    }
  };

  const handleUpdateStatus = async (conversationId, status) => {
    if (!canUpdateConversationStatus(userRole)) {
      toast.error("You are not authorized to update conversation status");
      return;
    }

    try {
      await updateConversationStatus({ conversationId, status }).unwrap();
      toast.success(`Conversation ${status === 'closed' ? 'closed' : 'updated'} successfully!`);
      refetchConversations();
    } catch (error) {
      console.error('Failed to update conversation status:', error);
      toast.error("Failed to update conversation status.");
    }
  };

  // Filter conversations based on search term and status
  const filteredConversations = useMemo(() => {
    // First filter by status - only show active conversations
    const activeConversations = conversations.filter(conv => conv.status === 'active');
    
    // Then filter by search term if provided
    if (!searchTerm.trim()) return activeConversations;
    
    const searchLower = searchTerm.toLowerCase();
    return activeConversations.filter(conv => 
      conv.subject?.toLowerCase().includes(searchLower) ||
      conv.patient_name?.toLowerCase().includes(searchLower) ||
      conv.doctor_name?.toLowerCase().includes(searchLower) ||
      (`${conv.patient_first_name} ${conv.patient_last_name}`)?.toLowerCase().includes(searchLower) ||
      (`${conv.doctor_first_name} ${conv.doctor_last_name}`)?.toLowerCase().includes(searchLower) ||
      conv.last_message?.toLowerCase().includes(searchLower)
    );
  }, [conversations, searchTerm]);

  // Get participant info for display
  const getParticipantInfo = (conversation) => {
    if (!conversation) {
      return { name: "Unknown", role: "unknown", avatar: null };
    }

    // Determine the other participant (not the current user)
    const isCurrentUserPatient = userRole === 'patient';
    
    if (isCurrentUserPatient) {
      // Current user is patient, show doctor info
      let doctorName = conversation.doctor_name || "Healthcare Provider";

      // Remove 'null' or 'undefined' from the name string
      doctorName = doctorName.replace(/\b(null|undefined)\b/gi, '').replace(/ +/g, ' ').trim();
      if (!doctorName) doctorName = "Healthcare Provider";

      return {
        name: doctorName,
        role: "doctor",
        avatar: null
      };
    } else {
      // Current user is doctor/staff/admin, show patient info
      let patientName =
        conversation.patient_name ||
        conversation.full_name ||
        ((conversation.patient_first_name && conversation.patient_last_name)
          ? `${conversation.patient_first_name} ${conversation.patient_last_name}`
          : null) ||
        ((conversation.first_name && conversation.last_name)
          ? `${conversation.first_name} ${conversation.last_name}`
          : null) ||
        conversation.username ||
        "Patient";

      patientName = patientName.replace(/\b(null|undefined)\b/gi, '').replace(/ +/g, ' ').trim();
      if (!patientName) patientName = "Patient";

      return {
        name: patientName,
        role: "patient", 
        avatar: null
      };
    }
  };

  const ConversationItem = ({ conversation }) => {
    const participant = getParticipantInfo(conversation);
    const unreadCount = conversation.unread_count || 0;

        return (
      <div
        onClick={() => setSelectedConversation(conversation)}
        className={`mx-3 mb-3 p-6 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
          selectedConversation?.id === conversation.id 
            ? "bg-primary/10 border border-primary/20 shadow-md" 
            : "bg-background/60 hover:bg-muted/40 border border-transparent"
        }`}
      >
        <div className="flex items-start gap-5">
          <div className="relative">
            <Avatar className="h-16 w-16 ring-2 ring-background shadow-sm">
              <AvatarImage src={participant.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-lg">
                {participant.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-background shadow-sm">
              {getRoleIconComponent(participant.role)}
            </div>
          </div>
          
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h4 className="font-semibold text-base text-foreground truncate">{participant.name}</h4>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {formatConversationType(conversation.conversation_type)}
                </Badge>
              </div>
              {conversation.priority && conversation.priority !== 'normal' && (
                <Badge variant={conversation.priority === 'urgent' ? 'destructive' : 'secondary'} className="text-sm px-2 py-1">
                  {formatPriority(conversation.priority)}
                </Badge>
              )}
            </div>
            
            <p className="text-base font-medium text-foreground truncate">
              {conversation.subject}
            </p>
            
            {conversation.last_message && (
              <p className="text-sm text-muted-foreground truncate leading-relaxed">
                {conversation.last_message}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {formatMessageTime(conversation.last_message_at || conversation.updated_at)}
              </span>
              
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center shadow-sm">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-muted/60">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {canUpdateConversationStatus(userRole) && conversation.status === 'active' && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(conversation.id, 'closed');
                        }}
                      >
                        Close Conversation
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(conversation.id);
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
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

  return (
    <div className="h-screen min-h-screen max-h-screen mx-auto max-w-full">
      <Card className="h-full shadow-xl border-0 overflow-hidden rounded-none">
        <div className="flex h-full">
          {/* Conversations Sidebar */}
          <div className="w-96 border-r bg-gradient-to-b from-muted/10 to-muted/30 flex flex-col">
            <div className="p-8 border-b bg-background/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <MessageCircle className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Messages</h2>
                    <p className="text-base text-muted-foreground">Stay connected with your healthcare team</p>
                  </div>
                  {!isBackendAvailable && <WifiOff className="h-5 w-5 text-muted-foreground" />}
                </div>
              </div>
              
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-base bg-background/60 border-muted-foreground/20 focus:border-primary"
                  disabled={!isBackendAvailable}
                />
              </div>
            </div>

            <ScrollArea className="flex-1 px-2">
              {conversationsLoading ? (
                <div className="flex flex-col items-center justify-center h-64 px-6">
                  <div className="p-4 rounded-full bg-primary/10 mb-4">
                    <MessageCircle className="h-8 w-8 text-primary animate-spin" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Loading conversations...</p>
                  <p className="text-xs text-muted-foreground mt-1">Please wait while we fetch your messages</p>
                </div>
              ) : !isBackendAvailable ? (
                <div className="flex flex-col items-center justify-center h-64 px-6 text-center">
                  <div className="p-4 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-4">
                    <WifiOff className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Service Unavailable</p>
                  <p className="text-xs text-muted-foreground mt-1">Chat service is temporarily offline</p>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 px-6 text-center">
                  <div className="p-4 rounded-full bg-muted/30 mb-4">
                    <MessageCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">No conversations found</p>
                  <p className="text-xs text-muted-foreground mt-1">Start a new conversation to get started</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => setShowNewConversationModal(true)}
                    disabled={!isBackendAvailable}
                  >
                    <Plus className="h-3 w-3 mr-2" />
                    New Conversation
                  </Button>
                </div>
              ) : (
                <div className="py-2">
                  {filteredConversations.map((conversation) => (
                    <ConversationItem key={conversation.id} conversation={conversation} />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-gradient-to-br from-background to-muted/20">
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-md mx-auto">
                  <div className="relative mb-8">
                    <div className="p-6 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 mx-auto w-24 h-24 flex items-center justify-center">
                      <MessageCircle className="h-12 w-12 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 p-2 rounded-full bg-background border shadow-sm">
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">No conversation selected</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Choose a conversation from the sidebar to start chatting, or create a new conversation to connect with your healthcare team.
                  </p>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => setShowNewConversationModal(true)}
                      disabled={!isBackendAvailable}
                      className="h-12 px-6 text-sm font-medium shadow-sm"
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
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-8 border-b bg-background/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <Avatar className="h-16 w-16 ring-2 ring-background shadow-sm">
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-lg">
                            {getParticipantInfo(selectedConversation).name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-background shadow-sm">
                          {getRoleIconComponent(getParticipantInfo(selectedConversation).role)}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-bold text-2xl text-foreground">{getParticipantInfo(selectedConversation).name}</h3>
                        <p className="text-base text-muted-foreground">{selectedConversation.subject}</p>
                        <div className="flex items-center gap-3">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span className="text-sm text-muted-foreground">Online</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="px-4 py-2 text-sm">
                        {formatConversationType(selectedConversation.conversation_type)}
                      </Badge>
                      {selectedConversation.priority && selectedConversation.priority !== 'normal' && (
                        <Badge variant={selectedConversation.priority === 'urgent' ? 'destructive' : 'secondary'} className="px-4 py-2 text-sm">
                          {formatPriority(selectedConversation.priority)}
                        </Badge>
                      )}
                      <Badge variant={selectedConversation.status === 'active' ? 'default' : 'secondary'} className="px-4 py-2 text-sm">
                        {selectedConversation.status || 'Active'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-8">
                  {messagesLoading ? (
                    <div className="flex flex-col items-center justify-center h-80">
                      <div className="p-6 rounded-full bg-primary/10 mb-6">
                        <MessageCircle className="h-12 w-12 text-primary animate-spin" />
                      </div>
                      <p className="text-lg font-medium text-foreground">Loading messages...</p>
                      <p className="text-base text-muted-foreground mt-2">Please wait while we fetch your conversation</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-80 text-center">
                      <div className="p-6 rounded-full bg-muted/30 mb-6">
                        <MessageCircle className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <p className="text-lg font-medium text-foreground">No messages yet</p>
                      <p className="text-base text-muted-foreground mt-2">Start the conversation below to begin chatting</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {messages.map((message) => {
                        const isCurrentUser = message.sender_id === user?.userID || message.sender_type === userRole;

                        return (
                          <div
                            key={message.id}
                            className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                          >
                            <div className={`max-w-md lg:max-w-lg ${isCurrentUser ? "order-2" : "order-1"}`}>
                              <div
                                className={`px-6 py-4 rounded-2xl shadow-sm ${
                                  isCurrentUser
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-background border"
                                }`}
                              >
                                <p className="text-base leading-relaxed">{message.message_content || message.content}</p>
                              </div>
                              <div className={`flex items-center gap-3 mt-3 text-sm text-muted-foreground ${
                                isCurrentUser ? "justify-end" : "justify-start"
                              }`}>
                                <Clock className="h-4 w-4" />
                                <span>{formatMessageTime(message.sent_at || message.created_at)}</span>
                                {isCurrentUser && (
                                  <div className="flex items-center ml-2">
                                    {message.is_read || message.read_at ? (
                                      <CheckCheck className="h-4 w-4 text-blue-500" />
                                    ) : (
                                      <Check className="h-4 w-4" />
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
                  <form onSubmit={handleSendMessage} className="flex items-end gap-6">
                    <div className="flex-1">
                      <Textarea
                        placeholder={isBackendAvailable ? "Type your message here..." : "Chat service unavailable..."}
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                        rows={1}
                        className="min-h-[56px] max-h-40 resize-none text-base bg-muted/20 border-muted-foreground/20 focus:border-primary"
                        disabled={!isBackendAvailable || selectedConversation.status === 'closed'}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={!messageInput.trim() || sendingMessage || !isBackendAvailable || selectedConversation.status === 'closed'}
                      className="h-14 px-8 shadow-sm text-base"
                    >
                      {sendingMessage ? (
                        <>
                          <MessageCircle className="h-5 w-5 animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Send
                        </>
                      )}
                    </Button>
                  </form>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {!isBackendAvailable 
                        ? "⚠️ Chat service currently unavailable"
                        : selectedConversation.status === 'closed'
                        ? "🔒 This conversation has been closed"
                        : "💡 Press Enter to send, Shift + Enter for new line"
                      }
                    </p>
                    {isBackendAvailable && selectedConversation.status === 'active' && (
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
      />
    </div>
  );
}