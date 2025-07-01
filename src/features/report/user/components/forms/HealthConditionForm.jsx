import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function HealthConditionForm({
  initialData = {},
  onSubmit,
  onBack,
  isLast = false,
}) {
  const [formData, setFormData] = useState({
    hasCondition: initialData.hasCondition || "",
    conditionDetails: initialData.conditionDetails || "",
    hasSurgicalHistory: initialData.hasSurgicalHistory || "",
    surgicalHistoryDetails: initialData.surgicalHistoryDetails || "",
    medication: initialData.medication || "",
    medicationNames: initialData.medicationNames || "",
    currentlyWorking: initialData.currentlyWorking || "",
    workTimes: initialData.workTimes || "",
    workHoursPerDay: initialData.workHoursPerDay || "",
    workDaysPerWeek: initialData.workDaysPerWeek || "",
    jobDescription: initialData.jobDescription || "",
    lastMenstrualPeriod: initialData.lastMenstrualPeriod || "",
    isPregnantNow: initialData.isPregnantNow || "",
    weeksPregnant: initialData.weeksPregnant || "",
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
        <CardContent className="space-y-6">
          <fieldset className="border rounded-md p-4 space-y-4">
            <legend className="text-sm font-medium text-muted-foreground px-2">
              Medical &amp; Surgical History
            </legend>
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
                  onValueChange={(val) =>
                    handleChange("hasSurgicalHistory", val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No">
                      No major surgical history
                    </SelectItem>
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
                  onChange={(e) =>
                    handleChange("conditionDetails", e.target.value)
                  }
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="surgicalHistoryDetails">
                  Surgical History Details
                </Label>
                <textarea
                  id="surgicalHistoryDetails"
                  className="w-full border rounded px-3 py-2 resize-y"
                  rows={3}
                  value={formData.surgicalHistoryDetails}
                  onChange={(e) =>
                    handleChange("surgicalHistoryDetails", e.target.value)
                  }
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="border rounded-md p-4 space-y-4">
            <legend className="text-sm font-medium text-muted-foreground px-2">
              Medication
            </legend>
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
              <div className="md:col-span-2">
                <Label htmlFor="medicationNames">Medication Names</Label>
                <textarea
                  id="medicationNames"
                  className="w-full border rounded px-3 py-2 resize-y"
                  rows={3}
                  value={formData.medicationNames}
                  onChange={(e) =>
                    handleChange("medicationNames", e.target.value)
                  }
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="border rounded-md p-4 space-y-4">
            <legend className="text-sm font-medium text-muted-foreground px-2">
              Occupational History
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Currently Working?</Label>
                <Select
                  value={formData.currentlyWorking}
                  onValueChange={(val) => handleChange("currentlyWorking", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Work Times</Label>
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
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="workHoursPerDay">Hours per day</Label>
                <Input
                  id="workHoursPerDay"
                  value={formData.workHoursPerDay}
                  onChange={(e) =>
                    handleChange("workHoursPerDay", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="workDaysPerWeek">Days per week</Label>
                <Input
                  id="workDaysPerWeek"
                  value={formData.workDaysPerWeek}
                  onChange={(e) =>
                    handleChange("workDaysPerWeek", e.target.value)
                  }
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="jobDescription">
                  Describe your present job requirements
                </Label>
                <textarea
                  id="jobDescription"
                  className="w-full border rounded px-3 py-2 resize-y"
                  rows={3}
                  value={formData.jobDescription}
                  onChange={(e) =>
                    handleChange("jobDescription", e.target.value)
                  }
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="border rounded-md p-4 space-y-4">
            <legend className="text-sm font-medium text-muted-foreground px-2">
              Female Specific
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lastMenstrualPeriod">
                  Last menstrual period
                </Label>
                <Input
                  id="lastMenstrualPeriod"
                  value={formData.lastMenstrualPeriod}
                  onChange={(e) =>
                    handleChange("lastMenstrualPeriod", e.target.value)
                  }
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
              <div>
                <Label htmlFor="weeksPregnant">If yes, number of weeks</Label>
                <Input
                  id="weeksPregnant"
                  value={formData.weeksPregnant}
                  onChange={(e) =>
                    handleChange("weeksPregnant", e.target.value)
                  }
                />
              </div>
            </div>
          </fieldset>
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
