import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  FileText,
  Calendar,
  Clock,
  User,
  Stethoscope,
  Edit,
  Save,
  X,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  ClipboardCheck,
  Activity,
  Target,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Car,
  Briefcase,
  Heart,
  Eye,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import {
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
  useGetIncidentsQuery,
  useGetIncidentByIdQuery,
} from "@/api";

// Mock patient data for doctor view
const mockPatients = [
  {
    id: "pt-001",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    dateOfBirth: "1985-03-15",
    age: 39,
    gender: "Female",
    address: "123 Main St, City, State 12345",
    lastVisit: "2024-01-15",
    nextAppointment: "2024-01-22",
    status: "active",
    primaryCondition: "Lower Back Pain",
    secondaryConditions: ["Muscle Spasm", "Poor Posture"],
    insurance: "Blue Cross Blue Shield",
    emergencyContact: "John Johnson - (555) 987-6543",
    totalVisits: 8,
    medicalHistory: {
      allergies: "None known",
      medications: "Ibuprofen 200mg as needed",
      previousSurgeries: "None",
      chronicConditions: "None",
    },
    vitals: {
      height: "5'6\"",
      weight: "140 lbs",
      bloodPressure: "120/80",
      lastUpdated: "2024-01-15",
    },
  },
  // ... other mock patients
];

// Initial Report Display Component
const InitialReportDisplay = ({ incident: basicIncident }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Fetch detailed incident data when expanded
  const { 
    data: detailedIncidentData,
    isLoading: isLoadingDetails,
    error: detailsError
  } = useGetIncidentByIdQuery(basicIncident?.id, { 
    skip: !basicIncident?.id || !expanded 
  });

  if (!basicIncident) return null;

  // Use detailed data if available, otherwise use basic data
  const incident = detailedIncidentData?.data || basicIncident;

  const forms = incident.forms || [];
  const getFormData = (formType) => {
    const form = forms.find(f => f.form_type === formType);
    return form?.form_data || {};
  };

  const patientInfo = getFormData('patient_info');
  const medicalHistory = getFormData('medical_history');
  const painAssessment = getFormData('pain_assessment');
  const painDescription = getFormData('pain_description');
  const healthInsurance = getFormData('health_insurance');
  const lifestyleImpact = getFormData('lifestyle_impact');

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

  const Icon = getIncidentIcon(incident.incident_type);

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Initial Report</h3>
              <p className="text-sm text-muted-foreground">
                {incident.patient_name && `${incident.patient_name} • `}
                {formatDate(incident.incident_date)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {incident.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-800">
              {incident.incident_type?.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge variant="outline" className="bg-green-100 text-green-800">
              {incident.status?.toUpperCase()}
            </Badge>
            {incident.forms && incident.forms.length > 0 && (
              <Badge variant="secondary">
                {incident.completed_forms || incident.forms.length} forms
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronRight className="w-4 h-4 mr-1" />
                  View Details ({forms.length} forms)
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent>
          {isLoadingDetails && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">Loading detailed report...</p>
            </div>
          )}
          
          {detailsError && (
            <div className="text-center py-8">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <p className="text-sm text-red-600">Failed to load detailed report</p>
            </div>
          )}

          {!isLoadingDetails && !detailsError && (
            <Tabs defaultValue="patient-info" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              {patientInfo && Object.keys(patientInfo).length > 0 && (
                <TabsTrigger value="patient-info">Patient Info</TabsTrigger>
              )}
              {medicalHistory && Object.keys(medicalHistory).length > 0 && (
                <TabsTrigger value="medical-history">Medical History</TabsTrigger>
              )}
              {(painAssessment && Object.keys(painAssessment).length > 0) && (
                <TabsTrigger value="pain-assessment">Pain Assessment</TabsTrigger>
              )}
              {painDescription && Object.keys(painDescription).length > 0 && (
                <TabsTrigger value="pain-description">Pain Description</TabsTrigger>
              )}
              {healthInsurance && Object.keys(healthInsurance).length > 0 && (
                <TabsTrigger value="insurance">Insurance</TabsTrigger>
              )}
              {lifestyleImpact && Object.keys(lifestyleImpact).length > 0 && (
                <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
              )}
            </TabsList>

            {/* Patient Information Tab */}
            {patientInfo && Object.keys(patientInfo).length > 0 && (
              <TabsContent value="patient-info" className="space-y-4">
                <h4 className="font-semibold text-primary flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Patient Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  {patientInfo.first_name && (
                    <div>
                      <strong>Name:</strong> {patientInfo.first_name} {patientInfo.middle_name} {patientInfo.last_name}
                    </div>
                  )}
                  {patientInfo.date_of_birth && (
                    <div>
                      <strong>Date of Birth:</strong> {formatDate(patientInfo.date_of_birth)}
                    </div>
                  )}
                  {patientInfo.gender && (
                    <div>
                      <strong>Gender:</strong> {patientInfo.gender}
                    </div>
                  )}
                  {patientInfo.marital_status && (
                    <div>
                      <strong>Marital Status:</strong> {patientInfo.marital_status}
                    </div>
                  )}
                  {patientInfo.home_phone && (
                    <div>
                      <strong>Phone:</strong> {patientInfo.home_phone}
                    </div>
                  )}
                  {patientInfo.cell_phone && (
                    <div>
                      <strong>Cell:</strong> {patientInfo.cell_phone}
                    </div>
                  )}
                  {patientInfo.address && (
                    <div className="md:col-span-2">
                      <strong>Address:</strong> {patientInfo.address}, {patientInfo.city}, {patientInfo.state} {patientInfo.zip_code}
                    </div>
                  )}
                  {patientInfo.emergency_contact_name && (
                    <div className="md:col-span-2">
                      <strong>Emergency Contact:</strong> {patientInfo.emergency_contact_name} ({patientInfo.emergency_contact_relationship}) - {patientInfo.emergency_contact_phone}
                    </div>
                  )}
                </div>
              </TabsContent>
            )}

            {/* Medical History Tab */}
            {medicalHistory && Object.keys(medicalHistory).length > 0 && (
              <TabsContent value="medical-history" className="space-y-4">
                <h4 className="font-semibold text-primary flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Medical History
                </h4>
                <div className="space-y-3 text-sm">
                  {medicalHistory.hasCondition && (
                    <div>
                      <strong>Pre-existing Conditions:</strong> {medicalHistory.hasCondition === 'yes' ? 'Yes' : 'No'}
                      {medicalHistory.conditionDetails && (
                        <div className="mt-1 p-2 bg-muted/50 rounded">
                          {medicalHistory.conditionDetails}
                        </div>
                      )}
                    </div>
                  )}
                  {medicalHistory.hasSurgicalHistory && (
                    <div>
                      <strong>Surgical History:</strong> {medicalHistory.hasSurgicalHistory === 'yes' ? 'Yes' : 'No'}
                      {medicalHistory.surgicalHistoryDetails && (
                        <div className="mt-1 p-2 bg-muted/50 rounded">
                          {medicalHistory.surgicalHistoryDetails}
                        </div>
                      )}
                    </div>
                  )}
                  {medicalHistory.medication && (
                    <div>
                      <strong>Current Medications:</strong> {medicalHistory.medication === 'yes' ? 'Yes' : 'No'}
                      {medicalHistory.medicationNames && (
                        <div className="mt-1 p-2 bg-muted/50 rounded">
                          {medicalHistory.medicationNames}
                        </div>
                      )}
                    </div>
                  )}
                  {medicalHistory.currentlyWorking && (
                    <div>
                      <strong>Employment Status:</strong> {medicalHistory.currentlyWorking === 'yes' ? 'Currently Working' : 'Not Working'}
                      {medicalHistory.jobDescription && (
                        <div className="mt-1 p-2 bg-muted/50 rounded">
                          <strong>Job:</strong> {medicalHistory.jobDescription} <br />
                          <strong>Hours:</strong> {medicalHistory.workHoursPerDay} hrs/day, {medicalHistory.workDaysPerWeek} days/week
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            )}

            {/* Pain Assessment Tab */}
            {painAssessment && Object.keys(painAssessment).length > 0 && (
              <TabsContent value="pain-assessment" className="space-y-4">
                <h4 className="font-semibold text-primary flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Pain Assessment
                </h4>
                <div className="space-y-3 text-sm">
                  {painAssessment.painType && Array.isArray(painAssessment.painType) && painAssessment.painType.length > 0 && (
                    <div>
                      <strong>Pain Type:</strong> {painAssessment.painType.join(', ')}
                    </div>
                  )}
                  {painAssessment.painLevel && Array.isArray(painAssessment.painLevel) && painAssessment.painLevel.length > 0 && (
                    <div>
                      <strong>Pain Level:</strong> {painAssessment.painLevel.join(', ')}
                    </div>
                  )}
                  {painAssessment.painTiming && (
                    <div>
                      <strong>Pain Timing:</strong> {painAssessment.painTiming}
                    </div>
                  )}
                  {painAssessment.painChanges && (
                    <div>
                      <strong>Pain Changes:</strong> {painAssessment.painChanges}
                    </div>
                  )}
                  {painAssessment.painTriggers && Array.isArray(painAssessment.painTriggers) && painAssessment.painTriggers.length > 0 && (
                    <div>
                      <strong>Pain Triggers:</strong> {painAssessment.painTriggers.join(', ')}
                    </div>
                  )}
                  {painAssessment.radiatingPain && (
                    <div>
                      <strong>Radiating Pain:</strong> {painAssessment.radiatingPain === 'yes' ? 'Yes' : 'No'}
                    </div>
                  )}
                  {painAssessment.painMap && Object.keys(painAssessment.painMap).length > 0 && (
                    <div>
                      <strong>Pain Map:</strong>
                      <div className="mt-1 space-y-3">
                        {Object.entries(painAssessment.painMap).map(([area, data]) => (
                          <div key={area} className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{area.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                              <Badge variant="outline">Level {data['pain-level'] || data.level}/10</Badge>
                            </div>
                            {data['pain-types'] && Array.isArray(data['pain-types']) && (
                              <div className="text-sm mb-1">
                                <strong>Types:</strong> {data['pain-types'].join(', ')}
                              </div>
                            )}
                            {data['pain-timing'] && (
                              <div className="text-sm mb-1">
                                <strong>Timing:</strong> {data['pain-timing']}
                              </div>
                            )}
                            {data['pain-changes'] && (
                              <div className="text-sm mb-1">
                                <strong>Changes:</strong> {data['pain-changes']}
                              </div>
                            )}
                            {data['painTriggers'] && Array.isArray(data['painTriggers']) && (
                              <div className="text-sm mb-1">
                                <strong>Triggers:</strong> {data['painTriggers'].join(', ')}
                              </div>
                            )}
                            {data['pain-severity'] && Array.isArray(data['pain-severity']) && (
                              <div className="text-sm mb-1">
                                <strong>Severity:</strong> {data['pain-severity'].join(', ')}
                              </div>
                            )}
                            {data['radiating-pain'] && (
                              <div className="text-sm">
                                <strong>Radiating:</strong> {data['radiating-pain']}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}

            {/* Pain Description Tab */}
            {painDescription && Object.keys(painDescription).length > 0 && (
              <TabsContent value="pain-description" className="space-y-4">
                <h4 className="font-semibold text-primary flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Pain Description
                </h4>
                <div className="space-y-3 text-sm">
                  {painDescription.symptomDetails && (
                    <div>
                      <strong>Symptom Details:</strong>
                      <div className="mt-1 p-2 bg-muted/50 rounded">
                        {painDescription.symptomDetails}
                      </div>
                    </div>
                  )}
                  {painDescription.mainComplaints && (
                    <div>
                      <strong>Main Complaints:</strong>
                      <div className="mt-1 p-2 bg-muted/50 rounded">
                        {painDescription.mainComplaints}
                      </div>
                    </div>
                  )}
                  {painDescription.previousHealthcare && (
                    <div>
                      <strong>Previous Healthcare:</strong>
                      <div className="mt-1 p-2 bg-muted/50 rounded">
                        {painDescription.previousHealthcare}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}

            {/* Insurance Tab */}
            {healthInsurance && Object.keys(healthInsurance).length > 0 && (
              <TabsContent value="insurance" className="space-y-4">
                <h4 className="font-semibold text-primary flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4" />
                  Insurance & Accident Details
                </h4>
                <div className="space-y-3 text-sm">
                  {healthInsurance.insuranceType && (
                    <div>
                      <strong>Insurance Type:</strong> {healthInsurance.insuranceType}
                    </div>
                  )}
                  {healthInsurance.covered && (
                    <div>
                      <strong>Covered:</strong> {healthInsurance.covered === 'yes' ? 'Yes' : 'No'}
                    </div>
                  )}
                  {healthInsurance.accidentDate && (
                    <div>
                      <strong>Accident Date:</strong> {formatDate(healthInsurance.accidentDate)}
                    </div>
                  )}
                  {healthInsurance.accidentDescription && (
                    <div>
                      <strong>Accident Description:</strong>
                      <div className="mt-1 p-2 bg-muted/50 rounded">
                        {healthInsurance.accidentDescription}
                      </div>
                    </div>
                  )}
                  {healthInsurance.lostWorkYesNo && (
                    <div>
                      <strong>Lost Work:</strong> {healthInsurance.lostWorkYesNo === 'yes' ? 'Yes' : 'No'}
                      {healthInsurance.lostWorkDates && (
                        <div className="mt-1">
                          <strong>Dates:</strong> {healthInsurance.lostWorkDates}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            )}

            {/* Lifestyle Tab */}
            {lifestyleImpact && Object.keys(lifestyleImpact).length > 0 && (
              <TabsContent value="lifestyle" className="space-y-4">
                <h4 className="font-semibold text-primary flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Lifestyle Impact
                </h4>
                <div className="space-y-3 text-sm">
                  {lifestyleImpact.workType && (
                    <div>
                      <strong>Work Type:</strong> {lifestyleImpact.workType}
                    </div>
                  )}
                  {lifestyleImpact.workStress && (
                    <div>
                      <strong>Work Stress Level:</strong> {lifestyleImpact.workStress}
                    </div>
                  )}
                  {lifestyleImpact.smoking && (
                    <div>
                      <strong>Smoking:</strong> {lifestyleImpact.smoking}
                      {lifestyleImpact.smokingDetails && (
                        <div className="mt-1 text-muted-foreground">
                          {lifestyleImpact.smokingDetails}
                        </div>
                      )}
                    </div>
                  )}
                  {lifestyleImpact.drinking && (
                    <div>
                      <strong>Drinking:</strong> {lifestyleImpact.drinking}
                      {lifestyleImpact.drinkingDetails && (
                        <div className="mt-1 text-muted-foreground">
                          {lifestyleImpact.drinkingDetails}
                        </div>
                      )}
                    </div>
                  )}
                  {lifestyleImpact.exercise && (
                    <div>
                      <strong>Exercise:</strong> {lifestyleImpact.exercise}
                      {lifestyleImpact.exerciseDetails && (
                        <div className="mt-1 text-muted-foreground">
                          {lifestyleImpact.exerciseDetails}
                        </div>
                      )}
                    </div>
                  )}
                  {lifestyleImpact.sleepQuality && (
                    <div>
                      <strong>Sleep Quality:</strong> {lifestyleImpact.sleepQuality}
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
          )}
        </CardContent>
      )}
    </Card>
  );
};

// Patient Notes Component for patient view
const PatientNotesView = ({ userRole, userId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [expandedCases, setExpandedCases] = useState({});

  // Fetch user's incidents (initial reports)
  const { 
    data: userIncidents, 
    isLoading: isLoadingIncidents 
  } = useGetIncidentsQuery(userId, { skip: !userId });

  // Get all notes from all cases (currently empty - will be populated from clinical notes API)
  const allNotes = useMemo(() => {
    // This will be populated when we integrate with clinical notes API
    return [];
  }, []);

  // Process incidents data
  const incidents = useMemo(() => {
    if (!userIncidents?.data) return [];
    return Array.isArray(userIncidents.data) ? userIncidents.data : [];
  }, [userIncidents]);

  const filteredCases = useMemo(() => {
    // Currently empty - will be populated when we integrate with clinical cases API
    return [];
  }, [searchTerm, filterType, filterStatus]);

  const filteredNotes = useMemo(() => {
    let filtered = allNotes;

    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.assessment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.caseTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter(note => note.type.toLowerCase().includes(filterType.toLowerCase()));
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(note => note.caseStatus === filterStatus);
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [allNotes, searchTerm, filterType, filterStatus]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'initial assessment':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'progress note':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'treatment plan':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'routine':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

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
        return ClipboardCheck;
    }
  };

  const toggleCaseExpansion = (caseId) => {
    setExpandedCases(prev => ({
      ...prev,
      [caseId]: !prev[caseId]
    }));
  };

  // If viewing a specific note
  if (selectedNote) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setSelectedNote(null)}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Notes
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">
                {selectedNote.type}
              </h1>
              <p className="text-muted-foreground mt-1">
                {formatDate(selectedNote.date)} • {selectedNote.doctorName} • {selectedNote.caseTitle}
              </p>
            </div>
          </div>

          {/* Note Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5" />
                  Visit Details
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(selectedNote.type)}>
                    {selectedNote.type}
                  </Badge>
                  <Badge className={getPriorityColor(selectedNote.priority)}>
                    {selectedNote.priority}
                  </Badge>
                  <Badge className={getStatusColor(selectedNote.caseStatus)}>
                    {selectedNote.caseStatus}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Case:</strong> {selectedNote.caseTitle}
                </div>
                <div>
                  <strong>Doctor:</strong> {selectedNote.doctorName}
                </div>
                <div>
                  <strong>Specialty:</strong> {selectedNote.specialty}
                </div>
                <div>
                  <strong>Visit Type:</strong> {selectedNote.visitType}
                </div>
                <div>
                  <strong>Duration:</strong> {selectedNote.duration}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Chief Complaint
                  </h4>
                  <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {selectedNote.chiefComplaint}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" />
                    Assessment
                  </h4>
                  <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {selectedNote.assessment}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Treatment Provided
                  </h4>
                  <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {selectedNote.treatment}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Treatment Plan
                  </h4>
                  <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {selectedNote.plan}
                  </p>
                </div>

                {selectedNote.recommendations && selectedNote.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {selectedNote.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedNote.treatmentGoals && selectedNote.treatmentGoals.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Treatment Goals
                    </h4>
                    <ul className="space-y-2">
                      {selectedNote.treatmentGoals.map((goal, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedNote.nextAppointment && (
                  <div>
                    <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Next Appointment
                    </h4>
                    <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      {formatDate(selectedNote.nextAppointment)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Doctor Notes & Treatment Plans
            </h1>
            <p className="text-muted-foreground mt-1">
              View your medical notes and treatment plans organized by cases
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-64 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search cases, notes, doctors, or conditions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Notes</SelectItem>
                  <SelectItem value="initial">Initial Assessment</SelectItem>
                  <SelectItem value="progress">Progress Notes</SelectItem>
                  <SelectItem value="treatment">Treatment Plans</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cases</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Cases Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-100">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{incidents.length}</p>
                  <p className="text-sm text-muted-foreground">Initial Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-green-100">
                  <Activity className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Active Cases</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-100">
                  <ClipboardCheck className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{allNotes.length}</p>
                  <p className="text-sm text-muted-foreground">Total Notes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-orange-100">
                  <Calendar className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Upcoming Appointments</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Initial Reports Section */}
        {incidents && incidents.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">My Initial Reports</h2>
            {incidents.map((incident) => (
              <InitialReportDisplay key={incident.id} incident={incident} />
            ))}
          </div>
        )}

        {/* Loading state for incidents */}
        {isLoadingIncidents && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-muted-foreground">
                Loading Initial Reports...
              </h3>
            </CardContent>
          </Card>
        )}

        {/* Empty state for initial reports */}
        {!isLoadingIncidents && incidents.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">
                No Initial Reports Found
              </h3>
              <p className="text-sm text-muted-foreground">
                Your initial patient reports will appear here after you submit the patient information forms.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Cases List */}
        {filteredCases.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">My Treatment Cases</h2>
            {filteredCases.map((patientCase) => {
              const Icon = getIncidentIcon(patientCase.incidentType);
              const isExpanded = expandedCases[patientCase.id];
              
              return (
                <Card key={patientCase.id} className="border-l-4 border-l-primary/30">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{patientCase.title}</h3>
                            <Badge className={getStatusColor(patientCase.status)}>
                              {patientCase.status}
                            </Badge>
                            <Badge className={getPriorityColor(patientCase.priority)}>
                              {patientCase.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {patientCase.description}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <strong>Primary Condition:</strong> {patientCase.primaryCondition}
                            </div>
                            <div>
                              <strong>Doctor:</strong> {patientCase.doctorName}
                            </div>
                            <div>
                              <strong>Started:</strong> {formatDate(patientCase.startDate)}
                            </div>
                            <div>
                              <strong>Duration:</strong> {patientCase.estimatedDuration}
                            </div>
                          </div>
                          {patientCase.progress && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>Treatment Progress</span>
                                <span>{patientCase.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                                  style={{ width: `${patientCase.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCaseExpansion(patientCase.id)}
                        className="flex items-center gap-2"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            Hide Notes
                          </>
                        ) : (
                          <>
                            <ChevronRight className="w-4 h-4" />
                            View Notes ({patientCase.notes.length})
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {patientCase.notes.map((note) => (
                          <Card
                            key={note.id}
                            className="hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary"
                            onClick={() => setSelectedNote({...note, caseTitle: patientCase.title, caseStatus: patientCase.status, casePriority: patientCase.priority})}
                          >
                            <CardContent className="pt-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-medium">{note.type}</h4>
                                    <Badge className={getTypeColor(note.type)} variant="secondary">
                                      {note.type}
                                    </Badge>
                                    {note.priority && (
                                      <Badge className={getPriorityColor(note.priority)} variant="outline">
                                        {note.priority}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      {formatDate(note.date)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Stethoscope className="w-4 h-4" />
                                      {note.doctorName}
                                    </span>
                                    {note.duration && (
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {note.duration}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {note.chiefComplaint}
                                  </p>
                                </div>
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <ClipboardCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">
                No Treatment Cases Found
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || filterType !== "all" || filterStatus !== "all"
                  ? "No cases match your search criteria"
                  : "Your treatment cases and doctor notes will appear here after your appointments"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default function Notes() {
  const user = useSelector((state) => state?.auth);
  const userRole = user?.role || 'patient';
  const userId = user?.userID;

  // If user is a patient, show patient notes view
  if (userRole === 'patient') {
    return <PatientNotesView userRole={userRole} userId={userId} />;
  }

  // Original doctor/staff view code continues here...
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState({
    type: "Progress Note",
    chiefComplaint: "",
    assessment: "",
    treatment: "",
    plan: "",
    duration: "30 minutes",
  });

  // RTK Query hooks
  const {
    data: clinicalNotes,
    isLoading,
    error,
    refetch,
  } = useGetClinicalNotesByPatientQuery(
    selectedPatient?.id,
    { skip: !selectedPatient }
  );

  const [createClinicalNote, { isLoading: isCreating }] = useCreateClinicalNoteMutation();

  // Filter patients based on search and status
  const filteredPatients = useMemo(() => {
    let filtered = mockPatients;

    if (searchTerm) {
      filtered = filtered.filter(
        (patient) =>
          patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.primaryCondition.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((patient) => patient.status === statusFilter);
    }

    return filtered;
  }, [searchTerm, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleAddNote = async () => {
    try {
      const noteData = {
        patient_id: selectedPatient.id,
        type: newNote.type,
        chiefComplaint: newNote.chiefComplaint,
        assessment: newNote.assessment,
        treatment: newNote.treatment,
        plan: newNote.plan,
        duration: newNote.duration,
        doctor_id: "dr-001", // This should come from auth state
        doctorName: "Dr. Dieu Phan", // This should come from auth state
        status: "completed",
      };

      // Make API call to create clinical note
      await createClinicalNote(noteData).unwrap();
      
      toast.success("Clinical note added successfully!");
      
      // Reset form
      setNewNote({
        type: "Progress Note",
        chiefComplaint: "",
        assessment: "",
        treatment: "",
        plan: "",
        duration: "30 minutes",
      });
      setIsAddingNote(false);
      
    } catch (error) {
      console.error("Failed to add clinical note:", error);
      toast.error("Failed to add clinical note. Please try again.");
    }
  };

  // Rest of the original doctor view code...
  if (selectedPatient) {
    const patientNotes = clinicalNotes || [];

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setSelectedPatient(null)}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Patients
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">
                Patient Case: {selectedPatient.firstName}{" "}
                {selectedPatient.lastName}
              </h1>
              <p className="text-muted-foreground mt-1">
                Clinical notes and treatment documentation
              </p>
            </div>
            <Button
              onClick={() => setIsAddingNote(true)}
              className="bg-primary hover:bg-primary/90"
              disabled={isCreating}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isCreating ? "Adding..." : "Add Clinical Note"}
            </Button>
          </div>

          {/* Rest of the original doctor view JSX... */}
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">
              Doctor View Under Development
            </h3>
            <p className="text-sm text-muted-foreground">
              Clinical notes management for healthcare providers will be available soon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Clinical Notes
            </h1>
            <p className="text-muted-foreground mt-1">
              Select a patient to view their information and add clinical notes
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search patients by name or condition..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Patients</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Patient List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => {
            const patientNotes = []; // Will be loaded from API when patient is selected
            const lastNote = patientNotes[0];

            return (
              <Card
                key={patient.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedPatient(patient)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.id}`}
                      />
                      <AvatarFallback>
                        {patient.firstName[0]}
                        {patient.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {patient.firstName} {patient.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {patient.age} years • {patient.gender}
                      </p>
                      <Badge
                        className={`${getStatusColor(patient.status)} mt-1`}
                      >
                        {patient.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Condition:</strong> {patient.primaryCondition}
                    </div>
                    <div>
                      <strong>Last Visit:</strong>{" "}
                      {formatDate(patient.lastVisit)}
                    </div>
                    <div>
                      <strong>Total Notes:</strong> {patientNotes.length}
                    </div>
                    {lastNote && (
                      <div>
                        <strong>Last Note:</strong> {lastNote.type} (
                        {formatDate(lastNote.date)})
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <span className="text-xs text-muted-foreground">
                      {patient.totalVisits} total visits
                    </span>
                    <Button size="sm" variant="outline">
                      View Case
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredPatients.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">
                No Patients Found
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "No patients available for clinical notes"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
