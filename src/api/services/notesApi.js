import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, CACHE_TIMES } from "../core/baseApi";

export const notesApi = createApi({
  reducerPath: "notesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["ClinicalNote", "SOAPNote", "PatientNotes", "TreatmentPlan", "IncidentDetails", "PatientIncidents", "DoctorPatients"],
  keepUnusedDataFor: CACHE_TIMES.SHORT,
  refetchOnMountOrArgChange: 30,
  refetchOnFocus: true,
  refetchOnReconnect: true,
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
        url: "/clinical-notes",
        params: { page, limit, patient_id, type, date_from, date_to },
      }),
      providesTags: ["ClinicalNote"],
    }),

    // Get clinical notes by patient
    getClinicalNotesByPatient: builder.query({
      query: (patient_id) => `/clinical-notes/patient/${patient_id}`,
      providesTags: (result, error, patient_id) => [
        { type: "PatientNotes", id: patient_id },
        "ClinicalNote",
      ],
    }),

    // Get single clinical note
    getClinicalNote: builder.query({
      query: (noteId) => `/clinical-notes/${noteId}`,
      providesTags: (result, error, noteId) => [
        { type: "ClinicalNote", id: noteId },
      ],
    }),

    // Create clinical note
    createClinicalNote: builder.mutation({
      query: (noteData) => ({
        url: "/clinical-notes",
        method: "POST",
        body: noteData,
      }),
      invalidatesTags: ["ClinicalNote", "PatientNotes"],
    }),

    // Update clinical note
    updateClinicalNote: builder.mutation({
      query: ({ noteId, ...noteData }) => ({
        url: `/clinical-notes/${noteId}`,
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
        url: `/clinical-notes/${noteId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ClinicalNote", "PatientNotes"],
    }),

    // SOAP Note specific endpoints
    createSOAPNote: builder.mutation({
      query: (soapData) => ({
        url: "/clinical-notes/soap",
        method: "POST",
        body: {
          ...soapData,
          type: "soap_note",
        },
      }),
      invalidatesTags: ["ClinicalNote", "SOAPNote", "PatientNotes"],
    }),

    updateSOAPNote: builder.mutation({
      query: ({ noteId, ...soapData }) => ({
        url: `/clinical-notes/soap/${noteId}`,
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
        url: "/clinical-notes/soap",
        params: { patient_id, page, limit },
      }),
      providesTags: ["SOAPNote"],
    }),

    // Search clinical notes
    searchClinicalNotes: builder.query({
      query: ({ query, patient_id, type, page = 1, limit = 20 }) => ({
        url: "/clinical-notes/search",
        params: { query, patient_id, type, page, limit },
      }),
      providesTags: ["ClinicalNote"],
    }),

    // Get note templates
    getNoteTemplates: builder.query({
      query: () => "/clinical-notes/templates",
      providesTags: ["NoteTemplate"],
    }),

    // Get doctor's patients
    getDoctorPatients: builder.query({
      query: () => `/incidents/doctor/patients`,
      providesTags: ["DoctorPatients"],
    }),

    // Get patient incidents (initial reports)
    getPatientIncidents: builder.query({
      query: (patientId) => `/incidents?patient_id=${patientId}`,
      providesTags: (result, error, patientId) => [
        { type: "PatientIncidents", id: patientId },
      ],
    }),

    // Get single incident details
    getIncidentDetails: builder.query({
      query: (incidentId) => `/incidents/${incidentId}`,
      providesTags: (result, error, incidentId) => [
        { type: "IncidentDetails", id: incidentId },
      ],
    }),

    // Treatment Plan endpoints (Incident-based)
    createTreatmentPlan: builder.mutation({
      query: ({ incidentId, ...treatmentData }) => ({
        url: `/incidents/${incidentId}/treatment-plan`,
        method: 'POST',
        body: treatmentData,
      }),
      invalidatesTags: ['IncidentDetails', 'TreatmentPlan'],
    }),

    getTreatmentPlan: builder.query({
      query: (incidentId) => `/incidents/${incidentId}/treatment-plan`,
      providesTags: (result, error, incidentId) => [
        { type: 'TreatmentPlan', id: incidentId },
      ],
    }),

    updateTreatmentPlan: builder.mutation({
      query: ({ incidentId, ...treatmentData }) => ({
        url: `/incidents/${incidentId}/treatment-plan`,
        method: 'PUT',
        body: treatmentData,
      }),
      invalidatesTags: (result, error, { incidentId }) => [
        { type: 'TreatmentPlan', id: incidentId },
        'IncidentDetails',
      ],
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
  useGetDoctorPatientsQuery,
  useGetPatientIncidentsQuery,
  useGetIncidentDetailsQuery,
  useGetTreatmentPlanQuery,
  useCreateTreatmentPlanMutation,
  useUpdateTreatmentPlanMutation,
} = notesApi; 