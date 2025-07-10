import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import FormattedInput from "@/components/forms/FormattedInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function PatientIntakeForm({
  initialData = {},
  onSubmit,
  onBack,
  reportName,
  setReportName,
  editingName,
  setEditingName,
}) {
  // Set default report name immediately when component loads
  useEffect(() => {
    if (!reportName || reportName === "Untitled Report") {
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      setReportName(`Patient Intake - ${currentDate}`);
    }
  }, []); // Empty dependency array means this runs once when component mounts

  const [formData, setFormData] = useState({
    first_name: initialData.first_name || "",
    middle_name: initialData.middle_name || "",
    last_name: initialData.last_name || "",
    ssn: initialData.ssn || "",
    date_of_birth: initialData.date_of_birth || "",
    gender: initialData.gender || "",
    marital_status: initialData.marital_status || "",
    race: initialData.race || "",
    address: initialData.address || "",
    city: initialData.city || "",
    state: initialData.state || "",
    zip_code: initialData.zip_code || "",
    home_phone: initialData.home_phone || "",
    cell_phone: initialData.cell_phone || "",
    emergency_contact_name: initialData.emergency_contact_name || "",
    emergency_contact_phone: initialData.emergency_contact_phone || "",
    emergency_contact_relationship: initialData.emergency_contact_relationship || ""
  });

  const [errors, setErrors] = useState({});

  const requiredFields = {
    first_name: "First Name",
    last_name: "Last Name",
    date_of_birth: "Date of Birth",
    gender: "Gender",
    marital_status: "Marital Status",
    address: "Street Address",
    city: "City",
    state: "State",
    zip_code: "ZIP Code",
    home_phone: "Home Phone",
    emergency_contact_name: "Emergency Contact Name",
    emergency_contact_phone: "Emergency Contact Phone",
    emergency_contact_relationship: "Emergency Contact Relationship"
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const errs = {};
    
    // Required field validation
    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!formData[field] || String(formData[field]).trim() === "") {
        errs[field] = `${label} is required`;
      }
    });

    // Name length validations
    if (formData.first_name && (formData.first_name.length < 2 || formData.first_name.length > 50)) {
      errs.first_name = "First name must be between 2 and 50 characters";
    }
    if (formData.last_name && (formData.last_name.length < 2 || formData.last_name.length > 50)) {
      errs.last_name = "Last name must be between 2 and 50 characters";
    }
    if (formData.middle_name && formData.middle_name.length > 50) {
      errs.middle_name = "Middle name must not exceed 50 characters";
    }

    // State validation
    if (formData.state && formData.state.length !== 2) {
      errs.state = "State must be a 2-letter code";
    }

    // Phone number validations
    const phoneFields = ['home_phone', 'cell_phone', 'emergency_contact_phone'];
    phoneFields.forEach(field => {
      if (formData[field] && !/^\d{10}$/.test(formData[field].replace(/\D/g, ''))) {
        errs[field] = "Please enter a valid 10-digit phone number";
      }
    });

    // SSN validation (if provided)
    if (formData.ssn && !/^\d{3}-\d{2}-\d{4}$/.test(formData.ssn)) {
      errs.ssn = "Please enter SSN in format: XXX-XX-XXXX";
    }

    // ZIP code validation
    if (formData.zip_code && !/^\d{5}(-\d{4})?$/.test(formData.zip_code)) {
      errs.zip_code = "Please enter a valid ZIP code (5 or 9 digits)";
    }

    // Emergency contact validations
    if (formData.emergency_contact_name && formData.emergency_contact_name.length > 100) {
      errs.emergency_contact_name = "Emergency contact name must not exceed 100 characters";
    }
    if (formData.emergency_contact_relationship && formData.emergency_contact_relationship.length > 50) {
      errs.emergency_contact_relationship = "Relationship must not exceed 50 characters";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        name: reportName // Use the current report name
      });
    }
  };

  // Check if all required fields are filled
  const isFormComplete = Object.entries(requiredFields).every(
    ([field]) => formData[field] && String(formData[field]).trim() !== ""
  );

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
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
              className="mt-1"
            />
          ) : (
            <CardTitle
              onClick={() => setEditingName(true)}
              className="cursor-pointer hover:text-primary"
            >
              {reportName || "Untitled Report"}
              <span className="ml-2 text-xs text-muted-foreground">(click to edit)</span>
            </CardTitle>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            Patient Intake Form
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Show completion message when all required fields are filled */}
          {isFormComplete && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Patient information completed! Click 'Submit Report' to proceed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Show error summary when there are validation errors */}
          {Object.keys(errors).length > 0 && (
            <div className="text-red-500 text-sm">
              <p>Please fill out these required fields:</p>
              <ul className="list-disc list-inside ml-4">
                {Object.keys(errors).map((key) => (
                  <li key={key}>{errors[key]}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name*</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
                className={errors.first_name ? "border-red-500" : ""}
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="middle_name">Middle Name</Label>
              <Input
                id="middle_name"
                value={formData.middle_name}
                onChange={(e) => handleChange("middle_name", e.target.value)}
                className={errors.middle_name ? "border-red-500" : ""}
              />
              {errors.middle_name && (
                <p className="text-red-500 text-sm mt-1">{errors.middle_name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="last_name">Last Name*</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
                className={errors.last_name ? "border-red-500" : ""}
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="ssn">SSN</Label>
              <FormattedInput
                type="ssn"
                id="ssn"
                value={formData.ssn}
                onChange={(value) => handleChange("ssn", value)}
                className={errors.ssn ? "border-red-500" : ""}
              />
              {errors.ssn && (
                <p className="text-red-500 text-sm mt-1">{errors.ssn}</p>
              )}
            </div>
            <div>
              <Label htmlFor="date_of_birth">Date of Birth*</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleChange("date_of_birth", e.target.value)}
                className={errors.date_of_birth ? "border-red-500" : ""}
              />
              {errors.date_of_birth && (
                <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>
              )}
            </div>
            <div>
              <Label>Gender*</Label>
              <Select
                value={formData.gender}
                onValueChange={(val) => handleChange("gender", val)}
              >
                <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
              )}
            </div>
            <div>
              <Label>Marital Status*</Label>
              <Select
                value={formData.marital_status}
                onValueChange={(val) => handleChange("marital_status", val)}
              >
                <SelectTrigger className={errors.marital_status ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {["Single", "Married", "Widowed", "Divorced"].map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.marital_status && (
                <p className="text-red-500 text-sm mt-1">{errors.marital_status}</p>
              )}
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
                  {["Asian", "Black", "Caucasian", "Hispanic", "Other"].map(
                    (opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

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
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>
              <div>
                <Label htmlFor="city">City*</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
              <div>
                <Label htmlFor="state">State*</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  maxLength={2}
                  className={errors.state ? "border-red-500" : ""}
                />
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                )}
              </div>
              <div>
                <Label htmlFor="zip_code">ZIP Code*</Label>
                <Input
                  id="zip_code"
                  value={formData.zip_code}
                  onChange={(e) => handleChange("zip_code", e.target.value)}
                  className={errors.zip_code ? "border-red-500" : ""}
                />
                {errors.zip_code && (
                  <p className="text-red-500 text-sm mt-1">{errors.zip_code}</p>
                )}
              </div>
              <div>
                <Label htmlFor="home_phone">Home Phone*</Label>
                <FormattedInput
                  type="phone"
                  id="home_phone"
                  value={formData.home_phone}
                  onChange={(value) => handleChange("home_phone", value)}
                  className={errors.home_phone ? "border-red-500" : ""}
                />
                {errors.home_phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.home_phone}</p>
                )}
              </div>
              <div>
                <Label htmlFor="cell_phone">Cell Phone</Label>
                <FormattedInput
                  type="phone"
                  id="cell_phone"
                  value={formData.cell_phone}
                  onChange={(value) => handleChange("cell_phone", value)}
                  className={errors.cell_phone ? "border-red-500" : ""}
                />
                {errors.cell_phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.cell_phone}</p>
                )}
              </div>
            </div>
          </fieldset>

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
                  className={errors.emergency_contact_name ? "border-red-500" : ""}
                />
                {errors.emergency_contact_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.emergency_contact_name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="emergency_contact_phone">Contact Phone*</Label>
                <FormattedInput
                  type="phone"
                  id="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={(value) => handleChange("emergency_contact_phone", value)}
                  className={errors.emergency_contact_phone ? "border-red-500" : ""}
                />
                {errors.emergency_contact_phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.emergency_contact_phone}</p>
                )}
              </div>
              <div>
                <Label>Relationship*</Label>
                <Select
                  value={formData.emergency_contact_relationship}
                  onValueChange={(val) => handleChange("emergency_contact_relationship", val)}
                >
                  <SelectTrigger className={errors.emergency_contact_relationship ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Spouse",
                      "Parent",
                      "Sibling",
                      "Child",
                      "Friend",
                      "Other",
                    ].map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.emergency_contact_relationship && (
                  <p className="text-red-500 text-sm mt-1">{errors.emergency_contact_relationship}</p>
                )}
              </div>
            </div>
          </fieldset>

          <div className="flex justify-between pt-4">
            {onBack && (
              <Button type="button" variant="outline" onClick={onBack}>
                Previous
              </Button>
            )}
            <Button 
              type="submit"
              className={isFormComplete ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Submit Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

