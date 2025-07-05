import { createBaseApi } from '../core/baseApi';
import { API_ENDPOINTS } from '../config/endpoints';

export const vitalsApi = createBaseApi({
  reducerPath: "vitalsApi",
  tagTypes: ["Vitals", "PatientVitals", "VitalsTrend"],
  endpoints: (builder) => ({
    // Get all vitals
    getVitals: builder.query({
      query: ({ page = 1, limit = 20, patientId, dateFrom, dateTo } = {}) => ({
        url: API_ENDPOINTS.VITALS.BASE,
        params: { page, limit, patientId, dateFrom, dateTo },
      }),
      providesTags: ["Vitals"],
    }),

    // Get vitals by patient
    getVitalsByPatient: builder.query({
      query: ({ patientId, page = 1, limit = 20, dateFrom, dateTo } = {}) => ({
        url: API_ENDPOINTS.VITALS.BY_PATIENT(patientId),
        params: { page, limit, dateFrom, dateTo },
      }),
      providesTags: (result, error, { patientId }) => [
        { type: "PatientVitals", id: patientId },
        "Vitals",
      ],
    }),

    // Get latest vitals for patient
    getLatestVitals: builder.query({
      query: (patientId) => API_ENDPOINTS.VITALS.LATEST(patientId),
      providesTags: (result, error, patientId) => [
        { type: "PatientVitals", id: patientId },
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
        { type: "PatientVitals", id: vitalData.patientId },
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
      invalidatesTags: (result, error, { vitalId, patientId }) => [
        { type: "Vitals", id: vitalId },
        { type: "PatientVitals", id: patientId },
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
      query: ({ patientId, period = "30d", vitalTypes = [] }) => ({
        url: `${API_ENDPOINTS.VITALS.BASE}/trends`,
        params: { patientId, period, vitalTypes: vitalTypes.join(",") },
      }),
      providesTags: (result, error, { patientId }) => [
        { type: "VitalsTrend", id: patientId },
      ],
    }),

    // Bulk create vitals
    createBulkVitals: builder.mutation({
      query: ({ patientId, vitalsArray }) => ({
        url: `${API_ENDPOINTS.VITALS.BASE}/bulk`,
        method: "POST",
        body: {
          patientId,
          vitals: vitalsArray,
        },
      }),
      invalidatesTags: (result, error, { patientId }) => [
        "Vitals",
        { type: "PatientVitals", id: patientId },
        { type: "Vitals", id: "LATEST" },
        "VitalsTrend",
      ],
    }),

    // Get vitals summary for patient
    getVitalsSummary: builder.query({
      query: ({ patientId, period = "30d" }) => ({
        url: `${API_ENDPOINTS.VITALS.BASE}/summary`,
        params: { patientId, period },
      }),
      providesTags: (result, error, { patientId }) => [
        { type: "PatientVitals", id: patientId },
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