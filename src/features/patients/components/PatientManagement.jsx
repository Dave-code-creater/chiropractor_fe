import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import {
  Search,
  Plus,
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  FileText,
  Edit,
  Eye,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetPatientsQuery } from "@/api/services/userApi";
import { useGetAppointmentsQuery } from "@/api/services/appointmentApi";
import { useSelector } from "react-redux";
import { selectUserId } from "@/state/data/authSlice";

export default function PatientManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const doctorId = useSelector(selectUserId);

  // Fetch real data from API
  const { data: patientsData, isLoading: isLoadingPatients, error: patientsError } = useGetPatientsQuery();
  const { data: appointmentsData, isLoading: isLoadingAppointments } = useGetAppointmentsQuery({ 
    doctor_id: doctorId 
  });

  // Process patients data
  const patients = useMemo(() => {
    if (isLoadingPatients || !patientsData) return [];
    if (Array.isArray(patientsData?.data)) return patientsData.data;
    if (Array.isArray(patientsData)) return patientsData;
    return [];
  }, [patientsData, isLoadingPatients]);

  // Process appointments data to get patient visit info
  const appointments = useMemo(() => {
    if (isLoadingAppointments || !appointmentsData) return [];
    if (Array.isArray(appointmentsData?.data)) return appointmentsData.data;
    if (Array.isArray(appointmentsData)) return appointmentsData;
    return [];
  }, [appointmentsData, isLoadingAppointments]);

  // Enhanced patients with appointment data
  const enhancedPatients = useMemo(() => {
    return patients.map(patient => {
      const patientAppointments = appointments.filter(apt => apt.patient_id === patient.id);
      const completedAppointments = patientAppointments.filter(apt => apt.status === 'completed');
      const upcomingAppointments = patientAppointments.filter(apt => 
        apt.status === 'scheduled' || apt.status === 'confirmed'
      );
      
      const lastVisit = completedAppointments.length > 0 
        ? completedAppointments.sort((a, b) => new Date(b.date || b.datetime) - new Date(a.date || a.datetime))[0]
        : null;
      
      const nextAppointment = upcomingAppointments.length > 0
        ? upcomingAppointments.sort((a, b) => new Date(a.date || a.datetime) - new Date(b.date || b.datetime))[0]
        : null;

      return {
        ...patient,
        status: patient.status || 'active',
        condition: patient.primaryCondition || patient.condition || 'General Care',
        totalVisits: completedAppointments.length,
        lastVisit: lastVisit ? (lastVisit.date || lastVisit.datetime) : null,
        nextAppointment: nextAppointment ? (nextAppointment.date || nextAppointment.datetime) : null,
        phone: patient.phone || patient.phoneNumber || 'N/A',
        insurance: patient.insurance || 'Not specified',
        emergencyContact: patient.emergencyContact || 'Not provided'
      };
    });
  }, [patients, appointments]);

  const filteredPatients = enhancedPatients.filter((patient) => {
    const matchesSearch =
      patient.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || patient.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

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
    if (!dateString) return "Not scheduled";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const patientColumns = [
    {
      accessorKey: "name",
      header: "Patient",
      cell: ({ row }) => {
        const patient = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.id}`}
              />
              <AvatarFallback>
                {patient.firstName[0]}
                {patient.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {patient.firstName} {patient.lastName}
              </div>
              <div className="text-sm text-muted-foreground">
                {patient.email}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "condition",
      header: "Condition",
      cell: ({ row }) => (
        <div className="text-sm">
          <div className="font-medium">{row.original.condition}</div>
          <div className="text-muted-foreground">
            {row.original.totalVisits} visits
          </div>
        </div>
      ),
    },
    {
      accessorKey: "lastVisit",
      header: "Last Visit",
      cell: ({ row }) => formatDate(row.original.lastVisit),
    },
    {
      accessorKey: "nextAppointment",
      header: "Next Appointment",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.nextAppointment ? (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-green-600" />
              {formatDate(row.original.nextAppointment)}
            </div>
          ) : (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              Not scheduled
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={getStatusColor(row.original.status)}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedPatient(row.original)}>
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="w-4 h-4 mr-2" />
              Edit Patient
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Appointment
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Phone className="w-4 h-4 mr-2" />
              Call Patient
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="w-4 h-4 mr-2" />
              Send Message
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const stats = [
    {
      title: "Total Patients",
      value: enhancedPatients.length,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Patients",
      value: enhancedPatients.filter((p) => p.status === "active").length,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Upcoming Appointments",
      value: enhancedPatients.filter((p) => p.nextAppointment).length,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Average Visits",
      value: enhancedPatients.length > 0 ? Math.round(
        enhancedPatients.reduce((sum, p) => sum + p.totalVisits, 0) /
          enhancedPatients.length,
      ) : 0,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Patient Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage patient records, appointments, and treatment history
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add New Patient
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <IconComponent className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients by name, email, or condition..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedStatus === "all" ? "default" : "outline"}
                  onClick={() => setSelectedStatus("all")}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={selectedStatus === "active" ? "default" : "outline"}
                  onClick={() => setSelectedStatus("active")}
                  size="sm"
                >
                  Active
                </Button>
                <Button
                  variant={
                    selectedStatus === "inactive" ? "default" : "outline"
                  }
                  onClick={() => setSelectedStatus("inactive")}
                  size="sm"
                >
                  Inactive
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Patients ({filteredPatients.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingPatients ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="ml-2">Loading patients...</span>
              </div>
            ) : patientsError ? (
              <div className="text-center py-8">
                <p className="text-red-600">Error loading patients: {patientsError.message}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                  Retry
                </Button>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No patients found</p>
              </div>
            ) : (
              <DataTable columns={patientColumns} data={filteredPatients} />
            )}
          </CardContent>
        </Card>

        {/* Patient Detail Modal */}
        {selectedPatient && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPatient.id}`}
                    />
                    <AvatarFallback>
                      {selectedPatient.firstName[0]}
                      {selectedPatient.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-xl font-bold">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Patient ID: {selectedPatient.id}
                    </div>
                  </div>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPatient(null)}
                >
                  ×
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        {selectedPatient.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        {selectedPatient.phone}
                      </div>
                      <div>
                        <strong>Age:</strong>{" "}
                        {calculateAge(selectedPatient.dateOfBirth)} years old
                      </div>
                      <div>
                        <strong>Emergency Contact:</strong>{" "}
                        {selectedPatient.emergencyContact}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Medical Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Primary Condition:</strong>{" "}
                        {selectedPatient.condition}
                      </div>
                      <div>
                        <strong>Assigned Doctor:</strong>{" "}
                        {selectedPatient.doctor}
                      </div>
                      <div>
                        <strong>Total Visits:</strong>{" "}
                        {selectedPatient.totalVisits}
                      </div>
                      <div>
                        <strong>Insurance:</strong> {selectedPatient.insurance}
                      </div>
                      <div>
                        <strong>Status:</strong>
                        <Badge
                          className={`ml-2 ${getStatusColor(selectedPatient.status)}`}
                        >
                          {selectedPatient.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Appointment History</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Last Visit:</strong>{" "}
                      {formatDate(selectedPatient.lastVisit)}
                    </div>
                    <div>
                      <strong>Next Appointment:</strong>{" "}
                      {formatDate(selectedPatient.nextAppointment)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Patient
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Appointment
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    View Records
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
