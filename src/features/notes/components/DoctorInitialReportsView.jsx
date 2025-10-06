import { useState, useMemo } from "react";


import {
    Activity,
    FileCheck,
    Car,
    Briefcase,
    Heart,
    ClipboardList,
    Plus,
} from "lucide-react";
import { useGetIncidentsQuery, useGetTreatmentPlanQuery, useCreateTreatmentPlanMutation } from "@/api";
import TreatmentPlanForm from "./TreatmentPlanForm";
import { toast } from "sonner";

const DoctorInitialReportsView = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [showTreatmentPlanForm, setShowTreatmentPlanForm] = useState(false);

    const {
        data: allIncidents,
        isLoading: isLoadingIncidents,
        error: incidentsError,
        refetch
    } = useGetIncidentsQuery(null);

    // Fetch treatment plan for selected incident
    const { data: treatmentPlanData, isLoading: isLoadingPlan } = useGetTreatmentPlanQuery(
        selectedIncident?.id,
        { skip: !selectedIncident?.id }
    );

    const [createTreatmentPlan, { isLoading: isCreatingPlan }] = useCreateTreatmentPlanMutation();

    const incidents = useMemo(() => {
        if (!allIncidents?.data) return [];
        return Array.isArray(allIncidents.data) ? allIncidents.data : [];
    }, [allIncidents]);

    const filteredIncidents = useMemo(() => {
        let filtered = incidents;

        if (searchTerm) {
            filtered = filtered.filter(incident => {
                const forms = incident.forms || [];
                const patientInfo = forms.find(f => f.form_type === 'patient_info')?.form_data || {};
                const patientName = `${patientInfo.first_name || ''} ${patientInfo.last_name || ''}`.trim().toLowerCase();
                const description = (incident.description || '').toLowerCase();
                const incidentType = (incident.incident_type || '').replace('_', ' ').toLowerCase();

                return patientName.includes(searchTerm.toLowerCase()) ||
                    description.includes(searchTerm.toLowerCase()) ||
                    incidentType.includes(searchTerm.toLowerCase());
            });
        }

        if (filterType !== "all") {
            filtered = filtered.filter(incident =>
                incident.incident_type?.toLowerCase().includes(filterType.toLowerCase())
            );
        }

        if (filterStatus !== "all") {
            filtered = filtered.filter(incident => incident.status === filterStatus);
        }

        return filtered.sort((a, b) => new Date(b.created_at || b.incident_date) - new Date(a.created_at || a.incident_date));
    }, [incidents, searchTerm, filterType, filterStatus]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleCreateTreatmentPlan = async (treatmentData) => {
        try {
            await createTreatmentPlan({
                incidentId: selectedIncident.id,
                ...treatmentData
            }).unwrap();
            
            toast.success("Treatment Plan Created Successfully", {
                description: "The patient can now book appointments based on this plan."
            });
            
            setShowTreatmentPlanForm(false);
        } catch (error) {
            console.error("Failed to create treatment plan:", error);
            toast.error("Failed to Create Treatment Plan", {
                description: error?.data?.message || "Please try again"
            });
        }
    };

    const getPatientName = (incident) => {
        const forms = incident?.forms || [];
        const patientInfo = forms.find(f => f.form_type === 'patient_info')?.form_data || {};
        return `${patientInfo.first_name || ''} ${patientInfo.last_name || ''}`.trim() || 'Unknown Patient';
    };

    const getPatientInfo = (incident) => {
        const forms = incident?.forms || [];
        return forms.find(f => f.form_type === 'patient_info')?.form_data || {};
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
                return FileCheck;
        }
    };

    const getIncidentColor = (incidentType) => {
        switch (incidentType) {
            case 'car_accident':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'work_injury':
                return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'sports_injury':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'general_pain':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getPatientAge = (incident) => {
        const forms = incident.forms || [];
        const patientInfo = forms.find(f => f.form_type === 'patient_info')?.form_data || {};
        if (patientInfo.date_of_birth) {
            const today = new Date();
            const birthDate = new Date(patientInfo.date_of_birth);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        }
        return 'Unknown';
    };

    const getPainLevel = (incident) => {
        const forms = incident.forms || [];
        const painAssessment = forms.find(f => f.form_type === 'pain_assessment')?.form_data || {};
        if (painAssessment.pain_level && painAssessment.pain_level.length > 0) {
            const levels = painAssessment.pain_level.map(level => {
                const rating = level.split(':')[1];
                return parseInt(rating) || 0;
            });
            return Math.max(...levels);
        }
        return 'N/A';
    };

    if (selectedIncident) {
        const existingPlan = treatmentPlanData?.data;
        const patientName = getPatientName(selectedIncident);
        const patientInfo = getPatientInfo(selectedIncident);

        if (showTreatmentPlanForm) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
                    <div className="max-w-6xl mx-auto space-y-6">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowTreatmentPlanForm(false)}
                                className="flex items-center gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back to Report
                            </Button>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-foreground">
                                    Create Treatment Plan - {patientName}
                                </h1>
                                <p className="text-muted-foreground mt-1">
                                    Define treatment phases, session frequency, and overall treatment goals
                                </p>
                            </div>
                        </div>

                        <TreatmentPlanForm
                            patientId={patientInfo.patient_id || selectedIncident.user_id}
                            patientName={patientName}
                            onSubmit={handleCreateTreatmentPlan}
                            onCancel={() => setShowTreatmentPlanForm(false)}
                            isEditing={false}
                        />
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setSelectedIncident(null)}
                            className="flex items-center gap-2"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back to Patient Reports
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-foreground">
                                Patient Initial Report - {patientName}
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Detailed view for clinical assessment and treatment planning
                            </p>
                        </div>
                        {!isLoadingPlan && !existingPlan && (
                            <Button
                                onClick={() => setShowTreatmentPlanForm(true)}
                                className="flex items-center gap-2"
                            >
                                <ClipboardList className="w-4 h-4" />
                                Create Treatment Plan
                            </Button>
                        )}
                        {existingPlan && (
                            <Badge className="px-4 py-2 text-sm" variant="secondary">
                                <ClipboardList className="w-4 h-4 mr-2" />
                                Treatment Plan Created
                            </Badge>
                        )}
                    </div>

                    {existingPlan && (
                        <Card className="border-l-4 border-l-green-500 bg-green-50/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-700">
                                    <ClipboardList className="w-5 h-5" />
                                    Active Treatment Plan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Diagnosis</p>
                                        <p className="font-medium">{existingPlan.diagnosis}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Treatment Goal</p>
                                        <p className="font-medium">{existingPlan.overall_goal || existingPlan.treatment_goals}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Duration</p>
                                        <p className="font-medium">{existingPlan.total_duration} weeks • {existingPlan.total_appointments} appointments</p>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2">
                                        <Badge variant="outline" className="bg-white">
                                            {existingPlan.status?.toUpperCase() || 'ACTIVE'}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">
                                            Patient can now book appointments based on this plan
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <InitialReportDisplay incident={selectedIncident} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Patient Initial Reports
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Review patient intake information to make clinical assessments and treatment predictions
                        </p>
                    </div>
                    <Button onClick={refetch} variant="outline" className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Refresh
                    </Button>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex-1 min-w-64 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search by patient name, condition, or incident type..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Filter by incident type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Incident Types</SelectItem>
                                    <SelectItem value="car_accident">Car Accident</SelectItem>
                                    <SelectItem value="work_injury">Work Injury</SelectItem>
                                    <SelectItem value="sports_injury">Sports Injury</SelectItem>
                                    <SelectItem value="general_pain">General Pain</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="submitted">Submitted</SelectItem>
                                    <SelectItem value="reviewed">Reviewed</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-blue-100">
                                    <FileCheck className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{incidents.length}</p>
                                    <p className="text-sm text-muted-foreground">Total Reports</p>
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
                                    <p className="text-2xl font-bold">
                                        {incidents.filter(i => i.status === 'submitted').length}
                                    </p>
                                    <p className="text-sm text-muted-foreground">New Submissions</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-purple-100">
                                    <Car className="w-4 h-4 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">
                                        {incidents.filter(i => i.incident_type === 'car_accident').length}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Car Accidents</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-orange-100">
                                    <Briefcase className="w-4 h-4 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">
                                        {incidents.filter(i => i.incident_type === 'work_injury').length}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Work Injuries</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {isLoadingIncidents && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <h3 className="text-lg font-semibold text-muted-foreground">
                                Loading Patient Reports...
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Please wait while we fetch all patient initial reports
                            </p>
                        </CardContent>
                    </Card>
                )}

                {incidentsError && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-red-600">
                                Failed to Load Patient Reports
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                There was an error fetching the patient reports. Please try again.
                            </p>
                            <Button onClick={refetch} variant="outline">
                                Try Again
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {!isLoadingIncidents && !incidentsError && (
                    <div className="space-y-4">
                        {filteredIncidents.length > 0 ? (
                            filteredIncidents.map((incident) => {
                                const Icon = getIncidentIcon(incident.incident_type);
                                const patientName = getPatientName(incident);
                                const patientAge = getPatientAge(incident);
                                const painLevel = getPainLevel(incident);
                                const forms = incident.forms || [];
                                const patientInfo = forms.find(f => f.form_type === 'patient_info')?.form_data || {};
                                const painDescription = forms.find(f => f.form_type === 'pain_description')?.form_data || {};

                                return (
                                    <Card
                                        key={incident.id}
                                        className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary"
                                        onClick={() => setSelectedIncident(incident)}
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-3 rounded-xl ${getIncidentColor(incident.incident_type)}`}>
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div>
                                                            <h3 className="text-xl font-semibold text-foreground">{patientName}</h3>
                                                            <p className="text-muted-foreground">
                                                                Age: {patientAge} • {patientInfo.gender || 'Unknown Gender'}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            <Badge className={`${getIncidentColor(incident.incident_type)} border`}>
                                                                <Icon className="w-3 h-3 mr-1" />
                                                                {incident.incident_type?.replace('_', ' ').toUpperCase()}
                                                            </Badge>
                                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                                <Calendar className="w-3 h-3 mr-1" />
                                                                {formatDate(incident.incident_date)}
                                                            </Badge>
                                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                {incident.status?.toUpperCase() || 'SUBMITTED'}
                                                            </Badge>
                                                            {painLevel !== 'N/A' && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className={`${painLevel >= 7 ? 'bg-red-50 text-red-700 border-red-200' :
                                                                        painLevel >= 4 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                                            'bg-green-50 text-green-700 border-green-200'}`}
                                                                >
                                                                    <Heart className="w-3 h-3 mr-1" />
                                                                    Pain: {painLevel}/10
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground max-w-2xl">
                                                            {painDescription.main_complaints ||
                                                                painDescription.symptom_details ||
                                                                incident.description ||
                                                                "Patient reported pain and discomfort requiring assessment"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {patientInfo.home_phone || patientInfo.cell_phone ? (
                                                        <div className="text-right text-sm">
                                                            <p className="text-muted-foreground">Contact</p>
                                                            <p className="font-medium">
                                                                {patientInfo.home_phone || patientInfo.cell_phone}
                                                            </p>
                                                        </div>
                                                    ) : null}
                                                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-4 border-t">
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-muted-foreground">Location:</span>
                                                        <p className="font-medium">
                                                            {patientInfo.city && patientInfo.state ?
                                                                `${patientInfo.city}, ${patientInfo.state}` : 'Not provided'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Forms Completed:</span>
                                                        <p className="font-medium">{forms.length} sections</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Submitted:</span>
                                                        <p className="font-medium">{formatDate(incident.created_at)}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Status:</span>
                                                        <p className="font-medium">{incident.status || 'Submitted'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })
                        ) : (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <FileCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-muted-foreground">
                                        No Patient Reports Found
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {searchTerm || filterType !== "all" || filterStatus !== "all"
                                            ? "No reports match your search criteria"
                                            : "No patient initial reports have been submitted yet"}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorInitialReportsView;
