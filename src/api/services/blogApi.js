import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, CACHE_TIMES } from "../core/baseApi";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["BlogPosts", "Categories"],
  keepUnusedDataFor: CACHE_TIMES.LONG,
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    getBlogPosts: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.status)
          queryParams.append("status", params.status);
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

    createBlogPost: builder.mutation({
      query: (data) => ({
        url: "blog/posts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BlogPosts"],
    }),

    getBlogPostById: builder.query({
      query: (id) => ({
        url: `blog/posts/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "BlogPosts", id }],
    }),

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

    deleteBlogPost: builder.mutation({
      query: (id) => ({
        url: `blog/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BlogPosts"],
    }),

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

    getPublicBlogPosts: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        queryParams.append("status", "published");

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

    getCategories: builder.query({
      query: () => ({
        url: "blog/categories",
        method: "GET",
      }),
      providesTags: ["Categories"],
      keepUnusedDataFor: CACHE_TIMES.VERY_LONG,
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
  useGetCategoriesQuery,
} = blogApi;


