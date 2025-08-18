import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, CACHE_TIMES } from "../core/baseApi";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Profile"],
  keepUnusedDataFor: CACHE_TIMES.MEDIUM,
  refetchOnMountOrArgChange: false, // Only refetch when explicitly needed
  refetchOnFocus: false,            // Prevent automatic refetch on window focus
  refetchOnReconnect: true,         // Keep this for actual network issues
  endpoints: (builder) => ({
    // Update personal information
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: "users/profile/personal",
        method: "PUT",
        body: profileData, // Already in snake_case format
      }),
      invalidatesTags: ["Profile"],
      transformResponse: (response) => {
        if (response.success) {
          return {
            success: true,
            message: response.message || "Profile updated successfully",
            data: response.data,
          };
        }
        return response;
      },
    }),

    // Update contact information
    updateContactInfo: builder.mutation({
      query: (contactData) => ({
        url: "users/profile/contact",
        method: "PUT",
        body: contactData, // Already in snake_case format
      }),
      invalidatesTags: ["Profile"],
      transformResponse: (response) => {
        if (response.success) {
          return {
            success: true,
            message: response.message || "Contact information updated successfully",
            data: response.data,
          };
        }
        return response;
      },
    }),

    // Update medical information
    updateMedicalInfo: builder.mutation({
      query: (medicalData) => ({
        url: "users/profile/medical",
        method: "PUT",
        body: medicalData, // Already in snake_case format
      }),
      invalidatesTags: ["Profile"],
      transformResponse: (response) => {
        if (response.success) {
          return {
            success: true,
            message: response.message || "Medical information updated successfully",
            data: response.data,
          };
        }
        return response;
      },
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useUpdateContactInfoMutation,
  useUpdateMedicalInfoMutation,
} = profileApi; 