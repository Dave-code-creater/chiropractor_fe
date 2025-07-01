import React from "react";
import TutorialLauncher from "./TutorialLauncher";

const TutorialCard = ({ feature, className = "" }) => {
  return (
    <div className={`tutorial-card ${className}`}>
      <TutorialLauncher variant="card" feature={feature} className="w-full" />
    </div>
  );
};

export default TutorialCard;
