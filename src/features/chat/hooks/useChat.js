import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { enhancedToast } from "@/components/notifications/SimpleToast";
import {
    useGetConversationsQuery,
    useGetMessagesQuery,
    useSendMessageMutation,
    useCreateConversationMutation,
    useUpdateConversationStatusMutation,
    useDeleteConversationMutation,
} from "@/api/services/chatApi";
import { extractDataFromResponse, getParticipantInfo } from "../utils/chatUtils";

export const useChat = () => {
    // State management
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showNewConversationModal, setShowNewConversationModal] = useState(false);

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
    } = useGetMessagesQuery(
        selectedConversation?.conversation_id ? { conversation_id: selectedConversation.conversation_id } : undefined,
        { skip: !selectedConversation?.conversation_id }
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

    // Get participant info helper
    const getParticipantInfoForConversation = (conversation) => {
        return getParticipantInfo(conversation, userRole);
    };

    // Event handlers
    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!messageInput.trim() || !selectedConversation) return;
        if (!isBackendAvailable) {
            enhancedToast.error("Chat service is currently unavailable. Please try again later.");
            return;
        }

        try {
            const messageData = {
                conversation_id: selectedConversation.conversation_id || selectedConversation.id,
                message_content: messageInput.trim(),
                sender_type: userRole,
                sender_id: user?.userID,
            };

            await sendMessage(messageData).unwrap();
            setMessageInput("");
            refetchMessages();
            refetchConversations();
        } catch (error) {
            console.error("Failed to send message:", error);
            enhancedToast.error("Failed to send message. Please try again.");
        }
    };

    const handleCreateConversation = async (formData) => {
        if (!isBackendAvailable) {
            enhancedToast.error("Chat service is currently unavailable. Please try again later.");
            return;
        }

        try {
            const conversationData = {
                ...formData,
                status: 'active',
                created_by: user?.userID,
                creator_role: userRole,
            };

            const response = await createConversation(conversationData).unwrap();

            if (response?.data) {
                const newConversation = response.data;
                setSelectedConversation(newConversation);
                setShowNewConversationModal(false);
                refetchConversations();
                enhancedToast.success("Conversation created successfully!");
            }
        } catch (error) {
            console.error("Failed to create conversation:", error);
            enhancedToast.error("Failed to create conversation. Please try again.");
        }
    };

    const handleDeleteConversation = async (conversation_id) => {
        // Show confirmation with enhanced dialog
        if (!confirm("Are you sure you want to delete this conversation? This action cannot be undone.")) {
            return;
        }

        try {
            await deleteConversation({ id: conversation_id }).unwrap();

            if (selectedConversation && selectedConversation.id === conversation_id) {
                setSelectedConversation(null);
            }

            refetchConversations();
            enhancedToast.success("Conversation deleted successfully!");
        } catch (error) {
            console.error("Failed to delete conversation:", error);
            enhancedToast.error("Failed to delete conversation. Please try again.");
        }
    };

    const handleUpdateStatus = async (conversation_id, status) => {
        try {
            await updateConversationStatus({
                id: conversation_id,
                status
            }).unwrap();

            refetchConversations();
            enhancedToast.success(`Conversation ${status} successfully!`);
        } catch (error) {
            console.error("Failed to update conversation status:", error);
            enhancedToast.error("Failed to update conversation status. Please try again.");
        }
    };

    return {
        // State
        selectedConversation,
        messageInput,
        searchTerm,
        showNewConversationModal,

        // Data
        conversations: filteredConversations,
        messages,
        user,
        userRole,

        // Loading states
        conversationsLoading,
        messagesLoading,
        creatingConversation,
        sendingMessage,
        isBackendAvailable,

        // Setters
        setSelectedConversation,
        setMessageInput,
        setSearchTerm,
        setShowNewConversationModal,

        // Handlers
        handleSendMessage,
        handleCreateConversation,
        handleDeleteConversation,
        handleUpdateStatus,
        getParticipantInfoForConversation,
    };
};
