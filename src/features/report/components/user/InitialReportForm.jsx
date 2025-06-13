import React, { useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
    RenderQuesFuncs,
    RenderTextAreaQues,
    RenderRadioQues,
    RenderCheckboxQues,
    RenderOtherQues,
} from "@/utils/renderQuesFuncs";
import PATIENT_INFO from "../../../../constants/initial-reports";
import PainChartSection from "./HumanBody";

export default function InitialReportForm({onSubmit}) {
  const [formData, setFormData] = useState({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [painMap, setPainMap] = useState({});
  const [formErrors, setFormErrors] = useState({});

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

  const renderQuestion = (question) => {
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
      case "painChart":
        return (
          <fieldset key={question.id} className={baseClasses}>
            <legend className="text-sm font-medium text-muted-foreground px-2">{question.label}</legend>
            <PainChartSection painMap={painMap} setPainMap={setPainMap} />
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
        if (validate()) {
          onSubmit({formData, painMap});
        }
      }}
      className="flex flex-col md:flex-row flex-1 h-full overflow-hidden mb-8"
    >
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
            <CardTitle>{currentSection.title}</CardTitle>
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
              {currentSectionIndex < PATIENT_INFO.length - 1 ? (
                <Button onClick={() => setCurrentSectionIndex((i) => i + 1)}>Next</Button>
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
