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
    typeCar: initialData.typeCar || "",
    accidentDate: initialData.accidentDate || "",
    accidentTime: initialData.accidentTime || "",
    accidentTimePeriod: initialData.accidentTimePeriod || "",
    accidentLocation: initialData.accidentLocation || "",
    accidentType: initialData.accidentType || "",
    accidentDescription: initialData.accidentDescription || "",
    accidentAwareness: initialData.accidentAwareness || "",
    acciddentAppearanceOfAmbulance:
      initialData.acciddentAppearanceOfAmbulance || "",
    AirbagDeployment: initialData.AirbagDeployment || "",
    seatbeltUse: initialData.seatbeltUse || "",
    PoliceAppearance: initialData.PoliceAppearance || "",
    anyPastAccidents: initialData.anyPastAccidents || "",
    lostWorkYesNo: initialData.lostWorkYesNo || "",
    lostWorkDates: initialData.lostWorkDates || "",
    pregnant: initialData.pregnant || "",
    childrenInfo: initialData.childrenInfo || "",
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
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
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
              <Label htmlFor="accidentTime">Time</Label>
              <Input
                id="accidentTime"
                type="time"
                value={formData.accidentTime}
                onChange={(e) => handleChange("accidentTime", e.target.value)}
              />
            </div>
            <div>
              <Label>AM / PM</Label>
              <Select
                value={formData.accidentTimePeriod}
                onValueChange={(val) => handleChange("accidentTimePeriod", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="accidentLocation">Location of Accident</Label>
              <Input
                id="accidentLocation"
                value={formData.accidentLocation}
                onChange={(e) => handleChange("accidentLocation", e.target.value)}
              />
            </div>
            <div>
              <Label>How did it occur?</Label>
              <Select
                value={formData.accidentType}
                onValueChange={(val) => handleChange("accidentType", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {['Auto Collision','On the job','Other'].map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
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
              <Label>Were you aware of the accident?</Label>
              <Select
                value={formData.accidentAwareness}
                onValueChange={(val) => handleChange("accidentAwareness", val)}
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
              <Label htmlFor="acciddentAppearanceOfAmbulance">Did an ambulance appear at the scene?</Label>
              <textarea
                id="acciddentAppearanceOfAmbulance"
                className="w-full border rounded px-3 py-2 resize-y"
                rows={2}
                value={formData.acciddentAppearanceOfAmbulance}
                onChange={(e) => handleChange("acciddentAppearanceOfAmbulance", e.target.value)}
              />
            </div>
            <div>
              <Label>Did the airbag deploy?</Label>
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
              <Label>Were you wearing a seatbelt?</Label>
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
              <Label>Did the police appear at the scene?</Label>
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
            <div className="md:col-span-2">
              <Label htmlFor="anyPastAccidents">Any past accidents?</Label>
              <textarea
                id="anyPastAccidents"
                className="w-full border rounded px-3 py-2 resize-y"
                rows={3}
                value={formData.anyPastAccidents}
                onChange={(e) => handleChange("anyPastAccidents", e.target.value)}
              />
            </div>
            <div>
              <Label>Lost time from work?</Label>
              <Select
                value={formData.lostWorkYesNo}
                onValueChange={(val) => handleChange("lostWorkYesNo", val)}
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
              <Label htmlFor="lostWorkDates">Dates</Label>
              <Input
                id="lostWorkDates"
                value={formData.lostWorkDates}
                onChange={(e) => handleChange("lostWorkDates", e.target.value)}
              />
            </div>
            <div>
              <Label>Are you pregnant?</Label>
              <Select
                value={formData.pregnant}
                onValueChange={(val) => handleChange("pregnant", val)}
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
              <Label htmlFor="childrenInfo">Number &amp; Ages of Children</Label>
              <Input
                id="childrenInfo"
                value={formData.childrenInfo}
                onChange={(e) => handleChange("childrenInfo", e.target.value)}
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
                  {[
                    'Group Insurance',
                    'Blue Cross / Blue Shield',
                    'Worker\u2019s Compensation',
                    'Auto Insurance',
                    'Medicare',
                    'Personal Injury',
                    'Other Insurance',
                  ].map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
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
