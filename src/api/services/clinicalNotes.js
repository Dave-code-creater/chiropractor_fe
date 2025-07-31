import { createBaseApi } from '../core/baseApi';
import { API_ENDPOINTS } from '../config/endpoints';

export const clinicalNotesApi = createBaseApi({
  reducerPath: "clinicalNotesApi",
  tagTypes: ["ClinicalNote", "SOAPNote", "PatientNotes", "NoteTemplate", "TreatmentPlan", "IncidentDetails", "PatientIncidents", "DoctorPatients"],
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
      query: () => `${API_ENDPOINTS.CLINICAL_NOTES.TEMPLATES}`,
      providesTags: ["NoteTemplate"],
    }),

    // Treatment Plan endpoints
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

    createTreatmentPlan: builder.mutation({
      query: ({ incidentId, ...treatmentData }) => ({
        url: `/incidents/${incidentId}/treatment-plan`,
        method: 'POST',
        body: treatmentData,
      }),
      invalidatesTags: (result, error, { incidentId }) => [
        { type: 'TreatmentPlan', id: incidentId },
        'IncidentDetails',
      ],
    }),

    // Patient Incidents endpoints
    getPatientIncidents: builder.query({
      query: (patientId) => `/incidents/patient/${patientId}`,
      providesTags: (result, error, patientId) => [
        { type: 'PatientIncidents', id: patientId },
      ],
    }),

    // Get incident details
    getIncidentDetails: builder.query({
      query: (incidentId) => `/incidents/${incidentId}`,
      providesTags: (result, error, incidentId) => [
        { type: 'IncidentDetails', id: incidentId },
      ],
    }),

    // Get patients for clinical notes
    getPatients: builder.query({
      query: ({ search, status, limit, offset } = {}) => ({
        url: '/patients',
        params: { search, status, limit, offset }
      }),
      providesTags: ['DoctorPatients'],
    }),

    // Get patient case
    getPatientCase: builder.query({
      query: (patientId) => `/patients/${patientId}/case`,
      providesTags: (result, error, patientId) => [
        { type: 'PatientNotes', id: patientId }
      ]
    }),

    // Get patient clinical notes
    getPatientNotes: builder.query({
      query: ({ patientId, limit, offset } = {}) => ({
        url: `/patients/${patientId}/notes`,
        params: { limit, offset }
      }),
      providesTags: (result, error, { patientId }) => [
        { type: 'PatientNotes', id: patientId }
      ]
    }),

    // Create clinical note for patient
    createPatientNote: builder.mutation({
      query: ({ patientId, ...noteData }) => ({
        url: `/patients/${patientId}/notes`,
        method: 'POST',
        body: noteData
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'PatientNotes', id: patientId },
        'ClinicalNote'
      ]
    }),

    // Update clinical note for patient
    updatePatientNote: builder.mutation({
      query: ({ patientId, noteId, ...noteData }) => ({
        url: `/patients/${patientId}/notes/${noteId}`,
        method: 'PUT',
        body: noteData
      }),
      invalidatesTags: (result, error, { patientId, noteId }) => [
        { type: 'PatientNotes', id: patientId },
        { type: 'ClinicalNote', id: noteId }
      ]
    }),

    // Delete clinical note for patient
    deletePatientNote: builder.mutation({
      query: ({ patientId, noteId }) => ({
        url: `/patients/${patientId}/notes/${noteId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, { patientId, noteId }) => [
        { type: 'PatientNotes', id: patientId },
        { type: 'ClinicalNote', id: noteId }
      ]
    }),

    // Get incident details (keeping existing functionality)
    getIncidentDetails: builder.query({
      query: (incidentId) => `/incidents/${incidentId}`,
      providesTags: (result, error, incidentId) => [
        { type: 'IncidentDetails', id: incidentId }
      ]
    }),

    // Get doctor patients
    getDoctorPatients: builder.query({
      query: (doctorId) => `/doctors/${doctorId}/patients`,
      providesTags: (result, error, doctorId) => [
        { type: 'DoctorPatients', id: doctorId },
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
  useGetTreatmentPlanQuery,
  useUpdateTreatmentPlanMutation,
  useCreateTreatmentPlanMutation,
  useGetPatientIncidentsQuery,
  useGetIncidentDetailsQuery,
  useGetDoctorPatientsQuery,
  // New patient management endpoints
  useGetPatientsQuery,
  useGetPatientCaseQuery,
  useGetPatientNotesQuery,
  useCreatePatientNoteMutation,
  useUpdatePatientNoteMutation,
  useDeletePatientNoteMutation,
} = clinicalNotesApi; 