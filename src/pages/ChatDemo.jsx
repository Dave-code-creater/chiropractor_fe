import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, 
  Users, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Stethoscope,
  UserCheck,
  Shield,
  Clock
} from "lucide-react";
import NewChat from "@/features/chat/components/NewChat";

export default function ChatDemo() {
  const [activeDemo, setActiveDemo] = useState("overview");

  const features = [
    {
      icon: <Stethoscope className="h-6 w-6 text-blue-600" />,
      title: "Doctor-Patient Chat",
      description: "Direct communication channel between patients and healthcare providers",
      endpoint: "POST /conversations/doctor-patient",
      status: "implemented"
    },
    {
      icon: <Users className="h-6 w-6 text-green-600" />,
      title: "Multi-Participant Support",
      description: "Chat with doctors, staff members, and administration",
      endpoint: "GET /users/doctors",
      status: "implemented"
    },
    {
      icon: <Zap className="h-6 w-6 text-purple-600" />,
      title: "Real-time Messaging",
      description: "Instant message delivery with optimistic updates",
      endpoint: "POST /messages",
      status: "implemented"
    },
    {
      icon: <Shield className="h-6 w-6 text-orange-600" />,
      title: "Smart Duplicate Prevention",
      description: "Prevents multiple chats between same doctor-patient pair",
      endpoint: "Auto-handled",
      status: "implemented"
    },
    {
      icon: <UserCheck className="h-6 w-6 text-teal-600" />,
      title: "Auto-Registration",
      description: "Automatically registers users in chat service when needed",
      endpoint: "Auto-handled",
      status: "implemented"
    },
    {
      icon: <Clock className="h-6 w-6 text-red-600" />,
      title: "Message History",
      description: "Complete conversation history with timestamps",
      endpoint: "GET /conversations/:id/messages",
      status: "implemented"
    }
  ];

  const apiExamples = [
    {
      title: "Create Doctor-Patient Chat",
      method: "POST",
      endpoint: "/conversations/doctor-patient",
      description: "Create a direct chat between a patient and doctor",
      payload: {
        doctorId: 101,
        title: "Medical Consultation",
        initialMessage: "Hi Dr. Johnson, I have questions about my test results."
      },
      response: {
        success: true,
        statusCode: 201,
        metadata: {
          conversation: {
            _id: "conv123",
            title: "Consultation: Dr. Sarah Johnson & Patient Name",
            participants: ["doctor", "patient"],
            isActive: true
          },
          isNew: true,
          message: "Doctor-patient chat created successfully"
        }
      }
    },
    {
      title: "Get Available Doctors",
      method: "GET", 
      endpoint: "/users/doctors",
      description: "Retrieve list of available doctors for chat",
      payload: null,
      response: {
        success: true,
        metadata: [
          {
            id: 101,
            firstName: "Dr. Sarah",
            lastName: "Johnson",
            specialization: "Chiropractor",
            isOnline: true
          }
        ]
      }
    },
    {
      title: "Send Message",
      method: "POST",
      endpoint: "/messages", 
      description: "Send a message in an existing conversation",
      payload: {
        conversation_id: "conv123",
        content: "Thank you for the consultation!",
        sender_type: "user"
      },
      response: {
        success: true,
        metadata: {
          id: "msg456",
          content: "Thank you for the consultation!",
          sender_type: "user",
          created_at: "2025-01-24T10:30:00Z"
        }
      }
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <MessageCircle className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Chat System Demo</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Complete chat system with doctor-patient communication, real-time messaging, 
          and seamless backend integration.
        </p>
        
        <Alert className="max-w-4xl mx-auto">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Backend Integration Complete!</strong> All chat endpoints are now implemented 
            and ready for production use. The system supports direct doctor-patient communication 
            with smart duplicate prevention and auto-registration.
          </AlertDescription>
        </Alert>
      </div>

      <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="api">API Examples</TabsTrigger>
          <TabsTrigger value="live">Live Demo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    {feature.icon}
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <Badge 
                        variant={feature.status === 'implemented' ? 'default' : 'secondary'}
                        className="mt-1"
                      >
                        {feature.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {feature.description}
                  </p>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {feature.endpoint}
                  </code>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🩺 Doctor-Patient Chat Workflow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <p className="font-medium">Patient selects doctor</p>
                    <p className="text-sm text-muted-foreground">Choose from available healthcare providers</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground mx-auto" />
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <p className="font-medium">System creates secure chat</p>
                    <p className="text-sm text-muted-foreground">Auto-registers users and prevents duplicates</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground mx-auto" />
                <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <p className="font-medium">Real-time communication</p>
                    <p className="text-sm text-muted-foreground">Instant messaging with message history</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔧 Technical Implementation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="font-medium">Frontend Framework</span>
                    <Badge>React + RTK Query</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="font-medium">Backend Service</span>
                    <Badge>Node.js + Express</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="font-medium">Database</span>
                    <Badge>MongoDB</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="font-medium">Authentication</span>
                    <Badge>JWT Tokens</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="font-medium">API Base URL</span>
                    <Badge variant="outline">http://localhost:3000/v1/api/2025</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <div className="space-y-6">
            {apiExamples.map((example, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge variant={example.method === 'POST' ? 'default' : 'secondary'}>
                      {example.method}
                    </Badge>
                    <CardTitle className="text-lg">{example.title}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">{example.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Endpoint:</p>
                    <code className="block p-3 bg-muted rounded text-sm">
                      {example.method} {example.endpoint}
                    </code>
                  </div>
                  
                  {example.payload && (
                    <div>
                      <p className="text-sm font-medium mb-2">Request Body:</p>
                      <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                        {JSON.stringify(example.payload, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Response:</p>
                    <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                      {JSON.stringify(example.response, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="live" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🚀 Live Chat Interface</CardTitle>
              <p className="text-sm text-muted-foreground">
                Try the complete chat system with your implemented backend endpoints.
              </p>
            </CardHeader>
            <CardContent>
              <NewChat />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 