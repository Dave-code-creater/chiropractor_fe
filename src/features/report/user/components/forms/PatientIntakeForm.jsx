import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || "",
    middleName: initialData.middleName || "",
    lastName: initialData.lastName || "",
    ssn: initialData.ssn || "",
    dob: initialData.dob || "",
    gender: initialData.gender || "",
    status: initialData.status || "",
    race: initialData.race || "",
    street: initialData.street || "",
    city: initialData.city || "",
    state: initialData.state || "",
    zip: initialData.zip || "",
    homePhone: initialData.homePhone || "",
    employer: initialData.employer || "",
    occupation: initialData.occupation || "",
    workAddress: initialData.workAddress || "",
    workPhone: initialData.workPhone || "",
    spousePhone: initialData.spousePhone || "",
    contact1: initialData.contact1 || "",
    contact1Phone: initialData.contact1Phone || "",
    contact1Relationship: initialData.contact1Relationship || "",
  });
  const [errors, setErrors] = useState({});

  const requiredFields = {
    firstName: "First Name",
    lastName: "Last Name",
    dob: "Date of Birth",
    gender: "Gender",
    street: "Street",
    city: "City",
    state: "State",
    zip: "Zip",
    homePhone: "Home Phone",
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const errs = {};
    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!formData[field] || String(formData[field]).trim() === "") {
        errs[field] = `${label} is required`;
      }
    });
    if (formData.ssn && !/^\d{3}-\d{2}-\d{4}$/.test(formData.ssn)) {
      errs.ssn = "Invalid SSN format";
    }
    Object.keys(formData)
      .filter((k) => k.toLowerCase().includes("phone"))
      .forEach((field) => {
        if (
          formData[field] &&
          !/^(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/.test(formData[field])
        ) {
          errs[field] = "Invalid phone number";
        }
      });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

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
              className="cursor-pointer"
            >
              {reportName || "Untitled Report"}
            </CardTitle>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            Patient Intake Form
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
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
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                value={formData.middleName}
                onChange={(e) => handleChange("middleName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="ssn">SSN</Label>
              <Input
                id="ssn"
                value={formData.ssn}
                onChange={(e) => handleChange("ssn", e.target.value)}
              />
              {errors.ssn && (
                <p className="text-red-500 text-sm mt-1">{errors.ssn}</p>
              )}
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
              />
              {errors.dob && (
                <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
              )}
            </div>
            <div>
              <Label>Gender</Label>
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
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
              )}
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val) => handleChange("status", val)}
              >
                <SelectTrigger>
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
                <Label htmlFor="street">Street</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => handleChange("street", e.target.value)}
                />
                {errors.street && (
                  <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                )}
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                />
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                )}
              </div>
              <div>
                <Label htmlFor="zip">Zip</Label>
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => handleChange("zip", e.target.value)}
                />
                {errors.zip && (
                  <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="homePhone">Home Phone</Label>
                <Input
                  id="homePhone"
                  value={formData.homePhone}
                  onChange={(e) => handleChange("homePhone", e.target.value)}
                />
                {errors.homePhone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.homePhone}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset className="border rounded-md p-4 space-y-4">
            <legend className="text-sm font-medium text-muted-foreground px-2">
              Employment &amp; Occupation
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employer">Patient Employed By</Label>
                <Input
                  id="employer"
                  value={formData.employer}
                  onChange={(e) => handleChange("employer", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => handleChange("occupation", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="workAddress">Work Address</Label>
                <Input
                  id="workAddress"
                  value={formData.workAddress}
                  onChange={(e) => handleChange("workAddress", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="workPhone">Work Phone</Label>
                <Input
                  id="workPhone"
                  value={formData.workPhone}
                  onChange={(e) => handleChange("workPhone", e.target.value)}
                />
                {errors.workPhone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.workPhone}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset className="border rounded-md p-4 space-y-4">
            <legend className="text-sm font-medium text-muted-foreground px-2">
              Emergency &amp; Spouse
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="spousePhone">Spouse Phone</Label>
                <Input
                  id="spousePhone"
                  value={formData.spousePhone}
                  onChange={(e) => handleChange("spousePhone", e.target.value)}
                />
                {errors.spousePhone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.spousePhone}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="contact1">Emergency Contact</Label>
                <Input
                  id="contact1"
                  value={formData.contact1}
                  onChange={(e) => handleChange("contact1", e.target.value)}
                />
                {errors.contact1 && (
                  <p className="text-red-500 text-sm mt-1">{errors.contact1}</p>
                )}
              </div>
              <div>
                <Label htmlFor="contact1Phone">Contact Phone</Label>
                <Input
                  id="contact1Phone"
                  value={formData.contact1Phone}
                  onChange={(e) =>
                    handleChange("contact1Phone", e.target.value)
                  }
                />
                {errors.contact1Phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.contact1Phone}
                  </p>
                )}
              </div>
              <div>
                <Label>Relationship</Label>
                <Select
                  value={formData.contact1Relationship}
                  onValueChange={(val) =>
                    handleChange("contact1Relationship", val)
                  }
                >
                  <SelectTrigger>
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
              </div>
            </div>
          </fieldset>
          <div className="flex justify-between pt-4">
            {onBack && (
              <Button type="button" variant="outline" onClick={onBack}>
                Previous
              </Button>
            )}
            <Button type="submit">Next</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
