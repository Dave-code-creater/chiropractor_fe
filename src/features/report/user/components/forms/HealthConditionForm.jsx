import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function HealthConditionForm({ initialData = {}, onSubmit, onBack, isLast = false }) {
  const [formData, setFormData] = useState({
    hasCondition: initialData.hasCondition || "",
    conditionDetails: initialData.conditionDetails || "",
    medication: initialData.medication || "",
    medicationNames: initialData.medicationNames || "",
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
          <CardTitle>Extended Health History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Past medical conditions?</Label>
              <Select value={formData.hasCondition} onValueChange={(val) => handleChange("hasCondition", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No major conditions</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Currently taking medication?</Label>
              <Select value={formData.medication} onValueChange={(val) => handleChange("medication", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="conditionDetails">Condition Details</Label>
              <textarea
                id="conditionDetails"
                className="w-full border rounded px-3 py-2 resize-y"
                rows={3}
                value={formData.conditionDetails}
                onChange={(e) => handleChange("conditionDetails", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="medicationNames">Medication Names</Label>
              <textarea
                id="medicationNames"
                className="w-full border rounded px-3 py-2 resize-y"
                rows={3}
                value={formData.medicationNames}
                onChange={(e) => handleChange("medicationNames", e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-between pt-4">
            {onBack && (
              <Button type="button" variant="outline" onClick={onBack}>
                Previous
              </Button>
            )}
            <Button type="submit">{isLast ? "Save" : "Next"}</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
