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
  Car,
  AlertTriangle,
} from "lucide-react";

const ReportTemplateSelector = ({ 
  isOpen, 
  onClose, 
  onSelectTemplate, 
  patientView = false,
  incidentTypes = [] 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Filter incident types based on search
  const getFilteredIncidents = () => {
    if (!searchTerm) return incidentTypes;
    
    return incidentTypes.filter(incident =>
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleIncidentSelect = (incident) => {
    setSelectedIncident(incident);
  };

  const handleFormSelect = (incident, formType) => {
    const template = {
      id: formType,
      name: `${incident.title} - ${formType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
      formType: formType,
      incidentType: incident.id,
      folder: incident.title,
      description: incident.description
    };
    
    onSelectTemplate(template);
    onClose();
  };

  const handleCreateIncident = (incident) => {
    const template = {
      id: 'new-incident',
      name: incident.title,
      formType: 'InitialReportForm',
      incidentType: incident.id,
      folder: incident.title,
      description: incident.description
    };
    
    onSelectTemplate(template);
    onClose();
  };

  const goBack = () => {
    setSelectedIncident(null);
  };

  const IncidentListView = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search incident types..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Incident Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {getFilteredIncidents().map((incident) => {
          const Icon = incident.icon;
          return (
            <Card 
              key={incident.id}
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 group border-2 hover:border-primary/30"
              onClick={() => handleIncidentSelect(incident)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl ${incident.color} group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-8 w-8 ${incident.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {incident.title}
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {incident.description}
                    </CardDescription>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant={incident.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                        {incident.priority === 'high' ? 'Urgent' : 'Standard'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {incident.forms?.length || 0} forms
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {getFilteredIncidents().length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No incident types found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or contact support for assistance.
          </p>
        </div>
      )}
    </div>
  );

  const IncidentDetailView = () => {
    if (!selectedIncident) return null;

    const Icon = selectedIncident.icon;
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Incident Types
          </Button>
        </div>

        {/* Incident Info */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-xl ${selectedIncident.color}`}>
                <Icon className={`h-8 w-8 ${selectedIncident.iconColor}`} />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">{selectedIncident.title}</CardTitle>
                <CardDescription className="text-base mt-1">
                  {selectedIncident.description}
                </CardDescription>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant={selectedIncident.priority === 'high' ? 'destructive' : 'secondary'}>
                    {selectedIncident.priority === 'high' ? 'Urgent Documentation' : 'Standard Process'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {selectedIncident.forms?.length || 0} forms to complete
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Create New Incident */}
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-100">
                  <Plus className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-green-800">Create New {selectedIncident.title} Report</CardTitle>
                  <CardDescription className="text-green-700">
                    Start documenting this incident with a complete intake form
                  </CardDescription>
                </div>
              </div>
              <Button 
                onClick={() => handleCreateIncident(selectedIncident)}
                className="bg-green-600 hover:bg-green-700"
              >
                Start Report
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Available Forms */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Available Forms for {selectedIncident.title}</h3>
          <div className="grid gap-3">
            {selectedIncident.forms?.map((form) => {
              const getFormIcon = (formKey) => {
                switch (formKey) {
                  case 'patient_intake': return User;
                  case 'accident_details': return Car;
                  case 'incident_details': return AlertTriangle;
                  case 'injuries_symptoms': return Heart;
                  case 'insurance_info': return Shield;
                  case 'workers_comp': return Briefcase;
                  case 'pain_evaluation': return Activity;
                  case 'work_impact': return Calendar;
                  case 'work_status': return Briefcase;
                  case 'activity_impact': return Activity;
                  case 'pain_details': return Heart;
                  case 'medical_history': return FileText;
                  case 'lifestyle_impact': return Calendar;
                  default: return FileText;
                }
              };

              const FormIcon = getFormIcon(form.key);
              
              return (
                <Card 
                  key={form.key}
                  className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
                  onClick={() => handleFormSelect(selectedIncident, form.key)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${form.required ? 'bg-red-100' : 'bg-blue-100'}`}>
                          <FormIcon className={`h-5 w-5 ${form.required ? 'text-red-600' : 'text-blue-600'}`} />
                        </div>
                        <div>
                          <CardTitle className="text-base">{form.title}</CardTitle>
                          <CardDescription className="text-sm">
                            {form.required ? 'Required' : 'Optional'} • Individual form
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={form.required ? 'destructive' : 'outline'} className="text-xs">
                          {form.required ? 'Required' : 'Optional'}
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Help Text */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">How It Works</h4>
                <p className="text-sm text-blue-800">
                  <strong>Create New Report:</strong> Starts a complete incident folder with all necessary forms. 
                  <br />
                  <strong>Individual Forms:</strong> Add specific forms to an existing incident folder.
                  <br />
                  <strong>Required vs Optional:</strong> Required forms must be completed for proper documentation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-3xl font-bold">
                {selectedIncident ? `${selectedIncident.title} Documentation` : 'Create New Incident Report'}
              </DialogTitle>
              <DialogDescription className="text-lg mt-2">
                {selectedIncident 
                  ? `Choose how to document your ${selectedIncident.title.toLowerCase()} incident`
                  : 'Select the type of incident you need to document'
                }
              </DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="py-6">
            {selectedIncident ? <IncidentDetailView /> : <IncidentListView />}
          </div>
        </ScrollArea>

        <div className="flex-shrink-0 border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {patientView ? 'Patient View' : 'Admin View'} • 
              {selectedIncident 
                ? `${selectedIncident.forms?.length || 0} forms available`
                : `${incidentTypes.length} incident types available`
              }
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {selectedIncident && (
                <Button onClick={() => handleCreateIncident(selectedIncident)}>
                  Create {selectedIncident.title} Report
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportTemplateSelector;
