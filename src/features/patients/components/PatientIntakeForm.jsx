import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import FormattedInput from '../../components/forms/FormattedInput';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
    User,
    Heart,
    Shield,
    FileText,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Save,
    AlertCircle,
    CheckCircle,
    Plus,
    X
} from 'lucide-react';

export default function PatientIntakeForm({ onSubmit, onCancel, initialData = {} }) {
    const [activeTab, setActiveTab] = useState("personal");
    const [formData, setFormData] = useState({
        // Personal Information
        firstName: initialData.firstName || "",
        middleName: initialData.middleName || "",
        lastName: initialData.lastName || "",
        dateOfBirth: initialData.dateOfBirth || "",
        age: initialData.age || "",
        gender: initialData.gender || "",
        ssn: initialData.ssn || "",
        maritalStatus: initialData.maritalStatus || "",
        
        // Contact Information
        phone: initialData.phone || "",
        email: initialData.email || "",
        address: initialData.address || "",
        city: initialData.city || "",
        state: initialData.state || "",
        zipCode: initialData.zipCode || "",
        
        // Emergency Contact
        emergencyContactName: initialData.emergencyContactName || "",
        emergencyContactRelationship: initialData.emergencyContactRelationship || "",
        emergencyContactPhone: initialData.emergencyContactPhone || "",
        
        // Employment Information
        employer: initialData.employer || "",
        occupation: initialData.occupation || "",
        workAddress: initialData.workAddress || "",
        workPhone: initialData.workPhone || "",
        
        // Insurance Information
        insuranceProvider: initialData.insuranceProvider || "",
        policyNumber: initialData.policyNumber || "",
        groupNumber: initialData.groupNumber || "",
        copay: initialData.copay || "",
        
        // Medical History
        allergies: initialData.allergies || "",
        currentMedications: initialData.currentMedications || "",
        previousSurgeries: initialData.previousSurgeries || "",
        chronicConditions: initialData.chronicConditions || "",
        familyHistory: initialData.familyHistory || "",
        
        // Current Health
        primaryCondition: initialData.primaryCondition || "",
        secondaryConditions: initialData.secondaryConditions || [],
        currentSymptoms: initialData.currentSymptoms || "",
        painLevel: initialData.painLevel || "",
        functionalLimitations: initialData.functionalLimitations || "",
        
        // Lifestyle Information
        smokingStatus: initialData.smokingStatus || "",
        alcoholConsumption: initialData.alcoholConsumption || "",
        exerciseLevel: initialData.exerciseLevel || "",
        
        // Vitals
        height: initialData.height || "",
        weight: initialData.weight || "",
        bloodPressure: initialData.bloodPressure || "",
        heartRate: initialData.heartRate || "",
        temperature: initialData.temperature || ""
    });

    const [errors, setErrors] = useState({});

    const updateFormData = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when field is updated
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const addSecondaryCondition = (condition) => {
        if (condition && !formData.secondaryConditions.includes(condition)) {
            updateFormData('secondaryConditions', [...formData.secondaryConditions, condition]);
        }
    };

    const removeSecondaryCondition = (condition) => {
        updateFormData('secondaryConditions', 
            formData.secondaryConditions.filter(c => c !== condition)
        );
    };

    const validateTab = (tabName) => {
        const newErrors = {};
        
        switch (tabName) {
            case 'personal':
                if (!formData.firstName) newErrors.firstName = 'First name is required';
                if (!formData.lastName) newErrors.lastName = 'Last name is required';
                if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
                if (!formData.gender) newErrors.gender = 'Gender is required';
                break;
            case 'contact':
                if (!formData.phone) newErrors.phone = 'Phone number is required';
                if (!formData.email) newErrors.email = 'Email is required';
                if (!formData.address) newErrors.address = 'Address is required';
                break;
            case 'emergency':
                if (!formData.emergencyContactName) newErrors.emergencyContactName = 'Emergency contact name is required';
                if (!formData.emergencyContactPhone) newErrors.emergencyContactPhone = 'Emergency contact phone is required';
                break;
            case 'insurance':
                if (!formData.insuranceProvider) newErrors.insuranceProvider = 'Insurance provider is required';
                if (!formData.policyNumber) newErrors.policyNumber = 'Policy number is required';
                break;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        // Validate all tabs
        const allTabsValid = ['personal', 'contact', 'emergency', 'insurance'].every(tab => validateTab(tab));
        
        if (allTabsValid) {
            onSubmit(formData);
        } else {
            // Switch to first tab with errors
            const tabsWithErrors = ['personal', 'contact', 'emergency', 'insurance'].filter(tab => !validateTab(tab));
            if (tabsWithErrors.length > 0) {
                setActiveTab(tabsWithErrors[0]);
            }
        }
    };

    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return "";
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age.toString();
    };

    // Auto-calculate age when date of birth changes
    React.useEffect(() => {
        if (formData.dateOfBirth) {
            const age = calculateAge(formData.dateOfBirth);
            updateFormData('age', age);
        }
    }, [formData.dateOfBirth]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Patient Intake Form</h1>
                        <p className="text-muted-foreground mt-1">
                            Complete patient information for comprehensive care
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onCancel}>
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
                            <Save className="w-4 h-4 mr-2" />
                            Save Patient
                        </Button>
                    </div>
                </div>

                {/* Progress Indicator */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-medium">Personal Info</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-medium">Contact Info</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-medium">Emergency Contact</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-medium">Insurance</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-yellow-600" />
                                <span className="text-sm font-medium">Medical History</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Form Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-6">
                        <TabsTrigger value="personal">Personal</TabsTrigger>
                        <TabsTrigger value="contact">Contact</TabsTrigger>
                        <TabsTrigger value="emergency">Emergency</TabsTrigger>
                        <TabsTrigger value="insurance">Insurance</TabsTrigger>
                        <TabsTrigger value="medical">Medical</TabsTrigger>
                        <TabsTrigger value="health">Current Health</TabsTrigger>
                    </TabsList>

                    {/* Personal Information Tab */}
                    <TabsContent value="personal" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">First Name *</label>
                                        <Input
                                            value={formData.firstName}
                                            onChange={(e) => updateFormData('firstName', e.target.value)}
                                            placeholder="John"
                                            className={errors.firstName ? 'border-red-500' : ''}
                                        />
                                        {errors.firstName && (
                                            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Middle Name</label>
                                        <Input
                                            value={formData.middleName}
                                            onChange={(e) => updateFormData('middleName', e.target.value)}
                                            placeholder="A."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Last Name *</label>
                                        <Input
                                            value={formData.lastName}
                                            onChange={(e) => updateFormData('lastName', e.target.value)}
                                            placeholder="Doe"
                                            className={errors.lastName ? 'border-red-500' : ''}
                                        />
                                        {errors.lastName && (
                                            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Date of Birth *</label>
                                        <Input
                                            type="date"
                                            value={formData.dateOfBirth}
                                            onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                                            className={errors.dateOfBirth ? 'border-red-500' : ''}
                                        />
                                        {errors.dateOfBirth && (
                                            <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Age</label>
                                        <Input
                                            value={formData.age}
                                            readOnly
                                            placeholder="Calculated automatically"
                                            className="bg-muted"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Gender *</label>
                                        <Select 
                                            value={formData.gender} 
                                            onValueChange={(value) => updateFormData('gender', value)}
                                        >
                                            <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Male">Male</SelectItem>
                                                <SelectItem value="Female">Female</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                                <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.gender && (
                                            <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Social Security Number</label>
                                        <FormattedInput
                                            type="ssn"
                                            value={formData.ssn}
                                            onChange={(value) => updateFormData('ssn', value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Marital Status</label>
                                        <Select 
                                            value={formData.maritalStatus} 
                                            onValueChange={(value) => updateFormData('maritalStatus', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select marital status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Single">Single</SelectItem>
                                                <SelectItem value="Married">Married</SelectItem>
                                                <SelectItem value="Divorced">Divorced</SelectItem>
                                                <SelectItem value="Widowed">Widowed</SelectItem>
                                                <SelectItem value="Separated">Separated</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Contact Information Tab */}
                    <TabsContent value="contact" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Phone className="w-5 h-5" />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Phone Number *</label>
                                        <FormattedInput
                                            type="phone"
                                            value={formData.phone}
                                            onChange={(value) => updateFormData('phone', value)}
                                            className={errors.phone ? 'border-red-500' : ''}
                                        />
                                        {errors.phone && (
                                            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Email Address *</label>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => updateFormData('email', e.target.value)}
                                            placeholder="john.doe@email.com"
                                            className={errors.email ? 'border-red-500' : ''}
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Street Address *</label>
                                    <Input
                                        value={formData.address}
                                        onChange={(e) => updateFormData('address', e.target.value)}
                                        placeholder="123 Main Street"
                                        className={errors.address ? 'border-red-500' : ''}
                                    />
                                    {errors.address && (
                                        <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">City</label>
                                        <Input
                                            value={formData.city}
                                            onChange={(e) => updateFormData('city', e.target.value)}
                                            placeholder="City"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">State</label>
                                        <Input
                                            value={formData.state}
                                            onChange={(e) => updateFormData('state', e.target.value)}
                                            placeholder="State"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">ZIP Code</label>
                                        <Input
                                            value={formData.zipCode}
                                            onChange={(e) => updateFormData('zipCode', e.target.value)}
                                            placeholder="12345"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Employer</label>
                                        <Input
                                            value={formData.employer}
                                            onChange={(e) => updateFormData('employer', e.target.value)}
                                            placeholder="Company Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Occupation</label>
                                        <Input
                                            value={formData.occupation}
                                            onChange={(e) => updateFormData('occupation', e.target.value)}
                                            placeholder="Job Title"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Emergency Contact Tab */}
                    <TabsContent value="emergency" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" />
                                    Emergency Contact
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Contact Name *</label>
                                    <Input
                                        value={formData.emergencyContactName}
                                        onChange={(e) => updateFormData('emergencyContactName', e.target.value)}
                                        placeholder="Emergency contact full name"
                                        className={errors.emergencyContactName ? 'border-red-500' : ''}
                                    />
                                    {errors.emergencyContactName && (
                                        <p className="text-red-500 text-xs mt-1">{errors.emergencyContactName}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Relationship</label>
                                        <Select 
                                            value={formData.emergencyContactRelationship} 
                                            onValueChange={(value) => updateFormData('emergencyContactRelationship', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select relationship" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Spouse">Spouse</SelectItem>
                                                <SelectItem value="Parent">Parent</SelectItem>
                                                <SelectItem value="Child">Child</SelectItem>
                                                <SelectItem value="Sibling">Sibling</SelectItem>
                                                <SelectItem value="Friend">Friend</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Phone Number *</label>
                                        <FormattedInput
                                            type="phone"
                                            value={formData.emergencyContactPhone}
                                            onChange={(value) => updateFormData('emergencyContactPhone', value)}
                                            className={errors.emergencyContactPhone ? 'border-red-500' : ''}
                                        />
                                        {errors.emergencyContactPhone && (
                                            <p className="text-red-500 text-xs mt-1">{errors.emergencyContactPhone}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Insurance Information Tab */}
                    <TabsContent value="insurance" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="w-5 h-5" />
                                    Insurance Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Insurance Provider *</label>
                                        <Input
                                            value={formData.insuranceProvider}
                                            onChange={(e) => updateFormData('insuranceProvider', e.target.value)}
                                            placeholder="Blue Cross Blue Shield"
                                            className={errors.insuranceProvider ? 'border-red-500' : ''}
                                        />
                                        {errors.insuranceProvider && (
                                            <p className="text-red-500 text-xs mt-1">{errors.insuranceProvider}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Policy Number *</label>
                                        <Input
                                            value={formData.policyNumber}
                                            onChange={(e) => updateFormData('policyNumber', e.target.value)}
                                            placeholder="BC123456789"
                                            className={errors.policyNumber ? 'border-red-500' : ''}
                                        />
                                        {errors.policyNumber && (
                                            <p className="text-red-500 text-xs mt-1">{errors.policyNumber}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Group Number</label>
                                        <Input
                                            value={formData.groupNumber}
                                            onChange={(e) => updateFormData('groupNumber', e.target.value)}
                                            placeholder="GRP001"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Copay Amount</label>
                                        <Input
                                            value={formData.copay}
                                            onChange={(e) => updateFormData('copay', e.target.value)}
                                            placeholder="$25"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Medical History Tab */}
                    <TabsContent value="medical" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Heart className="w-5 h-5" />
                                    Medical History
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Known Allergies</label>
                                    <textarea
                                        className="w-full mt-1 p-3 border rounded-lg resize-none"
                                        rows={2}
                                        placeholder="List any known allergies (medications, foods, environmental)..."
                                        value={formData.allergies}
                                        onChange={(e) => updateFormData('allergies', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Current Medications</label>
                                    <textarea
                                        className="w-full mt-1 p-3 border rounded-lg resize-none"
                                        rows={3}
                                        placeholder="List all current medications with dosages..."
                                        value={formData.currentMedications}
                                        onChange={(e) => updateFormData('currentMedications', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Previous Surgeries</label>
                                    <textarea
                                        className="w-full mt-1 p-3 border rounded-lg resize-none"
                                        rows={2}
                                        placeholder="List any previous surgeries with dates..."
                                        value={formData.previousSurgeries}
                                        onChange={(e) => updateFormData('previousSurgeries', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Chronic Conditions</label>
                                    <textarea
                                        className="w-full mt-1 p-3 border rounded-lg resize-none"
                                        rows={2}
                                        placeholder="List any chronic medical conditions..."
                                        value={formData.chronicConditions}
                                        onChange={(e) => updateFormData('chronicConditions', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Family Medical History</label>
                                    <textarea
                                        className="w-full mt-1 p-3 border rounded-lg resize-none"
                                        rows={3}
                                        placeholder="List significant family medical history..."
                                        value={formData.familyHistory}
                                        onChange={(e) => updateFormData('familyHistory', e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Smoking Status</label>
                                        <Select 
                                            value={formData.smokingStatus} 
                                            onValueChange={(value) => updateFormData('smokingStatus', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Never">Never</SelectItem>
                                                <SelectItem value="Current">Current</SelectItem>
                                                <SelectItem value="Former">Former</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Alcohol Consumption</label>
                                        <Select 
                                            value={formData.alcoholConsumption} 
                                            onValueChange={(value) => updateFormData('alcoholConsumption', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select frequency" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="None">None</SelectItem>
                                                <SelectItem value="Occasional">Occasional</SelectItem>
                                                <SelectItem value="Moderate">Moderate</SelectItem>
                                                <SelectItem value="Heavy">Heavy</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Exercise Level</label>
                                        <Select 
                                            value={formData.exerciseLevel} 
                                            onValueChange={(value) => updateFormData('exerciseLevel', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Sedentary">Sedentary</SelectItem>
                                                <SelectItem value="Light">Light</SelectItem>
                                                <SelectItem value="Moderate">Moderate</SelectItem>
                                                <SelectItem value="Heavy">Heavy</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Current Health Tab */}
                    <TabsContent value="health" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Current Health Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Primary Condition/Complaint</label>
                                    <Input
                                        value={formData.primaryCondition}
                                        onChange={(e) => updateFormData('primaryCondition', e.target.value)}
                                        placeholder="e.g., Lower Back Pain, Neck Pain, etc."
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Secondary Conditions</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {formData.secondaryConditions.map((condition, index) => (
                                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                {condition}
                                                <X 
                                                    className="w-3 h-3 cursor-pointer" 
                                                    onClick={() => removeSecondaryCondition(condition)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Add secondary condition"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    addSecondaryCondition(e.target.value);
                                                    e.target.value = '';
                                                }
                                            }}
                                        />
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            size="sm"
                                            onClick={(e) => {
                                                const input = e.target.parentElement.querySelector('input');
                                                addSecondaryCondition(input.value);
                                                input.value = '';
                                            }}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Current Symptoms</label>
                                    <textarea
                                        className="w-full mt-1 p-3 border rounded-lg resize-none"
                                        rows={3}
                                        placeholder="Describe current symptoms in detail..."
                                        value={formData.currentSymptoms}
                                        onChange={(e) => updateFormData('currentSymptoms', e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Pain Level (0-10)</label>
                                        <Select 
                                            value={formData.painLevel} 
                                            onValueChange={(value) => updateFormData('painLevel', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select pain level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({length: 11}, (_, i) => (
                                                    <SelectItem key={i} value={i.toString()}>
                                                        {i} - {i === 0 ? 'No pain' : i <= 3 ? 'Mild' : i <= 6 ? 'Moderate' : 'Severe'}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Functional Limitations</label>
                                        <textarea
                                            className="w-full mt-1 p-3 border rounded-lg resize-none"
                                            rows={2}
                                            placeholder="Describe limitations in daily activities..."
                                            value={formData.functionalLimitations}
                                            onChange={(e) => updateFormData('functionalLimitations', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Vitals Section */}
                                <div className="border-t pt-4 mt-6">
                                    <h3 className="text-lg font-semibold mb-4">Current Vitals</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-sm font-medium">Height</label>
                                            <Input
                                                value={formData.height}
                                                onChange={(e) => updateFormData('height', e.target.value)}
                                                placeholder="5'6\""
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Weight</label>
                                            <Input
                                                value={formData.weight}
                                                onChange={(e) => updateFormData('weight', e.target.value)}
                                                placeholder="140 lbs"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Blood Pressure</label>
                                            <Input
                                                value={formData.bloodPressure}
                                                onChange={(e) => updateFormData('bloodPressure', e.target.value)}
                                                placeholder="120/80"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="text-sm font-medium">Heart Rate</label>
                                            <Input
                                                value={formData.heartRate}
                                                onChange={(e) => updateFormData('heartRate', e.target.value)}
                                                placeholder="72 bpm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Temperature</label>
                                            <Input
                                                value={formData.temperature}
                                                onChange={(e) => updateFormData('temperature', e.target.value)}
                                                placeholder="98.6°F"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Submit Button */}
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
                        <Save className="w-4 h-4 mr-2" />
                        Save Patient Information
                    </Button>
                </div>
            </div>
        </div>
    );
} 