import React from "react";
import PatientIntakeForm from "./forms/PatientIntakeForm";
import InsuranceDetailsForm from "./forms/InsuranceDetailsForm";
import PainEvaluationForm from "./forms/PainEvaluationForm";
import DetailedDescriptionForm from "./forms/DetailedDescriptionForm";
import WorkImpactForm from "./forms/WorkImpactForm";
import HealthConditionForm from "./forms/HealthConditionForm";
import InitialReportForm from "./InitialReportForm";

const TemplateFormRouter = ({
  selectedTemplate,
  onSubmit,
  onBack,
  onDelete,
  initialData = {},
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
  };

  // Route to the specific form component based on formType
  switch (selectedTemplate.formType) {
    case "PatientIntakeForm":
      return <PatientIntakeForm {...commonProps} />;

    case "InsuranceDetailsForm":
      return <InsuranceDetailsForm {...commonProps} />;

    case "PainEvaluationForm":
      return (
        <PainEvaluationForm
          {...commonProps}
          painEvaluations={
            initialData.painEvaluations || [{ painMap: {}, formData: {} }]
          }
          setPainEvaluations={(evaluations) => {
            // Handle pain evaluations update if needed
    
          }}
          isLast={true}
        />
      );

    case "DetailedDescriptionForm":
      return <DetailedDescriptionForm {...commonProps} />;

    case "WorkImpactForm":
      return <WorkImpactForm {...commonProps} />;

    case "HealthConditionForm":
      return <HealthConditionForm {...commonProps} isLast={true} />;

    default:
      // Fallback to full form if formType is not recognized
      return (
        <InitialReportForm
          onSubmit={onSubmit}
          initialData={initialData}
          onBack={onBack}
          onDelete={onDelete}
        />
      );
  }
};

export default TemplateFormRouter;
