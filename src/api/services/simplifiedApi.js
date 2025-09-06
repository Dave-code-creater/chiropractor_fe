import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, CACHE_TIMES } from "../core/baseApi";

/**
 * ===============================================
 * SIMPLIFIED API FOR DR. DIEU PHAN'S PRACTICE
 * ===============================================
 * 
 * Traditional CRUD operations focused on:
 * 1. Patient reports initial incident
 * 2. Dr. Dieu Phan reviews and creates treatment plan
 * 3. Track patient visits and progress
 * 4. Simple appointment scheduling
 */

export const drDieuApi = createApi({
  reducerPath: "drDieuApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Patient", "Report", "TreatmentPlan", "Visit", "Appointment"],
  keepUnusedDataFor: CACHE_TIMES.MEDIUM,
  endpoints: (builder) => ({
    
    // ===============================================
    // PATIENT MANAGEMENT
    // ===============================================
    
    /**
     * Get all patients for Dr. Dieu Phan
     */
    getPatients: builder.query({
      query: () => "users/patients",
      providesTags: ["Patient"],
    }),

    /**
     * Get single patient with complete record
     */
    getPatient: builder.query({
      query: (patientId) => `vitals/patient/${patientId}/complete-record`,
      providesTags: (result, error, patientId) => [{ type: "Patient", id: patientId }],
    }),

    /**
     * Create new patient
     */
    createPatient: builder.mutation({
      query: (patientData) => ({
        url: "users/patients",
        method: "POST",
        body: patientData,
      }),
      invalidatesTags: ["Patient"],
    }),

    // ===============================================
    // PATIENT INITIAL REPORTS
    // ===============================================

    /**
     * Patient creates initial incident report
     */
    createReport: builder.mutation({
      query: (reportData) => ({
        url: "incidents",
        method: "POST",
        body: reportData,
      }),
      invalidatesTags: ["Report", "Patient"],
    }),

    /**
     * Get patient's initial report for doctor review
     */
    getPatientReport: builder.query({
      query: (patientId) => `vitals/patient/${patientId}/initial-report`,
      providesTags: (result, error, patientId) => [{ type: "Report", id: patientId }],
    }),

    /**
     * Get all pending reports for Dr. Dieu Phan to review
     */
    getPendingReports: builder.query({
      query: () => "incidents?status=pending",
      providesTags: ["Report"],
    }),

    // ===============================================
    // TREATMENT PLANS (Dr. Dieu Phan Only)
    // ===============================================

    /**
     * Dr. Dieu Phan creates treatment plan
     */
    createTreatmentPlan: builder.mutation({
      query: ({ patientId, ...planData }) => ({
        url: `vitals/patient/${patientId}/treatment-plan`,
        method: "POST",
        body: planData,
      }),
      invalidatesTags: ["TreatmentPlan", "Patient", "Report"],
    }),

    /**
     * Update treatment plan (adjust frequency, extend duration)
     */
    updateTreatmentPlan: builder.mutation({
      query: ({ patientId, ...planData }) => ({
        url: `vitals/patient/${patientId}/treatment-plan`,
        method: "PUT",
        body: planData,
      }),
      invalidatesTags: ["TreatmentPlan", "Patient"],
    }),

    // ===============================================
    // PATIENT VISITS & PROGRESS
    // ===============================================

    /**
     * Record daily patient visit with vitals and progress notes
     */
    recordVisit: builder.mutation({
      query: ({ patientId, ...visitData }) => ({
        url: `vitals/patient/${patientId}/daily`,
        method: "POST",
        body: visitData,
      }),
      invalidatesTags: ["Visit", "Patient"],
    }),

    /**
     * Create SOAP note for patient visit
     */
    createSoapNote: builder.mutation({
      query: ({ patientId, ...soapData }) => ({
        url: `vitals/patient/${patientId}/soap-note`,
        method: "POST",
        body: soapData,
      }),
      invalidatesTags: ["Visit", "Patient"],
    }),

    /**
     * Get all patient visits
     */
    getPatientVisits: builder.query({
      query: (patientId) => `vitals/patient/${patientId}/visits`,
      providesTags: (result, error, patientId) => [{ type: "Visit", id: patientId }],
    }),

    /**
     * Get patient progress summary
     */
    getPatientProgress: builder.query({
      query: (patientId) => `vitals/patient/${patientId}/progress`,
      providesTags: (result, error, patientId) => [{ type: "Visit", id: patientId }],
    }),

    // ===============================================
    // SIMPLE APPOINTMENTS
    // ===============================================

    /**
     * Create appointment
     */
    createAppointment: builder.mutation({
      query: (appointmentData) => ({
        url: "appointments",
        method: "POST",
        body: appointmentData,
      }),
      invalidatesTags: ["Appointment"],
    }),

    /**
     * Get today's appointments for Dr. Dieu Phan
     */
    getTodaysAppointments: builder.query({
      query: () => `appointments?date=${new Date().toISOString().split('T')[0]}`,
      providesTags: ["Appointment"],
    }),

    /**
     * Get patient's appointments
     */
    getPatientAppointments: builder.query({
      query: (patientId) => `appointments/patient/${patientId}`,
      providesTags: (result, error, patientId) => [{ type: "Appointment", id: patientId }],
    }),

    /**
     * Update appointment (reschedule, cancel, complete)
     */
    updateAppointment: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `appointments/${id}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: ["Appointment"],
    }),

  }),
});

// Export hooks for use in components
export const {
  // Patient management
  useGetPatientsQuery,
  useGetPatientQuery,
  useCreatePatientMutation,

  // Reports
  useCreateReportMutation,
  useGetPatientReportQuery,
  useGetPendingReportsQuery,

  // Treatment plans
  useCreateTreatmentPlanMutation,
  useUpdateTreatmentPlanMutation,

  // Visits and progress
  useRecordVisitMutation,
  useCreateSoapNoteMutation,
  useGetPatientVisitsQuery,
  useGetPatientProgressQuery,

  // Appointments
  useCreateAppointmentMutation,
  useGetTodaysAppointmentsQuery,
  useGetPatientAppointmentsQuery,
  useUpdateAppointmentMutation,
} = drDieuApi;