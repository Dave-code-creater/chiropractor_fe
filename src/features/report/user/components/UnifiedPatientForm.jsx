import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import FormattedInput from "@/components/forms/FormattedInput";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import HumanBody from "./HumanBody";
import {
  useCreateIncidentMutation,
  useSubmitPatientInfoFormMutation,
  useSubmitHealthInsuranceFormMutation,
  useSubmitPainDescriptionFormNewMutation,
  useSubmitPainAssessmentFormNewMutation,
  useSubmitMedicalHistoryFormNewMutation,
  useSubmitLifestyleImpactFormNewMutation,
  useGetIncidentsQuery
} from "@/api";
import { useGetAvailableDoctorsQuery } from "@/api/services/appointmentApi";

export default function UnifiedPatientForm({
  userId,
  onComplete,
  onBack,
}) {
  const [reportName, setReportName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [painMap, setPainMap] = useState({});

  // All form data in one object
  const [formData, setFormData] = useState({
    // Doctor assignment
    doctor_id: "",
    
    // Patient Info fields
    first_name: "",
    middle_name: "",
    last_name: "",
    ssn: "",
    date_of_birth: "",
    gender: "",
    marital_status: "",
    race: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    home_phone: "",
    cell_phone: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relationship: "",

    // Health Condition fields
    hasCondition: "",
    conditionDetails: "",
    hasSurgicalHistory: "",
    surgicalHistoryDetails: "",
    medication: "",
    medicationNames: "",
    currentlyWorking: "",
    workTimes: "",
    workHoursPerDay: "",
    workDaysPerWeek: "",
    jobDescription: "",
    lastMenstrualPeriod: "",
    isPregnantNow: "",
    weeksPregnant: "",

    // Pain Evaluation fields
    painType: [],
    painLevel: [],
    painTiming: "",
    painChanges: "",
    painTriggers: [],
    radiatingPain: "",

    // Detailed Description fields
    symptomDetails: "",
    mainComplaints: "",
    previousHealthcare: "",

    // Insurance/Accident fields
    typeCar: "",
    accidentDate: "",
    accidentTime: "",
    accidentTimePeriod: "",
    accidentLocation: "",
    accidentType: "",
    accidentDescription: "",
    accidentAwareness: "",
    acciddentAppearanceOfAmbulance: "",
    AirbagDeployment: "",
    seatbeltUse: "",
    PoliceAppearance: "",
    anyPastAccidents: "",
    lostWorkYesNo: "",
    lostWorkDates: "",
    pregnant: "",
    childrenInfo: "",
    covered: "",
    insuranceType: "",

    // Work Impact fields
    workActivities: [],
    lostWork: "",
    workType: "",
    workStress: "",

    // Lifestyle fields
    smoking: "",
    smokingDetails: "",
    drinking: "",
    drinkingDetails: "",
    exercise: "",
    exerciseDetails: "",
    sleepQuality: "",
  });

  const [errors, setErrors] = useState({});

  // API hooks
  const { data: userIncidents } = useGetIncidentsQuery(userId, { skip: !userId });
  const { data: doctorsData, isLoading: isDoctorsLoading } = useGetAvailableDoctorsQuery();
  const [createIncident] = useCreateIncidentMutation();
  const [submitPatientInfo] = useSubmitPatientInfoFormMutation();
  const [submitHealthInsurance] = useSubmitHealthInsuranceFormMutation();
  const [submitPainDescription] = useSubmitPainDescriptionFormNewMutation();
  const [submitPainAssessment] = useSubmitPainAssessmentFormNewMutation();
  const [submitMedicalHistory] = useSubmitMedicalHistoryFormNewMutation();
  const [submitLifestyleImpact] = useSubmitLifestyleImpactFormNewMutation();

  // Set default report name
  useEffect(() => {
    if (!reportName) {
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      setReportName(`Complete Patient Report - ${currentDate}`);
    }
  }, []);

  // Auto-handle work fields when employment status changes
  useEffect(() => {
    if (formData.currentlyWorking === "no") {
      setFormData(prev => ({
        ...prev,
        workTimes: "N/A",
        workHoursPerDay: "0",
        workDaysPerWeek: "0",
        jobDescription: "Not currently employed",
        workStress: "N/A",
        workType: "N/A",
        workActivities: [],
        lostWork: "N/A"
      }));
    }
  }, [formData.currentlyWorking]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field, option, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...prev[field], option]
        : prev[field].filter(item => item !== option)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      console.error("No user ID provided");
      return;
    }

    // Validate doctor selection
    if (!formData.doctor_id) {
      setErrors({ doctor_id: "Please select a doctor" });
      return;
    }
    setErrors({});

    setIsSubmitting(true);

    try {
      // Step 1: Create an incident first
      console.log("Creating incident...");
      const incidentData = {
        incident_type: "general_pain",
        title: reportName,
        description: "Complete patient information form submission",
        incident_date: new Date().toISOString().split('T')[0],
        doctor_id: formData.doctor_id
      };

      const incidentResponse = await createIncident(incidentData).unwrap();
      const incidentId = incidentResponse.data.id;
      console.log("Incident created with ID:", incidentId);

      // Step 2: Submit all forms to the created incident
      const submissions = await Promise.all([
        // Patient Information
        submitPatientInfo({
          incidentId,
          formData: {
            first_name: formData.first_name,
            middle_name: formData.middle_name,
            last_name: formData.last_name,
            ssn: formData.ssn,
            date_of_birth: formData.date_of_birth,
            gender: formData.gender,
            marital_status: formData.marital_status,
            race: formData.race,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zip_code,
            home_phone: formData.home_phone,
            cell_phone: formData.cell_phone,
            emergency_contact_name: formData.emergency_contact_name,
            emergency_contact_phone: formData.emergency_contact_phone,
            emergency_contact_relationship: formData.emergency_contact_relationship,
          }
        }).unwrap(),

        // Medical History
        submitMedicalHistory({
          incidentId,
          formData: {
            hasCondition: formData.hasCondition,
            conditionDetails: formData.conditionDetails,
            hasSurgicalHistory: formData.hasSurgicalHistory,
            surgicalHistoryDetails: formData.surgicalHistoryDetails,
            medication: formData.medication,
            medicationNames: formData.medicationNames,
            currentlyWorking: formData.currentlyWorking,
            workTimes: formData.workTimes,
            workHoursPerDay: formData.workHoursPerDay,
            workDaysPerWeek: formData.workDaysPerWeek,
            jobDescription: formData.jobDescription,
            lastMenstrualPeriod: formData.lastMenstrualPeriod,
            isPregnantNow: formData.isPregnantNow,
            weeksPregnant: formData.weeksPregnant,
          }
        }).unwrap(),

        // Pain Assessment
        submitPainAssessment({
          incidentId,
          formData: {
            painMap: painMap,
            painType: formData.painType,
            painLevel: formData.painLevel,
            painTiming: formData.painTiming,
            painChanges: formData.painChanges,
            painTriggers: formData.painTriggers,
            radiatingPain: formData.radiatingPain,
          }
        }).unwrap(),

        // Pain Description
        submitPainDescription({
          incidentId,
          formData: {
            symptomDetails: formData.symptomDetails,
            mainComplaints: formData.mainComplaints,
            previousHealthcare: formData.previousHealthcare,
          }
        }).unwrap(),

        // Health Insurance
        submitHealthInsurance({
          incidentId,
          formData: {
            typeCar: formData.typeCar,
            accidentDate: formData.accidentDate,
            accidentTime: formData.accidentTime,
            accidentTimePeriod: formData.accidentTimePeriod,
            accidentLocation: formData.accidentLocation,
            accidentType: formData.accidentType,
            accidentDescription: formData.accidentDescription,
            accidentAwareness: formData.accidentAwareness,
            acciddentAppearanceOfAmbulance: formData.acciddentAppearanceOfAmbulance,
            AirbagDeployment: formData.AirbagDeployment,
            seatbeltUse: formData.seatbeltUse,
            PoliceAppearance: formData.PoliceAppearance,
            anyPastAccidents: formData.anyPastAccidents,
            lostWorkYesNo: formData.lostWorkYesNo,
            lostWorkDates: formData.lostWorkDates,
            pregnant: formData.pregnant,
            childrenInfo: formData.childrenInfo,
            covered: formData.covered,
            insuranceType: formData.insuranceType,
          }
        }).unwrap(),

        // Lifestyle Impact
        submitLifestyleImpact({
          incidentId,
          formData: {
            workActivities: formData.workActivities,
            lostWork: formData.lostWork,
            lostWorkDates: formData.lostWorkDates,
            workType: formData.workType,
            workStress: formData.workStress,
            smoking: formData.smoking,
            smokingDetails: formData.smokingDetails,
            drinking: formData.drinking,
            drinkingDetails: formData.drinkingDetails,
            exercise: formData.exercise,
            exerciseDetails: formData.exerciseDetails,
            sleepQuality: formData.sleepQuality,
          }
        }).unwrap(),
      ]);

      console.log("All forms submitted successfully:", submissions);
      onComplete();
    } catch (error) {
      console.error("Error submitting complete form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        {editingName ? (
          <Input
            autoFocus
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            onBlur={() => setEditingName(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setEditingName(false);
              }
            }}
            className="text-2xl font-bold text-center"
          />
        ) : (
          <h1
            onClick={() => setEditingName(true)}
            className="text-3xl font-bold cursor-pointer hover:text-primary"
          >
            {reportName}
            <span className="ml-2 text-sm text-muted-foreground">(click to edit)</span>
          </h1>
        )}
        <p className="text-muted-foreground mt-2">
          Complete Patient Information Form
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Patient Information Section */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Doctor Selection */}
            <div>
              <Label htmlFor="doctor_id">Select Doctor*</Label>
              <Select value={formData.doctor_id} onValueChange={(value) => handleChange("doctor_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a doctor for your care" />
                </SelectTrigger>
                <SelectContent>
                  {isDoctorsLoading ? (
                    <SelectItem disabled value="loading">Loading doctors...</SelectItem>
                  ) : doctorsData?.data?.length > 0 ? (
                    doctorsData.data.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        Dr. {doctor.first_name} {doctor.last_name}
                        {doctor.specialization && ` - ${doctor.specialization}`}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="no-doctors">No doctors available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.doctor_id && <p className="text-red-500 text-sm mt-1">{errors.doctor_id}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name*</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="middle_name">Middle Name</Label>
                <Input
                  id="middle_name"
                  value={formData.middle_name}
                  onChange={(e) => handleChange("middle_name", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name*</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="ssn">SSN</Label>
                <FormattedInput
                  type="ssn"
                  id="ssn"
                  value={formData.ssn}
                  onChange={(value) => handleChange("ssn", value)}
                />
              </div>
              <div>
                <Label htmlFor="date_of_birth">Date of Birth*</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleChange("date_of_birth", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Gender*</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(val) => handleChange("gender", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Marital Status*</Label>
                <Select
                  value={formData.marital_status}
                  onValueChange={(val) => handleChange("marital_status", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Race/Ethnicity</Label>
                <Select
                  value={formData.race}
                  onValueChange={(val) => handleChange("race", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asian">Asian</SelectItem>
                    <SelectItem value="Black">Black</SelectItem>
                    <SelectItem value="Caucasian">Caucasian</SelectItem>
                    <SelectItem value="Hispanic">Hispanic</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Address Section */}
            <fieldset className="border rounded-md p-4 space-y-4">
              <legend className="text-sm font-medium text-muted-foreground px-2">
                Home Address
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address">Street*</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">City*</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State*</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    maxLength={2}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zip_code">ZIP Code*</Label>
                  <Input
                    id="zip_code"
                    value={formData.zip_code}
                    onChange={(e) => handleChange("zip_code", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="home_phone">Home Phone*</Label>
                  <FormattedInput
                    type="phone"
                    id="home_phone"
                    value={formData.home_phone}
                    onChange={(value) => handleChange("home_phone", value)}
                  />
                </div>
                <div>
                  <Label htmlFor="cell_phone">Cell Phone</Label>
                  <FormattedInput
                    type="phone"
                    id="cell_phone"
                    value={formData.cell_phone}
                    onChange={(value) => handleChange("cell_phone", value)}
                  />
                </div>
              </div>
            </fieldset>

            {/* Emergency Contact Section */}
            <fieldset className="border rounded-md p-4 space-y-4">
              <legend className="text-sm font-medium text-muted-foreground px-2">
                Emergency Contact Information
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergency_contact_name">Emergency Contact*</Label>
                  <Input
                    id="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={(e) => handleChange("emergency_contact_name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="emergency_contact_phone">Contact Phone*</Label>
                  <FormattedInput
                    type="phone"
                    id="emergency_contact_phone"
                    value={formData.emergency_contact_phone}
                    onChange={(value) => handleChange("emergency_contact_phone", value)}
                  />
                </div>
                <div>
                  <Label>Relationship*</Label>
                  <Select
                    value={formData.emergency_contact_relationship}
                    onValueChange={(val) => handleChange("emergency_contact_relationship", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Spouse">Spouse</SelectItem>
                      <SelectItem value="Parent">Parent</SelectItem>
                      <SelectItem value="Sibling">Sibling</SelectItem>
                      <SelectItem value="Child">Child</SelectItem>
                      <SelectItem value="Friend">Friend</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </fieldset>
          </CardContent>
        </Card>

        {/* Pain & Symptoms Section */}
        <Card>
          <CardHeader>
            <CardTitle>Pain & Symptoms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Body Diagram - 2/3 width */}
              <div className="lg:col-span-2">
                <HumanBody
                  gender={formData.gender}
                  painMap={painMap}
                  setPainMap={setPainMap}
                  formData={formData}
                  setFormData={setFormData}
                />
              </div>

              {/* Selected Pain Areas - 1/3 width */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Selected Pain Areas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {Object.keys(painMap).length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        Click on body parts to select areas where you experience pain
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {Object.entries(painMap)
                          .sort(([, a], [, b]) => b['pain-level'] - a['pain-level'])
                          .map(([part, data]) => (
                            <div key={part} className="border rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium capitalize">
                                  {part.replace(/([A-Z])/g, ' $1').trim()}
                                </h4>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${data['pain-level'] <= 3 ? 'bg-yellow-100 text-yellow-800' :
                                    data['pain-level'] <= 7 ? 'bg-orange-100 text-orange-800' :
                                      'bg-red-100 text-red-800'
                                  }`}>
                                  {data['pain-level'] <= 3 ? 'Mild' : data['pain-level'] <= 7 ? 'Moderate' : 'Severe'}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Pain Level: {data['pain-level']}/10
                              </p>
                              {data['pain-types'] && data['pain-types'].length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs font-medium text-muted-foreground mb-1">Pain Types:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {data['pain-types'].slice(0, 3).map(type => (
                                      <span key={type} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                        {type}
                                      </span>
                                    ))}
                                    {data['pain-types'].length > 3 && (
                                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                        +{data['pain-types'].length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                              {data['pain-timing'] && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Timing: {data['pain-timing']}
                                </p>
                              )}
                            </div>
                          ))}
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium">Summary</p>
                          <p className="text-sm text-muted-foreground">
                            {Object.keys(painMap).length} areas affected
                          </p>

                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical History Section */}
        <Card>
          <CardHeader>
            <CardTitle>Medical History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Past medical conditions?</Label>
                <Select
                  value={formData.hasCondition}
                  onValueChange={(val) => handleChange("hasCondition", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No">No major medical history</SelectItem>
                    <SelectItem value="Yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Past surgical history?</Label>
                <Select
                  value={formData.hasSurgicalHistory}
                  onValueChange={(val) => handleChange("hasSurgicalHistory", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No">No major surgical history</SelectItem>
                    <SelectItem value="Yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.hasCondition === "Yes" && (
              <div>
                <Label htmlFor="conditionDetails">Medical Condition Details</Label>
                <Textarea
                  id="conditionDetails"
                  value={formData.conditionDetails}
                  onChange={(e) => handleChange("conditionDetails", e.target.value)}
                  rows={3}
                  placeholder="Please describe your medical conditions..."
                />
              </div>
            )}

            {formData.hasSurgicalHistory === "Yes" && (
              <div>
                <Label htmlFor="surgicalHistoryDetails">Surgical History Details</Label>
                <Textarea
                  id="surgicalHistoryDetails"
                  value={formData.surgicalHistoryDetails}
                  onChange={(e) => handleChange("surgicalHistoryDetails", e.target.value)}
                  rows={3}
                  placeholder="Please describe your surgical history..."
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Currently taking medication?</Label>
                <Select
                  value={formData.medication}
                  onValueChange={(val) => handleChange("medication", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.medication === "Yes" && (
              <div>
                <Label htmlFor="medicationNames">Medication Names</Label>
                <Textarea
                  id="medicationNames"
                  value={formData.medicationNames}
                  onChange={(e) => handleChange("medicationNames", e.target.value)}
                  rows={3}
                  placeholder="List all medications you are currently taking..."
                />
              </div>
            )}

            {/* Female-specific fields */}
            {formData.gender === "Female" && (
              <fieldset className="border rounded-md p-4 space-y-4">
                <legend className="text-sm font-medium text-muted-foreground px-2">
                  Female Specific Information
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lastMenstrualPeriod">Last menstrual period</Label>
                    <Input
                      id="lastMenstrualPeriod"
                      value={formData.lastMenstrualPeriod}
                      onChange={(e) => handleChange("lastMenstrualPeriod", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Are you or could you be pregnant?</Label>
                    <Select
                      value={formData.isPregnantNow}
                      onValueChange={(val) => handleChange("isPregnantNow", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="YES">YES</SelectItem>
                        <SelectItem value="NO">NO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.isPregnantNow === "YES" && (
                    <div>
                      <Label htmlFor="weeksPregnant">If yes, number of weeks</Label>
                      <Input
                        id="weeksPregnant"
                        value={formData.weeksPregnant}
                        onChange={(e) => handleChange("weeksPregnant", e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </fieldset>
            )}
          </CardContent>
        </Card>

        {/* Work & Lifestyle Section */}
        <Card>
          <CardHeader>
            <CardTitle>Work & Lifestyle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Employment Status */}
            <div>
              <Label>Currently Working?*</Label>
              <Select
                value={formData.currentlyWorking}
                onValueChange={(val) => {
                  handleChange("currentlyWorking", val);
                  // Auto-fill work-related fields if not working
                  if (val === "no") {
                    handleChange("workTimes", "");
                    handleChange("workHoursPerDay", "0");
                    handleChange("workDaysPerWeek", "0");
                    handleChange("jobDescription", "");
                    handleChange("workStress", "");
                    handleChange("workType", "");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Work Details - Only show if working */}
            {formData.currentlyWorking === "yes" && (
              <fieldset className="border rounded-md p-4 space-y-4">
                <legend className="text-sm font-medium text-muted-foreground px-2">
                  Work Details
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Work Schedule</Label>
                    <Select
                      value={formData.workTimes}
                      onValueChange={(val) => handleChange("workTimes", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full Time">Full Time</SelectItem>
                        <SelectItem value="Part Time">Part Time</SelectItem>
                        <SelectItem value="Casual">Casual</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="workHoursPerDay">Hours per day</Label>
                    <Input
                      id="workHoursPerDay"
                      type="number"
                      min="1"
                      max="24"
                      value={formData.workHoursPerDay}
                      onChange={(e) => handleChange("workHoursPerDay", e.target.value)}
                      placeholder="e.g., 8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="workDaysPerWeek">Days per week</Label>
                    <Input
                      id="workDaysPerWeek"
                      type="number"
                      min="1"
                      max="7"
                      value={formData.workDaysPerWeek}
                      onChange={(e) => handleChange("workDaysPerWeek", e.target.value)}
                      placeholder="e.g., 5"
                    />
                  </div>
                  <div>
                    <Label>Work Type</Label>
                    <Select
                      value={formData.workType}
                      onValueChange={(val) => handleChange("workType", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Physical Labor">Physical Labor (Construction, Manufacturing, etc.)</SelectItem>
                        <SelectItem value="Mental Work">Mental Work (Office, Legal, Finance, etc.)</SelectItem>
                        <SelectItem value="Mixed">Mixed (Physical & Mental)</SelectItem>
                        <SelectItem value="Service">Service Industry</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="jobDescription">Job Description</Label>
                  <Textarea
                    id="jobDescription"
                    value={formData.jobDescription}
                    onChange={(e) => handleChange("jobDescription", e.target.value)}
                    rows={3}
                    placeholder="Describe your job duties and responsibilities..."
                  />
                </div>

                <div>
                  <Label>Work Stress Level</Label>
                  <Select
                    value={formData.workStress}
                    onValueChange={(val) => handleChange("workStress", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stress level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low Stress</SelectItem>
                      <SelectItem value="Moderate">Moderate Stress</SelectItem>
                      <SelectItem value="High">High Stress</SelectItem>
                      <SelectItem value="Very High">Very High Stress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Work Activities Affected */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Work Activities Affected (Select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["Standing", "Sitting", "Walking", "Driving", "Lifting", "Bending", "Typing/Computer Work", "Heavy Machinery"].map(activity => (
                      <div key={activity} className="flex items-center space-x-2">
                        <Checkbox
                          id={`work-activity-${activity}`}
                          checked={formData.workActivities.includes(activity)}
                          onCheckedChange={(checked) => handleCheckboxChange("workActivities", activity, checked)}
                        />
                        <Label htmlFor={`work-activity-${activity}`} className="text-sm">{activity}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Lost time from work due to this condition?</Label>
                    <Select
                      value={formData.lostWork}
                      onValueChange={(val) => handleChange("lostWork", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.lostWork === "Yes" && (
                    <div>
                      <Label htmlFor="lostWorkDates">Lost work dates/period</Label>
                      <Input
                        id="lostWorkDates"
                        value={formData.lostWorkDates}
                        onChange={(e) => handleChange("lostWorkDates", e.target.value)}
                        placeholder="e.g., 01/15/2024 - 01/30/2024 or 3 days"
                      />
                    </div>
                  )}
                </div>
              </fieldset>
            )}

            {/* Lifestyle Habits */}
            <fieldset className="border rounded-md p-4 space-y-4">
              <legend className="text-sm font-medium text-muted-foreground px-2">
                Lifestyle Habits
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Do you smoke?</Label>
                  <Select
                    value={formData.smoking}
                    onValueChange={(val) => handleChange("smoking", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Never">Never</SelectItem>
                      <SelectItem value="Former">Former smoker</SelectItem>
                      <SelectItem value="Occasional">Occasionally</SelectItem>
                      <SelectItem value="Daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Do you drink alcohol?</Label>
                  <Select
                    value={formData.drinking}
                    onValueChange={(val) => handleChange("drinking", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Never">Never</SelectItem>
                      <SelectItem value="Rarely">Rarely</SelectItem>
                      <SelectItem value="Socially">Socially (1-2 times/week)</SelectItem>
                      <SelectItem value="Regularly">Regularly (3+ times/week)</SelectItem>
                      <SelectItem value="Daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Exercise Frequency</Label>
                  <Select
                    value={formData.exercise}
                    onValueChange={(val) => handleChange("exercise", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Never">Never</SelectItem>
                      <SelectItem value="Rarely">Rarely (less than once/week)</SelectItem>
                      <SelectItem value="Sometimes">Sometimes (1-2 times/week)</SelectItem>
                      <SelectItem value="Regularly">Regularly (3-4 times/week)</SelectItem>
                      <SelectItem value="Daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Sleep Quality</Label>
                  <Select
                    value={formData.sleepQuality}
                    onValueChange={(val) => handleChange("sleepQuality", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Poor">Poor</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(formData.smoking === "Daily" || formData.smoking === "Occasional") && (
                <div>
                  <Label htmlFor="smokingDetails">Smoking Details</Label>
                  <Input
                    id="smokingDetails"
                    value={formData.smokingDetails}
                    onChange={(e) => handleChange("smokingDetails", e.target.value)}
                    placeholder="e.g., 1 pack per day, 5 cigarettes per day"
                  />
                </div>
              )}

              {(formData.drinking === "Regularly" || formData.drinking === "Daily" || formData.drinking === "Socially") && (
                <div>
                  <Label htmlFor="drinkingDetails">Drinking Details</Label>
                  <Input
                    id="drinkingDetails"
                    value={formData.drinkingDetails}
                    onChange={(e) => handleChange("drinkingDetails", e.target.value)}
                    placeholder="e.g., 2 glasses of wine per week, 1 beer daily"
                  />
                </div>
              )}

              {(formData.exercise === "Regularly" || formData.exercise === "Daily" || formData.exercise === "Sometimes") && (
                <div>
                  <Label htmlFor="exerciseDetails">Exercise Details</Label>
                  <Textarea
                    id="exerciseDetails"
                    value={formData.exerciseDetails}
                    onChange={(e) => handleChange("exerciseDetails", e.target.value)}
                    rows={2}
                    placeholder="What type of exercise do you do? e.g., walking, gym, yoga, sports"
                  />
                </div>
              )}
            </fieldset>
          </CardContent>
        </Card>

        {/* Insurance & Accident Section */}
        <Card>
          <CardHeader>
            <CardTitle>Insurance & Accident Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="typeCar">Type of Your Car</Label>
                <Input
                  id="typeCar"
                  value={formData.typeCar}
                  onChange={(e) => handleChange("typeCar", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="accidentDate">Date of Accident</Label>
                <Input
                  id="accidentDate"
                  type="date"
                  value={formData.accidentDate}
                  onChange={(e) => handleChange("accidentDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="accidentTime">Time of Accident</Label>
                <Input
                  id="accidentTime"
                  type="time"
                  value={formData.accidentTime}
                  onChange={(e) => handleChange("accidentTime", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="accidentLocation">Accident Location</Label>
                <Input
                  id="accidentLocation"
                  value={formData.accidentLocation}
                  onChange={(e) => handleChange("accidentLocation", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="accidentDescription">Accident Description</Label>
              <Textarea
                id="accidentDescription"
                value={formData.accidentDescription}
                onChange={(e) => handleChange("accidentDescription", e.target.value)}
                rows={4}
                placeholder="Please describe how the accident occurred..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Airbag Deployment</Label>
                <Select
                  value={formData.AirbagDeployment}
                  onValueChange={(val) => handleChange("AirbagDeployment", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Seatbelt Use</Label>
                <Select
                  value={formData.seatbeltUse}
                  onValueChange={(val) => handleChange("seatbeltUse", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Police Appearance</Label>
                <Select
                  value={formData.PoliceAppearance}
                  onValueChange={(val) => handleChange("PoliceAppearance", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ambulance Appearance</Label>
                <Select
                  value={formData.acciddentAppearanceOfAmbulance}
                  onValueChange={(val) => handleChange("acciddentAppearanceOfAmbulance", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="anyPastAccidents">Any past accidents?</Label>
              <Textarea
                id="anyPastAccidents"
                value={formData.anyPastAccidents}
                onChange={(e) => handleChange("anyPastAccidents", e.target.value)}
                rows={3}
                placeholder="Please describe any previous accidents..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Covered by Insurance?</Label>
                <Select
                  value={formData.covered}
                  onValueChange={(val) => handleChange("covered", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Insurance Type</Label>
                <Select
                  value={formData.insuranceType}
                  onValueChange={(val) => handleChange("insuranceType", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Group Insurance">Group Insurance</SelectItem>
                    <SelectItem value="Blue Cross / Blue Shield">Blue Cross / Blue Shield</SelectItem>
                    <SelectItem value="Worker's Compensation">Worker's Compensation</SelectItem>
                    <SelectItem value="Auto Insurance">Auto Insurance</SelectItem>
                    <SelectItem value="Medicare">Medicare</SelectItem>
                    <SelectItem value="Personal Injury">Personal Injury</SelectItem>
                    <SelectItem value="Other Insurance">Other Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="childrenInfo">Number & Ages of Children</Label>
                <Input
                  id="childrenInfo"
                  value={formData.childrenInfo}
                  onChange={(e) => handleChange("childrenInfo", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-between pt-6 pb-20">
          {onBack && (
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? "Submitting..." : "Submit Complete Report"}
          </Button>
        </div>
      </form>
    </div>
  );
} 