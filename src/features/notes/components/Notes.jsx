import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  FileText,
  Calendar,
  Clock,
  User,
  Stethoscope,
  Edit,
  Save,
  X,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  ClipboardCheck,
  Activity,
  Target,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Car,
  Briefcase,
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import {
  useGetClinicalNotesQuery,
  useGetClinicalNotesByPatientQuery,
  useGetClinicalNoteQuery,
  useCreateClinicalNoteMutation,
  useUpdateClinicalNoteMutation,
  useDeleteClinicalNoteMutation,
  useCreateSOAPNoteMutation,
  useUpdateSOAPNoteMutation,
  useGetSOAPNotesQuery,
  useSearchClinicalNotesQuery,
  useGetNoteTemplatesQuery,
} from "@/api";

// Mock patient data for doctor view
const mockPatients = [
  {
    id: "pt-001",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    dateOfBirth: "1985-03-15",
    age: 39,
    gender: "Female",
    address: "123 Main St, City, State 12345",
    lastVisit: "2024-01-15",
    nextAppointment: "2024-01-22",
    status: "active",
    primaryCondition: "Lower Back Pain",
    secondaryConditions: ["Muscle Spasm", "Poor Posture"],
    insurance: "Blue Cross Blue Shield",
    emergencyContact: "John Johnson - (555) 987-6543",
    totalVisits: 8,
    medicalHistory: {
      allergies: "None known",
      medications: "Ibuprofen 200mg as needed",
      previousSurgeries: "None",
      chronicConditions: "None",
    },
    vitals: {
      height: "5'6\"",
      weight: "140 lbs",
      bloodPressure: "120/80",
      lastUpdated: "2024-01-15",
    },
  },
  // ... other mock patients
];

// Mock clinical notes data for doctor view
const mockClinicalNotes = {
  "pt-001": [
    {
      id: "note-001",
      date: "2024-01-15",
      type: "Progress Note",
      chiefComplaint: "Lower back pain, improved since last visit",
      assessment: "Patient reports 50% improvement in lower back pain. Range of motion has increased significantly.",
      treatment: "Spinal manipulation L3-L5, soft tissue therapy, therapeutic exercises",
      plan: "Continue current treatment plan. Add core strengthening exercises. Follow-up in 1 week.",
      doctorId: "dr-001",
      doctorName: "Dr. Dieu Phan",
      duration: "30 minutes",
      status: "completed",
    },
    {
      id: "note-002",
      date: "2024-01-08",
      type: "Initial Assessment",
      chiefComplaint: "Acute lower back pain following lifting incident",
      assessment: "Acute lumbar strain with muscle spasm. Limited range of motion. Pain level 7/10.",
      treatment: "Initial spinal adjustment, ice therapy, patient education on proper lifting techniques",
      plan: "Return in 3-4 days. Ice 15-20 minutes every 2 hours. Avoid heavy lifting.",
      doctorId: "dr-001",
      doctorName: "Dr. Dieu Phan",
      duration: "45 minutes",
      status: "completed",
    },
  ],
  "pt-002": [
    {
      id: "note-003",
      date: "2024-01-10",
      type: "Follow-up",
      chiefComplaint: "Persistent neck pain and headaches",
      assessment: "Cervical spine dysfunction with associated tension headaches. Muscle tension in upper trapezius.",
      treatment: "Cervical manipulation C2-C4, trigger point therapy, postural correction exercises",
      plan: "Continue treatment 2x/week for 2 weeks. Ergonomic workplace assessment recommended.",
      doctorId: "dr-001",
      doctorName: "Dr. Dieu Phan",
      duration: "35 minutes",
      status: "completed",
    },
  ],
};

// Mock clinical notes data for patient view - organized by cases
const mockPatientCases = [
  {
    id: "case-001",
    title: "Lower Back Injury - Car Accident",
    incidentType: "car_accident",
    incidentDate: "2024-01-03",
    status: "active",
    priority: "high",
    description: "Motor vehicle accident resulting in lower back injury",
    primaryCondition: "Lumbar Strain",
    secondaryConditions: ["Muscle Spasm", "Limited Mobility"],
    doctorName: "Dr. Dieu Phan",
    specialty: "Chiropractic",
    startDate: "2024-01-03",
    estimatedDuration: "6-8 weeks",
    progress: 65, // percentage
    nextAppointment: "2024-01-22",
    notes: [
      {
        id: "note-001",
        date: "2024-01-15",
        type: "Progress Note",
        doctorName: "Dr. Dieu Phan",
        specialty: "Chiropractic",
        visitType: "Follow-up",
        chiefComplaint: "Lower back pain improvement",
        assessment: "Significant improvement in lower back pain. Range of motion has increased by 60%. Patient reports pain level decreased from 7/10 to 3/10.",
        treatment: "Spinal manipulation L3-L5, soft tissue therapy, therapeutic exercises",
        plan: "Continue current treatment plan. Add core strengthening exercises. Follow-up in 1 week.",
        recommendations: [
          "Continue prescribed exercises daily",
          "Apply ice for 15-20 minutes after exercise",
          "Maintain proper posture during work",
          "Avoid heavy lifting over 20 lbs"
        ],
        nextAppointment: "2024-01-22",
        duration: "30 minutes",
        status: "completed",
        priority: "routine",
      },
      {
        id: "note-002",
        date: "2024-01-08",
        type: "Initial Assessment",
        doctorName: "Dr. Dieu Phan",
        specialty: "Chiropractic",
        visitType: "New Patient",
        chiefComplaint: "Acute lower back pain following car accident",
        assessment: "Acute lumbar strain with muscle spasm. Limited range of motion. Pain level 7/10. MRI shows no disc herniation.",
        treatment: "Initial spinal adjustment, ice therapy, patient education on proper lifting techniques",
        plan: "Return in 3-4 days. Ice 15-20 minutes every 2 hours. Avoid heavy lifting for 2 weeks.",
        recommendations: [
          "Rest and avoid aggravating activities",
          "Ice therapy every 2 hours",
          "Gentle stretching as tolerated",
          "Return to work with lifting restrictions"
        ],
        nextAppointment: "2024-01-12",
        duration: "45 minutes",
        status: "completed",
        priority: "urgent",
      },
      {
        id: "note-003",
        date: "2024-01-03",
        type: "Treatment Plan",
        doctorName: "Dr. Dieu Phan",
        specialty: "Chiropractic",
        visitType: "Consultation",
        chiefComplaint: "Car accident lower back injury treatment planning",
        assessment: "Comprehensive evaluation completed. Developing treatment strategy for car accident injuries.",
        treatment: "Treatment plan established for 6-week program",
        plan: "6-week treatment program: 2x/week visits, exercise therapy, lifestyle modifications",
        recommendations: [
          "Attend all scheduled appointments",
          "Complete home exercise program",
          "Ergonomic workplace assessment",
          "Follow up with insurance adjuster"
        ],
        treatmentGoals: [
          "Reduce pain from 7/10 to 2/10",
          "Improve range of motion by 80%",
          "Return to normal activities",
          "Prevent chronic pain development"
        ],
        timeline: "6 weeks",
        duration: "60 minutes",
        status: "active",
        priority: "high",
      }
    ]
  },
  {
    id: "case-002",
    title: "Neck Strain - Work Injury",
    incidentType: "work_injury",
    incidentDate: "2024-01-10",
    status: "active",
    priority: "medium",
    description: "Repetitive strain injury from computer work",
    primaryCondition: "Cervical Strain",
    secondaryConditions: ["Tension Headaches", "Shoulder Tension"],
    doctorName: "Dr. Sarah Wilson",
    specialty: "Physical Therapy",
    startDate: "2024-01-12",
    estimatedDuration: "4-6 weeks",
    progress: 30, // percentage
    nextAppointment: "2024-01-20",
    notes: [
      {
        id: "note-004",
        date: "2024-01-12",
        type: "Initial Assessment",
        doctorName: "Dr. Sarah Wilson",
        specialty: "Physical Therapy",
        visitType: "New Patient",
        chiefComplaint: "Neck pain and headaches from work-related repetitive strain",
        assessment: "Cervical spine dysfunction with forward head posture. Muscle tension in upper trapezius and suboccipital muscles. Tension-type headaches.",
        treatment: "Postural assessment, manual therapy, ergonomic education",
        plan: "4-week treatment program focusing on posture correction and strengthening",
        recommendations: [
          "Ergonomic workstation setup",
          "Take breaks every 30 minutes",
          "Neck stretches throughout the day",
          "Heat therapy for muscle tension"
        ],
        treatmentGoals: [
          "Eliminate tension headaches",
          "Improve neck range of motion",
          "Correct forward head posture",
          "Return to work without restrictions"
        ],
        timeline: "4 weeks",
        duration: "45 minutes",
        status: "completed",
        priority: "medium",
      }
    ]
  },
  {
    id: "case-003",
    title: "Chronic Pain Management",
    incidentType: "general_pain",
    incidentDate: "2023-12-01",
    status: "ongoing",
    priority: "routine",
    description: "Long-term management of chronic lower back pain",
    primaryCondition: "Chronic Lower Back Pain",
    secondaryConditions: ["Disc Degeneration", "Muscle Weakness"],
    doctorName: "Dr. Michael Chen",
    specialty: "Pain Management",
    startDate: "2023-12-01",
    estimatedDuration: "Ongoing",
    progress: 75, // percentage
    nextAppointment: "2024-01-25",
    notes: [
      {
        id: "note-005",
        date: "2024-01-05",
        type: "Progress Note",
        doctorName: "Dr. Michael Chen",
        specialty: "Pain Management",
        visitType: "Follow-up",
        chiefComplaint: "Chronic pain management review",
        assessment: "Good progress with current pain management strategy. Patient reports improved function and reduced pain episodes.",
        treatment: "Medication adjustment, continued exercise therapy",
        plan: "Continue current regimen with monthly follow-ups",
        recommendations: [
          "Maintain regular exercise routine",
          "Continue prescribed medications",
          "Stress management techniques",
          "Monitor pain levels daily"
        ],
        duration: "30 minutes",
        status: "completed",
        priority: "routine",
      }
    ]
  }
];

// Patient Notes Component for patient view
const PatientNotesView = ({ userRole, userId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [expandedCases, setExpandedCases] = useState({});

  // Get all notes from all cases
  const allNotes = useMemo(() => {
    const notes = [];
    mockPatientCases.forEach(patientCase => {
      patientCase.notes.forEach(note => {
        notes.push({
          ...note,
          caseId: patientCase.id,
          caseTitle: patientCase.title,
          caseStatus: patientCase.status,
          casePriority: patientCase.priority,
          incidentType: patientCase.incidentType
        });
      });
    });
    return notes;
  }, []);

  const filteredCases = useMemo(() => {
    let filtered = mockPatientCases;

    if (searchTerm) {
      filtered = filtered.filter(patientCase =>
        patientCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patientCase.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patientCase.primaryCondition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patientCase.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patientCase.notes.some(note =>
          note.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.assessment.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(patientCase => patientCase.status === filterStatus);
    }

    if (filterType !== "all") {
      filtered = filtered.filter(patientCase => 
        patientCase.notes.some(note => note.type.toLowerCase().includes(filterType.toLowerCase()))
      );
    }

    return filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  }, [searchTerm, filterType, filterStatus]);

  const filteredNotes = useMemo(() => {
    let filtered = allNotes;

    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.assessment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.caseTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter(note => note.type.toLowerCase().includes(filterType.toLowerCase()));
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(note => note.caseStatus === filterStatus);
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [allNotes, searchTerm, filterType, filterStatus]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'initial assessment':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'progress note':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'treatment plan':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'routine':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getIncidentIcon = (incidentType) => {
    switch (incidentType) {
      case 'car_accident':
        return Car;
      case 'work_injury':
        return Briefcase;
      case 'sports_injury':
        return Activity;
      case 'general_pain':
        return Heart;
      default:
        return ClipboardCheck;
    }
  };

  const toggleCaseExpansion = (caseId) => {
    setExpandedCases(prev => ({
      ...prev,
      [caseId]: !prev[caseId]
    }));
  };

  // If viewing a specific note
  if (selectedNote) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setSelectedNote(null)}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Notes
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">
                {selectedNote.type}
              </h1>
              <p className="text-muted-foreground mt-1">
                {formatDate(selectedNote.date)} • {selectedNote.doctorName} • {selectedNote.caseTitle}
              </p>
            </div>
          </div>

          {/* Note Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5" />
                  Visit Details
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(selectedNote.type)}>
                    {selectedNote.type}
                  </Badge>
                  <Badge className={getPriorityColor(selectedNote.priority)}>
                    {selectedNote.priority}
                  </Badge>
                  <Badge className={getStatusColor(selectedNote.caseStatus)}>
                    {selectedNote.caseStatus}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Case:</strong> {selectedNote.caseTitle}
                </div>
                <div>
                  <strong>Doctor:</strong> {selectedNote.doctorName}
                </div>
                <div>
                  <strong>Specialty:</strong> {selectedNote.specialty}
                </div>
                <div>
                  <strong>Visit Type:</strong> {selectedNote.visitType}
                </div>
                <div>
                  <strong>Duration:</strong> {selectedNote.duration}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Chief Complaint
                  </h4>
                  <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {selectedNote.chiefComplaint}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" />
                    Assessment
                  </h4>
                  <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {selectedNote.assessment}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Treatment Provided
                  </h4>
                  <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {selectedNote.treatment}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Treatment Plan
                  </h4>
                  <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {selectedNote.plan}
                  </p>
                </div>

                {selectedNote.recommendations && selectedNote.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {selectedNote.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedNote.treatmentGoals && selectedNote.treatmentGoals.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Treatment Goals
                    </h4>
                    <ul className="space-y-2">
                      {selectedNote.treatmentGoals.map((goal, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedNote.nextAppointment && (
                  <div>
                    <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Next Appointment
                    </h4>
                    <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      {formatDate(selectedNote.nextAppointment)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Doctor Notes & Treatment Plans
            </h1>
            <p className="text-muted-foreground mt-1">
              View your medical notes and treatment plans organized by cases
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-64 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search cases, notes, doctors, or conditions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Notes</SelectItem>
                  <SelectItem value="initial">Initial Assessment</SelectItem>
                  <SelectItem value="progress">Progress Notes</SelectItem>
                  <SelectItem value="treatment">Treatment Plans</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cases</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Cases Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-green-100">
                  <Activity className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockPatientCases.filter(c => c.status === 'active').length}</p>
                  <p className="text-sm text-muted-foreground">Active Cases</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-100">
                  <ClipboardCheck className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{allNotes.length}</p>
                  <p className="text-sm text-muted-foreground">Total Notes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockPatientCases.filter(c => c.nextAppointment).length}</p>
                  <p className="text-sm text-muted-foreground">Upcoming Appointments</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cases List */}
        {filteredCases.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">My Treatment Cases</h2>
            {filteredCases.map((patientCase) => {
              const Icon = getIncidentIcon(patientCase.incidentType);
              const isExpanded = expandedCases[patientCase.id];
              
              return (
                <Card key={patientCase.id} className="border-l-4 border-l-primary/30">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{patientCase.title}</h3>
                            <Badge className={getStatusColor(patientCase.status)}>
                              {patientCase.status}
                            </Badge>
                            <Badge className={getPriorityColor(patientCase.priority)}>
                              {patientCase.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {patientCase.description}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <strong>Primary Condition:</strong> {patientCase.primaryCondition}
                            </div>
                            <div>
                              <strong>Doctor:</strong> {patientCase.doctorName}
                            </div>
                            <div>
                              <strong>Started:</strong> {formatDate(patientCase.startDate)}
                            </div>
                            <div>
                              <strong>Duration:</strong> {patientCase.estimatedDuration}
                            </div>
                          </div>
                          {patientCase.progress && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>Treatment Progress</span>
                                <span>{patientCase.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                                  style={{ width: `${patientCase.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCaseExpansion(patientCase.id)}
                        className="flex items-center gap-2"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            Hide Notes
                          </>
                        ) : (
                          <>
                            <ChevronRight className="w-4 h-4" />
                            View Notes ({patientCase.notes.length})
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {patientCase.notes.map((note) => (
                          <Card
                            key={note.id}
                            className="hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary"
                            onClick={() => setSelectedNote({...note, caseTitle: patientCase.title, caseStatus: patientCase.status, casePriority: patientCase.priority})}
                          >
                            <CardContent className="pt-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-medium">{note.type}</h4>
                                    <Badge className={getTypeColor(note.type)} variant="secondary">
                                      {note.type}
                                    </Badge>
                                    {note.priority && (
                                      <Badge className={getPriorityColor(note.priority)} variant="outline">
                                        {note.priority}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      {formatDate(note.date)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Stethoscope className="w-4 h-4" />
                                      {note.doctorName}
                                    </span>
                                    {note.duration && (
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {note.duration}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {note.chiefComplaint}
                                  </p>
                                </div>
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <ClipboardCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">
                No Treatment Cases Found
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || filterType !== "all" || filterStatus !== "all"
                  ? "No cases match your search criteria"
                  : "Your treatment cases and doctor notes will appear here after your appointments"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default function Notes() {
  const user = useSelector((state) => state?.auth);
  const userRole = user?.role || 'patient';
  const userId = user?.userID;

  // If user is a patient, show patient notes view
  if (userRole === 'patient') {
    return <PatientNotesView userRole={userRole} userId={userId} />;
  }

  // Original doctor/staff view code continues here...
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState({
    type: "Progress Note",
    chiefComplaint: "",
    assessment: "",
    treatment: "",
    plan: "",
    duration: "30 minutes",
  });

  // RTK Query hooks
  const {
    data: clinicalNotes,
    isLoading,
    error,
    refetch,
  } = useGetClinicalNotesByPatientQuery(
    selectedPatient?.id,
    { skip: !selectedPatient }
  );

  const [createClinicalNote, { isLoading: isCreating }] = useCreateClinicalNoteMutation();

  // Filter patients based on search and status
  const filteredPatients = useMemo(() => {
    let filtered = mockPatients;

    if (searchTerm) {
      filtered = filtered.filter(
        (patient) =>
          patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.primaryCondition.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((patient) => patient.status === statusFilter);
    }

    return filtered;
  }, [searchTerm, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleAddNote = async () => {
    try {
      const noteData = {
        patientId: selectedPatient.id,
        type: newNote.type,
        chiefComplaint: newNote.chiefComplaint,
        assessment: newNote.assessment,
        treatment: newNote.treatment,
        plan: newNote.plan,
        duration: newNote.duration,
        doctorId: "dr-001", // This should come from auth state
        doctorName: "Dr. Dieu Phan", // This should come from auth state
        status: "completed",
      };

      // Make API call to create clinical note
      await createClinicalNote(noteData).unwrap();
      
      toast.success("Clinical note added successfully!");
      
      // Reset form
      setNewNote({
        type: "Progress Note",
        chiefComplaint: "",
        assessment: "",
        treatment: "",
        plan: "",
        duration: "30 minutes",
      });
      setIsAddingNote(false);
      
    } catch (error) {
      console.error("Failed to add clinical note:", error);
      toast.error("Failed to add clinical note. Please try again.");
    }
  };

  // Rest of the original doctor view code...
  if (selectedPatient) {
    const patientNotes = clinicalNotes || [];

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setSelectedPatient(null)}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Patients
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">
                Patient Case: {selectedPatient.firstName}{" "}
                {selectedPatient.lastName}
              </h1>
              <p className="text-muted-foreground mt-1">
                Clinical notes and treatment documentation
              </p>
            </div>
            <Button
              onClick={() => setIsAddingNote(true)}
              className="bg-primary hover:bg-primary/90"
              disabled={isCreating}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isCreating ? "Adding..." : "Add Clinical Note"}
            </Button>
          </div>

          {/* Rest of the original doctor view JSX... */}
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">
              Doctor View Under Development
            </h3>
            <p className="text-sm text-muted-foreground">
              Clinical notes management for healthcare providers will be available soon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Clinical Notes
            </h1>
            <p className="text-muted-foreground mt-1">
              Select a patient to view their information and add clinical notes
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search patients by name or condition..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Patients</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Patient List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => {
            const patientNotes = mockClinicalNotes[patient.id] || [];
            const lastNote = patientNotes[0];

            return (
              <Card
                key={patient.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedPatient(patient)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.id}`}
                      />
                      <AvatarFallback>
                        {patient.firstName[0]}
                        {patient.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {patient.firstName} {patient.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {patient.age} years • {patient.gender}
                      </p>
                      <Badge
                        className={`${getStatusColor(patient.status)} mt-1`}
                      >
                        {patient.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Condition:</strong> {patient.primaryCondition}
                    </div>
                    <div>
                      <strong>Last Visit:</strong>{" "}
                      {formatDate(patient.lastVisit)}
                    </div>
                    <div>
                      <strong>Total Notes:</strong> {patientNotes.length}
                    </div>
                    {lastNote && (
                      <div>
                        <strong>Last Note:</strong> {lastNote.type} (
                        {formatDate(lastNote.date)})
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <span className="text-xs text-muted-foreground">
                      {patient.totalVisits} total visits
                    </span>
                    <Button size="sm" variant="outline">
                      View Case
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredPatients.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">
                No Patients Found
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "No patients available for clinical notes"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
