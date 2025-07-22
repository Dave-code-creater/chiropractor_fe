import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, CACHE_TIMES } from "../core/baseApi";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Patients", "ClinicalNotes", "Vitals"],
  keepUnusedDataFor: CACHE_TIMES.SHORT,
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

    // Clinical Notes
    addClinicalNotes: builder.mutation({
      query: ({ patient_id, ...data }) => ({
        url: `users/patients/${patient_id}/clinical-notes`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { patient_id }) => [
        { type: "ClinicalNotes", id: patient_id },
        { type: "Patients", id: patient_id },
      ],
    }),

    getClinicalNotes: builder.query({
      query: ({ patient_id, ...params }) => {
        const queryParams = new URLSearchParams();

        if (params.date_from) queryParams.append("date_from", params.date_from);
        if (params.date_to) queryParams.append("date_to", params.date_to);

        return {
          url: `users/patients/${patient_id}/clinical-notes?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: (result, error, { patient_id }) => [
        { type: "ClinicalNotes", id: patient_id },
      ],
    }),
  }),
});

export const {
  useCreatePatientMutation,
  useGetPatientsQuery,
  useGetPatientByIdQuery,
  useUpdatePatientMutation,
  useAddClinicalNotesMutation,
  useGetClinicalNotesQuery,
} = userApi; 