import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_CONFIG, API_ENDPOINTS, handleApiResponse } from "../config/api";
import { getToken } from "../utils/token";

export const clinicalNotesApi = createApi({
  reducerPath: "clinicalNotesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("content-type", "application/json");
      return headers;
    },
    responseHandler: async (response) => {
      const data = await response.json();
      return handleApiResponse(data);
    },
  }),
  tagTypes: ["ClinicalNote", "SOAPNote", "PatientNotes"],
  endpoints: (builder) => ({
    // Get all clinical notes
    getClinicalNotes: builder.query({
      query: ({
        page = 1,
        limit = 20,
        patientId,
        type,
        dateFrom,
        dateTo,
      } = {}) => ({
        url: API_ENDPOINTS.CLINICAL_NOTES.BASE,
        params: { page, limit, patientId, type, dateFrom, dateTo },
      }),
      providesTags: ["ClinicalNote"],
    }),

    // Get clinical notes by patient
    getClinicalNotesByPatient: builder.query({
      query: (patientId) => API_ENDPOINTS.CLINICAL_NOTES.BY_PATIENT(patientId),
      providesTags: (result, error, patientId) => [
        { type: "PatientNotes", id: patientId },
        "ClinicalNote",
      ],
    }),

    // Get single clinical note
    getClinicalNote: builder.query({
      query: (noteId) => `${API_ENDPOINTS.CLINICAL_NOTES.BASE}/${noteId}`,
      providesTags: (result, error, noteId) => [
        { type: "ClinicalNote", id: noteId },
      ],
    }),

    // Create clinical note
    createClinicalNote: builder.mutation({
      query: (noteData) => ({
        url: API_ENDPOINTS.CLINICAL_NOTES.BASE,
        method: "POST",
        body: noteData,
      }),
      invalidatesTags: ["ClinicalNote", "PatientNotes"],
    }),

    // Update clinical note
    updateClinicalNote: builder.mutation({
      query: ({ noteId, ...noteData }) => ({
        url: `${API_ENDPOINTS.CLINICAL_NOTES.BASE}/${noteId}`,
        method: "PUT",
        body: noteData,
      }),
      invalidatesTags: (result, error, { noteId }) => [
        { type: "ClinicalNote", id: noteId },
        "PatientNotes",
      ],
    }),

    // Delete clinical note
    deleteClinicalNote: builder.mutation({
      query: (noteId) => ({
        url: `${API_ENDPOINTS.CLINICAL_NOTES.BASE}/${noteId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ClinicalNote", "PatientNotes"],
    }),

    // SOAP Note specific endpoints
    createSOAPNote: builder.mutation({
      query: (soapData) => ({
        url: API_ENDPOINTS.CLINICAL_NOTES.SOAP,
        method: "POST",
        body: {
          ...soapData,
          type: "SOAP",
        },
      }),
      invalidatesTags: ["ClinicalNote", "SOAPNote", "PatientNotes"],
    }),

    updateSOAPNote: builder.mutation({
      query: ({ noteId, ...soapData }) => ({
        url: `${API_ENDPOINTS.CLINICAL_NOTES.SOAP}/${noteId}`,
        method: "PUT",
        body: soapData,
      }),
      invalidatesTags: (result, error, { noteId }) => [
        { type: "ClinicalNote", id: noteId },
        { type: "SOAPNote", id: noteId },
        "PatientNotes",
      ],
    }),

    getSOAPNotes: builder.query({
      query: ({ patientId, page = 1, limit = 20 } = {}) => ({
        url: API_ENDPOINTS.CLINICAL_NOTES.SOAP,
        params: { patientId, page, limit },
      }),
      providesTags: ["SOAPNote"],
    }),

    // Search clinical notes
    searchClinicalNotes: builder.query({
      query: ({ query, patientId, type, page = 1, limit = 20 }) => ({
        url: `${API_ENDPOINTS.CLINICAL_NOTES.BASE}/search`,
        params: { query, patientId, type, page, limit },
      }),
      providesTags: ["ClinicalNote"],
    }),

    // Get note templates
    getNoteTemplates: builder.query({
      query: () => `${API_ENDPOINTS.CLINICAL_NOTES.BASE}/templates`,
      providesTags: ["NoteTemplate"],
    }),
  }),
});

export const {
  useGetClinicalNotesQuery,
  useGetClinicalNotesByPatientQuery,
  useGetClinicalNoteQuery,
  useCreateClinicalNoteMutation,
  useUpdateClinicalNoteMutation,
  useDeleteClinicalNoteMutation,
  useCreateSOAPNoteMutation,
  useUpdateSOAPNoteMutation,
  useGetSOAPNotesQuery,
  useSearchClinicalNotesQuery,
  useGetNoteTemplatesQuery,
} = clinicalNotesApi;
