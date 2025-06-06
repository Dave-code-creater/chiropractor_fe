import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { BodyComponent } from "reactjs-human-body";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Info } from "lucide-react";
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

const painFields = {
    left: [
        { id: "headache", label: "Headaches" },
        { id: "upperBack", label: "Upper Back" },
        { id: "arms", label: "Arms" },
        { id: "lowerBack", label: "Lower Back" },
        { id: "feet", label: "Feet" },
        { id: "hips", label: "Hips" },
        { id: "knees", label: "Knees" },
        { id: "ankles", label: "Ankles" },
    ],
    right: [
        { id: "neck", label: "Neck" },
        { id: "shoulders", label: "Shoulders" },
        { id: "midBack", label: "Mid Back" },
        { id: "legs", label: "Legs" },
        { id: "toes", label: "Toes" },
        { id: "wrists", label: "Wrists" },
        { id: "elbows", label: "Elbows" },
        { id: "shoulderBlades", label: "Shoulder Blades" },
    ],
};

export default function PainChartSection({ painMap, setPainMap }) {
    const objectHuman = {
        id: "3",
        title: "Pain & Symptom Evaluation",
        questions: [
            {
                id: "painType",
                label: "What kind of pain do you feel?",
                type: "checkbox",
                options: [
                    "Sharp", "Dull", "Burning", "Aching", "Stabbing", "Muscle tension",
                    "Numbness", "Pins & Needles", "constant", "continuous", "intermittent",
                    "throbbing", "radiating", "stiffness", "swelling", "tingling", "soreness",
                    "tightness", "twitching", "weakness", "pin and needles", "spasmodic",
                    "blurriness", "dizziness", "fainting", "nauseous", "vomiting"
                ],
                extra_info: "Check all types of pain that apply to your condition."
            },
            {
                id: "painLevel",
                label: "Rate your pain level",
                type: "checkbox",
                options: [
                    " No pain", " mildly less", " Mild", " mild to moderate", " moderate achy",
                    " moderate", " moderate to severe", " severe", " severe to unbearable",
                    " unbearable", "1 worst pain ever"
                ],
                extra_info: "Select the option that best describes your current pain level."
            },
            {
                id: "painTiming",
                label: "How often is the pain present?",
                type: "radio",
                options: [
                    "Constant", "Comes and goes", "Worse with activity", "Twice a day",
                    "Once a day", "Daily", "Monthly"
                ]
            },
            {
                id: "painChanges",
                label: "Is the pain better, worse, or the same today?",
                type: "radio",
                options: ["Same", "Better", "Worse"]
            },
            {
                id: "painTriggers",
                label: "What makes it worse?",
                type: "checkbox",
                options: [
                    "Sitting", "Standing", "Working", "Lifting", "Sleeping", "Bending",
                    "Twisting", "Other"
                ],
                extra_info: "What actions or conditions worsen your pain? Select all that apply."
            },
            {
                id: "radiatingPain",
                label: "Does the pain travel or radiate?",
                type: "radio",
                options: ["Yes", "No"],
                extra_info: "Does the pain move from one area to another (e.g., from back to legs)?"
            }
        ]
    };

    const [model, setModel] = useState("male");
    const [formData, setFormData] = useState({});
    const [openFieldId, setopenFieldId] = useState(null);

    const handleSliderChange = (id, value) => {
        setPainMap((prev) => ({
            ...prev,
            [id]: value[0],
        }));
    };

    const closeDialog = () => setopenFieldId(null);

    const newrenderQuestion = (question) => {
        const commonFieldsetClasses = "border rounded-md p-4 space-y-4";
        return question.type === "group" ? (
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
                    {question.fields?.map((field) => {
                        const value = formData[field.id] || "";
                        return (
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
        ) : question.type === "radio" ? (
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-4">
                    {question.options.map((opt) => (
                        <div key={opt} className="flex items-center text-lg">
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
        <div className="flex justify-center items-start gap-4 w-full">
            {/* Left Panel */}
            <div className="flex flex-col gap-6">
                {painFields.left.map((field) => (
                    <div key={field.id} className="text-center">
                        <Label className="font-semibold text-sm">{field.label}</Label>
                        <Dialog open={openFieldId === field.id} onOpenChange={(isOpen) => {
                            if (!isOpen) setopenFieldId(null);
                        }} >
                            <DialogTrigger asChild >
                                <Button
                                    id={field.id}
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setopenFieldId(field.id)}
                                >
                                    {typeof painMap[field.id] === "number"
                                        ? painMap[field.id]
                                        : "0"}{" "}
                                    / 10

                                </Button>
                            </DialogTrigger>

                            <DialogContent className="max-w-2xl w-full bg-white rounded-lg shadow-lg">
                                <DialogHeader>
                                    <DialogTitle>Details your {field.label}</DialogTitle>
                                    <DialogDescription asChild>
                                        <div className="flex-1 p-6 overflow-y-auto">
                                            <Card>
                                                <CardContent className="space-y-8">
                                                    <section key={objectHuman.id}>
                                                        <h3 className="text-xl font-semibold mb-4">
                                                            Describe details of your {field.label}
                                                        </h3>
                                                        <div key={field.id} className="text-center mb-6">
                                                            <Label className="font-semibold text-sm">{field.label}</Label>
                                                            <Slider
                                                                min={0}
                                                                max={10}
                                                                step={1}
                                                                value={[painMap[field.id] || 0]}
                                                                onValueChange={(val) => handleSliderChange(field.id, val)}
                                                                className="w-32 mx-auto"
                                                            />
                                                            <div className="text-xs flex justify-between px-2">
                                                                <span>0</span>
                                                                <span>10</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-4">
                                                            {objectHuman.questions.map((question) => newrenderQuestion(question))}
                                                        </div>
                                                    </section>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-end mt-4">
                                    <Button variant="outline" onClick={closeDialog}>
                                        Close
                                    </Button>
                                </div>

                            </DialogContent>

                        </Dialog>
                    </div>
                ))}
            </div>
            {/* Body Model */}
            <div className="scale-90">
                <BodyComponent bodyModel={model} />
                <div className="flex justify-center gap-2 mt-2 text-md font-semibold">
                    <button onClick={() => setModel("male")}>Male</button>
                    <button onClick={() => setModel("female")}>Female</button>
                </div>
            </div>
            {/* Right Panel */}
            <div className="flex flex-col gap-6">
                {painFields.right.map((field) => (
                    <div key={field.id} className="text-center">
                        <Label className="font-semibold text-sm">{field.label}</Label>
                        <Dialog open={openFieldId === field.id} onOpenChange={(isOpen) => {
                            if (!isOpen) setopenFieldId(null);
                        }}>
                            <DialogTrigger asChild>
                                <Button
                                    id={field.id}
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setopenFieldId(field.id)}
                                >
                                    {typeof painMap[field.id] === "number"
                                        ? painMap[field.id]
                                        : "0"}{" "}
                                    / 10
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Details your {field.label}</DialogTitle>
                                    <DialogDescription asChild>
                                        <div className="flex-1 p-6 overflow-y-auto">
                                            <Card>
                                                <CardContent className="space-y-8">
                                                    <section key={objectHuman.id}>
                                                        <h3 className="text-xl font-semibold mb-4">
                                                            Describe details of your {field.label}
                                                        </h3>
                                                        <div key={field.id} className="text-center mb-6">
                                                            <Label className="font-semibold text-sm">{field.label}</Label>
                                                            <Slider
                                                                min={0}
                                                                max={10}
                                                                step={1}
                                                                value={[painMap[field.id] || 0]}
                                                                onValueChange={(val) => handleSliderChange(field.id, val)}
                                                                className="w-32 mx-auto"
                                                            />
                                                            <div className="text-xs flex justify-between px-2">
                                                                <span>0</span>
                                                                <span>10</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-4">
                                                            {objectHuman.questions.map((question) => newrenderQuestion(question))}
                                                        </div>
                                                    </section>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-end mt-4">
                                    <Button variant="outline" onClick={closeDialog}>
                                        Close
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                ))}
            </div>
        </div>
    );
}