import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, CACHE_TIMES } from "../core/baseApi";
import { cacheUtils } from "../../utils/cache";

export const appointmentApi = createApi({
  reducerPath: "appointmentApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Appointments", "Doctors", "Availability"],
  keepUnusedDataFor: CACHE_TIMES.SHORT,
  refetchOnMountOrArgChange: 60,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    // Public routes (no authentication required)
    getDoctors: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.is_available) queryParams.append("is_available", params.is_available.toString());
        if (params.specialization) queryParams.append("specialization", params.specialization);

        return {
          url: `appointments/doctors?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["Doctors"],
      keepUnusedDataFor: CACHE_TIMES.LONG,
    }),

    getDoctorAvailability: builder.query({
      query: ({ doctorId, date }) => {
        const queryParams = new URLSearchParams();
        if (date) queryParams.append("date", date);

        return {
          url: `appointments/doctors/${doctorId}/availability?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["Availability"],
      keepUnusedDataFor: CACHE_TIMES.MEDIUM,
    }),

    // Protected routes (authentication required)
    createAppointment: builder.mutation({
      query: (data) => ({
        url: "appointments/book",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Appointments", "Availability"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          cacheUtils.appointments.clearAll();
        } catch (error) {
          console.error("Failed to create appointment:", error);
        }
      },
    }),

    // Get current user's appointments (Fixed endpoint - was causing 403)
    getUserAppointments: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.status) queryParams.append("status", params.status);
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());

        return {
          url: `appointments/`,
          method: "GET",
        };
      },
      providesTags: ["Appointments"],
      keepUnusedDataFor: CACHE_TIMES.SHORT,
    }),

    // Get patient's appointments by patient ID
    getPatientAppointments: builder.query({
      query: ({ patientId, ...params }) => {
        const queryParams = new URLSearchParams();
        
        if (params.status) queryParams.append("status", params.status);
        if (params.date_from) queryParams.append("date_from", params.date_from);
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());

        return {
          url: `appointments/patient/${patientId}?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["Appointments"],
      keepUnusedDataFor: CACHE_TIMES.SHORT,
    }),

    // Get all appointments (role-filtered)
    getAppointments: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.status) queryParams.append("status", params.status);
        if (params.doctor_id) queryParams.append("doctor_id", params.doctor_id);
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());

        return {
          url: `appointments?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["Appointments"],
      keepUnusedDataFor: CACHE_TIMES.SHORT,
    }),

    getAppointmentById: builder.query({
      query: (id) => ({
        url: `appointments/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Appointments", id }],
    }),

    updateAppointment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `appointments/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Appointments", id },
        "Availability",
      ],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          cacheUtils.appointments.clearAll();
        } catch (error) {
          console.error("Failed to update appointment:", error);
        }
      },
    }),

    deleteAppointment: builder.mutation({
      query: (id) => ({
        url: `appointments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Appointments", "Availability"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          cacheUtils.appointments.clearAll();
        } catch (error) {
          console.error("Failed to delete appointment:", error);
        }
      },
    }),

    // Reschedule appointment (alias for update)
    rescheduleAppointment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `appointments/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Appointments", id },
        "Availability",
      ],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          cacheUtils.appointments.clearAll();
        } catch (error) {
          console.error("Failed to reschedule appointment:", error);
        }
      },
    }),

  }),
});

export const {
  useGetDoctorsQuery,
  useGetDoctorAvailabilityQuery,
  useCreateAppointmentMutation,
  useGetUserAppointmentsQuery,
  useGetPatientAppointmentsQuery,
  useGetAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  useRescheduleAppointmentMutation,
} = appointmentApi;

// Legacy compatibility exports
export const useCreateQuickAppointmentMutation = useCreateAppointmentMutation;
