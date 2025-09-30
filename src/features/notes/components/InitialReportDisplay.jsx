import { useState } from "react";
import {
    Briefcase,
    Activity,
    Heart,
    Car,
    FileCheck,
} from "lucide-react";
import { useSmartReportFetch, usePrefetchOnHover } from "@/hooks/useOptimizedReportFetching";

const InitialReportDisplay = ({ incident: basicIncident }) => {
    const [expanded, setExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    const {
        data: detailedIncidentData,
        isLoading: isLoadingDetails,
        error: detailsError
    } = useSmartReportFetch(basicIncident?.id, true, { refetchOnMount: false,
        refetchOnFocus: false,
        refetchOnReconnect: false,
        staleTime: 15 * 60 * 1000,
    });

    const handlePrefetchOnHover = usePrefetchOnHover(basicIncident?.id);

    if (!basicIncident)
        return null;

    const incident = detailedIncidentData?.data || basicIncident;

    const forms = incident.forms || [];
    const getFormData = (formType) => {
        const form = forms.find(f => f.form_type === formType);
        return form?.form_data || {};
    };

    const patientInfo = getFormData('patient_info');
    const medicalHistory = getFormData('medical_history');
    const painAssessment = getFormData('pain_assessment');
    const painDescription = getFormData('pain_description');
    const healthInsurance = getFormData('health_insurance');
    const lifestyleImpact = getFormData('lifestyle_impact');

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatPhoneNumber = (phone) => {
        if (!phone) return 'N/A';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        }
        return phone;
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

    const getIncidentColor = () => 'bg-primary/10 text-primary border border-border';

    const getResponseBadgeClass = (value) => (
        value === 'yes'
            ? 'border border-border bg-background text-foreground'
            : 'border border-border bg-background text-muted-foreground'
    );

    const Icon = getIncidentIcon(incident.incident_type);
    const patientName = `${patientInfo.first_name || ''} ${patientInfo.last_name || ''}`.trim() || 'Unknown Patient';

    return (
        <div className="space-y-4">
            <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-xl ${getIncidentColor()}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">{patientName}</h2>
                                    <p className="text-lg font-semibold text-primary">Initial Patient Report</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Badge className={getIncidentColor()}>
                                        <Icon className="w-3 h-3 mr-1" />
                                        {incident.incident_type?.replace('_', ' ').toUpperCase()}
                                    </Badge>
                                    <Badge variant="outline" className="border border-border bg-background text-primary">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        {incident.status?.toUpperCase() || 'SUBMITTED'}
                                    </Badge>
                                    <Badge variant="outline" className="border border-border bg-background text-muted-foreground">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {formatDate(incident.incident_date)}
                                    </Badge>
                                    {incident.forms && incident.forms.length > 0 && (
                                        <Badge variant="outline" className="border border-border bg-background text-muted-foreground">
                                            <FileText className="w-3 h-3 mr-1" />
                                            {incident.completed_forms || incident.forms.length} sections completed
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground max-w-2xl">
                                    {incident.title || incident.description || "Complete patient intake information and health assessment"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant={expanded ? "default" : "outline"}
                                size="sm"
                                onClick={() => setExpanded(!expanded)}
                                onMouseEnter={handlePrefetchOnHover}
                                className="flex items-center gap-2"
                            >
                                {expanded ? (
                                    <>
                                        <Eye className="w-4 h-4" />
                                        Hide Details
                                        <ChevronDown className="w-4 h-4" />
                                    </>
                                ) : (
                                    <>
                                        <Eye className="w-4 h-4" />
                                        View Full Report
                                        <ChevronRight className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="bg-muted border border-border shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <User className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Contact</p>
                                        {isLoadingDetails ? (
                                            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                                        ) : (
                                            <p className="font-medium text-sm">{formatPhoneNumber(patientInfo.home_phone || patientInfo.cell_phone)}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-muted border border-border shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <MapPin className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Location</p>
                                        {isLoadingDetails ? (
                                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                        ) : (
                                            <p className="font-medium text-sm">{patientInfo.city && patientInfo.state ?
                                                `${patientInfo.city}, ${patientInfo.state}` : 'Not provided'
                                            }</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-muted border border-border shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Shield className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Insurance</p>
                                        {isLoadingDetails ? (
                                            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                                        ) : (
                                            <p className="font-medium text-sm">{healthInsurance.insurance_type || 'Not provided'}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-muted border border-border shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Briefcase className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Employment</p>
                                        {isLoadingDetails ? (
                                            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                                        ) : (
                                            <p className="font-medium text-sm">{medicalHistory.currently_working === 'yes' ? 'Employed' : 
                                                medicalHistory.currently_working === 'no' ? 'Not working' : 'Not specified'}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
            {expanded && (
                <Card className="mt-4">
                    <CardContent className="p-6">
                                                {isLoadingDetails && (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-background rounded-full border border-border mb-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading detailed report...</h3>
                                <p className="text-sm text-muted-foreground">Fetching complete patient information</p>
                            </div>
                        )}

                        {detailsError && (
                            <div className="text-center py-12">
                                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-muted-foreground mb-2">Failed to load detailed report</h3>
                                <p className="text-sm text-muted-foreground mb-4">Please try refreshing the page or contact support</p>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => window.location.reload()}
                                    className="text-muted-foreground border-red-300 hover:bg-muted"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Retry
                                </Button>
                            </div>
                        )}

                        {!isLoadingDetails && !detailsError && (
                            <div className="space-y-6">
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                    <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-12">
                                        <TabsTrigger value="overview" className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Overview
                                        </TabsTrigger>
                                        <TabsTrigger value="patient-info" className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Patient Info
                                        </TabsTrigger>
                                        <TabsTrigger value="medical-history" className="flex items-center gap-2">
                                            <Activity className="w-4 h-4" />
                                            Medical History
                                        </TabsTrigger>
                                        <TabsTrigger value="pain-assessment" className="flex items-center gap-2">
                                            <Heart className="w-4 h-4" />
                                            Pain Assessment
                                        </TabsTrigger>
                                        <TabsTrigger value="insurance" className="flex items-center gap-2">
                                            <Shield className="w-4 h-4" />
                                            Insurance
                                        </TabsTrigger>
                                        <TabsTrigger value="lifestyle" className="flex items-center gap-2">
                                            <Briefcase className="w-4 h-4" />
                                            Lifestyle
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="overview" className="space-y-6">
                                        <Card className="border border-border bg-muted">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-foreground">
                                                    <User className="w-5 h-5" />
                                                    Patient Summary
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-medium text-sm text-muted-foreground mb-1">Personal Information</h4>
                                                            <div className="space-y-2 text-sm">
                                                                <p><strong>Full Name:</strong> {patientName}</p>
                                                                <p><strong>Date of Birth:</strong> {formatDate(patientInfo.date_of_birth)}</p>
                                                                <p><strong>Gender:</strong> {patientInfo.gender || 'N/A'}</p>
                                                                <p><strong>Marital Status:</strong> {patientInfo.marital_status || 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-sm text-muted-foreground mb-1">Contact Information</h4>
                                                            <div className="space-y-2 text-sm">
                                                                <p><strong>Phone:</strong> {formatPhoneNumber(patientInfo.home_phone || patientInfo.cell_phone)}</p>
                                                                <p><strong>Address:</strong> {patientInfo.address ?
                                                                    `${patientInfo.address}, ${patientInfo.city}, ${patientInfo.state} ${patientInfo.zip_code}` : 'N/A'
                                                                }</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        {patientInfo.emergency_contact_name && (
                                                            <div>
                                                                <h4 className="font-medium text-sm text-muted-foreground mb-1">Emergency Contact</h4>
                                                                <div className="space-y-2 text-sm">
                                                                    <p><strong>Name:</strong> {patientInfo.emergency_contact_name}</p>
                                                                    <p><strong>Relationship:</strong> {patientInfo.emergency_contact_relationship || 'N/A'}</p>
                                                                    <p><strong>Phone:</strong> {formatPhoneNumber(patientInfo.emergency_contact_phone)}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="border border-border bg-muted">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-foreground">
                                                    <AlertCircle className="w-5 h-5" />
                                                    Chief Complaint & Primary Concern
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div className="bg-background p-4 rounded-lg border border-border">
                                                        <p className="text-sm font-medium text-foreground">
                                                            {painDescription.main_complaints || painDescription.symptom_details || incident.description || "Patient reported pain and discomfort requiring assessment"}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <h4 className="font-medium text-sm text-muted-foreground mb-1">Incident Type</h4>
                                                            <Badge className={getIncidentColor()}>
                                                                {incident.incident_type?.replace('_', ' ').toUpperCase()}
                                                            </Badge>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-sm text-muted-foreground mb-1">Incident Date</h4>
                                                            <p className="text-sm">{formatDate(incident.incident_date)}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-sm text-muted-foreground mb-1">Report Status</h4>
                                                            <Badge variant="outline" className="border border-border bg-background text-primary">
                                                                {incident.status?.toUpperCase() || 'SUBMITTED'}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Card className="border border-border bg-muted">
                                                <CardHeader>
                                                    <CardTitle className="flex items-center gap-2 text-foreground">
                                                        <Activity className="w-5 h-5" />
                                                        Medical Status
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-3 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Pre-existing Conditions:</span>
                                                            <span className="font-medium">{medicalHistory.has_condition === 'yes' ? 'Yes' : 'No'}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Current Medications:</span>
                                                            <span className="font-medium">{medicalHistory.medication === 'yes' ? 'Yes' : 'No'}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Surgical History:</span>
                                                            <span className="font-medium">{medicalHistory.has_surgical_history === 'yes' ? 'Yes' : 'No'}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Employment Status:</span>
                                                            <span className="font-medium">{medicalHistory.currently_working === 'yes' ? 'Working' : 'Not Working'}</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="border border-border bg-muted">
                                                <CardHeader>
                                                    <CardTitle className="flex items-center gap-2 text-foreground">
                                                        <Heart className="w-5 h-5" />
                                                        Pain Overview
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-3">
                                                        {painAssessment.pain_level && painAssessment.pain_level.length > 0 && (
                                                            <div>
                                                                <h4 className="font-medium text-sm text-muted-foreground mb-2">Pain Levels</h4>
                                                                <div className="space-y-1">
                                                                    {painAssessment.pain_level.slice(0, 3).map((level, index) => {
                                                                        const [condition, rating] = level.split(':');
                                                                        const numRating = parseInt(rating);
                                                                        const colorClass = numRating >= 7 ? 'text-destructive' :
                                                                            numRating >= 4 ? 'text-amber-600' :
                                                                                'text-muted-foreground';
                                                                        return (
                                                                            <div key={index} className="flex justify-between items-center rounded border border-border bg-background p-2">
                                                                                <span className="text-sm text-muted-foreground">{condition}:</span>
                                                                                <span className={`text-sm font-medium ${colorClass}`}>{rating}/10</span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {painAssessment.pain_type && painAssessment.pain_type.length > 0 && (
                                                            <div>
                                                                <h4 className="font-medium text-sm text-muted-foreground mb-2">Pain Types</h4>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {painAssessment.pain_type.slice(0, 4).map((type, index) => (
                                                                        <Badge key={index} variant="outline" className="text-xs border border-border bg-background text-muted-foreground">
                                                                            {type}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="patient-info" className="space-y-6">
                                        <Card className="border border-border bg-muted">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-foreground">
                                                    <User className="w-5 h-5" />
                                                    Patient Information
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-medium text-sm text-muted-foreground mb-3">Personal Details</h4>
                                                            <div className="space-y-3 text-sm">
                                                                <div className="flex justify-between py-2 border-b border-border">
                                                                    <span className="text-muted-foreground font-medium">Full Name:</span>
                                                                    <span>{patientName}</span>
                                                                </div>
                                                                <div className="flex justify-between py-2 border-b border-border">
                                                                    <span className="text-muted-foreground font-medium">Date of Birth:</span>
                                                                    <span>{formatDate(patientInfo.date_of_birth)}</span>
                                                                </div>
                                                                <div className="flex justify-between py-2 border-b border-border">
                                                                    <span className="text-muted-foreground font-medium">Gender:</span>
                                                                    <span>{patientInfo.gender || 'N/A'}</span>
                                                                </div>
                                                                <div className="flex justify-between py-2 border-b border-border">
                                                                    <span className="text-muted-foreground font-medium">Race:</span>
                                                                    <span>{patientInfo.race || 'N/A'}</span>
                                                                </div>
                                                                <div className="flex justify-between py-2 border-b border-border">
                                                                    <span className="text-muted-foreground font-medium">Marital Status:</span>
                                                                    <span>{patientInfo.marital_status || 'N/A'}</span>
                                                                </div>
                                                                <div className="flex justify-between py-2 border-b border-border">
                                                                    <span className="text-muted-foreground font-medium">SSN:</span>
                                                                    <span>{patientInfo.ssn ? `***-**-${patientInfo.ssn.slice(-4)}` : 'N/A'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-medium text-sm text-muted-foreground mb-3">Contact Information</h4>
                                                            <div className="space-y-3 text-sm">
                                                                <div className="flex justify-between py-2 border-b border-border">
                                                                    <span className="text-muted-foreground font-medium">Home Phone:</span>
                                                                    <span>{formatPhoneNumber(patientInfo.home_phone)}</span>
                                                                </div>
                                                                <div className="flex justify-between py-2 border-b border-border">
                                                                    <span className="text-muted-foreground font-medium">Cell Phone:</span>
                                                                    <span>{formatPhoneNumber(patientInfo.cell_phone)}</span>
                                                                </div>
                                                                <div className="py-2 border-b border-border">
                                                                    <span className="text-muted-foreground font-medium">Address:</span>
                                                                    <div className="mt-1">
                                                                        <div>{patientInfo.address}</div>
                                                                        <div>{patientInfo.city}, {patientInfo.state} {patientInfo.zip_code}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {patientInfo.emergency_contact_name && (
                                            <Card className="border border-border bg-muted">
                                                <CardHeader>
                                                    <CardTitle className="flex items-center gap-2 text-foreground">
                                                        <AlertCircle className="w-5 h-5" />
                                                        Emergency Contact
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-3 text-sm">
                                                        <div className="flex justify-between py-2 border-b border-border">
                                                            <span className="text-muted-foreground font-medium">Name:</span>
                                                            <span>{patientInfo.emergency_contact_name}</span>
                                                        </div>
                                                        <div className="flex justify-between py-2 border-b border-border">
                                                            <span className="text-muted-foreground font-medium">Relationship:</span>
                                                            <span>{patientInfo.emergency_contact_relationship || 'N/A'}</span>
                                                        </div>
                                                        <div className="flex justify-between py-2 border-b border-border">
                                                            <span className="text-muted-foreground font-medium">Phone:</span>
                                                            <span>{formatPhoneNumber(patientInfo.emergency_contact_phone)}</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="medical-history" className="space-y-6">
                                        <Card className="border border-border bg-muted">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-foreground">
                                                    <Activity className="w-5 h-5" />
                                                    Medical History & Health Status
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-medium text-sm text-muted-foreground mb-3">Current Health Status</h4>
                                                            <div className="space-y-3 text-sm">
                                                                <div className="flex justify-between py-2 border-b border-border">
                                                                    <span className="text-muted-foreground font-medium">Pre-existing Conditions:</span>
                                                                    <Badge className={getResponseBadgeClass(medicalHistory.has_condition)}>
                                                                        {medicalHistory.has_condition === 'yes' ? 'Yes' : 'No'}
                                                                    </Badge>
                                                                </div>
                                                                {medicalHistory.condition_details && (
                                                                    <div className="bg-background p-3 rounded border border-border">
                                                                        <strong className="text-muted-foreground">Details:</strong>
                                                                        <div className="mt-1 text-muted-foreground">{medicalHistory.condition_details}</div>
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-between py-2 border-b border-border">
                                                                    <span className="text-muted-foreground font-medium">Current Medications:</span>
                                                                    <Badge className={getResponseBadgeClass(medicalHistory.medication)}>
                                                                        {medicalHistory.medication === 'yes' ? 'Yes' : 'No'}
                                                                    </Badge>
                                                                </div>
                                                                {medicalHistory.medication_names && (
                                                                    <div className="bg-background p-3 rounded border border-border">
                                                                        <strong className="text-foreground">Medications:</strong>
                                                                        <div className="mt-1 text-muted-foreground">{medicalHistory.medication_names}</div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-medium text-sm text-muted-foreground mb-3">Surgical & Pregnancy History</h4>
                                                            <div className="space-y-3 text-sm">
                                                                <div className="flex justify-between py-2 border-b border-border">
                                                                    <span className="text-muted-foreground font-medium">Surgical History:</span>
                                                                    <Badge className={getResponseBadgeClass(medicalHistory.has_surgical_history)}>
                                                                        {medicalHistory.has_surgical_history === 'yes' ? 'Yes' : 'No'}
                                                                    </Badge>
                                                                </div>
                                                                {medicalHistory.surgical_history_details && (
                                                                    <div className="bg-background p-3 rounded border border-border">
                                                                        <strong className="text-foreground">Surgical Details:</strong>
                                                                        <div className="mt-1 text-muted-foreground">{medicalHistory.surgical_history_details}</div>
                                                                    </div>
                                                                )}
                                                                {patientInfo.gender?.toLowerCase() === 'female' && (
                                                                    <>
                                                                        <div className="flex justify-between py-2 border-b border-border">
                                                                            <span className="text-muted-foreground font-medium">Currently Pregnant:</span>
                                                                            <Badge className={getResponseBadgeClass(medicalHistory.is_pregnant_now)}>
                                                                                {medicalHistory.is_pregnant_now === 'yes' ? 'Yes' : 'No'}
                                                                            </Badge>
                                                                        </div>
                                                                        {medicalHistory.weeks_pregnant && (
                                                                            <div className="flex justify-between py-2 border-b border-border">
                                                                                <span className="text-muted-foreground font-medium">Weeks Pregnant:</span>
                                                                                <span>{medicalHistory.weeks_pregnant}</span>
                                                                            </div>
                                                                        )}
                                                                        {medicalHistory.last_menstrual_period && (
                                                                            <div className="flex justify-between py-2 border-b border-border">
                                                                                <span className="text-muted-foreground font-medium">Last Menstrual Period:</span>
                                                                                <span>{formatDate(medicalHistory.last_menstrual_period)}</span>
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="border border-border bg-muted">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-foreground">
                                                    <Briefcase className="w-5 h-5" />
                                                    Employment Information
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-3 text-sm">
                                                        <div className="flex justify-between py-2 border-b border-border">
                                                            <span className="text-muted-foreground font-medium">Currently Working:</span>
                                                            <Badge className={getResponseBadgeClass(medicalHistory.currently_working)}>
                                                                {medicalHistory.currently_working === 'yes' ? 'Yes' : 'No'}
                                                            </Badge>
                                                        </div>
                                                        {medicalHistory.job_description && (
                                                            <div>
                                                                <span className="text-muted-foreground font-medium">Job Description:</span>
                                                                <div className="mt-1 p-2 bg-background rounded border border-border">{medicalHistory.job_description}</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-3 text-sm">
                                                        {medicalHistory.work_days_per_week && (
                                                            <div className="flex justify-between py-2 border-b border-border">
                                                                <span className="text-muted-foreground font-medium">Work Days/Week:</span>
                                                                <span>{medicalHistory.work_days_per_week}</span>
                                                            </div>
                                                        )}
                                                        {medicalHistory.work_hours_per_day && (
                                                            <div className="flex justify-between py-2 border-b border-border">
                                                                <span className="text-muted-foreground font-medium">Work Hours/Day:</span>
                                                                <span>{medicalHistory.work_hours_per_day}</span>
                                                            </div>
                                                        )}
                                                        {medicalHistory.work_times && (
                                                            <div>
                                                                <span className="text-muted-foreground font-medium">Work Schedule:</span>
                                                                <div className="mt-1 p-2 bg-background rounded border border-border">{medicalHistory.work_times}</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="pain-assessment" className="space-y-6">
                                        <Card className="border border-border bg-muted">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-foreground">
                                                    <Heart className="w-5 h-5" />
                                                    Pain Assessment & Impact
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-medium text-sm text-muted-foreground mb-3">Pain Characteristics</h4>
                                                            <div className="space-y-3 text-sm">
                                                                {painAssessment.pain_type && (
                                                                    <div className="flex justify-between py-2 border-b border-border">
                                                                        <span className="text-muted-foreground font-medium">Pain Type:</span>
                                                                        <div className="text-right">
                                                                            {Array.isArray(painAssessment.pain_type)
                                                                                ? painAssessment.pain_type.map(type => (
                                                                                    <Badge
                                                                                        key={type}
                                                                                        variant="outline"
                                                                                        className="ml-1 border border-border text-xs text-foreground"
                                                                                    >
                                                                                        {type}
                                                                                    </Badge>
                                                                                ))
                                                                                : (
                                                                                    <Badge
                                                                                        variant="outline"
                                                                                        className="border border-border text-xs text-foreground"
                                                                                    >
                                                                                        {painAssessment.pain_type}
                                                                                    </Badge>
                                                                                )
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {painAssessment.pain_scale && (
                                                                    <div className="flex justify-between py-2 border-b border-border">
                                                                        <span className="text-muted-foreground font-medium">Pain Scale:</span>
                                                                        <Badge
                                                                            variant="outline"
                                                                            className="text-base border border-border bg-background text-foreground px-3"
                                                                        >
                                                                            {painAssessment.pain_scale}/10
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                                {painAssessment.pain_frequency && (
                                                                    <div className="flex justify-between py-2 border-b border-border">
                                                                        <span className="text-muted-foreground font-medium">Frequency:</span>
                                                                        <Badge
                                                                            variant="outline"
                                                                            className="border border-border bg-background text-foreground"
                                                                        >
                                                                            {painAssessment.pain_frequency}
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                                {painAssessment.pain_location && (
                                                                    <div>
                                                                        <span className="text-muted-foreground font-medium">Pain Location:</span>
                                                                        <div className="mt-1 p-2 bg-background rounded border border-border">
                                                                            {Array.isArray(painAssessment.pain_location)
                                                                                ? painAssessment.pain_location.join(', ')
                                                                                : painAssessment.pain_location
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-medium text-sm text-muted-foreground mb-3">Pain Impact & Management</h4>
                                                            <div className="space-y-3 text-sm">
                                                                {painAssessment.pain_description && (
                                                                    <div>
                                                                        <span className="text-muted-foreground font-medium">Description:</span>
                                                                        <div className="mt-1 p-3 bg-background rounded border border-border">
                                                                            {painAssessment.pain_description}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {painAssessment.aggravating_factors && (
                                                                    <div>
                                                                        <span className="text-muted-foreground font-medium">Aggravating Factors:</span>
                                                                        <div className="mt-1 p-2 bg-background rounded border border-border text-muted-foreground">
                                                                            {painAssessment.aggravating_factors}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {painAssessment.relieving_factors && (
                                                                    <div>
                                                                        <span className="text-muted-foreground font-medium">Relieving Factors:</span>
                                                                        <div className="mt-1 p-2 bg-background rounded border border-border text-muted-foreground">
                                                                            {painAssessment.relieving_factors}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {painAssessment.previous_treatment && (
                                                                    <div>
                                                                        <span className="text-muted-foreground font-medium">Previous Treatment:</span>
                                                                        <div className="mt-1 p-2 bg-background rounded border border-border text-muted-foreground">
                                                                            {painAssessment.previous_treatment}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="insurance" className="space-y-6">
                                        <Card className="border border-border bg-muted">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-foreground">
                                                    <ClipboardCheck className="w-5 h-5" />
                                                    Insurance & Accident Details
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-medium text-sm text-muted-foreground mb-3">Insurance Coverage</h4>
                                                            <div className="space-y-3 text-sm">
                                                                {healthInsurance.insurance_type && (
                                                                    <div className="flex justify-between py-2 border-b border-border">
                                                                        <span className="text-muted-foreground font-medium">Insurance Type:</span>
                                                                        <Badge variant="outline" className="border border-border bg-background text-foreground">
                                                                            {healthInsurance.insurance_type}
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                                {healthInsurance.covered && (
                                                                    <div className="flex justify-between py-2 border-b border-border">
                                                                        <span className="text-muted-foreground font-medium">Coverage Status:</span>
                                                                        <Badge variant="outline" className="border border-border bg-background text-foreground">
                                                                            {healthInsurance.covered === 'yes' ? 'Covered' : 'Not Covered'}
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                                {healthInsurance.attorney_name && (
                                                                    <div className="flex justify-between py-2 border-b border-border">
                                                                        <span className="text-muted-foreground font-medium">Attorney:</span>
                                                                        <span>{healthInsurance.attorney_name}</span>
                                                                    </div>
                                                                )}
                                                                {healthInsurance.attorney_phone && (
                                                                    <div className="flex justify-between py-2 border-b border-border">
                                                                        <span className="text-muted-foreground font-medium">Attorney Phone:</span>
                                                                        <span className="font-mono text-sm">{healthInsurance.attorney_phone}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-medium text-sm text-muted-foreground mb-3">Accident Information</h4>
                                                            <div className="space-y-3 text-sm">
                                                                {healthInsurance.accident_date && (
                                                                    <div className="flex justify-between py-2 border-b border-border">
                                                                        <span className="text-muted-foreground font-medium">Accident Date:</span>
                                                                        <span>{formatDate(healthInsurance.accident_date)}</span>
                                                                    </div>
                                                                )}
                                                                {healthInsurance.lost_work_yes_no && (
                                                                    <div className="flex justify-between py-2 border-b border-border">
                                                                        <span className="text-muted-foreground font-medium">Lost Work:</span>
                                                                        <Badge variant="outline" className="border border-border bg-background text-foreground">
                                                                            {healthInsurance.lost_work_yes_no === 'yes' ? 'Yes' : 'No'}
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                                {healthInsurance.lost_work_dates && (
                                                                    <div className="flex justify-between py-2 border-b border-border">
                                                                        <span className="text-muted-foreground font-medium">Work Loss Dates:</span>
                                                                        <span className="text-sm">{healthInsurance.lost_work_dates}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {healthInsurance.accident_description && (
                                                    <div className="mt-6 p-4 bg-background rounded-lg border border-border">
                                                        <h4 className="font-medium text-muted-foreground mb-2">Accident Description</h4>
                                                        <div className="text-sm text-muted-foreground">{healthInsurance.accident_description}</div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="lifestyle" className="space-y-6">
                                        <Card className="border border-border bg-muted">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-foreground">
                                                    <Activity className="w-5 h-5" />
                                                    Lifestyle Impact & Habits
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-medium text-sm text-muted-foreground mb-3">Work & Stress</h4>
                                                            <div className="space-y-3 text-sm">
                                                                {lifestyleImpact.work_type && (
                                                                    <div className="flex justify-between py-2 border-b border-border">
                                                                        <span className="text-muted-foreground font-medium">Work Type:</span>
                                                                        <Badge variant="outline" className="border border-border bg-background text-foreground">
                                                                            {lifestyleImpact.work_type}
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                                {lifestyleImpact.work_stress && (
                                                                    <div className="flex justify-between py-2 border-b border-border">
                                                                        <span className="text-muted-foreground font-medium">Work Stress Level:</span>
                                                                        <Badge variant="outline" className="border border-border bg-background text-foreground">
                                                                            {lifestyleImpact.work_stress}
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                                {lifestyleImpact.exercise && (
                                                                    <div className="flex justify-between py-2 border-b border-border">
                                                                        <span className="text-muted-foreground font-medium">Exercise:</span>
                                                                        <Badge variant="outline" className="border border-border bg-background text-foreground">
                                                                            {lifestyleImpact.exercise}
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                                {lifestyleImpact.exercise_details && (
                                                                    <div>
                                                                        <span className="text-muted-foreground font-medium">Exercise Details:</span>
                                                                        <div className="mt-1 p-2 bg-background rounded border border-border">
                                                                            {lifestyleImpact.exercise_details}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-medium text-sm text-muted-foreground mb-3">Health Habits</h4>
                                                            <div className="space-y-3 text-sm">
                                                                {lifestyleImpact.smoking && (
                                                                    <div className="flex justify-between py-2 border-b border-border">
                                                                        <span className="text-muted-foreground font-medium">Smoking Status:</span>
                                                                        <Badge variant="outline" className="border border-border bg-background text-foreground">
                                                                            {lifestyleImpact.smoking}
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                                {lifestyleImpact.smoking_details && (
                                                                    <div>
                                                                        <span className="text-muted-foreground font-medium">Smoking Details:</span>
                                                                        <div className="mt-1 p-2 bg-background rounded border border-border text-muted-foreground">
                                                                            {lifestyleImpact.smoking_details}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {lifestyleImpact.drinking && (
                                                                    <div className="flex justify-between py-2 border-b border-border">
                                                                        <span className="text-muted-foreground font-medium">Alcohol Use:</span>
                                                                        <Badge variant="outline" className="border border-border bg-background text-foreground">
                                                                            {lifestyleImpact.drinking}
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                                {lifestyleImpact.drinking_details && (
                                                                    <div>
                                                                        <span className="text-muted-foreground font-medium">Drinking Details:</span>
                                                                        <div className="mt-1 p-2 bg-background rounded border border-border text-muted-foreground">
                                                                            {lifestyleImpact.drinking_details}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {lifestyleImpact.sleep_quality && (
                                                                    <div className="flex justify-between py-2 border-b border-border">
                                                                        <span className="text-muted-foreground font-medium">Sleep Quality:</span>
                                                                        <Badge variant="outline" className="border border-border bg-background text-foreground">
                                                                            {lifestyleImpact.sleep_quality}
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default InitialReportDisplay;
