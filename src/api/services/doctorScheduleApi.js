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
      query: (doctorId) => ({
        url: `doctors/${doctorId}/profile`,
        method: "GET",
      }),
      providesTags: (result, error, doctorId) => [
        { type: "DoctorProfiles", id: doctorId },
      ],
    }),

    // Update doctor profile
    updateDoctorProfile: builder.mutation({
      query: ({ doctorId, ...data }) => ({
        url: `doctors/${doctorId}/profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { doctorId }) => [
        { type: "DoctorProfiles", id: doctorId },
        "DoctorProfiles",
      ],
    }),

    // Get doctor working hours
    getDoctorWorkingHours: builder.query({
      query: (doctorId) => ({
        url: `doctors/${doctorId}/working-hours`,
        method: "GET",
      }),
      providesTags: (result, error, doctorId) => [
        { type: "WorkingHours", id: doctorId },
      ],
    }),

    // Update doctor working hours
    updateDoctorWorkingHours: builder.mutation({
      query: ({ doctorId, workingHours }) => ({
        url: `doctors/${doctorId}/working-hours`,
        method: "PUT",
        body: { working_hours: workingHours },
      }),
      invalidatesTags: (result, error, { doctorId }) => [
        { type: "WorkingHours", id: doctorId },
        { type: "DoctorProfiles", id: doctorId },
        "DoctorSchedule",
      ],
    }),

    // Get doctor schedule for a date range
    getDoctorSchedule: builder.query({
      query: ({ doctorId, startDate, endDate }) => {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append("start_date", startDate);
        if (endDate) queryParams.append("end_date", endDate);

        return {
          url: `doctors/${doctorId}/schedule?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: (result, error, { doctorId }) => [
        { type: "DoctorSchedule", id: doctorId },
      ],
    }),

    // Get all doctors schedules for a date range
    getAllDoctorsSchedule: builder.query({
      query: ({ startDate, endDate, doctorIds = [] }) => {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append("start_date", startDate);
        if (endDate) queryParams.append("end_date", endDate);
        if (doctorIds.length > 0) queryParams.append("doctor_ids", doctorIds.join(","));

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
      query: ({ doctorId, startDate, endDate }) => {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append("start_date", startDate);
        if (endDate) queryParams.append("end_date", endDate);

        return {
          url: `doctors/${doctorId}/conflicts?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: (result, error, { doctorId }) => [
        { type: "DoctorSchedule", id: doctorId },
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