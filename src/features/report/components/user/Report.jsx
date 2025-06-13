import React, { useState } from "react"
import { useDispatch } from "react-redux"
import SidebarNavigation from "./SidebarNavigation"
import SectionRenderer from "./SectionRender";
import {
    useSubmitPatientInfoMutation,
    useSubmitAccidentDetailsMutation,
    useSubmitPainEvaluationMutation,
    useSubmitSymptomDetailsMutation,
    useSubmitRecoveryImpactMutation,
    useSubmitHealthHistoryMutation,
} from "../../reportAPI"
import PATIENT_INFO from "@/constants/initial-reports"

export default function Report() {
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({})
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
    const [painMap, setPainMap] = useState({})

    const extractSectionData = (sectionId) => {
        const section = PATIENT_INFO.find((s) => s.id === sectionId)
        const fields = section.questions.flatMap((q) =>
            q.fields ? q.fields : [q]
        )
        const ids = fields.map((f) => f.id)
        return Object.fromEntries(
            Object.entries(formData).filter(([k]) => ids.includes(k))
        )
    }

    const onSectionSubmit = async (sectionId) => {
        const payload = extractSectionData(sectionId)
        try {
            switch (sectionId) {
                case "1":
                    await submitPatientInfo(payload)
                    break
                case "2":
                    await submitAccidentDetails(payload)
                    break
                case "3":
                    await submitPainEvaluation(payload)
                    break
                case "4":
                    await submitSymptomDetails(payload)
                    break
                case "5":
                    await submitRecoveryImpact(payload)
                    break
                case "6":
                    await submitHealthHistory(payload)
                    break
                default:
                    console.warn("Unknown section", sectionId)
            }
        } catch (err) {
            console.error("Submission failed:", err)
        }
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                onSectionSubmit(PATIENT_INFO[currentSectionIndex].id)
            }}
            className="flex flex-col md:flex-row flex-1 h-full overflow-hidden"
        >
            <SidebarNavigation
                currentSectionIndex={currentSectionIndex}
                setCurrentSectionIndex={setCurrentSectionIndex}
            />
            <SectionRenderer
                currentSectionIndex={currentSectionIndex}
                setCurrentSectionIndex={setCurrentSectionIndex}
                formData={formData}
                setFormData={setFormData}
                painMap={painMap}
                setPainMap={setPainMap}
                onSectionSubmit={onSectionSubmit}
            />
        </form>
    )
}