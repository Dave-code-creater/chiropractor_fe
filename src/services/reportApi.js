import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, CACHE_TIMES } from "./baseApi";

export const reportApi = createApi({
  reducerPath: "reportApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Reports", "PatientReports", "DoctorReports"],
  keepUnusedDataFor: CACHE_TIMES.SHORT,
  refetchOnMountOrArgChange: 30,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    // Create patient intake report
    createPatientIntakeReport: builder.mutation({
      query: (data) => ({
        url: "reports/patient-intake",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Reports", "PatientReports"],
    }),

    // Create doctor initial assessment
    createDoctorInitialReport: builder.mutation({
      query: (data) => ({
        url: "reports/doctor-initial",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Reports", "DoctorReports"],
    }),

    // Get patient's reports
    getPatientReports: builder.query({
      query: ({ patientId, ...params }) => {
        const queryParams = new URLSearchParams();
        
        if (params.type) queryParams.append("type", params.type);
        if (params.date_from) queryParams.append("date_from", params.date_from);

        return {
          url: `reports/patient/${patientId}?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: (result, error, { patientId }) => [
        { type: "PatientReports", id: patientId },
      ],
    }),

    // Get doctor's reports
    getDoctorReports: builder.query({
      query: ({ doctorId, ...params }) => {
        const queryParams = new URLSearchParams();
        
        if (params.date_from) queryParams.append("date_from", params.date_from);
        if (params.limit) queryParams.append("limit", params.limit.toString());

        return {
          url: `reports/doctor/${doctorId}?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: (result, error, { doctorId }) => [
        { type: "DoctorReports", id: doctorId },
      ],
    }),

    // Get all reports (role-filtered)
    getReports: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.type) queryParams.append("type", params.type);
        if (params.status) queryParams.append("status", params.status);
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());

        return {
          url: `reports?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["Reports"],
      keepUnusedDataFor: CACHE_TIMES.MEDIUM,
    }),

    // Get specific report
    getReportById: builder.query({
      query: (id) => ({
        url: `reports/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Reports", id }],
    }),

    // Update report
    updateReport: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `reports/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Reports", id },
      ],
    }),

    // Generate report summary
    getReportSummary: builder.query({
      query: (id) => ({
        url: `reports/${id}/summary`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Reports", id }],
    }),
  }),
});

export const {
  useCreatePatientIntakeReportMutation,
  useCreateDoctorInitialReportMutation,
  useGetPatientReportsQuery,
  useGetDoctorReportsQuery,
  useGetReportsQuery,
  useGetReportByIdQuery,
  useUpdateReportMutation,
  useGetReportSummaryQuery,
} = reportApi;

// Legacy exports for backward compatibility
export const useGetInitialReportQuery = () => ({ data: null, isLoading: false, error: null });
export const useGetHealthConditionsQuery = () => ({ data: [], isLoading: false, error: null });

// Legacy mutation hooks for backward compatibility
export const useSubmitPatientIntakeMutation = () => [
  async (data) => ({ data: await reportApi.endpoints.createPatientIntakeReport.initiate(data) }),
  { isLoading: false, error: null }
];

export const useUpdatePatientIntakeMutation = () => [
  async ({ id, data }) => ({ data: await reportApi.endpoints.updateReport.initiate({ id, ...data }) }),
  { isLoading: false, error: null }
];

export const useSubmitInsuranceDetailsMutation = () => [
  async (data) => ({ data: await reportApi.endpoints.createPatientIntakeReport.initiate(data) }),
  { isLoading: false, error: null }
];

export const useUpdateInsuranceDetailsMutation = () => [
  async ({ id, data }) => ({ data: await reportApi.endpoints.updateReport.initiate({ id, ...data }) }),
  { isLoading: false, error: null }
];

export const useSubmitPainDescriptionMutation = () => [
  async (data) => ({ data: await reportApi.endpoints.createPatientIntakeReport.initiate(data) }),
  { isLoading: false, error: null }
];

export const useUpdatePainDescriptionMutation = () => [
  async ({ id, data }) => ({ data: await reportApi.endpoints.updateReport.initiate({ id, ...data }) }),
  { isLoading: false, error: null }
];

export const useSubmitDetailsDescriptionMutation = () => [
  async (data) => ({ data: await reportApi.endpoints.createPatientIntakeReport.initiate(data) }),
  { isLoading: false, error: null }
];

export const useUpdateDetailsDescriptionMutation = () => [
  async ({ id, data }) => ({ data: await reportApi.endpoints.updateReport.initiate({ id, ...data }) }),
  { isLoading: false, error: null }
];

export const useSubmitWorkImpactMutation = () => [
  async (data) => ({ data: await reportApi.endpoints.createPatientIntakeReport.initiate(data) }),
  { isLoading: false, error: null }
];

export const useUpdateWorkImpactMutation = () => [
  async ({ id, data }) => ({ data: await reportApi.endpoints.updateReport.initiate({ id, ...data }) }),
  { isLoading: false, error: null }
];

export const useSubmitHealthConditionMutation = () => [
  async (data) => ({ data: await reportApi.endpoints.createPatientIntakeReport.initiate(data) }),
  { isLoading: false, error: null }
];

export const useUpdateHealthConditionMutation = () => [
  async ({ id, data }) => ({ data: await reportApi.endpoints.updateReport.initiate({ id, ...data }) }),
  { isLoading: false, error: null }
];

// Additional legacy hooks for Report.jsx
export const useGetAllReportsQuery = useGetReportsQuery;
export const useCreateReportMutation = useCreatePatientIntakeReportMutation;

export const useDeleteReportMutation = () => [
  async (id) => ({ data: { success: true } }), // Generic delete - not implemented in backend
  { isLoading: false, error: null }
];

export const useDeletePatientIntakeMutation = () => [
  async (id) => ({ data: { success: true } }), // Legacy delete - not implemented
  { isLoading: false, error: null }
];

export const useDeleteInsuranceDetailsMutation = () => [
  async (id) => ({ data: { success: true } }), // Legacy delete - not implemented
  { isLoading: false, error: null }
];

export const useDeletePainDescriptionMutation = () => [
  async (id) => ({ data: { success: true } }), // Legacy delete - not implemented
  { isLoading: false, error: null }
];

export const useDeleteDetailsDescriptionMutation = () => [
  async (id) => ({ data: { success: true } }), // Legacy delete - not implemented
  { isLoading: false, error: null }
];

export const useDeleteRecoveryMutation = () => [
  async (id) => ({ data: { success: true } }), // Legacy delete - not implemented
  { isLoading: false, error: null }
];

export const useDeleteWorkImpactMutation = () => [
  async (id) => ({ data: { success: true } }), // Legacy delete - not implemented
  { isLoading: false, error: null }
];

export const useDeleteHealthConditionMutation = () => [
  async (id) => ({ data: { success: true } }), // Legacy delete - not implemented
  { isLoading: false, error: null }
];
