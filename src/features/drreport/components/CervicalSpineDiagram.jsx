import React, { useState } from "react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

// Import images with relative paths
import C1Image from "../../../assets/images/c1.png";
import C2Image from "../../../assets/images/c2.png";
import C3Image from "../../../assets/images/c3.png";
import C4Image from "../../../assets/images/c4.png";
import C5Image from "../../../assets/images/c5.png";
import C6Image from "../../../assets/images/c6.png";
import C7Image from "../../../assets/images/c7.png";

const cervicalBones = [
  { id: "C1", name: "Atlas", img: C1Image },
  { id: "C2", name: "Axis", img: C2Image },
  { id: "C3", name: "C3 Vertebra", img: C3Image },
  { id: "C4", name: "C4 Vertebra", img: C4Image },
  { id: "C5", name: "C5 Vertebra", img: C5Image },
  { id: "C6", name: "C6 Vertebra", img: C6Image },
  { id: "C7", name: "C7 Vertebra", img: C7Image },
];

const CervicalSpine = ({ onBoneClick, selectedBone }) => {
  const marginTops = [2, -12, -28, -40, -50, -56, -58];
  const marginsLeft = [16, 4, 10, 8, 2, 8, 10];
  const marginsRight = [0, 0, 10, 12, 6, 14, 0];
  const [hoveredBone, setHoveredBone] = useState(null);

  return (
    <div className="flex flex-col items-center relative">
      {cervicalBones.map((bone, idx) => (
        <HoverCard key={bone.id} open={hoveredBone === bone.id}>
          <HoverCardTrigger asChild>
            <img
              src={bone.img}
              alt={bone.id}
              className={cn(
                "cursor-pointer rounded-xl block relative bg-transparent",
                "transition-all duration-200 ease-in-out hover:scale-105",
                selectedBone === bone.id && "ring-2 ring-primary ring-offset-2",
                hoveredBone === bone.id && "ring-2 ring-blue-400 ring-offset-1"
              )}
              style={{
                margin: 0,
                padding: 0,
                transform: `translateY(${marginTops[idx]}px)`,
                width: 180,
                marginLeft: `${marginsLeft[idx]}px`,
                marginRight: `${marginsRight[idx]}px`,
                zIndex: cervicalBones.length - idx,
              }}
              onClick={() => onBoneClick?.(bone.id)}
              onMouseEnter={() => setHoveredBone(bone.id)}
              onMouseLeave={() => setHoveredBone(null)}
            />
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="font-bold text-lg text-primary">
              {bone.name}
            </div>
            <div className="text-sm text-gray-700 mt-1">
              {`Click to select ${bone.name} vertebra`}
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
};

export default CervicalSpine;
