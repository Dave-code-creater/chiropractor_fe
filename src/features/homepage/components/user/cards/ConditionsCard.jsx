import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * List of current conditions for the patient.
 */
const conditions = [
    {
        name: "Sinusitis",
        severityLabel: "Moderate",
        severityClass: "bg-yellow-100 text-yellow-700",
        description: "Inflammation of the nasal passages causing congestion and discomfort.",
        primary: "Dr Steven Kalish",
    },
    {
        name: "Hypertension",
        severityLabel: "Severe",
        severityClass: "bg-red-100 text-red-700",
        description: "Elevated blood pressure requiring medication and monitoring.",
        primary: "Dr Amanda Chu",
    },
    {
        name: "Vitamin D Deficiency",
        severityLabel: "Mild",
        severityClass: "bg-blue-100 text-blue-700",
        description: "Low vitamin D levels affecting bone health and immunity.",
        primary: "Dr Steven Kalish",
    },
];

export default function ConditionsCard() {
    return (
        <Card className="col-span-3 col-start-1 row-span-4 row-start-6">
            <CardHeader>
                <CardTitle className="text-sm">Current Conditions</CardTitle>
            </CardHeader>
            <ScrollArea className="max-h-[300px]">
                <CardContent className="space-y-4 py-2">
                    {conditions.map(({ name, severityLabel, severityClass, description, primary }) => (
                        <div key={name} className="space-y-1">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium text-gray-900">{name}</p>
                                <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${severityClass}`}>{severityLabel}</span>
                            </div>
                            <p className="text-sm text-gray-700">{description}</p>
                            <p className="text-xs text-gray-500">Primary: {primary}</p>
                        </div>
                    ))}
                </CardContent>
            </ScrollArea>
        </Card>
    );
}
