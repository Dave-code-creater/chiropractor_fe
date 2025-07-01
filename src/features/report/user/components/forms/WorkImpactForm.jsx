import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function WorkImpactForm({ initialData = {}, onSubmit, onBack }) {
  const [formData, setFormData] = useState({
    workActivities: initialData.workActivities || [],
    lostWork: initialData.lostWork || "",
    lostWorkDates: initialData.lostWorkDates || "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const activities = [
    "Standing",
    "Sitting",
    "Walking",
    "Driving",
    "Lifting",
    "Bending",
    "Other",
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Recovery and Work Impact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <fieldset className="border rounded-md p-4 space-y-2">
            <legend className="text-sm font-medium text-muted-foreground px-2">
              Work Activities Affected
            </legend>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {activities.map((opt) => (
                <div key={opt} className="flex items-center text-sm">
                  <Checkbox
                    id={`wa-${opt}`}
                    checked={formData.workActivities.includes(opt)}
                    onCheckedChange={(checked) => {
                      setFormData((p) => {
                        const curr = p.workActivities;
                        return {
                          ...p,
                          workActivities: checked
                            ? [...curr, opt]
                            : curr.filter((v) => v !== opt),
                        };
                      });
                    }}
                  />
                  <Label htmlFor={`wa-${opt}`} className="ml-2">
                    {opt}
                  </Label>
                </div>
              ))}
            </div>
          </fieldset>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Lost time from work?</Label>
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
            <div>
              <Label htmlFor="lostWorkDates">Dates (if any)</Label>
              <input
                id="lostWorkDates"
                className="w-full border rounded px-3 py-2"
                value={formData.lostWorkDates}
                onChange={(e) => handleChange("lostWorkDates", e.target.value)}
              />
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
