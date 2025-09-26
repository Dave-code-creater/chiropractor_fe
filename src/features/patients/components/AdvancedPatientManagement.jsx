import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  User,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  CalendarIcon,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  Activity,
  Heart,
  Pill,
  Shield,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Download,
  Upload,
  Eye,
  MessageSquare,
  Star,
  Flag,
  Users,
  BarChart3,
} from "lucide-react";
import { format } from "date-fns";

const AdvancedPatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDoctor, setFilterDoctor] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(false);

  const [samplePatients] = useState([
    {
      id: "PAT-001",
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@email.com",
      phone: "+1-555-0123",
      dateOfBirth: "1978-05-15",
      age: 45,
      gender: "Male",
      status: "active",
      priority: "high",
      assignedDoctor: "Dr. Johnson",
      avatar: null,
      address: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zip: "10001",
      },
      emergencyContact: {
        name: "Jane Smith",
        relationship: "Spouse",
        phone: "+1-555-0124",
      },
      insurance: {
        provider: "Blue Cross Blue Shield",
        policyNumber: "BC123456789",
        groupNumber: "GRP001",
        copay: 25,
      },
      medicalInfo: {
        allergies: ["Penicillin", "Shellfish"],
        medications: ["Ibuprofen 400mg", "Vitamin D"],
        chronicConditions: ["Chronic Lower Back Pain", "Hypertension"],
        surgeries: [
          { procedure: "Appendectomy", date: "2010-03-15" },
          { procedure: "Knee Arthroscopy", date: "2018-08-22" },
        ],
        familyHistory: ["Diabetes (Father)", "Heart Disease (Mother)"],
      },
      treatmentHistory: [
        {
          id: "TRT-001",
          date: "2025-01-15",
          type: "Chiropractic Adjustment",
          provider: "Dr. Johnson",
          notes: "Significant improvement in mobility",
          painLevel: 3,
          outcome: "Improved",
        },
        {
          id: "TRT-002",
          date: "2025-01-10",
          type: "Physical Therapy",
          provider: "Dr. Johnson",
          notes: "Patient responding well to treatment",
          painLevel: 5,
          outcome: "Stable",
        },
      ],
      vitals: {
        height: "5'10\"",
        weight: "180 lbs",
        bloodPressure: "130/85",
        heartRate: 72,
        temperature: "98.6°F",
        lastUpdated: "2025-01-18",
      },
      alerts: [
        {
          id: "ALT-001",
          type: "medical",
          priority: "high",
          message: "Penicillin allergy - avoid prescribing",
          createdDate: "2025-01-01",
        },
        {
          id: "ALT-002",
          type: "appointment",
          priority: "medium",
          message: "Due for follow-up appointment",
          createdDate: "2025-01-18",
        },
      ],
      statistics: {
        totalVisits: 15,
        missedAppointments: 2,
        averagePainLevel: 4.2,
        treatmentCompliance: 85,
        lastVisit: "2025-01-15",
        nextAppointment: "2025-01-22",
      },
      flags: ["High Priority", "Chronic Pain"],
      notes:
        "Patient is very compliant with treatment plan. Responds well to chiropractic adjustments.",
      createdDate: "2024-06-15",
      lastUpdated: "2025-01-18",
    },
    {
      id: "PAT-002",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1-555-0125",
      dateOfBirth: "1992-08-22",
      age: 32,
      gender: "Female",
      status: "active",
      priority: "medium",
      assignedDoctor: "Dr. Smith",
      avatar: null,
      address: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zip: "90210",
      },
      emergencyContact: {
        name: "Mike Johnson",
        relationship: "Brother",
        phone: "+1-555-0126",
      },
      insurance: {
        provider: "Aetna",
        policyNumber: "AET987654321",
        groupNumber: "GRP002",
        copay: 30,
      },
      medicalInfo: {
        allergies: ["Latex"],
        medications: ["Birth Control", "Multivitamin"],
        chronicConditions: ["Migraines", "Anxiety"],
        surgeries: [],
        familyHistory: ["Migraines (Mother)", "Anxiety (Sister)"],
      },
      treatmentHistory: [
        {
          id: "TRT-003",
          date: "2025-01-12",
          type: "Initial Consultation",
          provider: "Dr. Smith",
          notes: "Comprehensive evaluation for chronic headaches",
          painLevel: 7,
          outcome: "Assessment Complete",
        },
      ],
      vitals: {
        height: "5'6\"",
        weight: "135 lbs",
        bloodPressure: "115/75",
        heartRate: 68,
        temperature: "98.4°F",
        lastUpdated: "2025-01-12",
      },
      alerts: [
        {
          id: "ALT-003",
          type: "medical",
          priority: "medium",
          message: "Latex allergy - use non-latex gloves",
          createdDate: "2025-01-01",
        },
      ],
      statistics: {
        totalVisits: 3,
        missedAppointments: 0,
        averagePainLevel: 6.5,
        treatmentCompliance: 95,
        lastVisit: "2025-01-12",
        nextAppointment: "2025-01-25",
      },
      flags: ["New Patient", "Migraine Specialist"],
      notes:
        "New patient with chronic migraines. Very motivated to find relief.",
      createdDate: "2024-12-15",
      lastUpdated: "2025-01-12",
    },
  ]);

  useEffect(() => {
    setPatients(samplePatients);
  }, [samplePatients]);

  const filteredPatients = useMemo(() => {
    return patients
      .filter((patient) => {
        const matchesSearch =
          patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.phone.includes(searchQuery);

        const matchesStatus =
          filterStatus === "all" || patient.status === filterStatus;
        const matchesDoctor =
          filterDoctor === "all" || patient.assignedDoctor === filterDoctor;

        return matchesSearch && matchesStatus && matchesDoctor;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "name":
            return `${a.firstName} ${a.lastName}`.localeCompare(
              `${b.firstName} ${b.lastName}`,
            );
          case "date":
            return new Date(b.lastUpdated) - new Date(a.lastUpdated);
          case "priority":
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          default:
            return 0;
        }
      });
  }, [patients, searchQuery, filterStatus, filterDoctor, sortBy]);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  const handlePatientUpdate = (updatedPatient) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)),
    );
    setSelectedPatient(updatedPatient);
    toast.success("Patient information updated successfully");
  };

  const handleAddAlert = (patientId, alert) => {
    const newAlert = {
      ...alert,
      id: `ALT-${Date.now()}`,
      createdDate: new Date().toISOString().split("T")[0],
    };

    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId ? { ...p, alerts: [...p.alerts, newAlert] } : p,
      ),
    );

    if (selectedPatient && selectedPatient.id === patientId) {
      setSelectedPatient((prev) => ({
        ...prev,
        alerts: [...prev.alerts, newAlert],
      }));
    }

    toast.success("Alert added successfully");
  };

  const PatientCard = ({ patient }) => (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${selectedPatient?.id === patient.id ? "ring-2 ring-blue-500" : ""
        }`}
      onClick={() => handlePatientSelect(patient)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={patient.avatar} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {patient.firstName[0]}
                {patient.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                {patient.firstName} {patient.lastName}
              </CardTitle>
              <CardDescription className="flex items-center space-x-2">
                <span>{patient.age} years old</span>
                <span>•</span>
                <span>{patient.assignedDoctor}</span>
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Badge
              variant={patient.status === "active" ? "default" : "secondary"}
            >
              {patient.status}
            </Badge>
            <Badge
              variant={
                patient.priority === "high"
                  ? "destructive"
                  : patient.priority === "medium"
                    ? "default"
                    : "secondary"
              }
            >
              {patient.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            {patient.phone}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2" />
            {patient.email}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            Last visit: {patient.statistics.lastVisit}
          </div>
          {patient.alerts.length > 0 && (
            <div className="flex items-center space-x-1 mt-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-yellow-600">
                {patient.alerts.length} alert
                {patient.alerts.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
          <div className="flex flex-wrap gap-1 mt-2">
            {patient.flags.slice(0, 2).map((flag) => (
              <Badge key={flag} variant="outline" className="text-xs">
                {flag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PatientListItem = ({ patient }) => (
    <div
      className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${selectedPatient?.id === patient.id ? "bg-blue-50 border-blue-200" : ""
        }`}
      onClick={() => handlePatientSelect(patient)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={patient.avatar} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {patient.firstName[0]}
              {patient.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-gray-900">
              {patient.firstName} {patient.lastName}
            </div>
            <div className="text-sm text-gray-600 flex items-center space-x-4">
              <span>{patient.email}</span>
              <span>{patient.phone}</span>
              <span>{patient.assignedDoctor}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {patient.alerts.length > 0 && (
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          )}
          <Badge
            variant={patient.status === "active" ? "default" : "secondary"}
          >
            {patient.status}
          </Badge>
          <Badge
            variant={
              patient.priority === "high"
                ? "destructive"
                : patient.priority === "medium"
                  ? "default"
                  : "secondary"
            }
          >
            {patient.priority}
          </Badge>
        </div>
      </div>
    </div>
  );

  const PatientDetails = ({ patient }) => {
    const [activeTab, setActiveTab] = useState("overview");
    const [newAlert, setNewAlert] = useState({
      type: "medical",
      priority: "medium",
      message: "",
    });

    if (!patient) {
      return (
        <Card className="h-full">
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a patient to view details</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={patient.avatar} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                  {patient.firstName[0]}
                  {patient.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {patient.firstName} {patient.lastName}
                </CardTitle>
                <CardDescription className="flex items-center space-x-4 text-base">
                  <span>
                    {patient.age} years old • {patient.gender}
                  </span>
                  <span>Patient ID: {patient.id}</span>
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="medical">Medical</TabsTrigger>
              <TabsTrigger value="treatment">Treatment</TabsTrigger>
              <TabsTrigger value="vitals">Vitals</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{patient.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{patient.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>
                        {patient.address.street}, {patient.address.city},{" "}
                        {patient.address.state} {patient.address.zip}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>
                        Emergency: {patient.emergencyContact.name} (
                        {patient.emergencyContact.relationship}) -{" "}
                        {patient.emergencyContact.phone}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Care Team & Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Assigned Doctor
                      </span>
                      <Badge variant="outline">{patient.assignedDoctor}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <Badge
                        variant={
                          patient.status === "active" ? "default" : "secondary"
                        }
                      >
                        {patient.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Priority</span>
                      <Badge
                        variant={
                          patient.priority === "high"
                            ? "destructive"
                            : patient.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {patient.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Patient Since
                      </span>
                      <span className="text-sm">
                        {format(new Date(patient.createdDate), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Patient Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {patient.statistics.totalVisits}
                      </div>
                      <div className="text-sm text-gray-600">Total Visits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {patient.statistics.treatmentCompliance}%
                      </div>
                      <div className="text-sm text-gray-600">Compliance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {patient.statistics.averagePainLevel}
                      </div>
                      <div className="text-sm text-gray-600">
                        Avg Pain Level
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {patient.statistics.missedAppointments}
                      </div>
                      <div className="text-sm text-gray-600">Missed Appts</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Patient Flags & Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {patient.flags.map((flag) => (
                      <Badge
                        key={flag}
                        variant="outline"
                        className="flex items-center"
                      >
                        <Flag className="h-3 w-3 mr-1" />
                        {flag}
                      </Badge>
                    ))}
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{patient.notes}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medical" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                      Allergies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {patient.medicalInfo.allergies.map((allergy) => (
                        <Badge
                          key={allergy}
                          variant="destructive"
                          className="mr-2"
                        >
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Pill className="h-5 w-5 mr-2 text-blue-500" />
                      Current Medications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {patient.medicalInfo.medications.map((medication) => (
                        <div
                          key={medication}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm">{medication}</span>
                          <Badge variant="outline">Active</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-500" />
                    Chronic Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {patient.medicalInfo.chronicConditions.map((condition) => (
                      <div
                        key={condition}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <span className="font-medium">{condition}</span>
                        <Badge variant="secondary">Ongoing</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Surgical History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {patient.medicalInfo.surgeries.map((surgery) => (
                        <div
                          key={surgery.procedure}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-medium">
                            {surgery.procedure}
                          </span>
                          <span className="text-sm text-gray-500">
                            {surgery.date}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Family History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {patient.medicalInfo.familyHistory.map((history) => (
                        <div
                          key={history}
                          className="text-sm p-2 bg-gray-50 rounded"
                        >
                          {history}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="treatment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Treatment History</CardTitle>
                  <CardDescription>
                    {patient.treatmentHistory.length} treatment sessions
                    recorded
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {patient.treatmentHistory.map((treatment) => (
                      <div
                        key={treatment.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline">{treatment.type}</Badge>
                            <span className="text-sm text-gray-600">
                              {treatment.date}
                            </span>
                          </div>
                          <Badge
                            variant={
                              treatment.outcome === "Improved"
                                ? "default"
                                : treatment.outcome === "Stable"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {treatment.outcome}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          {treatment.notes}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Provider: {treatment.provider}</span>
                          <span>Pain Level: {treatment.painLevel}/10</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vitals" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Vitals</CardTitle>
                  <CardDescription>
                    Last updated: {patient.vitals.lastUpdated}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {patient.vitals.height}
                      </div>
                      <div className="text-sm text-gray-600">Height</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {patient.vitals.weight}
                      </div>
                      <div className="text-sm text-gray-600">Weight</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {patient.vitals.bloodPressure}
                      </div>
                      <div className="text-sm text-gray-600">
                        Blood Pressure
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {patient.vitals.heartRate}
                      </div>
                      <div className="text-sm text-gray-600">Heart Rate</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {patient.vitals.temperature}
                      </div>
                      <div className="text-sm text-gray-600">Temperature</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    Patient Alerts
                    <Button
                      size="sm"
                      onClick={() => {
                        if (newAlert.message.trim()) {
                          handleAddAlert(patient.id, newAlert);
                          setNewAlert({
                            type: "medical",
                            priority: "medium",
                            message: "",
                          });
                        }
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Alert
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg">
                    <Select
                      value={newAlert.type}
                      onValueChange={(value) =>
                        setNewAlert({ ...newAlert, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Alert Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medical">Medical</SelectItem>
                        <SelectItem value="appointment">Appointment</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={newAlert.priority}
                      onValueChange={(value) =>
                        setNewAlert({ ...newAlert, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Alert message..."
                      value={newAlert.message}
                      onChange={(e) =>
                        setNewAlert({ ...newAlert, message: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-3">
                    {patient.alerts.map((alert) => (
                      <Alert
                        key={alert.id}
                        className={
                          alert.priority === "high"
                            ? "border-red-200 bg-red-50"
                            : alert.priority === "medium"
                              ? "border-yellow-200 bg-yellow-50"
                              : "border-blue-200 bg-blue-50"
                        }
                      >
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle className="flex items-center justify-between">
                          <span className="capitalize">{alert.type} Alert</span>
                          <Badge
                            variant={
                              alert.priority === "high"
                                ? "destructive"
                                : alert.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {alert.priority}
                          </Badge>
                        </AlertTitle>
                        <AlertDescription>
                          {alert.message}
                          <div className="text-xs text-gray-500 mt-1">
                            Created: {alert.createdDate}
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Patient Timeline</CardTitle>
                  <CardDescription>
                    Complete chronological history of patient interactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Treatment Session</span>
                          <span className="text-sm text-gray-500">
                            Jan 15, 2025
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Chiropractic adjustment with Dr. Johnson
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            Appointment Scheduled
                          </span>
                          <span className="text-sm text-gray-500">
                            Jan 12, 2025
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Follow-up appointment booked
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Alert Added</span>
                          <span className="text-sm text-gray-500">
                            Jan 10, 2025
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Medical alert for penicillin allergy
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Advanced Patient Management
          </h2>
          <p className="text-gray-600">
            Comprehensive patient care and case management
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search patients by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterDoctor} onValueChange={setFilterDoctor}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Doctors</SelectItem>
                  <SelectItem value="Dr. Johnson">Dr. Johnson</SelectItem>
                  <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
              >
                {viewMode === "grid" ? (
                  <BarChart3 className="h-4 w-4" />
                ) : (
                  <Users className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Patients
                <Badge variant="secondary">
                  {filteredPatients.length} patient
                  {filteredPatients.length !== 1 ? "s" : ""}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[800px]">
                {viewMode === "grid" ? (
                  <div className="p-4 space-y-4">
                    {filteredPatients.map((patient) => (
                      <PatientCard key={patient.id} patient={patient} />
                    ))}
                  </div>
                ) : (
                  <div>
                    {filteredPatients.map((patient) => (
                      <PatientListItem key={patient.id} patient={patient} />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <PatientDetails patient={selectedPatient} />
        </div>
      </div>
    </div>
  );
};

export default AdvancedPatientManagement;
