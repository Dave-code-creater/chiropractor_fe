export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh-token",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },

  USERS: {
    BASE: "/users",
    PROFILE: "/users/profile",
    PATIENTS: "/users/patients",
  },

  INCIDENTS: {
    BASE: "/incidents",
    FORMS: (incidentId) => `/incidents/${incidentId}/`,
    SUBMIT_FORMS: (incidentId) => `/incidents/${incidentId}/submit-forms`,
    COMPLETE_FORMS: (incidentId) => `/incidents/${incidentId}/forms/complete`,
    NOTES: (incidentId) => `/incidents/${incidentId}/notes`,

  },

  APPOINTMENTS: {
    BASE: "/appointments",
    BY_PATIENT: (patientId) => `/appointments/patient/${patientId}`,
    SCHEDULE: "/appointments/schedule",
  },

  CHAT: {
    BASE: "/chat",
    CONVERSATIONS: "/chat/conversations",
    CONVERSATION_MESSAGES: (conversationId) => `/chat/conversations/${conversationId}/messages`,
    CONVERSATION_USERS: "/chat/conversations/users",
    SEND_MESSAGE: "/chat/messages",
    AVAILABLE_USERS: "/chat/admin-doctors",
  },

  CLINICAL_NOTES: {
    BASE: "/clinical-notes",
    BY_PATIENT: (patientId) => `/clinical-notes/patient/${patientId}`,
    SOAP: "/clinical-notes/soap",
    TEMPLATES: "/clinical-notes/templates",
    SEARCH: "/clinical-notes/search",
  },

  BLOG: {
    BASE: "/blog",
    POSTS: "/blog/posts",
    CATEGORIES: "/blog/categories",
  },
}; 