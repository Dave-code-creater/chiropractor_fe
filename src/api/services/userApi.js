import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, CACHE_TIMES } from "../core/baseApi";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Patients", "Vitals", "Profile"],
  keepUnusedDataFor: CACHE_TIMES.MEDIUM,
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => ({
        url: "users/profile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    createPatient: builder.mutation({
      query: (data) => ({
        url: "users/patients",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Patients"],
    }),

    getPatients: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.search) queryParams.append("search", params.search);

        return {
          url: `users/patients?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["Patients"],
      keepUnusedDataFor: CACHE_TIMES.MEDIUM,
    }),

    getPatientById: builder.query({
      query: (id) => ({
        url: `users/patients/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Patients", id }],
    }),

    updatePatient: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `users/patients/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Patients", id },
      ],
    }),

    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: "users/profile/personal",
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["Profile", "User"],
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

    updateContactInfo: builder.mutation({
      query: (contactData) => ({
        url: "users/profile/contact",
        method: "PUT",
        body: contactData,
      }),
      invalidatesTags: ["Profile", "User"],
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

    updateMedicalInfo: builder.mutation({
      query: (medicalData) => ({
        url: "users/profile/medical",
        method: "PUT",
        body: medicalData,
      }),
      invalidatesTags: ["Profile", "User"],
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
  useGetUserProfileQuery,
  useCreatePatientMutation,
  useGetPatientsQuery,
  useGetPatientByIdQuery,
  useUpdatePatientMutation,
  useUpdateProfileMutation,
  useUpdateContactInfoMutation,
  useUpdateMedicalInfoMutation,
} = userApi; 