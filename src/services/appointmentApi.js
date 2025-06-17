import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseApi";

export const appointmentApi = createApi({
  reducerPath: "appointmentApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createAppointment: builder.mutation({
      query: (data) => ({
        url: "appointments",
        method: "POST",
        body: data,
      }),
    }),
    getAppointment: builder.query({
      query: (id) => ({ url: `appointments/${id}` }),
    }),
    updateAppointment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `appointments/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    listAppointments: builder.query({
      query: () => ({ url: "appointments" }),
    }),
    deleteAppointment: builder.mutation({
      query: (id) => ({
        url: `appointments/${id}`,
        method: "DELETE",
      }),
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
