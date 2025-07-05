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