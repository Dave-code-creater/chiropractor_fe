import { createBaseApi } from '../core/baseApi';
import { API_ENDPOINTS } from '../config/endpoints';

export const vitalsApi = createBaseApi({
  reducerPath: "vitalsApi",
  tagTypes: ["Vitals", "PatientVitals", "VitalsTrend"],
  endpoints: (builder) => ({
    // Get all vitals
    getVitals: builder.query({
      query: ({ page = 1, limit = 20, patient_id, date_from, date_to } = {}) => ({
        url: API_ENDPOINTS.VITALS.BASE,
        params: { page, limit, patient_id, date_from, date_to },
      }),
      providesTags: ["Vitals"],
    }),

    // Get vitals by patient
    getVitalsByPatient: builder.query({
      query: ({ patient_id, page = 1, limit = 20, date_from, date_to } = {}) => ({
        url: API_ENDPOINTS.VITALS.BY_PATIENT(patient_id),
        params: { page, limit, date_from, date_to },
      }),
      providesTags: (result, error, { patient_id }) => [
        { type: "PatientVitals", id: patient_id },
        "Vitals",
      ],
    }),

    // Get latest vitals for patient
    getLatestVitals: builder.query({
      query: (patient_id) => API_ENDPOINTS.VITALS.LATEST(patient_id),
      providesTags: (result, error, patient_id) => [
        { type: "PatientVitals", id: patient_id },
        { type: "Vitals", id: "LATEST" },
      ],
    }),

    // Get single vital record
    getVital: builder.query({
      query: (vitalId) => `${API_ENDPOINTS.VITALS.BASE}/${vitalId}`,
      providesTags: (result, error, vitalId) => [
        { type: "Vitals", id: vitalId },
      ],
    }),

    // Create vital record
    createVital: builder.mutation({
      query: (vitalData) => ({
        url: API_ENDPOINTS.VITALS.BASE,
        method: "POST",
        body: {
          ...vitalData,
          recordedAt: vitalData.recordedAt || new Date().toISOString(),
        },
      }),
      invalidatesTags: (result, error, vitalData) => [
        "Vitals",
        { type: "PatientVitals", id: vitalData.patient_id },
        { type: "Vitals", id: "LATEST" },
        "VitalsTrend",
      ],
    }),

    // Update vital record
    updateVital: builder.mutation({
      query: ({ vitalId, ...vitalData }) => ({
        url: `${API_ENDPOINTS.VITALS.BASE}/${vitalId}`,
        method: "PUT",
        body: vitalData,
      }),
      invalidatesTags: (result, error, { vitalId, patient_id }) => [
        { type: "Vitals", id: vitalId },
        { type: "PatientVitals", id: patient_id },
        "VitalsTrend",
      ],
    }),

    // Delete vital record
    deleteVital: builder.mutation({
      query: (vitalId) => ({
        url: `${API_ENDPOINTS.VITALS.BASE}/${vitalId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vitals", "PatientVitals", "VitalsTrend"],
    }),

    // Get vitals trends for patient
    getVitalsTrends: builder.query({
      query: ({ patient_id, period = "30d", vitalTypes = [] }) => ({
        url: `${API_ENDPOINTS.VITALS.BASE}/trends`,
        params: { patient_id, period, vitalTypes: vitalTypes.join(",") },
      }),
      providesTags: (result, error, { patient_id }) => [
        { type: "VitalsTrend", id: patient_id },
      ],
    }),

    // Bulk create vitals
    createBulkVitals: builder.mutation({
      query: ({ patient_id, vitalsArray }) => ({
        url: `${API_ENDPOINTS.VITALS.BASE}/bulk`,
        method: "POST",
        body: {
          patient_id,
          vitals: vitalsArray,
        },
      }),
      invalidatesTags: (result, error, { patient_id }) => [
        "Vitals",
        { type: "PatientVitals", id: patient_id },
        { type: "Vitals", id: "LATEST" },
        "VitalsTrend",
      ],
    }),

    // Get vitals summary for patient
    getVitalsSummary: builder.query({
      query: ({ patient_id, period = "30d" }) => ({
        url: `${API_ENDPOINTS.VITALS.BASE}/summary`,
        params: { patient_id, period },
      }),
      providesTags: (result, error, { patient_id }) => [
        { type: "PatientVitals", id: patient_id },
        "VitalsTrend",
      ],
    }),

    // Get vitals reference ranges
    getVitalsReferenceRanges: builder.query({
      query: ({ age, gender, conditions = [] }) => ({
        url: `${API_ENDPOINTS.VITALS.BASE}/reference-ranges`,
        params: { age, gender, conditions: conditions.join(",") },
      }),
      providesTags: ["VitalsReference"],
    }),
  }),
});

export const {
  useGetVitalsQuery,
  useGetVitalsByPatientQuery,
  useGetLatestVitalsQuery,
  useGetVitalQuery,
  useCreateVitalMutation,
  useUpdateVitalMutation,
  useDeleteVitalMutation,
  useGetVitalsTrendsQuery,
  useCreateBulkVitalsMutation,
  useGetVitalsSummaryQuery,
  useGetVitalsReferenceRangesQuery,
} = vitalsApi; 