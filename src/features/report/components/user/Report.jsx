import React, { useState } from "react"
import {
    Accordion,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import {
    RenderQuesFuncs,
    RenderTextAreaQues,
    RenderRadioQues,
    RenderCheckboxQues,
    RenderOtherQues
} from "@/utils/renderQuesFuncs"

import PATIENT_INFO from "../../../../constants/initial-reports"
import PainChartSection from "./HumanBody"

export default function Report() {
    const [formData, setFormData] = useState({})
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
    const [painMap, setPainMap] = useState({})

    const currentSection = PATIENT_INFO[currentSectionIndex]
    const baseClasses = "border rounded-md p-4 space-y-4 mb-4 bg-card shadow-sm"

    const renderQuestion = (question) => {
        switch (question.type) {
            case "group":
                return (
                    <RenderQuesFuncs
                        key={question.id}
                        question={question}
                        formData={formData}
                        setFormData={setFormData}
                        commonFieldsetClasses={baseClasses}
                    />
                )
            case "textarea":
                return (
                    <RenderTextAreaQues
                        key={question.id}
                        question={question}
                        formData={formData}
                        setFormData={setFormData}
                        commonFieldsetClasses={baseClasses}
                    />
                )
            case "radio":
                return (
                    <RenderRadioQues
                        key={question.id}
                        question={question}
                        formData={formData}
                        setFormData={setFormData}
                        commonFieldsetClasses={baseClasses}
                    />
                )
            case "checkbox":
                return (
                    <RenderCheckboxQues
                        key={question.id}
                        question={question}
                        formData={formData}
                        setFormData={setFormData}
                        commonFieldsetClasses={baseClasses}
                    />
                )
            case "other":
                return (
                    <RenderOtherQues
                        key={question.id}
                        question={question}
                        formData={formData}
                        setFormData={setFormData}
                        commonFieldsetClasses={baseClasses}
                    />
                )
            case "painChart":
                return (
                    <fieldset key={question.id} className={baseClasses}>
                        <legend className="text-sm font-medium text-muted-foreground px-2">
                            {question.label}
                        </legend>
                        <PainChartSection painMap={painMap} setPainMap={setPainMap} />
                    </fieldset>
                )
            default:
                return null
        }
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                console.log(formData)
            }}
            className="flex flex-col md:flex-row flex-1 h-full overflow-hidden"
        >
            {/* Sidebar: visible only on md+ screens */}
            <div className="hidden md:block md:w-80 border-r p-4 overflow-y-auto max-h-full">
                <h2 className="text-lg font-semibold mb-4">Initial Reports</h2>
                <Accordion
                    type="single"
                    collapsible
                    className="space-y-2"
                    value={currentSection.title}
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

            {/* Main form content */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto h-full">
                <Card>
                    <CardHeader>
                        <CardTitle>{currentSection.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {currentSection.questions.map((q) => renderQuestion(q))}
                        <div className="flex justify-end pt-4">
                            {currentSectionIndex < PATIENT_INFO.length - 1 ? (
                                <Button onClick={() => setCurrentSectionIndex((i) => i + 1)}>
                                    Next
                                </Button>
                            ) : (
                                <Button type="submit">Submit</Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    )
}