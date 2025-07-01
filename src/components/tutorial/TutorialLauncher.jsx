import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import InteractiveTutorial from "./InteractiveTutorial";
import {
  HelpCircle,
  BookOpen,
  Play,
  Star,
  Clock,
  Users,
  Calendar,
  FileText,
  Shield,
  Search,
  BarChart3,
  Package,
  Eye,
  GraduationCap,
  Lightbulb,
  Zap,
} from "lucide-react";

const TutorialLauncher = ({
  variant = "button", // 'button', 'fab', 'card', 'inline'
  feature = null, // specific feature to highlight
  className = "",
  showBadge = true,
}) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(false);

  // Quick tutorial options
  const quickTutorials = [
    {
      id: "overview",
      title: "System Overview",
      description: "Basic navigation and dashboard",
      icon: Eye,
      duration: "3 min",
      color: "blue",
    },
    {
      id: "patients",
      title: "Patient Management",
      description: "Add and manage patient records",
      icon: Users,
      duration: "5 min",
      color: "green",
    },
    {
      id: "scheduling",
      title: "Appointment Scheduling",
      description: "Book and manage appointments",
      icon: Calendar,
      duration: "4 min",
      color: "orange",
    },
    {
      id: "search",
      title: "Global Search",
      description: "Find anything quickly",
      icon: Search,
      duration: "3 min",
      color: "cyan",
    },
  ];

  const handleStartTutorial = (tutorialId = null) => {
    setShowTutorial(true);
    setShowQuickStart(false);
  };

  const handleCloseTutorial = () => {
    setShowTutorial(false);
  };

  // Floating Action Button variant
  if (variant === "fab") {
    return (
      <>
        <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
          <Popover open={showQuickStart} onOpenChange={setShowQuickStart}>
            <PopoverTrigger asChild>
              <Button
                size="lg"
                className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-600 hover:bg-blue-700"
              >
                <HelpCircle className="h-6 w-6" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-0"
              side="top"
              align="end"
              sideOffset={10}
            >
              <div className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Quick Start</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Choose a tutorial to get started quickly
                </p>

                <div className="space-y-2">
                  {quickTutorials.map((tutorial) => {
                    const IconComponent = tutorial.icon;
                    return (
                      <button
                        key={tutorial.id}
                        onClick={() => handleStartTutorial(tutorial.id)}
                        className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2 rounded-lg ${
                              tutorial.color === "blue"
                                ? "bg-blue-100"
                                : tutorial.color === "green"
                                  ? "bg-green-100"
                                  : tutorial.color === "orange"
                                    ? "bg-orange-100"
                                    : tutorial.color === "cyan"
                                      ? "bg-cyan-100"
                                      : "bg-gray-100"
                            }`}
                          >
                            <IconComponent
                              className={`h-4 w-4 ${
                                tutorial.color === "blue"
                                  ? "text-blue-600"
                                  : tutorial.color === "green"
                                    ? "text-green-600"
                                    : tutorial.color === "orange"
                                      ? "text-orange-600"
                                      : tutorial.color === "cyan"
                                        ? "text-cyan-600"
                                        : "text-gray-600"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900">
                              {tutorial.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {tutorial.description}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {tutorial.duration}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <Separator className="my-3" />

                <Button
                  onClick={() => handleStartTutorial()}
                  className="w-full"
                  variant="outline"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  View All Tutorials
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {showTutorial && (
          <InteractiveTutorial
            onClose={handleCloseTutorial}
            initialFeature={feature}
          />
        )}
      </>
    );
  }

  // Card variant
  if (variant === "card") {
    return (
      <>
        <Card
          className={`hover:shadow-md transition-shadow cursor-pointer ${className}`}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
              Interactive Tutorials
              {showBadge && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-blue-100 text-blue-800"
                >
                  New
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Learn how to use the system with step-by-step guides
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {quickTutorials.slice(0, 4).map((tutorial) => {
                const IconComponent = tutorial.icon;
                return (
                  <button
                    key={tutorial.id}
                    onClick={() => handleStartTutorial(tutorial.id)}
                    className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-4 w-4 text-gray-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {tutorial.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {tutorial.duration}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <Button
              onClick={() => handleStartTutorial()}
              className="w-full"
              variant="outline"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Full Tutorial
            </Button>
          </CardContent>
        </Card>

        {showTutorial && (
          <InteractiveTutorial
            onClose={handleCloseTutorial}
            initialFeature={feature}
          />
        )}
      </>
    );
  }

  // Inline variant
  if (variant === "inline") {
    return (
      <>
        <div className={`flex items-center space-x-2 ${className}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStartTutorial(feature)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <HelpCircle className="h-4 w-4 mr-1" />
            How to use this feature
          </Button>
          {showBadge && (
            <Badge
              variant="secondary"
              className="bg-yellow-100 text-yellow-800 text-xs"
            >
              <Zap className="h-3 w-3 mr-1" />
              Tutorial
            </Badge>
          )}
        </div>

        {showTutorial && (
          <InteractiveTutorial
            onClose={handleCloseTutorial}
            initialFeature={feature}
          />
        )}
      </>
    );
  }

  // Default button variant
  return (
    <>
      <Button
        variant="outline"
        onClick={() => handleStartTutorial(feature)}
        className={className}
      >
        <HelpCircle className="h-4 w-4 mr-2" />
        Tutorial
        {showBadge && (
          <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
            New
          </Badge>
        )}
      </Button>

      {showTutorial && (
        <InteractiveTutorial
          onClose={handleCloseTutorial}
          initialFeature={feature}
        />
      )}
    </>
  );
};

export default TutorialLauncher;
