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

import UnifiedPatientForm from "./UnifiedPatientForm";
import {
  useSubmitPatientInfoFormMutation,
  useSubmitHealthInsuranceFormMutation,
  useSubmitPainDescriptionFormNewMutation,
  useSubmitPainAssessmentFormNewMutation,
  useSubmitMedicalHistoryFormNewMutation,
  useSubmitLifestyleImpactFormNewMutation,
} from "@/api/services/reportApi";

// Define form configurations based on incident type
const getFormsByIncidentType = (incidentType) => {
  // All incident types now use the unified form
  const baseConfig = {
    car_accident: [
      {
        key: "unified_form",
        title: "Complete Accident & Patient Information",
        Component: UnifiedPatientForm,
        required: true,
        description: "All patient and accident details in one comprehensive form"
      }
    ],
    work_injury: [
      {
        key: "unified_form",
        title: "Complete Work Injury & Patient Information",
        Component: UnifiedPatientForm,
        required: true,
        description: "All patient and work injury details in one comprehensive form"
      }
    ],
    general_pain: [
      {
        key: "unified_form",
        title: "Complete Patient Information",
        Component: UnifiedPatientForm,
        required: true,
        description: "All patient details in one comprehensive form"
      }
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
  incidentId = null, // Add incidentId prop
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

  const [saveIncidentForm] = useSaveIncidentFormMutation();

  useEffect(() => {
    if (initialData) {
      setSectionsData({
        patientIntake: initialData.patientIntake || {},
        insuranceDetails: initialData.insuranceDetails || {},
        painDescriptions: initialData.painEvaluations || [
          { painMap: {}, formData: {} },
        ],
        detailsDescriptions: initialData.detailsDescriptions || {},
        workImpact: initialData.workImpact || {},
        healthConditions: initialData.healthConditions || {},
      });
      if (initialData.name) setReportName(initialData.name);
    }
  }, [initialData]);

  const handleSectionSubmit = async (data) => {
    const { key } = forms[currentSectionIndex];
    const isLast = currentSectionIndex === forms.length - 1;

    console.log('🚀 Individual Form Submission:', {
      sectionKey: key,
      formData: data,
      incidentId: incidentId,
      isLastSection: isLast
    });

    // Mark section as completed immediately
    setCompletedSections(prev => new Set([...prev, currentSectionIndex]));

    try {
      // Always use incident-based API for individual form submissions
      if (!incidentId) {
        throw new Error("No incident ID provided - cannot submit form");
      }

      // Prepare form data for this specific section
      const formData = {
        ...data,
        section: key,
        form_name: forms[currentSectionIndex].title
      };

      console.log('📤 Submitting Single Form to Server:', {
        incidentId: incidentId,
        formType: key,
        formData: formData,
        endpoint: `POST /incidents/${incidentId}/forms`
      });

      // Submit this individual form to the incident
      const response = await saveIncidentForm({
        incidentId: incidentId,
        formType: key,
        formData: formData,
        isCompleted: true,
        isRequired: forms[currentSectionIndex].required || false
      }).unwrap();

      console.log('✅ Individual Form Submitted Successfully:', {
        formType: key,
        response: response
      });

      // Update local sections data for UI purposes
      setSectionsData(prev => ({
        ...prev,
        [key]: { ...data, submitted: true, submission_id: response?.data?.id }
      }));

      // Move to next section or finish
      if (isLast) {
        console.log('🏁 All Forms Completed - Calling onSubmit');
        onSubmit({
          message: 'All forms submitted successfully',
          incidentId: incidentId,
          completedSections: Array.from(completedSections)
        });
      } else {
        console.log('➡️ Moving to next form section');
        setCurrentSectionIndex((i) => i + 1);
      }

    } catch (err) {
      console.error("❌ Error submitting individual form:", err);
      
      // Remove from completed sections on error
      setCompletedSections(prev => {
        const newSet = new Set(prev);
        newSet.delete(currentSectionIndex);
        return newSet;
      });
      
      throw err;
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
          userIncidents={incidentId ? [{ id: incidentId }] : []}
          onComplete={(data) => {
            // Handle unified form completion
            const finalData = {
              ...data,
              name: reportName,
            };
            onSubmit(finalData);
          }}
          onBack={onBack}
        />
      </div>
    </div>
  );
}
