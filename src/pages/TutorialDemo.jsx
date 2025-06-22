import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import TutorialLauncher from '@/components/tutorial/TutorialLauncher';
import FeatureHighlight from '@/components/tutorial/FeatureHighlight';
import {
  HelpCircle,
  Play,
  Target,
  Lightbulb,
  Zap,
  BookOpen,
  Users,
  Calendar,
  FileText,
  Shield,
  Search,
  BarChart3,
  Package,
  Eye,
  MousePointer,
  Hand,
  Star,
  GraduationCap
} from 'lucide-react';

const TutorialDemo = () => {
  const [activeHighlight, setActiveHighlight] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Sample tutorial steps for demonstration
  const demoSteps = [
    {
      title: 'Welcome to Tutorial Demo',
      content: 'This demonstrates how the interactive tutorial system works throughout the application.',
      target: '.demo-header',
      action: 'look',
      tip: 'Each tutorial step can highlight specific UI elements'
    },
    {
      title: 'Tutorial Variants',
      content: 'The tutorial system supports multiple display variants: buttons, cards, inline helpers, and floating action buttons.',
      target: '.tutorial-variants',
      action: 'interact',
      tip: 'Try clicking on different tutorial launchers to see how they work'
    },
    {
      title: 'Feature Highlighting',
      content: 'Important features can be highlighted with interactive overlays that guide users through complex workflows.',
      target: '.feature-cards',
      action: 'highlight',
      tip: 'Highlighting draws attention to specific areas of the interface'
    },
    {
      title: 'Interactive Learning',
      content: 'Users can control the pace of tutorials with play/pause controls and step through content at their own speed.',
      target: '.demo-controls',
      action: 'click',
      tip: 'Interactive controls make learning more engaging'
    }
  ];

  const tutorialFeatures = [
    {
      id: 'comprehensive',
      title: 'Comprehensive Tutorials',
      description: 'Step-by-step guides for all major features',
      icon: BookOpen,
      color: 'blue',
      features: [
        'System overview and navigation',
        'Patient management workflows',
        'Appointment scheduling',
        'Report generation',
        'Security and compliance'
      ]
    },
    {
      id: 'interactive',
      title: 'Interactive Elements',
      description: 'Engaging and hands-on learning experience',
      icon: MousePointer,
      color: 'green',
      features: [
        'Click-through demonstrations',
        'Highlighted UI elements',
        'Progress tracking',
        'Auto-advance options',
        'Speed controls'
      ]
    },
    {
      id: 'contextual',
      title: 'Contextual Help',
      description: 'Help exactly where and when you need it',
      icon: Target,
      color: 'purple',
      features: [
        'Feature-specific tutorials',
        'Inline help buttons',
        'Floating assistance',
        'Smart suggestions',
        'Just-in-time learning'
      ]
    },
    {
      id: 'customizable',
      title: 'Customizable Experience',
      description: 'Personalized learning preferences',
      icon: Star,
      color: 'orange',
      features: [
        'Adjustable tutorial speed',
        'Show/hide hints',
        'Progress tracking',
        'Completion badges',
        'Personal preferences'
      ]
    }
  ];

  const startFeatureHighlight = () => {
    setActiveHighlight(true);
    setCurrentStep(0);
  };

  const stopFeatureHighlight = () => {
    setActiveHighlight(false);
  };

  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="demo-header text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Interactive Tutorial System Demo
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Experience how our comprehensive tutorial system helps users learn and master the chiropractic practice management platform
          </p>
          
          <div className="flex justify-center space-x-4">
            <Button onClick={startFeatureHighlight} className="bg-blue-600 hover:bg-blue-700">
              <Play className="h-4 w-4 mr-2" />
              Start Interactive Demo
            </Button>
            <TutorialLauncher variant="button" className="bg-green-600 hover:bg-green-700 text-white" />
          </div>
        </div>

        {/* Tutorial Variants */}
        <Card className="tutorial-variants">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-600" />
              Tutorial Launcher Variants
            </CardTitle>
            <CardDescription>
              Multiple ways to access tutorials throughout the application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Button Variant */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Button Variant</h3>
                <p className="text-sm text-gray-600">Standard button for toolbars and headers</p>
                <TutorialLauncher variant="button" />
              </div>

              {/* Inline Variant */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Inline Variant</h3>
                <p className="text-sm text-gray-600">Contextual help within content areas</p>
                <TutorialLauncher variant="inline" />
              </div>

              {/* Card Variant */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Card Variant</h3>
                <p className="text-sm text-gray-600">Dedicated tutorial sections</p>
                <div className="scale-75 origin-top-left">
                  <TutorialLauncher variant="card" />
                </div>
              </div>

              {/* FAB Note */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Floating Action Button</h3>
                <p className="text-sm text-gray-600">Always-available help (see bottom-right corner)</p>
                <div className="flex items-center text-blue-600">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm">Active on all pages</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Showcase */}
        <div className="feature-cards grid grid-cols-1 lg:grid-cols-2 gap-8">
          {tutorialFeatures.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card key={feature.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className={`p-3 rounded-lg mr-3 ${
                      feature.color === 'blue' ? 'bg-blue-100' :
                      feature.color === 'green' ? 'bg-green-100' :
                      feature.color === 'purple' ? 'bg-purple-100' :
                      feature.color === 'orange' ? 'bg-orange-100' : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`h-6 w-6 ${
                        feature.color === 'blue' ? 'text-blue-600' :
                        feature.color === 'green' ? 'text-green-600' :
                        feature.color === 'purple' ? 'text-purple-600' :
                        feature.color === 'orange' ? 'text-orange-600' : 'text-gray-600'
                      }`} />
                    </div>
                    {feature.title}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Demo Controls */}
        <Card className="demo-controls">
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-indigo-600" />
              Interactive Demo Controls
            </CardTitle>
            <CardDescription>
              Try the interactive tutorial features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button onClick={startFeatureHighlight} variant="outline">
                <Target className="h-4 w-4 mr-2" />
                Start Feature Highlighting
              </Button>
              <Button onClick={stopFeatureHighlight} variant="outline" disabled={!activeHighlight}>
                <Eye className="h-4 w-4 mr-2" />
                Stop Highlighting
              </Button>
              <TutorialLauncher variant="button" feature="overview" />
              <TutorialLauncher variant="button" feature="patients" />
              <TutorialLauncher variant="button" feature="analytics" />
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Tutorial Features</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• <strong>Auto-advance:</strong> Tutorials can automatically progress through steps</li>
                  <li>• <strong>Speed control:</strong> Users can adjust tutorial playback speed</li>
                  <li>• <strong>Progress tracking:</strong> System remembers completed tutorials</li>
                  <li>• <strong>Contextual help:</strong> Feature-specific guidance available throughout the app</li>
                  <li>• <strong>Interactive elements:</strong> Click, highlight, and demonstrate features in real-time</li>
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Feature Overview */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
            <TabsTrigger value="customization">Customization</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tutorial System Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Our interactive tutorial system provides comprehensive onboarding and feature education 
                  for the chiropractic practice management platform. It includes:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                    <span><strong>8 comprehensive tutorials</strong> covering all major system features</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                    <span><strong>Multiple display variants</strong> for different contexts and use cases</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3"></div>
                    <span><strong>Interactive highlighting</strong> that overlays on actual UI elements</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3"></div>
                    <span><strong>Progress tracking</strong> and completion badges for user motivation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Experience Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">UX</Badge>
                    <span className="text-sm">Auto-play with speed controls</span>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">UX</Badge>
                    <span className="text-sm">Step-by-step progression</span>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">UX</Badge>
                    <span className="text-sm">Interactive highlighting</span>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">UX</Badge>
                    <span className="text-sm">Progress indicators</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Technical Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">Tech</Badge>
                    <span className="text-sm">Modular component architecture</span>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">Tech</Badge>
                    <span className="text-sm">CSS selector-based targeting</span>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">Tech</Badge>
                    <span className="text-sm">State management integration</span>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">Tech</Badge>
                    <span className="text-sm">Responsive design support</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="integration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Integration Examples</CardTitle>
                <CardDescription>
                  How tutorials are integrated throughout the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Admin Dashboard</h4>
                    <p className="text-sm text-gray-600">Inline tutorial launcher in header</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Patient Management</h4>
                    <p className="text-sm text-gray-600">Feature-specific help buttons</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Global Access</h4>
                    <p className="text-sm text-gray-600">Floating action button on all pages</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customization" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customization Options</CardTitle>
                <CardDescription>
                  How users can personalize their tutorial experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">Auto-play tutorials</span>
                    <Badge variant="secondary">User Setting</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">Tutorial speed (Slow/Normal/Fast)</span>
                    <Badge variant="secondary">User Setting</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">Show helpful hints</span>
                    <Badge variant="secondary">User Setting</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">Progress tracking</span>
                    <Badge variant="secondary">Automatic</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Feature Highlight Overlay */}
      {activeHighlight && (
        <FeatureHighlight
          isActive={activeHighlight}
          onClose={stopFeatureHighlight}
          steps={demoSteps}
          currentStep={currentStep}
          onStepChange={handleStepChange}
          autoAdvance={false}
          highlightColor="blue"
        />
      )}
    </div>
  );
};

export default TutorialDemo; 