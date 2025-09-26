import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, CACHE_TIMES } from "../core/baseApi";

export const appointmentApi = createApi({
  reducerPath: "appointmentApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Appointments", "Doctors", "Availability"],
  keepUnusedDataFor: CACHE_TIMES.MEDIUM,
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    getAvailableDoctors: builder.query({
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
      query: ({ doctor_id, date }) => {
        const queryParams = new URLSearchParams();
        if (date) queryParams.append("date", date);

        return {
          url: `appointments/doctors/${doctor_id}/availability?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["Availability"],
      keepUnusedDataFor: CACHE_TIMES.MEDIUM,
    }),


    createAppointment: builder.mutation({
      query: (data) => ({
        url: "appointments/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Appointments", "Availability"],
      async onQueryStarted(arg, { dispatch: _dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Failed to create appointment:", error);
        }
      },
    }),

    getMyAppointments: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.status) queryParams.append("status", params.status);
        if (params.upcoming_only) queryParams.append("upcoming_only", params.upcoming_only.toString());
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());

        return {
          url: `appointments/me?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["Appointments"],
      keepUnusedDataFor: CACHE_TIMES.SHORT,
    }),



    getAppointments: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.status) queryParams.append("status", params.status);
        if (params.status_not) queryParams.append("status_not", params.status_not);
        if (params.doctor_id) queryParams.append("doctor_id", params.doctor_id);
        if (params.date_from) queryParams.append("date_from", params.date_from);
        if (params.date_to) queryParams.append("date_to", params.date_to);
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
      async onQueryStarted({ id: _id }, { dispatch: _dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Failed to update appointment:", error);
        }
      },
    }),

    getPatientAppointments: builder.query({
      query: ({ patient_id, ...params }) => {
        const queryParams = new URLSearchParams();

        if (params.status) queryParams.append("status", params.status);
        if (params.date_from) queryParams.append("date_from", params.date_from);
        if (params.date_to) queryParams.append("date_to", params.date_to);
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());

        return {
          url: `appointments/patient/${patient_id}?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["Appointments"],
      keepUnusedDataFor: CACHE_TIMES.SHORT,
    }),

    checkAvailability: builder.mutation({
      query: (data) => ({
        url: "appointments/check-availability",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Availability"],
    }),

    getAppointmentStats: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.date_from) queryParams.append("date_from", params.date_from);
        if (params.date_to) queryParams.append("date_to", params.date_to);
        if (params.doctor_id) queryParams.append("doctor_id", params.doctor_id);

        return {
          url: `appointments/stats?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["Appointments"],
      keepUnusedDataFor: CACHE_TIMES.LONG,
    }),

    getAppointmentById: builder.query({
      query: (id) => ({
        url: `appointments/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Appointments", id }],
      keepUnusedDataFor: CACHE_TIMES.SHORT,
    }),

    rescheduleAppointment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `appointments/${id}/reschedule`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Appointments", id },
        "Availability",
      ],
    }),

    cancelAppointment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `appointments/${id}`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Appointments", "Availability"],
    }),
  }),
});

export const {
  useGetAvailableDoctorsQuery,
  useGetDoctorAvailabilityQuery,

  useGetMyAppointmentsQuery,

  useGetPatientAppointmentsQuery,
  useGetAppointmentStatsQuery,
  useGetAppointmentByIdQuery,

  useGetAppointmentsQuery,

  useCreateAppointmentMutation,
  useCheckAvailabilityMutation,
  useUpdateAppointmentMutation,
  useRescheduleAppointmentMutation,
  useCancelAppointmentMutation,
} = appointmentApi;

