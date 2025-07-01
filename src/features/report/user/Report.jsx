// src/features/report/user/Report.jsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FolderIcon,
  PlusIcon,
  X as XIcon,
  Edit3 as EditIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  Copy as CopyIcon,
  Star as StarIcon,
  Calendar as CalendarIcon,
  FileText as FileTextIcon,
  Clock as ClockIcon,
  RefreshCw as RefreshIcon,
} from "lucide-react";

import TemplateFormRouter from "./components/TemplateFormRouter";
import ReportTemplateSelector from "@/components/reports/ReportTemplateSelector";
import {
  useGetAllReportsQuery,
  useCreateReportMutation,
  useUpdateReportMutation,
  useDeleteReportMutation,
  useDeletePatientIntakeMutation,
  useDeleteInsuranceDetailsMutation,
  useDeletePainDescriptionMutation,
  useDeleteDetailsDescriptionMutation,
  useDeleteRecoveryMutation,
  useDeleteWorkImpactMutation,
  useDeleteHealthConditionMutation,
} from "@/services/reportApi";

const REPORT_CATEGORIES = [
  { value: "all", label: "All Reports" },
  { value: "consultation", label: "Consultations" },
  { value: "follow-up", label: "Follow-ups" },
  { value: "assessment", label: "Assessments" },
  { value: "completed", label: "Completed" },
  { value: "draft", label: "Drafts" },
];

// Memoized components for better performance
const ReportCard = React.memo(({ report, onEdit, onDuplicate, onDelete }) => {
  const templateInfo = useMemo(() => {
    if (report.templateData) {
      return {
        name: report.templateData.name,
        folder: report.templateData.folder,
        required: report.templateData.required,
        estimatedTime: report.templateData.estimatedTime,
      };
    }
    return {
      name: report.name || "Untitled Report",
      folder: "Custom",
      required: false,
      estimatedTime: "Variable",
    };
  }, [report.templateData, report.name]);

  const getCategoryIcon = useCallback((category) => {
    switch (category) {
      case "consultation":
      case "initial-consultation":
        return FileTextIcon;
      case "follow-up":
        return CalendarIcon;
      case "assessment":
      case "specialized-assessments":
        return StarIcon;
      default:
        return FileTextIcon;
    }
  }, []);

  const CategoryIcon = getCategoryIcon(report.category);

  const handleEdit = useCallback(() => onEdit(report.id), [onEdit, report.id]);
  const handleDuplicate = useCallback(
    () => onDuplicate(report.id),
    [onDuplicate, report.id],
  );
  const handleDelete = useCallback(
    () => onDelete(report.id),
    [onDelete, report.id],
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <CategoryIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                {report.name}
              </h3>
              <p className="text-xs text-gray-500">{templateInfo.folder}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={handleEdit}>
              <EditIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDuplicate}>
              <CopyIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete}>
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <Badge
              variant={report.status === "completed" ? "default" : "secondary"}
            >
              {report.status}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Created</span>
            <span className="text-gray-900">{report.date}</span>
          </div>

          {report.completionPercentage !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Progress</span>
                <span className="text-gray-900">
                  {report.completionPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${report.completionPercentage}%` }}
                />
              </div>
            </div>
          )}

          {templateInfo.estimatedTime && (
            <div className="flex items-center text-xs text-gray-500">
              <ClockIcon className="h-3 w-3 mr-1" />
              {templateInfo.estimatedTime}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ReportCard.displayName = "ReportCard";

const LoadingState = React.memo(() => (
  <div className="text-center py-12">
    <RefreshIcon className="h-8 w-8 text-gray-400 mx-auto mb-4 animate-spin" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Loading reports...
    </h3>
    <p className="text-gray-600">Please wait while we fetch your reports</p>
  </div>
));

LoadingState.displayName = "LoadingState";

const ErrorState = React.memo(({ error, onRetry }) => (
  <div className="text-center py-12">
    <FileTextIcon className="h-12 w-12 text-red-300 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Failed to load reports
    </h3>
    <p className="text-gray-600 mb-4">
      {error?.data?.message ||
        error?.message ||
        "Something went wrong while loading your reports"}
    </p>
    <Button onClick={onRetry} variant="outline">
      <RefreshIcon className="h-4 w-4 mr-2" />
      Try Again
    </Button>
  </div>
));

ErrorState.displayName = "ErrorState";

const EmptyState = React.memo(
  ({ searchTerm, selectedCategory, onCreateReport }) => (
    <div className="text-center py-12">
      <FileTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {searchTerm || selectedCategory !== "all"
          ? "No reports found"
          : "No reports yet"}
      </h3>
      <p className="text-gray-600 mb-4">
        {searchTerm || selectedCategory !== "all"
          ? "Try adjusting your search or filter criteria"
          : "Create your first patient report to get started"}
      </p>
      {!searchTerm && selectedCategory === "all" && (
        <Button onClick={onCreateReport}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Create First Report
        </Button>
      )}
    </div>
  ),
);

EmptyState.displayName = "EmptyState";

export default function Report() {
  const [selectedId, setSelectedId] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // API hooks
  const {
    data: apiReports = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllReportsQuery();

  // Fallback sample data when backend is not available
  const fallbackReports = useMemo(
    () => [
      {
        id: "demo-001",
        name: "John Smith - Patient Intake",
        date: "2025-01-18",
        category: "consultation",
        status: "completed",
        templateData: {
          id: "patient-intake",
          name: "Patient Intake Form",
          folder: "Initial Consultation",
          required: true,
          estimatedTime: "15-20 min",
        },
        createdAt: "2025-01-18T10:30:00Z",
        completionPercentage: 100,
      },
      {
        id: "demo-002",
        name: "Sarah Wilson - Pain Assessment",
        date: "2025-01-17",
        category: "assessment",
        status: "draft",
        templateData: {
          id: "pain-evaluation",
          name: "Pain Evaluation Form",
          folder: "Specialized Assessments",
          required: true,
          estimatedTime: "10-15 min",
        },
        createdAt: "2025-01-17T14:15:00Z",
        completionPercentage: 65,
      },
      {
        id: "demo-003",
        name: "Mike Johnson - Insurance Details",
        date: "2025-01-16",
        category: "consultation",
        status: "completed",
        templateData: {
          id: "insurance-details",
          name: "Insurance Information",
          folder: "Initial Consultation",
          required: true,
          estimatedTime: "5-10 min",
        },
        createdAt: "2025-01-16T09:45:00Z",
        completionPercentage: 100,
      },
    ],
    [],
  );

  // Use API data if available, otherwise use fallback data
  const reports = useMemo(() => {
    return isError ? fallbackReports : apiReports;
  }, [isError, fallbackReports, apiReports]);

  const [createReport] = useCreateReportMutation();
  const [updateReport] = useUpdateReportMutation();
  const [deleteReport] = useDeleteReportMutation();
  const [deletePatientIntake] = useDeletePatientIntakeMutation();
  const [deleteInsuranceDetails] = useDeleteInsuranceDetailsMutation();
  const [deletePainDescription] = useDeletePainDescriptionMutation();
  const [deleteDetailsDescription] = useDeleteDetailsDescriptionMutation();
  const [deleteRecovery] = useDeleteRecoveryMutation();
  const [deleteWorkImpact] = useDeleteWorkImpactMutation();
  const [deleteHealthCondition] = useDeleteHealthConditionMutation();

  const handleCreateReport = useCallback(() => {
    setShowTemplateSelector(true);
  }, []);

  const generateReportName = useCallback((template) => {
    const timestamp = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // Generate more descriptive names based on template type
    if (template.id === "blank-report") {
      return `New Report - ${timestamp}`;
    }

    const templateTypeNames = {
      "patient-intake": `Patient Intake - ${timestamp}`,
      "insurance-details": `Insurance Details - ${timestamp}`,
      "pain-evaluation": `Pain Assessment - ${timestamp}`,
      "health-questionnaire": `Health Questionnaire - ${timestamp}`,
      "work-injury-assessment": `Work Injury Report - ${timestamp}`,
      "progress-update": `Progress Update - ${timestamp}`,
      "treatment-adjustment": `Treatment Plan - ${timestamp}`,
      "spinal-assessment": `Spinal Assessment - ${timestamp}`,
      "functional-assessment": `Functional Assessment - ${timestamp}`,
    };

    return templateTypeNames[template.id] || `${template.name} - ${timestamp}`;
  }, []);

  const handleTemplateSelect = useCallback(
    async (template) => {
      setSelectedTemplate(template);
      setShowTemplateSelector(false);

      try {
        // Create a new report in the backend
        const newReportData = {
          name: generateReportName(template),
          template_type: template.folder?.toLowerCase().includes("consultation")
            ? "consultation"
            : template.folder?.toLowerCase().includes("follow")
              ? "follow-up"
              : "assessment",
          status: "draft",
          template_data: template,
          completion_percentage: 0,
        };

        const result = await createReport(newReportData).unwrap();
        setSelectedId(result.id);
      } catch (error) {
        console.error("Failed to create report:", error);
        // Fallback to local state if API fails
        const newReport = {
          id: Date.now(), // Temporary ID
          name: generateReportName(template),
          date: new Date().toISOString().split("T")[0],
          category: template.folder?.toLowerCase().includes("consultation")
            ? "consultation"
            : template.folder?.toLowerCase().includes("follow")
              ? "follow-up"
              : "assessment",
          status: "draft",
          templateData: template,
        };
        setSelectedId(newReport.id);
      }
    },
    [createReport, generateReportName],
  );

  const handleSubmit = useCallback(
    async (reportId, data) => {
      

      try {
        // Update the report in the backend
        await updateReport({
          id: reportId,
          data: {
            status: "completed",
            completion_percentage: 100,
            ...data,
          },
        }).unwrap();
      } catch (error) {
        console.error("Failed to update report:", error);
      }

      // Go back to the main view
      handleBack();
    },
    [updateReport],
  );

  const handleBack = useCallback(() => {
    setSelectedId(null);
    setSelectedTemplate(null);
  }, []);

  const handleDelete = useCallback(
    async (reportId) => {
      try {
        await deleteReport(reportId).unwrap();
        handleBack();
      } catch (error) {
        console.error("Failed to delete report:", error);
      }
    },
    [deleteReport, handleBack],
  );

  const handleEdit = useCallback(
    (reportId) => {
      const report = reports.find((r) => r.id === reportId);
      if (report) {
        setSelectedTemplate(report.templateData);
        setSelectedId(reportId);
      }
    },
    [reports],
  );

  const handleDuplicate = useCallback(
    async (reportId) => {
      const report = reports.find((r) => r.id === reportId);
      if (report) {
        try {
          const duplicatedReportData = {
            name: `${report.name} (Copy)`,
            template_type: report.category,
            status: "draft",
            template_data: report.templateData,
            completion_percentage: 0,
          };
          await createReport(duplicatedReportData).unwrap();
        } catch (error) {
          console.error("Failed to duplicate report:", error);
        }
      }
    },
    [reports, createReport],
  );

  // Memoized search handler
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Filter reports based on search term and category
  const filteredReports = useMemo(() => {
    // Remove duplicates based on ID and ensure unique entries
    const uniqueReports = reports.filter(
      (report, index, self) =>
        index === self.findIndex((r) => r.id === report.id),
    );

    return uniqueReports.filter((report) => {
      const matchesSearch =
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.templateData?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        report.templateData?.folder
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || report.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [reports, searchTerm, selectedCategory]);

  // If a report is selected, show the form
  if (selectedId !== null) {
    const selectedReport = reports.find((r) => r.id === selectedId);
    return (
      <TemplateFormRouter
        selectedTemplate={selectedTemplate}
        onSubmit={(data) => handleSubmit(selectedId, data)}
        initialData={selectedReport}
        onBack={handleBack}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Patient Reports
            </h1>
            <p className="text-gray-600">
              Manage patient documentation and forms
            </p>
          </div>
          <Button
            onClick={handleCreateReport}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : filteredReports.length === 0 ? (
          <EmptyState
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            onCreateReport={handleCreateReport}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <ReportCard
                key={`report-${report.id}`}
                report={report}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Template Selector Modal */}
      <ReportTemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelectTemplate={handleTemplateSelect}
      />
    </div>
  );
}
