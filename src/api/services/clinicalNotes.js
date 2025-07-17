import { createBaseApi } from '../core/baseApi';
import { API_ENDPOINTS } from '../config/endpoints';

export const clinicalNotesApi = createBaseApi({
  reducerPath: "clinicalNotesApi",
  tagTypes: ["ClinicalNote", "SOAPNote", "PatientNotes"],
  endpoints: (builder) => ({
    // Get all clinical notes
    getClinicalNotes: builder.query({
      query: ({
        page = 1,
        limit = 20,
        patient_id,
        type,
        date_from,
        date_to,
      } = {}) => ({
        url: API_ENDPOINTS.CLINICAL_NOTES.BASE,
        params: { page, limit, patient_id, type, date_from, date_to },
      }),
      providesTags: ["ClinicalNote"],
    }),

    // Get clinical notes by patient
    getClinicalNotesByPatient: builder.query({
      query: (patient_id) => API_ENDPOINTS.CLINICAL_NOTES.BY_PATIENT(patient_id),
      providesTags: (result, error, patient_id) => [
        { type: "PatientNotes", id: patient_id },
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
      query: ({ patient_id, page = 1, limit = 20 } = {}) => ({
        url: API_ENDPOINTS.CLINICAL_NOTES.SOAP,
        params: { patient_id, page, limit },
      }),
      providesTags: ["SOAPNote"],
    }),

    // Search clinical notes
    searchClinicalNotes: builder.query({
      query: ({ query, patient_id, type, page = 1, limit = 20 }) => ({
        url: `${API_ENDPOINTS.CLINICAL_NOTES.BASE}/search`,
        params: { query, patient_id, type, page, limit },
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