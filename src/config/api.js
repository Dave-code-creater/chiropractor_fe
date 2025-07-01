// Centralized API Configuration
export const API_CONFIG = {
  BASE_URL: "/api/v1",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

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

// API Response Types
export const API_RESPONSE_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  VALIDATION_ERROR: "validation_error",
  UNAUTHORIZED: "unauthorized",
  NOT_FOUND: "not_found",
};

// Standard API Error Class
export class ApiError extends Error {
  constructor(message, status, code, details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Response Interceptor Helper
export const handleApiResponse = (response) => {
  if (response.success) {
    return response.data;
  } else {
    throw new ApiError(
      response.error?.message || "API request failed",
      response.status || 500,
      response.error?.code || "UNKNOWN_ERROR",
      response.error?.details,
    );
  }
};
