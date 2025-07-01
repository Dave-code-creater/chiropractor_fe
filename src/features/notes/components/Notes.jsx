import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";
import { toast } from "sonner";
import { 
  useGetPatientClinicalNotesQuery,
  useCreateClinicalNoteMutation,
  useUpdateClinicalNoteMutation,
  useDeleteClinicalNoteMutation
} from "@/services/clinicalNotesApi";

// Mock patient data - in real app, this would come from API
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
    lastVisit: "2024-01-10",
    nextAppointment: null,
    status: "inactive",
    primaryCondition: "Neck Pain",
    secondaryConditions: ["Headaches", "Shoulder Tension"],
    insurance: "Aetna",
    emergencyContact: "Lisa Chen - (555) 876-5432",
    totalVisits: 12,
    medicalHistory: {
      allergies: "Penicillin",
      medications: "Naproxen 220mg twice daily",
      previousSurgeries: "Appendectomy (2010)",
      chronicConditions: "Hypertension",
    },
    vitals: {
      height: "5'10\"",
      weight: "180 lbs",
      bloodPressure: "135/85",
      lastUpdated: "2024-01-10",
    },
  },
  {
    id: "pt-003",
    firstName: "Emma",
    lastName: "Davis",
    email: "emma.davis@email.com",
    phone: "(555) 345-6789",
    dateOfBirth: "1992-07-08",
    age: 31,
    gender: "Female",
    address: "789 Pine St, City, State 12345",
    lastVisit: "2024-01-18",
    nextAppointment: "2024-01-25",
    status: "active",
    primaryCondition: "Sports Injury",
    secondaryConditions: ["Knee Pain", "Ankle Sprain"],
    insurance: "United Healthcare",
    emergencyContact: "Robert Davis - (555) 765-4321",
    totalVisits: 5,
    medicalHistory: {
      allergies: "Latex",
      medications: "None",
      previousSurgeries: "ACL repair (2020)",
      chronicConditions: "None",
    },
    vitals: {
      height: "5'4\"",
      weight: "125 lbs",
      bloodPressure: "110/70",
      lastUpdated: "2024-01-18",
    },
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
      assessment:
        "Patient reports 50% improvement in lower back pain. Range of motion has increased significantly.",
      treatment:
        "Spinal manipulation L3-L5, soft tissue therapy, therapeutic exercises",
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
      assessment:
        "Acute lumbar strain with muscle spasm. Limited range of motion. Pain level 7/10.",
      treatment:
        "Initial spinal adjustment, ice therapy, patient education on proper lifting techniques",
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
      assessment:
        "Cervical spine dysfunction with associated tension headaches. Muscle tension in upper trapezius.",
      treatment:
        "Cervical manipulation C2-C4, trigger point therapy, postural correction exercises",
      plan: "Continue treatment 2x/week for 2 weeks. Ergonomic workplace assessment recommended.",
      doctorId: "dr-001",
      doctorName: "Dr. Dieu Phan",
      duration: "35 minutes",
      status: "completed",
    },
  ],
};

export default function Notes() {
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

  // API hooks
  const { data: clinicalNotes = [], isLoading: notesLoading } = useGetPatientClinicalNotesQuery(
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient Information Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Patient Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Patient Information
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
                      <Badge className={getStatusColor(selectedPatient.status)}>
                        {selectedPatient.status}
                      </Badge>
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

              {/* Medical Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5" />
                    Medical Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Primary Condition</h4>
                    <Badge variant="outline" className="mb-2">
                      {selectedPatient.primaryCondition}
                    </Badge>
                    {selectedPatient.secondaryConditions.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Secondary:
                        </p>
                        <div className="flex flex-wrap gap-1">
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
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Total Visits:</strong>{" "}
                      {selectedPatient.totalVisits}
                    </div>
                    <div>
                      <strong>Last Visit:</strong>{" "}
                      {formatDate(selectedPatient.lastVisit)}
                    </div>
                    <div>
                      <strong>Next Appointment:</strong>{" "}
                      {selectedPatient.nextAppointment
                        ? formatDate(selectedPatient.nextAppointment)
                        : "Not scheduled"}
                    </div>
                    <div>
                      <strong>Insurance:</strong> {selectedPatient.insurance}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Medical History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Medical History</CardTitle>
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
                </CardContent>
              </Card>

              {/* Vitals */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Latest Vitals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <strong>Height:</strong> {selectedPatient.vitals.height}
                    </div>
                    <div>
                      <strong>Weight:</strong> {selectedPatient.vitals.weight}
                    </div>
                    <div className="col-span-2">
                      <strong>Blood Pressure:</strong>{" "}
                      {selectedPatient.vitals.bloodPressure}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last updated:{" "}
                    {formatDate(selectedPatient.vitals.lastUpdated)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Clinical Notes Section */}
            <div className="lg:col-span-2 space-y-6">
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
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Chief Complaint
                      </label>
                      <textarea
                        className="w-full mt-1 p-3 border rounded-lg resize-none"
                        rows={2}
                        placeholder="Patient's main concern or reason for visit..."
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
                      <label className="text-sm font-medium">Assessment</label>
                      <textarea
                        className="w-full mt-1 p-3 border rounded-lg resize-none"
                        rows={3}
                        placeholder="Clinical assessment, examination findings, diagnosis..."
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
                        rows={3}
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
                        rows={3}
                        placeholder="Treatment plan, follow-up instructions, recommendations..."
                        value={newNote.plan}
                        onChange={(e) =>
                          setNewNote({ ...newNote, plan: e.target.value })
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
                                  Chief Complaint
                                </h4>
                                <p>{note.chiefComplaint}</p>
                              </div>
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
            </div>
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
