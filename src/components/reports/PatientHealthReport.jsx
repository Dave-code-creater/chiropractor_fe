import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUserId } from "@/state/data/authSlice";
import { useGetUserProfileQuery } from "@/api/services/userApi";
import { useGetMyAppointmentsQuery } from "@/api/services/appointmentApi";
import { useGetIncidentsQuery } from "@/api/services/reportApi";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Download,
  Calendar,
  Clipboard,
  Activity,
  User,
  Phone,
  Mail,
  MapPin,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

const PatientHealthReport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const userId = useSelector(selectUserId);

  const { data: profileData, isLoading: profileLoading } = useGetUserProfileQuery(userId, {
    skip: !userId,
  });

  const { data: appointmentsData, isLoading: appointmentsLoading } = useGetMyAppointmentsQuery(
    {},
    { skip: !userId }
  );

  const { data: incidentsData, isLoading: incidentsLoading } = useGetIncidentsQuery(
    { userId },
    { skip: !userId }
  );

  const isLoading = profileLoading || appointmentsLoading || incidentsLoading;

  const generatePDF = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Import jsPDF dynamically
      const { default: jsPDF } = await import("jspdf");
      await import("jspdf-autotable");

      setGenerationProgress(10);
      toast.info("Collecting your health data...");

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;

      // Helper function to check if we need a new page
      const checkNewPage = (requiredSpace = 20) => {
        if (yPosition + requiredSpace > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
          return true;
        }
        return false;
      };

      // Header
      doc.setFillColor(59, 130, 246); // Blue
      doc.rect(0, 0, pageWidth, 40, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text("Health Report", pageWidth / 2, 20, { align: "center" });
      doc.setFontSize(12);
      doc.text(
        `Generated on ${format(new Date(), "MMMM dd, yyyy")}`,
        pageWidth / 2,
        30,
        { align: "center" }
      );

      yPosition = 50;
      setGenerationProgress(20);
      toast.info("Adding personal information...");

      // Personal Information
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("Personal Information", 20, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setFont(undefined, "normal");

      if (profileData?.data) {
        const profile = profileData.data;
        const infoLines = [
          `Name: ${profile.firstName || ""} ${profile.lastName || ""}`,
          `Email: ${profile.email || "N/A"}`,
          `Phone: ${profile.phoneNumber || "N/A"}`,
          `Date of Birth: ${profile.dateOfBirth ? format(new Date(profile.dateOfBirth), "MMMM dd, yyyy") : "N/A"}`,
          `Gender: ${profile.gender || "N/A"}`,
          `Address: ${profile.address || "N/A"}`,
          `Emergency Contact: ${profile.emergencyContactName || "N/A"} - ${profile.emergencyContactPhone || "N/A"}`,
        ];

        infoLines.forEach((line) => {
          checkNewPage();
          doc.text(line, 20, yPosition);
          yPosition += 7;
        });
      }

      yPosition += 5;
      setGenerationProgress(40);
      toast.info("Adding appointment history...");

      // Appointments Section
      checkNewPage(30);
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("Appointment History", 20, yPosition);
      yPosition += 10;

      if (appointmentsData?.data && appointmentsData.data.length > 0) {
        const appointments = appointmentsData.data
          .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
          .slice(0, 10); // Last 10 appointments

        const appointmentRows = appointments.map((apt) => [
          format(new Date(apt.appointmentDate), "MMM dd, yyyy"),
          apt.appointmentTime || "N/A",
          apt.status || "N/A",
          apt.appointmentType || "N/A",
          apt.reason?.substring(0, 30) + (apt.reason?.length > 30 ? "..." : "") || "N/A",
        ]);

        doc.autoTable({
          startY: yPosition,
          head: [["Date", "Time", "Status", "Type", "Reason"]],
          body: appointmentRows,
          theme: "striped",
          headStyles: { fillColor: [59, 130, 246] },
          styles: { fontSize: 9 },
          margin: { left: 20, right: 20 },
        });

        yPosition = doc.lastAutoTable.finalY + 10;
      } else {
        doc.setFontSize(11);
        doc.setFont(undefined, "normal");
        doc.text("No appointments recorded.", 20, yPosition);
        yPosition += 10;
      }

      setGenerationProgress(60);
      toast.info("Adding medical incidents...");

      // Medical Incidents Section
      checkNewPage(30);
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("Medical Reports & Incidents", 20, yPosition);
      yPosition += 10;

      if (incidentsData?.data && incidentsData.data.length > 0) {
        const incidents = incidentsData.data
          .sort((a, b) => new Date(b.incidentDate) - new Date(a.incidentDate))
          .slice(0, 5); // Last 5 incidents

        incidents.forEach((incident, index) => {
          checkNewPage(40);
          
          doc.setFontSize(12);
          doc.setFont(undefined, "bold");
          doc.text(
            `${index + 1}. ${incident.incidentType || "Incident"}`,
            20,
            yPosition
          );
          yPosition += 7;

          doc.setFontSize(10);
          doc.setFont(undefined, "normal");
          doc.text(
            `Date: ${incident.incidentDate ? format(new Date(incident.incidentDate), "MMM dd, yyyy") : "N/A"}`,
            25,
            yPosition
          );
          yPosition += 6;

          if (incident.description) {
            const descLines = doc.splitTextToSize(
              `Description: ${incident.description}`,
              pageWidth - 50
            );
            descLines.forEach((line) => {
              checkNewPage();
              doc.text(line, 25, yPosition);
              yPosition += 5;
            });
          }

          if (incident.painLevel) {
            doc.text(`Pain Level: ${incident.painLevel}/10`, 25, yPosition);
            yPosition += 6;
          }

          if (incident.location) {
            doc.text(`Location: ${incident.location}`, 25, yPosition);
            yPosition += 6;
          }

          yPosition += 5;
        });
      } else {
        doc.setFontSize(11);
        doc.setFont(undefined, "normal");
        doc.text("No medical incidents recorded.", 20, yPosition);
        yPosition += 10;
      }

      setGenerationProgress(80);
      toast.info("Adding medical history...");

      // Medical History Section
      checkNewPage(30);
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("Medical History", 20, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setFont(undefined, "normal");

      if (profileData?.data) {
        const profile = profileData.data;

        if (profile.medicalHistory) {
          const historyLines = doc.splitTextToSize(
            `Medical History: ${profile.medicalHistory}`,
            pageWidth - 40
          );
          historyLines.forEach((line) => {
            checkNewPage();
            doc.text(line, 20, yPosition);
            yPosition += 6;
          });
        }

        if (profile.allergies) {
          yPosition += 3;
          checkNewPage();
          doc.setFont(undefined, "bold");
          doc.text("Allergies:", 20, yPosition);
          yPosition += 6;
          doc.setFont(undefined, "normal");
          const allergyLines = doc.splitTextToSize(profile.allergies, pageWidth - 40);
          allergyLines.forEach((line) => {
            checkNewPage();
            doc.text(line, 20, yPosition);
            yPosition += 6;
          });
        }

        if (profile.medications) {
          yPosition += 3;
          checkNewPage();
          doc.setFont(undefined, "bold");
          doc.text("Current Medications:", 20, yPosition);
          yPosition += 6;
          doc.setFont(undefined, "normal");
          const medLines = doc.splitTextToSize(profile.medications, pageWidth - 40);
          medLines.forEach((line) => {
            checkNewPage();
            doc.text(line, 20, yPosition);
            yPosition += 6;
          });
        }
      }

      setGenerationProgress(90);
      toast.info("Finalizing report...");

      // Footer on last page
      checkNewPage(30);
      yPosition = pageHeight - 30;
      doc.setFillColor(240, 240, 240);
      doc.rect(0, yPosition - 5, pageWidth, 40, "F");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(
        "This is a confidential medical document. Please keep it secure.",
        pageWidth / 2,
        yPosition + 5,
        { align: "center" }
      );
      doc.text(
        "Generated by Chiropractor Health Management System",
        pageWidth / 2,
        yPosition + 12,
        { align: "center" }
      );

      setGenerationProgress(100);

      // Save the PDF
      const fileName = `Health_Report_${profileData?.data?.firstName || "Patient"}_${format(new Date(), "yyyyMMdd")}.pdf`;
      doc.save(fileName);

      toast.success("Health report generated successfully!");
      setIsOpen(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate health report. Please try again.");
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-3">
          <FileText className="h-5 w-5" />
          <span>Generate Health Report</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Health Report
          </DialogTitle>
          <DialogDescription>
            Create a comprehensive PDF report containing all your health information, appointments, and medical history.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading your health data...</span>
              </div>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {profileData?.data && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-medium">
                            {profileData.data.firstName} {profileData.data.lastName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span>{profileData.data.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone:</span>
                          <span>{profileData.data.phoneNumber || "N/A"}</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Appointments:</span>
                      <Badge variant="secondary">
                        {appointmentsData?.data?.length || 0}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Clipboard className="h-4 w-4" />
                      Medical Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Reports:</span>
                      <Badge variant="secondary">
                        {incidentsData?.data?.length || 0}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Report will include:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                    <li>✓ Personal and contact information</li>
                    <li>✓ Complete appointment history</li>
                    <li>✓ Medical reports and incidents</li>
                    <li>✓ Medical history and conditions</li>
                    <li>✓ Current medications</li>
                    <li>✓ Allergies</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {isGenerating && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Generating report...</span>
              <span className="font-medium">{Math.round(generationProgress)}%</span>
            </div>
            <Progress value={generationProgress} className="h-2" />
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isGenerating}>
            Cancel
          </Button>
          <Button
            onClick={generatePDF}
            disabled={isLoading || isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Generate PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientHealthReport;
