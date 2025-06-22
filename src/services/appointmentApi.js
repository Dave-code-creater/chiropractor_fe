import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, CACHE_TIMES } from "./baseApi";
import { cacheUtils, CACHE_DURATION, CACHE_NAMESPACES } from "../utils/cache";

// Mock data for development/testing
const mockDoctors = [
  {
    id: "dr-1",
    firstName: "John",
    lastName: "Smith",
    email: "dr.smith@clinic.com",
    phone: "+1-555-0199",
    specializations: {
      primary: "Chiropractic Care",
      specializations: ["Sports Injury", "Spinal Manipulation", "Rehabilitation"],
      certifications: ["Board Certified Chiropractor", "Sports Medicine Certification"]
    },
    yearsOfExperience: 15,
    rating: 4.8,
    totalReviews: 127,
    languages: ["English", "Spanish"],
    education: [
      {
        degree: "Doctor of Chiropractic",
        institution: "Palmer College of Chiropractic",
        year: 2009
      }
    ]
  },
  {
    id: "dr-2",
    firstName: "Emily",
    lastName: "Johnson",
    email: "dr.johnson@clinic.com",
    phone: "+1-555-0188",
    specializations: {
      primary: "Physical Therapy",
      specializations: ["Sports Rehabilitation", "Manual Therapy", "Pain Management"],
      certifications: ["Licensed Physical Therapist", "Orthopedic Clinical Specialist"]
    },
    yearsOfExperience: 12,
    rating: 4.9,
    totalReviews: 89,
    languages: ["English"],
    education: [
      {
        degree: "Doctor of Physical Therapy",
        institution: "University of Southern California",
        year: 2012
      }
    ]
  },
  {
    id: "dr-3",
    firstName: "Michael",
    lastName: "Chen",
    email: "dr.chen@clinic.com",
    phone: "+1-555-0177",
    specializations: {
      primary: "Sports Medicine",
      specializations: ["Athletic Performance", "Injury Prevention", "Rehabilitation"],
      certifications: ["Sports Medicine Physician", "Athletic Training Certification"]
    },
    yearsOfExperience: 10,
    rating: 4.7,
    totalReviews: 156,
    languages: ["English", "Mandarin"],
    education: [
      {
        degree: "Doctor of Medicine",
        institution: "Stanford University School of Medicine",
        year: 2014
      }
    ]
  }
];

// Mock appointments data
const mockAppointments = [
  {
    id: "appt-1",
    patientId: "patient-1",
    doctorId: "dr-1",
    doctor: mockDoctors[0],
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: "10:00",
    type: "Initial Consultation",
    status: "scheduled",
    reason: "Lower back pain evaluation",
    notes: "Patient experiencing chronic lower back pain for 3 weeks",
    duration: 60,
    createdAt: new Date().toISOString()
  },
  {
    id: "appt-2",
    patientId: "patient-1",
    doctorId: "dr-2",
    doctor: mockDoctors[1],
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: "14:30",
    type: "Follow-up",
    status: "scheduled",
    reason: "Physical therapy session",
    notes: "Continue rehabilitation exercises",
    duration: 45,
    createdAt: new Date().toISOString()
  }
];

// Helper function to format time
const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const appointmentApi = createApi({
  reducerPath: "appointmentApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Appointments", "Doctors", "Availability"],
  // Enhanced caching configuration
  keepUnusedDataFor: CACHE_TIMES.SHORT, // Appointments data changes frequently
  refetchOnMountOrArgChange: 60, // Refetch if data is older than 1 minute
  refetchOnFocus: true, // Refetch on window focus for real-time updates
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    createAppointment: builder.mutation({
      query: (data) => ({
        url: "appointments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Appointments", "Availability"],
      // Clear cache on create
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Clear appointments cache
          cacheUtils.appointments.clearAll();
        } catch (error) {
          console.error("Failed to create appointment:", error);
        }
      },
      // Mock implementation for development
      async queryFn(data, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const result = await fetchWithBQ({
            url: "appointments",
            method: "POST",
            body: data,
          });
          
          // Clear cache after successful creation
          cacheUtils.appointments.clearAll();
          
          return result;
        } catch (error) {
          // Fallback to mock data if API is not available
          console.warn("API not available, using mock data");
          const newAppointment = {
            id: `appt-${Date.now()}`,
            ...data,
            status: "scheduled",
            createdAt: new Date().toISOString(),
            doctor: mockDoctors.find(d => d.id === data.doctorId)
          };
          
          // Clear cache
          cacheUtils.appointments.clearAll();
          
          return {
            data: {
              success: true,
              statusCode: 201,
              message: "Appointment created successfully",
              metadata: newAppointment
            }
          };
        }
      }
    }),
    
    getAppointment: builder.query({
      query: (id) => ({ url: `appointments/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "Appointments", id }],
      keepUnusedDataFor: CACHE_TIMES.SHORT,
    }),
    
    updateAppointment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `appointments/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Appointments", id },
        "Appointments",
        "Availability"
      ],
      // Clear cache on update
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          cacheUtils.appointments.clearAll();
        } catch (error) {
          console.error("Failed to update appointment:", error);
        }
      },
    }),
    
    listAppointments: builder.query({
      query: (params = {}) => ({
        url: "appointments",
        params: {
          status: params.status,
          from: params.from,
          to: params.to,
          doctorId: params.doctorId,
          patientId: params.patientId,
        },
      }),
      providesTags: (result, error, params) => [
        "Appointments",
        { type: "Appointments", id: `LIST-${JSON.stringify(params)}` }
      ],
      transformResponse: (response) => {
        // Handle different response formats
        if (response.success && response.metadata) {
          return response.metadata;
        }
        return response;
      },
      keepUnusedDataFor: CACHE_TIMES.SHORT,
      // Mock implementation for development
      async queryFn(params, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          // Check cache first
          const cached = cacheUtils.appointments.getList(params);
          if (cached) {
            console.log("Appointments cache hit");
            return { data: cached };
          }

          const result = await fetchWithBQ({
            url: "appointments",
            params: {
              status: params.status,
              from: params.from,
              to: params.to,
              doctorId: params.doctorId,
              patientId: params.patientId,
            },
          });
          
          // Cache the result
          if (result.data) {
            cacheUtils.appointments.setList(result.data, params, CACHE_DURATION.SHORT);
          }
          
          return result;
        } catch (error) {
          // Fallback to mock data if API is not available
          console.warn("API not available, using mock data");
          let filteredAppointments = [...mockAppointments];
          
          if (params.patientId) {
            filteredAppointments = filteredAppointments.filter(
              appt => appt.patientId === params.patientId
            );
          }
          
          if (params.doctorId) {
            filteredAppointments = filteredAppointments.filter(
              appt => appt.doctorId === params.doctorId
            );
          }
          
          if (params.status) {
            filteredAppointments = filteredAppointments.filter(
              appt => appt.status === params.status
            );
          }
          
          const result = {
            success: true,
            statusCode: 200,
            metadata: filteredAppointments
          };
          
          // Cache mock data
          cacheUtils.appointments.setList(result, params, CACHE_DURATION.SHORT);
          
          return { data: result };
        }
      }
    }),
    
    cancelAppointment: builder.mutation({
      query: (id) => ({
        url: `appointments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Appointments", id },
        "Appointments",
        "Availability"
      ],
      // Clear cache on cancel
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          cacheUtils.appointments.clearAll();
        } catch (error) {
          console.error("Failed to cancel appointment:", error);
        }
      },
    }),
    
    // Get available time slots for a doctor
    getDoctorAvailability: builder.query({
      query: ({ doctorId, date }) => ({
        url: `doctors/${doctorId}/availability`,
        params: { date },
      }),
      providesTags: (_result, _error, { doctorId, date }) => [
        { type: "Availability", id: `${doctorId}-${date}` }
      ],
      keepUnusedDataFor: CACHE_TIMES.SHORT, // Availability changes frequently
      // Mock implementation for development
      async queryFn({ doctorId, date }, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          // Check cache first
          const cached = cacheUtils.appointments.getAvailability(doctorId, date);
          if (cached) {
            console.log(`Doctor availability cache hit for ${doctorId} on ${date}`);
            return { data: cached };
          }

          const result = await fetchWithBQ({
            url: `doctors/${doctorId}/availability`,
            params: { date },
          });
          
          // Cache the result
          if (result.data) {
            cacheUtils.appointments.setAvailability(doctorId, date, result.data, CACHE_DURATION.SHORT);
          }
          
          return result;
        } catch (error) {
          // Fallback to mock availability data
          console.warn("API not available, using mock availability data");
          const slots = [];
          const startHour = 9;
          const endHour = 17;
          const slotDuration = 30;

          for (let hour = startHour; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += slotDuration) {
              const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
              slots.push({
                time: timeString,
                available: Math.random() > 0.3, // 70% chance of being available
                label: formatTime(timeString)
              });
            }
          }
          
          const result = {
            success: true,
            statusCode: 200,
            metadata: { slots }
          };
          
          // Cache mock data
          cacheUtils.appointments.setAvailability(doctorId, date, result, CACHE_DURATION.SHORT);
          
          return { data: result };
        }
      }
    }),
    
    // Get list of doctors
    getDoctors: builder.query({
      query: (params = {}) => ({
        url: "doctors",
        params: {
          specialization: params.specialization,
          availability: params.availability,
        },
      }),
      providesTags: ["Doctors"],
      keepUnusedDataFor: CACHE_TIMES.LONG, // Doctor info doesn't change often
      // Mock implementation for development
      async queryFn(params, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          // Check cache first
          const cached = cacheUtils.doctors.getList(params);
          if (cached) {
            console.log("Doctors cache hit");
            return { data: cached };
          }

          const result = await fetchWithBQ({
            url: "doctors",
            params: {
              specialization: params.specialization,
              availability: params.availability,
            },
          });
          
          // Cache the result
          if (result.data) {
            cacheUtils.doctors.setList(result.data, params, CACHE_DURATION.LONG);
          }
          
          return result;
        } catch (error) {
          // Fallback to mock doctors data
          console.warn("API not available, using mock doctors data");
          let filteredDoctors = [...mockDoctors];
          
          if (params.specialization) {
            filteredDoctors = filteredDoctors.filter(
              doctor => doctor.specializations.primary.toLowerCase().includes(params.specialization.toLowerCase()) ||
                       doctor.specializations.specializations.some(spec => 
                         spec.toLowerCase().includes(params.specialization.toLowerCase())
                       )
            );
          }
          
          const result = {
            success: true,
            statusCode: 200,
            metadata: { doctors: filteredDoctors }
          };
          
          // Cache mock data
          cacheUtils.doctors.setList(result, params, CACHE_DURATION.LONG);
          
          return { data: result };
        }
      }
    }),
  }),
});

export const {
  useCreateAppointmentMutation,
  useGetAppointmentQuery,
  useUpdateAppointmentMutation,
  useListAppointmentsQuery,
  useCancelAppointmentMutation,
  useGetDoctorAvailabilityQuery,
  useGetDoctorsQuery,
} = appointmentApi;
