import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function DetailedDescriptionForm({
  initialData = {},
  onSubmit,
  onBack,
}) {
  const [formData, setFormData] = useState({
    symptomDetails: initialData.symptomDetails || "",
    mainComplaints: initialData.mainComplaints || "",
    previousHealthcare: initialData.previousHealthcare || "",
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
          <CardTitle>Detailed Symptom Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="symptomDetails">Describe your symptoms</Label>
            <textarea
              id="symptomDetails"
              className="w-full border rounded px-3 py-2 resize-y"
              rows={4}
              value={formData.symptomDetails}
              onChange={(e) => handleChange("symptomDetails", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="mainComplaints">Main complaints</Label>
            <textarea
              id="mainComplaints"
              className="w-full border rounded px-3 py-2 resize-y"
              rows={4}
              value={formData.mainComplaints}
              onChange={(e) => handleChange("mainComplaints", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="previousHealthcare">
              Previous healthcare received
            </Label>
            <textarea
              id="previousHealthcare"
              className="w-full border rounded px-3 py-2 resize-y"
              rows={4}
              value={formData.previousHealthcare}
              onChange={(e) =>
                handleChange("previousHealthcare", e.target.value)
              }
            />
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
