import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, CACHE_TIMES } from "../core/baseApi";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Patients", "Vitals"],
  keepUnusedDataFor: CACHE_TIMES.MEDIUM,
  refetchOnMountOrArgChange: 30,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: 30,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    // Patient Management
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
  }),
});

export const {
  useCreatePatientMutation,
  useGetPatientsQuery,
  useGetPatientByIdQuery,
  useUpdatePatientMutation,
} = userApi; 