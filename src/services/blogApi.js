import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseApi";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    fetchPosts: builder.query({
      query: () => ({ url: "posts" }),
    }),
    getPost: builder.query({
      query: (id) => ({ url: `posts/${id}` }),
    }),
    createPost: builder.mutation({
      query: (data) => ({
        url: "posts",
        method: "POST",
        body: data,
      }),
    }),
    updatePost: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `posts/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `posts/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = blogApi;
