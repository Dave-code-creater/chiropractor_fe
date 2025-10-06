export { API_CONFIG, getBaseUrl } from './config/config';
export { API_ENDPOINTS } from './config/endpoints';
export { API_RESPONSE_TYPES, ApiError, handleApiResponse } from './config/errors';

export { createBaseApi, baseApi, baseQueryWithReauth, CACHE_TIMES, performanceTracker } from './core/baseApi';
export { refreshTokens, startPeriodicTokenCheck, stopPeriodicTokenCheck, setLoggingOut } from './core/tokenManager';

export {
  clinicalNotesApi,
  useGetMyNotesQuery,
  useGetMyRecordsQuery,
  useGetClinicalNoteQuery,
  useGetClinicalNotesByPatientQuery,
  useGetClinicalNoteByAppointmentQuery,
  useCreateOrUpdateNoteForAppointmentMutation,
  useUpdateClinicalNoteMutation,
  useDeleteClinicalNoteMutation,
  useCreateSOAPNoteMutation,
  useUpdateSOAPNoteMutation,
  useGetSOAPNotesQuery,
  useSearchClinicalNotesQuery,
  useGetNoteTemplatesQuery,
  useGetTreatmentPlanQuery,
  useUpdateTreatmentPlanMutation,
  useCreateTreatmentPlanMutation,
  useGetPatientIncidentsQuery,
  useGetDoctorIncidentsQuery,
  useGetIncidentDetailsQuery,
  // useGetDoctorPatientsQuery - removed duplicate, exported from doctorApi
  useGetPatientCaseQuery,
  useGetPatientNotesQuery,
  useCreatePatientNoteMutation,
  useUpdatePatientNoteMutation,
  useDeletePatientNoteMutation,
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

export { doctorApi, useGetDoctorPatientsQuery, useGetPatientDetailsForDoctorQuery, useGetDoctorStatsQuery } from './services/doctorApi';

export { reportApi, useCreateIncidentMutation, useGetIncidentsQuery, useGetIncidentByIdQuery, useSaveIncidentFormMutation, useSubmitPatientInfoFormMutation, useSubmitHealthInsuranceFormMutation, useSubmitPainDescriptionFormNewMutation, useSubmitPainAssessmentFormNewMutation, useSubmitMedicalHistoryFormNewMutation, useSubmitLifestyleImpactFormNewMutation } from './services/reportApi';

export { chatApi, useCreateConversationMutation, useGetConversationUsersQuery, useGetConversationsQuery, useUpdateConversationStatusMutation, useDeleteConversationMutation, useGetMessagesQuery, useSendMessageMutation, usePollForNewMessagesQuery, useGetMessageStatusQuery, useGetAvailableUsersQuery } from './services/chatApi'; 