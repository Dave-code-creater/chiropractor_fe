// src/features/report/user/Report.jsx
import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    FolderIcon,
    PlusIcon,
    X as XIcon,
    Edit3 as EditIcon,
    Trash2 as TrashIcon,
} from "lucide-react";

import InitialReportForm from "./components/InitialReportForm";
// ↓ replace the old hook…
import {
    useDeletePatientIntakeMutation,
    useDeleteInsuranceDetailsMutation,
    useDeletePainDescriptionMutation,
    useDeleteDetailsDescriptionMutation,
    useDeleteRecoveryMutation,
    useDeleteWorkImpactMutation,
    useDeleteHealthConditionMutation,
} from "@/services/reportApi";

export default function Report() {
    const [reports, setReports] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [sortOption, setSortOption] = useState("date");

    // ↓ now pull in each section‐delete hook
    const [deletePatientIntake] = useDeletePatientIntakeMutation();
    const [deleteInsuranceDetails] = useDeleteInsuranceDetailsMutation();
    const [deletePainDescription] = useDeletePainDescriptionMutation();
    const [deleteDetailsDescription] = useDeleteDetailsDescriptionMutation();
    const [deleteRecovery] = useDeleteRecoveryMutation();
    const [deleteWorkImpact] = useDeleteWorkImpactMutation();
    const [deleteHealthCondition] = useDeleteHealthConditionMutation();

    const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const addReport = () => {
        const newReport = {
            id: generateId(),
            name: "",
            createdAt: new Date().toISOString(),
            painEvaluations: [{ painMap: {}, formData: {} }],
        };
        setReports((prev) => [...prev, newReport]);
        setSelectedId(newReport.id);
    };

    // Automatically start a report if none exist
    useEffect(() => {
        if (reports.length === 0) {
            addReport();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ↓ updated delete logic
    const handleDelete = async (id) => {
        try {
            await Promise.all([
                deletePatientIntake(id).unwrap(),
                deleteInsuranceDetails(id).unwrap(),
                deletePainDescription(id).unwrap(),
                deleteDetailsDescription(id).unwrap(),
                deleteRecovery(id).unwrap(),
                deleteWorkImpact(id).unwrap(),
                deleteHealthCondition(id).unwrap(),
            ]);
        } catch (err) {
            console.error("Failed to delete report:", err);
        }
        setReports((prev) => prev.filter((r) => r.id !== id));
    };

    const handleSubmit = (id, data) => {
        setReports((prev) =>
            prev.map((r) => (r.id === id ? { ...r, ...data } : r))
        );
        setSelectedId(null);
    };

    const handleBack = () => setSelectedId(null);

    const sortedReports = useMemo(() => {
        const list = [...reports];
        if (sortOption === "name") {
            list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        } else {
            list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return list;
    }, [reports, sortOption]);

    if (selectedId !== null) {
        return (
            <InitialReportForm
                onSubmit={(data) => handleSubmit(selectedId, data)}
                initialData={reports.find((r) => r.id === selectedId)}
                onBack={handleBack}
                onDelete={handleDelete}
            />
        );
    }

    return (
        <div className="flex h-screen w-full">
            {/* Sidebar / Toolbar */}
            <div className="flex-1 flex flex-col">
                <div className="flex h-14 items-center justify-between border-b bg-gray-100 px-6 dark:border-gray-800 dark:bg-gray-900">
                    <Select value={sortOption} onValueChange={setSortOption}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Sort" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="date">Newest</SelectItem>
                            <SelectItem value="name">Alphabetical</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" size="sm" onClick={addReport}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Create
                    </Button>
                </div>

                {/* Grid of cards */}
                <div className="flex-1 overflow-auto p-4 md:p-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {sortedReports.map((rep, idx) => (
                            <div
                                key={rep.id}
                                className="group relative rounded-md border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-gray-300 cursor-pointer"
                                onClick={() => setSelectedId(rep.id)}
                            >
                                {/* Delete button (hover-only) */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(rep.id);
                                    }}
                                    className="absolute left-2 top-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100"
                                >
                                    <XIcon className="h-4 w-4" />
                                </button>

                                {/* ✏️ Edit button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedId(rep.id);
                                    }}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 p-3 md:p-2 focus:outline-none"
                                >
                                    <EditIcon />
                                </button>

                                {/* Folder icon */}
                                <div className="flex h-20 w-full items-center justify-center">
                                    <FolderIcon className="h-12 w-12 text-gray-500 group-hover:text-gray-700" />
                                </div>

                                {/* Report name */}
                                <div className="mt-4 text-center">
                                    <h3 className="text-sm font-medium text-gray-900">
                                        {rep.name || `Report ${idx + 1}`}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}