import React, { useState, lazy, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
const BodyComponent = lazy(() =>
    import("reactjs-human-body").then((m) => ({
        default: m.BodyComponent || m.default,
    })),
);
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
import {
    RenderQuesFuncs,
    RenderTextAreaQues,
    RenderRadioQues,
    RenderCheckboxQues,
    RenderOtherQues,
} from "@/components/forms/FormComponents";

const painFields = [
    { id: "head", label: "Head" },
    { id: "neck", label: "Neck" },
    { id: "leftShoulder", label: "Left Shoulder" },
    { id: "rightShoulder", label: "Right Shoulder" },
    { id: "shoulderBlades", label: "Shoulder Blades" },
    { id: "upperBack", label: "Upper Back" },
    { id: "midBack", label: "Mid Back" },
    { id: "lowerBack", label: "Lower Back" },
    { id: "chest", label: "Chest" },
    { id: "stomach", label: "Stomach" },
    { id: "leftArm", label: "Left Arm" },
    { id: "rightArm", label: "Right Arm" },
    { id: "leftHand", label: "Left Hand" },
    { id: "rightHand", label: "Right Hand" },
    { id: "hips", label: "Hips" },
    { id: "leftLeg", label: "Left Leg" },
    { id: "rightLeg", label: "Right Leg" },
    { id: "leftFoot", label: "Left Foot" },
    { id: "rightFoot", label: "Right Foot" },
    { id: "knees", label: "Knees" },
    { id: "ankles", label: "Ankles" },
    { id: "feet", label: "Feet" },
    { id: "toes", label: "Toes" },
];

export default function PainChartSection({
    gender,
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
                    "Sharp",
                    "Dull",
                    "Burning",
                    "Aching",
                    "Stabbing",
                    "Cramping",
                    "Shooting",
                    "Throbbing",
                    "Tingling",
                    "Numbness",
                ],
                extra_info:
                    "Select all types of pain you experience in this area. You can choose multiple options.",
            },
            {
                id: "painLevel",
                label: "How would you rate the pain level?",
                type: "radio",
                options: [
                    "0 no pain",
                    "1 minimal very light barely noticeable",
                    "2 mild low level",
                    "3 mild moderately mild",
                    "4 mild moderately mild but noticeable",
                    "5 moderate strong yet manageable",
                    "6 moderately strong",
                    "7 strong intense difficult to ignore",
                    "8 severe very intense",
                    "9 severe unbearable",
                    "10 excruciating unimaginable",
                    " very mild",
                    " mildly less",
                    " Mild",
                    " mild to moderate",
                    " moderate achy",
                    " moderate",
                    " moderate to severe",
                    " severe",
                    " severe to unbearable",
                    " unbearable",
                    "1 worst pain ever",
                ],
                extra_info:
                    "Select the option that best describes your current pain level.",
            },
            {
                id: "painTiming",
                label: "How often is the pain present?",
                type: "radio",
                options: [
                    "Constant",
                    "Comes and goes",
                    "Worse with activity",
                    "Twice a day",
                    "Once a day",
                    "Daily",
                    "Monthly",
                ],
            },
            {
                id: "painChanges",
                label: "Is the pain better, worse, or the same today?",
                type: "radio",
                options: ["Same", "Better", "Worse"],
            },
            {
                id: "painTriggers",
                label: "What makes it worse?",
                type: "checkbox",
                options: [
                    "Sitting",
                    "Standing",
                    "Working",
                    "Lifting",
                    "Sleeping",
                    "Bending",
                    "Twisting",
                    "Other",
                ],
                extra_info:
                    "What actions or conditions worsen your pain? Select all that apply.",
            },
            {
                id: "radiatingPain",
                label: "Does the pain travel or radiate?",
                type: "radio",
                options: ["Yes", "No"],
                extra_info:
                    "Does the pain move from one area to another (e.g., from back to legs)?",
            },
        ],
    };

    const [openFieldId, setopenFieldId] = useState(null);
    const [pendingLevel, setPendingLevel] = useState(1);

    const partMap = {
        head: "head",
        leftShoulder: "leftShoulder",
        rightShoulder: "rightShoulder",
        chest: "chest",
        stomach: "stomach",
        leftArm: "leftArm",
        rightArm: "rightArm",
        leftHand: "leftHand",
        rightHand: "rightHand",
        leftLeg: "leftLeg",
        rightLeg: "rightLeg",
        leftFoot: "leftFoot",
        rightFoot: "rightFoot",
    };

    const handleBodyClick = (part) => {
        const field = partMap[part];
        if (!field) return;
        // Handle both old number format and new object format
        const existingData = painMap[field];
        const currentLevel = existingData && typeof existingData === 'object'
            ? existingData['pain-level']
            : existingData || 1;
        setPendingLevel(currentLevel);
        setopenFieldId(field);
    };

    const partsInput = Object.fromEntries(
        Object.entries(partMap).map(([part, field]) => [
            part,
            { selected: !!painMap[field] },
        ]),
    );

    const handleSliderChange = (value) => {
        setPendingLevel(value[0]);
    };

    const closeDialog = () => setopenFieldId(null);
    const saveDialog = () => {
        if (!openFieldId) return;

        // Get the current body part's data (including any changes made in the dialog)
        const currentData = painMap[openFieldId] || {};

        // Create the final body part data with the updated pain level
        const bodyPartData = {
            ...currentData,
            "pain-level": pendingLevel,
            "selected-at": currentData["selected-at"] || new Date().toISOString(),
            "body-part": openFieldId
        };

        setPainMap((prev) => ({
            ...prev,
            [openFieldId]: bodyPartData,
        }));
        setopenFieldId(null);
    };

    const removeDialog = () => {
        if (!openFieldId) return;
        setPainMap((prev) => {
            const map = { ...prev };
            delete map[openFieldId];
            return map;
        });
        setopenFieldId(null);
    };

    const newrenderQuestion = (question) => {
        const commonFieldsetClasses = "border rounded-md p-4 space-y-4";

        // Get current body part's specific data
        const currentBodyPartData = painMap[openFieldId] || {};

        // Create body-part specific formData
        const bodyPartFormData = {
            [question.id]: question.id === 'painType' ? currentBodyPartData['pain-types'] || [] :
                question.id === 'painLevel' ? currentBodyPartData['pain-severity'] || [] :
                    question.id === 'painTiming' ? currentBodyPartData['pain-timing'] || "" :
                        question.id === 'painChanges' ? currentBodyPartData['pain-changes'] || "" :
                            question.id === 'radiatingPain' ? currentBodyPartData['radiating-pain'] || "" :
                                currentBodyPartData[question.id] || (question.type === 'checkbox' ? [] : "")
        };

        // Create body-part specific setFormData function
        const setBodyPartFormData = (updater) => {
            setPainMap((prev) => {
                const updated = typeof updater === 'function' ? updater(bodyPartFormData) : updater;
                const newBodyPartData = { ...currentBodyPartData };

                // Map the question data back to our body part structure
                if (question.id === 'painType') {
                    newBodyPartData['pain-types'] = updated[question.id];
                } else if (question.id === 'painLevel') {
                    newBodyPartData['pain-severity'] = updated[question.id];
                } else if (question.id === 'painTiming') {
                    newBodyPartData['pain-timing'] = updated[question.id];
                } else if (question.id === 'painChanges') {
                    newBodyPartData['pain-changes'] = updated[question.id];
                } else if (question.id === 'radiatingPain') {
                    newBodyPartData['radiating-pain'] = updated[question.id];
                } else {
                    newBodyPartData[question.id] = updated[question.id];
                }

                return {
                    ...prev,
                    [openFieldId]: newBodyPartData
                };
            });
        };

        if (question.type === "group") {
            return (
                <RenderQuesFuncs
                    question={question}
                    formData={bodyPartFormData}
                    setFormData={setBodyPartFormData}
                    commonFieldsetClasses={commonFieldsetClasses}
                />
            );
        } else if (question.type === "textarea") {
            return (
                <RenderTextAreaQues
                    question={question}
                    formData={bodyPartFormData}
                    setFormData={setBodyPartFormData}
                    commonFieldsetClasses={commonFieldsetClasses}
                />
            );
        } else if (question.type === "radio") {
            return (
                <RenderRadioQues
                    question={question}
                    formData={bodyPartFormData}
                    setFormData={setBodyPartFormData}
                    commonFieldsetClasses={commonFieldsetClasses}
                />
            );
        } else if (question.type === "checkbox") {
            return (
                <RenderCheckboxQues
                    question={question}
                    formData={bodyPartFormData}
                    setFormData={setBodyPartFormData}
                    commonFieldsetClasses={commonFieldsetClasses}
                />
            );
        } else {
            return (
                <RenderOtherQues
                    question={question}
                    formData={bodyPartFormData}
                    setFormData={setBodyPartFormData}
                    commonFieldsetClasses={commonFieldsetClasses}
                />
            );
        }
    };

    return (
        <div className="w-full flex flex-col items-center px-2 sm:px-4">
            {/* Mobile-friendly body component */}
            <div className="w-full max-w-md sm:max-w-lg scale-75 sm:scale-90 lg:scale-100">
                <Suspense fallback={
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Loading body diagram...</p>
                        </div>
                    </div>
                }>
                    <BodyComponent
                        bodyModel={
                            gender && gender.toLowerCase().includes("female")
                                ? "female"
                                : "male"
                        }
                        onClick={handleBodyClick}
                        partsInput={partsInput}
                    />
                </Suspense>
            </div>

            {/* Selected areas info */}
            <div className="w-full max-w-2xl mt-4 sm:mt-6">
                <Card className="bg-gray-50">
                    <CardContent className="p-4">
                        <h4 className="font-semibold text-lg mb-3 text-center">Selected Pain Areas</h4>
                        <p className="text-sm text-muted-foreground text-center mb-4">
                            Click on body parts to select
                        </p>

                        {painFields
                            .filter(
                                (field) => painMap[field.id] !== undefined &&
                                    (typeof painMap[field.id] === 'object' ? painMap[field.id]['pain-level'] > 0 : painMap[field.id] > 0),
                            ).length === 0 ? (
                            <div className="text-center py-4">
                                <p className="text-muted-foreground text-sm">
                                    No areas selected yet. Tap on the body diagram above to add pain areas.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {painFields
                                    .filter(
                                        (field) => painMap[field.id] !== undefined &&
                                            (typeof painMap[field.id] === 'object' ? painMap[field.id]['pain-level'] > 0 : painMap[field.id] > 0),
                                    )
                                    .map((field) => {
                                        const data = painMap[field.id];
                                        const level = data && typeof data === 'object' ? data['pain-level'] : data;
                                        return (
                                            <Button
                                                key={field.id}
                                                variant="outline"
                                                className="flex items-center justify-between p-4 h-auto text-left hover:bg-blue-50 border-blue-200"
                                                onClick={() => {
                                                    const existingData = painMap[field.id];
                                                    const currentLevel = existingData && typeof existingData === 'object'
                                                        ? existingData['pain-level']
                                                        : existingData || 1;
                                                    setPendingLevel(currentLevel);
                                                    setopenFieldId(field.id);
                                                }}
                                            >
                                                <div className="flex-1">
                                                    <span className="font-medium text-base">{field.label}</span>
                                                    <div className="text-sm text-muted-foreground mt-1">
                                                        Pain Level: {typeof level === "number" ? level : "0"}/10
                                                    </div>
                                                </div>
                                                <div className="text-sm text-blue-600 font-medium">
                                                    Edit →
                                                </div>
                                            </Button>
                                        );
                                    })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Dialog for body part details */}
            <Dialog
                open={Boolean(openFieldId)}
                onOpenChange={(isOpen) => {
                    if (!isOpen) setopenFieldId(null);
                }}
            >
                {openFieldId && (
                    <DialogContent className="max-w-2xl w-[95vw] sm:w-full bg-white rounded-lg shadow-lg max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col p-0">
                        {(() => {
                            const field = painFields.find((f) => f.id === openFieldId);
                            if (!field) return null;
                            return (
                                <>
                                    <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-gray-200 flex-shrink-0">
                                        <DialogTitle className="text-lg sm:text-xl font-semibold">Details your {field.label}</DialogTitle>
                                    </DialogHeader>

                                    {/* Scrollable content area */}
                                    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                                        <div className="space-y-6">
                                            <section key={objectHuman.id}>
                                                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-left">
                                                    Describe details of your {field.label}
                                                </h3>

                                                {/* Pain Level Slider */}
                                                <div className="text-center mb-6">
                                                    <Label className="font-semibold text-base block mb-3">
                                                        {field.label}
                                                    </Label>
                                                    <div className="w-full max-w-sm mx-auto space-y-2">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-sm w-8 text-left font-medium">
                                                                1
                                                            </span>
                                                            <Slider
                                                                min={1}
                                                                max={10}
                                                                step={1}
                                                                value={[pendingLevel]}
                                                                onValueChange={handleSliderChange}
                                                                className="flex-1 h-6"
                                                            />
                                                            <span className="text-sm w-8 text-right font-medium">
                                                                10
                                                            </span>
                                                        </div>
                                                        <div className="text-sm flex justify-between px-2">
                                                            <span className="text-gray-600">Minimal</span>
                                                            <span className="text-gray-600">Max</span>
                                                        </div>
                                                        <div className="text-center text-lg font-bold text-blue-600 bg-blue-50 py-2 px-4 rounded-lg">
                                                            {pendingLevel} / 10
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Questions */}
                                                <div className="space-y-4">
                                                    {objectHuman.questions.map((question) =>
                                                        newrenderQuestion(question),
                                                    )}
                                                </div>
                                            </section>
                                        </div>
                                    </div>

                                    {/* Fixed bottom buttons */}
                                    <div className="flex-shrink-0 border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
                                        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={closeDialog}
                                                className="w-full sm:w-auto order-3 sm:order-1"
                                            >
                                                Cancel
                                            </Button>
                                            {openFieldId && painMap[openFieldId] !== undefined && (
                                                <Button
                                                    variant="destructive"
                                                    onClick={removeDialog}
                                                    className="w-full sm:w-auto order-2"
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                            <Button
                                                onClick={saveDialog}
                                                className="w-full sm:w-auto order-1 sm:order-3 bg-blue-600 hover:bg-blue-700"
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
}
