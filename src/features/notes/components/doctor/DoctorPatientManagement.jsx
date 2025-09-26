import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Search,
  User,
  FileText,
  Calendar,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  Car,
  Briefcase,
  Activity,
  Heart,
  FileCheck,
  Plus,
  Trash2,
  Save,
  CalendarPlus,
  Users
} from "lucide-react";

import {
  useDoctorPatientsWithIncidents,
  useIncidentDetails,
  formatNoteDate,
  useTreatmentPlanManagement
} from "../../domain/noteService";


const DoctorPatientManagement = ({ doctorId }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showTreatmentPlan, setShowTreatmentPlan] = useState(false);
  const [treatmentPlan, setTreatmentPlan] = useState({
    diagnosis: "",
    goals: "",
    notes: "",
    phases: [
      {
        id: 1,
        duration: "",
        durationType: "weeks", // weeks, months
        frequency: "",
        frequencyType: "per_week", // per_week, per_month
        description: ""
      }
    ]
  });

  const { patients, isLoading: isLoadingPatients } = useDoctorPatientsWithIncidents(doctorId);

  // Filter patients based on search
  const filteredPatients = useMemo(() => {
    if (!patients) return [];

    return patients.filter(patient => {
      const patientName = `${patient.first_name || ''} ${patient.last_name || ''}`.trim();
      const email = patient.email || '';
      const matchesSearch = patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || patient.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [patients, searchTerm, filterStatus]);

  const activeIncident = selectedIncident || selectedPatient?.recent_incidents?.[0] || null;
  const activeIncidentId = activeIncident?.id;

  const { incidentDetails, isLoading: isLoadingIncident } = useIncidentDetails(selectedIncident?.id);

  // Use treatment plan management hook from domain layer
  const {
    treatmentPlan: existingTreatmentPlan,
    isLoading: isLoadingTreatmentPlan,
    error: treatmentPlanError,
    createTreatmentPlan,
    updateTreatmentPlan,
    isCreating: isCreatingTreatmentPlan,
    isUpdating: isUpdatingTreatmentPlan
  } = useTreatmentPlanManagement(activeIncidentId);

  const hasTreatmentPlan = existingTreatmentPlan && existingTreatmentPlan.data && !treatmentPlanError;
  const isEditingTreatmentPlan = showTreatmentPlan && hasTreatmentPlan;

  // Load existing treatment plan data when editing (moved to top level)
  React.useEffect(() => {
    if (hasTreatmentPlan && showTreatmentPlan && existingTreatmentPlan.data) {
      const planData = existingTreatmentPlan.data;
      setTreatmentPlan({
        diagnosis: planData.diagnosis || "",
        goals: planData.treatment_goals || "",
        notes: planData.additional_notes || "",
        phases: planData.treatment_phases?.map((phase, index) => ({
          id: index + 1,
          duration: phase.duration?.toString() || "",
          durationType: phase.duration_type || "weeks",
          frequency: phase.frequency?.toString() || "",
          frequencyType: phase.frequency_type || "per_week",
          description: phase.description || ""
        })) || [
            {
              id: 1,
              duration: "",
              durationType: "weeks",
              frequency: "",
              frequencyType: "per_week",
              description: ""
            }
          ]
      });
    }
  }, [hasTreatmentPlan, showTreatmentPlan, existingTreatmentPlan]);

  const getIncidentIcon = (incidentType) => {
    switch (incidentType) {
      case 'car_accident':
        return Car;
      case 'work_injury':
        return Briefcase;
      case 'sports_injury':
        return Activity;
      case 'general_pain':
        return Heart;
      default:
        return FileCheck;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIncidentTypeLabel = (type) => {
    const labels = {
      'car_accident': 'Car Accident',
      'work_injury': 'Work Injury',
      'sports_injury': 'Sports Injury',
      'general_pain': 'General Pain'
    };
    return labels[type] || 'Other';
  };

  const addPhase = () => {
    setTreatmentPlan(prev => ({
      ...prev,
      phases: [...prev.phases, {
        id: Date.now(),
        duration: "",
        durationType: "weeks",
        frequency: "",
        frequencyType: "per_week",
        description: ""
      }]
    }));
  };

  const removePhase = (phaseId) => {
    setTreatmentPlan(prev => ({
      ...prev,
      phases: prev.phases.filter(phase => phase.id !== phaseId)
    }));
  };

  const updatePhase = (phaseId, field, value) => {
    setTreatmentPlan(prev => ({
      ...prev,
      phases: prev.phases.map(phase =>
        phase.id === phaseId ? { ...phase, [field]: value } : phase
      )
    }));
  };

  const parseFormData = (form) => {
    if (!form || !form.form_data) return {};
    if (typeof form.form_data === 'string') {
      try {
        return JSON.parse(form.form_data);
      } catch (error) {
        console.error('Failed to parse incident form data:', error);
        return {};
      }
    }
    return form.form_data;
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return phone;
  };

  const formatBooleanValue = (value) => {
    if (value === undefined || value === null || value === '') return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    const normalized = String(value).toLowerCase();
    if (['yes', 'y', 'true'].includes(normalized)) return 'Yes';
    if (['no', 'n', 'false'].includes(normalized)) return 'No';
    return value;
  };

  const formatListValue = (value) => {
    if (!value) return 'N/A';
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'N/A';
    }
    return String(value).trim() || 'N/A';
  };

  const formatEmploymentStatus = (value) => {
    if (!value) return 'Not specified';
    const normalized = String(value).toLowerCase();
    if (normalized === 'yes') return 'Employed';
    if (normalized === 'no') return 'Not working';
    return value;
  };

  const getHighestPainLevel = (levels) => {
    if (!Array.isArray(levels) || levels.length === 0) return 'N/A';
    const parsed = levels
      .map(level => {
        if (typeof level === 'number') return level;
        const parts = String(level).split(':');
        const rating = parts.length > 1 ? parseInt(parts[1], 10) : parseInt(parts[0], 10);
        return Number.isNaN(rating) ? null : rating;
      })
      .filter(value => value !== null);

    if (parsed.length === 0) return 'N/A';
    return Math.max(...parsed).toString();
  };

  const getFieldValue = (data, ...keys) => {
    if (!data) return undefined;
    for (const key of keys) {
      if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
        return data[key];
      }
    }
    return undefined;
  };

  const humanize = (value) => {
    if (!value) return 'Untitled';
    return String(value)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  const renderIncidentDetails = () => {
    if (isLoadingIncident) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading incident details...</p>
        </div>
      );
    }

    if (!incidentDetails) {
      return (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Incident Details Not Found</h3>
          <p className="text-gray-500">
            We could not locate the selected incident. Please return to the patient overview and try again.
          </p>
        </div>
      );
    }

    const forms = Array.isArray(incidentDetails.forms) ? incidentDetails.forms : [];
    const parsedForms = forms.map(form => ({
      ...form,
      form_data: parseFormData(form)
    }));

    const formMap = parsedForms.reduce((acc, form) => {
      acc[form.form_type] = form.form_data || {};
      return acc;
    }, {});

    const patientInfo = formMap.patient_info || {};
    const medicalHistory = formMap.medical_history || {};
    const painAssessment = formMap.pain_assessment || {};
    const painDescription = formMap.pain_description || {};
    const healthInsurance = formMap.health_insurance || {};
    const lifestyleImpact = formMap.lifestyle_impact || {};

    const incidentDateValue = getFieldValue(incidentDetails, 'incident_date') ||
      getFieldValue(healthInsurance, 'accident_date', 'accidentDate') ||
      getFieldValue(patientInfo, 'incident_date', 'incidentDate') ||
      activeIncident?.incident_date;
    const formattedIncidentDate = formatNoteDate(incidentDateValue);

    const incidentTimeValue = (() => {
      const storedTime = getFieldValue(incidentDetails, 'incident_time');
      if (storedTime) return storedTime;
      const time = getFieldValue(healthInsurance, 'accident_time', 'accidentTime');
      const period = getFieldValue(healthInsurance, 'accident_time_period', 'accidentTimePeriod');
      const combined = [time, period].filter(Boolean).join(' ');
      return combined || 'N/A';
    })();

    const incidentLocationValue = getFieldValue(incidentDetails, 'incident_location') ||
      getFieldValue(healthInsurance, 'accident_location', 'accidentLocation') ||
      [getFieldValue(patientInfo, 'city'), getFieldValue(patientInfo, 'state')].filter(Boolean).join(', ') ||
      getFieldValue(patientInfo, 'address') ||
      'N/A';

    const incidentStatus = incidentDetails.status || activeIncident?.status || 'N/A';
    const incidentStatusClass = getStatusColor((incidentStatus || '').toLowerCase());

    const incidentDescriptionValue = getFieldValue(incidentDetails, 'description', 'incident_description') ||
      getFieldValue(painDescription, 'main_complaints', 'symptom_details', 'symptomDetails') ||
      getFieldValue(healthInsurance, 'accident_description', 'accidentDescription') ||
      'N/A';

    const primaryConcern = getFieldValue(painDescription, 'main_complaints', 'symptom_details', 'symptomDetails') ||
      incidentDescriptionValue;

    const fullName = `${getFieldValue(patientInfo, 'first_name', 'firstName') || ''} ${getFieldValue(patientInfo, 'last_name', 'lastName') || ''}`.trim() || 'Unknown Patient';
    const dateOfBirth = getFieldValue(patientInfo, 'date_of_birth', 'dateOfBirth');
    const gender = getFieldValue(patientInfo, 'gender');
    const maritalStatus = getFieldValue(patientInfo, 'marital_status', 'maritalStatus');

    const phoneNumber = formatPhoneNumber(getFieldValue(patientInfo, 'cell_phone', 'home_phone', 'phone', 'phone_number'));
    const addressParts = [
      getFieldValue(patientInfo, 'address'),
      getFieldValue(patientInfo, 'city'),
      getFieldValue(patientInfo, 'state'),
      getFieldValue(patientInfo, 'zip_code', 'zipCode')
    ].filter(Boolean);
    const address = addressParts.length ? addressParts.join(', ') : 'Not provided';

    const emergencyContactName = getFieldValue(patientInfo, 'emergency_contact_name');
    const emergencyContactPhone = formatPhoneNumber(getFieldValue(patientInfo, 'emergency_contact_phone'));
    const emergencyContactRelationship = getFieldValue(patientInfo, 'emergency_contact_relationship');

    const insuranceType = getFieldValue(healthInsurance, 'insurance_type', 'insuranceType') || 'Not provided';
    const accidentDateRaw = getFieldValue(healthInsurance, 'accident_date', 'accidentDate');
    const accidentDateDisplay = accidentDateRaw ? formatNoteDate(accidentDateRaw) : null;
    const accidentTimeDisplay = (() => {
      const time = getFieldValue(healthInsurance, 'accident_time', 'accidentTime');
      const period = getFieldValue(healthInsurance, 'accident_time_period', 'accidentTimePeriod');
      const combined = [time, period].filter(Boolean).join(' ');
      return combined || 'N/A';
    })();
    const accidentLocationDisplay = getFieldValue(healthInsurance, 'accident_location', 'accidentLocation') || incidentLocationValue;
    const accidentDescription = getFieldValue(healthInsurance, 'accident_description', 'accidentDescription');

    const highestPainLevel = getHighestPainLevel(painAssessment.pain_level);
    const painLevelList = formatListValue(painAssessment.pain_level);
    const painTiming = formatListValue(getFieldValue(painAssessment, 'pain_timing', 'painTiming'));
    const painTriggers = formatListValue(getFieldValue(painAssessment, 'pain_triggers', 'painTriggers'));
    const radiatingPain = formatBooleanValue(getFieldValue(painAssessment, 'radiating_pain', 'radiatingPain'));
    const painChanges = formatListValue(getFieldValue(painAssessment, 'pain_changes', 'painChanges'));

    const medications = formatBooleanValue(getFieldValue(medicalHistory, 'medication'));
    const medicationNames = formatListValue(getFieldValue(medicalHistory, 'medication_names', 'medicationNames'));
    const hasCondition = formatBooleanValue(getFieldValue(medicalHistory, 'has_condition', 'hasCondition'));
    const conditionDetails = formatListValue(getFieldValue(medicalHistory, 'condition_details', 'conditionDetails'));
    const hasSurgicalHistory = formatBooleanValue(getFieldValue(medicalHistory, 'has_surgical_history', 'hasSurgicalHistory'));
    const surgicalDetails = formatListValue(getFieldValue(medicalHistory, 'surgical_history_details', 'surgicalHistoryDetails'));
    const employmentStatus = formatEmploymentStatus(getFieldValue(medicalHistory, 'currently_working', 'currentlyWorking'));
    const workType = formatListValue(getFieldValue(medicalHistory, 'work_type', 'workType'));
    const workActivities = formatListValue(getFieldValue(medicalHistory, 'work_activities', 'workActivities'));

    const lifestyleSmoking = formatBooleanValue(getFieldValue(lifestyleImpact, 'smoking'));
    const lifestyleSmokingDetails = formatListValue(getFieldValue(lifestyleImpact, 'smoking_details', 'smokingDetails'));
    const lifestyleDrinking = formatBooleanValue(getFieldValue(lifestyleImpact, 'drinking'));
    const lifestyleDrinkingDetails = formatListValue(getFieldValue(lifestyleImpact, 'drinking_details', 'drinkingDetails'));
    const lifestyleExercise = formatBooleanValue(getFieldValue(lifestyleImpact, 'exercise'));
    const lifestyleExerciseDetails = formatListValue(getFieldValue(lifestyleImpact, 'exercise_details', 'exerciseDetails'));
    const lifestyleSleep = formatListValue(getFieldValue(lifestyleImpact, 'sleep_quality', 'sleepQuality'));

    const reports = incidentDetails.reports && incidentDetails.reports.length > 0
      ? incidentDetails.reports
      : parsedForms.map(form => ({
          id: form.id,
          incident_type: incidentDetails.incident_type,
          title: humanize(form.form_type),
          status: form.is_completed ? 'completed' : 'pending',
          created_at: form.created_at,
          updated_at: form.updated_at
        }));

    const totalReports = incidentDetails.total_reports || reports.length;
    const planData = hasTreatmentPlan ? existingTreatmentPlan.data : incidentDetails.treatment_plan || null;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setSelectedIncident(null)}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Patient
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Calendar className="w-5 h-5" />
              Incident Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Incident Type</p>
                <p className="font-medium">{getIncidentTypeLabel(incidentDetails.incident_type)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Incident Date</p>
                <p className="font-medium">{formattedIncidentDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Incident Time</p>
                <p className="font-medium">{incidentTimeValue}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Incident Location</p>
                <p className="font-medium">{incidentLocationValue}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Incident Status</p>
                <Badge className={incidentStatusClass}>
                  {incidentStatus}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Incident Description</p>
              <p className="font-medium mt-1">{incidentDescriptionValue}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-earthfire-brick-700">
              <User className="w-5 h-5" />
              Patient Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Personal Information</p>
                <div className="mt-2 space-y-1 text-sm text-gray-700">
                  <p className="font-semibold text-gray-900">{fullName}</p>
                  <p>Date of Birth: {formatNoteDate(dateOfBirth)}</p>
                  <p>Gender: {gender || 'N/A'}</p>
                  <p>Marital Status: {maritalStatus || 'N/A'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Contact Information</p>
                <div className="mt-2 space-y-1 text-sm text-gray-700">
                  <p>Phone: {phoneNumber}</p>
                  <p>Address: {address}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Emergency Contact</p>
                <div className="mt-2 space-y-1 text-sm text-gray-700">
                  <p>Name: {emergencyContactName || 'Not provided'}</p>
                  <p>Relationship: {emergencyContactRelationship || 'N/A'}</p>
                  <p>Phone: {emergencyContactPhone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-earthfire-brick-700">
                <AlertCircle className="w-5 h-5" />
                Chief Complaint & Primary Concern
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-800">
                  {primaryConcern || 'Patient reported pain and discomfort requiring assessment.'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-semibold text-gray-800">Incident Type</p>
                  <p>{getIncidentTypeLabel(incidentDetails.incident_type)}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Incident Date</p>
                  <p>{formattedIncidentDate}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Report Status</p>
                  <Badge className={incidentStatusClass}>
                    {incidentStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <FileText className="w-5 h-5" />
                Insurance & Accident Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-semibold text-gray-800">Insurance Type</p>
                  <p>{insuranceType}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Accident Date</p>
                  <p>{accidentDateDisplay || formattedIncidentDate}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Accident Time</p>
                  <p>{accidentTimeDisplay}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Accident Location</p>
                  <p>{accidentLocationDisplay}</p>
                </div>
                {accidentDescription && (
                  <div className="md:col-span-2">
                    <p className="font-semibold text-gray-800">Accident Description</p>
                    <p className="mt-1 text-gray-700">{accidentDescription}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Activity className="w-5 h-5" />
                Medical Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-semibold text-gray-800">Pre-existing Conditions</p>
                  <p>{hasCondition}</p>
                  {conditionDetails !== 'N/A' && (
                    <p className="mt-1 text-gray-700">{conditionDetails}</p>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Current Medications</p>
                  <p>{medications}</p>
                  {medicationNames !== 'N/A' && (
                    <p className="mt-1 text-gray-700">{medicationNames}</p>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Surgical History</p>
                  <p>{hasSurgicalHistory}</p>
                  {surgicalDetails !== 'N/A' && (
                    <p className="mt-1 text-gray-700">{surgicalDetails}</p>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Employment Status</p>
                  <p>{employmentStatus}</p>
                  {workType !== 'N/A' && (
                    <p className="mt-1 text-gray-700">Role: {workType}</p>
                  )}
                  {workActivities !== 'N/A' && (
                    <p className="mt-1 text-gray-700">Activities: {workActivities}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-rose-700">
                <Heart className="w-5 h-5" />
                Pain Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-semibold text-gray-800">Highest Pain Level</p>
                  <p>{highestPainLevel}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Pain Ratings</p>
                  <p>{painLevelList}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Pain Timing</p>
                  <p>{painTiming}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Pain Triggers</p>
                  <p>{painTriggers}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Radiating Pain</p>
                  <p>{radiatingPain}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Changes Over Time</p>
                  <p>{painChanges}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <Users className="w-5 h-5" />
              Lifestyle Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-semibold text-gray-800">Smoking</p>
                <p>{lifestyleSmoking}</p>
                {lifestyleSmokingDetails !== 'N/A' && (
                  <p className="mt-1 text-gray-700">{lifestyleSmokingDetails}</p>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-800">Alcohol</p>
                <p>{lifestyleDrinking}</p>
                {lifestyleDrinkingDetails !== 'N/A' && (
                  <p className="mt-1 text-gray-700">{lifestyleDrinkingDetails}</p>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-800">Exercise</p>
                <p>{lifestyleExercise}</p>
                {lifestyleExerciseDetails !== 'N/A' && (
                  <p className="mt-1 text-gray-700">{lifestyleExerciseDetails}</p>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-800">Sleep Quality</p>
                <p>{lifestyleSleep}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <CheckCircle className="w-5 h-5" />
              Treatment Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {planData ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Diagnosis</p>
                  <p className="font-medium">{planData.diagnosis}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Treatment Goals</p>
                  <p className="font-medium">{planData.treatment_goals}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phases</p>
                  <div className="space-y-2">
                    {planData.treatment_phases?.map((phase, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                        <strong>Phase {index + 1}:</strong> {phase.frequency} visits {phase.frequency_type?.replace('_', ' ')} for {phase.duration} {phase.duration_type}
                        {phase.description && ` - ${phase.description}`}
                      </div>
                    ))}
                  </div>
                </div>
                {planData.additional_notes && (
                  <div>
                    <p className="text-sm text-gray-600">Additional Notes</p>
                    <p className="font-medium">{planData.additional_notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No treatment plan found for this incident.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Initial Reports ({totalReports})</CardTitle>
          </CardHeader>
          <CardContent>
            {reports && reports.length > 0 ? (
              <div className="space-y-3">
                {reports.map(report => {
                  const Icon = getIncidentIcon(report.incident_type || incidentDetails.incident_type);
                  const statusLabel = humanize(report.status || 'pending');
                  return (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{report.title}</p>
                          <p className="text-sm text-gray-600">{formatNoteDate(report.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor((report.status || 'pending').toLowerCase())}>
                          {statusLabel}
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No reports found for this incident.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  if (selectedIncident) {
    return renderIncidentDetails();
  }

  if (selectedPatient) {
    const handleSubmitTreatmentPlan = async () => {
      if (!activeIncidentId) {
        alert("No incident found for this patient. Cannot create treatment plan.");
        return;
      }

      try {
        // Validate required fields
        if (!treatmentPlan.diagnosis || !treatmentPlan.goals || treatmentPlan.phases.length === 0) {
          alert("Please fill in all required fields (diagnosis, goals, and at least one phase)");
          return;
        }

        // Validate all phases have required data
        const invalidPhases = treatmentPlan.phases.filter(phase =>
          !phase.duration || !phase.frequency
        );

        if (invalidPhases.length > 0) {
          alert("Please fill in duration and frequency for all phases");
          return;
        }

        // Prepare API payload
        const apiPayload = {
          patient_id: selectedPatient?.patient_id || selectedPatient?.id,
          doctor_id: doctorId,
          diagnosis: treatmentPlan.diagnosis,
          treatment_goals: treatmentPlan.goals,
          additional_notes: treatmentPlan.notes,
          treatment_phases: treatmentPlan.phases.map(phase => ({
            duration: parseInt(phase.duration),
            duration_type: phase.durationType,
            frequency: parseInt(phase.frequency),
            frequency_type: phase.frequencyType,
            description: phase.description || null
          })),
          created_at: new Date().toISOString(),
          status: "active"
        };

        // Submit to API using domain layer methods
        if (isEditingTreatmentPlan) {
          await updateTreatmentPlan(apiPayload);
          alert("Treatment plan updated successfully!");
        } else {
          await createTreatmentPlan(apiPayload);
          alert("Treatment plan created successfully!");
        }

        setShowTreatmentPlan(false);
        // Reset form
        setTreatmentPlan({
          diagnosis: "",
          goals: "",
          notes: "",
          phases: [
            {
              id: 1,
              duration: "",
              durationType: "weeks",
              frequency: "",
              frequencyType: "per_week",
              description: ""
            }
          ]
        });
      } catch (error) {
        console.error("Error submitting treatment plan:", error);
        alert(`Failed to ${isEditingTreatmentPlan ? 'update' : 'create'} treatment plan. Please try again.`);
      }
    };

    const renderTreatmentPlanStatus = () => {
      if (isLoadingTreatmentPlan) {
        return (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            Checking for existing treatment plan...
          </div>
        );
      }

      if (hasTreatmentPlan) {
        const planData = existingTreatmentPlan.data;
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-earthfire-brick-700">
                <CheckCircle className="w-5 h-5" />
                Existing Treatment Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Diagnosis</p>
                  <p className="font-medium">{planData?.diagnosis || 'No diagnosis specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Treatment Goals</p>
                  <p className="font-medium">{planData?.treatment_goals || 'No treatment goals specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phases</p>
                  <div className="space-y-2">
                    {planData.treatment_phases?.map((phase, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                        <strong>Phase {index + 1}:</strong> {phase.frequency} visits {phase.frequency_type?.replace('_', ' ')} for {phase.duration} {phase.duration_type}
                        {phase.description && ` - ${phase.description}`}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => setShowTreatmentPlan(true)}
                    variant="outline"
                    size="sm"
                  >
                    Edit Treatment Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }

      return null;
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setSelectedPatient(null)}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Patients
          </Button>

        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">

          {!activeIncidentId && (
            <div className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              No recent incident found. Treatment plan requires an incident.
            </div>
          )}
        </div>

        {/* Treatment Plan Status */}
        {renderTreatmentPlanStatus()}

        {/* Treatment Plan Form */}
        {showTreatmentPlan && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarPlus className="w-5 h-5" />
                {isEditingTreatmentPlan ? 'Edit Treatment Plan' : 'Create Treatment Plan'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Input
                    id="diagnosis"
                    placeholder="Enter diagnosis..."
                    value={treatmentPlan.diagnosis}
                    onChange={(e) => setTreatmentPlan(prev => ({ ...prev, diagnosis: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="goals">Treatment Goals</Label>
                  <Input
                    id="goals"
                    placeholder="Enter treatment goals..."
                    value={treatmentPlan.goals}
                    onChange={(e) => setTreatmentPlan(prev => ({ ...prev, goals: e.target.value }))}
                  />
                </div>
              </div>

              {/* Treatment Phases */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Treatment Phases</h3>
                  <Button onClick={addPhase} size="sm" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Phase
                  </Button>
                </div>

                <div className="space-y-4">
                  {treatmentPlan.phases.map((phase, index) => (
                    <Card key={phase.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Phase {index + 1}</h4>
                          {treatmentPlan.phases.length > 1 && (
                            <Button
                              onClick={() => removePhase(phase.id)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div>
                            <Label>Duration</Label>
                            <Input
                              type="number"
                              placeholder="e.g., 4"
                              value={phase.duration}
                              onChange={(e) => updatePhase(phase.id, 'duration', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Duration Type</Label>
                            <Select
                              value={phase.durationType}
                              onValueChange={(value) => updatePhase(phase.id, 'durationType', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="weeks">Weeks</SelectItem>
                                <SelectItem value="months">Months</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Frequency</Label>
                            <Input
                              type="number"
                              placeholder="e.g., 3"
                              value={phase.frequency}
                              onChange={(e) => updatePhase(phase.id, 'frequency', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Frequency Type</Label>
                            <Select
                              value={phase.frequencyType}
                              onValueChange={(value) => updatePhase(phase.id, 'frequencyType', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="per_week">Per Week</SelectItem>
                                <SelectItem value="per_month">Per Month</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="mt-3">
                          <Label>Description (Optional)</Label>
                          <Input
                            placeholder="e.g., Focus on pain reduction and mobility"
                            value={phase.description}
                            onChange={(e) => updatePhase(phase.id, 'description', e.target.value)}
                          />
                        </div>

                        {/* Phase Summary */}
                        {phase.duration && phase.frequency && (
                          <div className="mt-3 p-3 bg-earthfire-clay-50 rounded-lg">
                            <p className="text-sm text-earthfire-brick-700">
                              <strong>Summary:</strong> {phase.frequency} visits {phase.frequencyType.replace('_', ' ')} for {phase.duration} {phase.durationType}
                              {phase.description && ` - ${phase.description}`}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter any additional notes about the treatment plan..."
                  value={treatmentPlan.notes}
                  onChange={(e) => setTreatmentPlan(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSubmitTreatmentPlan}
                  className="flex items-center gap-2"
                  disabled={isCreating || isUpdating}
                >
                  <Save className="w-4 h-4" />
                  {isCreating || isUpdating
                    ? (isEditingTreatmentPlan ? 'Updating...' : 'Creating...')
                    : (isEditingTreatmentPlan ? 'Update Treatment Plan' : 'Save Treatment Plan')
                  }
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowTreatmentPlan(false)}
                  disabled={isCreating || isUpdating}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Incidents ({selectedPatient.total_incidents || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPatient.recent_incidents && selectedPatient.recent_incidents.length > 0 ? (
              <div className="space-y-3">
                {selectedPatient.recent_incidents.map(incident => {
                  const Icon = getIncidentIcon(incident.incident_type);
                  return (
                    <div
                      key={incident.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedIncident(incident)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{incident.title}</p>
                          <p className="text-sm text-gray-600">{formatNoteDate(incident.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(incident.status)}>
                          {incident.status}
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No reports found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">My Patients</h2>
        <p className="text-gray-600">View and manage your patients</p>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Patient List */}
      <Card>
        <CardHeader>
          <CardTitle>Patients ({filteredPatients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingPatients ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading patients...</p>
            </div>
          ) : filteredPatients.length > 0 ? (
            <div className="space-y-3">
              {filteredPatients.map(patient => (
                <div
                  key={patient.patient_id || patient.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={patient.avatar} />
                      <AvatarFallback>
                        {patient.first_name?.charAt(0).toUpperCase() || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {`${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'Unknown Patient'}
                      </p>
                      <p className="text-sm text-gray-600">{patient.email || 'No email'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">{patient.total_incidents || 0} reports</p>
                      <p className="text-xs text-gray-500">
                        {patient.last_incident_date ? formatNoteDate(patient.last_incident_date) : 'No reports'}
                      </p>
                    </div>
                    <Badge className={getStatusColor(patient.status)}>
                      {patient.status}
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Patients Found</h3>
              <p className="text-gray-500">
                {searchTerm ? "No patients match your search" : "You don't have any patients yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorPatientManagement;
