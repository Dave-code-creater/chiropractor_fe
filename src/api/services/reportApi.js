import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, CACHE_TIMES } from "../core/baseApi";

export const reportApi = createApi({
  reducerPath: "reportApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Reports", "Incidents"],
  keepUnusedDataFor: CACHE_TIMES.MEDIUM,
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: true,
  endpoints: (builder) => ({

    createIncident: builder.mutation({
      query: (data) => ({
        url: "incidents",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Incidents"],
    }),

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

    deleteIncident: builder.mutation({
      query: (incidentId) => ({
        url: `incidents/${incidentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Incidents"],
    }),

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

    getCompleteIncidentForms: builder.query({
      query: (incidentId) => ({
        url: `incidents/${incidentId}`,
        method: "GET",
      }),
      providesTags: (result, error, incidentId) => [
        { type: "IncidentForms", id: incidentId },
        { type: "Incidents", id: incidentId },
      ],
    }),

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

    submitIncidentForms: builder.mutation({
      query: ({ incidentId, allFormsData, processOptions = {} }) => ({
        url: `incidents/${incidentId}/submit-forms`,
        method: "POST",
        body: {
          forms_data: allFormsData,
          processing_options: {
            auto_categorize: true,
            extract_key_data: true,
            generate_summary: true,
            ...processOptions
          }
        },
      }),
      invalidatesTags: (result, error, { incidentId }) => [
        { type: "IncidentForms", id: incidentId },
        { type: "Incidents", id: incidentId },
        { type: "IncidentNotes", id: incidentId },
      ],
    }),


    submitPatientInfoForm: builder.mutation({
      query: ({ incidentId, formData }) => ({
        url: `incidents/${incidentId}/patient-info`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { incidentId }) => [
        { type: "IncidentForms", id: incidentId },
        { type: "Incidents", id: incidentId },
      ],
    }),

    submitHealthInsuranceForm: builder.mutation({
      query: ({ incidentId, formData }) => ({
        url: `incidents/${incidentId}/health-insurance`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { incidentId }) => [
        { type: "IncidentForms", id: incidentId },
        { type: "Incidents", id: incidentId },
      ],
    }),

    submitPainDescriptionFormNew: builder.mutation({
      query: ({ incidentId, formData }) => ({
        url: `incidents/${incidentId}/pain-description-form`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { incidentId }) => [
        { type: "IncidentForms", id: incidentId },
        { type: "Incidents", id: incidentId },
      ],
    }),

    submitPainAssessmentFormNew: builder.mutation({
      query: ({ incidentId, formData }) => ({
        url: `incidents/${incidentId}/pain-assessment-form`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { incidentId }) => [
        { type: "IncidentForms", id: incidentId },
        { type: "Incidents", id: incidentId },
      ],
    }),

    submitMedicalHistoryFormNew: builder.mutation({
      query: ({ incidentId, formData }) => ({
        url: `incidents/${incidentId}/medical-history-form`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { incidentId }) => [
        { type: "IncidentForms", id: incidentId },
        { type: "Incidents", id: incidentId },
      ],
    }),

    submitLifestyleImpactFormNew: builder.mutation({
      query: ({ incidentId, formData }) => ({
        url: `incidents/${incidentId}/lifestyle-impact-form`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { incidentId }) => [
        { type: "IncidentForms", id: incidentId },
        { type: "Incidents", id: incidentId },
      ],
    }),


  }),
});

export const {
  useCreateIncidentMutation,
  useGetIncidentsQuery,
  useGetIncidentByIdQuery,
  useSaveIncidentFormMutation,

  useSubmitPatientInfoFormMutation,
  useSubmitHealthInsuranceFormMutation,
  useSubmitPainDescriptionFormNewMutation,
  useSubmitPainAssessmentFormNewMutation,
  useSubmitMedicalHistoryFormNewMutation,
  useSubmitLifestyleImpactFormNewMutation,
} = reportApi;


