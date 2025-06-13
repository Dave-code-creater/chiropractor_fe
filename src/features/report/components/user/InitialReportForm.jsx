import React, { useState } from "react";
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
} from "@/services/api";

export default function InitialReportForm({ onSubmit, initialData = {}, onBack }) {
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

  const [submitSection1] = useSubmitPatientIntakeMutation();
  const [submitSection2] = useSubmitAccidentDetailsMutation();
  const [submitSection3] = useSubmitPainEvaluationMutation();
  const [submitSection4] = useSubmitSymptomDescriptionMutation();
  const [submitSection5] = useSubmitRecoveryImpactMutation();
  const [submitSection6] = useSubmitHealthHistoryMutation();

  const currentSection = PATIENT_INFO[currentSectionIndex];
  const baseClasses = "border rounded-md p-4 space-y-4 mb-4 bg-white shadow-sm";

  const validate = () => {
    const errs = {};
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

  const collectSectionData = () => {
    const data = {};
    currentSection.questions.forEach((q) => {
      if (q.type === "group") {
        q.fields.forEach((f) => {
          if (formData[f.id] !== undefined) data[f.id] = formData[f.id];
        });
      } else if (q.type === "image-map") {
        data.painEvaluations = painEvaluations;
      } else if (formData[q.id] !== undefined) {
        data[q.id] = formData[q.id];
      }
    });
    data.name = reportName;
    return data;
  };

  const submitters = [
    submitSection1,
    submitSection2,
    submitSection3,
    submitSection4,
    submitSection5,
    submitSection6,
  ];

  const handleSectionSubmit = async () => {
    if (!validate()) return;
    const data = collectSectionData();
    const submit = submitters[currentSectionIndex];
    try {
      await submit(data).unwrap();
      if (currentSectionIndex < PATIENT_INFO.length - 1) {
        setCurrentSectionIndex((i) => i + 1);
      } else {
        onSubmit({ formData, painEvaluations, name: reportName });
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSectionSubmit();
      }}
      className="relative flex flex-col md:flex-row flex-1 h-full overflow-hidden mb-8"
    >
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
                {Object.entries(formErrors).map(([k,v]) => (
                  <div key={k}>{v}</div>
                ))}
              </div>
            )}
            {currentSection.questions.map((q) => renderQuestion(q))}
            <div className="flex justify-end pt-4">
              <Button type="submit">
                {currentSectionIndex < PATIENT_INFO.length - 1 ? "Next" : "Submit"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}

