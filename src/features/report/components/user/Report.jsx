import { useState } from "react";
import React from "react";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Info, Calendar as CalendarIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Calendar } from "@/components/ui/calendar";

import PATIENT_INFO from "../../../../constants/initial-reports";
import PainChartSection from "./HumanBody";

export default function Profile() {
    const [formData, setFormData] = useState({});
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [painMap, setPainMap] = useState({});

    const currentSection = PATIENT_INFO[currentSectionIndex];
    const filteredSections = PATIENT_INFO.filter((sec) =>
        sec.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderQuestion = (question) => {
        const commonFieldsetClasses = "border rounded-md p-4 space-y-4 mb-4";

        if (question.type === "group") {
            return (
                <fieldset key={question.id} className={commonFieldsetClasses}>
                    <legend className="text-sm font-medium text-muted-foreground px-2 flex items-center gap-2">
                        {question.label}
                        {question.extra_info && (
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <Info size={16} className="text-muted-foreground cursor-pointer" />
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

                            // Radio fields
                            if (field.type === "radio") {
                                return (
                                    <div key={field.id} className="mt-4">
                                        <Label htmlFor={field.id}>{field.label}</Label>
                                        <Select
                                            value={value}
                                            onValueChange={(val) =>
                                                setFormData((prev) => ({ ...prev, [field.id]: val }))
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
                                    </div>
                                );
                            }

                            // Date fields
                            if (field.type === "date") {
                                const raw = formData[field.id] || "";
                                // store as ISO “YYYY-MM-DD”
                                const selected = raw ? new Date(raw) : undefined;

                                return (
                                    <div key={field.id} className="mt-4 w-full">
                                        <Label htmlFor={field.id}>{field.label}</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-between"
                                                    id={field.id}
                                                >
                                                    {selected
                                                        ? selected.toLocaleDateString()
                                                        : field.placeholder || `Select ${field.label}`}
                                                    <CalendarIcon className="ml-2 h-4 w-4 opacity-60" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-2 bg-white border rounded-lg shadow-lg">
                                                <Calendar
                                                    mode="single"
                                                    selected={selected}
                                                    onSelect={(date) => {
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            [field.id]: date
                                                                ? date.toISOString().slice(0, 10)
                                                                : "",
                                                        }));
                                                    }}
                                                    className="w-full"
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                );
                            }

                            // Default text/number/tel inputs
                            return (
                                <div key={field.id} className="mt-4">
                                    <Label htmlFor={field.id}>{field.label}</Label>
                                    <Input
                                        id={field.id}
                                        type={field.type === "number" ? "number" : "text"}
                                        value={value}
                                        placeholder={field.placeholder || field.label}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                [field.id]: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>
                </fieldset>
            );
        }

        // Textarea fields
        if (question.type === "textarea") {
            return (
                <fieldset key={question.id} className={commonFieldsetClasses}>
                    <legend className="text-sm font-medium text-muted-foreground px-2 flex items-center gap-2">
                        {question.label}
                        {question.extra_info && (
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <Info size={16} className="text-muted-foreground cursor-pointer" />
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80 text-sm">
                                    {question.extra_info}
                                </HoverCardContent>
                            </HoverCard>
                        )}
                    </legend>
                    <div className="mt-4">
                        <Label htmlFor={question.id}>{question.label}</Label>
                        <textarea
                            id={question.id}
                            placeholder={question.placeholder || question.label}
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
            );
        }

        // Pain chart special case
        if (question.id === "painChart") {
            return (
                <fieldset key={question.id} className={commonFieldsetClasses}>
                    <legend className="text-sm font-medium text-muted-foreground px-2 flex items-center gap-2">
                        {question.label}
                        {question.extra_info && (
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <Info size={16} className="text-muted-foreground cursor-pointer" />
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80 text-sm">
                                    {question.extra_info}
                                </HoverCardContent>
                            </HoverCard>
                        )}
                    </legend>
                    <PainChartSection painMap={painMap} setPainMap={setPainMap} />
                </fieldset>
            );
        }

        // Radio outside group
        if (question.type === "radio") {
            return (
                <fieldset key={question.id} className={commonFieldsetClasses}>
                    <legend className="text-sm font-medium text-muted-foreground px-2 flex items-center gap-2">
                        {question.label}
                        {question.extra_info && (
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <Info size={16} className="text-muted-foreground cursor-pointer" />
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80 text-sm">
                                    {question.extra_info}
                                </HoverCardContent>
                            </HoverCard>
                        )}
                    </legend>
                    <div className="mt-4">
                        <Label>{question.label}</Label>
                        <Select
                            value={formData[question.id] || ""}
                            onValueChange={(val) =>
                                setFormData((prev) => ({ ...prev, [question.id]: val }))
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
            );
        }

        // Checkbox outside group
        if (question.type === "checkbox") {
            return (
                <fieldset key={question.id} className={commonFieldsetClasses}>
                    <legend className="text-sm font-medium text-muted-foreground px-2 flex items-center gap-2">
                        {question.label}
                        {question.extra_info && (
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <Info size={16} className="text-muted-foreground cursor-pointer" />
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80 text-sm">
                                    {question.extra_info}
                                </HoverCardContent>
                            </HoverCard>
                        )}
                    </legend>
                    <div className="space-y-2">
                        {question.options.map((opt) => (
                            <div key={opt} className="flex items-center mt-4">
                                <Checkbox
                                    id={`${question.id}-${opt}`}
                                    checked={formData[question.id]?.includes(opt)}
                                    onCheckedChange={(checked) => {
                                        setFormData((prev) => {
                                            const currentValues = prev[question.id] || [];
                                            return {
                                                ...prev,
                                                [question.id]: checked ? [...currentValues, opt] : currentValues.filter((v) => v !== opt),
                                            };
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
            );
        }

        return null;
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); console.log(formData); }}>
            <div className="flex h-screen overflow-hidden">
                <div className="w-80 border-r p-4 overflow-y-auto">
                    <h2 className="text-lg font-semibold mb-2">Initial Reports</h2>
                    <Accordion type="single" collapsible className="w-full space-y-2" value={currentSection.title}>
                        {filteredSections.map((section) => (
                            <AccordionItem key={section.id} value={section.title}>
                                <AccordionTrigger onClick={() => setCurrentSectionIndex(PATIENT_INFO.findIndex(s => s.id === section.id))}>
                                    {section.title}
                                </AccordionTrigger>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
                <div className="flex-1 p-6 overflow-y-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>{currentSection.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {currentSection.questions.map((q) => renderQuestion(q))}
                            <div className="pt-6 flex justify-end">
                                {currentSectionIndex < PATIENT_INFO.length - 1 ? (
                                    <Button type="button" onClick={() => setCurrentSectionIndex((i) => i + 1)}>
                                        Next
                                    </Button>
                                ) : (
                                    <Button type="submit">Submit</Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}