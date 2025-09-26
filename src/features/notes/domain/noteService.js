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
  useGetTreatmentPlanQuery,
  useCreateTreatmentPlanMutation,
  useUpdateTreatmentPlanMutation
} from "@/api/services/clinicalNotes";
import { useGetDoctorPatientsQuery } from "@/api/services/doctorApi";
import { extractList } from "@/utils/apiResponse";
import { useMemo } from "react";

export const NOTE_TYPES = {
  PROGRESS: 'progress_note',
  SOAP: 'soap_note',
  TREATMENT_PLAN: 'treatment_plan',
  INITIAL_ASSESSMENT: 'initial_assessment',
  FOLLOW_UP: 'follow_up'
};

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

export const useNotePermissions = (userRole) => {
  return NOTE_PERMISSIONS[userRole] || NOTE_PERMISSIONS.patient;
};

export const useNoteManagement = (patientId, userRole) => {
  const permissions = useNotePermissions(userRole);

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

  const [createNote] = useCreateClinicalNoteMutation();
  const [updateNote] = useUpdateClinicalNoteMutation();
  const [deleteNote] = useDeleteClinicalNoteMutation();
  const [createSOAP] = useCreateSOAPNoteMutation();
  const [updateSOAP] = useUpdateSOAPNoteMutation();

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

export const useDoctorPatientManagement = (doctorId) => {
  const {
    data: patientsData = [],
    isLoading: isLoadingPatients
  } = useGetDoctorPatientsQuery(
    { doctorId, limit: 50 },
    { skip: !doctorId }
  );

  const patients = useMemo(() => {
    let rawPatients = extractList(patientsData, "patients");

    if (!Array.isArray(rawPatients) || rawPatients.length === 0) {
      rawPatients = extractList(patientsData);
    }

    if (!Array.isArray(rawPatients)) {
      return [];
    }

    return rawPatients.map((patient) => ({
      ...patient,
      id: patient.patient_id || patient.id,
      incidents: patient.recent_incidents || [],
      total_incidents: parseInt(patient.total_incidents || 0, 10),
      active_incidents: parseInt(patient.active_incidents || 0, 10),
    }));
  }, [patientsData]);

  return {
    patients,
    isLoading: isLoadingPatients
  };
};

export const useDoctorPatientsWithIncidents = (doctorId) => {
  const { patients, isLoading: isLoadingPatients } = useDoctorPatientManagement(doctorId);

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

export const useTreatmentPlanManagement = (incidentId) => {
  const {
    data: treatmentPlan,
    isLoading: isLoadingTreatmentPlan,
    error: treatmentPlanError
  } = useGetTreatmentPlanQuery(incidentId, {
    skip: !incidentId
  });

  const [createTreatmentPlanMutation, { isLoading: isCreating }] = useCreateTreatmentPlanMutation();
  const [updateTreatmentPlanMutation, { isLoading: isUpdating }] = useUpdateTreatmentPlanMutation();

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
