import { createBaseApi } from '../core/baseApi';
import { API_ENDPOINTS } from '../config/endpoints';

export const clinicalNotesApi = createBaseApi({
  reducerPath: "clinicalNotesApi",
  tagTypes: ["ClinicalNote", "SOAPNote", "PatientNotes", "AppointmentNote", "MyNotes", "MyRecords", "NoteTemplate", "TreatmentPlan", "IncidentDetails", "PatientIncidents", "DoctorPatients"],
  endpoints: (builder) => ({
    // Get doctor's own clinical notes
    getMyNotes: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: API_ENDPOINTS.CLINICAL_NOTES.MY_NOTES,
        params: { page, limit },
      }),
      providesTags: ["MyNotes"],
    }),

    // Get patient's own medical records
    getMyRecords: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: API_ENDPOINTS.CLINICAL_NOTES.MY_RECORDS,
        params: { page, limit },
      }),
      providesTags: ["MyRecords"],
    }),

    // Get clinical note by ID
    getClinicalNote: builder.query({
      query: (noteId) => API_ENDPOINTS.CLINICAL_NOTES.BY_ID(noteId),
      providesTags: (result, error, noteId) => [
        { type: "ClinicalNote", id: noteId },
      ],
    }),

    // Get all clinical notes for a patient (paginated)
    getClinicalNotesByPatient: builder.query({
      query: ({ patientId, page = 1, limit = 10 }) => ({
        url: API_ENDPOINTS.CLINICAL_NOTES.BY_PATIENT(patientId),
        params: { page, limit },
      }),
      providesTags: (result, error, { patientId }) => [
        { type: "PatientNotes", id: patientId },
        "ClinicalNote",
      ],
    }),

    // Get clinical note for specific appointment
    getClinicalNoteByAppointment: builder.query({
      query: (appointmentId) => API_ENDPOINTS.CLINICAL_NOTES.BY_APPOINTMENT(appointmentId),
      providesTags: (result, error, appointmentId) => [
        { type: "AppointmentNote", id: appointmentId },
        "ClinicalNote",
      ],
    }),

    // Create or update SOAP note for appointment
    createOrUpdateNoteForAppointment: builder.mutation({
      query: ({ appointmentId, ...noteData }) => ({
        url: API_ENDPOINTS.CLINICAL_NOTES.BY_APPOINTMENT(appointmentId),
        method: "POST",
        body: noteData,
      }),
      invalidatesTags: (result, error, { appointmentId }) => [
        { type: "AppointmentNote", id: appointmentId },
        "ClinicalNote",
        "PatientNotes",
        "MyNotes",
      ],
    }),

    // Update clinical note by ID
    updateClinicalNote: builder.mutation({
      query: ({ noteId, ...noteData }) => ({
        url: API_ENDPOINTS.CLINICAL_NOTES.BY_ID(noteId),
        method: "PUT",
        body: noteData,
      }),
      invalidatesTags: (result, error, { noteId }) => [
        { type: "ClinicalNote", id: noteId },
        "PatientNotes",
        "MyNotes",
      ],
    }),

    // Delete clinical note (admin only)
    deleteClinicalNote: builder.mutation({
      query: (noteId) => ({
        url: API_ENDPOINTS.CLINICAL_NOTES.BY_ID(noteId),
        method: "DELETE",
      }),
      invalidatesTags: ["ClinicalNote", "PatientNotes", "MyNotes"],
    }),

    // Legacy SOAP endpoints (for backward compatibility)
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

    searchClinicalNotes: builder.query({
      query: ({ query, patient_id, type, page = 1, limit = 20 }) => ({
        url: `${API_ENDPOINTS.CLINICAL_NOTES.BASE}/search`,
        params: { query, patient_id, type, page, limit },
      }),
      providesTags: ["ClinicalNote"],
    }),

    getNoteTemplates: builder.query({
      query: () => `${API_ENDPOINTS.CLINICAL_NOTES.TEMPLATES}`,
      providesTags: ["NoteTemplate"],
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

    getPatientIncidents: builder.query({
      query: (patientId) => `/incidents/patient/${patientId}`,
      providesTags: (result, error, patientId) => [
        { type: 'PatientIncidents', id: patientId },
      ],
    }),

    getDoctorIncidents: builder.query({
      query: ({ doctorId, ...params }) => ({
        url: '/incidents',
        params: { doctor_id: doctorId, ...params }
      }),
      providesTags: (result, error, { doctorId }) => [
        { type: 'PatientIncidents', id: `doctor-${doctorId}` },
      ],
    }),

    getIncidentDetails: builder.query({
      query: (incidentId) => `/incidents/${incidentId}`,
      providesTags: (result, error, incidentId) => [
        { type: 'IncidentDetails', id: incidentId },
      ],
    }),


    getPatientCase: builder.query({
      query: (patientId) => `/patients/${patientId}/case`,
      providesTags: (result, error, patientId) => [
        { type: 'PatientNotes', id: patientId }
      ]
    }),

    getPatientNotes: builder.query({
      query: ({ patientId, limit, offset } = {}) => ({
        url: `/patients/${patientId}/notes`,
        params: { limit, offset }
      }),
      providesTags: (result, error, { patientId }) => [
        { type: 'PatientNotes', id: patientId }
      ]
    }),

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


    getDoctorPatients: builder.query({
      query: (doctorId) => `/doctors/${doctorId}/patients`,
      providesTags: (result, error, doctorId) => [
        { type: 'DoctorPatients', id: doctorId },
      ],
    }),
  }),
});

export const {
  // New SOAP endpoints matching backend
  useGetMyNotesQuery,
  useGetMyRecordsQuery,
  useGetClinicalNoteQuery,
  useGetClinicalNotesByPatientQuery,
  useGetClinicalNoteByAppointmentQuery,
  useCreateOrUpdateNoteForAppointmentMutation,
  useUpdateClinicalNoteMutation,
  useDeleteClinicalNoteMutation,

  // Legacy SOAP endpoints
  useCreateSOAPNoteMutation,
  useUpdateSOAPNoteMutation,
  useGetSOAPNotesQuery,
  useSearchClinicalNotesQuery,
  useGetNoteTemplatesQuery,

  // Treatment plans and incidents
  useGetTreatmentPlanQuery,
  useUpdateTreatmentPlanMutation,
  useCreateTreatmentPlanMutation,
  useGetPatientIncidentsQuery,
  useGetDoctorIncidentsQuery,
  useGetIncidentDetailsQuery,

  // Doctor and patient management
  useGetDoctorPatientsQuery,
  useGetPatientCaseQuery,
  useGetPatientNotesQuery,
  useCreatePatientNoteMutation,
  useUpdatePatientNoteMutation,
  useDeletePatientNoteMutation,
} = clinicalNotesApi; 