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

        return question.type === "group" ? (
            // ─── 1) GROUP of sub‐fields ───
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {question.fields.map((field) => {
                        const value = formData[field.id] || "";
                        return (
                            <div key={field.id}>
                                <div className="flex items-center gap-1">
                                    <Label htmlFor={field.id}>{field.label}</Label>
                                    {field.extra_info && (
                                        <HoverCard>
                                            <HoverCardTrigger asChild>
                                                <Info
                                                    size={14}
                                                    className="text-muted-foreground cursor-pointer"
                                                />
                                            </HoverCardTrigger>
                                            <HoverCardContent className="w-72 text-sm">
                                                {field.extra_info}
                                            </HoverCardContent>
                                        </HoverCard>
                                    )}
                                </div>

                                {field.type === "radio" ? (
                                    <Select
                                        value={value}
                                        onValueChange={(val) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                [field.id]: val,
                                            }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={`Select ${field.label}`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {field.options.map((opt) => (
                                                <SelectItem key={opt} value={opt}>
                                                    {opt}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        id={field.id}
                                        type={field.type === "number" ? "number" : "text"}
                                        value={value}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                [field.id]: e.target.value,
                                            }))
                                        }
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </fieldset>
        ) : question.type === "textarea" ? (
            // ─── 2) TEXTAREA ───
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
                <div>
                    <Label htmlFor={question.id}>{question.label}</Label>
                    <textarea
                        id={question.id}
                        className="w-full border rounded px-3 py-2"
                        rows={4}
                        value={formData[question.id] || ""}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                [question.id]: e.target.value,
                            }))
                        }
                    />
                </div>
            </fieldset>
        ) : question.id === "painChart" ? (
            // ─── 3) PAIN CHART SPECIAL CASE ───
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
        ) : question.type === "radio" ? (
            // ─── 4) RADIO (single‐select) ───
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
                <div>
                    <Label>{question.label}</Label>
                    <Select
                        value={formData[question.id] || ""}
                        onValueChange={(val) =>
                            setFormData((prev) => ({
                                ...prev,
                                [question.id]: val,
                            }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={`Select ${question.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {question.options.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                    {opt}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </fieldset>
        ) : question.type === "checkbox" ? (
            // ─── 5) CHECKBOX (multi‐select) ───
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
                <div className="space-y-2">
                    {question.options.map((opt) => (
                        <div key={opt}>
                            <Checkbox
                                id={`${question.id}-${opt}`}
                                checked={formData[question.id]?.includes(opt)}
                                onCheckedChange={(checked) => {
                                    setFormData((prev) => {
                                        const currentValues = prev[question.id] || [];
                                        if (checked) {
                                            return {
                                                ...prev,
                                                [question.id]: [...currentValues, opt],
                                            };
                                        } else {
                                            return {
                                                ...prev,
                                                [question.id]: currentValues.filter(
                                                    (v) => v !== opt
                                                ),
                                            };
                                        }
                                    });
                                }}
                            />
                            <Label htmlFor={`${question.id}-${opt}`} className="ml-2">
                                {opt}
                            </Label>
                        </div>
                    ))}
                </div>
            </fieldset>
        ) : (
            // ─── 5) DEFAULT: Simple text or number <Input> ───
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
                <div>
                    <Label htmlFor={question.id}>{question.label}</Label>
                    <Input
                        id={question.id}
                        type={question.type === "number" ? "number" : "text"}
                        value={formData[question.id] || ""}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                [question.id]: e.target.value,
                            }))
                        }
                    />
                </div>
            </fieldset>
        );
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
