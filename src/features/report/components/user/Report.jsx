import { useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
} from "@/components/ui/command"
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
    const [formData, setFormData] = useState({});
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [painMap, setPainMap] = useState({});

    const currentSection = PATIENT_INFO[currentSectionIndex];
    const currentQuestion = currentSection.questions[currentQuestionIndex];

    const filteredSections = PATIENT_INFO.map((section) => ({
        ...section,
        questions: section.questions.filter((q) =>
            q.label.toLowerCase().includes(searchTerm.toLowerCase())
        ),
    })).filter(
        (section) =>
            section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            section.questions.length > 0
    );


    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 border-r p-4 overflow-y-auto">
                <h2 className="text-lg font-semibold mb-2">Inital Reports</h2>
                <Input
                    placeholder="Search sections or questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4"
                />
                <Accordion type="multiple" className="w-full space-y-2">
                    {filteredSections.map((section, sIdx) => (
                        <AccordionItem key={section.id} value={section.id}>
                            <AccordionTrigger>{section.title}</AccordionTrigger>
                            <AccordionContent>
                                <ul className="space-y-2 pl-2">
                                    {section.questions.map((q, qIdx) => {
                                        const isFilled =
                                            q.type === "group"
                                                ? q.fields.every(
                                                    (f) =>
                                                        formData[f.id] &&
                                                        formData[f.id].toString().trim() !== ""
                                                )
                                                : formData[q.id] &&
                                                formData[q.id].toString().trim() !== "";

                                        const isActive =
                                            currentSectionIndex === sIdx &&
                                            currentQuestionIndex === qIdx;

                                        return (
                                            <li key={q.id}>
                                                <button
                                                    onClick={() => {
                                                        setCurrentSectionIndex(
                                                            PATIENT_INFO.findIndex(
                                                                (s) => s.id === section.id
                                                            )
                                                        );
                                                        setCurrentQuestionIndex(
                                                            PATIENT_INFO[
                                                                PATIENT_INFO.findIndex(
                                                                    (s) => s.id === section.id
                                                                )
                                                            ].questions.findIndex(
                                                                (qq) => qq.id === q.id
                                                            )
                                                        );
                                                    }}
                                                    className={`w-full text-left flex items-center gap-2 text-sm px-2 py-1 rounded 
                                                        ${isActive ? "bg-muted font-semibold" : ""}
                                                        ${isFilled ? "text-green-600" : "text-muted-foreground"}`}
                                                >
                                                    <GripVertical size={14} />
                                                    <span className="flex-1 truncate">{q.label}</span>
                                                    {isFilled && <span className="text-green-500">✔</span>}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            {/* Main Form */}
            <div className="flex-1 p-6 overflow-y-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>{currentSection.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {currentQuestion && (
                            <fieldset className="border rounded-md p-4 space-y-4">
                                <legend className="text-sm font-medium text-muted-foreground px-2 flex items-center gap-2">
                                    {currentQuestion.label}
                                    {currentQuestion.extra_info && (
                                        <HoverCard>
                                            <HoverCardTrigger asChild>
                                                <Info size={16} className="text-muted-foreground cursor-pointer" />
                                            </HoverCardTrigger>
                                            <HoverCardContent className="w-80 text-sm">
                                                {currentQuestion.extra_info}
                                            </HoverCardContent>
                                        </HoverCard>
                                    )}
                                </legend>

                                {currentQuestion.type === "group" ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {currentQuestion.fields.map((field) => (
                                            <div key={field.id}>
                                                <div className="flex items-center gap-1">
                                                    <Label htmlFor={field.id}>{field.label}</Label>
                                                    {field.extra_info && (
                                                        <HoverCard>
                                                            <HoverCardTrigger asChild>
                                                                <Info size={14} className="text-muted-foreground cursor-pointer" />
                                                            </HoverCardTrigger>
                                                            <HoverCardContent className="w-72 text-sm">
                                                                {field.extra_info}
                                                            </HoverCardContent>
                                                        </HoverCard>
                                                    )}
                                                </div>
                                                {field.type === "radio" ? (
                                                    <Select
                                                        value={formData[field.id] || ""}
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
                                                        value={formData[field.id] || ""}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                [field.id]: e.target.value,
                                                            }))
                                                        }
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : currentQuestion.type === "textarea" ? (
                                    <div>
                                        <Label htmlFor={currentQuestion.id}>{currentQuestion.label}</Label>
                                        <textarea
                                            id={currentQuestion.id}
                                            className="w-full border rounded px-3 py-2"
                                            rows={4}
                                            value={formData[currentQuestion.id] || ""}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    [currentQuestion.id]: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                ) : currentQuestion.id === "painChart" ? (
                                    <PainChartSection painMap={painMap} setPainMap={setPainMap} />
                                ) : currentQuestion.type === "radio" ? (
                                    <div>
                                        <Label>{currentQuestion.label}</Label>
                                        <Select
                                            value={formData[currentQuestion.id] || ""}
                                            onValueChange={(val) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    [currentQuestion.id]: val,
                                                }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={`Select ${currentQuestion.label}`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {currentQuestion.options.map((opt) => (
                                                    <SelectItem key={opt} value={opt}>
                                                        {opt}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ) : (
                                    <div>
                                        <Label htmlFor={currentQuestion.id}>{currentQuestion.label}</Label>
                                        <Input
                                            id={currentQuestion.id}
                                            value={formData[currentQuestion.id] || ""}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    [currentQuestion.id]: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                )}
                            </fieldset>
                        )}

                        <div className="flex justify-between pt-6">
                            <Button
                                variant="outline"
                                disabled={currentQuestionIndex === 0}
                                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                            >
                                Back
                            </Button>

                            {currentQuestionIndex < currentSection.questions.length - 1 ? (
                                <Button onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}>
                                    Next
                                </Button>
                            ) : (
                                <Button onClick={() => console.log("Submit", formData)}>
                                    Submit
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}