import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
    RenderQuesFuncs,
    RenderTextAreaQues,
    RenderRadioQues,
    RenderCheckboxQues,
    RenderOtherQues,
} from "@/components/forms/FormComponents";

const DesktopPainDetailDialog = ({
    isOpen,
    onClose,
    field,
    pendingLevel,
    setPendingLevel,
    painMap,
    setPainMap,
    openFieldId,
    objectHuman,
}) => {
    if (!field || !openFieldId) return null;

    const handleSliderChange = (value) => {
        setPendingLevel(value[0]);
    };

    const saveDialog = () => {
        if (!openFieldId) return;

        const currentData = painMap[openFieldId] || {};
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
        onClose();
    };

    const removeDialog = () => {
        if (!openFieldId) return;
        setPainMap((prev) => {
            const map = { ...prev };
            delete map[openFieldId];
            return map;
        });
        onClose();
    };

    const newrenderQuestion = (question) => {
        const commonFieldsetClasses = "border rounded-md p-4 space-y-4";
        const currentBodyPartData = painMap[openFieldId] || {};

        const bodyPartFormData = {
            [question.id]: question.id === 'painType' ? currentBodyPartData['pain-types'] || [] :
                question.id === 'painLevel' ? currentBodyPartData['pain-severity'] || [] :
                    question.id === 'painTiming' ? currentBodyPartData['pain-timing'] || "" :
                        question.id === 'painChanges' ? currentBodyPartData['pain-changes'] || "" :
                            question.id === 'radiatingPain' ? currentBodyPartData['radiating-pain'] || "" :
                                currentBodyPartData[question.id] || (question.type === 'checkbox' ? [] : "")
        };

        const setBodyPartFormData = (updater) => {
            setPainMap((prev) => {
                const updated = typeof updater === 'function' ? updater(bodyPartFormData) : updater;
                const newBodyPartData = { ...currentBodyPartData };

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
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className="max-w-4xl w-[95vw] bg-white rounded-lg shadow-lg max-h-[90vh] overflow-hidden flex flex-col p-0">
                <DialogHeader className="p-6 pb-4 border-b border-gray-200 flex-shrink-0">
                    <DialogTitle className="text-2xl font-semibold">
                        Details for {field.label}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-8">
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-semibold mb-4">
                                    Pain Level Assessment
                                </h3>
                                <div className="text-center">
                                    <Label className="font-semibold text-lg block mb-4">
                                        {field.label}
                                    </Label>
                                    <div className="w-full max-w-md mx-auto space-y-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-medium w-8">1</span>
                                            <Slider
                                                min={1}
                                                max={10}
                                                step={1}
                                                value={[pendingLevel]}
                                                onValueChange={handleSliderChange}
                                                className="flex-1 h-6"
                                            />
                                            <span className="text-sm font-medium w-8">10</span>
                                        </div>
                                        <div className="text-sm flex justify-between px-2 text-gray-600">
                                            <span>Minimal</span>
                                            <span>Maximum</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="inline-block bg-blue-100 text-blue-800 font-bold text-2xl py-4 px-8 rounded-lg">
                                                {pendingLevel} / 10
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold">
                                Additional Information
                            </h3>
                            {objectHuman.questions.map((question) => (
                                <Card key={question.id} className="shadow-sm">
                                    <CardContent className="p-5">
                                        <div className="space-y-4">
                                            {newrenderQuestion(question)}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-shrink-0 border-t border-gray-200 p-6 bg-gray-50">
                    <div className="flex justify-between items-center">
                        <div>
                            {openFieldId && painMap[openFieldId] !== undefined && (
                                <Button
                                    variant="destructive"
                                    onClick={removeDialog}
                                    size="lg"
                                >
                                    Remove This Area
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                size="lg"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={saveDialog}
                                className="bg-blue-600 hover:bg-blue-700"
                                size="lg"
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DesktopPainDetailDialog;
