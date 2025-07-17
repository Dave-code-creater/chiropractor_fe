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
          "Muscle tension",
          "Numbness",
          "Pins & Needles",
          "constant",
          "continuous",
          "intermittent",
          "throbbing",
          "radiating",
          "stiffness",
          "swelling",
          "tingling",
          "soreness",
          "tightness",
          "twitching",
          "weakness",
          "pin and needles",
          "spasmodic",
          "blurriness",
          "dizziness",
          "fainting",
          "nauseous",
          "vomiting",
        ],
        extra_info: "Check all types of pain that apply to your condition.",
      },
      {
        id: "painLevel",
        label: "Rate your pain level",
        type: "checkbox",
        options: [
          " No pain",
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
    <div className="w-full flex flex-col items-center">
      <div className="scale-90">
        <Suspense fallback={<div>Loading...</div>}>
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
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {painFields
          .filter(
            (field) => painMap[field.id] !== undefined && 
            (typeof painMap[field.id] === 'object' ? painMap[field.id]['pain-level'] > 0 : painMap[field.id] > 0),
          )
          .map((field) => (
            <div key={field.id} className="text-center">
              <Label className="font-semibold text-sm">{field.label}</Label>
              <Button
                id={field.id}
                size="sm"
                variant="outline"
                onClick={() => {
                  const existingData = painMap[field.id];
                  const currentLevel = existingData && typeof existingData === 'object' 
                    ? existingData['pain-level'] 
                    : existingData || 1;
                  setPendingLevel(currentLevel);
                  setopenFieldId(field.id);
                }}
              >
                {(() => {
                  const data = painMap[field.id];
                  const level = data && typeof data === 'object' ? data['pain-level'] : data;
                  return typeof level === "number" ? level : "0";
                })()} / 10
              </Button>
            </div>
          ))}
        <Dialog
          open={Boolean(openFieldId)}
          onOpenChange={(isOpen) => {
            if (!isOpen) setopenFieldId(null);
          }}
        >
          {openFieldId && (
            <DialogContent className="max-w-2xl w-full bg-white rounded-lg shadow-lg">
              {(() => {
                const field = painFields.find((f) => f.id === openFieldId);
                if (!field) return null;
                return (
                  <>
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
                                <div
                                  key={field.id}
                                  className="text-center mb-6"
                                >
                                  <Label className="font-semibold text-sm">
                                    {field.label}
                                  </Label>
                                  <div className="w-40 mx-auto space-y-1 mt-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs w-6 text-left">
                                        1
                                      </span>
                                      <Slider
                                        min={1}
                                        max={10}
                                        step={1}
                                        value={[pendingLevel]}
                                        onValueChange={handleSliderChange}
                                        className="flex-1"
                                      />
                                      <span className="text-xs w-6 text-right">
                                        10
                                      </span>
                                    </div>
                                    <div className="text-xs flex justify-between px-4">
                                      <span>Minimal</span>
                                      <span className="flex-1 text-center">
                                        {" "}
                                      </span>
                                      <span>Max</span>
                                    </div>
                                    <div className="text-center text-xs">
                                      {pendingLevel} / 10
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                  {objectHuman.questions.map((question) =>
                                    newrenderQuestion(question),
                                  )}
                                </div>
                              </section>
                            </CardContent>
                          </Card>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end mt-4 gap-2">
                      <Button variant="outline" onClick={closeDialog}>
                        Cancel
                      </Button>
                      {openFieldId && painMap[openFieldId] !== undefined && (
                        <Button variant="destructive" onClick={removeDialog}>
                          Remove
                        </Button>
                      )}
                      <Button onClick={saveDialog}>Save</Button>
                    </div>
                  </>
                );
              })()}
            </DialogContent>
          )}
        </Dialog>
      </div>
    </div>
  );
}
