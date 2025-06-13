import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { FolderIcon, PlusIcon, X } from "lucide-react"
import InitialReportForm from "./InitialReportForm"
import { useDeleteReportMutation } from "@/services/api"

export default function Report() {
    const [reports, setReports] = useState([{ id: 0, name: "" }])
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [deleteReport] = useDeleteReportMutation()

    const addReport = () => {
        setReports((prev) => {
            const newReport = { id: prev.length, name: "" }
            return [...prev, newReport]
        })
        setSelectedIndex(reports.length)
    }

    const handleDelete = async (id, e) => {
        e.stopPropagation()
        try {
            await deleteReport(id).unwrap()
        } catch (err) {
            console.error(err)
        }
        setReports((prev) => prev.filter((r) => r.id !== id))
    }

    const handleSubmit = (index, data) => {
        setReports((prev) => prev.map((r, i) => (i === index ? { ...r, ...data } : r)))
        setSelectedIndex(null)
    }

    const handleBack = () => {
        setSelectedIndex(null)
    }

    if (selectedIndex !== null) {
        return (
            <InitialReportForm
                onSubmit={(data) => handleSubmit(selectedIndex, data)}
                initialData={reports[selectedIndex]}
                onBack={handleBack}
            />
        )
    }

    return (
        <div className="p-4 md:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {reports.map((rep, idx) => (
                    <div
                        key={rep.id}
                        className="group relative rounded-md border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-gray-300 cursor-pointer"
                        onClick={() => setSelectedIndex(idx)}
                    >
                        <button
                            onClick={(e) => handleDelete(rep.id, e)}
                            className="absolute left-2 top-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <div className="flex h-20 items-center justify-center">
                            <FolderIcon className="h-12 w-12 text-gray-500 group-hover:text-gray-700" />
                        </div>
                        <div className="mt-2 text-center">
                            <span className="text-sm font-medium text-gray-900">{rep.name || `Accident ${idx + 1}`}</span>
                        </div>
                    </div>
                ))}
                <button
                    onClick={addReport}
                    className="flex flex-col items-center justify-center rounded-md border border-dashed border-gray-300 p-4 hover:border-gray-400"
                >
                    <PlusIcon className="h-8 w-8 text-gray-500" />
                    <span className="mt-2 text-sm">Add Report</span>
                </button>
            </div>
        </div>
    )
}

