import { useState, lazy } from "react";
import { useScreenSize } from "@/hooks/useScreenSize";

const BodyComponent = lazy(() =>
  import("reactjs-human-body").then((m) => ({
    default: m.BodyComponent || m.default,
  })),
);

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
  _formData,
  _setFormData,
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
  const { isMobile } = useScreenSize();

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
    if (!field)
      return;
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

  

  const closeDialog = () => setopenFieldId(null);

  return (
    <div className="w-full flex flex-col items-center px-2 sm:px-4">
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
      {isMobile ? (
        <MobilePainDetailModal
          isOpen={Boolean(openFieldId)}
          onClose={closeDialog}
          field={painFields.find((f) => f.id === openFieldId)}
          pendingLevel={pendingLevel}
          setPendingLevel={setPendingLevel}
          painMap={painMap}
          setPainMap={setPainMap}
          openFieldId={openFieldId}
          objectHuman={objectHuman}
        />
      ) : (
        <DesktopPainDetailDialog
          isOpen={Boolean(openFieldId)}
          onClose={closeDialog}
          field={painFields.find((f) => f.id === openFieldId)}
          pendingLevel={pendingLevel}
          setPendingLevel={setPendingLevel}
          painMap={painMap}
          setPainMap={setPainMap}
          openFieldId={openFieldId}
          objectHuman={objectHuman}
        />
      )}
    </div>
  );
}
