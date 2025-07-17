import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, CACHE_TIMES } from "../core/baseApi";

export const doctorScheduleApi = createApi({
  reducerPath: "doctorScheduleApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["DoctorSchedule", "WorkingHours", "TimeOff", "DoctorProfiles"],
  keepUnusedDataFor: CACHE_TIMES.MEDIUM,
  refetchOnMountOrArgChange: 30,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    // Get doctor profiles with working hours
    getDoctorProfiles: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.status) queryParams.append("status", params.status);
        if (params.specialization) queryParams.append("specialization", params.specialization);
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());

        return {
          url: `doctors/profiles?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["DoctorProfiles"],
      keepUnusedDataFor: CACHE_TIMES.LONG,
    }),

    // Get specific doctor profile
    getDoctorProfile: builder.query({
      query: (doctor_id) => ({
        url: `doctors/${doctor_id}/profile`,
        method: "GET",
      }),
      providesTags: (result, error, doctor_id) => [
        { type: "DoctorProfiles", id: doctor_id },
      ],
    }),

    // Update doctor profile
    updateDoctorProfile: builder.mutation({
      query: ({ doctor_id, ...data }) => ({
        url: `doctors/${doctor_id}/profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { doctor_id }) => [
        { type: "DoctorProfiles", id: doctor_id },
        "DoctorProfiles",
      ],
    }),

    // Get doctor working hours
    getDoctorWorkingHours: builder.query({
      query: (doctor_id) => ({
        url: `doctors/${doctor_id}/working-hours`,
        method: "GET",
      }),
      providesTags: (result, error, doctor_id) => [
        { type: "WorkingHours", id: doctor_id },
      ],
    }),

    // Update doctor working hours
    updateDoctorWorkingHours: builder.mutation({
      query: ({ doctor_id, workingHours }) => ({
        url: `doctors/${doctor_id}/working-hours`,
        method: "PUT",
        body: { working_hours: workingHours },
      }),
      invalidatesTags: (result, error, { doctor_id }) => [
        { type: "WorkingHours", id: doctor_id },
        { type: "DoctorProfiles", id: doctor_id },
        "DoctorSchedule",
      ],
    }),

    // Get doctor schedule for a date range
    getDoctorSchedule: builder.query({
      query: ({ doctor_id, start_date, end_date }) => {
        const queryParams = new URLSearchParams();
        if (start_date) queryParams.append("start_date", start_date);
        if (end_date) queryParams.append("end_date", end_date);

        return {
          url: `doctors/${doctor_id}/schedule?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: (result, error, { doctor_id }) => [
        { type: "DoctorSchedule", id: doctor_id },
      ],
    }),

    // Get all doctors schedules for a date range
    getAllDoctorsSchedule: builder.query({
      query: ({ start_date, end_date, doctor_ids = [] }) => {
        const queryParams = new URLSearchParams();
        if (start_date) queryParams.append("start_date", start_date);
        if (end_date) queryParams.append("end_date", end_date);
        if (doctor_ids.length > 0) queryParams.append("doctor_ids", doctor_ids.join(","));

        return {
          url: `doctors/schedule?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["DoctorSchedule"],
    }),

    // Get time-off requests
    getTimeOffRequests: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.doctor_id) queryParams.append("doctor_id", params.doctor_id);
        if (params.status) queryParams.append("status", params.status);
        if (params.start_date) queryParams.append("start_date", params.start_date);
        if (params.end_date) queryParams.append("end_date", params.end_date);
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());

        return {
          url: `doctors/time-off?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["TimeOff"],
    }),

    // Create time-off request
    createTimeOffRequest: builder.mutation({
      query: (data) => ({
        url: "doctors/time-off",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TimeOff", "DoctorSchedule"],
    }),

    // Update time-off request
    updateTimeOffRequest: builder.mutation({
      query: ({ requestId, ...data }) => ({
        url: `doctors/time-off/${requestId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { requestId }) => [
        { type: "TimeOff", id: requestId },
        "TimeOff",
        "DoctorSchedule",
      ],
    }),

    // Delete time-off request
    deleteTimeOffRequest: builder.mutation({
      query: (requestId) => ({
        url: `doctors/time-off/${requestId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TimeOff", "DoctorSchedule"],
    }),

    // Approve/reject time-off request (admin only)
    approveTimeOffRequest: builder.mutation({
      query: ({ requestId, status, notes }) => ({
        url: `doctors/time-off/${requestId}/approve`,
        method: "POST",
        body: { status, notes },
      }),
      invalidatesTags: (result, error, { requestId }) => [
        { type: "TimeOff", id: requestId },
        "TimeOff",
        "DoctorSchedule",
      ],
    }),

    // Get doctor availability conflicts
    getDoctorConflicts: builder.query({
      query: ({ doctor_id, start_date, end_date }) => {
        const queryParams = new URLSearchParams();
        if (start_date) queryParams.append("start_date", start_date);
        if (end_date) queryParams.append("end_date", end_date);

        return {
          url: `doctors/${doctor_id}/conflicts?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: (result, error, { doctor_id }) => [
        { type: "DoctorSchedule", id: doctor_id },
      ],
    }),

    // Get schedule statistics
    getScheduleStatistics: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.doctor_id) queryParams.append("doctor_id", params.doctor_id);
        if (params.start_date) queryParams.append("start_date", params.start_date);
        if (params.end_date) queryParams.append("end_date", params.end_date);

        return {
          url: `doctors/schedule/statistics?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["DoctorSchedule"],
    }),
  }),
});

export const {
  useGetDoctorProfilesQuery,
  useGetDoctorProfileQuery,
  useUpdateDoctorProfileMutation,
  useGetDoctorWorkingHoursQuery,
  useUpdateDoctorWorkingHoursMutation,
  useGetDoctorScheduleQuery,
  useGetAllDoctorsScheduleQuery,
  useGetTimeOffRequestsQuery,
  useCreateTimeOffRequestMutation,
  useUpdateTimeOffRequestMutation,
  useDeleteTimeOffRequestMutation,
  useApproveTimeOffRequestMutation,
  useGetDoctorConflictsQuery,
  useGetScheduleStatisticsQuery,
} = doctorScheduleApi; 