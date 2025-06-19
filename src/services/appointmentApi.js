import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseApi";

export const appointmentApi = createApi({
  reducerPath: "appointmentApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Appointments"],
  endpoints: (builder) => ({
    createAppointment: builder.mutation({
      query: (data) => ({
        url: "appointments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Appointments"],
    }),
    getAppointment: builder.query({
      query: (id) => ({ url: `appointments/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "Appointments", id }],
    }),
    updateAppointment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `appointments/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Appointments", id },
      ],
    }),
    listAppointments: builder.query({
      query: () => ({ url: "appointments" }),
      providesTags: ["Appointments"],
    }),
    deleteAppointment: builder.mutation({
      query: (id) => ({
        url: `appointments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Appointments", id }],
    }),
  }),
});

export const {
  useCreateAppointmentMutation,
  useGetAppointmentQuery,
  useUpdateAppointmentMutation,
  useListAppointmentsQuery,
  useDeleteAppointmentMutation,
} = appointmentApi;
