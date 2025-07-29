import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { enhancedToast } from "@/components/notifications/SimpleToast";
import { useGetAvailableUsersQuery } from "@/api/services/chatApi";
import {
    CONVERSATION_TYPES,
    PRIORITY_LEVELS,
    canStartConversation,
    validateConversationData,
    getRoleRestrictionError,
    formatConversationType,
    formatPriority,
    getAllowedRoles,
} from "../constants/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Search,
    MessageCircle,
    Check,
    AlertCircle,
    Users,
    UserCheck,
    Stethoscope,
    Shield,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { extractDataFromResponse } from "../utils/chatUtils";

const getRoleDisplayName = (role) => {
    const roleMap = {
        'patient': 'Patient',
        'doctor': 'Doctor',
        'admin': 'Administrator'
    };
    return roleMap[role?.toLowerCase()] || role;
};

const getRoleIconComponent = (role) => {
    switch (role?.toLowerCase()) {
        case 'doctor':
            return <Stethoscope className="h-4 w-4" />;
        case 'admin':
            return <Shield className="h-4 w-4" />;
        case 'patient':
            return <UserCheck className="h-4 w-4" />;
        default:
            return <Users className="h-4 w-4" />;
    }
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
            // Patients can only see doctors and admins
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

    const handleSubmit = () => {
        // Validate form data
        const validation = validateConversationData(formData);

        if (!validation.isValid) {
            enhancedToast.validation.invalid("Conversation details", validation.errorMessage);
            return;
        }

        // Find selected user to validate role restrictions
        const selectedUser = availableUsers.find(user => user.id.toString() === formData.target_user_id.toString());

        if (!selectedUser) {
            enhancedToast.error("Please select a recipient", "Choose a healthcare professional to start the conversation");
            return;
        }

        // Get the target user's role (handle both 'role' and 'type' properties)
        const targetUserRole = selectedUser.role || selectedUser.type;

        // Client-side role validation (redundant with server-side but provides better UX)
        const canStart = canStartConversation(currentUserRole, targetUserRole);

        if (!canStart) {
            const errorMessage = getRoleRestrictionError(currentUserRole, targetUserRole);
            enhancedToast.error(
                "Cannot start conversation",
                {
                    description: errorMessage,
                    showSupport: false
                }
            );
            return;
        }

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
        { value: "admin", label: "Administrators Only", icon: Shield },
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
            <Card className="w-full max-w-xs sm:max-w-md md:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                <CardHeader className="p-3 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                        <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                        Start New Conversation
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-6 p-3 sm:p-6 pt-0">

                    {/* Role Info Alert */}
                    <Alert className="p-3">
                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        <AlertDescription className="text-xs sm:text-sm">
                            As a {getRoleDisplayName(currentUserRole)}, you can chat with: {getAllowedRoles(currentUserRole).map(getRoleDisplayName).join(', ')}
                        </AlertDescription>
                    </Alert>

                    {/* Role Filter */}
                    <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-medium">Filter by Role</label>
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
                            <SelectTrigger className="h-8 sm:h-10 text-xs sm:text-sm">
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

                    {/* User Search */}
                    <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-medium">Search Users</label>
                        <div className="relative">
                            <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email..."
                                value={searchTerm}
                                onChange={(e) => {
                                    try {
                                        setSearchTerm(e.target.value);
                                    } catch (error) {
                                        console.error('Error updating search term:', error);
                                    }
                                }}
                                className="pl-8 sm:pl-10 h-8 sm:h-10 text-xs sm:text-sm"
                            />
                        </div>
                    </div>

                    {/* Available Users */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs sm:text-sm font-medium">Select User *</label>
                            {!isLoadingUsers && availableUsers.length > 0 && (
                                <span className="text-xs text-muted-foreground">
                                    {availableUsers.length} user{availableUsers.length !== 1 ? 's' : ''} found
                                </span>
                            )}
                        </div>
                        {isLoadingUsers ? (
                            <div className="p-3 sm:p-4 text-center text-muted-foreground">
                                <MessageCircle className="h-4 w-4 sm:h-6 sm:w-6 mx-auto mb-2 animate-spin" />
                                <span className="text-xs sm:text-sm">Loading available users...</span>
                            </div>
                        ) : usersError ? (
                            <Alert variant="destructive" className="p-3">
                                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                <AlertDescription className="text-xs sm:text-sm">
                                    Failed to load available users. Please try again.
                                </AlertDescription>
                            </Alert>
                        ) : availableUsers.length === 0 ? (
                            <div className="p-3 sm:p-4 text-center text-muted-foreground">
                                <Users className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-xs sm:text-sm">No users found</p>
                                <p className="text-xs">
                                    {searchTerm ? "Try adjusting your search terms" :
                                        roleFilter !== "all" ? `No ${roleFilter}s available` : "No healthcare professionals available"}
                                </p>
                            </div>
                        ) : (
                            <div className="border rounded-lg max-h-32 sm:max-h-48 overflow-y-auto">
                                {availableUsers.map((user) => (
                                    <button
                                        key={user.id}
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            updateFormData({ target_user_id: user.id.toString() });
                                        }}
                                        className={`w-full p-2 sm:p-3 text-left hover:bg-muted/50 border-b last:border-b-0 transition-colors ${formData.target_user_id === user.id.toString()
                                            ? "bg-primary/10 border-primary/20"
                                            : ""
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                                                <AvatarImage src={user.avatar} />
                                                <AvatarFallback className="text-xs">
                                                    {user.full_name?.split(' ').map(n => n[0]).join('') || user.username?.[0] || '?'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-xs sm:text-sm truncate">
                                                    {user.full_name || user.username}
                                                </div>
                                                <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                                                    {getRoleIconComponent(user.role || user.type)}
                                                    <span className="hidden sm:inline">{getRoleDisplayName(user.role || user.type)}</span>
                                                    {user.email && <span className="hidden sm:inline"> • {user.email}</span>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {formData.target_user_id === user.id.toString() && (
                                                    <Check className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                                                )}
                                                <div className={`h-2 w-2 rounded-full ${user.status === 'active' ? "bg-green-500" : "bg-gray-400"
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
                        <div className="p-2 sm:p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-2 text-xs sm:text-sm">
                                {getRoleIconComponent(selectedUser.role || selectedUser.type)}
                                <span className="font-medium">Selected:</span>
                                <span className="truncate">{selectedUser.full_name || selectedUser.username}</span>
                                <Badge variant="secondary" className="ml-auto text-xs shrink-0">
                                    {getRoleDisplayName(selectedUser.role || selectedUser.type)}
                                </Badge>
                            </div>
                        </div>
                    )}

                    {/* Conversation Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {/* Conversation Type */}
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-medium">Type</label>
                            <Select
                                value={formData.conversation_type}
                                onValueChange={(value) => updateFormData({ conversation_type: value })}
                            >
                                <SelectTrigger className="h-8 sm:h-10 text-xs sm:text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(CONVERSATION_TYPES).map((type) => (
                                        <SelectItem key={type} value={type}>
                                            <span className="text-xs sm:text-sm">{formatConversationType(type)}</span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Priority */}
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-medium">Priority</label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value) => updateFormData({ priority: value })}
                            >
                                <SelectTrigger className="h-8 sm:h-10 text-xs sm:text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(PRIORITY_LEVELS).map((priority) => (
                                        <SelectItem key={priority} value={priority}>
                                            <span className="text-xs sm:text-sm">{formatPriority(priority)}</span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-medium">Subject *</label>
                        <Input
                            placeholder="e.g., Appointment inquiry..."
                            value={formData.subject}
                            onChange={(e) => updateFormData({ subject: e.target.value })}
                            maxLength={200}
                            className="h-8 sm:h-10 text-xs sm:text-sm"
                        />
                        <div className="text-xs text-muted-foreground text-right">
                            {formData.subject.length}/200 characters
                        </div>
                    </div>

                    {/* Initial Message */}
                    <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-medium">Initial Message</label>
                        <Textarea
                            placeholder="Start your conversation..."
                            value={formData.initial_message}
                            onChange={(e) => updateFormData({ initial_message: e.target.value })}
                            rows={3}
                            maxLength={2000}
                            className="text-xs sm:text-sm min-h-[60px] sm:min-h-[80px]"
                        />
                        <div className="text-xs text-muted-foreground text-right">
                            {formData.initial_message.length}/2000 characters
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2 sm:pt-4">
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

export default NewConversationModal;
