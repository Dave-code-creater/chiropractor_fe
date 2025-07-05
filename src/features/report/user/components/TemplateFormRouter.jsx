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
  selectedTemplate,
  onSubmit,
  onBack,
  onDelete,
  initialData = {},
  isPatientView = false,
}) => {
  // If it's a blank report or no specific form type, show the full InitialReportForm
  if (
    !selectedTemplate?.formType ||
    selectedTemplate.formType === "InitialReportForm"
  ) {
    return (
      <InitialReportForm
        onSubmit={onSubmit}
        initialData={initialData}
        onBack={onBack}
        onDelete={onDelete}
        isPatientView={isPatientView}
      />
    );
  }

  // Common props for all form components
  const commonProps = {
    initialData: initialData,
    onSubmit: (data) => {
      // Add template metadata to the submitted data
      const submissionData = {
        ...data,
        templateInfo: {
          id: selectedTemplate.id,
          name: selectedTemplate.name,
          folder: selectedTemplate.folder,
          formType: selectedTemplate.formType,
        },
      };
      onSubmit(submissionData);
    },
    onBack,
    reportName: initialData.name || selectedTemplate.name,
    setReportName: () => {}, // Individual forms don't need to edit report name
    editingName: false,
    setEditingName: () => {},
    isPatientView,
  };

  // Route to the specific form component based on formType
  switch (selectedTemplate.formType) {
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
            initialData.painEvaluations || [{ painMap: {}, formData: {} }]
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
      return <NotImplemented formType={selectedTemplate.formType} onBack={onBack} />;
  }
};

export default TemplateFormRouter;
