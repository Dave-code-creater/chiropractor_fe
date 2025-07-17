import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, CACHE_TIMES } from "../core/baseApi";

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
        
        // New status-based filtering (replaces published parameter)
        if (params.status) queryParams.append("status", params.status);
        if (params.category) queryParams.append("category", params.category);
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.search) queryParams.append("search", params.search);
        if (params.tag) queryParams.append("tag", params.tag);
        if (params.sort_by) queryParams.append("sort_by", params.sort_by);
        if (params.sort_order) queryParams.append("sort_order", params.sort_order);

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

    // Publish blog post (change is_published to true)
    publishBlogPost: builder.mutation({
      query: (id) => ({
        url: `blog/posts/${id}`,
        method: "PUT",
        body: { is_published: true },
      }),
      invalidatesTags: (result, error, id) => [
        { type: "BlogPosts", id },
        "BlogPosts",
      ],
    }),

    // Get public blog posts (no authentication required, only published posts)
    getPublicBlogPosts: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        // Public endpoint - no status parameter needed (backend handles this)
        if (params.category) queryParams.append("category", params.category);
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.search) queryParams.append("search", params.search);
        if (params.tag) queryParams.append("tag", params.tag);
        if (params.sort_by) queryParams.append("sort_by", params.sort_by);
        if (params.sort_order) queryParams.append("sort_order", params.sort_order);

        return {
          url: `blog/posts?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["BlogPosts"],
      keepUnusedDataFor: CACHE_TIMES.LONG,
    }),
  }),
});

export const {
  useGetBlogPostsQuery,
  useCreateBlogPostMutation,
  useGetBlogPostByIdQuery,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
  usePublishBlogPostMutation,
  useGetPublicBlogPostsQuery,
} = blogApi;

// Legacy exports for backward compatibility
export const useGetPostsQuery = useGetBlogPostsQuery;
export const useGetPostBySlugQuery = useGetBlogPostByIdQuery;
export const useGetCategoriesQuery = () => ({ data: [], isLoading: false, error: null });
