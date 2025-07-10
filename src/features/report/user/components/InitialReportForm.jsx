import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trash2 as TrashIcon, CheckCircle, Circle } from "lucide-react";

import PatientIntakeForm from "./forms/PatientIntakeForm";
import InsuranceDetailsForm from "./forms/InsuranceDetailsForm";
import PainEvaluationForm from "./forms/PainEvaluationForm";
import DetailedDescriptionForm from "./forms/DetailedDescriptionForm";
import WorkImpactForm from "./forms/WorkImpactForm";
import HealthConditionForm from "./forms/HealthConditionForm";
import {
  useSubmitPatientIntakeMutation,
  useUpdatePatientIntakeMutation,
  useSubmitInsuranceDetailsMutation,
  useUpdateInsuranceDetailsMutation,
  useSubmitPainDescriptionMutation,
  useUpdatePainDescriptionMutation,
  useSubmitDetailsDescriptionMutation,
  useUpdateDetailsDescriptionMutation,
  useSubmitWorkImpactMutation,
  useUpdateWorkImpactMutation,
  useSubmitHealthConditionMutation,
  useUpdateHealthConditionMutation,
  useGetInitialReportQuery,
} from "@/api/services/reportApi";

// Define form configurations based on incident type
const getFormsByIncidentType = (incidentType) => {
  const baseConfig = {
    car_accident: [
      {
        key: "patientIntake",
        title: "Patient Information",
        Component: PatientIntakeForm,
        required: true,
        description: "Just your basic contact information to get started"
      },
      {
        key: "insuranceDetails",
        title: "Accident & Auto Insurance",
        Component: InsuranceDetailsForm,
        required: false,
        description: "Optional: Insurance details can help with your claim"
      },
      {
        key: "detailsDescriptions",
        title: "Accident Details",
        Component: DetailedDescriptionForm,
        required: false,
        description: "Optional: Share details about the accident when you're ready"
      },
      {
        key: "painDescriptions",
        title: "Pain & Symptom Assessment",
        Component: PainEvaluationForm,
        required: false,
        description: "Optional: Help us understand your current symptoms"
      },
      {
        key: "healthConditions",
        title: "Medical History",
        Component: HealthConditionForm,
        required: false,
        description: "Optional: Previous medical information can improve your care"
      },
      {
        key: "workImpact",
        title: "Work Impact",
        Component: WorkImpactForm,
        required: false,
        description: "Optional: How the injury affects your daily work"
      },
    ],
    work_injury: [
      {
        key: "patientIntake",
        title: "Patient Information",
        Component: PatientIntakeForm,
        required: true,
        description: "Just your basic contact information to get started"
      },
      {
        key: "detailsDescriptions",
        title: "Work Incident Details",
        Component: DetailedDescriptionForm,
        required: false,
        description: "Optional: Details about what happened at work"
      },
      {
        key: "painDescriptions",
        title: "Pain & Symptom Assessment",
        Component: PainEvaluationForm,
        required: false,
        description: "Optional: Help us understand your current symptoms"
      },
      {
        key: "workImpact",
        title: "Work Status & Restrictions",
        Component: WorkImpactForm,
        required: false,
        description: "Optional: How the injury affects your work ability"
      },
      {
        key: "healthConditions",
        title: "Medical History",
        Component: HealthConditionForm,
        required: false,
        description: "Optional: Previous medical information can improve your care"
      },
      {
        key: "insuranceDetails",
        title: "Workers' Compensation",
        Component: InsuranceDetailsForm,
        required: false,
        description: "Optional: Workers' compensation information"
      },
    ],
    general_pain: [
      {
        key: "patientIntake",
        title: "Patient Information",
        Component: PatientIntakeForm,
        required: true,
        description: "Just your basic contact information to get started"
      },
      {
        key: "detailsDescriptions",
        title: "Pain Description",
        Component: DetailedDescriptionForm,
        required: false,
        description: "Optional: Tell us about your pain when you're comfortable"
      },
      {
        key: "painDescriptions",
        title: "Pain Assessment",
        Component: PainEvaluationForm,
        required: false,
        description: "Optional: Help us understand your pain levels"
      },
      {
        key: "healthConditions",
        title: "Medical History",
        Component: HealthConditionForm,
        required: false,
        description: "Optional: Previous medical information can improve your care"
      },
      {
        key: "insuranceDetails",
        title: "Health Insurance",
        Component: InsuranceDetailsForm,
        required: false,
        description: "Optional: Insurance information for your care"
      },
      {
        key: "workImpact",
        title: "Lifestyle Impact",
        Component: WorkImpactForm,
        required: false,
        description: "Optional: How pain affects your daily activities"
      },
    ],
  };

  return baseConfig[incidentType] || baseConfig.general_pain;
};

export default function InitialReportForm({
  onSubmit,
  initialData = {},
  onBack,
  onDelete,
  isPatientView = false,
  incidentType = "general_pain",
}) {
  const forms = getFormsByIncidentType(incidentType);
  
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState(new Set());
  const [sectionsData, setSectionsData] = useState({
    patientIntake: initialData.patientIntake || {},
    insuranceDetails: initialData.insuranceDetails || {},
    painDescriptions: initialData.painEvaluations || [
      { painMap: {}, formData: {} },
    ],
    detailsDescriptions: initialData.detailsDescriptions || {},
    workImpact: initialData.workImpact || {},
    healthConditions: initialData.healthConditions || {},
  });
  const [reportName, setReportName] = useState(initialData.name || "");
  const [editingName, setEditingName] = useState(false);

  const [submitPatientIntake] = useSubmitPatientIntakeMutation();
  const [updatePatientIntake] = useUpdatePatientIntakeMutation();
  const [submitInsuranceDetails] = useSubmitInsuranceDetailsMutation();
  const [updateInsuranceDetails] = useUpdateInsuranceDetailsMutation();
  const [submitPainDescription] = useSubmitPainDescriptionMutation();
  const [updatePainDescription] = useUpdatePainDescriptionMutation();
  const [submitDetailsDescription] = useSubmitDetailsDescriptionMutation();
  const [updateDetailsDescription] = useUpdateDetailsDescriptionMutation();
  const [submitWorkImpact] = useSubmitWorkImpactMutation();
  const [updateWorkImpact] = useUpdateWorkImpactMutation();
  const [submitHealthCondition] = useSubmitHealthConditionMutation();
  const [updateHealthCondition] = useUpdateHealthConditionMutation();
  const { data: fetchedData } = useGetInitialReportQuery();

  useEffect(() => {
    if (fetchedData) {
      setSectionsData({
        patientIntake: fetchedData.patientIntake || {},
        insuranceDetails: fetchedData.insuranceDetails || {},
        painDescriptions: fetchedData.painDescriptions || [
          { painMap: {}, formData: {} },
        ],
        detailsDescriptions: fetchedData.detailsDescriptions || {},
        workImpact: fetchedData.workImpact || {},
        healthConditions: fetchedData.healthConditions || {},
      });
      if (fetchedData.name) setReportName(fetchedData.name);
    }
  }, [fetchedData]);

  const submitters = [
    submitPatientIntake,
    submitInsuranceDetails,
    submitPainDescription,
    submitDetailsDescription,
    submitWorkImpact,
    submitHealthCondition,
  ];

  const updaters = [
    updatePatientIntake,
    updateInsuranceDetails,
    updatePainDescription,
    updateDetailsDescription,
    updateWorkImpact,
    updateHealthCondition,
  ];

  const handleSectionSubmit = async (data) => {
    const { key } = forms[currentSectionIndex];
    const isLast = currentSectionIndex === forms.length - 1;

    // Update sections data with new data
    const updatedSectionsData = {
      ...sectionsData,
      [key]: { ...(sectionsData[key] || {}), ...data },
    };
    setSectionsData(updatedSectionsData);

    // Mark section as completed
    setCompletedSections(prev => new Set([...prev, currentSectionIndex]));

    try {
      const existing = sectionsData[key];
      const hasId = existing && (existing.id || existing._id);
      
      // If this is the patient intake form and we're creating a new report,
      // ensure we have a proper name before submission
      if (key === "patientIntake" && !hasId) {
        const currentDate = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        
        const patientName = [data.firstName, data.middleName, data.lastName]
          .filter(Boolean)
          .join(' ');
          
        const defaultReportName = `Patient Intake - ${patientName} - ${currentDate}`;
        
        if (!reportName || reportName === "Untitled Report") {
          setReportName(defaultReportName);
        }
      }

      const payload = key === "painDescriptions" 
        ? { painEvaluations: data, name: reportName }
        : { ...data, name: reportName };

      // Get the appropriate mutation function
      const mutationIndex = forms.findIndex(form => form.key === key);
      if (mutationIndex === -1) {
        throw new Error(`No mutation found for section ${key}`);
      }

      if (hasId) {
        await updaters[mutationIndex]({
          id: existing.id || existing._id,
          data: payload,
        });
      } else {
        await submitters[mutationIndex](payload);
      }
      
      if (isLast) {
        onSubmit({ 
          ...updatedSectionsData, 
          [key]: data, 
          name: reportName || defaultReportName 
        });
      } else {
        setCurrentSectionIndex((i) => i + 1);
      }
    } catch (err) {
      console.error("Error in handleSectionSubmit:", err);
    }
  };

  const { Component } = forms[currentSectionIndex];
  const painEvaluations = sectionsData.painDescriptions;
  
  // Calculate progress
  const requiredSections = forms.filter(form => form.required).length;
  const completedRequiredSections = forms
    .filter((form, index) => form.required && completedSections.has(index))
    .length;
  const progressPercentage = (completedRequiredSections / requiredSections) * 100;

  const canProceedToNext = () => {
    const currentForm = forms[currentSectionIndex];
    if (currentForm.required) {
      return completedSections.has(currentSectionIndex);
    }
    return true; // Optional sections can be skipped
  };

  return (
    <div className="relative flex flex-col md:flex-row flex-1 h-full overflow-hidden">
      {onBack && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="absolute md:left-4 md:top-4 z-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}
      {onDelete && initialData?.id && (
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(initialData.id)}
          className="absolute md:right-4 md:top-4 z-10"
        >
          <TrashIcon className="h-5 w-5" />
        </Button>
      )}
      
      {/* Enhanced Sidebar with Progress */}
      <div className="hidden md:block md:w-80 border-r p-4 overflow-y-auto max-h-full pt-16 px-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            {isPatientView ? "Your Health Report" : "Initial Report"}
          </h2>
          
          {/* Reassuring message */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Privacy First:</strong> Only patient information is required. 
              Share additional details only when you're comfortable.
            </p>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
        
        <div className="space-y-3">
          {forms.map((section, index) => {
            const isCompleted = completedSections.has(index);
            const isCurrent = index === currentSectionIndex;
            const isAccessible = index <= currentSectionIndex || isCompleted;
            
            return (
              <div
                key={section.key}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isCurrent 
                    ? 'border-primary bg-primary/5' 
                    : isCompleted 
                    ? 'border-green-200 bg-green-50' 
                    : isAccessible
                    ? 'border-gray-200 hover:border-gray-300'
                    : 'border-gray-100 opacity-50 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (isAccessible) {
                    setCurrentSectionIndex(index);
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className={`h-5 w-5 ${isCurrent ? 'text-primary' : 'text-gray-400'}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-sm font-medium truncate ${
                        isCurrent ? 'text-primary' : isCompleted ? 'text-green-700' : 'text-gray-700'
                      }`}>
                        {section.title}
                      </h3>
                      <Badge 
                        variant={section.required ? "destructive" : "secondary"} 
                        className="text-xs shrink-0"
                      >
                        {section.required ? "Required" : "Optional"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Section Navigation */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex gap-2">
            {currentSectionIndex > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentSectionIndex(i => i - 1)}
                className="flex-1"
              >
                Previous
              </Button>
            )}
            {currentSectionIndex < forms.length - 1 && (
              <Button
                variant={forms[currentSectionIndex].required && !completedSections.has(currentSectionIndex) ? "outline" : "default"}
                size="sm"
                onClick={() => {
                  if (!forms[currentSectionIndex].required || completedSections.has(currentSectionIndex)) {
                    setCurrentSectionIndex(i => i + 1);
                  }
                }}
                disabled={forms[currentSectionIndex].required && !completedSections.has(currentSectionIndex)}
                className="flex-1"
              >
                {forms[currentSectionIndex].required && !completedSections.has(currentSectionIndex) 
                  ? "Complete Patient Info" 
                  : "Next Section"
                }
              </Button>
            )}
          </div>
          
          {/* Helpful message */}
          {completedRequiredSections > 0 && (
            <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
              ✅ Patient information completed! Additional sections are optional but help provide better care.
            </div>
          )}

          {/* Final Submit Button */}
          {completedRequiredSections === requiredSections && (
            <Button
              type="button"
              variant="default"
              size="lg"
              className="w-full mt-4 bg-primary text-white hover:bg-primary/90"
              onClick={() => {
                const finalData = {
                  ...sectionsData,
                  name: reportName,
                };
                onSubmit(finalData);
              }}
            >
              Submit Report
            </Button>
          )}
        </div>
      </div>
      
      {/* Main Form Content */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto h-full">
        {/* Mobile Progress Header */}
        <div className="md:hidden mb-6">
          {/* Reassuring message for mobile */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Privacy First:</strong> Only patient information is required. 
              Share additional details only when you're comfortable.
            </p>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">
              Step {currentSectionIndex + 1} of {forms.length}
            </h2>
            <Badge 
              variant={forms[currentSectionIndex].required ? "destructive" : "secondary"}
            >
              {forms[currentSectionIndex].required ? "Required" : "Optional"}
            </Badge>
          </div>
          <h3 className="text-xl font-bold text-primary mb-1">
            {forms[currentSectionIndex].title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {forms[currentSectionIndex].description}
          </p>
          <Progress value={progressPercentage} className="h-2" />
         
        </div>

        <Component
          initialData={sectionsData[forms[currentSectionIndex].key]}
          onSubmit={handleSectionSubmit}
          onBack={
            currentSectionIndex > 0
              ? () => setCurrentSectionIndex((i) => i - 1)
              : null
          }
          isLast={currentSectionIndex === forms.length - 1}
          painEvaluations={painEvaluations}
          setPainEvaluations={(val) =>
            setSectionsData((prev) => ({ ...prev, painDescriptions: val }))
          }
          reportName={reportName}
          setReportName={setReportName}
          editingName={editingName}
          setEditingName={setEditingName}
          isPatientView={isPatientView}
        />
      </div>
    </div>
  );
}
