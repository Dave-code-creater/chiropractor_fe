import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseApi";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Posts"],
  endpoints: (builder) => ({
    fetchPosts: builder.query({
      query: () => ({ url: "posts" }),
      providesTags: ["Posts"],
    }),
    getPost: builder.query({
      query: (id) => ({ url: `posts/${id}` }),
      providesTags: (_res, _err, id) => [{ type: "Posts", id }],
    }),
    createPost: builder.mutation({
      query: (data) => ({
        url: "posts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Posts"],
    }),
    updatePost: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `posts/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: "Posts", id }],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [{ type: "Posts", id }],
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
