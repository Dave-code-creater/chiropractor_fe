import { apiSlice } from "../../services/api";

export const reportApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        submitPatientInfo: builder.mutation({
            query: (data) => ({
                url: "/report/patient-info",
                method: "POST",
                body: data,
            }),
        }),
        submitAccidentDetails: builder.mutation({
            query: (data) => ({
                url: "/report/accident-details",
                method: "POST",
                body: data,
            }),
        }),
        submitPainEvaluation: builder.mutation({
            query: (data) => ({
                url: "/report/pain-evaluation",
                method: "POST",
                body: data,
            }),
        }),
        submitSymptomDetails: builder.mutation({
            query: (data) => ({
                url: "/report/symptom-details",
                method: "POST",
                body: data,
            }),
        }),
        submitRecoveryImpact: builder.mutation({
            query: (data) => ({
                url: "/report/recovery-impact",
                method: "POST",
                body: data,
            }),
        }),
        submitHealthHistory: builder.mutation({
            query: (data) => ({
                url: "/report/health-history",
                method: "POST",
                body: data,
            }),
        }),
    }),
});
export const {
    useSubmitPatientInfoMutation,
    useSubmitAccidentDetailsMutation,
    useSubmitPainEvaluationMutation,
    useSubmitSymptomDetailsMutation,
    useSubmitRecoveryImpactMutation,
    useSubmitHealthHistoryMutation,
} = reportApi;