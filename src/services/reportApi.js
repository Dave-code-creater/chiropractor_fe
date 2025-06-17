import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const reportApi = createApi({
  reducerPath: "reportApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
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
} = reportApi;
