import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseApi";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Conversations", "Messages"],
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => ({ url: "conversations" }),
      providesTags: ["Conversations"],
    }),
    createConversation: builder.mutation({
      query: (data) => ({
        url: "conversations",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Conversations"],
    }),
    getMessages: builder.query({
      query: (cId) => ({ url: `conversations/${cId}/messages` }),
      providesTags: (_res, _err, cId) => [
        { type: "Messages", id: cId },
      ],
    }),
    sendMessage: builder.mutation({
      query: ({ conversationId, ...data }) => ({
        url: `conversations/${conversationId}/messages`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_res, _err, { conversationId }) => [
        { type: "Messages", id: conversationId },
      ],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useCreateConversationMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
} = chatApi;
