import React from "react"
import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import PATIENT_INFO from "@/constants/initial-reports"

export default function SidebarNavigation({ currentSectionIndex, setCurrentSectionIndex }) {
    return (
        <div className="hidden md:block md:w-80 border-r p-4 overflow-y-auto max-h-full bg-card">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Initial Reports</h2>
            <Accordion
                type="single"
                collapsible
                value={PATIENT_INFO[currentSectionIndex].title}
            >
                {PATIENT_INFO.map((section, idx) => (
                    <AccordionItem
                        key={section.id}
                        value={section.title}
                        onClick={() => setCurrentSectionIndex(idx)}
                    >
                        <AccordionTrigger>{section.title}</AccordionTrigger>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}