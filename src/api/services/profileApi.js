import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../core/baseApi";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Profile"],
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