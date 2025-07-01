import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, CACHE_TIMES } from "./baseApi";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["BlogPosts"],
  keepUnusedDataFor: CACHE_TIMES.MEDIUM,
  refetchOnMountOrArgChange: 300, // 5 minutes
  refetchOnFocus: false,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    // Get all blog posts
    getBlogPosts: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.category) queryParams.append("category", params.category);
        if (params.published !== undefined) queryParams.append("published", params.published.toString());
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());

        return {
          url: `blog/posts?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["BlogPosts"],
      keepUnusedDataFor: CACHE_TIMES.LONG,
    }),

    // Create new blog post
    createBlogPost: builder.mutation({
      query: (data) => ({
        url: "blog/posts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BlogPosts"],
    }),

    // Get specific blog post
    getBlogPostById: builder.query({
      query: (id) => ({
        url: `blog/posts/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "BlogPosts", id }],
    }),

    // Update blog post
    updateBlogPost: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `blog/posts/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "BlogPosts", id },
        "BlogPosts",
      ],
    }),

    // Delete blog post (admin only)
    deleteBlogPost: builder.mutation({
      query: (id) => ({
        url: `blog/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BlogPosts"],
    }),
  }),
});

export const {
  useGetBlogPostsQuery,
  useCreateBlogPostMutation,
  useGetBlogPostByIdQuery,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
} = blogApi;

// Legacy exports for backward compatibility
export const useGetPostsQuery = useGetBlogPostsQuery;
export const useGetPostBySlugQuery = useGetBlogPostByIdQuery;
export const useGetCategoriesQuery = () => ({ data: [], isLoading: false, error: null });
