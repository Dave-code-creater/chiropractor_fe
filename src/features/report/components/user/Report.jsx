import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import InitialReportForm from "./InitialReportForm"

export default function Report() {
    const [reports, setReports] = useState([{ id: 0 }])

    const addReport = () => {
        setReports((prev) => [...prev, { id: prev.length }])
    }

    const handleSubmit = (index, data) => {
        console.log("submit report", index, data)
    }

    return (
        <div className="space-y-6">
            {reports.map((rep, idx) => (
                <InitialReportForm key={rep.id} onSubmit={(data) => handleSubmit(idx, data)} />
            ))}
            <div className="flex justify-center">
                <Button variant="outline" onClick={addReport}>Add Another Report</Button>
            </div>
        </div>
    )
}