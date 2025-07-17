/**
 * Utility functions for incident form management and submission
 */

import { useSubmitIncidentFormsMutation } from '@/api/services/reportApi';

/**
 * Helper function to prepare all form data for submission to the backend
 * @param {Object} incident - The incident object
 * @param {Array} forms - Array of form objects from the incident
 * @returns {Object} Formatted data ready for submission
 */
export const prepareFormsForSubmission = (incident, forms) => {
  const formsData = {};
  
  // Organize forms by type
  forms.forEach(form => {
    formsData[form.form_type] = {
      id: form.id,
      form_data: form.form_data,
      is_completed: form.is_completed,
      is_required: form.is_required,
      created_at: form.created_at,
      updated_at: form.updated_at
    };
  });

  return {
    incident_id: incident.id,
    incident_type: incident.incident_type,
    incident_date: incident.incident_date,
    forms_data: formsData,
    submission_timestamp: new Date().toISOString()
  };
};

/**
 * Helper function to determine if an incident is ready for final submission
 * @param {Object} incident - The incident object
 * @param {Array} forms - Array of form objects
 * @param {Array} formConfigs - Configuration for required/optional forms
 * @returns {Object} Submission readiness status
 */
export const checkSubmissionReadiness = (incident, forms, formConfigs) => {
  const requiredForms = formConfigs.filter(config => config.required);
  const completedRequiredForms = requiredForms.filter(config => 
    forms.some(form => form.form_type === config.key && form.is_completed)
  );

  const allFormsCount = formConfigs.length;
  const completedFormsCount = forms.filter(form => form.is_completed).length;
  
  return {
    canSubmit: completedRequiredForms.length === requiredForms.length,
    requiredCompleted: completedRequiredForms.length,
    requiredTotal: requiredForms.length,
    totalCompleted: completedFormsCount,
    totalForms: allFormsCount,
    completionPercentage: Math.round((completedFormsCount / allFormsCount) * 100),
    missingRequired: requiredForms
      .filter(config => !forms.some(form => form.form_type === config.key && form.is_completed))
      .map(config => config.title)
  };
};

/**
 * Custom hook for submitting complete incident forms
 * @returns {Object} Submission function and loading state
 */
export const useIncidentSubmission = () => {
  const [submitIncidentForms, { isLoading, error }] = useSubmitIncidentFormsMutation();

  const submitForFinalProcessing = async (incidentId, incident, forms, options = {}) => {
    try {
      const preparedData = prepareFormsForSubmission(incident, forms);
      
      const result = await submitIncidentForms({
        incidentId,
        allFormsData: preparedData.forms_data,
        processOptions: {
          auto_categorize: true,
          extract_key_data: true,
          generate_summary: true,
          create_clinical_notes: true,
          notify_providers: true,
          ...options
        }
      }).unwrap();

      return {
        success: true,
        data: result,
        message: 'Forms submitted successfully for processing'
      };
    } catch (err) {
      console.error('Incident submission error:', err);
      return {
        success: false,
        error: err,
        message: err.data?.message || 'Failed to submit forms for processing'
      };
    }
  };

  return {
    submitForFinalProcessing,
    isSubmitting: isLoading,
    submissionError: error
  };
};

// Simple form submission helpers for incident forms
// These functions use the new simple endpoints that match the backend routes

import { 
  useSubmitPatientInfoFormMutation,
  useSubmitHealthInsuranceFormMutation,
  useSubmitPainDescriptionFormNewMutation,
  useSubmitPainAssessmentFormNewMutation,
  useSubmitMedicalHistoryFormNewMutation,
  useSubmitLifestyleImpactFormNewMutation
} from '../api/services/reportApi';

// Form type mapping - maps frontend form keys to backend form types
export const FORM_TYPE_MAPPING = {
  patientIntake: 'patient_info',
  insuranceDetails: 'health_insurance',
  painDescriptions: 'pain_description',
  painAssessment: 'pain_assessment',
  healthConditions: 'medical_history',
  workImpact: 'lifestyle_impact',
  // Legacy aliases
  patient_info: 'patient_info',
  health_insurance: 'health_insurance',
  pain_description: 'pain_description',
  pain_assessment: 'pain_assessment',
  medical_history: 'medical_history',
  lifestyle_impact: 'lifestyle_impact'
};

// Hook mapping - maps form types to their corresponding hooks
export const getFormSubmissionHook = (formType) => {
  const backendFormType = FORM_TYPE_MAPPING[formType] || formType;
  
  switch (backendFormType) {
    case 'patient_info':
      return useSubmitPatientInfoFormMutation;
    case 'health_insurance':
      return useSubmitHealthInsuranceFormMutation;
    case 'pain_description':
      return useSubmitPainDescriptionFormNewMutation;
    case 'pain_assessment':
      return useSubmitPainAssessmentFormNewMutation;
    case 'medical_history':
      return useSubmitMedicalHistoryFormNewMutation;
    case 'lifestyle_impact':
      return useSubmitLifestyleImpactFormNewMutation;
    default:
      throw new Error(`Unknown form type: ${formType}`);
  }
};

// Simple form submission function
export const submitIncidentForm = async (formType, incidentId, formData, submitFunction) => {
  const backendFormType = FORM_TYPE_MAPPING[formType] || formType;
  
  console.log(`📤 Submitting ${backendFormType} form:`, {
    formType: backendFormType,
    incidentId,
    endpoint: `POST /incidents/${incidentId}/${getEndpointPath(backendFormType)}`,
    formData
  });

  try {
    const result = await submitFunction({
      incidentId,
      formData: {
        ...formData,
        form_type: backendFormType,
        is_completed: true,
        submitted_at: new Date().toISOString()
      }
    }).unwrap();

    console.log(`✅ ${backendFormType} form submitted successfully:`, result);
    return { success: true, data: result };
  } catch (error) {
    console.error(`❌ Failed to submit ${backendFormType} form:`, error);
    return { success: false, error };
  }
};

// Get endpoint path for form type
const getEndpointPath = (formType) => {
  switch (formType) {
    case 'patient_info':
      return 'patient-info';
    case 'health_insurance':
      return 'health-insurance';
    case 'pain_description':
      return 'pain-description-form';
    case 'pain_assessment':
      return 'pain-assessment-form';
    case 'medical_history':
      return 'medical-history-form';
    case 'lifestyle_impact':
      return 'lifestyle-impact-form';
    default:
      return formType;
  }
};

// Custom hook for simple form submission
export const useSimpleFormSubmission = (formType) => {
  const SubmissionHook = getFormSubmissionHook(formType);
  const [submitForm, { isLoading, error }] = SubmissionHook();

  const handleSubmit = async (incidentId, formData) => {
    return await submitIncidentForm(formType, incidentId, formData, submitForm);
  };

  return [handleSubmit, { isLoading, error }];
};

// Form configuration for the 6 simple forms
export const SIMPLE_FORM_CONFIG = {
  patient_info: {
    title: 'Patient Information',
    endpoint: 'patient-info',
    hook: useSubmitPatientInfoFormMutation,
    required: true
  },
  health_insurance: {
    title: 'Health Insurance',
    endpoint: 'health-insurance',
    hook: useSubmitHealthInsuranceFormMutation,
    required: false
  },
  pain_description: {
    title: 'Pain Description',
    endpoint: 'pain-description-form',
    hook: useSubmitPainDescriptionFormNewMutation,
    required: false
  },
  pain_assessment: {
    title: 'Pain Assessment',
    endpoint: 'pain-assessment-form',
    hook: useSubmitPainAssessmentFormNewMutation,
    required: false
  },
  medical_history: {
    title: 'Medical History',
    endpoint: 'medical-history-form',
    hook: useSubmitMedicalHistoryFormNewMutation,
    required: false
  },
  lifestyle_impact: {
    title: 'Lifestyle Impact',
    endpoint: 'lifestyle-impact-form',
    hook: useSubmitLifestyleImpactFormNewMutation,
    required: false
  }
};

/**
 * Form type mappings for different incident types
 */
export const FORM_TYPE_MAPPINGS = {
  car_accident: {
    patient_info: 'Patient Information',
    accident_details: 'Accident Details', 
    injuries_symptoms: 'Injuries & Symptoms',
    auto_insurance: 'Auto Insurance',
    pain_assessment: 'Pain Assessment',
    work_impact: 'Work Impact'
  },
  general_pain: {
    patient_info: 'Patient Information',
    pain_description: 'Pain Description',
    medical_history: 'Medical History',
    health_insurance: 'Health Insurance',
    pain_assessment: 'Pain Assessment',
    lifestyle_impact: 'Lifestyle Impact'
  },
  work_injury: {
    patient_info: 'Patient Information',
    work_incident_details: 'Work Incident Details',
    injuries_symptoms: 'Injuries & Symptoms',
    workers_comp: 'Workers Compensation',
    work_status_restrictions: 'Work Status & Restrictions',
    pain_assessment: 'Pain Assessment'
  },
  sports_injury: {
    patient_info: 'Patient Information',
    sports_incident_details: 'Sports Incident Details',
    injuries_symptoms: 'Injuries & Symptoms',
    health_insurance: 'Health Insurance',
    activity_impact: 'Activity Impact',
    pain_assessment: 'Pain Assessment'
  }
};

/**
 * Get form configuration for a specific incident type
 * @param {string} incidentType - The type of incident
 * @returns {Array} Array of form configurations
 */
export const getFormConfigForIncidentType = (incidentType) => {
  const mapping = FORM_TYPE_MAPPINGS[incidentType] || FORM_TYPE_MAPPINGS.general_pain;
  
  return Object.entries(mapping).map(([key, title], index) => ({
    key,
    title,
    required: index === 0, // First form (patient_info) is always required
    order: index
  }));
}; 