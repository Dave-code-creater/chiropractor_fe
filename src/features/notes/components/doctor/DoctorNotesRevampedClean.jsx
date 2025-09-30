import { useState, useMemo } from "react";


import {
    User,
    AlertCircle,
    Car,
    Briefcase,
} from "lucide-react";

import { useDoctorPatientsWithIncidents, useIncidentDetails } from "../../domain/noteService";

const DoctorNotesRevamped = ({ doctorId }) => {
    if (!doctorId) {
        console.error('DoctorNotesRevamped: doctorId prop is required');
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
                <Card className="p-8 text-center max-w-md shadow-xl border-0">
                    <CardContent>
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-red-600 mb-2">Configuration Error</h2>
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
    const [filterPriority, setFilterPriority] = useState("all");
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [isCreatingTreatmentPlan, setIsCreatingTreatmentPlan] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(false);

    const { patients, isLoading: isLoadingPatients, error: patientsError } = useDoctorPatientsWithIncidents(doctorId);
    const { incidentDetails, isLoading: isLoadingIncident, error: incidentError } = useIncidentDetails(selectedIncident?.id);

    const getStatusColor = (status) => {
        const colors = {
            active: "bg-emerald-100 text-emerald-800 border-emerald-200",
            inactive: "bg-gray-100 text-gray-800 border-gray-200",
            pending: "bg-amber-100 text-amber-800 border-amber-200",
            completed: "bg-blue-100 text-blue-800 border-blue-200",
            ongoing: "bg-purple-100 text-purple-800 border-purple-200"
        };
        return colors[status] || colors.active;
    };

    const getPriorityColor = (priority) => {
        const colors = {
            high: "bg-red-100 text-red-800 border-red-200",
            medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
            low: "bg-green-100 text-green-800 border-green-200"
        };
        return colors[priority] || colors.medium;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            return new Date(dateStr).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return 'Invalid Date';
        }
    };

    const getIncidentIcon = (type) => {
        const icons = {
            auto_accident: Car,
            work_injury: Briefcase,
            personal_injury: User,
            default: AlertCircle
        };
        return icons[type] || icons.default;
    };

    if (patientsError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
                <Card className="p-8 text-center max-w-md shadow-xl border-0">
                    <CardContent>
                        <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Unable to Load Patients</h2>
                        <p className="text-gray-600 mb-4">There was an error loading patient data. Please try again.</p>
                        <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const filteredPatients = useMemo(() => {
        if (!patients) return [];

        return patients.filter(patient => {
            const patientName = `${patient?.first_name || ''} ${patient?.last_name || ''}`.trim().toLowerCase();
            const email = (patient?.email || '').toLowerCase();
            const matchesSearch = patientName.includes(searchTerm.toLowerCase()) ||
                email.includes(searchTerm.toLowerCase());

            const matchesStatus = filterStatus === "all" || patient?.status === filterStatus;

            let matchesPriority = filterPriority === "all";
            if (!matchesPriority && patient?.recent_incidents?.length > 0) {
                matchesPriority = patient.recent_incidents.some(incident =>
                    incident.priority === filterPriority
                );
            }

            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [patients, searchTerm, filterStatus, filterPriority]);

    const renderPatientCard = (patient) => {
        if (!patient) return null;

        const patientName = `${patient?.first_name || ''} ${patient?.last_name || ''}`.trim();
        const isSelected = selectedPatient?.id === patient?.id;
        const incidentCount = patient?.recent_incidents?.length || 0;
        const hasHighPriority = patient?.recent_incidents?.some(incident => incident.priority === 'high');
        const lastVisit = patient?.last_visit || patient?.last_incident_date;

        return (
            <Card
                key={patient.id}
                className={`cursor-pointer transition-all duration-200 border group hover:shadow-md ${isSelected
                        ? 'border-blue-500 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white/60 backdrop-blur-sm'
                    }`}
                onClick={() => setSelectedPatient(patient)}
            >
                <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                        <div className="relative">
                            <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                                <AvatarImage src={patient?.avatar} />
                                <AvatarFallback
                                    className={`text-sm font-semibold ${isSelected
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700'
                                        }`}
                                >
                                    {patientName?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'P'}
                                </AvatarFallback>
                            </Avatar>
                            {hasHighPriority && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-2.5 h-2.5 text-white" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h3 className={`font-semibold truncate text-sm ${isSelected ? 'text-blue-900' : 'text-slate-900'
                                    }`}>
                                    {patientName || 'Unknown Patient'}
                                </h3>
                                <div className="flex items-center space-x-1">
                                    {patient?.is_favorite && (
                                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                    )}
                                    <MoreVertical className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>

                            <p className={`text-xs truncate mt-0.5 ${isSelected ? 'text-blue-700' : 'text-slate-600'
                                }`}>
                                {patient?.email || 'No email'}
                            </p>

                            <div className="flex items-center justify-between mt-2">
                                <Badge
                                    variant="outline"
                                    className={`text-xs px-2 py-0.5 ${getStatusColor(patient?.status)}`}
                                >
                                    {patient?.status || 'Active'}
                                </Badge>

                                <div className="flex items-center space-x-2 text-xs text-slate-600">
                                    {incidentCount > 0 && (
                                        <div className="flex items-center space-x-1">
                                            <FileCheck className="w-3 h-3" />
                                            <span>{incidentCount}</span>
                                        </div>
                                    )}
                                    {lastVisit && (
                                        <div className="flex items-center space-x-1">
                                            <Clock className="w-3 h-3" />
                                            <span>{formatDate(lastVisit)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex items-center space-x-1">
                                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                                        <MessageSquare className="w-3 h-3 mr-1" />
                                        Message
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        Schedule
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    const renderTabContent = (incidents) => {
        switch (activeTab) {
            case "overview":
                return (
                    <div className="p-6 space-y-6 overflow-y-auto">
                        <Card className="border border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <User className="w-5 h-5 text-blue-600" />
                                    <span>Patient Information</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-slate-600">Full Name</label>
                                            <p className="text-lg font-semibold text-slate-900">{`${selectedPatient.first_name || ''} ${selectedPatient.last_name || ''}`.trim()}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-600">Email Address</label>
                                            <p className="text-slate-900">{selectedPatient.email}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-600">Phone Number</label>
                                            <p className="text-slate-900">{selectedPatient.phone || 'Not provided'}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-slate-600">Patient Status</label>
                                            <div className="mt-1">
                                                <Badge className={getStatusColor(selectedPatient.status)}>
                                                    {selectedPatient.status?.toUpperCase() || 'ACTIVE'}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-600">Last Visit</label>
                                            <p className="text-slate-900">{selectedPatient.last_visit ? formatDate(selectedPatient.last_visit) : 'No visits yet'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-600">Total Reports</label>
                                            <p className="text-slate-900">{incidents.length} reports submitted</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Zap className="w-5 h-5 text-purple-600" />
                                    <span>Quick Actions</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <Button variant="outline" className="flex flex-col items-center space-y-2 h-auto py-4">
                                        <MessageSquare className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm">Send Message</span>
                                    </Button>
                                    <Button variant="outline" className="flex flex-col items-center space-y-2 h-auto py-4">
                                        <Calendar className="w-5 h-5 text-green-600" />
                                        <span className="text-sm">Schedule Appointment</span>
                                    </Button>
                                    <Button variant="outline" className="flex flex-col items-center space-y-2 h-auto py-4">
                                        <FileText className="w-5 h-5 text-purple-600" />
                                        <span className="text-sm">View Records</span>
                                    </Button>
                                    <Button variant="outline" className="flex flex-col items-center space-y-2 h-auto py-4">
                                        <Download className="w-5 h-5 text-orange-600" />
                                        <span className="text-sm">Export Data</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                );

            case "initial-report":
                return (
                    <div className="p-6 space-y-4 overflow-y-auto">
                        {incidents.length > 0 ? (
                            incidents.map((incident, index) => {
                                const IncidentIcon = getIncidentIcon(incident.incident_type);
                                return (
                                    <Card
                                        key={incident.id || index}
                                        className="border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                                        onClick={() => setSelectedIncident(incident)}
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                        <IncidentIcon className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-lg text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                                                            {incident.incident_type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Initial Report'}
                                                        </h3>
                                                        <p className="text-slate-600 mb-2">
                                                            Submitted: {formatDate(incident.created_at)}
                                                        </p>
                                                        <p className="text-sm text-slate-500">
                                                            Report ID: {incident.id}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Badge className={getPriorityColor(incident.priority)}>
                                                        {incident.priority || 'Medium'}
                                                    </Badge>
                                                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileCheck className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Initial Reports</h3>
                                <p className="text-slate-600 mb-6">This patient hasn't submitted any initial reports yet.</p>
                                <Button variant="outline">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Report
                                </Button>
                            </div>
                        )}
                    </div>
                );

            case "treatment-plans":
                return (
                    <div className="p-6 space-y-4 overflow-y-auto">
                        {isCreatingTreatmentPlan ? (
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsCreatingTreatmentPlan(false)}
                                        size="sm"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-2" />
                                        Back to Treatment Plans
                                    </Button>
                                    <h3 className="text-xl font-semibold text-slate-900">Create Treatment Plan</h3>
                                </div>
                                <TreatmentPlanForm
                                    patient={selectedPatient}
                                    incidents={incidents}
                                    onCancel={() => setIsCreatingTreatmentPlan(false)}
                                />
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-slate-900">Treatment Plans</h3>
                                    <Button
                                        onClick={() => setIsCreatingTreatmentPlan(true)}
                                        disabled={incidents.length === 0}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Treatment Plan
                                    </Button>
                                </div>
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Target className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No Treatment Plans</h3>
                                    <p className="text-slate-600 mb-6">
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
                                </div>
                            </>
                        )}
                    </div>
                );

            case "progress-notes":
                return (
                    <div className="p-6 space-y-4 overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-900">Progress Notes</h3>
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Progress Note
                            </Button>
                        </div>
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ClipboardList className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Progress Notes</h3>
                            <p className="text-slate-600 mb-6">Progress notes will appear here after treatment sessions.</p>
                            <Button variant="outline">
                                <Plus className="w-4 h-4 mr-2" />
                                Add First Progress Note
                            </Button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const renderPatientDetails = () => {
        if (!selectedPatient) {
            return (
                <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="h-full flex items-center justify-center p-12">
                        <div className="text-center max-w-md mx-auto">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 rounded-full flex items-center justify-center shadow-inner">
                                <Users className="w-12 h-12 text-slate-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">
                                Select a Patient
                            </h3>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                Choose a patient from the sidebar to view their medical records, treatment plans, and progress notes.
                            </p>
                            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                                    <UserPlus className="w-4 h-4" />
                                    <span>Add Patient</span>
                                </Button>
                                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                                    <BarChart3 className="w-4 h-4" />
                                    <span>View Reports</span>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        const patientName = `${selectedPatient.first_name || ''} ${selectedPatient.last_name || ''}`.trim();
        const incidents = selectedPatient.recent_incidents || [];
        const hasHighPriorityIncidents = incidents.some(incident => incident.priority === 'high');

        return (
            <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                            <Avatar className="w-16 h-16 border-4 border-white/20 shadow-lg">
                                <AvatarImage src={selectedPatient.avatar} />
                                <AvatarFallback className="bg-white/20 text-white text-lg font-bold">
                                    {patientName?.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h1 className="text-2xl font-bold">{patientName}</h1>
                                    {hasHighPriorityIncidents && (
                                        <Badge className="bg-red-500/20 text-red-100 border border-red-400/30">
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            High Priority
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-white/80">
                                    <div className="flex items-center space-x-1">
                                        <Mail className="w-4 h-4" />
                                        <span>{selectedPatient.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Phone className="w-4 h-4" />
                                        <span>{selectedPatient.phone || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>Last: {selectedPatient.last_visit ? formatDate(selectedPatient.last_visit) : 'No visits'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Badge className={`${getStatusColor(selectedPatient.status)} border-white/20`}>
                                {selectedPatient.status?.toUpperCase() || 'ACTIVE'}
                            </Badge>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-white hover:bg-white/20"
                                onClick={() => setShowQuickActions(!showQuickActions)}
                            >
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                            <FileCheck className="w-6 h-6 mx-auto mb-1 text-blue-200" />
                            <div className="text-xl font-bold">{incidents.length}</div>
                            <div className="text-xs text-white/80">Reports</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                            <Target className="w-6 h-6 mx-auto mb-1 text-green-200" />
                            <div className="text-xl font-bold">0</div>
                            <div className="text-xs text-white/80">Plans</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                            <ClipboardList className="w-6 h-6 mx-auto mb-1 text-purple-200" />
                            <div className="text-xl font-bold">0</div>
                            <div className="text-xs text-white/80">Notes</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                            <TrendingUp className="w-6 h-6 mx-auto mb-1 text-orange-200" />
                            <div className="text-xl font-bold">85%</div>
                            <div className="text-xs text-white/80">Progress</div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                        <div className="border-b border-slate-200 bg-white/50 backdrop-blur-sm">
                            <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
                                <TabsTrigger
                                    value="overview"
                                    className="px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger
                                    value="initial-report"
                                    className="px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Initial Reports
                                    {incidents.length > 0 && (
                                        <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                                            {incidents.length}
                                        </Badge>
                                    )}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="treatment-plans"
                                    className="px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                                >
                                    <Target className="w-4 h-4 mr-2" />
                                    Treatment Plans
                                </TabsTrigger>
                                <TabsTrigger
                                    value="progress-notes"
                                    className="px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                                >
                                    <ClipboardList className="w-4 h-4 mr-2" />
                                    Progress Notes
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 overflow-hidden">
                            {renderTabContent(incidents)}
                        </div>
                    </Tabs>
                </div>
            </Card>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <div className="bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900">Patient Management</h1>
                                    <p className="text-sm text-slate-600">Manage patient care and treatment plans</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="hidden md:flex items-center space-x-4 bg-slate-50 rounded-lg px-4 py-2">
                                <div className="text-center">
                                    <div className="text-lg font-semibold text-slate-900">{filteredPatients.length}</div>
                                    <div className="text-xs text-slate-600">Total Patients</div>
                                </div>
                                <div className="w-px h-8 bg-slate-300" />
                                <div className="text-center">
                                    <div className="text-lg font-semibold text-emerald-600">{filteredPatients.filter(p => p.status === 'active').length}</div>
                                    <div className="text-xs text-slate-600">Active</div>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                className="hidden md:flex items-center space-x-2"
                            >
                                <Download className="w-4 h-4" />
                                <span>Export</span>
                            </Button>
                            <Button
                                size="sm"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Add Patient
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="grid grid-cols-12 gap-6 min-h-[calc(100vh-200px)]">
                    <div className={`transition-all duration-300 ${sidebarCollapsed ? 'col-span-1' : 'col-span-4'}`}>
                        <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-4 border-b border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        {!sidebarCollapsed && (
                                            <>
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                    <Users className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-900">My Patients</h3>
                                                    <p className="text-xs text-slate-600">{filteredPatients.length} patients</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                        className="w-8 h-8 p-0"
                                    >
                                        {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </CardHeader>

                            {!sidebarCollapsed && (
                                <CardContent className="p-4 space-y-4 flex-1 overflow-hidden flex flex-col">
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                placeholder="Search patients..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                                <SelectTrigger className="text-sm border-slate-200">
                                                    <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Status</SelectItem>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="inactive">Inactive</SelectItem>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Select value={filterPriority} onValueChange={setFilterPriority}>
                                                <SelectTrigger className="text-sm border-slate-200">
                                                    <SelectValue placeholder="Priority" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Priority</SelectItem>
                                                    <SelectItem value="high">High</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="low">Low</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                                        {isLoadingPatients ? (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="flex flex-col items-center space-y-3">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                    <p className="text-sm text-slate-600">Loading patients...</p>
                                                </div>
                                            </div>
                                        ) : filteredPatients.length > 0 ? (
                                            filteredPatients.map((patient) => renderPatientCard(patient))
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Users className="w-8 h-8 text-slate-400" />
                                                </div>
                                                <h3 className="font-medium text-slate-900 mb-2">No Patients Found</h3>
                                                <p className="text-sm text-slate-600 mb-4">
                                                    {searchTerm || filterStatus !== "all" || filterPriority !== "all"
                                                        ? "Try adjusting your filters"
                                                        : "No patients assigned yet"}
                                                </p>
                                                {!searchTerm && filterStatus === "all" && filterPriority === "all" && (
                                                    <Button size="sm" variant="outline">
                                                        <UserPlus className="w-4 h-4 mr-2" />
                                                        Add First Patient
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    </div>

                    <div className={`transition-all duration-300 ${sidebarCollapsed ? 'col-span-11' : 'col-span-8'}`}>
                        <div className="h-full">
                            {renderPatientDetails()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default DoctorNotesRevamped;
