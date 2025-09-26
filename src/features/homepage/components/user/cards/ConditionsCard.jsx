import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, AlertCircle, Eye, Car, Briefcase, Activity, Heart } from "lucide-react";
import { useGetIncidentsQuery } from "@/api/services/reportApi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function ConditionsCard() {
  const user = useSelector((state) => state?.auth);
  
  const { 
    data: incidentsData, 
    isLoading, 
    error 
  } = useGetIncidentsQuery(
    { 
      limit: 10 
    },
    { 
      skip: !user?.userID,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }
  );

  const mockMedicalReports = [
    {
      id: "report-001",
      title: "Car Accident Medical Report",
      type: "Accident Report",
      incidentType: "car_accident",
      date: "2024-01-15",
      status: "active",
      priority: "high",
      summary: "Motor vehicle accident resulting in lower back and neck injuries",
      findings: ["Lumbar strain", "Cervical sprain", "Soft tissue damage"],
      doctor: "Dr. Dieu Phan",
      facility: "Downtown Chiropractic Clinic"
    },
    {
      id: "report-002", 
      title: "Work Injury Assessment",
      type: "Occupational Health Report",
      incidentType: "work_injury",
      date: "2024-01-12",
      status: "active",
      priority: "medium",
      summary: "Repetitive strain injury from prolonged computer work",
      findings: ["Cervical strain", "Tension headaches", "Postural dysfunction"],
      doctor: "Dr. Sarah Wilson",
      facility: "Workplace Health Center"
    },
    {
      id: "report-003",
      title: "Chronic Pain Evaluation",
      type: "Pain Management Report",
      incidentType: "general_pain",
      date: "2024-01-05",
      status: "ongoing",
      priority: "routine",
      summary: "Comprehensive evaluation of chronic lower back pain",
      findings: ["Disc degeneration", "Muscle weakness", "Chronic inflammation"],
      doctor: "Dr. Michael Chen",
      facility: "Pain Management Specialists"
    }
  ];

  const conditions = React.useMemo(() => {
    if (!incidentsData) return [];
    
    let rawIncidents = [];
    if (incidentsData?.data && Array.isArray(incidentsData.data)) {
      rawIncidents = incidentsData.data;
    } else if (Array.isArray(incidentsData)) {
      rawIncidents = incidentsData;
    }

    const extractedConditions = [];
    
    rawIncidents.forEach(incident => {
      if (incident.forms && Array.isArray(incident.forms)) {
        incident.forms.forEach(form => {
          if (form.form_type === 'medical_history' && form.form_data) {
            const formData = typeof form.form_data === 'string' ? JSON.parse(form.form_data) : form.form_data;
            
            if (formData.medical_conditions && Array.isArray(formData.medical_conditions)) {
              formData.medical_conditions.forEach(condition => {
                extractedConditions.push({
                  id: `${incident.id}-${form.id}-${condition.name || Math.random()}`,
                  name: condition.name || condition.condition,
                  description: condition.description || condition.details,
                  severity: condition.severity || 'medium',
                  dateReported: incident.created_at || incident.createdAt,
                  incidentId: incident.id,
                  incidentType: incident.incident_type
                });
              });
            }
            
            if (formData.chronic_conditions && Array.isArray(formData.chronic_conditions)) {
              formData.chronic_conditions.forEach(condition => {
                extractedConditions.push({
                  id: `${incident.id}-${form.id}-chronic-${condition.name || Math.random()}`,
                  name: condition.name || condition.condition,
                  description: condition.description || 'Chronic condition',
                  severity: 'medium',
                  dateReported: incident.created_at || incident.createdAt,
                  incidentId: incident.id,
                  incidentType: incident.incident_type
                });
              });
            }
          }
          
          if (form.form_type === 'pain_assessment' && form.form_data) {
            const formData = typeof form.form_data === 'string' ? JSON.parse(form.form_data) : form.form_data;
            
            if (formData.pain_locations && Array.isArray(formData.pain_locations)) {
              formData.pain_locations.forEach(location => {
                extractedConditions.push({
                  id: `${incident.id}-${form.id}-pain-${location.area || Math.random()}`,
                  name: `${location.area || 'Unknown'} Pain`,
                  description: `Pain in ${location.area} - Level ${location.intensity || 'Unknown'}`,
                  severity: location.intensity >= 7 ? 'high' : location.intensity >= 4 ? 'medium' : 'low',
                  dateReported: incident.created_at || incident.createdAt,
                  incidentId: incident.id,
                  incidentType: incident.incident_type
                });
              });
            }
          }
        });
      }
    });

    const uniqueConditions = extractedConditions
      .filter((condition, index, self) => 
        index === self.findIndex(c => c.name === condition.name)
      )
      .sort((a, b) => new Date(b.dateReported) - new Date(a.dateReported))
      .slice(0, 5);

    return uniqueConditions;
  }, [incidentsData]);

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
      case 'severe':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'medium':
      case 'moderate':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
      case 'mild':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getIncidentIcon = (incidentType) => {
    switch (incidentType) {
      case 'car_accident':
        return Car;
      case 'work_injury':
        return Briefcase;
      case 'sports_injury':
        return Activity;
      case 'general_pain':
        return Heart;
      default:
        return FileText;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'ongoing':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'urgent':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
      case 'routine':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <Card className="h-[400px] border-0 shadow-lg bg-gradient-to-br from-card to-muted/20 hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] backdrop-blur-sm flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
          <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
          </div>
          <span className="hidden sm:inline">Medical Conditions</span>
          <span className="sm:hidden">Conditions</span>
        </CardTitle>
      </CardHeader>
      
      <ScrollArea className="flex-1">
        <CardContent className="p-3 sm:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-6 sm:py-8">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8 sm:py-12">
              <div className="p-3 sm:p-4 rounded-full bg-red-50 mb-3 sm:mb-4">
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Unable to load medical conditions
              </p>
            </div>
          ) : conditions.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {conditions.map((condition) => (
                <div key={condition.id} className="p-3 sm:p-4 rounded-lg border border-border/50 bg-background/50">
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 sm:mb-2">
                        <h3 className="font-medium text-sm sm:text-base truncate">
                          {condition.name}
                        </h3>
                        <span className={`px-1.5 py-0.5 rounded-full text-xs ${getSeverityColor(condition.severity)}`}>
                          {condition.severity}
                        </span>
                      </div>
                      {condition.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                          {condition.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>Reported: {new Date(condition.dateReported).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-8 sm:py-12">
              <div className="p-3 sm:p-4 rounded-full bg-muted/50 mb-3 sm:mb-4">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                No medical conditions recorded.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Your health conditions will appear here after medical reports are submitted.
              </p>
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
