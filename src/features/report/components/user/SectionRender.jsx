import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import QuestionRenderer from "./QuestionRender"
import PATIENT_INFO from "@/constants/initial-reports"

export default function SectionRenderer({
    currentSectionIndex,
    setCurrentSectionIndex,
    formData,
    setFormData,
    painMap,
    setPainMap,
    onSectionSubmit
}) {
    const currentSection = PATIENT_INFO[currentSectionIndex]
    const baseClasses = "border rounded-md p-4 space-y-4 mb-4 bg-card shadow-sm"

    const handleNext = () => {
        onSectionSubmit(currentSection.id)
        if (currentSectionIndex < PATIENT_INFO.length - 1) {
            setCurrentSectionIndex((i) => i + 1)
        }
    }

    return (
        <div className="flex-1 p-4 md:p-6 overflow-y-auto h-full">
            <Card>
                <CardHeader>
                    <CardTitle>{currentSection.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <QuestionRenderer
                        questions={currentSection.questions}
                        formData={formData}
                        setFormData={setFormData}
                        baseClasses={baseClasses}
                        painMap={painMap}
                        setPainMap={setPainMap}
                    />
                    <div className="flex justify-end pt-4">
                        {currentSectionIndex < PATIENT_INFO.length - 1 ? (
                            <Button onClick={handleNext}>Next</Button>
                        ) : (
                            <Button onClick={handleNext} type="submit">
                                Submit
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}