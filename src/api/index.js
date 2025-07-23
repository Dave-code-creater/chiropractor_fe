// Config exports
export { API_CONFIG, getBaseUrl } from './config/config';
export { API_ENDPOINTS } from './config/endpoints';
export { API_RESPONSE_TYPES, ApiError, handleApiResponse } from './config/errors';

// Core exports
export {
  createBaseApi,
  baseApi,
  baseQueryWithReauth,
  CACHE_TIMES,
  performanceTracker
} from './core/baseApi';
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
  doctorScheduleApi,
  useGetDoctorProfilesQuery,
  useGetAllDoctorsScheduleQuery,
  useGetTimeOffRequestsQuery,
  useCreateTimeOffRequestMutation,
  useUpdateDoctorWorkingHoursMutation,
  useGetDoctorConflictsQuery,
  useGetScheduleStatisticsQuery,
} from './services/doctorScheduleApi';

// Report/Incident API exports
export {
  reportApi,
  useCreateIncidentMutation,
  useGetIncidentsQuery,
  useGetIncidentByIdQuery,
  useSaveIncidentFormMutation,
  // Simple form submission hooks
  useSubmitPatientInfoFormMutation,
  useSubmitHealthInsuranceFormMutation,
  useSubmitPainDescriptionFormNewMutation,
  useSubmitPainAssessmentFormNewMutation,
  useSubmitMedicalHistoryFormNewMutation,
  useSubmitLifestyleImpactFormNewMutation,
} from './services/reportApi';

// Chat API exports
export {
  chatApi,
  useCreateConversationMutation,
  useGetConversationUsersQuery,
  useGetConversationsQuery,
  useUpdateConversationStatusMutation,
  useDeleteConversationMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  usePollForNewMessagesQuery,
  useGetMessageStatusQuery,
  useGetAvailableUsersQuery,
} from './services/chatApi'; 