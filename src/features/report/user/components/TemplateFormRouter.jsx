import React from "react";
import PatientIntakeForm from "./forms/PatientIntakeForm";
import InsuranceDetailsForm from "./forms/InsuranceDetailsForm";
import PainEvaluationForm from "./forms/PainEvaluationForm";
import DetailedDescriptionForm from "./forms/DetailedDescriptionForm";
import WorkImpactForm from "./forms/WorkImpactForm";
import HealthConditionForm from "./forms/HealthConditionForm";
import InitialReportForm from "./InitialReportForm";

// Placeholder for not-yet-implemented forms
const NotImplemented = ({ formType, onBack }) => (
  <div className="p-8 text-center">
    <h2 className="text-xl font-bold mb-2">Form Not Implemented</h2>
    <p className="mb-4">The form for <b>{formType}</b> is not yet available.</p>
    <button className="btn btn-outline" onClick={onBack}>Back</button>
  </div>
);

const TemplateFormRouter = ({
  selectedTemplate = {
    id: 'unknown',
    name: 'Untitled Report',
    formType: 'InitialReportForm',
    incidentType: 'general',
    folder: 'New Report',
    description: ''
  },
  onSubmit,
  onBack,
  onDelete,
  initialData = {},
  isPatientView = false,
}) => {
  // Comprehensive null checks
  if (!selectedTemplate) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-2">No Template Selected</h2>
        <p className="mb-4">Please select a template to continue.</p>
        {onBack && (
          <button className="btn btn-outline" onClick={onBack}>Back</button>
        )}
      </div>
    );
  }

  // Ensure initialData is an object
  const safeInitialData = initialData || {};
  
  // Ensure all required template properties have default values with extra safety
  const template = {
    id: (selectedTemplate && selectedTemplate.id) || 'unknown',
    name: (selectedTemplate && selectedTemplate.name) || 'Untitled Report',
    formType: (selectedTemplate && selectedTemplate.formType) || 'InitialReportForm',
    incidentType: (selectedTemplate && selectedTemplate.incidentType) || 'general',
    folder: (selectedTemplate && selectedTemplate.folder) || 'New Report',
    description: (selectedTemplate && selectedTemplate.description) || ''
  };

  // If it's a blank report or no specific form type, show the full InitialReportForm
  if (
    !template.formType ||
    template.formType === "InitialReportForm"
  ) {
    return (
      <InitialReportForm
        onSubmit={onSubmit}
        initialData={safeInitialData}
        onBack={onBack}
        onDelete={onDelete}
        isPatientView={isPatientView}
        incidentType={template.incidentType}
      />
    );
  }

  // Common props for all form components with extra safety
  const commonProps = {
    initialData: safeInitialData,
    onSubmit: (data) => {
      // Add template metadata to the submitted data
      const submissionData = {
        ...(data || {}),
        templateInfo: {
          id: template.id || 'unknown',
          name: template.name || 'Untitled Report',
          folder: template.folder || 'New Report',
          formType: template.formType || 'InitialReportForm',
        },
      };
      onSubmit && onSubmit(submissionData);
    },
    onBack: onBack || (() => {}),
    reportName: (safeInitialData && safeInitialData.name) || template.name || 'Untitled Report',
    setReportName: () => {}, // Individual forms don't need to edit report name
    editingName: false,
    setEditingName: () => {},
    isPatientView: isPatientView || false,
  };

  // Route to the specific form component based on formType
  switch (template.formType) {
    // Legacy/old keys
    case "PatientIntakeForm":
    case "patient_info":
      return <PatientIntakeForm {...commonProps} />;
    case "InsuranceDetailsForm":
    case "auto_insurance":
    case "health_insurance":
      return <InsuranceDetailsForm {...commonProps} />;
    case "PainEvaluationForm":
    case "pain_assessment":
      return (
        <PainEvaluationForm
          {...commonProps}
          painEvaluations={
            (safeInitialData && safeInitialData.painEvaluations) || [{ painMap: {}, formData: {} }]
          }
          setPainEvaluations={() => {}}
          isLast={true}
        />
      );
    case "DetailedDescriptionForm":
    case "accident_details":
    case "work_incident_details":
    case "sports_incident_details":
    case "pain_description":
      return <DetailedDescriptionForm {...commonProps} />;
    case "WorkImpactForm":
    case "work_impact":
    case "work_status_restrictions":
    case "activity_impact":
    case "lifestyle_impact":
      return <WorkImpactForm {...commonProps} />;
    case "HealthConditionForm":
    case "medical_history":
      return <HealthConditionForm {...commonProps} isLast={true} />;
    case "injuries_symptoms":
      // You may want a dedicated InjuriesSymptomsForm, fallback for now
      return <DetailedDescriptionForm {...commonProps} />;
    case "workers_comp":
      // You may want a dedicated WorkersCompForm, fallback for now
      return <NotImplemented formType="workers_comp" onBack={onBack} />;
    default:
      // Fallback to placeholder if formType is not recognized
      return <NotImplemented formType={template.formType || 'unknown'} onBack={onBack} />;
  }
};

export default TemplateFormRouter;
