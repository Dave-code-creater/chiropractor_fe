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

  const { incidentDetails, isLoading: isLoadingIncident } = useIncidentDetails(selectedIncident?.id);

  // Get the most recent incident for treatment plan (moved to top level)
  const recentIncident = selectedPatient?.recent_incidents?.[0];
  const incidentId = recentIncident?.id;

  // Use treatment plan management hook from domain layer
  const {
    treatmentPlan: existingTreatmentPlan,
    isLoading: isLoadingTreatmentPlan,
    error: treatmentPlanError,
    createTreatmentPlan,
    updateTreatmentPlan,
    isCreating: isCreatingTreatmentPlan,
    isUpdating: isUpdatingTreatmentPlan
  } = useTreatmentPlanManagement(incidentId);

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
            The incident with ID {selectedIncident?.id} was not found.
          </p>
        </div>
      );
    }

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
              Incident Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Incident Type</Label>
                <p className="font-medium">{getIncidentTypeLabel(incidentDetails.incident_type)}</p>
              </div>
              <div>
                <Label>Incident Date</Label>
                <p className="font-medium">{formatNoteDate(incidentDetails.incident_date)}</p>
              </div>
              <div>
                <Label>Incident Time</Label>
                <p className="font-medium">{incidentDetails.incident_time || 'N/A'}</p>
              </div>
              <div>
                <Label>Incident Location</Label>
                <p className="font-medium">{incidentDetails.incident_location || 'N/A'}</p>
              </div>
              <div>
                <Label>Incident Description</Label>
                <p className="font-medium">{incidentDetails.incident_description || 'N/A'}</p>
              </div>
              <div>
                <Label>Incident Status</Label>
                <Badge className={getStatusColor(incidentDetails.status)}>
                  {incidentDetails.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              Treatment Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {incidentDetails.treatment_plan ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Diagnosis</p>
                  <p className="font-medium">{incidentDetails.treatment_plan.diagnosis}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Treatment Goals</p>
                  <p className="font-medium">{incidentDetails.treatment_plan.treatment_goals}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phases</p>
                  <div className="space-y-2">
                    {incidentDetails.treatment_plan.treatment_phases?.map((phase, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                        <strong>Phase {index + 1}:</strong> {phase.frequency} visits {phase.frequency_type?.replace('_', ' ')} for {phase.duration} {phase.duration_type}
                        {phase.description && ` - ${phase.description}`}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Additional Notes</p>
                  <p className="font-medium">{incidentDetails.treatment_plan.additional_notes}</p>
                </div>
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
            <CardTitle>Initial Reports ({incidentDetails.total_reports || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {incidentDetails.reports && incidentDetails.reports.length > 0 ? (
              <div className="space-y-3">
                {incidentDetails.reports.map(report => {
                  const Icon = getIncidentIcon(report.incident_type);
                  return (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{report.title}</p>
                          <p className="text-sm text-gray-600">{formatNoteDate(report.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
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
      if (!incidentId) {
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
              <CardTitle className="flex items-center gap-2 text-green-700">
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

          {!incidentId && (
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
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
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