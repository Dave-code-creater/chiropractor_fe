import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseApi";

export const reportApi = createApi({
  reducerPath: "reportApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Reports"],
  endpoints: (builder) => ({
    // Fetch all report parts in parallel
    getInitialReport: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const urls = [
          "users/patient-intake",
          "users/insurance-details",
          "users/pain-descriptions",
          "users/details-descriptions",
          "users/recovery",
          "users/work-impact",
          "users/health-conditions",
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
        const res = await fetchWithBQ({ url: "users/patient-intake" });
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
        const res = await fetchWithBQ({ url: "users/insurance-details" });
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
        const res = await fetchWithBQ({ url: "users/pain-descriptions" });
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
        const res = await fetchWithBQ({ url: "users/details-descriptions" });
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
        const res = await fetchWithBQ({ url: "users/work-impact" });
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
      query: () => ({ url: "users/health-conditions" }),
      providesTags: ["Reports"],
    }),

    // ---- Mutations: Patient Intake ----
    submitPatientIntake: builder.mutation({
      query: (body) => ({
        url: "users/patient-intake",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reports"],
    }),
    updatePatientIntake: builder.mutation({
      query: ({ id, data }) => ({
        url: `users/patient-intake/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Reports"],
    }),
    deletePatientIntake: builder.mutation({
      query: (id) => ({
        url: `users/patient-intake/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reports"],
    }),

    // ---- Mutations: Insurance Details ----
    submitInsuranceDetails: builder.mutation({
      query: (body) => ({
        url: "users/insurance-details",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reports"],
    }),
    updateInsuranceDetails: builder.mutation({
      query: ({ id, data }) => ({
        url: `users/insurance-details/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Reports"],
    }),
    deleteInsuranceDetails: builder.mutation({
      query: (id) => ({
        url: `users/insurance-details/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reports"],
    }),

    // ---- Mutations: Pain Descriptions ----
    submitPainDescription: builder.mutation({
      query: (body) => ({
        url: "users/pain-descriptions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reports"],
    }),
    updatePainDescription: builder.mutation({
      query: ({ id, data }) => ({
        url: `users/pain-descriptions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Reports"],
    }),
    deletePainDescription: builder.mutation({
      query: (id) => ({
        url: `users/pain-descriptions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reports"],
    }),

    // ---- Mutations: Details Descriptions ----
    submitDetailsDescription: builder.mutation({
      query: (body) => ({
        url: "users/details-descriptions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reports"],
    }),
    updateDetailsDescription: builder.mutation({
      query: ({ id, data }) => ({
        url: `users/details-descriptions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Reports"],
    }),
    deleteDetailsDescription: builder.mutation({
      query: (id) => ({
        url: `users/details-descriptions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reports"],
    }),

    // ---- Mutations: Recovery ----
    submitRecovery: builder.mutation({
      query: (body) => ({
        url: "users/recovery",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reports"],
    }),
    updateRecovery: builder.mutation({
      query: ({ id, data }) => ({
        url: `users/recovery/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Reports"],
    }),
    deleteRecovery: builder.mutation({
      query: (id) => ({
        url: `users/recovery/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reports"],
    }),

    // ---- Mutations: Work Impact ----
    submitWorkImpact: builder.mutation({
      query: (body) => ({
        url: "users/work-impact",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reports"],
    }),
    updateWorkImpact: builder.mutation({
      query: ({ id, data }) => ({
        url: `users/work-impact/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Reports"],
    }),
    deleteWorkImpact: builder.mutation({
      query: (id) => ({
        url: `users/work-impact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reports"],
    }),

    // ---- Mutations: Health Conditions ----
    submitHealthCondition: builder.mutation({
      query: (body) => ({
        url: "users/health-conditions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reports"],
    }),
    updateHealthCondition: builder.mutation({
      query: ({ id, data }) => ({
        url: `users/health-conditions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Reports"],
    }),
    deleteHealthCondition: builder.mutation({
      query: (id) => ({
        url: `users/health-conditions/${id}`,
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
} = reportApi;