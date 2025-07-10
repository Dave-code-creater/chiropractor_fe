// src/features/report/user/Report.jsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSelector } from "react-redux";
import {
  PlusIcon,
  FileText as FileTextIcon,
  AlertCircle,
  Car,
  Activity,
  Heart,
  Briefcase,
  Calendar,
  Clock,
  CheckCircle,
  RefreshCw,
  Folder,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import TemplateFormRouter from "./components/TemplateFormRouter";
import ViewEditIncidentForms from "./components/ViewEditIncidentForms";
import {
  useGetIncidentsQuery,
  useCreateIncidentMutation,
  useUpdateIncidentMutation,
  useAddIncidentNoteMutation,
} from "@/api/services/reportApi";

// Incident types with tailored forms - matching backend form_type values
const INCIDENT_TYPES = [
  {
    id: "general_pain",
    title: "General Pain",
    description: "Document chronic pain or general discomfort",
    icon: Heart,
    color: "bg-green-50",
    iconColor: "text-green-600",
    estimatedTime: "10-15 min",
    forms: [
      { key: 'patient_info', title: 'Patient Information', required: true },
      { key: 'pain_description', title: 'Pain Description', required: false },
      { key: 'medical_history', title: 'Medical History', required: false },
      { key: 'health_insurance', title: 'Health Insurance', required: false },
      { key: 'pain_assessment', title: 'Pain Assessment', required: false },
      { key: 'lifestyle_impact', title: 'Lifestyle Impact', required: false },
    ]
  },
  {
    id: "car_accident",
    title: "Car Accident",
    description: "Document your car accident injury and recovery",
    icon: Car,
    color: "bg-red-50",
    iconColor: "text-red-600",
    estimatedTime: "15-20 min",
    forms: [
      { key: 'patient_info', title: 'Patient Information', required: true },
      { key: 'accident_details', title: 'Accident Details', required: false },
      { key: 'injuries_symptoms', title: 'Injuries & Symptoms', required: false },
      { key: 'auto_insurance', title: 'Auto Insurance', required: false },
      { key: 'pain_assessment', title: 'Pain Assessment', required: false },
      { key: 'work_impact', title: 'Work Impact', required: false },
    ]
  },
  {
    id: "work_injury",
    title: "Work Injury",
    description: "Report workplace injury and workers' compensation details",
    icon: Briefcase,
    color: "bg-orange-50",
    iconColor: "text-orange-600",
    estimatedTime: "15-20 min",
    forms: [
      { key: 'patient_info', title: 'Patient Information', required: true },
      { key: 'work_incident_details', title: 'Work Incident Details', required: true },
      { key: 'injuries_symptoms', title: 'Injuries & Symptoms', required: true },
      { key: 'workers_comp', title: 'Workers\' Compensation', required: true },
      { key: 'pain_assessment', title: 'Pain Assessment', required: true },
      { key: 'work_status_restrictions', title: 'Work Status & Restrictions', required: true },
    ]
  },
];

const LoadingState = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
      <p className="text-muted-foreground">Loading your incident reports...</p>
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="text-center py-12">
    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
    <h3 className="text-lg font-semibold mb-2">Unable to load reports</h3>
    <p className="text-muted-foreground mb-4">
      {error?.status === 500 ? 'Server temporarily unavailable' : 'Please try again later'}
    </p>
    <Button onClick={onRetry} variant="outline">
      <RefreshCw className="h-4 w-4 mr-2" />
      Try Again
    </Button>
  </div>
);

const QuickStartSection = ({ onSelectIncidentType }) => (
  <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-2">Quick Start</h2>
      <p className="text-muted-foreground mb-3">
        Choose your incident type to start your medical report. Only basic contact information is required.
      </p>
      <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded px-3 py-2">
        <span>🔒</span>
        <span><strong>Privacy First:</strong> Share only what you're comfortable with - most sections are optional.</span>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {INCIDENT_TYPES.map((incidentType) => (
        <IncidentTypeCard
          key={incidentType.id}
          incidentType={incidentType}
          onClick={onSelectIncidentType}
        />
      ))}
    </div>
  </div>
);

const IncidentTypeCard = ({ incidentType, onClick }) => {
  const Icon = incidentType.icon;
  
  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md group border border-gray-200 hover:border-primary/20"
      onClick={() => onClick(incidentType)}
      tabIndex={-1}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-xl ${incidentType.color}`}>
            <Icon className={`h-7 w-7 ${incidentType.iconColor}`} />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl text-gray-900">
              {incidentType.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {incidentType.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs bg-transparent">
                <Clock className="h-3 w-3 mr-1" />
                {incidentType.estimatedTime}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {incidentType.forms.length} forms
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

const IncidentFolderCard = ({ incident, onToggle, onEditIncident, onOpenForm, onAddNote, onViewAllForms }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(incident.title);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [newNote, setNewNote] = useState({ date: new Date().toISOString().slice(0, 10), text: '' });
  
  const incidentType = INCIDENT_TYPES.find(t => t.id === incident.incident_type);
  const Icon = incidentType?.icon || Folder;
  
  const completedForms = incident.forms?.filter(f => f.is_completed).length || 0;
  const totalForms = incidentType?.forms.length || 0;
  const progress = incident.completion_percentage || 0;

  const handleSaveTitle = () => {
    if (editTitle.trim() && editTitle !== incident.title) {
      onEditIncident(incident.id, { title: editTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleAddNote = () => {
    if (newNote.text.trim()) {
      onAddNote(incident.id, newNote.text);
      setNewNote({ date: new Date().toISOString().slice(0, 10), text: '' });
      setShowNoteForm(false);
    }
  };

  return (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => !isEditingTitle && onToggle(incident.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className={`p-3 rounded-lg ${incidentType?.color || 'bg-gray-50'}`}>
              <Icon className={`h-6 w-6 ${incidentType?.iconColor || 'text-gray-600'}`} />
            </div>
            <div className="flex-1">
              {isEditingTitle ? (
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveTitle();
                      if (e.key === 'Escape') setIsEditingTitle(false);
                    }}
                    className="text-lg font-semibold"
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" onClick={handleSaveTitle}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsEditingTitle(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{incident.title}</CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditingTitle(true);
                    }}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-4 mt-2">
                <p className="text-sm text-muted-foreground">
                  Created {new Date(incident.created_at).toLocaleDateString()}
                </p>
                <Badge variant="outline" className="text-xs">
                  {progress}% Complete
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {completedForms}/{totalForms} forms
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onViewAllForms(incident.id);
              }}
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              View All Forms
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowNoteForm(!showNoteForm);
              }}
            >
              Add Note
            </Button>
            <Button variant="ghost" size="icon">
              {incident.expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {incident.expanded && (
        <CardContent className="pt-0">
          {/* Forms Section */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
              Forms & Documentation
            </h4>
            <div className="grid gap-3">
              {incidentType?.forms.map((formConfig) => {
                const existingForm = incident.forms?.find(f => f.form_type === formConfig.key);
                const isCompleted = existingForm?.is_completed;
                const isDraft = existingForm && !existingForm.is_completed;
                
                return (
                  <div
                    key={formConfig.key}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-sm ${
                      isCompleted ? 'bg-green-50 border-green-200' : 
                      isDraft ? 'bg-yellow-50 border-yellow-200' : 
                      'bg-white border-gray-200 hover:border-primary/30'
                    }`}
                    onClick={() => onOpenForm(incident.id, formConfig.key, existingForm)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded ${
                          isCompleted ? 'bg-green-100' : 
                          isDraft ? 'bg-yellow-100' : 
                          'bg-gray-100'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <FileTextIcon className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{formConfig.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {formConfig.required ? 'Required' : 'Optional'}
                            {existingForm && ` • Last updated ${new Date(existingForm.updated_at || existingForm.created_at).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                      <Badge variant={isCompleted ? 'default' : isDraft ? 'secondary' : 'outline'}>
                        {isCompleted ? 'Complete' : isDraft ? 'Draft' : 'Not Started'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Add Note Form */}
          {showNoteForm && (
            <div className="mb-6 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-3">Add Progress Note</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="note-text">Note</Label>
                  <Textarea
                    id="note-text"
                    value={newNote.text}
                    onChange={(e) => setNewNote(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Describe symptoms, pain changes, treatment responses, or any updates..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddNote} size="sm">
                    Save Note
                  </Button>
                  <Button variant="outline" onClick={() => setShowNoteForm(false)} size="sm">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Notes Timeline */}
          {incident.notes && incident.notes.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                Progress Notes
              </h4>
              <div className="space-y-3">
                {incident.notes
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .map((note, index) => (
                    <div key={index} className="p-3 bg-white rounded-lg border-l-4 border-blue-400 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-700">
                          {new Date(note.created_at).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {note.note_type || 'Progress Note'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{note.note_text}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default function Report() {
  const [selectedFormData, setSelectedFormData] = useState(null);
  const [expandedIncidents, setExpandedIncidents] = useState({});
  const [pendingIncidentType, setPendingIncidentType] = useState(null);
  const [viewingIncidentForms, setViewingIncidentForms] = useState(null);

  // Get current user info
  const currentUser = useSelector((state) => state?.auth?.user);
  const userID = useSelector((state) => state?.auth?.userID);

  // API hooks
  const {
    data: incidentsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetIncidentsQuery();

  const [createIncident] = useCreateIncidentMutation();
  const [updateIncident] = useUpdateIncidentMutation();
  const [addIncidentNote] = useAddIncidentNoteMutation();

  // Process incidents data
  const incidents = useMemo(() => {
    if (!incidentsData?.data) return [];
    return incidentsData.data.map(incident => ({
      ...incident,
      expanded: expandedIncidents[incident.id] || false
    }));
  }, [incidentsData, expandedIncidents]);

  // Handlers
  const handleToggleIncident = useCallback((incidentId) => {
    setExpandedIncidents(prev => ({
      ...prev,
      [incidentId]: !prev[incidentId]
    }));
  }, []);

  const handleEditIncident = useCallback(async (incidentId, updates) => {
    try {
      await updateIncident({ incidentId, data: updates }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update incident:", error);
    }
  }, [updateIncident, refetch]);

  const handleOpenForm = useCallback((incidentId, formType, existingForm) => {
    const incident = incidents.find(i => i.id === incidentId);
    const incidentType = INCIDENT_TYPES.find(t => t.id === incident.incident_type);
    
    setSelectedFormData({
      incidentId,
      formType,
      incidentType: incidentType.id,
      existingForm,
      incident
    });
  }, [incidents]);

  const handleAddNote = useCallback(async (incidentId, noteText) => {
    try {
      await addIncidentNote({ 
        incidentId, 
        noteText,
        noteType: 'progress'
      }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  }, [addIncidentNote, refetch]);

  const handleFormSubmit = useCallback(async (formData) => {
    console.log("Form submitted:", formData);
    
    // If this is a new incident (pendingIncidentType exists), create it first
    if (pendingIncidentType) {
      try {
        const incidentData = {
          incident_type: pendingIncidentType.id,
          title: `${pendingIncidentType.title} - ${new Date().toLocaleDateString()}`,
          description: pendingIncidentType.description,
          incident_date: new Date().toISOString().slice(0, 10)
        };

        const result = await createIncident(incidentData).unwrap();
        
        // Auto-expand the new incident
        setExpandedIncidents(prev => ({
          ...prev,
          [result.data.id]: true
        }));
        
        setPendingIncidentType(null);
        refetch();
      } catch (error) {
        console.error("Failed to create incident:", error);
      }
    }
    
    setSelectedFormData(null);
    refetch();
  }, [refetch, pendingIncidentType, createIncident]);

  const handleFormBack = useCallback(() => {
    setSelectedFormData(null);
    setPendingIncidentType(null);
  }, []);

  const handleViewIncidentForms = useCallback((incidentId) => {
    setViewingIncidentForms(incidentId);
  }, []);

  const handleBackFromViewForms = useCallback(() => {
    setViewingIncidentForms(null);
  }, []);

  // If viewing incident forms, show the ViewEditIncidentForms component
  if (viewingIncidentForms) {
    return (
      <ViewEditIncidentForms
        incidentId={viewingIncidentForms}
        onBack={handleBackFromViewForms}
      />
    );
  }

  // If form is selected, show the form
  if (selectedFormData) {
    // Ensure we have valid values for all required properties
    const formType = selectedFormData.formType || 'InitialReportForm';
    const existingFormTitle = selectedFormData.existingForm?.title || `${formType} Form`;
    const incidentTitle = selectedFormData.incident?.title || pendingIncidentType?.title || "New Report";
    const incidentDescription = selectedFormData.incident?.description || pendingIncidentType?.description || "";
    
    const selectedTemplate = {
      id: formType,
      name: existingFormTitle,
      formType: formType,
      incidentType: selectedFormData.incidentType || 'general',
      folder: incidentTitle,
      description: incidentDescription
    };
    
    return (
      <TemplateFormRouter
        selectedTemplate={selectedTemplate}
        onSubmit={handleFormSubmit}
        initialData={selectedFormData.existingForm}
        onBack={handleFormBack}
        isPatientView={true}
        incidentId={selectedFormData.incidentId}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b px-6 py-4 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Health Journey</h1>
            <p className="text-muted-foreground mt-1">
              Document incidents, track recovery, and manage your care
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : incidents.length === 0 ? (
          <QuickStartSection onSelectIncidentType={(incidentType) => {
            // Set pending incident type and open form directly
            setPendingIncidentType(incidentType);
            setSelectedFormData({
              incidentId: null,
              formType: 'InitialReportForm', // Start with the main comprehensive form
              incidentType: incidentType.id,
              existingForm: null,
              incident: null
            });
          }} />
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">My Incident Reports</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {incidents.length} incident{incidents.length !== 1 ? 's' : ''} documented
                </span>
                {incidents.some(i => i.forms?.some(form => !form.is_completed)) && (
                  <Alert className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      You have incomplete forms. Complete them to help your doctor provide better care.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              {incidents.map((incident) => (
                <IncidentFolderCard
                  key={incident.id}
                  incident={incident}
                  onToggle={handleToggleIncident}
                  onEditIncident={handleEditIncident}
                  onOpenForm={handleOpenForm}
                  onAddNote={handleAddNote}
                  onViewAllForms={handleViewIncidentForms}
                />
              ))}
            </div>
            
            {/* Add Quick Start section for existing users too */}
            <div className="mt-8 pt-8 border-t">
              <QuickStartSection onSelectIncidentType={(incidentType) => {
                setPendingIncidentType(incidentType);
                setSelectedFormData({
                  incidentId: null,
                  formType: 'InitialReportForm',
                  incidentType: incidentType.id,
                  existingForm: null,
                  incident: null
                });
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
