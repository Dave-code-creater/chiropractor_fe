// Config exports
export { API_CONFIG, getBaseUrl } from './config/config';
export { API_ENDPOINTS } from './config/endpoints';
export { API_RESPONSE_TYPES, ApiError, handleApiResponse } from './config/errors';

// Core exports
export { createBaseApi } from './core/baseApi';
export { 
  refreshTokens, 
  startPeriodicTokenCheck, 
  stopPeriodicTokenCheck,
  setLoggingOut 
} from './core/tokenManager';

// Service exports
export { 
  clinicalNotesApi,
  useGetClinicalNotesQuery,
  useGetClinicalNotesByPatientQuery,
  useGetClinicalNoteQuery,
  useCreateClinicalNoteMutation,
  useUpdateClinicalNoteMutation,
  useDeleteClinicalNoteMutation,
  useCreateSOAPNoteMutation,
  useUpdateSOAPNoteMutation,
  useGetSOAPNotesQuery,
  useSearchClinicalNotesQuery,
  useGetNoteTemplatesQuery,
} from './services/clinicalNotes';

export {
  vitalsApi,
  useGetVitalsQuery,
  useGetVitalsByPatientQuery,
  useGetLatestVitalsQuery,
  useGetVitalQuery,
  useCreateVitalMutation,
  useUpdateVitalMutation,
  useDeleteVitalMutation,
  useGetVitalsTrendsQuery,
  useCreateBulkVitalsMutation,
  useGetVitalsSummaryQuery,
  useGetVitalsReferenceRangesQuery,
} from './services/vitals'; 