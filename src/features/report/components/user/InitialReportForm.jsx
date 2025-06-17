import React, { useState, useEffect } from "react";
import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

import {
  RenderQuesFuncs,
  RenderTextAreaQues,
  RenderRadioQues,
  RenderCheckboxQues,
  RenderOtherQues,
} from "@/utils/renderQuesFuncs";
import PATIENT_INFO from "../../../../constants/initial-reports";
import PainChartSection from "./HumanBody";
import {
  useSubmitPatientIntakeMutation,
  useSubmitAccidentDetailsMutation,
  useSubmitPainEvaluationMutation,
  useSubmitSymptomDescriptionMutation,
  useSubmitRecoveryImpactMutation,
  useSubmitHealthHistoryMutation,
  useGetInitialReportQuery,
} from "@/services/reportApi";

const collectFieldIds = (questions) => {
  const ids = [];
  questions.forEach((q) => {
    if (q.type === "group") {
      q.fields.forEach((f) => ids.push(f.id))
    } else if (q.type !== "image-map") {
      ids.push(q.id)
    }
  })
  return ids
}

const sectionFieldIds = PATIENT_INFO.map((section) =>
  collectFieldIds(section.questions)
)

export default function InitialReportForm({ onSubmit, initialData = {}, onBack, requiredFields = [] }) {
  const [submitPatientIntake] = useSubmitPatientIntakeMutation();
  const [submitAccidentDetails] = useSubmitAccidentDetailsMutation();
  const [submitPainEvaluation] = useSubmitPainEvaluationMutation();
  const [submitSymptomDescription] = useSubmitSymptomDescriptionMutation();
  const [submitRecoveryImpact] = useSubmitRecoveryImpactMutation();
  const [submitHealthHistory] = useSubmitHealthHistoryMutation();
  const { data: fetchedData } = useGetInitialReportQuery();
  const [formData, setFormData] = useState({
    currentlyWorking: "none",
    drinkStatus: "none",
    ...(initialData.formData || {}),
  });
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [painEvaluations, setPainEvaluations] = useState(
    initialData.painEvaluations || [{ painMap: {}, formData: {} }]
  );
  const [reportName, setReportName] = useState(initialData.name || "");
  const [editingName, setEditingName] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (fetchedData) {
      setFormData((prev) => ({
        ...prev,
        ...(fetchedData.patientIntake || {}),
        ...(fetchedData.accidentDetails || {}),
        ...(fetchedData.symptomDescription || {}),
        ...(fetchedData.recoveryImpact || {}),
        ...(fetchedData.healthHistory || {}),
      }));
      if (fetchedData.painEvaluations) {
        setPainEvaluations(fetchedData.painEvaluations);
      }
      if (fetchedData.name) {
        setReportName(fetchedData.name);
      }
    }
  }, [fetchedData]);


  const currentSection = PATIENT_INFO[currentSectionIndex];
  const baseClasses = "border rounded-md p-4 space-y-4 mb-4 bg-white shadow-sm";

  const validate = () => {
    const errs = {};
    requiredFields.forEach((f) => {
      if (!formData[f] || String(formData[f]).trim() === "") {
        errs[f] = "This field is required";
      }
    });
    if (formData.ssn && !/^\d{3}-\d{2}-\d{4}$/.test(formData.ssn)) {
      errs.ssn = "Invalid SSN format";
    }
    const phoneFields = Object.keys(formData).filter((k) => k.toLowerCase().includes("phone"));
    phoneFields.forEach((field) => {
      if (formData[field] && !/^(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/.test(formData[field])) {
        errs[field] = "Invalid phone number";
      }
    });
    const dateFields = ["dob", "accidentDate"];
    dateFields.forEach((field) => {
      if (formData[field]) {
        const d = new Date(formData[field]);
        if (isNaN(d)) errs[field] = "Invalid date";
      }
    });
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };


  const submitters = [
    submitPatientIntake,
    submitAccidentDetails,
    submitPainEvaluation,
    submitSymptomDescription,
    submitRecoveryImpact,
    submitHealthHistory,
  ];

  const handleSectionSubmit = async () => {
    if (!validate()) return;
    const fields = sectionFieldIds[currentSectionIndex];
    const subset = {};
    fields.forEach((f) => {
      if (formData[f] !== undefined) subset[f] = formData[f];
    });
    try {
      if (currentSection.id === "3") {
        await submitters[currentSectionIndex]({ painEvaluations, name: reportName });
      } else {
        await submitters[currentSectionIndex]({ formData: subset, name: reportName });
      }
      if (currentSectionIndex === PATIENT_INFO.length - 1) {
        const sectionData = PATIENT_INFO.map((_, idx) => {
          const ids = sectionFieldIds[idx]
          const obj = {}
          ids.forEach((id) => {
            if (formData[id] !== undefined) obj[id] = formData[id]
          })
          return obj
        })
        onSubmit({
          patientIntake: sectionData[0],
          accidentDetails: sectionData[1],
          painEvaluations,
          symptomDescription: sectionData[3],
          recoveryImpact: sectionData[4],
          healthHistory: sectionData[5],
          name: reportName,
        })
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderQuestion = (question) => {
    if (
      question.id === "femaleOnly" ||
      question.id === "femaleOnlyDetails"
    ) {
      if (!formData.gender || formData.gender.toLowerCase() !== "female") {
        return null;
      }
    }
    switch (question.type) {
      case "group":
        return (
          <RenderQuesFuncs
            key={question.id}
            question={question}
            formData={formData}
            setFormData={setFormData}
            commonFieldsetClasses={baseClasses}
            errors={formErrors}
          />
        );
      case "textarea":
        return (
          <RenderTextAreaQues
            key={question.id}
            question={question}
            formData={formData}
            setFormData={setFormData}
            commonFieldsetClasses={baseClasses}
            errors={formErrors}
          />
        );
      case "radio":
        return (
          <RenderRadioQues
            key={question.id}
            question={question}
            formData={formData}
            setFormData={setFormData}
            commonFieldsetClasses={baseClasses}
            errors={formErrors}
          />
        );
      case "checkbox":
        return (
          <RenderCheckboxQues
            key={question.id}
            question={question}
            formData={formData}
            setFormData={setFormData}
            commonFieldsetClasses={baseClasses}
            errors={formErrors}
          />
        );
      case "other":
        return (
          <RenderOtherQues
            key={question.id}
            question={question}
            formData={formData}
            setFormData={setFormData}
            commonFieldsetClasses={baseClasses}
            errors={formErrors}
          />
        );
      case "image-map":
        return (
          <fieldset key={question.id} className={baseClasses}>
            <legend className="text-sm font-medium text-muted-foreground px-2">{question.label}</legend>
            {painEvaluations.map((ev, idx) => (
              <div key={idx} className="mb-8">
                <PainChartSection
                  gender={formData.gender}
                  painMap={ev.painMap}
                  setPainMap={(updater) =>
                    setPainEvaluations((prev) => {
                      const list = [...prev];
                      const current = list[idx];
                      const newMap =
                        typeof updater === "function"
                          ? updater(current.painMap || {})
                          : updater;
                      list[idx] = { ...current, painMap: newMap };
                      return list;
                    })
                  }
                  formData={ev.formData}
                  setFormData={(updater) =>
                    setPainEvaluations((prev) => {
                      const list = [...prev];
                      const current = list[idx];
                      const newData =
                        typeof updater === "function"
                          ? updater(current.formData || {})
                          : updater;
                      list[idx] = { ...current, formData: newData };
                      return list;
                    })
                  }
                />
              </div>
            ))}
          </fieldset>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative flex flex-col md:flex-row flex-1 h-full overflow-hidden mb-8">
      {onBack && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="absolute left-2 top-2 md:left-4 md:top-4 z-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}
      <div className="hidden md:block md:w-80 border-r p-4 overflow-y-auto max-h-full">
        <h2 className="text-lg font-semibold mb-4">Initial Reports</h2>
        <Accordion type="single" collapsible className="space-y-2" value={currentSection.title}>
          {PATIENT_INFO.map((section, idx) => (
            <AccordionItem key={section.id} value={section.title} onClick={() => setCurrentSectionIndex(idx)}>
              <AccordionTrigger>{section.title}</AccordionTrigger>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div className="flex-1 p-4 md:p-6 overflow-y-auto h-full">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSectionSubmit();
          }}
        >
          <Card>
            <CardHeader>
              {editingName ? (
                <Input
                  autoFocus
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  onBlur={() => setEditingName(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setEditingName(false);
                    }
                  }}
                  className="mt-1"
                />
              ) : (
                <CardTitle onClick={() => setEditingName(true)} className="cursor-pointer">
                  {reportName || "Untitled Report"}
                </CardTitle>
              )}
              <p className="text-sm text-muted-foreground mt-1">{currentSection.title}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.values(formErrors).length > 0 && (
                <div className="text-red-500 text-sm space-y-1">
                  {Object.entries(formErrors).map(([k, v]) => (
                    <div key={k}>{v}</div>
                  ))}
                </div>
              )}
              {currentSection.questions.map((q) => renderQuestion(q))}
              <div className="flex justify-between pt-4">
                {currentSectionIndex > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentSectionIndex((i) => i - 1)}
                  >
                    Previous
                  </Button>
                )}
                <div className="space-x-2">
                  {/* show Next if not at last */}
                  {currentSectionIndex < PATIENT_INFO.length - 1 && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setCurrentSectionIndex(i => i + 1)}
                    >
                      Next
                    </Button>
                  )}

                  {/* show Save on the last section */}
                  {currentSectionIndex === PATIENT_INFO.length - 1 && (
                    <Button type="submit">Save Section</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

