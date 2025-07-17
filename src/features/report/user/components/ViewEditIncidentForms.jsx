import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Eye,
  Edit3,
  Save,
  X,
  CheckCircle,
  Circle,
  FileText,
  Clock,
  User,
  Heart,
  Shield,
  Briefcase,
  Activity,
  RefreshCw,
  AlertCircle,
  Send,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import {
  useGetIncidentByIdQuery,
  useGetIncidentFormQuery,
  useUpdateIncidentFormMutation,
} from "@/api/services/reportApi";

// Import the new helper functions
import { 
  useIncidentSubmission, 
  checkSubmissionReadiness, 
  getFormConfigForIncidentType 
} from "@/utils/incidentFormHelpers";

import UnifiedPatientForm from "./UnifiedPatientForm";

// Define form configurations based on incident type (same as InitialReportForm)
const getFormsByIncidentType = (incidentType) => {
  const baseConfig = {
    car_accident: [
      {
        key: "patient_info",
        title: "Patient Information",
        required: true,
        description: "Basic contact and personal information",
        icon: User,
      },
      {
        key: "accident_details",
        title: "Accident Details",
        required: false,
        description: "Details about the car accident",
        icon: FileText,
      },
      {
        key: "auto_insurance",
        title: "Auto Insurance",
        required: false,
        description: "Insurance information for the accident",
        icon: Shield,
      },
      {
        key: "pain_assessment",
        title: "Pain Assessment",
        required: false,
        description: "Current pain levels and symptoms",
        icon: Heart,
      },
      {
        key: "medical_history",
        title: "Medical History",
        required: false,
        description: "Previous medical conditions and treatments",
        icon: Activity,
      },
      {
        key: "work_impact",
        title: "Work Impact",
        required: false,
        description: "How the injury affects your work",
        icon: Briefcase,
      },
    ],
    work_injury: [
      {
        key: "patient_info",
        title: "Patient Information",
        required: true,
        description: "Basic contact and personal information",
        icon: User,
      },
      {
        key: "work_incident_details",
        title: "Work Incident Details",
        required: false,
        description: "Details about the workplace incident",
        icon: FileText,
      },
      {
        key: "workers_comp",
        title: "Workers' Compensation",
        required: false,
        description: "Workers' compensation information",
        icon: Shield,
      },
      {
        key: "pain_assessment",
        title: "Pain Assessment",
        required: false,
        description: "Current pain levels and symptoms",
        icon: Heart,
      },
      {
        key: "medical_history",
        title: "Medical History",
        required: false,
        description: "Previous medical conditions and treatments",
        icon: Activity,
      },
      {
        key: "work_status_restrictions",
        title: "Work Status & Restrictions",
        required: false,
        description: "Work ability and restrictions",
        icon: Briefcase,
      },
    ],
    general_pain: [
      {
        key: "patient_info",
        title: "Patient Information",
        required: true,
        description: "Basic contact and personal information",
        icon: User,
      },
      {
        key: "pain_description",
        title: "Pain Description",
        required: false,
        description: "Detailed description of your pain",
        icon: Heart,
      },
      {
        key: "pain_assessment",
        title: "Pain Assessment",
        required: false,
        description: "Pain levels and impact assessment",
        icon: Activity,
      },
      {
        key: "medical_history",
        title: "Medical History",
        required: false,
        description: "Previous medical conditions and treatments",
        icon: FileText,
      },
      {
        key: "health_insurance",
        title: "Health Insurance",
        required: false,
        description: "Health insurance information",
        icon: Shield,
      },
      {
        key: "lifestyle_impact",
        title: "Lifestyle Impact",
        required: false,
        description: "How pain affects your daily life",
        icon: Briefcase,
      },
    ],
  };

  return baseConfig[incidentType] || baseConfig.general_pain;
};

const FormCard = ({ formConfig, formData, onEdit, onView, isCompleted, isLoading }) => {
  const Icon = formConfig.icon;
  
  const getFormStatus = () => {
    if (!formData) return { status: "not_started", text: "Not Started" };
    if (formData.is_completed) return { status: "completed", text: "Completed" };
    return { status: "in_progress", text: "In Progress" };
  };

  const status = getFormStatus();

  return (
    <Card className={`cursor-pointer transition-all hover:shadow-md ${
      status.status === "completed" ? "border-green-200 bg-green-50/50" :
      status.status === "in_progress" ? "border-yellow-200 bg-yellow-50/50" :
      "border-gray-200 hover:border-primary/30"
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              status.status === "completed" ? "bg-green-100" :
              status.status === "in_progress" ? "bg-yellow-100" :
              "bg-gray-100"
            }`}>
              <Icon className={`h-5 w-5 ${
                status.status === "completed" ? "text-green-600" :
                status.status === "in_progress" ? "text-yellow-600" :
                "text-gray-600"
              }`} />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base font-semibold">
                {formConfig.title}
                {formConfig.required && <span className="text-red-500 ml-1">*</span>}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {formConfig.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={
              status.status === "completed" ? "default" :
              status.status === "in_progress" ? "secondary" :
              "outline"
            }>
              {status.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
              {status.status === "in_progress" && <Clock className="h-3 w-3 mr-1" />}
              {status.status === "not_started" && <Circle className="h-3 w-3 mr-1" />}
              {status.text}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2">
          {formData && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(formConfig, formData)}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              View
            </Button>
          )}
          <Button
            variant={formData ? "outline" : "default"}
            size="sm"
            onClick={() => onEdit(formConfig, formData)}
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Edit3 className="h-4 w-4 mr-2" />
            )}
            {formData ? "Edit" : "Fill Out"}
          </Button>
        </div>
        
        {formData?.updated_at && (
          <p className="text-xs text-muted-foreground mt-2">
            Last updated: {new Date(formData.updated_at).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default function ViewEditIncidentForms({ incidentId, onBack }) {
  const [selectedForm, setSelectedForm] = useState(null);
  const [viewMode, setViewMode] = useState(false); // true for view, false for edit
  const [activeTab, setActiveTab] = useState("overview");
  const [fetchingFormType, setFetchingFormType] = useState(null);
  const [intendedViewMode, setIntendedViewMode] = useState(false); // Store intended mode while fetching

  // Get current user
  const currentUser = useSelector((state) => state?.auth?.user);

  // API hooks
  const {
    data: incidentData,
    isLoading: isLoadingIncident,
    error: incidentError,
    refetch: refetchIncident,
  } = useGetIncidentByIdQuery(incidentId);

  // Remove duplicate call - forms data comes with incident data
  // const {
  //   data: formsData,
  //   isLoading: isLoadingForms,
  //   error: formsError,
  //   refetch: refetchForms,
  // } = useGetCompleteIncidentFormsQuery(incidentId);

  // Individual form query (only fetch when needed)
  const {
    data: individualFormData,
    isLoading: isLoadingIndividualForm,
    error: individualFormError,
    refetch: refetchIndividualForm,
  } = useGetIncidentFormQuery(
    { incidentId, formType: fetchingFormType },
    { skip: !fetchingFormType } // Only fetch when fetchingFormType is set
  );

  const [updateIncidentForm] = useUpdateIncidentFormMutation();

  // New: Use the incident submission hook
  const { submitForFinalProcessing, isSubmitting, submissionError } = useIncidentSubmission();

  // Process data
  const incident = incidentData?.data || incidentData;
  const forms = incident?.forms || [];
  const formsByType = useMemo(() => {
    const formMap = {};
    forms.forEach(form => {
      formMap[form.form_type] = form;
    });
    return formMap;
  }, [forms]);

  const formConfigs = useMemo(() => {
    return getFormsByIncidentType(incident?.incident_type || 'general_pain');
  }, [incident?.incident_type]);

  // New: Check submission readiness
  const submissionStatus = useMemo(() => {
    if (!incident || !forms.length || !formConfigs.length) {
      return { canSubmit: false, completionPercentage: 0 };
    }
    return checkSubmissionReadiness(incident, forms, formConfigs);
  }, [incident, forms, formConfigs]);

  // Calculate completion stats for backward compatibility
  const completionStats = useMemo(() => {
    const total = formConfigs.length;
    const completed = formConfigs.filter(config => 
      formsByType[config.key]?.is_completed
    ).length;
    const inProgress = formConfigs.filter(config => 
      formsByType[config.key] && !formsByType[config.key].is_completed
    ).length;
    const notStarted = total - completed - inProgress;
    
    return {
      total,
      completed,
      inProgress,
      notStarted,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [formConfigs, formsByType]);

  // Handle individual form data loading
  useEffect(() => {
    if (fetchingFormType && individualFormData && !isLoadingIndividualForm && !individualFormError) {
      // Find the form config for the fetched form type
      const formConfig = formConfigs.find(config => config.key === fetchingFormType);
      
      if (formConfig) {
        const fetchedData = individualFormData?.data || individualFormData;
        
        setSelectedForm({
          config: formConfig,
          data: fetchedData,
          incident: incident
        });
        
        // Use the intended view mode
        setViewMode(intendedViewMode);
        
        // Clear the fetching state
        setFetchingFormType(null);
        setIntendedViewMode(false);
      }
    }
  }, [individualFormData, isLoadingIndividualForm, individualFormError, fetchingFormType, formConfigs, incident, intendedViewMode]);

  // Handle individual form loading errors
  useEffect(() => {
    if (fetchingFormType && individualFormError && !isLoadingIndividualForm) {
      console.error("Error fetching individual form:", individualFormError);
      toast.error("Failed to load the latest form data. Please try again.");
      setFetchingFormType(null);
    }
  }, [individualFormError, isLoadingIndividualForm, fetchingFormType]);

  // Handlers
  const handleViewForm = async (formConfig, formData) => {
    // If form has data, fetch the latest version from server
    if (formData) {
      setFetchingFormType(formConfig.key);
      setIntendedViewMode(true); // Remember we want to view
      try {
        // The query will automatically trigger due to fetchingFormType change
        // We'll handle the data in useEffect below
      } catch (error) {
        console.error("Failed to fetch form data:", error);
        toast.error("Failed to load form data. Using cached version.");
        // Fallback to cached data
        setSelectedForm({
          config: formConfig,
          data: formData,
          incident: incident
        });
        setViewMode(true);
        setFetchingFormType(null);
        setIntendedViewMode(false);
      }
    } else {
      // No existing data, open blank form
      setSelectedForm({
        config: formConfig,
        data: null,
        incident: incident
      });
      setViewMode(true);
    }
  };

  const handleEditForm = async (formConfig, formData) => {
    // If form has data, fetch the latest version from server
    if (formData) {
      setFetchingFormType(formConfig.key);
      setIntendedViewMode(false); // Remember we want to edit
      try {
        // The query will automatically trigger due to fetchingFormType change
        // We'll handle the data in useEffect below
      } catch (error) {
        console.error("Failed to fetch form data:", error);
        toast.error("Failed to load form data. Using cached version.");
        // Fallback to cached data
        setSelectedForm({
          config: formConfig,
          data: formData,
          incident: incident
        });
        setViewMode(false);
        setFetchingFormType(null);
        setIntendedViewMode(false);
      }
    } else {
      // No existing data, open blank form
      setSelectedForm({
        config: formConfig,
        data: null,
        incident: incident
      });
      setViewMode(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    if (!selectedForm) return;

    console.log('📝 Submitting Form:', {
      incidentId: incidentId,
      formType: selectedForm.config.key,
      formData: formData
    });

    try {
      const response = await updateIncidentForm({
        incidentId: incidentId,
        formType: selectedForm.config.key,
        formData: formData,
        isCompleted: true,
      }).unwrap();

      console.log('✅ Form Update Response:', response);
      toast.success("Form updated successfully!");
      setSelectedForm(null);
      refetchIncident();
    } catch (error) {
      console.error("❌ Failed to update form:", error);
      toast.error("Failed to update form. Please try again.");
    }
  };

  const handleFormBack = () => {
    setSelectedForm(null);
    setViewMode(false);
    setFetchingFormType(null); // Clear any pending form fetch
    setIntendedViewMode(false); // Clear intended mode
  };

  // New: Handle final submission
  const handleFinalSubmission = async () => {
    if (!submissionStatus.canSubmit) {
      console.warn('⚠️ Cannot submit - missing required forms:', submissionStatus.missingRequired);
      toast.error(`Please complete all required forms first. Missing: ${submissionStatus.missingRequired.join(', ')}`);
      return;
    }

    console.log('🚀 Starting Final Submission Process:', {
      incidentId: incidentId,
      incident: incident,
      forms: forms,
      submissionStatus: submissionStatus
    });

    const processingOptions = {
      auto_categorize: true,
      extract_key_data: true,
      generate_summary: true,
      create_clinical_notes: true,
      notify_providers: false // Set based on user preference
    };

    console.log('⚙️ Processing Options:', processingOptions);

    const result = await submitForFinalProcessing(incidentId, incident, forms, processingOptions);

    console.log('📤 Final Submission Result:', result);

    if (result.success) {
      toast.success(result.message);
      refetchIncident();
    } else {
      console.error('❌ Final Submission Failed:', result.message);
      toast.error(result.message);
    }
  };

  // Loading state
  if (isLoadingIncident) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your forms...</p>
        </div>
      </div>
    );
  }

  // Show loading overlay when fetching individual form
  if (fetchingFormType && isLoadingIndividualForm) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading form data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (incidentError) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <h3 className="text-lg font-semibold mb-2">Unable to load forms</h3>
        <p className="text-muted-foreground mb-4">
          There was an error loading your incident forms.
        </p>
        <Button onClick={() => { refetchIncident(); }} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  // If form is selected, show the form component
  if (selectedForm) {
    const template = {
      id: selectedForm.config.key,
      name: selectedForm.config.title,
      formType: selectedForm.config.key,
      incidentType: incident?.incident_type || 'general_pain',
      folder: incident?.title || 'Incident Report',
      description: selectedForm.config.description
    };

    if (viewMode) {
      // View mode - show form in read-only
      return (
        <div className="h-full">
          <div className="border-b p-6 bg-background">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={handleFormBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Forms
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">{selectedForm.config.title}</h1>
                  <p className="text-muted-foreground">Viewing submitted form</p>
                </div>
              </div>
              <Button onClick={() => setViewMode(false)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Form
              </Button>
            </div>
          </div>
          <div className="p-6">
            <Card>
              <CardHeader>
                <CardTitle>Form Data (Read-Only)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded">
                  {JSON.stringify(selectedForm.data.form_data, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // Edit mode - show editable form using unified form
    return (
      <UnifiedPatientForm
        userId={incident?.user_id}
        onComplete={() => {
          // Mark form as completed and go back to overview
          handleFormBack();
        }}
        onBack={handleFormBack}
      />
    );
  }

  // Main view
  return (
    <div className="h-full">
      {/* Header */}
      <div className="border-b p-6 bg-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{incident?.title || 'Incident Forms'}</h1>
              <p className="text-muted-foreground">
                View and edit your incident report forms
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-4 py-2">
              {submissionStatus.completionPercentage}% Complete
            </Badge>
            
            {/* New: Final Submission Button */}
            {submissionStatus.canSubmit && (
              <Button 
                onClick={handleFinalSubmission}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Submit for Processing
              </Button>
            )}
          </div>
        </div>

        {/* New: Submission Status Alert */}
        {!submissionStatus.canSubmit && submissionStatus.missingRequired.length > 0 && (
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Complete these required forms to submit for processing: {submissionStatus.missingRequired.join(', ')}
            </AlertDescription>
          </Alert>
        )}

        {submissionStatus.canSubmit && (
          <Alert className="mt-4 border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              All required forms are complete! Ready to submit for final processing.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="forms">All Forms</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Progress Summary */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Progress Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {completionStats.completed}
                    </div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {completionStats.inProgress}
                    </div>
                    <div className="text-sm text-muted-foreground">In Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">
                      {completionStats.notStarted}
                    </div>
                    <div className="text-sm text-muted-foreground">Not Started</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {completionStats.total}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Forms</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2 transition-all duration-300"
                    style={{ width: `${completionStats.percentage}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formConfigs.slice(0, 6).map((formConfig) => {
                const formData = formsByType[formConfig.key];
                return (
                  <FormCard
                    key={formConfig.key}
                    formConfig={formConfig}
                    formData={formData}
                    onEdit={handleEditForm}
                    onView={handleViewForm}
                    isCompleted={formData?.is_completed}
                    isLoading={fetchingFormType === formConfig.key && isLoadingIndividualForm}
                  />
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="forms">
            {/* All Forms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formConfigs.map((formConfig) => {
                const formData = formsByType[formConfig.key];
                return (
                  <FormCard
                    key={formConfig.key}
                    formConfig={formConfig}
                    formData={formData}
                    onEdit={handleEditForm}
                    onView={handleViewForm}
                    isCompleted={formData?.is_completed}
                    isLoading={fetchingFormType === formConfig.key && isLoadingIndividualForm}
                  />
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 