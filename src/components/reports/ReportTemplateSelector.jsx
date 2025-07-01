import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  X,
  Search,
  Folder,
  FolderOpen,
  FileText,
  Clock,
  User,
  Shield,
  Heart,
  Briefcase,
  Activity,
  Calendar,
  Star,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Plus,
} from "lucide-react";

const ReportTemplateSelector = ({ isOpen, onClose, onSelectTemplate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set());

  // Enhanced folder structure with templates
  const [folderStructure] = useState({
    "initial-consultation": {
      id: "initial-consultation",
      name: "Initial Consultation",
      description: "Complete patient intake and assessment forms",
      icon: User,
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
      templates: [
        {
          id: "patient-intake",
          name: "Patient Intake Form",
          description: "Comprehensive patient information and medical history",
          icon: FileText,
          color: "bg-blue-100",
          iconColor: "text-blue-600",
          fields: [
            "Personal Information",
            "Medical History",
            "Current Symptoms",
            "Emergency Contacts",
          ],
          estimatedTime: "15-20 min",
          required: true,
          formType: "PatientIntakeForm",
        },
        {
          id: "insurance-details",
          name: "Insurance Information",
          description: "Insurance coverage and billing details",
          icon: Shield,
          color: "bg-green-100",
          iconColor: "text-green-600",
          fields: [
            "Primary Insurance",
            "Secondary Insurance",
            "Coverage Details",
            "Authorization",
          ],
          estimatedTime: "5-10 min",
          required: true,
          formType: "InsuranceDetailsForm",
        },
        {
          id: "health-questionnaire",
          name: "Health Questionnaire",
          description: "Detailed health assessment and lifestyle factors",
          icon: Heart,
          color: "bg-red-100",
          iconColor: "text-red-600",
          fields: [
            "Health History",
            "Medications",
            "Allergies",
            "Lifestyle Factors",
          ],
          estimatedTime: "10-15 min",
          required: false,
          formType: "HealthConditionForm",
        },
        {
          id: "work-injury-assessment",
          name: "Work Injury Assessment",
          description: "Workplace injury evaluation and documentation",
          icon: Briefcase,
          color: "bg-orange-100",
          iconColor: "text-orange-600",
          fields: [
            "Incident Details",
            "Work Environment",
            "Injury Mechanism",
            "Workers Comp",
          ],
          estimatedTime: "15-20 min",
          required: false,
          formType: "WorkImpactForm",
        },
        {
          id: "pain-evaluation",
          name: "Pain Evaluation Form",
          description: "Comprehensive pain assessment and tracking",
          icon: Activity,
          color: "bg-purple-100",
          iconColor: "text-purple-600",
          fields: [
            "Pain Location",
            "Pain Scale",
            "Pain Triggers",
            "Impact on Daily Life",
          ],
          estimatedTime: "10-15 min",
          required: true,
          formType: "PainEvaluationForm",
        },
      ],
    },
    "follow-up": {
      id: "follow-up",
      name: "Follow-up Visits",
      description: "Progress tracking and treatment updates",
      icon: Calendar,
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
      templates: [
        {
          id: "progress-update",
          name: "Progress Update",
          description: "Track patient improvement and treatment response",
          icon: Activity,
          color: "bg-green-100",
          iconColor: "text-green-600",
          fields: [
            "Symptom Changes",
            "Treatment Response",
            "Functional Improvement",
            "Next Steps",
          ],
          estimatedTime: "5-10 min",
          required: false,
          formType: "DetailedDescriptionForm",
        },
        {
          id: "treatment-adjustment",
          name: "Treatment Plan Adjustment",
          description: "Modify treatment plan based on progress",
          icon: FileText,
          color: "bg-blue-100",
          iconColor: "text-blue-600",
          fields: [
            "Current Status",
            "Plan Modifications",
            "New Goals",
            "Timeline Updates",
          ],
          estimatedTime: "10-15 min",
          required: false,
          formType: "DetailedDescriptionForm",
        },
        {
          id: "discharge-planning",
          name: "Discharge Planning",
          description: "Prepare patient for treatment completion",
          icon: Star,
          color: "bg-yellow-100",
          iconColor: "text-yellow-600",
          fields: [
            "Treatment Outcomes",
            "Home Care Instructions",
            "Maintenance Plan",
            "Follow-up Schedule",
          ],
          estimatedTime: "15-20 min",
          required: false,
          formType: "DetailedDescriptionForm",
        },
      ],
    },
    "specialized-assessments": {
      id: "specialized-assessments",
      name: "Specialized Assessments",
      description: "Detailed injury and condition evaluations",
      icon: Star,
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
      templates: [
        {
          id: "spinal-assessment",
          name: "Spinal Assessment",
          description: "Comprehensive spinal examination and evaluation",
          icon: Activity,
          color: "bg-purple-100",
          iconColor: "text-purple-600",
          fields: [
            "Range of Motion",
            "Neurological Tests",
            "Orthopedic Tests",
            "Diagnostic Imaging",
          ],
          estimatedTime: "20-30 min",
          required: false,
          formType: "DetailedDescriptionForm",
        },
        {
          id: "injury-documentation",
          name: "Injury Documentation",
          description:
            "Detailed documentation of injury mechanism and presentation",
          icon: FileText,
          color: "bg-red-100",
          iconColor: "text-red-600",
          fields: [
            "Injury History",
            "Physical Examination",
            "Diagnostic Tests",
            "Treatment Plan",
          ],
          estimatedTime: "15-25 min",
          required: false,
          formType: "DetailedDescriptionForm",
        },
        {
          id: "functional-assessment",
          name: "Functional Assessment",
          description: "Evaluate patient functional capacity and limitations",
          icon: User,
          color: "bg-indigo-100",
          iconColor: "text-indigo-600",
          fields: [
            "Activities of Daily Living",
            "Work Capacity",
            "Recreational Activities",
            "Limitations",
          ],
          estimatedTime: "20-25 min",
          required: false,
          formType: "WorkImpactForm",
        },
      ],
    },
  });

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const selectFolder = (folderId) => {
    setSelectedFolder(folderId);
  };

  const goBack = () => {
    setSelectedFolder(null);
  };

  const handleTemplateSelect = (template, folder) => {
    const templateData = {
      ...template,
      folder: folder.name,
      folderId: folder.id,
    };

    onSelectTemplate(templateData);
    onClose();
  };

  const handleBlankReportSelect = () => {
    onSelectTemplate({
      id: "blank-report",
      name: "Blank Report",
      formType: "InitialReportForm",
      folder: "Custom",
      description: "Complete comprehensive report with all sections",
    });
    onClose();
  };

  // Filter templates based on search
  const getFilteredFolders = () => {
    if (!searchTerm) return folderStructure;

    const filtered = {};
    Object.entries(folderStructure).forEach(([key, folder]) => {
      const matchingTemplates = folder.templates.filter(
        (template) =>
          template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          folder.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      if (matchingTemplates.length > 0) {
        filtered[key] = {
          ...folder,
          templates: matchingTemplates,
        };
      }
    });

    return filtered;
  };

  const filteredFolders = getFilteredFolders();

  const FolderView = () => (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Folder Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(filteredFolders).map(([key, folder]) => {
          const IconComponent = folder.icon;
          const isExpanded = expandedFolders.has(key);

          return (
            <div key={key} className="space-y-2">
              {/* Folder Header */}
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${folder.color}`}
                onClick={() => selectFolder(key)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                        <IconComponent
                          className={`h-5 w-5 ${folder.iconColor}`}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {folder.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {folder.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {folder.templates.length} templates
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Preview (when expanded) */}
              {isExpanded && (
                <div className="ml-4 space-y-2">
                  {folder.templates.slice(0, 3).map((template) => {
                    const TemplateIcon = template.icon;
                    return (
                      <div
                        key={template.id}
                        className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleTemplateSelect(template, folder)}
                      >
                        <div className={`p-1 rounded ${template.color}`}>
                          <TemplateIcon
                            className={`h-3 w-3 ${template.iconColor}`}
                          />
                        </div>
                        <span className="font-medium">{template.name}</span>
                        {template.required && (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                  {folder.templates.length > 3 && (
                    <div className="text-xs text-gray-500 pl-6">
                      +{folder.templates.length - 3} more templates
                    </div>
                  )}
                </div>
              )}

              {/* Expand/Collapse Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => toggleFolder(key)}
              >
                {isExpanded ? (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Hide Templates
                  </>
                ) : (
                  <>
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Show Templates
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>

      {Object.keys(filteredFolders).length === 0 && (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No templates found
          </h3>
          <p className="text-gray-600">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );

  const TemplateView = () => {
    const folder = folderStructure[selectedFolder];
    if (!folder) return null;

    const FolderIcon = folder.icon;

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={goBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className={`p-2 rounded-lg ${folder.color}`}>
              <FolderIcon className={`h-5 w-5 ${folder.iconColor}`} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{folder.name}</h2>
              <p className="text-sm text-gray-600">{folder.description}</p>
            </div>
          </div>
          <Badge variant="secondary">{folder.templates.length} templates</Badge>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {folder.templates.map((template) => {
            const TemplateIcon = template.icon;
            return (
              <Card
                key={template.id}
                className="cursor-pointer transition-all hover:shadow-md hover:border-blue-300"
                onClick={() => handleTemplateSelect(template, folder)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${template.color}`}>
                        <TemplateIcon
                          className={`h-5 w-5 ${template.iconColor}`}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {template.name}
                        </CardTitle>
                        <CardDescription>
                          {template.description}
                        </CardDescription>
                      </div>
                    </div>
                    {template.required && (
                      <Badge variant="destructive" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Estimated Time */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Estimated time: {template.estimatedTime}</span>
                    </div>
                  </div>

                  {/* Fields Preview */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">
                      Includes:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {template.fields.slice(0, 3).map((field) => (
                        <Badge
                          key={field}
                          variant="outline"
                          className="text-xs"
                        >
                          {field}
                        </Badge>
                      ))}
                      {template.fields.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.fields.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full mt-3"
                    onClick={() => handleTemplateSelect(template, folder)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Use This Template
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">
                {selectedFolder ? "Select Template" : "Choose Report Template"}
              </DialogTitle>
              <DialogDescription>
                {selectedFolder
                  ? "Choose a template from this category to get started"
                  : "Select a category to view available templates"}
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          {selectedFolder ? <TemplateView /> : <FolderView />}
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleBlankReportSelect}
              className="flex items-center space-x-2 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 hover:from-gray-100 hover:to-gray-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span>Start Blank Report</span>
            </Button>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
                <span>Must be completed</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Estimated completion time</span>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportTemplateSelector;
