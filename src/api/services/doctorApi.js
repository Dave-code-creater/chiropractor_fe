import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, CACHE_TIMES } from "../core/baseApi";

export const doctorApi = createApi({
  reducerPath: "doctorApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["DoctorPatients", "DoctorStats", "PatientDetails"],
  keepUnusedDataFor: CACHE_TIMES.MEDIUM,
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    getDoctorPatients: builder.query({
      query: ({ doctorId, ...params }) => {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.search) queryParams.append("search", params.search);
        if (params.status && params.status !== 'all') queryParams.append("status", params.status);

        const queryString = queryParams.toString();
        const suffix = queryString ? `?${queryString}` : '';

        return {
          url: `doctors/${doctorId}/patients${suffix}`,
          method: "GET",
        };
      },
      providesTags: (result, error, { doctorId }) => [
        { type: "DoctorPatients", id: doctorId },
      ],
      keepUnusedDataFor: CACHE_TIMES.MEDIUM,
    }),

    getPatientDetailsForDoctor: builder.query({
      query: ({ doctorId, patientId }) => ({
        url: `doctors/${doctorId}/patients/${patientId}`,
        method: "GET",
      }),
      providesTags: (result, error, { doctorId, patientId }) => [
        { type: "PatientDetails", id: `${doctorId}-${patientId}` },
      ],
    }),

    getDoctorStats: builder.query({
      query: ({ doctorId, range }) => {
        const queryParams = new URLSearchParams();
        if (range) queryParams.append("range", range);

        return {
          url: `doctors/${doctorId}/stats?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: (result, error, { doctorId }) => [
        { type: "DoctorStats", id: doctorId },
      ],
      keepUnusedDataFor: CACHE_TIMES.SHORT,
    }),
  }),
});

export const {
  useGetDoctorPatientsQuery,
  useGetPatientDetailsForDoctorQuery,
  useGetDoctorStatsQuery,
} = doctorApi;
