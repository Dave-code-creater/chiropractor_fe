import { useState } from "react";
import React from "react";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
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

import { REPORT_FORMS } from "../../../../constants/initial-reports";
import { formatPhone, formatSIN, formatDate } from "@/utily/format";
import PainChartSection from "./HumanBody";

export default function Profile() {
    // State to manage form data,and pain map
    const [formData, setFormData] = useState({});
    const [painMap, setPainMap] = useState({});

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
                                        onChange={(e) => {
                                            let val = e.target.value;
                                            if (field.type === "tel") {
                                                val = formatPhone(val);
                                            } else if (field.id.toLowerCase().includes("ssn")) {
                                                val = formatSIN(val);
                                            } else if (field.id.toLowerCase().includes("date")) {
                                                val = formatDate(val);
                                            }
                                            setFormData((prev) => ({
                                                ...prev,
                                                [field.id]: val,
                                            }));
                                        }}
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
                        onChange={(e) => {
                            let val = e.target.value;
                            if (question.type === "tel") {
                                val = formatPhone(val);
                            } else if (question.id.toLowerCase().includes("ssn")) {
                                val = formatSIN(val);
                            } else if (question.id.toLowerCase().includes("date")) {
                                val = formatDate(val);
                            }
                            setFormData((prev) => ({
                                ...prev,
                                [question.id]: val,
                            }));
                        }}
                    />
                </div>
            </fieldset>
        );
    };

    const handleSubmitForm = (formId) => {
        const form = REPORT_FORMS.find((f) => f.id === formId);
        const data = {};
        form.sections.forEach((section) => {
            section.questions.forEach((q) => {
                if (formData[q.id] !== undefined) {
                    data[q.id] = formData[q.id];
                }
            });
        });
        console.log(`Submit ${formId}:`, data);
    };

    return (
        <Tabs
            defaultValue={REPORT_FORMS[0].id}
            orientation="vertical"
            className="flex h-screen overflow-hidden"
        >
            <TabsList className="flex flex-col w-80 border-r p-4 overflow-y-auto">
                <h2 className="text-lg font-semibold mb-2">Initial Reports</h2>
                {REPORT_FORMS.map((form) => (
                    <TabsTrigger key={form.id} value={form.id} className="justify-start">
                        {form.title}
                    </TabsTrigger>
                ))}
            </TabsList>

            {REPORT_FORMS.map((form) => (
                <TabsContent
                    key={form.id}
                    value={form.id}
                    className="flex-1 p-6 overflow-y-auto"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>{form.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {form.sections.map((section) => (
                                <div key={section.id} className="space-y-8">
                                    <h3 className="text-xl font-semibold mb-4">
                                        {section.title}
                                    </h3>
                                    {section.questions.map((question) => renderQuestion(question))}
                                </div>
                            ))}
                            <div className="pt-6 flex justify-end">
                                <Button onClick={() => handleSubmitForm(form.id)}>Submit</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            ))}
        </Tabs>
    );
}
