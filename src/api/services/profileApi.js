import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../core/baseApi";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    // Get current user profile
    getProfile: builder.query({
      query: () => ({
        url: "users/profile",
        method: "GET",
      }),
      providesTags: ["Profile"],
      transformResponse: (response) => {
        // Transform response from snake_case to camelCase for frontend
        if (response.success && response.data) {
          const profile = response.data;
          return {
            ...profile,
            firstName: profile.first_name,
            lastName: profile.last_name,
            middleName: profile.middle_name,
            dateOfBirth: profile.date_of_birth,
            maritalStatus: profile.marital_status,
            phoneNumber: profile.phone_number,
            homeAddress: profile.home_address,
            zipCode: profile.zip_code,
            emergencyContact: profile.emergency_contact,
            bloodType: profile.blood_type,
            chronicConditions: profile.chronic_conditions,
            physicianName: profile.physician_name,
            physicianPhone: profile.physician_phone,
            insuranceProvider: profile.insurance_provider,
            policyNumber: profile.policy_number,
          };
        }
        return response;
      },
    }),

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
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateContactInfoMutation,
  useUpdateMedicalInfoMutation,
} = profileApi; 