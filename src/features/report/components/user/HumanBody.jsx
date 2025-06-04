import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { BodyComponent } from "reactjs-human-body";
import { useState } from "react";

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
    const [model, setModel] = useState("male");

    const handleSliderChange = (id, value) => {
        setPainMap((prev) => ({
            ...prev,
            [id]: value[0],
        }));
    };

    return (
        <div className="flex justify-center items-start gap-4 w-full">
            {/* Left Panel */}
            <div className="flex flex-col gap-6">
                {painFields.left.map((field) => (
                    <div key={field.id} className="text-center">
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
                ))}
            </div>

            {/* Body Model */}
            <div className="scale-90">
                <BodyComponent bodyModel={model} />
                <div className="flex justify-center gap-2 mt-2 text-xs">
                    <button onClick={() => setModel("male")}>Male</button>
                    <button onClick={() => setModel("female")}>Female</button>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex flex-col gap-6">
                {painFields.right.map((field) => (
                    <div key={field.id} className="text-center">
                        <Label className="font-semibold text-sm">{field.label}</Label>
                        <Slider
                            min={0}
                            max={10}
                            step={1}
                            value={[painMap[field.id] || 0]}
                            onValueChange={(val) => handleSliderChange(field.id, val)}
                            className="w-32 mx-auto"
                        >
                            <div
                                className={`
      h-2 rounded-full
      ${painMap[field.id] >= 7 ? "bg-red-500" :
                                        painMap[field.id] >= 4 ? "bg-yellow-500" :
                                            "bg-gray-300"}
    `}
                                style={{ width: "100%" }}
                            />
                        </Slider>
                        <div className="text-xs flex justify-between px-2">
                            <span>0</span>
                            <span>10</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}