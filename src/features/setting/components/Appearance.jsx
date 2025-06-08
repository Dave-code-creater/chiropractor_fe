"use client";

import { useState } from "react";
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
                        { label: "Theme", options: ["light", "dark"], value: theme, setter: setTheme },
                        { label: "Font Size", options: ["small", "medium", "large"], value: fontSize, setter: setFontSize },
                        { label: "Color Scheme", options: ["indigo", "green", "red"], value: colorScheme, setter: setColorScheme },
                        { label: "Sidebar Position", options: ["left", "right", "hidden"], value: sidebarPosition, setter: setSidebarPosition },
                        { label: "Button Style", options: ["rounded", "square", "outline"], value: buttonStyle, setter: setButtonStyle },
                    ].map(({ label, options, value, setter }) => (
                        <div key={label}>
                            <Label className="mb-2 block">{label}</Label>
                            <RadioGroup value={value} onValueChange={setter}>
                                {options.map((opt) => (
                                    <div className="flex items-center space-x-2" key={opt}>
                                        <RadioGroupItem value={opt} id={`${label}-${opt}`} />
                                        <Label htmlFor={`${label}-${opt}`} className="capitalize">{opt}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    ))}
                </CardContent>

                <div className="px-6 pb-6">
                    <Button onClick={() => alert("Appearance settings saved!")}>Save Changes</Button>
                </div>
            </Card>
        </div>
    );
}