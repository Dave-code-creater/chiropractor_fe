import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Square,
  Volume2,
  VolumeX,
  Settings,
  HelpCircle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  X,
  Lightbulb,
  Target,
  MousePointer,
  Eye,
  Hand,
  Zap,
  BookOpen,
  GraduationCap,
  Star,
  Clock,
  Users,
  Calendar,
  FileText,
  Shield,
  Search,
  BarChart3,
  Package,
  ChevronRight,
  Trophy,
  Sparkles,
  Monitor,
  Maximize2,
  Minimize2,
} from "lucide-react";

const InteractiveTutorial = ({ onClose, initialFeature = null }) => {
  const [currentTutorial, setCurrentTutorial] = useState(
    initialFeature || null,
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tutorialSettings, setTutorialSettings] = useState({
    autoPlay: true,
    showHints: true,
    playSound: false,
    speed: "normal",
  });
  const [completedTutorials, setCompletedTutorials] = useState([]);
  const [highlightElement, setHighlightElement] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef(null);

  // Tutorial data structure with enhanced content
  const [tutorials] = useState({
    overview: {
      id: "overview",
      title: "System Overview",
      description: "Get familiar with the main dashboard and navigation",
      icon: Eye,
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
      duration: "3 min",
      difficulty: "Beginner",
      category: "Getting Started",
      steps: [
        {
          title: "Welcome to Your Chiropractic Practice Management System",
          content:
            "This comprehensive system helps you manage patients, appointments, reports, and much more. Let's take a guided tour to get you started!",
          action: "highlight",
          target: ".dashboard-header",
          tip: "The header shows your current location and quick actions",
          animation: "fadeIn",
        },
        {
          title: "Navigation Menu",
          content:
            "Use the sidebar to navigate between different features. Each section is designed for specific tasks and workflows.",
          action: "highlight",
          target: ".sidebar",
          tip: "Click on any menu item to explore different features",
          animation: "slideIn",
        },
        {
          title: "Quick Statistics Dashboard",
          content:
            "These cards show real-time statistics about your practice - patients, appointments, revenue, and system health.",
          action: "highlight",
          target: ".stats-cards",
          tip: "Statistics update automatically every few seconds",
          animation: "pulse",
        },
        {
          title: "Recent Activity Feed",
          content:
            "Stay updated with the latest activities in your practice. See new patients, appointments, and system events.",
          action: "highlight",
          target: ".activity-feed",
          tip: 'Click "View All" to see complete activity history',
          animation: "bounce",
        },
      ],
    },
    analytics: {
      id: "analytics",
      title: "Dashboard Analytics",
      description: "Master the powerful analytics and reporting features",
      icon: BarChart3,
      color: "purple",
      gradient: "from-purple-500 to-pink-500",
      duration: "5 min",
      difficulty: "Intermediate",
      category: "Analytics",
      steps: [
        {
          title: "Analytics Dashboard Overview",
          content:
            "The analytics dashboard provides comprehensive insights into your practice performance with real-time charts and interactive metrics.",
          action: "demo",
          target: ".analytics-dashboard",
          tip: "All charts are interactive - hover and click to explore data",
          animation: "fadeIn",
        },
        {
          title: "Time Range Selection",
          content:
            "Choose different time periods to analyze your data. Options include 24 hours, 7 days, 30 days, and 90 days for comprehensive analysis.",
          action: "interact",
          target: ".time-range-selector",
          tip: "Try selecting different time ranges to see how data changes",
          animation: "slideIn",
        },
        {
          title: "Patient Growth Trends",
          content:
            "This area chart shows your patient growth over time, including new patient registrations and total active patients.",
          action: "highlight",
          target: ".patient-trends-chart",
          tip: "Hover over data points to see exact values and trends",
          animation: "pulse",
        },
      ],
    },
    patients: {
      id: "patients",
      title: "Patient Management",
      description: "Master the advanced patient management features",
      icon: Users,
      color: "green",
      gradient: "from-green-500 to-emerald-500",
      duration: "7 min",
      difficulty: "Intermediate",
      category: "Patient Care",
      steps: [
        {
          title: "Patient Management Hub",
          content:
            "Manage all aspects of patient care from registration to treatment history. This is your central hub for comprehensive patient information.",
          action: "demo",
          target: ".patient-management",
          tip: "All patient data is HIPAA compliant and encrypted",
          animation: "fadeIn",
        },
        {
          title: "Advanced Search & Filtering",
          content:
            "Use the powerful search bar to quickly find patients by name, email, phone, or medical conditions. Apply multiple filters to narrow results.",
          action: "interact",
          target: ".patient-search",
          tip: "Search is real-time - results appear as you type",
          animation: "slideIn",
        },
        {
          title: "Patient Profile Cards",
          content:
            "Each patient card shows essential information at a glance - status, priority, last visit, alerts, and treatment progress.",
          action: "highlight",
          target: ".patient-cards",
          tip: "Click on any patient card to view detailed information",
          animation: "pulse",
        },
      ],
    },
    scheduling: {
      id: "scheduling",
      title: "Smart Scheduling",
      description: "Learn the intelligent scheduling system",
      icon: Calendar,
      color: "orange",
      gradient: "from-orange-500 to-red-500",
      duration: "6 min",
      difficulty: "Intermediate",
      category: "Scheduling",
      steps: [
        {
          title: "Intelligent Scheduling System",
          content:
            "Manage doctor availability, appointments, and scheduling conflicts with our AI-powered scheduling system.",
          action: "demo",
          target: ".scheduling-system",
          tip: "The system automatically detects and prevents conflicts",
          animation: "fadeIn",
        },
      ],
    },
  });

  // Enhanced functions
  const getCurrentTutorial = () => tutorials[currentTutorial];
  const getCurrentStep = () => getCurrentTutorial()?.steps[currentStep];
  const totalSteps = getCurrentTutorial()?.steps?.length || 0;
  const progressPercentage =
    totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
      if (tutorialSettings.playSound) {
        // Play sound effect
        toast.success("Next step");
      }
    } else {
      completeTutorial();
    }
  }, [currentStep, totalSteps, tutorialSettings.playSound]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const startTutorial = (tutorialId) => {
    setCurrentTutorial(tutorialId);
    setCurrentStep(0);
    setIsPlaying(tutorialSettings.autoPlay);
    toast.success(`Started ${tutorials[tutorialId]?.title} tutorial`);
  };

  const completeTutorial = () => {
    if (currentTutorial && !completedTutorials.includes(currentTutorial)) {
      setCompletedTutorials((prev) => [...prev, currentTutorial]);
      toast.success("🎉 Tutorial completed!", {
        description: `You've mastered ${getCurrentTutorial()?.title}!`,
      });
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const resetTutorial = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const updateSetting = (key, value) => {
    setTutorialSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && tutorialSettings.autoPlay) {
      const speed =
        tutorialSettings.speed === "slow"
          ? 4000
          : tutorialSettings.speed === "fast"
            ? 2000
            : 3000;

      intervalRef.current = setInterval(() => {
        nextStep();
      }, speed);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isPlaying, tutorialSettings.autoPlay, tutorialSettings.speed, nextStep]);

  const TutorialCard = ({ tutorial }) => {
    const isCompleted = completedTutorials.includes(tutorial.id);
    const isActive = currentTutorial === tutorial.id;
    const IconComponent = tutorial.icon;

    return (
      <Card
        className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
          isActive
            ? "border-blue-500 shadow-lg bg-blue-50"
            : isCompleted
              ? "border-green-200 bg-green-50"
              : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={() => startTutorial(tutorial.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div
              className={`p-3 rounded-xl bg-gradient-to-r ${tutorial.gradient} shadow-lg`}
            >
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 truncate">
                  {tutorial.title}
                </h3>
                {isCompleted && (
                  <div className="flex items-center text-green-600">
                    <Trophy className="h-4 w-4" />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {tutorial.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {tutorial.duration}
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    {tutorial.difficulty}
                  </div>
                </div>
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className="text-xs"
                >
                  {tutorial.category}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const TutorialPlayer = () => (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className={`p-2 rounded-lg bg-gradient-to-r ${getCurrentTutorial()?.gradient} shadow-md`}
            >
              {getCurrentTutorial()?.icon &&
                React.createElement(getCurrentTutorial().icon, {
                  className: "h-5 w-5 text-white",
                })}
            </div>
            <div>
              <CardTitle className="text-lg">
                {getCurrentTutorial()?.title}
              </CardTitle>
              <CardDescription className="text-sm">
                Step {currentStep + 1} of {totalSteps}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Current Step Content */}
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-2">
              {getCurrentStep()?.title}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {getCurrentStep()?.content}
            </p>
          </div>

          {getCurrentStep()?.tip && tutorialSettings.showHints && (
            <Alert className="border-amber-200 bg-amber-50">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Pro Tip</AlertTitle>
              <AlertDescription className="text-amber-700">
                {getCurrentStep().tip}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <Button
              variant={isPlaying ? "secondary" : "default"}
              size="sm"
              onClick={togglePlay}
              className="px-4"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Play
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={nextStep}
              disabled={currentStep === totalSteps - 1}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={resetTutorial}>
              <Square className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Try it yourself:</span>
          <Button variant="outline" size="sm">
            <MousePointer className="h-4 w-4 mr-2" />
            Click to interact
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const TutorialSettings = () =>
    showSettings && (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Tutorial Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-play tutorials</Label>
              <p className="text-sm text-gray-500">
                Automatically advance through steps
              </p>
            </div>
            <Switch
              checked={tutorialSettings.autoPlay}
              onCheckedChange={(checked) => updateSetting("autoPlay", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Show helpful hints</Label>
              <p className="text-sm text-gray-500">
                Display pro tips and suggestions
              </p>
            </div>
            <Switch
              checked={tutorialSettings.showHints}
              onCheckedChange={(checked) => updateSetting("showHints", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Play sound effects</Label>
              <p className="text-sm text-gray-500">
                Audio feedback for actions
              </p>
            </div>
            <Switch
              checked={tutorialSettings.playSound}
              onCheckedChange={(checked) => updateSetting("playSound", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label>Tutorial speed</Label>
            <div className="flex space-x-2">
              {["slow", "normal", "fast"].map((speed) => (
                <Button
                  key={speed}
                  variant={
                    tutorialSettings.speed === speed ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => updateSetting("speed", speed)}
                >
                  {speed.charAt(0).toUpperCase() + speed.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );

  const ProgressOverview = () => {
    const totalTutorials = Object.keys(tutorials).length;
    const completedCount = completedTutorials.length;
    const progressPercentage = (completedCount / totalTutorials) * 100;

    return (
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg mr-3">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            Learning Progress
          </CardTitle>
          <CardDescription>
            {completedCount} of {totalTutorials} tutorials completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span className="font-semibold">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-white rounded-xl shadow-sm border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {completedCount}
                </div>
                <div className="text-sm text-green-700 font-medium">
                  Completed
                </div>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm border border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {totalTutorials - completedCount}
                </div>
                <div className="text-sm text-blue-700 font-medium">
                  Remaining
                </div>
              </div>
            </div>

            {progressPercentage === 100 && (
              <Alert className="border-green-200 bg-green-50">
                <Trophy className="h-4 w-4" />
                <AlertTitle className="flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Congratulations! 🎉
                </AlertTitle>
                <AlertDescription>
                  You've completed all tutorials! You're now ready to use the
                  system like a pro.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${
        isFullscreen ? "p-0" : ""
      }`}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-7xl w-full overflow-hidden ${
          isFullscreen ? "max-h-screen rounded-none" : "max-h-[90vh]"
        }`}
      >
        <div className="flex h-full">
          {/* Enhanced Tutorial List */}
          <div className="w-1/3 border-r border-gray-200 bg-gray-50">
            <div className="p-6 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg mr-3">
                    <HelpCircle className="h-6 w-6 text-white" />
                  </div>
                  Interactive Tutorial
                </h2>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-gray-600">
                Master your chiropractic practice management system with
                step-by-step guidance
              </p>
            </div>

            <ScrollArea className="h-[calc(90vh-120px)]">
              <div className="p-6 space-y-6">
                <ProgressOverview />
                <TutorialSettings />

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Available Tutorials
                  </h3>
                  {Object.values(tutorials).map((tutorial) => (
                    <TutorialCard key={tutorial.id} tutorial={tutorial} />
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Enhanced Tutorial Content */}
          <div className="flex-1 flex flex-col bg-white">
            {getCurrentTutorial() ? (
              <div className="h-full flex">
                {/* Tutorial Player */}
                <div className="w-2/5 p-6">
                  <TutorialPlayer />
                </div>

                {/* Enhanced Demonstration Area */}
                <div className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-blue-50">
                  <Card className="h-full border-2 border-dashed border-gray-300">
                    <CardHeader className="text-center">
                      <CardTitle className="flex items-center justify-center">
                        <Monitor className="h-6 w-6 mr-2 text-blue-600" />
                        Live Demonstration
                      </CardTitle>
                      <CardDescription>
                        Interactive preview of {getCurrentTutorial().title}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-full flex items-center justify-center">
                      <div className="text-center max-w-md">
                        <div className="relative mb-8">
                          <div
                            className={`w-40 h-40 bg-gradient-to-r ${getCurrentTutorial().gradient} rounded-full flex items-center justify-center mx-auto shadow-2xl`}
                          >
                            {getCurrentTutorial()?.icon &&
                              React.createElement(getCurrentTutorial().icon, {
                                className: "h-20 w-20 text-white",
                              })}
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                            <Sparkles className="h-4 w-4 text-yellow-800" />
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {getCurrentStep()?.title}
                        </h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          This interactive area demonstrates the actual features
                          in real-time. In a live environment, you would see the
                          highlighted elements and be able to interact with them
                          directly.
                        </p>

                        {getCurrentStep()?.action && (
                          <div className="p-4 bg-white rounded-xl shadow-lg border border-blue-200">
                            <div className="flex items-center justify-center space-x-3 text-blue-700">
                              {getCurrentStep().action === "highlight" && (
                                <Target className="h-6 w-6" />
                              )}
                              {getCurrentStep().action === "interact" && (
                                <MousePointer className="h-6 w-6" />
                              )}
                              {getCurrentStep().action === "demo" && (
                                <Play className="h-6 w-6" />
                              )}
                              <span className="font-semibold text-lg">
                                {getCurrentStep().action === "highlight" &&
                                  "Element Highlighted"}
                                {getCurrentStep().action === "interact" &&
                                  "Ready to Interact"}
                                {getCurrentStep().action === "demo" &&
                                  "Live Demonstration"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                              {getCurrentStep().action === "highlight" &&
                                "The relevant UI element is now highlighted for your attention"}
                              {getCurrentStep().action === "interact" &&
                                "Click and explore the feature to learn hands-on"}
                              {getCurrentStep().action === "demo" &&
                                "Watch as we demonstrate the feature step by step"}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center max-w-lg">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <BookOpen className="h-16 w-16 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Welcome to Interactive Tutorials
                  </h3>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Select a tutorial from the left panel to start your learning
                    journey. Each tutorial is designed to help you master the
                    chiropractic practice management system efficiently and
                    effectively.
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <Badge variant="secondary" className="px-4 py-2">
                      <Clock className="h-4 w-4 mr-2" />
                      3-7 minutes each
                    </Badge>
                    <Badge variant="secondary" className="px-4 py-2">
                      <Target className="h-4 w-4 mr-2" />
                      Interactive demos
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveTutorial;
