import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
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
    User,
    FileText,
    Calendar,
    Clock,
    ChevronRight,
    ChevronDown,
    ChevronLeft,
    AlertCircle,
    CheckCircle,
    Car,
    Briefcase,
    Activity,
    Heart,
    FileCheck,
    Phone,
    Mail,
    MapPin,
    Eye,
    Users,
    Stethoscope,
    ClipboardList,
    Target,
    TrendingUp,
    Brain,
    Pill,
    FileSpreadsheet,
    History,
    Bell,
    CalendarCheck,
    Zap,
    Plus,
} from "lucide-react";

import { useDoctorPatientsWithIncidents, useIncidentDetails } from "../../domain/noteService";
import { useGetTreatmentPlanQuery } from "@/api/services/notesApi";
import InitialReportDisplay from "../InitialReportDisplay";
import TreatmentPlanForm from "../TreatmentPlanForm";

const DoctorNotesRevamped = ({ doctorId }) => {
    // Validate required props
    if (!doctorId) {
        console.error('DoctorNotesRevamped: doctorId prop is required');
        return (
            <div className="h-screen bg-gray-50 p-6 flex items-center justify-center">
                <Card className="p-8 text-center">
                    <CardContent>
                        <h2 className="text-xl font-semibold text-red-600 mb-2">Configuration Error</h2>
                        <p className="text-gray-600">Doctor ID is required to load patient data.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [isCreatingTreatmentPlan, setIsCreatingTreatmentPlan] = useState(false);

    const { patients, isLoading: isLoadingPatients, error: patientsError } = useDoctorPatientsWithIncidents(doctorId);
    const { incidentDetails, isLoading: isLoadingIncident, error: incidentError } = useIncidentDetails(selectedIncident?.id);

    // Handle data fetching errors
    if (patientsError) {
        return (
            <div className="h-screen bg-gray-50 p-6 flex items-center justify-center">
                <Card className="p-8 text-center max-w-md">
                    <CardContent>
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Patients</h2>
                        <p className="text-gray-600 mb-4">
                            {patientsError?.message || 'Failed to load patient data. Please try again.'}
                        </p>
                        <Button onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Filter patients based on search with null safety
    const filteredPatients = useMemo(() => {
        if (!patients || !Array.isArray(patients)) return [];

        return patients.filter(patient => {
            const patientName = `${patient?.first_name || ''} ${patient?.last_name || ''}`.trim();
            const email = patient?.email || '';
            const matchesSearch = patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === "all" || patient?.status === filterStatus;

            return matchesSearch && matchesStatus;
        });
    }, [patients, searchTerm, filterStatus]);

    const formatDate = (dateString) => {
        if (!dateString) return 'No date';

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid date';

            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch (error) {
            console.error('Date formatting error:', error);
            return 'Invalid date';
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
                return ClipboardList;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'urgent':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'high':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'ongoing':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'completed':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const renderPatientCard = (patient) => {
        if (!patient) return null;

        const patientName = `${patient?.first_name || ''} ${patient?.last_name || ''}`.trim();
        const isSelected = selectedPatient?.id === patient?.id;
        const incidentCount = patient?.recent_incidents?.length || 0;

        return (
            <Card
                key={patient.id}
                className={`cursor-pointer transition-all duration-200 border ${isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                onClick={() => setSelectedPatient(patient)}
            >
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                            }`}>
                            {patientName?.split(' ').map(n => n?.[0]).join('').toUpperCase().substring(0, 2) || 'P'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold truncate ${isSelected ? 'text-blue-900' : 'text-gray-900'
                                }`}>
                                {patientName || 'Unknown Patient'}
                            </h3>
                            <p className={`text-sm truncate ${isSelected ? 'text-blue-700' : 'text-gray-500'
                                }`}>
                                {patient?.email || 'No email'}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <Badge variant={patient?.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                                {patient?.status || 'Active'}
                            </Badge>
                            {incidentCount > 0 && (
                                <span className={`text-xs flex items-center gap-1 ${isSelected ? 'text-blue-600' : 'text-gray-500'
                                    }`}>
                                    <FileCheck className="w-3 h-3" />
                                    {incidentCount} report{incidentCount !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    const renderPatientDetails = () => {
        if (!selectedPatient) {
            return (
                <div className="h-full flex items-center justify-center p-12">
                    <div className="text-center max-w-md">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center shadow-inner">
                            <Users className="w-12 h-12 text-slate-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-700 mb-3">
                            Select a Patient
                        </h3>
                        <p className="text-slate-500 leading-relaxed">
                            Choose a patient from the sidebar to view their details
                        </p>
                    </div>
                </div>
            );
        }

        const patientName = `${selectedPatient.first_name || ''} ${selectedPatient.last_name || ''}`.trim();
        const incidents = selectedPatient.recent_incidents || [];

        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 pb-20">
                <div className="max-w-7xl mx-auto space-y-4">
                    {/* Patient Header */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-lg font-semibold text-blue-600">
                                    {patientName?.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{patientName}</h1>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <Mail className="w-4 h-4" />
                                        {selectedPatient.email}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Phone className="w-4 h-4" />
                                        {selectedPatient.phone || 'N/A'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        Last: {selectedPatient.last_visit ? formatDate(selectedPatient.last_visit) : 'No visits'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Badge
                            className={selectedPatient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                        >
                            {selectedPatient.status}
                        </Badge>
                    </div>

                    {/* Patient Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4 text-center">
                                <FileCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold">{incidents.length}</div>
                                <p className="text-sm text-muted-foreground">Initial Reports</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold">0</div>
                                <p className="text-sm text-muted-foreground">Treatment Plans</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <ClipboardList className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold">0</div>
                                <p className="text-sm text-muted-foreground">Progress Notes</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <Badge className={getStatusColor(selectedPatient.status)}>
                                    {selectedPatient.status?.toUpperCase()}
                                </Badge>
                                <p className="text-sm text-muted-foreground mt-2">Patient Status</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="grid w-full max-w-2xl grid-cols-4">
                            <TabsTrigger value="overview">Patient Overview</TabsTrigger>
                            <TabsTrigger value="initial-report">Initial Reports</TabsTrigger>
                            <TabsTrigger value="treatment-plans">Treatment Plans</TabsTrigger>
                            <TabsTrigger value="progress-notes">Progress Notes</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <History className="w-5 h-5 text-gray-600" />
                                        Recent Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {incidents.length > 0 ? (
                                        <div className="space-y-3">
                                            {incidents.slice(0, 5).map((incident) => {
                                                const IncidentIcon = getIncidentIcon(incident.incident_type);
                                                return (
                                                    <div key={incident.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                                                        <div className="p-2 rounded-lg bg-blue-50">
                                                            <IncidentIcon className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900">
                                                                {incident.incident_type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {formatDate(incident.incident_date)}
                                                            </p>
                                                        </div>
                                                        <Badge className={`${getPriorityColor(incident.priority || 'medium')}`}>
                                                            {incident.priority || 'Medium'}
                                                        </Badge>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <h3 className="font-medium text-gray-700 mb-1">No Recent Activity</h3>
                                            <p className="text-sm text-gray-500">Patient activity will appear here once available</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="initial-report" className="space-y-6">
                            {selectedIncident ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => setSelectedIncident(null)}
                                            size="sm"
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-2" />
                                            Back to Reports
                                        </Button>
                                        <h3 className="text-xl font-semibold">
                                            {selectedIncident.incident_type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Report
                                        </h3>
                                    </div>
                                    <InitialReportDisplay incident={selectedIncident} />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">Initial Reports</h3>
                                        <Badge variant="secondary">
                                            {incidents.length} report{incidents.length !== 1 ? 's' : ''}
                                        </Badge>
                                    </div>
                                    {incidents.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {incidents.map((incident) => {
                                                const IncidentIcon = getIncidentIcon(incident.incident_type);
                                                return (
                                                    <Card
                                                        key={incident.id}
                                                        className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
                                                        onClick={() => setSelectedIncident(incident)}
                                                    >
                                                        <CardContent className="p-4">
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <div className="p-2 rounded-lg bg-blue-50">
                                                                    <IncidentIcon className="w-5 h-5 text-blue-600" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h4 className="font-semibold text-gray-900">
                                                                        {incident.incident_type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                                    </h4>
                                                                    <p className="text-sm text-gray-500">
                                                                        {formatDate(incident.incident_date)}
                                                                    </p>
                                                                </div>
                                                                <Badge className={getPriorityColor(incident.priority || 'medium')}>
                                                                    {incident.priority || 'Medium'}
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div className="text-sm text-gray-500">
                                                                    Report ID: {incident.id}
                                                                </div>
                                                                <Button variant="ghost" size="sm">
                                                                    <Eye className="w-4 h-4 mr-1" />
                                                                    View Details
                                                                </Button>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <Card>
                                            <CardContent className="text-center py-12">
                                                <FileCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                                <h3 className="text-lg font-semibold text-gray-700">
                                                    No Initial Reports
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    This patient hasn't submitted any initial reports yet.
                                                </p>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="treatment-plans" className="space-y-6">
                            {isCreatingTreatmentPlan ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsCreatingTreatmentPlan(false)}
                                            size="sm"
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-2" />
                                            Back to Treatment Plans
                                        </Button>
                                        <h3 className="text-xl font-semibold">Create Treatment Plan</h3>
                                    </div>
                                    <TreatmentPlanForm
                                        patient={selectedPatient}
                                        incidents={incidents}
                                        onCancel={() => setIsCreatingTreatmentPlan(false)}
                                    />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">Treatment Plans</h3>
                                        <Button
                                            onClick={() => setIsCreatingTreatmentPlan(true)}
                                            disabled={incidents.length === 0}
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create Treatment Plan
                                        </Button>
                                    </div>
                                    <Card>
                                        <CardContent className="text-center py-12">
                                            <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-700">
                                                No Treatment Plans
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-4">
                                                {incidents.length > 0
                                                    ? "Create a treatment plan based on the patient's initial reports."
                                                    : "Patient needs to submit an initial report before creating a treatment plan."}
                                            </p>
                                            {incidents.length > 0 && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setIsCreatingTreatmentPlan(true)}
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Create First Treatment Plan
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="progress-notes" className="space-y-6">
                            <Card>
                                <CardContent className="text-center py-12">
                                    <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-700">
                                        No Progress Notes
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Progress notes will appear here after treatment sessions.
                                    </p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        );
    };

    if (isLoadingPatients) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-50 p-6 flex flex-col">
            <div className="max-w-7xl mx-auto flex-1 flex flex-col">
                {/* Page Header */}
                <div className="mb-6 flex-shrink-0">
                    <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
                    <p className="text-gray-600 mt-2">Manage patient records and treatment plans</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
                    {/* Patient List Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="h-full flex flex-col border border-gray-200 shadow-sm">
                            <CardHeader className="pb-3 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-blue-600" />
                                        <span className="text-lg font-semibold">My Patients</span>
                                    </CardTitle>
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-200">
                                        {filteredPatients.length}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col p-4 space-y-4">
                                {/* Search and Filter */}
                                <div className="space-y-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Search patients..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-9 h-9 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                                        <SelectTrigger className="h-9 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                                            <SelectValue placeholder="All Patients" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Patients</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="ongoing">Ongoing Treatment</SelectItem>
                                            <SelectItem value="completed">Treatment Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Patients List */}
                                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                                    {filteredPatients.length > 0 ? (
                                        filteredPatients.map((patient) => renderPatientCard(patient))
                                    ) : (
                                        <div className="text-center py-8">
                                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <h3 className="font-medium text-gray-700 mb-1">No Patients Found</h3>
                                            <p className="text-sm text-gray-500">
                                                {searchTerm || filterStatus !== "all"
                                                    ? "Try adjusting your filters"
                                                    : "No patients assigned yet"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        <Card className="h-full flex flex-col border border-gray-200 shadow-sm">
                            {renderPatientDetails()}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

// PropTypes validation
DoctorNotesRevamped.propTypes = {
    doctorId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired
};

export default DoctorNotesRevamped;
