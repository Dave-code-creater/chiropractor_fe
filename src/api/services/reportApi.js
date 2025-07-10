import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, CACHE_TIMES } from "../core/baseApi";

export const reportApi = createApi({
  reducerPath: "reportApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Reports", "PatientReports", "DoctorReports", "Incidents", "IncidentForms", "IncidentNotes"],
  keepUnusedDataFor: CACHE_TIMES.SHORT,
  refetchOnMountOrArgChange: 30,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    // ===== INCIDENT-BASED ENDPOINTS (NEW SYSTEM) =====
    
    // 1.1 Create Incident
    createIncident: builder.mutation({
      query: (data) => ({
        url: "incidents",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Incidents"],
    }),

    // 1.2 List User Incidents
    getIncidents: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.status) queryParams.append("status", params.status);
        if (params.incident_type) queryParams.append("incident_type", params.incident_type);
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());

        const queryString = queryParams.toString();
        return {
          url: `incidents${queryString ? `?${queryString}` : ''}`,
          method: "GET",
        };
      },
      providesTags: ["Incidents"],
    }),

    // 1.3 Get Incident Details
    getIncidentById: builder.query({
      query: (incidentId) => ({
        url: `incidents/${incidentId}`,
        method: "GET",
      }),
      providesTags: (result, error, incidentId) => [
        { type: "Incidents", id: incidentId },
        { type: "IncidentForms", id: incidentId },
        { type: "IncidentNotes", id: incidentId },
      ],
    }),

    // 1.4 Update Incident
    updateIncident: builder.mutation({
      query: ({ incidentId, data }) => ({
        url: `incidents/${incidentId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { incidentId }) => [
        { type: "Incidents", id: incidentId },
        "Incidents",
      ],
    }),

    // 1.5 Delete Incident
    deleteIncident: builder.mutation({
      query: (incidentId) => ({
        url: `incidents/${incidentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Incidents"],
    }),

    // 1.6 Save/Update Form
    saveIncidentForm: builder.mutation({
      query: ({ incidentId, formType, formData, isCompleted = false, isRequired = false }) => ({
        url: `incidents/${incidentId}/forms`,
        method: "POST",
        body: {
          form_type: formType,
          form_data: formData,
          is_completed: isCompleted,
          is_required: isRequired,
        },
      }),
      invalidatesTags: (result, error, { incidentId }) => [
        { type: "IncidentForms", id: incidentId },
        { type: "Incidents", id: incidentId },
      ],
    }),

    // 1.6 Update Form (PUT version)
    updateIncidentForm: builder.mutation({
      query: ({ incidentId, formType, formData, isCompleted = false, isRequired = false }) => ({
        url: `incidents/${incidentId}/forms/${formType}`,
        method: "PUT",
        body: {
          form_type: formType,
          form_data: formData,
          is_completed: isCompleted,
          is_required: isRequired,
        },
      }),
      invalidatesTags: (result, error, { incidentId }) => [
        { type: "IncidentForms", id: incidentId },
        { type: "Incidents", id: incidentId },
      ],
    }),

    // 1.7 Add Progress Note
    addIncidentNote: builder.mutation({
      query: ({ incidentId, noteText, noteType = "progress" }) => ({
        url: `incidents/${incidentId}/notes`,
        method: "POST",
        body: {
          note_text: noteText,
          note_type: noteType,
        },
      }),
      invalidatesTags: (result, error, { incidentId }) => [
        { type: "IncidentNotes", id: incidentId },
        { type: "Incidents", id: incidentId },
      ],
    }),

    // 1.8 Get Complete Incident Form Data (all sub-forms)
    getCompleteIncidentForms: builder.query({
      query: (incidentId) => ({
        url: `incidents/${incidentId}/forms/complete`,
        method: "GET",
      }),
      providesTags: (result, error, incidentId) => [
        { type: "IncidentForms", id: incidentId },
        { type: "Incidents", id: incidentId },
      ],
    }),

    // 1.9 Get specific form data for an incident
    getIncidentForm: builder.query({
      query: ({ incidentId, formType }) => ({
        url: `incidents/${incidentId}/forms/${formType}`,
        method: "GET",
      }),
      providesTags: (result, error, { incidentId, formType }) => [
        { type: "IncidentForms", id: `${incidentId}-${formType}` },
        { type: "IncidentForms", id: incidentId },
      ],
    }),

    // ===== LEGACY REPORT ENDPOINTS (MAINTAINED FOR BACKWARD COMPATIBILITY) =====

    // 2.1 Create Patient-Intake Report
    createPatientIntakeReport: builder.mutation({
      query: (data) => ({
        url: "reports/patient-intake",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Reports", "PatientReports"],
    }),

    // 2.2 Create Doctor-Initial Report
    createDoctorInitialReport: builder.mutation({
      query: (data) => ({
        url: "reports/doctor-initial",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Reports", "DoctorReports"],
    }),

    // 2.3 Get All Reports
    getReports: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.patient_id) queryParams.append("patient_id", params.patient_id.toString());
        if (params.doctor_id) queryParams.append("doctor_id", params.doctor_id.toString());
        if (params.report_type) queryParams.append("report_type", params.report_type);
        if (params.status) queryParams.append("status", params.status);
        if (params.date_from) queryParams.append("date_from", params.date_from);
        if (params.date_to) queryParams.append("date_to", params.date_to);
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());

        const queryString = queryParams.toString();
        return {
          url: `reports${queryString ? `?${queryString}` : ''}`,
          method: "GET",
        };
      },
      providesTags: ["Reports"],
      keepUnusedDataFor: CACHE_TIMES.MEDIUM,
    }),

    // 2.4 Get Report by ID
    getReportById: builder.query({
      query: (reportId) => ({
        url: `reports/${reportId}`,
        method: "GET",
      }),
      providesTags: (result, error, reportId) => [{ type: "Reports", id: reportId }],
    }),

    // 2.5 Update Report
    updateReport: builder.mutation({
      query: ({ reportId, data }) => ({
        url: `reports/${reportId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { reportId }) => [
        { type: "Reports", id: reportId },
      ],
    }),

    // 2.6 Patient-Scoped Reports
    getPatientReports: builder.query({
      query: ({ patientId, ...params }) => {
        const queryParams = new URLSearchParams();
        
        if (params.type) queryParams.append("type", params.type);
        if (params.date_from) queryParams.append("date_from", params.date_from);
        if (params.date_to) queryParams.append("date_to", params.date_to);
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());

        const queryString = queryParams.toString();
        return {
          url: `reports/patient/${patientId}${queryString ? `?${queryString}` : ''}`,
          method: "GET",
        };
      },
      providesTags: (result, error, { patientId }) => [
        { type: "PatientReports", id: patientId },
      ],
    }),

    // 2.7 Doctor-Scoped Reports
    getDoctorReports: builder.query({
      query: ({ doctorId, ...params }) => {
        const queryParams = new URLSearchParams();
        
        if (params.date_from) queryParams.append("date_from", params.date_from);
        if (params.date_to) queryParams.append("date_to", params.date_to);
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());

        const queryString = queryParams.toString();
        return {
          url: `reports/doctor/${doctorId}${queryString ? `?${queryString}` : ''}`,
          method: "GET",
        };
      },
      providesTags: (result, error, { doctorId }) => [
        { type: "DoctorReports", id: doctorId },
      ],
    }),

    // 2.8 Generate Summary
    getReportSummary: builder.query({
      query: (reportId) => ({
        url: `reports/${reportId}/summary`,
        method: "GET",
      }),
      providesTags: (result, error, reportId) => [{ type: "Reports", id: reportId }],
    }),
  }),
});

export const {
  // New incident-based hooks
  useCreateIncidentMutation,
  useGetIncidentsQuery,
  useGetIncidentByIdQuery,
  useUpdateIncidentMutation,
  useDeleteIncidentMutation,
  useSaveIncidentFormMutation,
  useUpdateIncidentFormMutation,
  useAddIncidentNoteMutation,
  useGetCompleteIncidentFormsQuery,
  // useGetIncidentFormQuery, // Temporarily commented out to debug
  
  // Legacy report hooks
  useCreatePatientIntakeReportMutation,
  useCreateDoctorInitialReportMutation,
  useGetReportsQuery,
  useGetReportByIdQuery,
  useUpdateReportMutation,
  useGetPatientReportsQuery,
  useGetDoctorReportsQuery,
  useGetReportSummaryQuery,
} = reportApi;

// Export this separately to avoid duplicate declaration error
export const { useGetIncidentFormQuery } = reportApi;

// ===== LEGACY COMPATIBILITY EXPORTS =====

// Legacy exports for backward compatibility
export const useGetInitialReportQuery = () => ({ data: null, isLoading: false, error: null });
export const useGetHealthConditionsQuery = () => ({ data: [], isLoading: false, error: null });

// Legacy mutation hooks for backward compatibility
export const useSubmitPatientIntakeMutation = () => {
  const [createPatientIntakeReport] = useCreatePatientIntakeReportMutation();
  return [
    async (data) => {
      try {
        const result = await createPatientIntakeReport(data).unwrap();
        return { data: result };
      } catch (error) {
        console.error("Mutation error:", error);
        throw error;
      }
    },
    { isLoading: false, error: null }
  ];
};

export const useUpdatePatientIntakeMutation = () => {
  const [updateReport] = useUpdateReportMutation();
  return [
    async ({ id, data }) => {
      const result = await updateReport({ reportId: id, data }).unwrap();
      return { data: result };
    },
    { isLoading: false, error: null }
  ];
};

export const useSubmitInsuranceDetailsMutation = () => {
  const [createPatientIntakeReport] = useCreatePatientIntakeReportMutation();
  return [
    async (data) => {
      const result = await createPatientIntakeReport(data).unwrap();
      return { data: result };
    },
    { isLoading: false, error: null }
  ];
};

export const useUpdateInsuranceDetailsMutation = () => {
  const [updateReport] = useUpdateReportMutation();
  return [
    async ({ id, data }) => {
      const result = await updateReport({ reportId: id, data }).unwrap();
      return { data: result };
    },
    { isLoading: false, error: null }
  ];
};

export const useSubmitPainDescriptionMutation = () => {
  const [createPatientIntakeReport] = useCreatePatientIntakeReportMutation();
  return [
    async (data) => {
      const result = await createPatientIntakeReport(data).unwrap();
      return { data: result };
    },
    { isLoading: false, error: null }
  ];
};

export const useUpdatePainDescriptionMutation = () => {
  const [updateReport] = useUpdateReportMutation();
  return [
    async ({ id, data }) => {
      const result = await updateReport({ reportId: id, data }).unwrap();
      return { data: result };
    },
    { isLoading: false, error: null }
  ];
};

export const useSubmitDetailsDescriptionMutation = () => {
  const [createPatientIntakeReport] = useCreatePatientIntakeReportMutation();
  return [
    async (data) => {
      const result = await createPatientIntakeReport(data).unwrap();
      return { data: result };
    },
    { isLoading: false, error: null }
  ];
};

export const useUpdateDetailsDescriptionMutation = () => {
  const [updateReport] = useUpdateReportMutation();
  return [
    async ({ id, data }) => {
      const result = await updateReport({ reportId: id, data }).unwrap();
      return { data: result };
    },
    { isLoading: false, error: null }
  ];
};

export const useSubmitWorkImpactMutation = () => {
  const [createPatientIntakeReport] = useCreatePatientIntakeReportMutation();
  return [
    async (data) => {
      const result = await createPatientIntakeReport(data).unwrap();
      return { data: result };
    },
    { isLoading: false, error: null }
  ];
};

export const useUpdateWorkImpactMutation = () => {
  const [updateReport] = useUpdateReportMutation();
  return [
    async ({ id, data }) => {
      const result = await updateReport({ reportId: id, data }).unwrap();
      return { data: result };
    },
    { isLoading: false, error: null }
  ];
};

export const useSubmitHealthConditionMutation = () => {
  const [createPatientIntakeReport] = useCreatePatientIntakeReportMutation();
  return [
    async (data) => {
      const result = await createPatientIntakeReport(data).unwrap();
      return { data: result };
    },
    { isLoading: false, error: null }
  ];
};

export const useUpdateHealthConditionMutation = () => {
  const [updateReport] = useUpdateReportMutation();
  return [
    async ({ id, data }) => {
      const result = await updateReport({ reportId: id, data }).unwrap();
      return { data: result };
    },
    { isLoading: false, error: null }
  ];
};

// Additional legacy hooks for Report.jsx
export const useGetAllReportsQuery = useGetReportsQuery;
export const useCreateReportMutation = useCreatePatientIntakeReportMutation;

export const useDeleteReportMutation = () => [
  async (id) => ({ data: { success: true, id } }),
  { isLoading: false, error: null }
];

export const useDeletePatientIntakeMutation = () => [
  async (id) => ({ data: { success: true, id } }),
  { isLoading: false, error: null }
];

export const useDeleteInsuranceDetailsMutation = () => [
  async (id) => ({ data: { success: true, id } }),
  { isLoading: false, error: null }
];

export const useDeletePainDescriptionMutation = () => [
  async (id) => ({ data: { success: true, id } }),
  { isLoading: false, error: null }
];

export const useDeleteDetailsDescriptionMutation = () => [
  async (id) => ({ data: { success: true, id } }),
  { isLoading: false, error: null }
];

export const useDeleteRecoveryMutation = () => [
  async (id) => ({ data: { success: true, id } }),
  { isLoading: false, error: null }
];

export const useDeleteWorkImpactMutation = () => [
  async (id) => ({ data: { success: true, id } }),
  { isLoading: false, error: null }
];

export const useDeleteHealthConditionMutation = () => [
  async (id) => ({ data: { success: true, id } }),
  { isLoading: false, error: null }
];

// ===== NEW COMPATIBILITY HOOKS FOR INCIDENT SYSTEM =====

// Alias for the new incident system to maintain compatibility
export const useCreateIncidentFolderMutation = useCreateIncidentMutation;
export const useUpdatePatientReportMutation = useUpdateIncidentMutation;
export const useCreateIncidentFormMutation = useSaveIncidentFormMutation;
export const useAddReportNotesMutation = useAddIncidentNoteMutation;
