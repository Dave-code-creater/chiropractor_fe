"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Notifications() {
  const [reminders, setReminders] = useState({
    Email: false,
    SMS: false,
    "Phone Call": false,
  });
  const [reminderTimes, setReminderTimes] = useState(["08:00", "18:00"]);
  const [followUp, setFollowUp] = useState("1day");
  const [leadTime, setLeadTime] = useState("24h");

  const handleReminderChange = (label) => {
    setReminders((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleTimeChange = (index, newTime) => {
    const newTimes = [...reminderTimes];
    newTimes[index] = newTime;
    setReminderTimes(newTimes);
  };

  const addReminderTime = () => {
    setReminderTimes([...reminderTimes, ""]);
  };

  const removeReminderTime = (index) => {
    const updated = reminderTimes.filter((_, i) => i !== index);
    setReminderTimes(updated);
  };

  return (
    <div className="w-full space-y-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">Notifications</CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure how you want to receive appointment updates and health
            alerts.
          </p>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="mb-4 block">Appointment Reminders</Label>
            {Object.keys(reminders).map((label) => (
              <div key={label} className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id={label}
                  checked={reminders[label]}
                  onCheckedChange={() => handleReminderChange(label)}
                  className="h-4 w-4 "
                />
                <Label htmlFor={label}>{label}</Label>
              </div>
            ))}
          </div>

          <div>
            <Label className="mb-2 block">Reminder Times</Label>
            <div className="space-y-2">
              {reminderTimes.map((time, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    className="w-full"
                  />
                  <Button
                    variant="destructive"
                    type="button"
                    size="sm"
                    onClick={() => removeReminderTime(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addReminderTime}
              >
                + Add Time
              </Button>
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Follow-Up Check-Ins</Label>
            <RadioGroup value={followUp} onValueChange={setFollowUp}>
              {["1day", "3days", "none"].map((val) => (
                <div key={val} className="flex items-center space-x-2">
                  <RadioGroupItem value={val} id={`follow-${val}`} />
                  <Label htmlFor={`follow-${val}`}>
                    {val === "1day"
                      ? "1 Day"
                      : val === "3days"
                        ? "3 Days"
                        : "None"}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="mb-2 block">Reminder Lead Time</Label>
            <RadioGroup value={leadTime} onValueChange={setLeadTime}>
              {["24h", "2h", "30m"].map((val) => (
                <div key={val} className="flex items-center space-x-2">
                  <RadioGroupItem value={val} id={`lead-${val}`} />
                  <Label htmlFor={`lead-${val}`}>
                    {val === "24h"
                      ? "24 Hours"
                      : val === "2h"
                        ? "2 Hours"
                        : "30 Minutes"}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>

        <div className="px-6 pb-6">
          <Button onClick={() => alert("Notifications settings saved!")}>
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
}
