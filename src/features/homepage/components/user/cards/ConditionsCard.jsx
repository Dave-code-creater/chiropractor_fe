import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, AlertCircle, Eye } from "lucide-react";
import { useGetPatientReportsQuery } from "@/services/reportApi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function ConditionsCard() {
  const user = useSelector((state) => state?.auth);
  
  // Get patient reports to extract health conditions
  const { 
    data: reportsData, 
    isLoading, 
    error 
  } = useGetPatientReportsQuery(
    { 
      patientId: user?.userID,
      type: 'health-condition',
      limit: 10 
    },
    { 
      skip: !user?.userID,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }
  );



  // Extract conditions from API response
  const conditions = React.useMemo(() => {
    if (!reportsData) return [];
    
    let rawReports = [];
    if (reportsData?.data?.reports && Array.isArray(reportsData.data.reports)) {
      rawReports = reportsData.data.reports;
    } else if (Array.isArray(reportsData)) {
      rawReports = reportsData;
    } else if (reportsData.reports && Array.isArray(reportsData.reports)) {
      rawReports = reportsData.reports;
    }

    // Extract health conditions from reports
    const extractedConditions = [];
    
    rawReports.forEach(report => {
      if (report.data) {
        // Try to extract conditions from various report structures
        const reportData = typeof report.data === 'string' ? JSON.parse(report.data) : report.data;
        
        // Check for health conditions in different formats
        if (reportData.healthConditions && Array.isArray(reportData.healthConditions)) {
          reportData.healthConditions.forEach(condition => {
            extractedConditions.push({
              id: `${report.id}-${condition.name || condition.title || Math.random()}`,
              name: condition.name || condition.title || condition.condition,
              description: condition.description || condition.details,
              severity: condition.severity || condition.level || 'medium',
              dateReported: report.created_at || report.createdAt,
              reportId: report.id
            });
          });
        }
        
        // Check for pain conditions
        if (reportData.painConditions && Array.isArray(reportData.painConditions)) {
          reportData.painConditions.forEach(condition => {
            extractedConditions.push({
              id: `${report.id}-pain-${condition.location || Math.random()}`,
              name: `${condition.location} Pain` || 'Pain Condition',
              description: condition.description || `Pain in ${condition.location}`,
              severity: condition.intensity === 'severe' ? 'high' : condition.intensity === 'mild' ? 'low' : 'medium',
              dateReported: report.created_at || report.createdAt,
              reportId: report.id
            });
          });
        }

        // Check for medical history
        if (reportData.medicalHistory && Array.isArray(reportData.medicalHistory)) {
          reportData.medicalHistory.forEach(condition => {
            extractedConditions.push({
              id: `${report.id}-history-${condition.name || Math.random()}`,
              name: condition.name || condition.condition,
              description: condition.description || condition.notes,
              severity: 'medium',
              dateReported: report.created_at || report.createdAt,
              reportId: report.id
            });
          });
        }
      }
    });

    // Remove duplicates and limit to most recent
    const uniqueConditions = extractedConditions
      .filter((condition, index, self) => 
        index === self.findIndex(c => c.name === condition.name)
      )
      .sort((a, b) => new Date(b.dateReported) - new Date(a.dateReported))
      .slice(0, 5);

    return uniqueConditions;
  }, [reportsData]);

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

  return (
    <Card className="w-full h-full border-0 shadow-lg bg-gradient-to-br from-card to-muted/20 hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <AlertTriangle className="w-4 h-4 text-primary" />
          </div>
          Conditions
        </CardTitle>
      </CardHeader>
      <ScrollArea className="max-h-[300px] h-full">
        <CardContent className="h-full">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="p-4 rounded-full bg-red-50 mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-sm text-muted-foreground">
                Unable to load conditions
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Please try again later
              </p>
            </div>
          ) : conditions.length > 0 ? (
            <div className="space-y-4">
              {conditions.map((condition) => (
                <div
                  key={condition.id}
                  className="p-4 rounded-lg bg-background/50 border border-border/50 hover:bg-background/70 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-foreground text-sm">
                        {condition.name}
                      </h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(condition.dateReported).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric"
                        })}
                      </span>
                    </div>
                    
                    {condition.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {condition.description.length > 100 
                          ? condition.description.substring(0, 100) + '...'
                          : condition.description
                        }
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        Severity:
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(condition.severity)}`}>
                        {condition.severity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="p-4 rounded-full bg-muted/50 mb-4">
                <AlertTriangle className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No conditions recorded.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Complete your health report to track conditions
              </p>
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
