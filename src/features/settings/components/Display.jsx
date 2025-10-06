"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Display() {
  const [language, setLanguage] = useState("vi");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [timeZone, setTimeZone] = useState("UTC+7");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [weightUnit, setWeightUnit] = useState("kg");

  return (
    <div className="w-full space-y-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">Display Settings</CardTitle>
          <p className="text-sm text-muted-foreground">
            Customize how your data is presented across the platform.
          </p>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="mb-2 block">Language</Label>
            <RadioGroup value={language} onValueChange={setLanguage}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vi" id="lang-vi" />
                <Label htmlFor="lang-vi">Tiếng Việt</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="en" id="lang-en" />
                <Label htmlFor="lang-en">English</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="mb-2 block">Date Format</Label>
            <RadioGroup value={dateFormat} onValueChange={setDateFormat}>
              {["DD/MM/YYYY", "MM/DD/YYYY"].map((fmt) => (
                <div key={fmt} className="flex items-center space-x-2">
                  <RadioGroupItem value={fmt} id={`fmt-${fmt}`} />
                  <Label htmlFor={`fmt-${fmt}`}>{fmt}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="mb-2 block">Time Zone</Label>
            <RadioGroup value={timeZone} onValueChange={setTimeZone}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="UTC+7" id="tz-utc7" />
                <Label htmlFor="tz-utc7">UTC+7</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="tz-system" />
                <Label htmlFor="tz-system">System Default</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="mb-2 block">Measurement Units</Label>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">Height</span>
                <RadioGroup value={heightUnit} onValueChange={setHeightUnit}>
                  {["cm", "ft-in"].map((h) => (
                    <div key={h} className="flex items-center space-x-2">
                      <RadioGroupItem value={h} id={`height-${h}`} />
                      <Label htmlFor={`height-${h}`}>{h}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <span className="text-sm font-medium">Weight</span>
                <RadioGroup value={weightUnit} onValueChange={setWeightUnit}>
                  {["kg", "lb"].map((w) => (
                    <div key={w} className="flex items-center space-x-2">
                      <RadioGroupItem value={w} id={`weight-${w}`} />
                      <Label htmlFor={`weight-${w}`}>{w}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
        </CardContent>

        <div className="px-6 pb-6">
          <Button onClick={() => alert("Preferences saved!")}>
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
}
