import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
  Heart,
  Activity,
  ClipboardList,
  TrendingUp,
  AlertTriangle,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
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

// Mock patient data with comprehensive medical information
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
    registrationDate: "2023-06-15",
    lastVisit: "2024-01-15",
    nextAppointment: "2024-01-22",
    status: "active",
    primaryCondition: "Lower Back Pain",
    secondaryConditions: ["Muscle Spasm", "Poor Posture"],
    insurance: {
      provider: "Blue Cross Blue Shield",
      policyNumber: "BC123456789",
      groupNumber: "GRP001",
      copay: "$25",
    },
    emergencyContact: {
      name: "John Johnson",
      relationship: "Spouse",
      phone: "(555) 987-6543",
    },
    totalVisits: 8,
    medicalHistory: {
      allergies: "None known",
      medications: "Ibuprofen 200mg as needed",
      previousSurgeries: "None",
      chronicConditions: "None",
      familyHistory: "Father: Hypertension, Mother: Diabetes Type 2",
    },
    vitals: {
      height: "5'6\"",
      weight: "140 lbs",
      bloodPressure: "120/80",
      heartRate: "72 bpm",
      temperature: "98.6°F",
      lastUpdated: "2024-01-15",
    },
    treatmentHistory: [
      {
        date: "2024-01-15",
        treatment: "Spinal Manipulation",
        provider: "Dr. Dieu Phan",
        notes: "Significant improvement in range of motion",
      },
      {
        date: "2024-01-08",
        treatment: "Initial Assessment",
        provider: "Dr. Dieu Phan",
        notes: "Acute lumbar strain diagnosed",
      },
    ],
  },
  {
    id: "pt-002",
    firstName: "Michael",
    lastName: "Chen",
    email: "m.chen@email.com",
    phone: "(555) 234-5678",
    dateOfBirth: "1978-11-22",
    age: 45,
    gender: "Male",
    address: "456 Oak Ave, City, State 12345",
    registrationDate: "2023-03-10",
    lastVisit: "2024-01-10",
    nextAppointment: null,
    status: "inactive",
    primaryCondition: "Neck Pain",
    secondaryConditions: ["Headaches", "Shoulder Tension"],
    insurance: {
      provider: "Aetna",
      policyNumber: "AET987654321",
      groupNumber: "GRP002",
      copay: "$30",
    },
    emergencyContact: {
      name: "Lisa Chen",
      relationship: "Wife",
      phone: "(555) 876-5432",
    },
    totalVisits: 12,
    medicalHistory: {
      allergies: "Penicillin",
      medications: "Naproxen 220mg twice daily",
      previousSurgeries: "Appendectomy (2010)",
      chronicConditions: "Hypertension",
      familyHistory: "Father: Heart Disease, Mother: Arthritis",
    },
    vitals: {
      height: "5'10\"",
      weight: "180 lbs",
      bloodPressure: "135/85",
      heartRate: "78 bpm",
      temperature: "98.4°F",
      lastUpdated: "2024-01-10",
    },
    treatmentHistory: [
      {
        date: "2024-01-10",
        treatment: "Cervical Manipulation",
        provider: "Dr. Dieu Phan",
        notes: "Reduced muscle tension, headache improvement",
      },
    ],
  },
];

// Mock clinical notes data
const mockClinicalNotes = {
  "pt-001": [
    {
      id: "note-001",
      date: "2024-01-15",
      type: "Progress Note",
      chiefComplaint: "Lower back pain, improved since last visit",
      objectiveFindings:
        "ROM: Flexion 80°, Extension 25°, Lateral flexion 30° bilaterally. Palpation reveals decreased muscle tension in lumbar paraspinals.",
      assessment:
        "Acute lumbar strain showing significant improvement. Patient reports 50% reduction in pain levels.",
      treatment:
        "Spinal manipulation L3-L5, soft tissue therapy to lumbar paraspinals, therapeutic exercises",
      plan: "Continue current treatment plan. Add core strengthening exercises. Follow-up in 1 week. Patient education on proper lifting mechanics.",
      doctorId: "dr-001",
      doctorName: "Dr. Dieu Phan",
      duration: "30 minutes",
      status: "completed",
      painLevel: "3/10",
      functionalStatus:
        "Improved - able to perform daily activities with minimal discomfort",
    },
    {
      id: "note-002",
      date: "2024-01-08",
      type: "Initial Assessment",
      chiefComplaint:
        "Acute lower back pain following lifting incident at work 2 days ago",
      objectiveFindings:
        "Antalgic gait, limited lumbar flexion (40°), positive SLR test at 45° on right. Muscle spasm palpable in L3-L5 paraspinals.",
      assessment:
        "Acute lumbar strain with muscle spasm secondary to improper lifting mechanics. No neurological deficits noted.",
      treatment:
        "Initial spinal adjustment L4-L5, ice therapy application, patient education on proper lifting techniques",
      plan: "Return in 3-4 days for follow-up. Ice application 15-20 minutes every 2 hours for first 48 hours. Avoid heavy lifting >10 lbs. Gradual return to normal activities as tolerated.",
      doctorId: "dr-001",
      doctorName: "Dr. Dieu Phan",
      duration: "45 minutes",
      status: "completed",
      painLevel: "7/10",
      functionalStatus:
        "Significantly limited - difficulty with bending, lifting, prolonged sitting",
    },
  ],
  "pt-002": [
    {
      id: "note-003",
      date: "2024-01-10",
      type: "Follow-up",
      chiefComplaint:
        "Persistent neck pain and tension headaches, ongoing for 3 weeks",
      objectiveFindings:
        "Cervical ROM: Flexion 35°, Extension 40°, Rotation 60° bilaterally. Palpable trigger points in upper trapezius and suboccipital muscles.",
      assessment:
        "Cervical spine dysfunction with associated tension-type headaches. Forward head posture noted, likely contributing to symptoms.",
      treatment:
        "Cervical manipulation C2-C4, trigger point therapy to upper trapezius, postural correction exercises demonstrated",
      plan: "Continue treatment 2x/week for 2 weeks. Ergonomic workplace assessment recommended. Stress management techniques discussed. Home exercise program for postural strengthening.",
      doctorId: "dr-001",
      doctorName: "Dr. Dieu Phan",
      duration: "35 minutes",
      status: "completed",
      painLevel: "5/10",
      functionalStatus:
        "Moderately limited - headaches affecting work concentration",
    },
  ],
};

export default function PatientCaseManagement() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [newNote, setNewNote] = useState({
    type: "Progress Note",
    chiefComplaint: "",
    objectiveFindings: "",
    assessment: "",
    treatment: "",
    plan: "",
    duration: "30 minutes",
    painLevel: "",
    functionalStatus: "",
  });

  // API hooks
  const { data: clinicalNotes = [], isLoading: notesLoading } = useGetClinicalNotesQuery(
    selectedPatient?.id ? { patientId: selectedPatient.id } : undefined,
    { skip: !selectedPatient?.id }
  );
  const [createClinicalNote, { isLoading: isCreating }] = useCreateClinicalNoteMutation();
  const [updateClinicalNote] = useUpdateClinicalNoteMutation();
  const [deleteClinicalNote] = useDeleteClinicalNoteMutation();

  // Filter patients based on search and status
  const filteredPatients = useMemo(() => {
    return mockPatients.filter((patient) => {
      const matchesSearch =
        patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.primaryCondition
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || patient.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        objectiveFindings: newNote.objectiveFindings,
        assessment: newNote.assessment,
        treatment: newNote.treatment,
        plan: newNote.plan,
        duration: newNote.duration,
        painLevel: newNote.painLevel,
        functionalStatus: newNote.functionalStatus,
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
        objectiveFindings: "",
        assessment: "",
        treatment: "",
        plan: "",
        duration: "30 minutes",
        painLevel: "",
        functionalStatus: "",
      });
      setIsAddingNote(false);
      
    } catch (error) {
      console.error("Failed to add clinical note:", error);
      toast.error("Failed to add clinical note. Please try again.");
    }
  };

  if (selectedPatient) {
    const patientNotes = clinicalNotes || [];

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
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
                {selectedPatient.firstName} {selectedPatient.lastName}
              </h1>
              <p className="text-muted-foreground mt-1">
                Patient ID: {selectedPatient.id} • Comprehensive Case Management
              </p>
            </div>
            <Button
              onClick={() => setIsAddingNote(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Clinical Note
            </Button>
          </div>

          {/* Patient Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {selectedPatient.totalVisits}
                </div>
                <p className="text-sm text-muted-foreground">Total Visits</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <ClipboardList className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{patientNotes.length}</div>
                <p className="text-sm text-muted-foreground">Clinical Notes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-bold">
                  {formatDate(selectedPatient.lastVisit)}
                </div>
                <p className="text-sm text-muted-foreground">Last Visit</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Badge className={getStatusColor(selectedPatient.status)}>
                  {selectedPatient.status.toUpperCase()}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  Patient Status
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Patient Overview</TabsTrigger>
              <TabsTrigger value="clinical-notes">Clinical Notes</TabsTrigger>
              <TabsTrigger value="treatment-history">
                Treatment History
              </TabsTrigger>
              <TabsTrigger value="medical-info">
                Medical Information
              </TabsTrigger>
            </TabsList>

            {/* Patient Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPatient.id}`}
                        />
                        <AvatarFallback className="text-lg">
                          {selectedPatient.firstName[0]}
                          {selectedPatient.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {selectedPatient.firstName} {selectedPatient.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedPatient.age} years old •{" "}
                          {selectedPatient.gender}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          DOB: {formatDate(selectedPatient.dateOfBirth)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        {selectedPatient.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        {selectedPatient.email}
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <span>{selectedPatient.address}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Current Vitals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Current Vitals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Height:</strong> {selectedPatient.vitals.height}
                      </div>
                      <div>
                        <strong>Weight:</strong> {selectedPatient.vitals.weight}
                      </div>
                      <div>
                        <strong>Blood Pressure:</strong>{" "}
                        {selectedPatient.vitals.bloodPressure}
                      </div>
                      <div>
                        <strong>Heart Rate:</strong>{" "}
                        {selectedPatient.vitals.heartRate}
                      </div>
                      <div className="col-span-2">
                        <strong>Temperature:</strong>{" "}
                        {selectedPatient.vitals.temperature}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Last updated:{" "}
                      {formatDate(selectedPatient.vitals.lastUpdated)}
                    </p>
                  </CardContent>
                </Card>

                {/* Primary Condition */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="w-5 h-5" />
                      Current Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Primary Condition</h4>
                      <Badge variant="outline" className="text-sm">
                        {selectedPatient.primaryCondition}
                      </Badge>
                    </div>
                    {selectedPatient.secondaryConditions.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">
                          Secondary Conditions
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedPatient.secondaryConditions.map(
                            (condition, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {condition}
                              </Badge>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Insurance Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Insurance Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <strong>Provider:</strong>{" "}
                      {selectedPatient.insurance.provider}
                    </div>
                    <div>
                      <strong>Policy Number:</strong>{" "}
                      {selectedPatient.insurance.policyNumber}
                    </div>
                    <div>
                      <strong>Group Number:</strong>{" "}
                      {selectedPatient.insurance.groupNumber}
                    </div>
                    <div>
                      <strong>Copay:</strong> {selectedPatient.insurance.copay}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Clinical Notes Tab */}
            <TabsContent value="clinical-notes" className="space-y-6">
              {/* Add Note Form */}
              {isAddingNote && (
                <Card className="border-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        New Clinical Note
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsAddingNote(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">Note Type</label>
                        <Select
                          value={newNote.type}
                          onValueChange={(value) =>
                            setNewNote({ ...newNote, type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Initial Assessment">
                              Initial Assessment
                            </SelectItem>
                            <SelectItem value="Progress Note">
                              Progress Note
                            </SelectItem>
                            <SelectItem value="Follow-up">Follow-up</SelectItem>
                            <SelectItem value="Treatment Plan">
                              Treatment Plan
                            </SelectItem>
                            <SelectItem value="Discharge Summary">
                              Discharge Summary
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Duration</label>
                        <Select
                          value={newNote.duration}
                          onValueChange={(value) =>
                            setNewNote({ ...newNote, duration: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15 minutes">
                              15 minutes
                            </SelectItem>
                            <SelectItem value="30 minutes">
                              30 minutes
                            </SelectItem>
                            <SelectItem value="45 minutes">
                              45 minutes
                            </SelectItem>
                            <SelectItem value="60 minutes">
                              60 minutes
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Pain Level (0-10)
                        </label>
                        <Input
                          type="text"
                          placeholder="e.g., 5/10"
                          value={newNote.painLevel}
                          onChange={(e) =>
                            setNewNote({
                              ...newNote,
                              painLevel: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Chief Complaint (Subjective)
                      </label>
                      <textarea
                        className="w-full mt-1 p-3 border rounded-lg resize-none"
                        rows={2}
                        placeholder="Patient's main concern, symptoms, and how they feel..."
                        value={newNote.chiefComplaint}
                        onChange={(e) =>
                          setNewNote({
                            ...newNote,
                            chiefComplaint: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Objective Findings
                      </label>
                      <textarea
                        className="w-full mt-1 p-3 border rounded-lg resize-none"
                        rows={3}
                        placeholder="Physical examination findings, range of motion, palpation, tests..."
                        value={newNote.objectiveFindings}
                        onChange={(e) =>
                          setNewNote({
                            ...newNote,
                            objectiveFindings: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Assessment</label>
                      <textarea
                        className="w-full mt-1 p-3 border rounded-lg resize-none"
                        rows={2}
                        placeholder="Clinical assessment, diagnosis, progress evaluation..."
                        value={newNote.assessment}
                        onChange={(e) =>
                          setNewNote({ ...newNote, assessment: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Treatment Provided
                      </label>
                      <textarea
                        className="w-full mt-1 p-3 border rounded-lg resize-none"
                        rows={2}
                        placeholder="Treatments, adjustments, therapies provided..."
                        value={newNote.treatment}
                        onChange={(e) =>
                          setNewNote({ ...newNote, treatment: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Plan</label>
                      <textarea
                        className="w-full mt-1 p-3 border rounded-lg resize-none"
                        rows={2}
                        placeholder="Treatment plan, follow-up instructions, recommendations..."
                        value={newNote.plan}
                        onChange={(e) =>
                          setNewNote({ ...newNote, plan: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Functional Status
                      </label>
                      <textarea
                        className="w-full mt-1 p-3 border rounded-lg resize-none"
                        rows={2}
                        placeholder="Patient's functional ability, limitations, improvements..."
                        value={newNote.functionalStatus}
                        onChange={(e) =>
                          setNewNote({
                            ...newNote,
                            functionalStatus: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={handleAddNote}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Note
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddingNote(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Clinical Notes List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Clinical Notes ({patientNotes.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {patientNotes.length > 0 ? (
                    <div className="space-y-4">
                      {patientNotes.map((note) => (
                        <Card
                          key={note.id}
                          className="border-l-4 border-l-primary"
                        >
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline">{note.type}</Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {formatDate(note.date)}
                                  </span>
                                  {note.painLevel && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      Pain: {note.painLevel}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {note.doctorName} • {note.duration}
                                </p>
                              </div>
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>

                            <div className="space-y-3 text-sm">
                              <div>
                                <h4 className="font-medium text-primary mb-1">
                                  Subjective (Chief Complaint)
                                </h4>
                                <p>{note.chiefComplaint}</p>
                              </div>
                              {note.objectiveFindings && (
                                <div>
                                  <h4 className="font-medium text-primary mb-1">
                                    Objective Findings
                                  </h4>
                                  <p>{note.objectiveFindings}</p>
                                </div>
                              )}
                              <div>
                                <h4 className="font-medium text-primary mb-1">
                                  Assessment
                                </h4>
                                <p>{note.assessment}</p>
                              </div>
                              <div>
                                <h4 className="font-medium text-primary mb-1">
                                  Treatment
                                </h4>
                                <p>{note.treatment}</p>
                              </div>
                              <div>
                                <h4 className="font-medium text-primary mb-1">
                                  Plan
                                </h4>
                                <p>{note.plan}</p>
                              </div>
                              {note.functionalStatus && (
                                <div>
                                  <h4 className="font-medium text-primary mb-1">
                                    Functional Status
                                  </h4>
                                  <p>{note.functionalStatus}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-muted-foreground">
                        No Clinical Notes
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Start documenting this patient's treatment by adding
                        your first clinical note.
                      </p>
                      <Button
                        onClick={() => setIsAddingNote(true)}
                        variant="outline"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Note
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Treatment History Tab */}
            <TabsContent value="treatment-history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Treatment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedPatient.treatmentHistory.map(
                      (treatment, index) => (
                        <div
                          key={index}
                          className="border-l-2 border-primary pl-4 pb-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">
                              {treatment.treatment}
                            </h4>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(treatment.date)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Provider: {treatment.provider}
                          </p>
                          <p className="text-sm">{treatment.notes}</p>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Medical Information Tab */}
            <TabsContent value="medical-info" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Medical History</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <strong>Allergies:</strong>{" "}
                      {selectedPatient.medicalHistory.allergies}
                    </div>
                    <div>
                      <strong>Current Medications:</strong>{" "}
                      {selectedPatient.medicalHistory.medications}
                    </div>
                    <div>
                      <strong>Previous Surgeries:</strong>{" "}
                      {selectedPatient.medicalHistory.previousSurgeries}
                    </div>
                    <div>
                      <strong>Chronic Conditions:</strong>{" "}
                      {selectedPatient.medicalHistory.chronicConditions}
                    </div>
                    <div>
                      <strong>Family History:</strong>{" "}
                      {selectedPatient.medicalHistory.familyHistory}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <strong>Name:</strong>{" "}
                      {selectedPatient.emergencyContact.name}
                    </div>
                    <div>
                      <strong>Relationship:</strong>{" "}
                      {selectedPatient.emergencyContact.relationship}
                    </div>
                    <div>
                      <strong>Phone:</strong>{" "}
                      {selectedPatient.emergencyContact.phone}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
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
              Patient Case Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive patient information and clinical documentation
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
                  : "No patients available for case management"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
