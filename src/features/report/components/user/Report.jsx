import { useState } from "react";
import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GripVertical, Info } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    HoverCard,
    HoverCardTrigger,
    HoverCardContent,
} from "@/components/ui/hover-card";

import PATIENT_INFO from "../../../../constants/initial-reports";
import PainChartSection from "./HumanBody";
import { RenderQuesFuncs,
        RenderTextAreaQues,
        RenderRadioQues,
        RenderCheckboxQues,
        RenderOtherQues }from "../../../../utils/renderQuesFuncs.jsx";
        
export default function Profile() {
    // State to manage form data,and pain map
    const [formData, setFormData] = useState({});
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [painMap, setPainMap] = useState({});

    const currentSection = PATIENT_INFO[currentSectionIndex];
    const currentQuestion = currentSection.questions[currentQuestionIndex];

    const filteredSections = PATIENT_INFO.filter((sec) =>
        sec.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Helper to render a single question (either group, textarea, or single input)
    const renderQuestion = (question) => {
        const commonFieldsetClasses = "border rounded-md p-4 space-y-4";

            if (question.type === "group") {
                // ─── 1) GROUP of sub‐fields ───
                return <RenderQuesFuncs question={question} formData={formData} setFormData={setFormData} commonFieldsetClasses={commonFieldsetClasses} />;
            } else if(question.type === "textarea" ) {
                return <RenderTextAreaQues question={question} formData={formData} setFormData={setFormData} commonFieldsetClasses={commonFieldsetClasses} />;
            } else if( question.id === "painChart" ) {
                // ─── 3) PAIN CHART SPECIAL CASE ───
                return (
                <fieldset key={question.id} className={commonFieldsetClasses}>
                    <legend className="text-sm font-medium text-muted-foreground px-2 flex items-center gap-2">
                        {question.label}
                        {question.extra_info && (
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <Info
                                        size={16}
                                        className="text-muted-foreground cursor-pointer"
                                    />
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80 text-sm">
                                    {question.extra_info}
                                </HoverCardContent>
                            </HoverCard>
                        )}
                    </legend>
                    <PainChartSection painMap={painMap} setPainMap={setPainMap} />
                </fieldset>
                )
            } else if ( question.type === "radio" ) {
                return <RenderRadioQues question={question} formData={formData} setFormData={setFormData} commonFieldsetClasses={commonFieldsetClasses} />;
            } if( question.type === "checkbox" ) {
                return <RenderCheckboxQues question={question} formData={formData} setFormData={setFormData} commonFieldsetClasses={commonFieldsetClasses} />;
            }else {
                return <RenderOtherQues question={question} formData={formData} setFormData={setFormData} commonFieldsetClasses={commonFieldsetClasses} />;
            };
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 border-r p-4 overflow-y-auto">
                <h2 className="text-lg font-semibold mb-2">Initial Reports</h2>
                <Accordion type="single" collapsible className="w-full space-y-2" value={PATIENT_INFO[currentSectionIndex]?.title}>
                    {filteredSections.map((section, idx) => (
                        <AccordionItem key={section.id} value={section.title}>
                            <AccordionTrigger
                                onClick={() => {
                                    // Find the index in the original PATIENT_INFO array
                                    const realIdx = PATIENT_INFO.findIndex(s => s.id === section.id);
                                    if (realIdx !== -1) setCurrentSectionIndex(realIdx);
                                }}
                            >
                                {section.title}
                            </AccordionTrigger>
                            <AccordionContent>
                               
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
                        <div className="flex-1 p-6 overflow-y-auto">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Patient Intake Form</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    {/* Only show the current section */}
                                    <section key={currentSection.id}>
                                        <h3 className="text-xl font-semibold mb-4">
                                            {currentSection.title}
                                        </h3>
                                        {/* Loop over every question in the current section */}
                                        {currentSection.questions.map((question) => renderQuestion(question))}
                                        <div className="pt-6 flex justify-end">
                                            {currentSectionIndex < PATIENT_INFO.length - 1 ? (
                                                <Button
                                                    onClick={() => setCurrentSectionIndex((idx) => idx + 1)}
                                                >
                                                    Next
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={() => {
                                                        console.log("Submit all form data:", formData);
                                                        // → Here you would typically do your API call or validation
                                                    }}
                                                >
                                                    Submit
                                                </Button>
                                            )}
                                        </div>
                                    </section>
                                </CardContent>
                            </Card>

                 
            </div>
        </div>
    );
}
