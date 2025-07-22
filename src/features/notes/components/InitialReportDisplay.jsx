import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Eye,
    ChevronDown,
    ChevronRight,
    User,
    MapPin,
    Shield,
    Briefcase,
    CheckCircle,
    Calendar,
    FileText,
    AlertCircle,
    Activity,
    Heart,
    Car,
    FileCheck,
    ClipboardCheck,
} from "lucide-react";
import { useGetIncidentByIdQuery } from "@/api";

const InitialReportDisplay = ({ incident: basicIncident }) => {
    const [expanded, setExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    // Fetch detailed incident data when expanded
    const {
        data: detailedIncidentData,
        isLoading: isLoadingDetails,
        error: detailsError
    } = useGetIncidentByIdQuery(basicIncident?.id, {
        skip: !basicIncident?.id || !expanded
    });

    if (!basicIncident) return null;

    // Use detailed data if available, otherwise use basic data
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

    const Icon = getIncidentIcon(incident.incident_type);
    const patientName = `${patientInfo.first_name || ''} ${patientInfo.last_name || ''}`.trim() || 'Unknown Patient';

    return (
        <div className="space-y-4">
            {/* Enhanced Header Card */}
            <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-xl ${getIncidentColor(incident.incident_type).replace('text-', 'text-').replace('bg-', 'bg-')}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">{patientName}</h2>
                                    <p className="text-lg font-semibold text-primary">Initial Patient Report</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Badge className={`${getIncidentColor(incident.incident_type)} border`}>
                                        <Icon className="w-3 h-3 mr-1" />
                                        {incident.incident_type?.replace('_', ' ').toUpperCase()}
                                    </Badge>
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        {incident.status?.toUpperCase() || 'SUBMITTED'}
                                    </Badge>
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {formatDate(incident.incident_date)}
                                    </Badge>
                                    {incident.forms && incident.forms.length > 0 && (
                                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
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

                {/* Quick Overview Cards - Always Visible */}
                <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="bg-white/50 border-0 shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-100">
                                        <User className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Contact</p>
                                        <p className="font-medium text-sm">{formatPhoneNumber(patientInfo.home_phone || patientInfo.cell_phone)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/50 border-0 shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-green-100">
                                        <MapPin className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Location</p>
                                        <p className="font-medium text-sm">{patientInfo.city && patientInfo.state ?
                                            `${patientInfo.city}, ${patientInfo.state}` : 'N/A'
                                        }</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/50 border-0 shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-100">
                                        <Shield className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Insurance</p>
                                        <p className="font-medium text-sm">{healthInsurance.insurance_type || 'Not provided'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/50 border-0 shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-orange-100">
                                        <Briefcase className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Employment</p>
                                        <p className="font-medium text-sm">{medicalHistory.currently_working === 'yes' ? 'Employed' : 'Not working'}</p>
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
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                <p className="text-lg font-semibold text-muted-foreground">Loading detailed report...</p>
                                <p className="text-sm text-muted-foreground">Please wait while we fetch the complete patient information</p>
                            </div>
                        )}

                        {detailsError && (
                            <div className="text-center py-12">
                                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-red-600 mb-2">Failed to load detailed report</h3>
                                <p className="text-sm text-muted-foreground">Please try refreshing the page or contact support</p>
                            </div>
                        )}

                        {!isLoadingDetails && !detailsError && (
                            <div className="space-y-6">
                                {/* Enhanced Tab Navigation for Each Form Section */}
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

                                    {/* Overview Tab - Quick Summary */}
                                    <TabsContent value="overview" className="space-y-6">
                                        {/* Patient Summary Card */}
                                        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-blue-800">
                                                    <User className="w-5 h-5" />
                                                    Patient Summary
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-medium text-sm text-blue-700 mb-1">Personal Information</h4>
                                                            <div className="space-y-2 text-sm">
                                                                <p><strong>Full Name:</strong> {patientName}</p>
                                                                <p><strong>Date of Birth:</strong> {formatDate(patientInfo.date_of_birth)}</p>
                                                                <p><strong>Gender:</strong> {patientInfo.gender || 'N/A'}</p>
                                                                <p><strong>Marital Status:</strong> {patientInfo.marital_status || 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-sm text-blue-700 mb-1">Contact Information</h4>
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
                                                                <h4 className="font-medium text-sm text-blue-700 mb-1">Emergency Contact</h4>
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

                                        {/* Chief Complaint Card */}
                                        <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-red-800">
                                                    <AlertCircle className="w-5 h-5" />
                                                    Chief Complaint & Primary Concern
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div className="bg-white/70 p-4 rounded-lg border border-red-100">
                                                        <p className="text-sm font-medium text-red-900">
                                                            {painDescription.main_complaints || painDescription.symptom_details || incident.description || "Patient reported pain and discomfort requiring assessment"}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <h4 className="font-medium text-sm text-red-700 mb-1">Incident Type</h4>
                                                            <Badge className={`${getIncidentColor(incident.incident_type)}`}>
                                                                {incident.incident_type?.replace('_', ' ').toUpperCase()}
                                                            </Badge>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-sm text-red-700 mb-1">Incident Date</h4>
                                                            <p className="text-sm">{formatDate(incident.incident_date)}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-sm text-red-700 mb-1">Report Status</h4>
                                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                                {incident.status?.toUpperCase() || 'SUBMITTED'}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Quick Medical Summary */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                                                <CardHeader>
                                                    <CardTitle className="flex items-center gap-2 text-green-800">
                                                        <Activity className="w-5 h-5" />
                                                        Medical Status
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-3 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-green-700">Pre-existing Conditions:</span>
                                                            <span className="font-medium">{medicalHistory.has_condition === 'yes' ? 'Yes' : 'No'}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-green-700">Current Medications:</span>
                                                            <span className="font-medium">{medicalHistory.medication === 'yes' ? 'Yes' : 'No'}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-green-700">Surgical History:</span>
                                                            <span className="font-medium">{medicalHistory.has_surgical_history === 'yes' ? 'Yes' : 'No'}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-green-700">Employment Status:</span>
                                                            <span className="font-medium">{medicalHistory.currently_working === 'yes' ? 'Working' : 'Not Working'}</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
                                                <CardHeader>
                                                    <CardTitle className="flex items-center gap-2 text-purple-800">
                                                        <Heart className="w-5 h-5" />
                                                        Pain Overview
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-3">
                                                        {painAssessment.pain_level && painAssessment.pain_level.length > 0 && (
                                                            <div>
                                                                <h4 className="font-medium text-sm text-purple-700 mb-2">Pain Levels</h4>
                                                                <div className="space-y-1">
                                                                    {painAssessment.pain_level.slice(0, 3).map((level, index) => {
                                                                        const [condition, rating] = level.split(':');
                                                                        const numRating = parseInt(rating);
                                                                        const colorClass = numRating >= 7 ? 'bg-red-100 text-red-800' :
                                                                            numRating >= 4 ? 'bg-yellow-100 text-yellow-800' :
                                                                                'bg-green-100 text-green-800';
                                                                        return (
                                                                            <div key={index} className="flex justify-between items-center">
                                                                                <span className="text-sm text-purple-700">{condition}:</span>
                                                                                <Badge className={`${colorClass} text-xs`}>
                                                                                    {rating}/10
                                                                                </Badge>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {painAssessment.pain_type && painAssessment.pain_type.length > 0 && (
                                                            <div>
                                                                <h4 className="font-medium text-sm text-purple-700 mb-2">Pain Types</h4>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {painAssessment.pain_type.slice(0, 4).map((type, index) => (
                                                                        <Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
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

                                    {/* Patient Info Tab - Dedicated Patient Information */}
                                    <TabsContent value="patient-info" className="space-y-6">
                                        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-blue-800">
                                                    <User className="w-5 h-5" />
                                                    Patient Information
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-medium text-sm text-blue-700 mb-3">Personal Details</h4>
                                                            <div className="space-y-3 text-sm">
                                                                <div className="flex justify-between py-2 border-b border-blue-100">
                                                                    <span className="text-blue-600 font-medium">Full Name:</span>
                                                                    <span>{patientName}</span>
                                                                </div>
                                                                <div className="flex justify-between py-2 border-b border-blue-100">
                                                                    <span className="text-blue-600 font-medium">Date of Birth:</span>
                                                                    <span>{formatDate(patientInfo.date_of_birth)}</span>
                                                                </div>
                                                                <div className="flex justify-between py-2 border-b border-blue-100">
                                                                    <span className="text-blue-600 font-medium">Gender:</span>
                                                                    <span>{patientInfo.gender || 'N/A'}</span>
                                                                </div>
                                                                <div className="flex justify-between py-2 border-b border-blue-100">
                                                                    <span className="text-blue-600 font-medium">Race:</span>
                                                                    <span>{patientInfo.race || 'N/A'}</span>
                                                                </div>
                                                                <div className="flex justify-between py-2 border-b border-blue-100">
                                                                    <span className="text-blue-600 font-medium">Marital Status:</span>
                                                                    <span>{patientInfo.marital_status || 'N/A'}</span>
                                                                </div>
                                                                <div className="flex justify-between py-2 border-b border-blue-100">
                                                                    <span className="text-blue-600 font-medium">SSN:</span>
                                                                    <span>{patientInfo.ssn ? `***-**-${patientInfo.ssn.slice(-4)}` : 'N/A'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-medium text-sm text-blue-700 mb-3">Contact Information</h4>
                                                            <div className="space-y-3 text-sm">
                                                                <div className="flex justify-between py-2 border-b border-blue-100">
                                                                    <span className="text-blue-600 font-medium">Home Phone:</span>
                                                                    <span>{formatPhoneNumber(patientInfo.home_phone)}</span>
                                                                </div>
                                                                <div className="flex justify-between py-2 border-b border-blue-100">
                                                                    <span className="text-blue-600 font-medium">Cell Phone:</span>
                                                                    <span>{formatPhoneNumber(patientInfo.cell_phone)}</span>
                                                                </div>
                                                                <div className="py-2 border-b border-blue-100">
                                                                    <span className="text-blue-600 font-medium">Address:</span>
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

                                        {/* Emergency Contact */}
                                        {patientInfo.emergency_contact_name && (
                                            <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
                                                <CardHeader>
                                                    <CardTitle className="flex items-center gap-2 text-orange-800">
                                                        <AlertCircle className="w-5 h-5" />
                                                        Emergency Contact
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-3 text-sm">
                                                        <div className="flex justify-between py-2 border-b border-orange-100">
                                                            <span className="text-orange-600 font-medium">Name:</span>
                                                            <span>{patientInfo.emergency_contact_name}</span>
                                                        </div>
                                                        <div className="flex justify-between py-2 border-b border-orange-100">
                                                            <span className="text-orange-600 font-medium">Relationship:</span>
                                                            <span>{patientInfo.emergency_contact_relationship || 'N/A'}</span>
                                                        </div>
                                                        <div className="flex justify-between py-2 border-b border-orange-100">
                                                            <span className="text-orange-600 font-medium">Phone:</span>
                                                            <span>{formatPhoneNumber(patientInfo.emergency_contact_phone)}</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </TabsContent>

                                    {/* Medical History Tab */}
                                    <TabsContent value="medical-history" className="space-y-6">
                                        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-green-800">
                                                    <Activity className="w-5 h-5" />
                                                    Medical History & Health Status
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-medium text-sm text-green-700 mb-3">Current Health Status</h4>
                                                            <div className="space-y-3 text-sm">
                                                                <div className="flex justify-between py-2 border-b border-green-100">
                                                                    <span className="text-green-600 font-medium">Pre-existing Conditions:</span>
                                                                    <Badge className={medicalHistory.has_condition === 'yes' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                                                                        {medicalHistory.has_condition === 'yes' ? 'Yes' : 'No'}
                                                                    </Badge>
                                                                </div>
                                                                {medicalHistory.condition_details && (
                                                                    <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                                                                        <strong className="text-yellow-800">Details:</strong>
                                                                        <div className="mt-1 text-yellow-700">{medicalHistory.condition_details}</div>
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-between py-2 border-b border-green-100">
                                                                    <span className="text-green-600 font-medium">Current Medications:</span>
                                                                    <Badge className={medicalHistory.medication === 'yes' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                                                                        {medicalHistory.medication === 'yes' ? 'Yes' : 'No'}
                                                                    </Badge>
                                                                </div>
                                                                {medicalHistory.medication_names && (
                                                                    <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                                                                        <strong className="text-blue-800">Medications:</strong>
                                                                        <div className="mt-1 text-blue-700">{medicalHistory.medication_names}</div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-medium text-sm text-green-700 mb-3">Surgical & Pregnancy History</h4>
                                                            <div className="space-y-3 text-sm">
                                                                <div className="flex justify-between py-2 border-b border-green-100">
                                                                    <span className="text-green-600 font-medium">Surgical History:</span>
                                                                    <Badge className={medicalHistory.has_surgical_history === 'yes' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}>
                                                                        {medicalHistory.has_surgical_history === 'yes' ? 'Yes' : 'No'}
                                                                    </Badge>
                                                                </div>
                                                                {medicalHistory.surgical_history_details && (
                                                                    <div className="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                                                                        <strong className="text-orange-800">Surgical Details:</strong>
                                                                        <div className="mt-1 text-orange-700">{medicalHistory.surgical_history_details}</div>
                                                                    </div>
                                                                )}
                                                                {patientInfo.gender?.toLowerCase() === 'female' && (
                                                                    <>
                                                                        <div className="flex justify-between py-2 border-b border-green-100">
                                                                            <span className="text-green-600 font-medium">Currently Pregnant:</span>
                                                                            <Badge className={medicalHistory.is_pregnant_now === 'yes' ? 'bg-pink-100 text-pink-800' : 'bg-green-100 text-green-800'}>
                                                                                {medicalHistory.is_pregnant_now === 'yes' ? 'Yes' : 'No'}
                                                                            </Badge>
                                                                        </div>
                                                                        {medicalHistory.weeks_pregnant && (
                                                                            <div className="flex justify-between py-2 border-b border-green-100">
                                                                                <span className="text-green-600 font-medium">Weeks Pregnant:</span>
                                                                                <span>{medicalHistory.weeks_pregnant}</span>
                                                                            </div>
                                                                        )}
                                                                        {medicalHistory.last_menstrual_period && (
                                                                            <div className="flex justify-between py-2 border-b border-green-100">
                                                                                <span className="text-green-600 font-medium">Last Menstrual Period:</span>
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

                                        {/* Employment Information */}
                                        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-indigo-800">
                                                    <Briefcase className="w-5 h-5" />
                                                    Employment Information
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-3 text-sm">
                                                        <div className="flex justify-between py-2 border-b border-indigo-100">
                                                            <span className="text-indigo-600 font-medium">Currently Working:</span>
                                                            <Badge className={medicalHistory.currently_working === 'yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                                                {medicalHistory.currently_working === 'yes' ? 'Yes' : 'No'}
                                                            </Badge>
                                                        </div>
                                                        {medicalHistory.job_description && (
                                                            <div>
                                                                <span className="text-indigo-600 font-medium">Job Description:</span>
                                                                <div className="mt-1 p-2 bg-indigo-50 rounded">{medicalHistory.job_description}</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-3 text-sm">
                                                        {medicalHistory.work_days_per_week && (
                                                            <div className="flex justify-between py-2 border-b border-indigo-100">
                                                                <span className="text-indigo-600 font-medium">Work Days/Week:</span>
                                                                <span>{medicalHistory.work_days_per_week}</span>
                                                            </div>
                                                        )}
                                                        {medicalHistory.work_hours_per_day && (
                                                            <div className="flex justify-between py-2 border-b border-indigo-100">
                                                                <span className="text-indigo-600 font-medium">Work Hours/Day:</span>
                                                                <span>{medicalHistory.work_hours_per_day}</span>
                                                            </div>
                                                        )}
                                                        {medicalHistory.work_times && (
                                                            <div>
                                                                <span className="text-indigo-600 font-medium">Work Schedule:</span>
                                                                <div className="mt-1 p-2 bg-indigo-50 rounded">{medicalHistory.work_times}</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {/* Pain Assessment Tab */}
                                    {/* Pain Assessment Tab */}
                                    <TabsContent value="pain-assessment" className="space-y-6">
                                        <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-red-800">
                                                    <Heart className="w-5 h-5" />
                                                    Pain Assessment & Impact
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-medium text-sm text-red-700 mb-3">Pain Characteristics</h4>
                                                            <div className="space-y-3 text-sm">
                                                                {painAssessment.pain_type && (
                                                                    <div className="flex justify-between py-2 border-b border-red-100">
                                                                        <span className="text-red-600 font-medium">Pain Type:</span>
                                                                        <div className="text-right">
                                                                            {Array.isArray(painAssessment.pain_type)
                                                                                ? painAssessment.pain_type.map(type => (
                                                                                    <Badge key={type} className="ml-1 bg-red-100 text-red-800">{type}</Badge>
                                                                                ))
                                                                                : <Badge className="bg-red-100 text-red-800">{painAssessment.pain_type}</Badge>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {painAssessment.pain_scale && (
                                                                    <div className="flex justify-between py-2 border-b border-red-100">
                                                                        <span className="text-red-600 font-medium">Pain Scale:</span>
                                                                        <Badge className="bg-red-200 text-red-900 text-base px-3">{painAssessment.pain_scale}/10</Badge>
                                                                    </div>
                                                                )}
                                                                {painAssessment.pain_frequency && (
                                                                    <div className="flex justify-between py-2 border-b border-red-100">
                                                                        <span className="text-red-600 font-medium">Frequency:</span>
                                                                        <Badge className="bg-orange-100 text-orange-800">{painAssessment.pain_frequency}</Badge>
                                                                    </div>
                                                                )}
                                                                {painAssessment.pain_location && (
                                                                    <div>
                                                                        <span className="text-red-600 font-medium">Pain Location:</span>
                                                                        <div className="mt-1 p-2 bg-red-50 rounded border-l-4 border-red-400">
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
                                                            <h4 className="font-medium text-sm text-red-700 mb-3">Pain Impact & Management</h4>
                                                            <div className="space-y-3 text-sm">
                                                                {painAssessment.pain_description && (
                                                                    <div>
                                                                        <span className="text-red-600 font-medium">Description:</span>
                                                                        <div className="mt-1 p-3 bg-red-50 rounded border-l-4 border-red-400">
                                                                            {painAssessment.pain_description}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {painAssessment.aggravating_factors && (
                                                                    <div>
                                                                        <span className="text-red-600 font-medium">Aggravating Factors:</span>
                                                                        <div className="mt-1 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400 text-yellow-800">
                                                                            {painAssessment.aggravating_factors}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {painAssessment.relieving_factors && (
                                                                    <div>
                                                                        <span className="text-red-600 font-medium">Relieving Factors:</span>
                                                                        <div className="mt-1 p-2 bg-green-50 rounded border-l-4 border-green-400 text-green-800">
                                                                            {painAssessment.relieving_factors}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {painAssessment.previous_treatment && (
                                                                    <div>
                                                                        <span className="text-red-600 font-medium">Previous Treatment:</span>
                                                                        <div className="mt-1 p-2 bg-blue-50 rounded border-l-4 border-blue-400 text-blue-800">
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

                                    {/* Insurance Tab */}
                                    <TabsContent value="insurance" className="space-y-6">
                                        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-blue-800">
                                                    <ClipboardCheck className="w-5 h-5" />
                                                    Insurance & Accident Details
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-medium text-sm text-blue-700 mb-3">Insurance Coverage</h4>
                                                            <div className="space-y-3 text-sm">
                                                                {healthInsurance.insurance_type && (
                                                                    <div className="flex justify-between py-2 border-b border-blue-100">
                                                                        <span className="text-blue-600 font-medium">Insurance Type:</span>
                                                                        <Badge className="bg-blue-100 text-blue-800">
                                                                            {healthInsurance.insurance_type}
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                                {healthInsurance.covered && (
                                                                    <div className="flex justify-between py-2 border-b border-blue-100">
                                                                        <span className="text-blue-600 font-medium">Coverage Status:</span>
                                                                        <Badge className={healthInsurance.covered === 'yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                                                            {healthInsurance.covered === 'yes' ? 'Covered' : 'Not Covered'}
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                                {healthInsurance.attorney_name && (
                                                                    <div className="flex justify-between py-2 border-b border-blue-100">
                                                                        <span className="text-blue-600 font-medium">Attorney:</span>
                                                                        <span>{healthInsurance.attorney_name}</span>
                                                                    </div>
                                                                )}
                                                                {healthInsurance.attorney_phone && (
                                                                    <div className="flex justify-between py-2 border-b border-blue-100">
                                                                        <span className="text-blue-600 font-medium">Attorney Phone:</span>
                                                                        <span className="font-mono text-sm">{healthInsurance.attorney_phone}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-medium text-sm text-blue-700 mb-3">Accident Information</h4>
                                                            <div className="space-y-3 text-sm">
                                                                {healthInsurance.accident_date && (
                                                                    <div className="flex justify-between py-2 border-b border-blue-100">
                                                                        <span className="text-blue-600 font-medium">Accident Date:</span>
                                                                        <span>{formatDate(healthInsurance.accident_date)}</span>
                                                                    </div>
                                                                )}
                                                                {healthInsurance.lost_work_yes_no && (
                                                                    <div className="flex justify-between py-2 border-b border-blue-100">
                                                                        <span className="text-blue-600 font-medium">Lost Work:</span>
                                                                        <Badge className={healthInsurance.lost_work_yes_no === 'yes' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                                                                            {healthInsurance.lost_work_yes_no === 'yes' ? 'Yes' : 'No'}
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                                {healthInsurance.lost_work_dates && (
                                                                    <div className="flex justify-between py-2 border-b border-blue-100">
                                                                        <span className="text-blue-600 font-medium">Work Loss Dates:</span>
                                                                        <span className="text-sm">{healthInsurance.lost_work_dates}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {healthInsurance.accident_description && (
                                                    <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                                                        <h4 className="font-medium text-yellow-800 mb-2">Accident Description</h4>
                                                        <div className="text-sm text-yellow-700">{healthInsurance.accident_description}</div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {/* Lifestyle Tab */}
                                    <TabsContent value="lifestyle" className="space-y-6">
                                        <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-green-800">
                                                    <Activity className="w-5 h-5" />
                                                    Lifestyle Impact & Habits
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-medium text-sm text-green-700 mb-3">Work & Stress</h4>
                                                            <div className="space-y-3 text-sm">
                                                                {lifestyleImpact.work_type && (
                                                                    <div className="flex justify-between py-2 border-b border-green-100">
                                                                        <span className="text-green-600 font-medium">Work Type:</span>
                                                                        <Badge className="bg-blue-100 text-blue-800">
                                                                            {lifestyleImpact.work_type}
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                                {lifestyleImpact.work_stress && (
                                                                    <div className="flex justify-between py-2 border-b border-green-100">
                                                                        <span className="text-green-600 font-medium">Work Stress Level:</span>
                                                                        <Badge className={
                                                                            lifestyleImpact.work_stress?.toLowerCase().includes('high') ? 'bg-red-100 text-red-800' :
                                                                                lifestyleImpact.work_stress?.toLowerCase().includes('medium') ? 'bg-yellow-100 text-yellow-800' :
                                                                                    'bg-green-100 text-green-800'
                                                                        }>
                                                                            {lifestyleImpact.work_stress}
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                                {lifestyleImpact.exercise && (
                                                                    <div className="flex justify-between py-2 border-b border-green-100">
                                                                        <span className="text-green-600 font-medium">Exercise:</span>
                                                                        <Badge className="bg-purple-100 text-purple-800">
                                                                            {lifestyleImpact.exercise}
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                                {lifestyleImpact.exercise_details && (
                                                                    <div>
                                                                        <span className="text-green-600 font-medium">Exercise Details:</span>
                                                                        <div className="mt-1 p-2 bg-green-50 rounded border-l-4 border-green-400">
                                                                            {lifestyleImpact.exercise_details}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-medium text-sm text-green-700 mb-3">Health Habits</h4>
                                                            <div className="space-y-3 text-sm">
                                                                {lifestyleImpact.smoking && (
                                                                    <div className="flex justify-between py-2 border-b border-green-100">
                                                                        <span className="text-green-600 font-medium">Smoking Status:</span>
                                                                        <Badge className={
                                                                            lifestyleImpact.smoking?.toLowerCase().includes('yes') || lifestyleImpact.smoking?.toLowerCase().includes('current') ? 'bg-red-100 text-red-800' :
                                                                                lifestyleImpact.smoking?.toLowerCase().includes('former') ? 'bg-yellow-100 text-yellow-800' :
                                                                                    'bg-green-100 text-green-800'
                                                                        }>
                                                                            {lifestyleImpact.smoking}
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                                {lifestyleImpact.smoking_details && (
                                                                    <div>
                                                                        <span className="text-green-600 font-medium">Smoking Details:</span>
                                                                        <div className="mt-1 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400 text-yellow-800">
                                                                            {lifestyleImpact.smoking_details}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {lifestyleImpact.drinking && (
                                                                    <div className="flex justify-between py-2 border-b border-green-100">
                                                                        <span className="text-green-600 font-medium">Alcohol Use:</span>
                                                                        <Badge className="bg-orange-100 text-orange-800">
                                                                            {lifestyleImpact.drinking}
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                                {lifestyleImpact.drinking_details && (
                                                                    <div>
                                                                        <span className="text-green-600 font-medium">Drinking Details:</span>
                                                                        <div className="mt-1 p-2 bg-orange-50 rounded border-l-4 border-orange-400 text-orange-800">
                                                                            {lifestyleImpact.drinking_details}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {lifestyleImpact.sleep_quality && (
                                                                    <div className="flex justify-between py-2 border-b border-green-100">
                                                                        <span className="text-green-600 font-medium">Sleep Quality:</span>
                                                                        <Badge className={
                                                                            lifestyleImpact.sleep_quality?.toLowerCase().includes('poor') ? 'bg-red-100 text-red-800' :
                                                                                lifestyleImpact.sleep_quality?.toLowerCase().includes('fair') ? 'bg-yellow-100 text-yellow-800' :
                                                                                    'bg-green-100 text-green-800'
                                                                        }>
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
