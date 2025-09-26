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
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const messagesEndRef = useRef(null);
  const pollingTimeoutRef = useRef(null);

  const user = useSelector((state) => state?.auth);
  const userRole = user?.role || 'patient';

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

  const {
    data: initialMessagesData,
    isLoading: messagesLoading,
    error: messagesError,
  } = usePollForNewMessagesQuery(
    selectedConversation?.conversation_id || selectedConversation?.id ? {
      conversationId: selectedConversation?.conversation_id || selectedConversation?.id,
      last_message_timestamp: "1970-01-01T00:00:00.000Z",
      timeout_seconds: 5,
      max_messages: 100
    } : undefined,
    { skip: !selectedConversation?.conversation_id && !selectedConversation?.id }
  );

  useEffect(() => {
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
        return timeA - timeB;
      });

      setMessages(sortedMessages);

      const lastMessage = sortedMessages[sortedMessages.length - 1];
      const timestamp = lastMessage.sent_at || lastMessage.created_at || lastMessage.timestamp;
      setLastMessageTimestamp(timestamp);
    }
  }, [initialMessagesData]);

  const {
    data: realtimePollingData,
    refetch: refetchRealtimePolling,
  } = usePollForNewMessagesQuery(
    selectedConversation && lastMessageTimestamp && isPolling ? {
      conversationId: selectedConversation?.conversation_id || selectedConversation?.id,
      last_message_timestamp: lastMessageTimestamp,
      timeout_seconds: 5,
      max_messages: 50
    } : undefined,
    {
      skip: !selectedConversation || !lastMessageTimestamp || !isPolling,
    }
  );

  const [sendMessage, { isLoading: sendingMessage }] = useSendMessageMutation();
  const [updateConversationStatus] = useUpdateConversationStatusMutation();
  const [deleteConversation] = useDeleteConversationMutation();

  const conversations = useMemo(() => {
    if (!conversationsData?.conversations) {
      return [];
    }

    return conversationsData.conversations;
  }, [conversationsData]);

  useEffect(() => {
    if (realtimePollingData?.messages && realtimePollingData.messages.length > 0) {
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];

        realtimePollingData.messages.forEach(newMessage => {
          const exists = newMessages.some(msg => msg.id === newMessage.id);
          if (!exists) {
            newMessages.push(newMessage);
          }
        });

        return newMessages.sort((a, b) => {
          const timeA = new Date(a.sent_at || a.created_at || a.timestamp);
          const timeB = new Date(b.sent_at || b.created_at || b.timestamp);
          return timeA - timeB;
        });
      });

      const lastMessage = realtimePollingData.messages[realtimePollingData.messages.length - 1];
      const timestamp = lastMessage.sent_at || lastMessage.created_at || lastMessage.timestamp;
      setLastMessageTimestamp(timestamp);
    }
  }, [realtimePollingData]);

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

  useEffect(() => {
    if (isPolling && selectedConversation && lastMessageTimestamp) {
      const startPolling = () => {
        pollingTimeoutRef.current = setTimeout(async () => {
          try {
            await refetchRealtimePolling();
            if (isPolling) {
              startPolling();
            }
          } catch (error) {
            if (isPolling) {
              pollingTimeoutRef.current = setTimeout(startPolling, 5000);
            }
          }
        }, 1000);
      };

      startPolling();

      return () => {
        if (pollingTimeoutRef.current) {
          clearTimeout(pollingTimeoutRef.current);
        }
      };
    }
  }, [isPolling, selectedConversation, lastMessageTimestamp, refetchRealtimePolling]);

  useEffect(() => {
    setMessages([]);
    setLastMessageTimestamp(null);
    setIsPolling(false);
  }, [selectedConversation?.id]);

  const isBackendAvailable = !conversationsError || conversationsError?.status !== 404;

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

      setMessageInput("");

      if (result.message) {
        setMessages(prev => [...prev, result.message]);

        const timestamp = result.message.sent_at || result.message.created_at || new Date().toISOString();
        setLastMessageTimestamp(timestamp);
      }

      await refetchConversations();
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  const useMessageStatus = (conversationId, messageId) => {
    return useGetMessageStatusQuery(
      conversationId && messageId ? { conversationId, messageId } : undefined,
      {
        skip: !conversationId || !messageId,
        pollingInterval: 10000,
      }
    );
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return {
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
    isPolling,

    handleSendMessage,
    formatMessageTime,
    useMessageStatus,

    Button,
    Input,
    Textarea,
    ScrollArea,
    Avatar,
    AvatarFallback,
    AvatarImage,
    Card,
    CardContent,

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