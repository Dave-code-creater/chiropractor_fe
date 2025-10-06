import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import {
    Activity,
    Car,
    Briefcase,
    Heart,
    ClipboardCheck,
    Stethoscope,
    Target,
    CheckCircle,
    TrendingUp,
    Calendar,
    FileCheck,
    AlertCircle,
    ChevronLeft,
    Search,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useGetIncidentsQuery } from "@/api";
import InitialReportDisplay from "./InitialReportDisplay";
import PatientTreatmentPlanView from "../../appointments/components/patient/PatientTreatmentPlanView";

const PatientNotesView = () => {
    const auth = useSelector((state) => state.auth);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedNote, setSelectedNote] = useState(null);
    const [selectedCase, setSelectedCase] = useState(null);
    const [expandedCases, setExpandedCases] = useState({});

    const user = {
        id: auth.userID,
        role: auth.role,
        email: auth.email,
        username: auth.username,
        firstName: auth.profile?.firstName || auth.username,
        lastName: auth.profile?.lastName || '',
        profile: auth.profile
    };

    const {
        data: userIncidents,
        isLoading: isLoadingIncidents,
        error: incidentsError
    } = useGetIncidentsQuery(user?.id, { skip: !user?.id });

    const allNotes = useMemo(() => {
        return [];
    }, []);

    const incidents = useMemo(() => {
        if (!userIncidents?.data) return [];
        const incidentsList = Array.isArray(userIncidents.data) ? userIncidents.data : [];

        const filteredIncidents = incidentsList.filter(incident => incident.user_id === user?.id || incident.userId === user?.id || incident.patient_id === user?.id || incident.patientId === user?.id ||
        incident.patient?.id === user?.id
        );

        

        return filteredIncidents;
    }, [userIncidents, user?.id]);

    const filteredCases = useMemo(() => {
        return [];
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

    if (selectedNote) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
                <div className="max-w-4xl mx-auto space-y-6">
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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            My Medical Records
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            View your initial reports and treatment records
                        </p>
                    </div>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex-1 min-w-64 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search your reports and treatment notes..."
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

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-blue-100">
                                    <FileCheck className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{incidents.length}</p>
                                    <p className="text-sm text-muted-foreground">Initial Reports</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-green-100">
                                    <Activity className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">0</p>
                                    <p className="text-sm text-muted-foreground">Active Cases</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-purple-100">
                                    <ClipboardCheck className="w-4 h-4 text-purple-600" />
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
                                <div className="p-2 rounded-lg bg-orange-100">
                                    <Calendar className="w-4 h-4 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">0</p>
                                    <p className="text-sm text-muted-foreground">Upcoming Appointments</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {incidents && incidents.length > 0 && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">My Initial Reports & Treatment Plans</h2>
                            <Badge variant="secondary" className="text-xs">
                                {incidents.length} {incidents.length === 1 ? 'Report' : 'Reports'}
                            </Badge>
                        </div>
                        {incidents.map((incident) => (
                            <div key={incident.id} className="space-y-4">
                                <InitialReportDisplay incident={incident} />
                                {/* Show treatment plan if exists for this incident */}
                                <div className="pl-6 border-l-4 border-l-primary/20">
                                    <PatientTreatmentPlanView 
                                        incidentId={incident.id} 
                                        patientId={user?.id}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {incidentsError && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-red-600">
                                Error Loading Reports
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                There was an error loading your initial reports. Please try refreshing the page.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {isLoadingIncidents && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <h3 className="text-lg font-semibold text-muted-foreground">
                                Loading Initial Reports...
                            </h3>
                        </CardContent>
                    </Card>
                )}

                {!isLoadingIncidents && !incidentsError && incidents.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <FileCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-muted-foreground">
                                No Initial Reports Found
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                You haven't submitted any initial patient reports yet.
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Your initial reports will appear here after you complete the patient information forms during your first visit.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {filteredCases.length > 0 ? (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">My Treatment Cases</h2>
                        {filteredCases.map((patientCase) => {
                            const Icon = getIncidentIcon(patientCase.incidentType);
                            const isExpanded = expandedCases[patientCase.id];
                            return null;
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

export default PatientNotesView;
