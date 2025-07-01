"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Appearance() {
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState("medium");
  const [colorScheme, setColorScheme] = useState("indigo");
  const [sidebarPosition, setSidebarPosition] = useState("left");
  const [buttonStyle, setButtonStyle] = useState("rounded");

  useEffect(() => {
    const fontStored = localStorage.getItem("font-size") || "medium";
    const sidebarStored = localStorage.getItem("sidebar-position") || "left";
    const buttonStored = localStorage.getItem("button-style") || "rounded";

    setFontSize(fontStored);
    setSidebarPosition(sidebarStored);
    setButtonStyle(buttonStored);

    document.documentElement.setAttribute("data-font", fontStored);
    document.documentElement.setAttribute("data-button", buttonStored);
  }, []);

  const handleFontChange = (val) => {
    setFontSize(val);
    document.documentElement.setAttribute("data-font", val);
    localStorage.setItem("font-size", val);
  };

  const handleSidebarChange = (val) => {
    setSidebarPosition(val);
    localStorage.setItem("sidebar-position", val);
    window.dispatchEvent(new Event("storage")); // trigger reactivity
  };

  const handleButtonStyleChange = (val) => {
    setButtonStyle(val);
    localStorage.setItem("button-style", val);
    document.documentElement.setAttribute("data-button", val);
  };

  return (
    <div className="w-full space-y-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">Appearance</CardTitle>
          <p className="text-sm text-muted-foreground">
            Customize your appearance settings.
          </p>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              label: "Theme",
              options: ["light", "dark"],
              value: theme,
              setter: setTheme,
            },
            {
              label: "Font Size",
              options: ["small", "medium", "large"],
              value: fontSize,
              setter: handleFontChange,
            },
            {
              label: "Color Scheme",
              options: ["indigo", "green", "red"],
              value: colorScheme,
              setter: setColorScheme,
            },
            {
              label: "Sidebar Position",
              options: ["left", "right", "hidden"],
              value: sidebarPosition,
              setter: handleSidebarChange,
            },
            {
              label: "Button Style",
              options: ["rounded", "square", "outline"],
              value: buttonStyle,
              setter: handleButtonStyleChange,
            },
          ].map(({ label, options, value, setter }) => (
            <div key={label}>
              <Label className="mb-2 block">{label}</Label>
              <RadioGroup value={value} onValueChange={setter}>
                {options.map((opt) => (
                  <div className="flex items-center space-x-2" key={opt}>
                    <RadioGroupItem value={opt} id={`${label}-${opt}`} />
                    <Label htmlFor={`${label}-${opt}`} className="capitalize">
                      {opt}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </CardContent>

        <div className="px-6 pb-6">
          <Button
            className="shadcn-button"
            onClick={() => alert("Appearance settings saved!")}
          >
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
}
