import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../core/baseApi";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Conversations", "Messages", "AvailableUsers"],
  keepUnusedDataFor: 30,
  refetchOnMountOrArgChange: 30,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    // Get staff, admin and doctors for chat (role-based filtering)
    getAvailableUsers: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.search) queryParams.append("search", params.search);
        if (params.role) queryParams.append("role", params.role);
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.offset) queryParams.append("offset", params.offset.toString());

        return `chat/staff-admin-doctors?${queryParams}`;
      },
      transformResponse: (response) => {
        // Handle the new API response format
        if (response?.success && response?.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ["AvailableUsers"],
    }),

    // Create a new conversation (role-based restrictions enforced by backend)
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

    // Get user's conversations
    getConversations: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.status) queryParams.append("status", params.status);
        if (params.conversation_type) queryParams.append("conversation_type", params.conversation_type);
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.offset) queryParams.append("offset", params.offset.toString());

        return `chat/conversations?${queryParams}`;
      },
      transformResponse: (response) => {
        if (response?.success && response?.data) {
          return response.data;
        }
        return response;
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

    // Get messages for a specific conversation
    getMessages: builder.query({
      query: ({ conversationId, ...params }) => {
        const queryParams = new URLSearchParams();
        
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.offset) queryParams.append("offset", params.offset.toString());

        return `chat/conversations/${conversationId}/messages`;
      },
      transformResponse: (response) => {
        if (response?.success && response?.data) {
          return response.data;
        }
        return response;
      },
      providesTags: (result, error, { conversationId }) => [
        { type: "Messages", id: conversationId },
      ],
    }),

    // Send a message
    sendMessage: builder.mutation({
      query: (data) => ({
        url: "chat/messages",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => {
        if (response?.success && response?.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: (result, error, { conversation_id }) => [
        { type: "Messages", id: conversation_id },
        "Conversations",
      ],
    }),

    // Update conversation status (Doctors/Staff/Admin only)
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

    // Delete conversation (if supported)
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
  }),
});

export const {
  useGetAvailableUsersQuery,
  useCreateConversationMutation,
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useUpdateConversationStatusMutation,
  useDeleteConversationMutation,
} = chatApi;

// Legacy compatibility exports for components that might still use old hook names
export const useCreateDoctorPatientChatMutation = useCreateConversationMutation;

// Export the API for store configuration
export default chatApi;
