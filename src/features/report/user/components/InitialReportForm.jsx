// src/features/report/user/components/InitialReportForm.jsx
// ────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useMemo } from "react";
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
import PATIENT_INFO from "@/constants/initial-reports";
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

export default function InitialReportForm({ onSubmit, initialData = {}, onBack }) {
  // 1️⃣ collect every field‐ID with required:true
  const requiredFieldIds = useMemo(
    () =>
      PATIENT_INFO.flatMap((section) =>
        section.questions.flatMap((q) => {
          if (q.type === "group") {
            return q.fields.filter((f) => f.required).map((f) => f.id);
          }
          return q.required ? [q.id] : [];
        })
      ),
    []
  );

  // 2️⃣ build a lookup from ID → label for nice messages
  const fieldLabelMap = useMemo(() => {
    const map = {};
    PATIENT_INFO.forEach((section) =>
      section.questions.forEach((q) => {
        if (q.type === "group") {
          q.fields.forEach((f) => {
            map[f.id] = f.label;
          });
        } else {
          map[q.id] = q.label;
        }
      })
    );
    return map;
  }, []);

  // RTK hooks…
  const [submitPatientIntake] = useSubmitPatientIntakeMutation();
  const [submitAccidentDetails] = useSubmitAccidentDetailsMutation();
  const [submitPainEvaluation] = useSubmitPainEvaluationMutation();
  const [submitSymptomDescription] = useSubmitSymptomDescriptionMutation();
  const [submitRecoveryImpact] = useSubmitRecoveryImpactMutation();
  const [submitHealthHistory] = useSubmitHealthHistoryMutation();
  const { data: fetchedData } = useGetInitialReportQuery();

  // local state…
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

  // hydrate from API
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
      if (fetchedData.painEvaluations) setPainEvaluations(fetchedData.painEvaluations);
      if (fetchedData.name) setReportName(fetchedData.name);
    }
  }, [fetchedData]);

  const currentSection = PATIENT_INFO[currentSectionIndex];
  const baseClasses = "border rounded-md p-4 space-y-4 mb-4 bg-white shadow-sm";

  // 3️⃣ validate using label‐aware messages
  const validate = () => {
    const errs = {};
    requiredFieldIds.forEach((id) => {
      if (!formData[id] || String(formData[id]).trim() === "") {
        // use our map to say "First is required" instead of generic
        errs[id] = `${fieldLabelMap[id]} is required`;
      }
    });

    // SSN format
    if (formData.ssn && !/^\d{3}-\d{2}-\d{4}$/.test(formData.ssn)) {
      errs.ssn = "Invalid SSN format";
    }
    // phone
    Object.keys(formData)
      .filter((k) => k.toLowerCase().includes("phone"))
      .forEach((field) => {
        if (
          formData[field] &&
          !/^(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/.test(formData[field])
        ) {
          errs[field] = "Invalid phone number";
        }
      });
    // date parsing
    ["dob", "accidentDate"].forEach((field) => {
      if (formData[field] && isNaN(new Date(formData[field]))) {
        errs[field] = "Invalid date";
      }
    });

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // collect IDs per section for partial submits
  const sectionFieldIds = useMemo(
    () =>
      PATIENT_INFO.map((section) =>
        section.questions.reduce((acc, q) => {
          if (q.type === "group") acc.push(...q.fields.map((f) => f.id));
          else acc.push(q.id);
          return acc;
        }, [])
      ),
    []
  );

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

    // grab only this section's fields
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

      // last section: fire onSubmit
      const isLast = currentSectionIndex === PATIENT_INFO.length - 1;
      if (isLast) {
        const allSections = sectionFieldIds.map((ids) => {
          const obj = {};
          ids.forEach((id) => {
            if (formData[id] !== undefined) obj[id] = formData[id];
          });
          return obj;
        });
        onSubmit({
          patientIntake: allSections[0],
          accidentDetails: allSections[1],
          painEvaluations,
          symptomDescription: allSections[3],
          recoveryImpact: allSections[4],
          healthHistory: allSections[5],
          name: reportName,
        });
      } else {
        setCurrentSectionIndex((i) => i + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderQuestion = (question) => {
    // female-only skip logic
    if (
      (question.id === "femaleOnly" || question.id === "femaleOnlyDetails") &&
      formData.gender?.toLowerCase() !== "female"
    ) {
      return null;
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
            <legend className="text-sm font-medium text-muted-foreground px-2">
              {question.label}
            </legend>
            {painEvaluations.map((ev, idx) => (
              <div key={idx} className="mb-8">
                <PainChartSection
                  gender={formData.gender}
                  painMap={ev.painMap}
                  setPainMap={(updater) =>
                    setPainEvaluations((prev) => {
                      const list = [...prev];
                      const curr = list[idx];
                      const newMap =
                        typeof updater === "function"
                          ? updater(curr.painMap || {})
                          : updater;
                      list[idx] = { ...curr, painMap: newMap };
                      return list;
                    })
                  }
                  formData={ev.formData}
                  setFormData={(updater) =>
                    setPainEvaluations((prev) => {
                      const list = [...prev];
                      const curr = list[idx];
                      const newData =
                        typeof updater === "function"
                          ? updater(curr.formData || {})
                          : updater;
                      list[idx] = { ...curr, formData: newData };
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
      {/* Sidebar Accordion */}
      <div className="hidden md:block md:w-80 border-r p-4 overflow-y-auto max-h-full pt-16 px-8">
        <h2 className="text-lg font-semibold mb-4">Initial Reports</h2>
        <Accordion type="single" collapsible className="space-y-2" value={currentSection.title}>
          {PATIENT_INFO.map((section) => (
            <AccordionItem key={section.id} value={section.title}>
              <AccordionTrigger className="text-sm font-medium">
                {section.title}
              </AccordionTrigger>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Main Form */}
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
              {/* ▶️ Top‐of‐form summary of missing fields */}
              {Object.keys(formErrors).length > 0 && (
                <div className="text-red-500 text-sm mb-4">
                  <p>Please fill out these required fields:</p>
                  <ul className="list-disc list-inside ml-4">
                    {Object.keys(formErrors).map((id) => (
                      <li key={id}>{formErrors[id]}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Render the section’s questions */}
              {currentSection.questions.map((q) => renderQuestion(q))}

              {/* Navigation buttons */}
              <div className="flex justify-between pt-4">
                {currentSectionIndex > 0 && (
                  <Button type="button" variant="outline" onClick={() => setCurrentSectionIndex((i) => i - 1)}>
                    Previous
                  </Button>
                )}
                <div className="space-x-2">
                  {currentSectionIndex < PATIENT_INFO.length - 1 && (
                    <Button type="button" variant="secondary" onClick={() => setCurrentSectionIndex((i) => i + 1)}>
                      Next
                    </Button>
                  )}
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