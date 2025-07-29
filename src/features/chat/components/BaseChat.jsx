import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  usePollForNewMessagesQuery,
  useGetMessageStatusQuery,
  useCreateConversationMutation,
  useUpdateConversationStatusMutation,
  useDeleteConversationMutation,
} from "@/api/services/chatApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Send,
  MessageCircle,
  Clock,
  Check,
  CheckCheck,
  WifiOff,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { MESSAGE_TYPES } from "../constants/roles";

const BaseChat = ({ roleSpecificProps = {} }) => {
  // State management
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const messagesEndRef = useRef(null);
  const pollingTimeoutRef = useRef(null);

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
    per_page: 50,
    status: 'active',
    ...roleSpecificProps.conversationQueryParams
  });

  // Initial messages load using polling endpoint (since no regular GET messages endpoint exists)
  const {
    data: initialMessagesData,
    isLoading: messagesLoading,
    error: messagesError,
  } = usePollForNewMessagesQuery(
    selectedConversation?.conversation_id || selectedConversation?.id ? {
      conversationId: selectedConversation?.conversation_id || selectedConversation?.id,
      last_message_timestamp: "1970-01-01T00:00:00.000Z", // Get all messages from beginning
      timeout_seconds: 5, // Short timeout for initial load
      max_messages: 100
    } : undefined,
    { skip: !selectedConversation?.conversation_id && !selectedConversation?.id }
  );

  // Handle initial messages load
  useEffect(() => {
    // Handle different response formats
    let messagesToLoad = [];

    if (initialMessagesData?.messages && Array.isArray(initialMessagesData.messages)) {
      messagesToLoad = initialMessagesData.messages;
    } else if (initialMessagesData?.data?.messages && Array.isArray(initialMessagesData.data.messages)) {
      messagesToLoad = initialMessagesData.data.messages;
    } else if (Array.isArray(initialMessagesData)) {
      messagesToLoad = initialMessagesData;
    } else {
      setLastMessageTimestamp(new Date().toISOString());
      return;
    }

    if (messagesToLoad.length > 0) {
      const sortedMessages = [...messagesToLoad].sort((a, b) => {
        const timeA = new Date(a.sent_at || a.created_at || a.timestamp);
        const timeB = new Date(b.sent_at || b.created_at || b.timestamp);
        return timeA - timeB; // Oldest first
      });

      setMessages(sortedMessages);

      // Set last message timestamp for polling
      const lastMessage = sortedMessages[sortedMessages.length - 1];
      const timestamp = lastMessage.sent_at || lastMessage.created_at || lastMessage.timestamp;
      setLastMessageTimestamp(timestamp);
    }
  }, [initialMessagesData]);

  // Real-time polling for new messages (separate from initial load)
  const {
    data: realtimePollingData,
    refetch: refetchRealtimePolling,
  } = usePollForNewMessagesQuery(
    selectedConversation && lastMessageTimestamp && isPolling ? {
      conversationId: selectedConversation?.conversation_id || selectedConversation?.id,
      last_message_timestamp: lastMessageTimestamp,
      timeout_seconds: 30,
      max_messages: 50
    } : undefined,
    {
      skip: !selectedConversation || !lastMessageTimestamp || !isPolling,
    }
  );

  // Mutation hooks
  const [sendMessage, { isLoading: sendingMessage }] = useSendMessageMutation();
  const [updateConversationStatus] = useUpdateConversationStatusMutation();
  const [deleteConversation] = useDeleteConversationMutation();

  // Extract conversations data
  const conversations = useMemo(() => {
    if (!conversationsData?.conversations) {
      return [];
    }

    return conversationsData.conversations;
  }, [conversationsData]);

  // Handle new messages from polling
  useEffect(() => {
    if (realtimePollingData?.messages && realtimePollingData.messages.length > 0) {
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];

        realtimePollingData.messages.forEach(newMessage => {
          // Check if message already exists to avoid duplicates
          const exists = newMessages.some(msg => msg.id === newMessage.id);
          if (!exists) {
            newMessages.push(newMessage);
          }
        });

        // Sort messages by timestamp
        return newMessages.sort((a, b) => {
          const timeA = new Date(a.sent_at || a.created_at || a.timestamp);
          const timeB = new Date(b.sent_at || b.created_at || b.timestamp);
          return timeA - timeB; // Oldest first
        });
      });

      // Update last message timestamp
      const lastMessage = realtimePollingData.messages[realtimePollingData.messages.length - 1];
      const timestamp = lastMessage.sent_at || lastMessage.created_at || lastMessage.timestamp;
      setLastMessageTimestamp(timestamp);
    }
  }, [realtimePollingData]);

  // Start/stop long-polling based on conversation selection
  useEffect(() => {
    if (selectedConversation && messages.length > 0) {
      setIsPolling(true);

      return () => {
        setIsPolling(false);
        if (pollingTimeoutRef.current) {
          clearTimeout(pollingTimeoutRef.current);
        }
      };
    } else {
      setIsPolling(false);
    }
  }, [selectedConversation, messages.length]);

  // Continuous polling loop
  useEffect(() => {
    if (isPolling && selectedConversation && lastMessageTimestamp) {
      const startPolling = () => {
        pollingTimeoutRef.current = setTimeout(async () => {
          try {
            await refetchRealtimePolling();
            if (isPolling) {
              startPolling(); // Continue polling
            }
          } catch (error) {
            // Retry after a short delay
            if (isPolling) {
              pollingTimeoutRef.current = setTimeout(startPolling, 5000);
            }
          }
        }, 1000); // Short delay between polls
      };

      startPolling();

      return () => {
        if (pollingTimeoutRef.current) {
          clearTimeout(pollingTimeoutRef.current);
        }
      };
    }
  }, [isPolling, selectedConversation, lastMessageTimestamp, refetchRealtimePolling]);

  // Reset messages when conversation changes
  useEffect(() => {
    setMessages([]);
    setLastMessageTimestamp(null);
    setIsPolling(false);
  }, [selectedConversation?.id]);

  const isBackendAvailable = !conversationsError || conversationsError?.status !== 404;

  // REMOVED: Auto-scroll functionality - users can manually scroll
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages.length]);

  // Event handlers
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversation || !isBackendAvailable) {
      if (!isBackendAvailable) toast.error("Chat service is currently unavailable.");
      return;
    }

    const messageData = {
      conversationId: selectedConversation.conversation_id || selectedConversation.id,
      content: messageInput.trim(),
      message_type: MESSAGE_TYPES.TEXT,
    };

    try {
      const result = await sendMessage(messageData).unwrap();
      console.log('✅ Message sent successfully:', result);

      setMessageInput("");

      // Add the sent message to local state immediately for better UX
      if (result.message) {
        setMessages(prev => [...prev, result.message]);

        // Update timestamp for polling
        const timestamp = result.message.sent_at || result.message.created_at || new Date().toISOString();
        setLastMessageTimestamp(timestamp);
      }

      await refetchConversations(); // Update conversation list
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  // Custom hook to get message status for a specific message
  const useMessageStatus = (conversationId, messageId) => {
    return useGetMessageStatusQuery(
      conversationId && messageId ? { conversationId, messageId } : undefined,
      {
        skip: !conversationId || !messageId,
        pollingInterval: 10000, // Check status every 10 seconds
      }
    );
  };

  // Format message time
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return {
    // State
    selectedConversation,
    setSelectedConversation,
    messageInput,
    setMessageInput,
    searchTerm,
    setSearchTerm,
    messagesEndRef,

    // Data
    conversations,
    messages,
    isBackendAvailable,
    conversationsLoading,
    messagesLoading,
    sendingMessage,
    isPolling,

    // Event handlers
    handleSendMessage,
    formatMessageTime,
    useMessageStatus,

    // Components
    Button,
    Input,
    Textarea,
    ScrollArea,
    Avatar,
    AvatarFallback,
    AvatarImage,
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
  };
};

export default BaseChat; 