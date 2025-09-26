import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, CACHE_TIMES } from "../core/baseApi";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Conversations", "Messages", "MessageStatus"],
  keepUnusedDataFor: CACHE_TIMES.SHORT,
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: true,
  endpoints: (builder) => ({

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


    pollForNewMessages: builder.query({
      query: ({ conversationId, last_message_timestamp, timeout_seconds = 5, max_messages = 50 }) => {
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
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }),

    getMessageStatus: builder.query({
      query: ({ conversationId, messageId }) =>
        `chat/conversations/${conversationId}/messages/${messageId}/status`,
      transformResponse: (response) => {
        if (response?.success && response?.data) {
          return response.data;
        }
        return response;
      },
      keepUnusedDataFor: 30,
    }),


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
  useCreateConversationMutation,
  useGetConversationUsersQuery,
  useGetConversationsQuery,
  useUpdateConversationStatusMutation,
  useDeleteConversationMutation,

  useGetMessagesQuery,
  useSendMessageMutation,

  usePollForNewMessagesQuery,
  useGetMessageStatusQuery,

  useGetAvailableUsersQuery,
} = chatApi;

export default chatApi;
