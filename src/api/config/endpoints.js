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

  // Reports & Forms
  REPORTS: {
    BASE: "/reports",
    TEMPLATES: "/templates",
    PATIENT_INTAKE: (reportId) => `/reports/${reportId}/patient-intake`,
    INSURANCE_DETAILS: (reportId) => `/reports/${reportId}/insurance-details`,
    PAIN_EVALUATION: (reportId) => `/reports/${reportId}/pain-evaluation`,
    DETAILED_DESCRIPTION: (reportId) =>
      `/reports/${reportId}/detailed-description`,
    WORK_IMPACT: (reportId) => `/reports/${reportId}/work-impact`,
    HEALTH_CONDITIONS: (reportId) => `/reports/${reportId}/health-conditions`,
  },

  // Clinical Notes
  CLINICAL_NOTES: {
    BASE: "/clinical-notes",
    BY_PATIENT: (patientId) => `/clinical-notes/patient/${patientId}`,
    SOAP: "/clinical-notes/soap",
  },

  // Vitals
  VITALS: {
    BASE: "/vitals",
    BY_PATIENT: (patientId) => `/vitals/patient/${patientId}`,
    LATEST: (patientId) => `/vitals/patient/${patientId}/latest`,
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
    MESSAGES: (chatId) => `/chat/${chatId}/messages`,
  },

  // Blog
  BLOG: {
    BASE: "/blog",
    POSTS: "/blog/posts",
    CATEGORIES: "/blog/categories",
  },
}; 