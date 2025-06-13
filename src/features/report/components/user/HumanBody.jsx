import React, { useState, lazy, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
const BodyComponent = lazy(() => import("reactjs-human-body").then(m => ({ default: m.BodyComponent || m.default })))
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

const painFields = [
    { id: "headache", label: "Headaches" },
    { id: "neck", label: "Neck" },
    { id: "shoulders", label: "Shoulders" },
    { id: "upperBack", label: "Upper Back" },
    { id: "midBack", label: "Mid Back" },
    { id: "lowerBack", label: "Lower Back" },
    { id: "shoulderBlades", label: "Shoulder Blades" },
    { id: "arms", label: "Arms" },
    { id: "wrists", label: "Wrists" },
    { id: "elbows", label: "Elbows" },
    { id: "hips", label: "Hips" },
    { id: "legs", label: "Legs" },
    { id: "knees", label: "Knees" },
    { id: "ankles", label: "Ankles" },
    { id: "feet", label: "Feet" },
    { id: "toes", label: "Toes" },
];
import { RenderQuesFuncs,
  RenderTextAreaQues,
  RenderRadioQues,
  RenderCheckboxQues,
  RenderOtherQues }from "../../../../utils/renderQuesFuncs.jsx";

export default function PainChartSection({
    painMap,
    setPainMap,
    formData,
    setFormData,
}) {
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
    const [openFieldId, setopenFieldId] = useState(null);

    const partMap = {
        head: "headache",
        leftShoulder: "shoulders",
        rightShoulder: "shoulders",
        chest: "upperBack",
        stomach: "lowerBack",
        leftArm: "arms",
        rightArm: "arms",
        leftHand: "wrists",
        rightHand: "wrists",
        leftLeg: "legs",
        rightLeg: "legs",
        leftFoot: "feet",
        rightFoot: "feet",
    };

    const handleBodyClick = (part) => {
        const field = partMap[part];
        if (field) setopenFieldId(field);
    };

    const partsInput = Object.fromEntries(
        Object.entries(partMap).map(([part, field]) => [part, { selected: !!painMap[field] }])
    );

    const handleSliderChange = (id, value) => {
        setPainMap((prev) => ({
            ...prev,
            [id]: value[0],
        }));
    };

    const closeDialog = () => setopenFieldId(null);

    const newrenderQuestion = (question) => {
        const commonFieldsetClasses = "border rounded-md p-4 space-y-4";
        if (question.type === "group") {
            return <RenderQuesFuncs question={question} formData={formData} setFormData={setFormData} commonFieldsetClasses={commonFieldsetClasses} />;
        } else if (question.type === "textarea") {
            return <RenderTextAreaQues question={question} formData={formData} setFormData={setFormData} commonFieldsetClasses={commonFieldsetClasses} />;
        } else if (question.type === "radio") {
            return <RenderRadioQues question={question} formData={formData} setFormData={setFormData} commonFieldsetClasses={commonFieldsetClasses} />;
        } else if (question.type === "checkbox") {
            return <RenderCheckboxQues question={question} formData={formData} setFormData={setFormData} commonFieldsetClasses={commonFieldsetClasses} />;
        } else {
            return <RenderOtherQues question={question} formData={formData} setFormData={setFormData} commonFieldsetClasses={commonFieldsetClasses} />;
        }
    };

    return (
        <div className="relative flex justify-center items-start gap-4 w-full">
            <div className="flex flex-col gap-6 mt-20">
                {painFields.map((field) => (
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
                                                            <div className="relative w-32 mx-auto">
                                                                <Slider
                                                                    min={0}
                                                                    max={10}
                                                                    step={1}
                                                                    value={[painMap[field.id] || 0]}
                                                                    onValueChange={(val) => handleSliderChange(field.id, val)}
                                                                />
                                                                <div className="absolute inset-x-0 bottom-0 text-center text-xs">
                                                                    {painMap[field.id] || 0} / 10
                                                                </div>
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
                <Suspense fallback={<div>Loading...</div>}>
                    <BodyComponent
                        bodyModel={model}
                        onClick={handleBodyClick}
                        partsInput={partsInput}
                    />
                </Suspense>
                <div className="flex justify-center gap-2 mt-2 text-md font-semibold">
                    <button onClick={() => setModel("male")}>Male</button>
                    <button onClick={() => setModel("female")}>Female</button>
                </div>
            </div>
        </div>
    );
}