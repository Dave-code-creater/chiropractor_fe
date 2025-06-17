import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseApi";

export const reportApi = createApi({
  reducerPath: "reportApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getInitialReport: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const urls = [
          "users/profile",
          "users/accdient-insurance",
          "users/pain-evaluation",
          "users/detailed-description",
          "users/recovery-work-impact",
          "users/health-history",
        ];
        try {
          const responses = await Promise.all(urls.map((url) => fetchWithBQ({ url })));
          for (const res of responses) {
            if (res.error) throw res.error;
          }
          const [
            patientIntake,
            accidentDetails,
            painEvaluations,
            symptomDescription,
            recoveryImpact,
            healthHistory,
          ] = responses.map((r) => r.data?.metadata ?? r.data);
          return {
            data: {
              patientIntake,
              accidentDetails,
              painEvaluations,
              symptomDescription,
              recoveryImpact,
              healthHistory,
            },
          };
        } catch (error) {
          return { error };
        }
      },
    }),
    submitPatientIntake: builder.mutation({
      query: (data) => ({
        url: "/users/profile",
        method: "POST",
        body: data,
      }),
    }),
    submitAccidentDetails: builder.mutation({
      query: (data) => ({
        url: "/users/accdient-insurance",
        method: "POST",
        body: data,
      }),
    }),
    submitPainEvaluation: builder.mutation({
      query: (data) => ({
        url: "/users/pain-evaluation",
        method: "POST",
        body: data,
      }),
    }),
    submitSymptomDescription: builder.mutation({
      query: (data) => ({
        url: "/users/detailed-description",
        method: "POST",
        body: data,
      }),
    }),
    submitRecoveryImpact: builder.mutation({
      query: (data) => ({
        url: "/users/recovery-work-impact",
        method: "POST",
        body: data,
      }),
    }),
    submitHealthHistory: builder.mutation({
      query: (data) => ({
        url: "/users/health-history",
        method: "POST",
        body: data,
      }),
    }),
    deleteReport: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useSubmitPatientIntakeMutation,
  useSubmitAccidentDetailsMutation,
  useSubmitPainEvaluationMutation,
  useSubmitSymptomDescriptionMutation,
  useSubmitRecoveryImpactMutation,
  useSubmitHealthHistoryMutation,
  useDeleteReportMutation,
  useGetInitialReportQuery,
} = reportApi;
