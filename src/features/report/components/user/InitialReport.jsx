import { useState } from "react";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import INITIAL_REPORT_SECTIONS from "../../../../constants/initial-reports";
import SectionForm from "./SectionForm";

export default function InitialReport() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [responses, setResponses] = useState({});

    const handleSectionSubmit = (data) => {
        const currentId = INITIAL_REPORT_SECTIONS[currentIndex].id;
        setResponses((prev) => ({ ...prev, [currentId]: data }));
        if (currentIndex < INITIAL_REPORT_SECTIONS.length - 1) {
            setCurrentIndex((i) => i + 1);
        } else {
            console.log("All sections data:", { ...responses, [currentId]: data });
        }
    };

    const currentSection = INITIAL_REPORT_SECTIONS[currentIndex];

    return (
        <div className="flex h-screen overflow-hidden">
            <div className="w-80 border-r p-4 overflow-y-auto">
                <h2 className="text-lg font-semibold mb-2">Initial Reports</h2>
                <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-2"
                    value={currentSection.title}
                >
                    {INITIAL_REPORT_SECTIONS.map((section) => (
                        <AccordionItem key={section.id} value={section.title}>
                            <AccordionTrigger
                                onClick={() =>
                                    setCurrentIndex(
                                        INITIAL_REPORT_SECTIONS.findIndex(
                                            (s) => s.id === section.id
                                        )
                                    )
                                }
                            >
                                {section.title}
                            </AccordionTrigger>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
                <SectionForm
                    sectionId={currentSection.id}
                    isLast={currentIndex === INITIAL_REPORT_SECTIONS.length - 1}
                    onSubmit={handleSectionSubmit}
                />
            </div>
        </div>
    );
}
