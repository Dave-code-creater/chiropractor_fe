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

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
            <CardTitle onClick={() => setEditingName(true)} className="cursor-pointer">
              {reportName || "Untitled Report"}
            </CardTitle>
          )}
          <p className="text-sm text-muted-foreground mt-1">Patient Intake Form</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                required
              />
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
                required
              />
            </div>
            <div>
              <Label htmlFor="ssn">SSN</Label>
              <Input
                id="ssn"
                value={formData.ssn}
                onChange={(e) => handleChange("ssn", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(val) => handleChange("gender", val)}
                required
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
                  {['Single','Married','Widowed','Divorced'].map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
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
                  {['Asian','Black','Caucasian','Hispanic','Other'].map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <fieldset className="border rounded-md p-4 space-y-4">
            <legend className="text-sm font-medium text-muted-foreground px-2">Home Address</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="street">Street</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => handleChange("street", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="zip">Zip</Label>
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => handleChange("zip", e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="homePhone">Home Phone</Label>
                <Input
                  id="homePhone"
                  value={formData.homePhone}
                  onChange={(e) => handleChange("homePhone", e.target.value)}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="border rounded-md p-4 space-y-4">
            <legend className="text-sm font-medium text-muted-foreground px-2">Employment &amp; Occupation</legend>
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
              </div>
            </div>
          </fieldset>

          <fieldset className="border rounded-md p-4 space-y-4">
            <legend className="text-sm font-medium text-muted-foreground px-2">Emergency &amp; Spouse</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="spousePhone">Spouse Phone</Label>
                <Input
                  id="spousePhone"
                  value={formData.spousePhone}
                  onChange={(e) => handleChange("spousePhone", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contact1">Emergency Contact</Label>
                <Input
                  id="contact1"
                  value={formData.contact1}
                  onChange={(e) => handleChange("contact1", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contact1Phone">Contact Phone</Label>
                <Input
                  id="contact1Phone"
                  value={formData.contact1Phone}
                  onChange={(e) => handleChange("contact1Phone", e.target.value)}
                />
              </div>
              <div>
                <Label>Relationship</Label>
                <Select
                  value={formData.contact1Relationship}
                  onValueChange={(val) => handleChange("contact1Relationship", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Spouse','Parent','Sibling','Child','Friend','Other'].map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
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
