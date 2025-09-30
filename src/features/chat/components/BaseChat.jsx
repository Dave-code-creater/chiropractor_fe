import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  useGetConversationsQuery,
  useSendMessageMutation,
  usePollForNewMessagesQuery,
  useGetMessageStatusQuery,
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
    error: _messagesError,
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
      const normalizeMessage = (m) => ({
        ...m,
        content: m?.content || m?.message_content,
        message_content: m?.content || m?.message_content,
        sender_type: typeof m?.sender_type === 'string' ? m.sender_type.toLowerCase() : m?.sender_type,
      });

      const sortedMessages = [...messagesToLoad].map(normalizeMessage).sort((a, b) => {
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

  const conversations = useMemo(() => {
    if (!conversationsData?.conversations) {
      return [];
    }

    return conversationsData.conversations;
  }, [conversationsData]);

  useEffect(() => {
    if (realtimePollingData?.messages && realtimePollingData.messages.length > 0) {
      setMessages(prevMessages => {
        const normalizeMessage = (m) => ({
          ...m,
          content: m?.content || m?.message_content,
          message_content: m?.content || m?.message_content,
          sender_type: typeof m?.sender_type === 'string' ? m.sender_type.toLowerCase() : m?.sender_type,
        });

        const newMessages = [...prevMessages];

        realtimePollingData.messages.forEach(newMessage => {
          const exists = newMessages.some(msg => msg.id === newMessage.id);
          if (!exists) {
            newMessages.push(normalizeMessage(newMessage));
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

  // Heuristic: determine if a message was sent by the logged-in user
  const isFromCurrentUser = useCallback((message) => {
    if (!message) return false;

    // Compare common id fields
    const currentId = user?.userID != null ? String(user.userID) : null;
    if (currentId) {
      const idKeys = [
        'sender_id', 'user_id', 'author_id', 'from_user_id', 'from_id', 'senderId', 'created_by', 'userId'
      ];
      for (const key of idKeys) {
        const v = message?.[key];
        if (v != null && String(v) === currentId) return true;
      }
    }

    // Compare role-like fields
    const role = (userRole || '').toString().toLowerCase();
    if (role) {
      const roleKeys = ['sender_type', 'sender_role', 'role', 'from_role', 'user_role', 'author_role', 'type'];
      for (const key of roleKeys) {
        const v = message?.[key];
        if (typeof v === 'string' && v.toLowerCase() === role) return true;
      }

      // Sometimes APIs provide a generic 'sender' string
      if (typeof message?.sender === 'string' && message.sender.toLowerCase().includes(role)) {
        return true;
      }
    }

    return false;
  }, [user?.userID, userRole]);

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
          } catch (_error) {
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
        const normalized = {
          ...result.message,
          content: result.message.content || result.message.message_content || messageData.content,
          message_content: result.message.content || result.message.message_content || messageData.content,
          sender_id: result.message.sender_id || user?.userID,
          sender_type: (result.message.sender_type || userRole || 'patient').toLowerCase(),
          sent_at: result.message.sent_at || new Date().toISOString(),
        };
        setMessages(prev => [...prev, normalized]);

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
    isFromCurrentUser,
    useMessageStatus,
    refetchConversations,

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
