import { createBaseApi } from '../core/baseApi';
import { API_ENDPOINTS } from '../config/endpoints';

export const clinicalNotesApi = createBaseApi({
  reducerPath: "clinicalNotesApi",
  tagTypes: ["ClinicalNote", "SOAPNote", "PatientNotes", "NoteTemplate", "TreatmentPlan", "IncidentDetails", "PatientIncidents", "DoctorPatients"],
  endpoints: (builder) => ({
    getClinicalNotes: builder.query({
      query: ({
        page = 1,
        limit = 20,
        patient_id,
        doctor_id,
        type,
        date_from,
        date_to,
      } = {}) => ({
        url: API_ENDPOINTS.CLINICAL_NOTES.BASE,
        params: { page, limit, patient_id, doctor_id, type, date_from, date_to },
      }),
      providesTags: ["ClinicalNote"],
    }),

    getClinicalNotesByPatient: builder.query({
      query: (patient_id) => API_ENDPOINTS.CLINICAL_NOTES.BY_PATIENT(patient_id),
      providesTags: (result, error, patient_id) => [
        { type: "PatientNotes", id: patient_id },
        "ClinicalNote",
      ],
    }),

    getClinicalNote: builder.query({
      query: (noteId) => `${API_ENDPOINTS.CLINICAL_NOTES.BASE}/${noteId}`,
      providesTags: (result, error, noteId) => [
        { type: "ClinicalNote", id: noteId },
      ],
    }),

    createClinicalNote: builder.mutation({
      query: (noteData) => ({
        url: API_ENDPOINTS.CLINICAL_NOTES.BASE,
        method: "POST",
        body: noteData,
      }),
      invalidatesTags: ["ClinicalNote", "PatientNotes"],
    }),

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

    deleteClinicalNote: builder.mutation({
      query: (noteId) => ({
        url: `${API_ENDPOINTS.CLINICAL_NOTES.BASE}/${noteId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ClinicalNote", "PatientNotes"],
    }),

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
  useGetDoctorIncidentsQuery,
  useGetIncidentDetailsQuery,
  useGetDoctorPatientsQuery,
  useGetPatientCaseQuery,
  useGetPatientNotesQuery,
  useCreatePatientNoteMutation,
  useUpdatePatientNoteMutation,
  useDeletePatientNoteMutation,
} = clinicalNotesApi; 