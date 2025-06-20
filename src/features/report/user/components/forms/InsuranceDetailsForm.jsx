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

export default function InsuranceDetailsForm({ initialData = {}, onSubmit, onBack }) {
  const [formData, setFormData] = useState({
    accidentDate: initialData.accidentDate || "",
    accidentDescription: initialData.accidentDescription || "",
    covered: initialData.covered || "",
    insuranceType: initialData.insuranceType || "",
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
          <CardTitle>Accident &amp; Insurance Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="md:col-span-2">
              <Label htmlFor="accidentDescription">Describe the Accident</Label>
              <textarea
                id="accidentDescription"
                className="w-full border rounded px-3 py-2 resize-y"
                rows={4}
                value={formData.accidentDescription}
                onChange={(e) => handleChange("accidentDescription", e.target.value)}
              />
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
                  <SelectItem value="Auto">Auto</SelectItem>
                  <SelectItem value="Work">Worker's Compensation</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
