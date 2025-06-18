import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseApi";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => ({ url: "conversations" }),
    }),
    createConversation: builder.mutation({
      query: (data) => ({
        url: "conversations",
        method: "POST",
        body: data,
      }),
    }),
    getMessages: builder.query({
      query: (cId) => ({ url: `conversations/${cId}/messages` }),
    }),
    sendMessage: builder.mutation({
      query: ({ conversationId, ...data }) => ({
        url: `conversations/${conversationId}/messages`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useCreateConversationMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
} = chatApi;
