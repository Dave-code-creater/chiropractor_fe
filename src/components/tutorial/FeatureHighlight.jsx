import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  ArrowRight,
  ArrowLeft,
  X,
  Lightbulb,
  MousePointer,
  Eye,
  Hand,
  Play,
  Pause,
  SkipForward,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const FeatureHighlight = ({
  isActive = false,
  onClose,
  steps = [],
  currentStep = 0,
  onStepChange,
  autoAdvance = true,
  highlightColor = "blue",
  position = "auto", // 'auto', 'top', 'bottom', 'left', 'right'
}) => {
  const [isVisible, setIsVisible] = useState(isActive);
  const [highlightedElement, setHighlightedElement] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(autoAdvance);
  const overlayRef = useRef(null);
  const tooltipRef = useRef(null);
  const intervalRef = useRef(null);

  const currentStepData = steps[currentStep];

  useEffect(() => {
    setIsVisible(isActive);
    if (isActive && currentStepData) {
      highlightElement(currentStepData.target);
    } else {
      removeHighlight();
    }
  }, [isActive, currentStep, currentStepData]);

  useEffect(() => {
    if (isPlaying && autoAdvance && isActive) {
      intervalRef.current = setInterval(() => {
        nextStep();
      }, currentStepData?.duration || 5000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, autoAdvance, isActive, currentStep]);

  const highlightElement = (selector) => {
    const element = document.querySelector(selector);
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;

    // Create highlight overlay
    const highlight = {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft,
      width: rect.width,
      height: rect.height,
    };

    setHighlightedElement(highlight);

    // Position tooltip
    const tooltipX = rect.left + scrollLeft + rect.width / 2;
    const tooltipY = rect.top + scrollTop + rect.height + 20;

    setTooltipPosition({ x: tooltipX, y: tooltipY });

    // Scroll element into view
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const removeHighlight = () => {
    setHighlightedElement(null);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1);
    } else {
      // Tour completed
      setIsPlaying(false);
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const skipTour = () => {
    setIsPlaying(false);
    onClose();
  };

  if (!isVisible || !currentStepData) return null;

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      {/* Dark overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Highlight cutout */}
      {highlightedElement && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            top: highlightedElement.top - 4,
            left: highlightedElement.left - 4,
            width: highlightedElement.width + 8,
            height: highlightedElement.height + 8,
            boxShadow: `0 0 0 4px ${
              highlightColor === "blue"
                ? "#3B82F6"
                : highlightColor === "green"
                  ? "#10B981"
                  : highlightColor === "purple"
                    ? "#8B5CF6"
                    : highlightColor === "orange"
                      ? "#F59E0B"
                      : "#3B82F6"
            }, 
                       0 0 0 9999px rgba(0, 0, 0, 0.5)`,
            borderRadius: "8px",
            animation: "pulse 2s infinite",
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-50 max-w-sm"
        style={{
          left: tooltipPosition.x,
          top: tooltipPosition.y,
          transform: "translateX(-50%)",
        }}
      >
        <Card className="shadow-xl border-0 bg-white">
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div
                  className={`p-2 rounded-lg ${
                    highlightColor === "blue"
                      ? "bg-blue-100"
                      : highlightColor === "green"
                        ? "bg-green-100"
                        : highlightColor === "purple"
                          ? "bg-purple-100"
                          : highlightColor === "orange"
                            ? "bg-orange-100"
                            : "bg-blue-100"
                  }`}
                >
                  {currentStepData.action === "click" && (
                    <MousePointer
                      className={`h-4 w-4 ${
                        highlightColor === "blue"
                          ? "text-blue-600"
                          : highlightColor === "green"
                            ? "text-green-600"
                            : highlightColor === "purple"
                              ? "text-purple-600"
                              : highlightColor === "orange"
                                ? "text-orange-600"
                                : "text-blue-600"
                      }`}
                    />
                  )}
                  {currentStepData.action === "look" && (
                    <Eye
                      className={`h-4 w-4 ${
                        highlightColor === "blue"
                          ? "text-blue-600"
                          : highlightColor === "green"
                            ? "text-green-600"
                            : highlightColor === "purple"
                              ? "text-purple-600"
                              : highlightColor === "orange"
                                ? "text-orange-600"
                                : "text-blue-600"
                      }`}
                    />
                  )}
                  {currentStepData.action === "interact" && (
                    <Hand
                      className={`h-4 w-4 ${
                        highlightColor === "blue"
                          ? "text-blue-600"
                          : highlightColor === "green"
                            ? "text-green-600"
                            : highlightColor === "purple"
                              ? "text-purple-600"
                              : highlightColor === "orange"
                                ? "text-orange-600"
                                : "text-blue-600"
                      }`}
                    />
                  )}
                  {!currentStepData.action && (
                    <Target
                      className={`h-4 w-4 ${
                        highlightColor === "blue"
                          ? "text-blue-600"
                          : highlightColor === "green"
                            ? "text-green-600"
                            : highlightColor === "purple"
                              ? "text-purple-600"
                              : highlightColor === "orange"
                                ? "text-orange-600"
                                : "text-blue-600"
                      }`}
                    />
                  )}
                </div>
                <div>
                  <Badge variant="outline" className="text-xs">
                    Step {currentStep + 1} of {steps.length}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={skipTour}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Progress */}
            <Progress value={progress} className="mb-3 h-2" />

            {/* Content */}
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {currentStepData.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentStepData.content}
                </p>
              </div>

              {/* Action hint */}
              {currentStepData.action && (
                <div
                  className={`p-3 rounded-lg ${
                    highlightColor === "blue"
                      ? "bg-blue-50 border border-blue-200"
                      : highlightColor === "green"
                        ? "bg-green-50 border border-green-200"
                        : highlightColor === "purple"
                          ? "bg-purple-50 border border-purple-200"
                          : highlightColor === "orange"
                            ? "bg-orange-50 border border-orange-200"
                            : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {currentStepData.action === "click" && (
                      <>
                        <MousePointer className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Click on the highlighted element
                        </span>
                      </>
                    )}
                    {currentStepData.action === "look" && (
                      <>
                        <Eye className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Take a look at this feature
                        </span>
                      </>
                    )}
                    {currentStepData.action === "interact" && (
                      <>
                        <Hand className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Try interacting with this element
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Tip */}
              {currentStepData.tip && (
                <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Tip</p>
                    <p className="text-sm text-yellow-700">
                      {currentStepData.tip}
                    </p>
                  </div>
                </div>
              )}

              {/* Warning */}
              {currentStepData.warning && (
                <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      Important
                    </p>
                    <p className="text-sm text-red-700">
                      {currentStepData.warning}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={togglePlay}>
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextStep}
                  disabled={currentStep === steps.length - 1}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={skipTour}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Skip Tour
                </Button>
                {currentStep === steps.length - 1 ? (
                  <Button size="sm" onClick={onClose}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Finish
                  </Button>
                ) : (
                  <Button size="sm" onClick={nextStep}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Arrow pointing to highlighted element */}
        <div
          className={`absolute w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent ${
            highlightColor === "blue"
              ? "border-t-blue-500"
              : highlightColor === "green"
                ? "border-t-green-500"
                : highlightColor === "purple"
                  ? "border-t-purple-500"
                  : highlightColor === "orange"
                    ? "border-t-orange-500"
                    : "border-t-blue-500"
          }`}
          style={{
            top: "-8px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </>
  );
};

export default FeatureHighlight;
