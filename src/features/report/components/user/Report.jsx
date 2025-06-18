import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    FolderIcon,
    HomeIcon,
    FilesIcon,
    ImagesIcon,
    MusicIcon,
    VideoIcon,
    DownloadIcon,
    PlusIcon,
    X,
} from "lucide-react"
import InitialReportForm from "./InitialReportForm"
import { useDeleteReportMutation } from "@/services/reportApi"

export default function Report() {
    const REQUIRED_FIELDS = ["firstName", "lastName", "dob"]

    const [reports, setReports] = useState([
        {
            id: Date.now(),
            name: "",
            createdAt: new Date().toISOString(),
            painEvaluations: [{ painMap: {}, formData: {} }],
        },
    ])
    const [selectedId, setSelectedId] = useState(null)
    const [sortOption, setSortOption] = useState("date")
    const [deleteReport] = useDeleteReportMutation()

    const addReport = () => {
        const newReport = {
            id: Date.now(),
            name: "",
            createdAt: new Date().toISOString(),
            painEvaluations: [{ painMap: {}, formData: {} }],
        }
        setReports((prev) => [...prev, newReport])
        setSelectedId(newReport.id)
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

    const handleSubmit = (id, data) => {
        console.log("Submitting report:", id, data)
        setReports((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)))
        setSelectedId(null)
    }

    const handleBack = () => {
        setSelectedId(null)
    }

    const sortedReports = useMemo(() => {
        const list = [...reports]
        if (sortOption === "name") {
            list.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
        } else {
            list.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )
        }
        return list
    }, [reports, sortOption])

    if (selectedId !== null) {
        return (
            <InitialReportForm
                onSubmit={(data) => handleSubmit(selectedId, data)}
                initialData={reports.find((r) => r.id === selectedId)}
                onBack={handleBack}
                requiredFields={REQUIRED_FIELDS}
            />
        )
    }

    return (
        <div className="flex h-screen w-full">
            
            <div className="flex flex-1 flex-col">
                <div className="flex h-14 items-center justify-between border-b bg-gray-100 px-6 dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center gap-4">
                        <Select value={sortOption} onValueChange={setSortOption}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Sort" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="date">Newest</SelectItem>
                                <SelectItem value="name">Alphabetical</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={addReport}>
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Create
                        </Button>
                    </div>
                </div>
                <div className="flex-1 overflow-auto p-4 md:p-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {sortedReports.map((rep, idx) => (
                            <div
                                key={rep.id}
                                className="group relative rounded-md border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-gray-300 cursor-pointer"
                                onClick={() => setSelectedId(rep.id)}
                            >
                                <button
                                    onClick={(e) => handleDelete(rep.id, e)}
                                    className="absolute left-2 top-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                                <div className="flex h-20 w-full items-center justify-center">
                                    <FolderIcon className="h-12 w-12 text-gray-500 group-hover:text-gray-700" />
                                </div>
                                <div className="mt-4 text-center">
                                    <h3 className="text-sm font-medium text-gray-900">{rep.name || `Report ${idx + 1}`}</h3>
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
            </div>
        </div>
    )
}

