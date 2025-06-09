import { useState } from "react";
import React from "react";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Info, Calendar as CalendarIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    HoverCard,
    HoverCardTrigger,
    HoverCardContent,
} from "@/components/ui/hover-card";
import { Calendar } from "@/components/ui/calendar";

import PATIENT_INFO from "../../../../constants/initial-reports";
import PainChartSection from "./HumanBody";

import IntakeForm from "./IntakeForm";
import InsuranceDetails from "./InsuranceDetails";
import PainEvaluation from "./PainEvaluation";
import DetailedDescription from "./DetailedDescription";
import Impact from "./Impact";
import HealthHistory from "./HealthHistory";


export default function Profile() {

    const [formData, setFormData] = useState({});
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [painMap, setPainMap] = useState({});

    const currentSection = PATIENT_INFO[currentSectionIndex];
    const filteredSections = PATIENT_INFO.filter((sec) =>
        sec.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const sections = [
        { id: "1", title: "Patient Intake Form", component: IntakeForm },
        { id: "2", title: "Accident & Insurance Details", component: InsuranceDetails },
        { id: "3", title: "Pain & Symptom Evaluation", component: PainEvaluation },
        { id: "4", title: "Detailed Symptom Description", component: DetailedDescription },
        { id: "5", title: "Recovery and Work Impact", component: Impact },
        { id: "6", title: "Extended Health History", component: HealthHistory },
    ];

    const CurrentSection = sections[currentSectionIndex].component;

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                console.log("Final Form Data:", formData);
            }}
        >
            <div className="flex h-screen overflow-hidden">
                <div className="w-80 border-r p-4 overflow-y-auto">
                    <h2 className="text-lg font-semibold mb-2">Initial Reports</h2>
                    <Accordion type="single" collapsible className="w-full space-y-2">
                        {sections.map((section, index) => (
                            <AccordionItem key={section.id} value={section.title}>
                                <AccordionTrigger onClick={() => setCurrentSectionIndex(index)}>
                                    {section.title}
                                </AccordionTrigger>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>{sections[currentSectionIndex].title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <CurrentSection formData={formData} setFormData={setFormData} />
                            <div className="pt-6 flex justify-end">
                                {currentSectionIndex < sections.length - 1 ? (
                                    <Button type="button" onClick={() => setCurrentSectionIndex(i => i + 1)}>
                                        Next
                                    </Button>
                                ) : (
                                    <Button type="submit">Submit</Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}