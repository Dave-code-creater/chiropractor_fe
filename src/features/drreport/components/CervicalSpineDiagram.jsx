import React from "react";
import { useState } from "react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

const cervicalBones = [
  { id: "C1", img: "/images/C1.png" },
  { id: "C2", img: "/images/C2.png" },
  { id: "C3", img: "/images/C3.png" },
  { id: "C4", img: "/images/C4.png" },
  { id: "C5", img: "/images/C5.png" },
  { id: "C6", img: "/images/C6.png" },
  { id: "C7", img: "/images/C7.png" },
];

export default function CervicalSpine({ onBoneClick, selectedBone }) {
  const marginTops = [2, -12, -28, -40, -50, -56, -58]
  const marginsLeft = [16, 4, 10, 8, 2, 8, 10];        // margin-left từng ảnh
  const marginsRight = [0, 0, 10, 12, 6, 14, 0]; 
  const [hoveredBone, setHoveredBone] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
      {cervicalBones.map((bone, idx) => (
            <HoverCard key={bone.id} open={hoveredBone === bone.id}>
          <HoverCardTrigger asChild>
            <img
              src={bone.img}
              alt={bone.id}
              style={{
                margin: 0,
                padding: 0,
                borderRadius: 0,
                transform: `translateY(${marginTops[idx]}px)`,
                width: 180,
                cursor: "pointer",
                marginLeft: `${marginsLeft[idx]}px`,
                marginRight: `${marginsRight[idx]}px`,
                border:
                  selectedBone === bone.id
                    ? "2.5px solid #1976d2"
                    : hoveredBone === bone.id
                    ? "2.5px solid #03a9f4"
                    : "2.5px solid transparent",
                borderRadius: 12,
                display: "block",
                position: "relative",
                zIndex: cervicalBones.length - idx,
                background: "transparent",
                boxShadow:
                  selectedBone === bone.id
                    ? "0 0 20px 6px #42a5f555, 0 0 0 5px #1976d2"
                    : hoveredBone === bone.id
                    ? "0 0 16px 3px #81d4fa88"
                    : "0 2px 8px 0 rgba(30,60,180,0.05)",
                transition: "box-shadow 0.2s, border 0.2s"
              }}
              onClick={() => onBoneClick?.(bone.id)}
              onMouseEnter={() => setHoveredBone(bone.id)}
              onMouseLeave={() => setHoveredBone(null)}
            />
          </HoverCardTrigger>
          <HoverCardContent>
            <div style={{ fontWeight: "bold", fontSize: 18, color: "#1976d2" }}>
              {bone.name}
            </div>
            <div style={{ fontSize: 14, color: "#333", marginTop: 4 }}>
              {/* You can add info here for each vertebra */}
              {`This is vertebra ${bone.id}. Click to select.`}
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
}