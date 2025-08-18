import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, CACHE_TIMES } from "../core/baseApi";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Conversations", "Messages", "MessageStatus"],
  keepUnusedDataFor: CACHE_TIMES.SHORT,
  refetchOnMountOrArgChange: false, // Only refetch when explicitly needed
  refetchOnFocus: false,            // Prevent automatic refetch on window focus
  refetchOnReconnect: true,         // Keep this for actual network issues
  endpoints: (builder) => ({
    // ===============================================
    // CONVERSATION ROUTES
    // ===============================================

    // Create a new conversation
    createConversation: builder.mutation({
      query: (data) => ({
        url: "chat/conversations",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => {
        if (response?.success && response?.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: ["Conversations"],
    }),

    // Get available users for creating conversations
    getConversationUsers: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.role) queryParams.append("role", params.role);
        if (params.search_term) queryParams.append("search_term", params.search_term);
        if (params.per_page) queryParams.append("per_page", params.per_page.toString());
        if (params.page) queryParams.append("page", params.page.toString());

        const queryString = queryParams.toString();
        return `chat/conversations/users${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response) => {
        if (response?.success && response?.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ["AvailableUsers"],
    }),

    // Get user's conversations
    getConversations: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append("page", params.page.toString());
        if (params.per_page) queryParams.append("per_page", params.per_page.toString());
        if (params.status) queryParams.append("status", params.status);

        const queryString = queryParams.toString();
        return `chat/conversations${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response) => {
        if (!response?.success) {
          return { conversations: [] };
        }

        if (!response?.data?.conversations) {
          return { conversations: [] };
        }

        return response.data;
      },
      providesTags: ["Conversations"],
    }),

    // Get specific conversation
    getConversation: builder.query({
      query: (id) => `chat/conversations/${id}`,
      transformResponse: (response) => {
        if (response?.success && response?.data) {
          return response.data;
        }
        return response;
      },
      providesTags: (result, error, id) => [{ type: "Conversations", id }],
    }),

    // Update conversation status
    updateConversationStatus: builder.mutation({
      query: ({ conversationId, status }) => ({
        url: `chat/conversations/${conversationId}/status`,
        method: "PUT",
        body: { status },
      }),
      transformResponse: (response) => {
        if (response?.success && response?.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: (result, error, { conversationId }) => [
        { type: "Conversations", id: conversationId },
        "Conversations",
      ],
    }),

    // Delete conversation
    deleteConversation: builder.mutation({
      query: (conversationId) => ({
        url: `chat/conversations/${conversationId}`,
        method: "DELETE",
      }),
      transformResponse: (response) => {
        if (response?.success && response?.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: ["Conversations"],
    }),

    // ===============================================
    // MESSAGE ROUTES
    // ===============================================

    // Get messages for a conversation (fallback for initial load)
    getMessages: builder.query({
      query: ({ conversationId, ...params }) => {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append("page", params.page.toString());
        if (params.per_page) queryParams.append("per_page", params.per_page.toString());
        if (params.sort_order) queryParams.append("sort_order", params.sort_order);

        const queryString = queryParams.toString();
        return `chat/conversations/${conversationId}/messages${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response) => {
        if (!response?.success) {
          return { messages: [] };
        }

        if (response?.data?.messages) {
          return response.data;
        } else if (response?.data && Array.isArray(response.data)) {
          return { messages: response.data };
        } else {
          return { messages: [] };
        }
      },
      providesTags: (result, error, { conversationId }) => [
        { type: "Messages", id: conversationId },
      ],
    }),

    // Send message to a conversation (Long-Polling compatible)
    sendMessage: builder.mutation({
      query: ({ conversationId, content, message_type = "text" }) => ({
        url: `chat/conversations/${conversationId}/messages`,
        method: "POST",
        body: { content, message_type },
      }),
      transformResponse: (response) => {
        if (response?.success && response?.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: (result, error, { conversationId }) => [
        { type: "Messages", id: conversationId },
        "Conversations",
      ],
    }),

    // ===============================================
    // LONG-POLLING AND REAL-TIME MESSAGING
    // ===============================================

    // Long-polling endpoint to get new messages (replaces regular GET messages)
    pollForNewMessages: builder.query({
      query: ({ conversationId, last_message_timestamp, timeout_seconds = 30, max_messages = 50 }) => {
        const queryParams = new URLSearchParams();

        if (last_message_timestamp) queryParams.append("last_message_timestamp", last_message_timestamp);
        if (timeout_seconds) queryParams.append("timeout_seconds", timeout_seconds.toString());
        if (max_messages) queryParams.append("max_messages", max_messages.toString());

        const queryString = queryParams.toString();
        return `chat/conversations/${conversationId}/poll${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response) => {
        if (response?.success && response?.data) {
          return response.data;
        }
        return response;
      },
      // Don't cache polling requests - always fetch fresh
      keepUnusedDataFor: 0,
      // Disable automatic refetching for polling
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }),

    // Get message status and delivery info
    getMessageStatus: builder.query({
      query: ({ conversationId, messageId }) =>
        `chat/conversations/${conversationId}/messages/${messageId}/status`,
      transformResponse: (response) => {
        if (response?.success && response?.data) {
          return response.data;
        }
        return response;
      },
      // Cache message status for a short time
      keepUnusedDataFor: 30,
    }),

    // ===============================================
    // LEGACY USER ROUTES
    // ===============================================

    // Get available users (legacy endpoint)
    getAvailableUsers: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.role) queryParams.append("role", params.role);
        if (params.search_term) queryParams.append("search_term", params.search_term);
        if (params.per_page) queryParams.append("per_page", params.per_page.toString());
        if (params.page) queryParams.append("page", params.page.toString());

        const queryString = queryParams.toString();
        return `chat/users${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response) => {
        if (response?.success && response?.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ["AvailableUsers"],
    }),
  }),
});

export const {
  // Conversation hooks
  useCreateConversationMutation,
  useGetConversationUsersQuery,
  useGetConversationsQuery,
  useUpdateConversationStatusMutation,
  useDeleteConversationMutation,

  // Message hooks
  useGetMessagesQuery,
  useSendMessageMutation,

  // Polling hooks
  usePollForNewMessagesQuery,
  useGetMessageStatusQuery,

  // Legacy hooks
  useGetAvailableUsersQuery,
} = chatApi;

export default chatApi;
