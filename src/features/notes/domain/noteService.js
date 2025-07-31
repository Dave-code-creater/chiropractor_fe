import {
  useGetClinicalNotesByPatientQuery,
  useGetClinicalNoteQuery,
  useCreateClinicalNoteMutation,
  useUpdateClinicalNoteMutation,
  useDeleteClinicalNoteMutation,
  useCreateSOAPNoteMutation,
  useUpdateSOAPNoteMutation,
  useGetSOAPNotesQuery,
  useGetPatientIncidentsQuery,
  useGetIncidentDetailsQuery,
  useGetDoctorPatientsQuery,
  useGetTreatmentPlanQuery,
  useCreateTreatmentPlanMutation,
  useUpdateTreatmentPlanMutation
} from "@/api/services/clinicalNotes";
import { useMemo } from "react";

// Note type constants
export const NOTE_TYPES = {
  PROGRESS: 'progress_note',
  SOAP: 'soap_note',
  TREATMENT_PLAN: 'treatment_plan',
  INITIAL_ASSESSMENT: 'initial_assessment',
  FOLLOW_UP: 'follow_up'
};

// Role-based permissions
export const NOTE_PERMISSIONS = {
  doctor: {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canView: true,
    allowedTypes: Object.values(NOTE_TYPES)
  },

  patient: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canView: true,
    allowedTypes: Object.values(NOTE_TYPES)
  }
};

// Custom hook for note permissions
export const useNotePermissions = (userRole) => {
  return NOTE_PERMISSIONS[userRole] || NOTE_PERMISSIONS.patient;
};

// Custom hook for managing notes
export const useNoteManagement = (patientId, userRole) => {
  const permissions = useNotePermissions(userRole);

  // Queries
  const {
    data: clinicalNotes = [],
    isLoading: isLoadingNotes
  } = useGetClinicalNotesByPatientQuery(
    patientId,
    { skip: !patientId || !permissions.canView }
  );

  const {
    data: incidents = [],
    isLoading: isLoadingIncidents
  } = useGetPatientIncidentsQuery(
    patientId,
    { skip: !patientId || !permissions.canView }
  );

  // Mutations
  const [createNote] = useCreateClinicalNoteMutation();
  const [updateNote] = useUpdateClinicalNoteMutation();
  const [deleteNote] = useDeleteClinicalNoteMutation();
  const [createSOAP] = useCreateSOAPNoteMutation();
  const [updateSOAP] = useUpdateSOAPNoteMutation();

  // Note operations
  const createNewNote = async (noteData) => {
    if (!permissions.canCreate) {
      throw new Error('User does not have permission to create notes');
    }

    try {
      if (noteData.type === NOTE_TYPES.SOAP) {
        return await createSOAP(noteData).unwrap();
      }
      return await createNote(noteData).unwrap();
    } catch (error) {
      console.error('Failed to create note:', error);
      throw error;
    }
  };

  const updateExistingNote = async (noteId, noteData) => {
    if (!permissions.canEdit) {
      throw new Error('User does not have permission to edit notes');
    }

    try {
      if (noteData.type === NOTE_TYPES.SOAP) {
        return await updateSOAP({ noteId, ...noteData }).unwrap();
      }
      return await updateNote({ noteId, ...noteData }).unwrap();
    } catch (error) {
      console.error('Failed to update note:', error);
      throw error;
    }
  };

  const deleteExistingNote = async (noteId) => {
    if (!permissions.canDelete) {
      throw new Error('User does not have permission to delete notes');
    }

    try {
      return await deleteNote(noteId).unwrap();
    } catch (error) {
      console.error('Failed to delete note:', error);
      throw error;
    }
  };

  // Filter notes based on role permissions
  const filteredNotes = clinicalNotes.filter(note =>
    permissions.allowedTypes.includes(note.type)
  );

  return {
    notes: filteredNotes,
    incidents,
    isLoading: isLoadingNotes || isLoadingIncidents,
    permissions,
    createNote: createNewNote,
    updateNote: updateExistingNote,
    deleteNote: deleteExistingNote
  };
};

// Custom hook for doctor's patient management
export const useDoctorPatientManagement = (doctorId) => {
  const {
    data: patientsData = [],
    isLoading: isLoadingPatients
  } = useGetDoctorPatientsQuery(
    doctorId,
    { skip: !doctorId }
  );

  // Process patients data structure
  const patients = useMemo(() => {
    if (!patientsData) return [];

    // Handle different possible API response structures
    if (Array.isArray(patientsData)) {
      return patientsData;
    }

    if (patientsData.data && Array.isArray(patientsData.data)) {
      return patientsData.data.map(patient => ({
        ...patient,
        id: patient.patient_id || patient.id, // Handle both ID formats
        incidents: patient.recent_incidents || [],
        total_incidents: parseInt(patient.total_incidents || 0),
        active_incidents: parseInt(patient.active_incidents || 0)
      }));
    }

    if (patientsData.patients && Array.isArray(patientsData.patients)) {
      return patientsData.patients;
    }

    return [];
  }, [patientsData]);

  return {
    patients,
    isLoading: isLoadingPatients
  };
};

// Custom hook for doctor's patient management with incidents
export const useDoctorPatientsWithIncidents = (doctorId) => {
  const { patients, isLoading: isLoadingPatients } = useDoctorPatientManagement(doctorId);

  // Since incidents are now included in the patient data from the backend,
  // we don't need to make separate API calls for each patient
  const patientsWithIncidents = useMemo(() => {
    return patients.map(patient => ({
      ...patient,
      incidents: patient.recent_incidents || [],
      incidentsLoading: false
    }));
  }, [patients]);

  return {
    patients: patientsWithIncidents,
    isLoading: isLoadingPatients
  };
};

// Custom hook for incident details
export const useIncidentDetails = (incidentId) => {
  const {
    data: incidentDetails,
    isLoading: isLoadingDetails,
    error: detailsError
  } = useGetIncidentDetailsQuery(
    incidentId,
    { skip: !incidentId }
  );

  return {
    incidentDetails,
    isLoading: isLoadingDetails,
    error: detailsError
  };
};

// Helper functions for note formatting and validation
export const formatNoteDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const validateNoteData = (noteData) => {
  const errors = {};

  if (!noteData.type) errors.type = "Note type is required";
  if (!noteData.content) errors.content = "Note content is required";

  switch (noteData.type) {
    case NOTE_TYPES.SOAP:
      if (!noteData.subjective) errors.subjective = "Subjective section is required";
      if (!noteData.objective) errors.objective = "Objective section is required";
      if (!noteData.assessment) errors.assessment = "Assessment section is required";
      if (!noteData.plan) errors.plan = "Plan section is required";
      break;

    case NOTE_TYPES.TREATMENT_PLAN:
      if (!noteData.diagnosis) errors.diagnosis = "Diagnosis is required";
      if (!noteData.goals) errors.goals = "Treatment goals are required";
      if (!noteData.phases || noteData.phases.length === 0) {
        errors.phases = "At least one treatment phase is required";
      }
      break;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Custom hook for treatment plan management
export const useTreatmentPlanManagement = (incidentId) => {
  // Get existing treatment plan
  const {
    data: treatmentPlan,
    isLoading: isLoadingTreatmentPlan,
    error: treatmentPlanError
  } = useGetTreatmentPlanQuery(incidentId, {
    skip: !incidentId
  });

  // Mutation hooks
  const [createTreatmentPlanMutation, { isLoading: isCreating }] = useCreateTreatmentPlanMutation();
  const [updateTreatmentPlanMutation, { isLoading: isUpdating }] = useUpdateTreatmentPlanMutation();

  // Wrapper functions for cleaner API
  const createTreatmentPlan = async (treatmentData) => {
    try {
      const result = await createTreatmentPlanMutation({
        incidentId,
        ...treatmentData
      }).unwrap();
      return result;
    } catch (error) {
      console.error('Error creating treatment plan:', error);
      throw error;
    }
  };

  const updateTreatmentPlan = async (treatmentData) => {
    try {
      const result = await updateTreatmentPlanMutation({
        incidentId,
        ...treatmentData
      }).unwrap();
      return result;
    } catch (error) {
      console.error('Error updating treatment plan:', error);
      throw error;
    }
  };

  return {
    treatmentPlan,
    isLoading: isLoadingTreatmentPlan,
    error: treatmentPlanError,
    createTreatmentPlan,
    updateTreatmentPlan,
    isCreating,
    isUpdating
  };
};  