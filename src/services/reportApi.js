import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseApi";

export const reportApi = createApi({
  reducerPath: "reportApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Reports"],
  endpoints: (builder) => ({
    // Get all reports for the current user
    getAllReports: builder.query({
      query: () => ({ url: "reports" }),
      providesTags: ["Reports"],
      transformResponse: (response) => {
        // Transform the response to match the frontend format
        if (!response || !Array.isArray(response)) return [];
        
        return response.map(report => ({
          id: report.id,
          name: report.name || `Report ${report.id}`,
          date: report.created_at ? new Date(report.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          category: report.template_type || 'consultation',
          status: report.status || 'draft',
          templateData: report.template_data || {},
          createdAt: report.created_at,
          updatedAt: report.updated_at,
          completionPercentage: report.completion_percentage || 0,
          patientId: report.patient_id,
          assignedTo: report.assigned_to,
          createdBy: report.created_by
        }));
      }
    }),

    // Create a new report
    createReport: builder.mutation({
      query: (reportData) => ({
        url: "reports",
        method: "POST",
        body: reportData,
      }),
      invalidatesTags: ["Reports"],
    }),

    // Update a report
    updateReport: builder.mutation({
      query: ({ id, data }) => ({
        url: `reports/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Reports"],
    }),

    // Delete a report
    deleteReport: builder.mutation({
      query: (id) => ({
        url: `reports/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reports"],
    }),

    // Fetch all report parts in parallel
    getInitialReport: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const urls = [
          "reports/patient-intake",
          "reports/insurance-details",
          "reports/pain-descriptions",
          "reports/details-descriptions",
          "reports/recovery",
          "reports/work-impact",
          "reports/health-conditions",
        ];

        try {
          const results = await Promise.all(
            urls.map(async (url) => {
              const res = await fetchWithBQ({ url });
              if (res.error) {
                if (res.error.status === 404) return null;
                throw res.error;
              }
              return res.data && res.data.metadata != null
                ? res.data.metadata
                : res.data;
            })
          );

          const [
            patientIntake,
            insuranceDetails,
            painDescriptions,
            detailsDescriptions,
            recovery,
            workImpact,
            healthConditions,
          ] = results;

          return {
            data: {
              patientIntake,
              insuranceDetails,
              painDescriptions,
              detailsDescriptions,
              recovery,
              workImpact,
              healthConditions,
            },
          };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["Reports"],
    }),

    getPatientIntake: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const res = await fetchWithBQ({ url: "reports/patient-intake" });
        if (res.error) {
          if (res.error.status === 404) return { data: null };
          return { error: res.error };
        }
        return {
          data:
            res.data && res.data.metadata != null ? res.data.metadata : res.data,
        };
      },
      providesTags: ["Reports"],
    }),

    getInsuranceDetails: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const res = await fetchWithBQ({ url: "reports/insurance-details" });
        if (res.error) {
          if (res.error.status === 404) return { data: null };
          return { error: res.error };
        }
        return {
          data:
            res.data && res.data.metadata != null ? res.data.metadata : res.data,
        };
      },
      providesTags: ["Reports"],
    }),

    getPainDescriptions: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const res = await fetchWithBQ({ url: "reports/pain-descriptions" });
        if (res.error) {
          if (res.error.status === 404) return { data: null };
          return { error: res.error };
        }
        return {
          data:
            res.data && res.data.metadata != null ? res.data.metadata : res.data,
        };
      },
      providesTags: ["Reports"],
    }),

    getDetailsDescriptions: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const res = await fetchWithBQ({ url: "reports/details-descriptions" });
        if (res.error) {
          if (res.error.status === 404) return { data: null };
          return { error: res.error };
        }
        return {
          data:
            res.data && res.data.metadata != null ? res.data.metadata : res.data,
        };
      },
      providesTags: ["Reports"],
    }),

    getWorkImpact: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const res = await fetchWithBQ({ url: "reports/work-impact" });
        if (res.error) {
          if (res.error.status === 404) return { data: null };
          return { error: res.error };
        }
        return {
          data:
            res.data && res.data.metadata != null ? res.data.metadata : res.data,
        };
      },
      providesTags: ["Reports"],
    }),

    // Simple GET list
    getHealthConditions: builder.query({
      query: () => ({ url: "reports/health-conditions" }),
      providesTags: ["Reports"],
    }),

    // ---- Mutations: Patient Intake ----
    submitPatientIntake: builder.mutation({
      query: (body) => ({
        url: "reports/patient-intake",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reports"],
    }),
    updatePatientIntake: builder.mutation({
      query: ({ id, data }) => ({
        url: `reports/patient-intake/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Reports"],
    }),
    deletePatientIntake: builder.mutation({
      query: (id) => ({
        url: `reports/patient-intake/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reports"],
    }),

    // ---- Mutations: Insurance Details ----
    submitInsuranceDetails: builder.mutation({
      query: (body) => ({
        url: "reports/insurance-details",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reports"],
    }),
    updateInsuranceDetails: builder.mutation({
      query: ({ id, data }) => ({
        url: `reports/insurance-details/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Reports"],
    }),
    deleteInsuranceDetails: builder.mutation({
      query: (id) => ({
        url: `reports/insurance-details/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reports"],
    }),

    // ---- Mutations: Pain Descriptions ----
    submitPainDescription: builder.mutation({
      query: (body) => ({
        url: "reports/pain-descriptions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reports"],
    }),
    updatePainDescription: builder.mutation({
      query: ({ id, data }) => ({
        url: `reports/pain-descriptions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Reports"],
    }),
    deletePainDescription: builder.mutation({
      query: (id) => ({
        url: `reports/pain-descriptions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reports"],
    }),

    // ---- Mutations: Details Descriptions ----
    submitDetailsDescription: builder.mutation({
      query: (body) => ({
        url: "reports/details-descriptions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reports"],
    }),
    updateDetailsDescription: builder.mutation({
      query: ({ id, data }) => ({
        url: `reports/details-descriptions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Reports"],
    }),
    deleteDetailsDescription: builder.mutation({
      query: (id) => ({
        url: `reports/details-descriptions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reports"],
    }),

    // ---- Mutations: Recovery ----
    submitRecovery: builder.mutation({
      query: (body) => ({
        url: "reports/recovery",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reports"],
    }),
    updateRecovery: builder.mutation({
      query: ({ id, data }) => ({
        url: `reports/recovery/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Reports"],
    }),
    deleteRecovery: builder.mutation({
      query: (id) => ({
        url: `reports/recovery/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reports"],
    }),

    // ---- Mutations: Work Impact ----
    submitWorkImpact: builder.mutation({
      query: (body) => ({
        url: "reports/work-impact",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reports"],
    }),
    updateWorkImpact: builder.mutation({
      query: ({ id, data }) => ({
        url: `reports/work-impact/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Reports"],
    }),
    deleteWorkImpact: builder.mutation({
      query: (id) => ({
        url: `reports/work-impact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reports"],
    }),

    // ---- Mutations: Health Conditions ----
    submitHealthCondition: builder.mutation({
      query: (body) => ({
        url: "reports/health-conditions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reports"],
    }),
    updateHealthCondition: builder.mutation({
      query: ({ id, data }) => ({
        url: `reports/health-conditions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Reports"],
    }),
    deleteHealthCondition: builder.mutation({
      query: (id) => ({
        url: `reports/health-conditions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reports"],
    }),
  }),
});

// Export hooks
export const {
  useGetInitialReportQuery,
  useGetPatientIntakeQuery,
  useGetInsuranceDetailsQuery,
  useGetPainDescriptionsQuery,
  useGetDetailsDescriptionsQuery,
  useGetWorkImpactQuery,
  useGetHealthConditionsQuery,

  useSubmitPatientIntakeMutation,
  useUpdatePatientIntakeMutation,
  useDeletePatientIntakeMutation,

  useSubmitInsuranceDetailsMutation,
  useUpdateInsuranceDetailsMutation,
  useDeleteInsuranceDetailsMutation,

  useSubmitPainDescriptionMutation,
  useUpdatePainDescriptionMutation,
  useDeletePainDescriptionMutation,

  useSubmitDetailsDescriptionMutation,
  useUpdateDetailsDescriptionMutation,
  useDeleteDetailsDescriptionMutation,

  useSubmitRecoveryMutation,
  useUpdateRecoveryMutation,
  useDeleteRecoveryMutation,

  useSubmitWorkImpactMutation,
  useUpdateWorkImpactMutation,
  useDeleteWorkImpactMutation,

  useSubmitHealthConditionMutation,
  useUpdateHealthConditionMutation,
  useDeleteHealthConditionMutation,

  useGetAllReportsQuery,
  useCreateReportMutation,
  useUpdateReportMutation,
  useDeleteReportMutation,
} = reportApi;