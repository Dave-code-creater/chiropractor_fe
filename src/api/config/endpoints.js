// API Endpoint Definitions
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh-token",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },

  // Users & Patients
  USERS: {
    BASE: "/users",
    PROFILE: "/users/profile",
    PATIENTS: "/users/patients",
  },

  // Deprecated: REPORTS section removed - now using INCIDENTS system

  // Incidents & Forms
  INCIDENTS: {
    BASE: "/incidents",
    FORMS: (incidentId) => `/incidents/${incidentId}/`,
    SUBMIT_FORMS: (incidentId) => `/incidents/${incidentId}/submit-forms`,
    COMPLETE_FORMS: (incidentId) => `/incidents/${incidentId}/forms/complete`,
    NOTES: (incidentId) => `/incidents/${incidentId}/notes`,

  },

  // Appointments
  APPOINTMENTS: {
    BASE: "/appointments",
    BY_PATIENT: (patientId) => `/appointments/patient/${patientId}`,
    SCHEDULE: "/appointments/schedule",
  },

  // Chat
  CHAT: {
    BASE: "/chat",
    CONVERSATIONS: "/chat/conversations",
    CONVERSATION_MESSAGES: (conversationId) => `/chat/conversations/${conversationId}/messages`,
    CONVERSATION_USERS: "/chat/conversations/users",
    SEND_MESSAGE: "/chat/messages",
    AVAILABLE_USERS: "/chat/admin-doctors",
  },

  // Blog
  BLOG: {
    BASE: "/blog",
    POSTS: "/blog/posts",
    CATEGORIES: "/blog/categories",
  },
}; 