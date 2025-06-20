import React, { useState, useEffect } from "react";
import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import PatientIntakeForm from "./forms/PatientIntakeForm";
import InsuranceDetailsForm from "./forms/InsuranceDetailsForm";
import PainEvaluationForm from "./forms/PainEvaluationForm";
import DetailedDescriptionForm from "./forms/DetailedDescriptionForm";
import WorkImpactForm from "./forms/WorkImpactForm";
import HealthConditionForm from "./forms/HealthConditionForm";
import {
  useSubmitPatientIntakeMutation,
  useSubmitInsuranceDetailsMutation,
  useSubmitPainDescriptionMutation,
  useSubmitDetailsDescriptionMutation,
  useSubmitRecoveryMutation,
  useSubmitWorkImpactMutation,
  useSubmitHealthConditionMutation,
  useGetInitialReportQuery,
} from "@/services/reportApi";

const forms = [
  {
    key: "patientIntake",
    title: "Patient Intake Form",
    Component: PatientIntakeForm,
  },
  {
    key: "insuranceDetails",
    title: "Accident & Insurance Details",
    Component: InsuranceDetailsForm,
  },
  {
    key: "painDescriptions",
    title: "Pain & Symptom Evaluation",
    Component: PainEvaluationForm,
  },
  {
    key: "detailsDescriptions",
    title: "Detailed Symptom Description",
    Component: DetailedDescriptionForm,
  },
  {
    key: "workImpact",
    title: "Recovery and Work Impact",
    Component: WorkImpactForm,
  },
  {
    key: "healthConditions",
    title: "Extended Health History",
    Component: HealthConditionForm,
  },
];

export default function InitialReportForm({ onSubmit, initialData = {}, onBack }) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sectionsData, setSectionsData] = useState({
    patientIntake: initialData.patientIntake || {},
    insuranceDetails: initialData.insuranceDetails || {},
    painDescriptions: initialData.painEvaluations || [{ painMap: {}, formData: {} }],
    detailsDescriptions: initialData.detailsDescriptions || {},
    workImpact: initialData.workImpact || {},
    healthConditions: initialData.healthConditions || {},
  });
  const [reportName, setReportName] = useState(initialData.name || "");
  const [editingName, setEditingName] = useState(false);

  const [submitPatientIntake] = useSubmitPatientIntakeMutation();
  const [submitInsuranceDetails] = useSubmitInsuranceDetailsMutation();
  const [submitPainDescription] = useSubmitPainDescriptionMutation();
  const [submitDetailsDescription] = useSubmitDetailsDescriptionMutation();
  const [submitRecovery] = useSubmitRecoveryMutation();
  const [submitWorkImpact] = useSubmitWorkImpactMutation();
  const [submitHealthCondition] = useSubmitHealthConditionMutation();
  const { data: fetchedData } = useGetInitialReportQuery();

  useEffect(() => {
    if (fetchedData) {
      setSectionsData({
        patientIntake: fetchedData.patientIntake || {},
        insuranceDetails: fetchedData.insuranceDetails || {},
        painDescriptions: fetchedData.painDescriptions || [{ painMap: {}, formData: {} }],
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
    submitRecovery,
    submitWorkImpact,
    submitHealthCondition,
  ];

  const handleSectionSubmit = async (data) => {
    const { key } = forms[currentSectionIndex];
    const isLast = currentSectionIndex === forms.length - 1;

    setSectionsData((prev) => ({ ...prev, [key]: data }));

    try {
      if (key === "painDescriptions") {
        await submitters[currentSectionIndex]({ painEvaluations: data, name: reportName });
      } else {
        await submitters[currentSectionIndex]({ formData: data, name: reportName });
      }
      if (isLast) {
        onSubmit({ ...sectionsData, [key]: data, name: reportName });
      } else {
        setCurrentSectionIndex((i) => i + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const { Component } = forms[currentSectionIndex];
  const painEvaluations = sectionsData.painDescriptions;

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
      <div className="hidden md:block md:w-80 border-r p-4 overflow-y-auto max-h-full pt-16 px-8">
        <h2 className="text-lg font-semibold mb-4">Initial Reports</h2>
        <Accordion type="single" collapsible className="space-y-2" value={forms[currentSectionIndex].title}>
          {forms.map((section) => (
            <AccordionItem key={section.key} value={section.title}>
              <AccordionTrigger className="text-sm font-medium">
                {section.title}
              </AccordionTrigger>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div className="flex-1 p-4 md:p-6 overflow-y-auto h-full">
        <Component
          initialData={sectionsData[forms[currentSectionIndex].key]}
          onSubmit={handleSectionSubmit}
          onBack={currentSectionIndex > 0 ? () => setCurrentSectionIndex((i) => i - 1) : null}
          isLast={currentSectionIndex === forms.length - 1}
          painEvaluations={painEvaluations}
          setPainEvaluations={(val) => setSectionsData((prev) => ({ ...prev, painDescriptions: val }))}
          reportName={reportName}
          setReportName={setReportName}
          editingName={editingName}
          setEditingName={setEditingName}
        />
      </div>
    </div>
  );
}
