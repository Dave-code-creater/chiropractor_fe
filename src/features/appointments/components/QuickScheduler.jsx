import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, User, CheckCircle } from "lucide-react";
import { toast } from "sonner";

// Import API service for quick scheduling
import { useCreateAppointmentMutation } from "@/api/services/appointmentApi";

export default function QuickScheduler() {
  const [formData, setFormData] = useState({
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    appointmentDate: "",
    appointmentTime: "",
    appointmentType: "",
    reason: "",
    notes: "",
  });

  // API mutation hook
  const [createQuickAppointment, { isLoading: isSubmitting }] = useCreateAppointmentMutation();

  const appointmentTypes = [
    "Initial Consultation",
    "Follow-up Visit",
    "Chiropractic Adjustment",
    "Physical Therapy",
    "Massage Therapy",
    "X-Ray Review",
    "Treatment Planning",
    "Emergency Visit",
  ];

  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        !formData.patientName ||
        !formData.appointmentDate ||
        !formData.appointmentTime
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Transform to snake_case format for backend
      const appointmentData = {
        patient_name: formData.patientName,
        patient_phone: formData.patientPhone,
        patient_email: formData.patientEmail,
        appointment_date: formData.appointmentDate,
        appointment_time: formData.appointmentTime,
        appointment_type: formData.appointmentType || "consultation",
        reason: formData.reason,
        notes: formData.notes,
        duration_minutes: 30,
      };

      const response = await createQuickAppointment(appointmentData).unwrap();

      if (response.success) {
        toast.success("Appointment scheduled successfully!");

        // Reset form
        setFormData({
          patientName: "",
          patientPhone: "",
          patientEmail: "",
          appointmentDate: "",
          appointmentTime: "",
          appointmentType: "",
          reason: "",
          notes: "",
        });
      }
    } catch (error) {
      toast.error(
        error.data?.message ||
        "Failed to schedule appointment. Please try again."
      );
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Quick Schedule Appointment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-4 h-4" />
              Patient Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientName">Patient Name *</Label>
                <Input
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) =>
                    handleInputChange("patientName", e.target.value)
                  }
                  placeholder="Enter patient's full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="patientPhone">Phone Number</Label>
                <Input
                  id="patientPhone"
                  type="tel"
                  value={formData.patientPhone}
                  onChange={(e) =>
                    handleInputChange("patientPhone", e.target.value)
                  }
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="patientEmail">Email Address</Label>
              <Input
                id="patientEmail"
                type="email"
                value={formData.patientEmail}
                onChange={(e) =>
                  handleInputChange("patientEmail", e.target.value)
                }
                placeholder="patient@email.com"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Appointment Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="appointmentDate">Date *</Label>
                <Input
                  id="appointmentDate"
                  type="date"
                  value={formData.appointmentDate}
                  onChange={(e) =>
                    handleInputChange("appointmentDate", e.target.value)
                  }
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div>
                <Label htmlFor="appointmentTime">Time *</Label>
                <Select
                  value={formData.appointmentTime}
                  onValueChange={(value) =>
                    handleInputChange("appointmentTime", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="appointmentType">Type</Label>
                <Select
                  value={formData.appointmentType}
                  onValueChange={(value) =>
                    handleInputChange("appointmentType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>

            <div>
              <Label htmlFor="reason">Reason for Visit</Label>
              <Input
                id="reason"
                value={formData.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                placeholder="Brief description of the visit purpose"
              />
            </div>

            <div>
              <Label htmlFor="notes">Internal Notes</Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any additional notes for the appointment"
                rows={3}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Scheduling...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setFormData({
                  patientName: "",
                  patientPhone: "",
                  patientEmail: "",
                  appointmentDate: "",
                  appointmentTime: "",
                  appointmentType: "",
                  reason: "",
                  notes: "",
                })
              }
            >
              Clear Form
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
