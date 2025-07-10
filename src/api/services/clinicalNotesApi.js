import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../core/baseApi";

export const clinicalNotesApi = createApi({
  reducerPath: "clinicalNotesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["ClinicalNote", "Patient", "PatientCase"],
  endpoints: (builder) => ({
    // Get all patients for clinical notes
    getPatientsForNotes: builder.query({
      query: ({ search, status, limit = 50, offset = 0 } = {}) => ({
        url: "/patients",
        params: { search, status, limit, offset },
      }),
      providesTags: ["Patient"],
    }),

    // Get detailed patient information for case management
    getPatientCase: builder.query({
      query: (patientId) => `/patients/${patientId}/case`,
      providesTags: (result, error, patientId) => [
        { type: "PatientCase", id: patientId },
      ],
    }),

    // Get clinical notes for a specific patient
    getPatientClinicalNotes: builder.query({
      query: ({ patientId, limit = 20, offset = 0 } = {}) => ({
        url: `/patients/${patientId}/notes`,
        params: { limit, offset },
      }),
      providesTags: (result, error, { patientId }) => [
        { type: "ClinicalNote", id: patientId },
      ],
    }),

    // Create a new clinical note
    createClinicalNote: builder.mutation({
      query: ({ patientId, ...noteData }) => ({
        url: `/patients/${patientId}/notes`,
        method: "POST",
        body: {
          ...noteData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: "ClinicalNote", id: patientId },
        { type: "PatientCase", id: patientId },
      ],
    }),

    // Update an existing clinical note
    updateClinicalNote: builder.mutation({
      query: ({ patientId, noteId, ...noteData }) => ({
        url: `/patients/${patientId}/notes/${noteId}`,
        method: "PUT",
        body: {
          ...noteData,
          updatedAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: (result, error, { patientId, noteId }) => [
        { type: "ClinicalNote", id: patientId },
        { type: "ClinicalNote", id: noteId },
      ],
    }),

    // Delete a clinical note
    deleteClinicalNote: builder.mutation({
      query: ({ patientId, noteId }) => ({
        url: `/patients/${patientId}/notes/${noteId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { patientId, noteId }) => [
        { type: "ClinicalNote", id: patientId },
        { type: "ClinicalNote", id: noteId },
      ],
    }),

    // Get clinical note templates
    getClinicalNoteTemplates: builder.query({
      query: () => "/templates",
      providesTags: ["ClinicalNote"],
    }),

    // Update patient vitals
    updatePatientVitals: builder.mutation({
      query: ({ patientId, vitals }) => ({
        url: `/patients/${patientId}/vitals`,
        method: "PUT",
        body: {
          ...vitals,
          lastUpdated: new Date().toISOString(),
        },
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: "PatientCase", id: patientId },
      ],
    }),

    // Get patient treatment history
    getPatientTreatmentHistory: builder.query({
      query: ({ patientId, limit = 10, offset = 0 } = {}) => ({
        url: `/patients/${patientId}/treatment-history`,
        params: { limit, offset },
      }),
      providesTags: (result, error, { patientId }) => [
        { type: "PatientCase", id: patientId },
      ],
    }),

    // Add treatment history entry
    addTreatmentHistory: builder.mutation({
      query: ({ patientId, ...treatmentData }) => ({
        url: `/patients/${patientId}/treatment-history`,
        method: "POST",
        body: {
          ...treatmentData,
          date: new Date().toISOString(),
        },
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: "PatientCase", id: patientId },
      ],
    }),

    // Get clinical notes statistics
    getClinicalNotesStats: builder.query({
      query: ({ doctorId, startDate, endDate } = {}) => ({
        url: "/stats",
        params: { doctorId, startDate, endDate },
      }),
      providesTags: ["ClinicalNote"],
    }),

    // Search clinical notes
    searchClinicalNotes: builder.query({
      query: ({
        query,
        patientId,
        noteType,
        startDate,
        endDate,
        limit = 20,
        offset = 0,
      } = {}) => ({
        url: "/search",
        params: {
          query,
          patientId,
          noteType,
          startDate,
          endDate,
          limit,
          offset,
        },
      }),
      providesTags: ["ClinicalNote"],
    }),

    // Export clinical notes
    exportClinicalNotes: builder.mutation({
      query: ({ patientId, format = "pdf", startDate, endDate } = {}) => ({
        url: `/patients/${patientId}/notes/export`,
        method: "POST",
        body: { format, startDate, endDate },
        responseHandler: "blob",
      }),
    }),

    // Get patient medical history
    getPatientMedicalHistory: builder.query({
      query: (patientId) => `/patients/${patientId}/medical-history`,
      providesTags: (result, error, patientId) => [
        { type: "PatientCase", id: patientId },
      ],
    }),

    // Update patient medical history
    updatePatientMedicalHistory: builder.mutation({
      query: ({ patientId, ...medicalHistory }) => ({
        url: `/patients/${patientId}/medical-history`,
        method: "PUT",
        body: {
          ...medicalHistory,
          updatedAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: "PatientCase", id: patientId },
      ],
    }),

    // Get patient alerts and flags
    getPatientAlerts: builder.query({
      query: (patientId) => `/patients/${patientId}/alerts`,
      providesTags: (result, error, patientId) => [
        { type: "PatientCase", id: patientId },
      ],
    }),

    // Create patient alert
    createPatientAlert: builder.mutation({
      query: ({ patientId, ...alertData }) => ({
        url: `/patients/${patientId}/alerts`,
        method: "POST",
        body: {
          ...alertData,
          createdAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: "PatientCase", id: patientId },
      ],
    }),
  }),
});

export const {
  useGetPatientsForNotesQuery,
  useGetPatientCaseQuery,
  useGetPatientClinicalNotesQuery,
  useCreateClinicalNoteMutation,
  useUpdateClinicalNoteMutation,
  useDeleteClinicalNoteMutation,
  useGetClinicalNoteTemplatesQuery,
  useUpdatePatientVitalsMutation,
  useGetPatientTreatmentHistoryQuery,
  useAddTreatmentHistoryMutation,
  useGetClinicalNotesStatsQuery,
  useSearchClinicalNotesQuery,
  useExportClinicalNotesMutation,
  useGetPatientMedicalHistoryQuery,
  useUpdatePatientMedicalHistoryMutation,
  useGetPatientAlertsQuery,
  useCreatePatientAlertMutation,
} = clinicalNotesApi;
