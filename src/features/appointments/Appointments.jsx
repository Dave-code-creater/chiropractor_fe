import React, { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import {
  useGetUserAppointmentsQuery,
  useDeleteAppointmentMutation,
  useUpdateAppointmentMutation,
  useRescheduleAppointmentMutation,
  useGetDoctorsQuery,
} from "@/services/appointmentApi";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import DoctorBooking from "./components/Booking";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CompactAppointmentCard from "@/components/CompactAppointmentCard";

export default function Appointments() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [rescheduleModal, setRescheduleModal] = useState({
    isOpen: false,
    appointment: null,
  });
  const user = useSelector((state) => state.auth);

  // Fetch current user's appointments
  const {
    data: appointmentsData,
    isLoading,
    error,
    refetch,
  } = useGetUserAppointmentsQuery({
    status: 'all', // Get all appointments (scheduled, completed, cancelled)
    limit: 50,      // Get up to 50 appointments
  });

  // Fetch doctors to match with appointments
  const {
    data: doctorsData,
    isLoading: doctorsLoading,
  } = useGetDoctorsQuery();

  const [cancelAppointment] = useDeleteAppointmentMutation();
  const [updateAppointment] = useUpdateAppointmentMutation();
  const [rescheduleAppointment] = useRescheduleAppointmentMutation();

  // Process and categorize appointments
  const { upcomingAppointments, pastAppointments } = useMemo(() => {
    if (!appointmentsData) {
      return { upcomingAppointments: [], pastAppointments: [] };
    }

    // Handle the actual API response structure
    let appointments = [];
    if (appointmentsData?.data?.appointments && Array.isArray(appointmentsData.data.appointments)) {
      appointments = appointmentsData.data.appointments;
    } else if (Array.isArray(appointmentsData)) {
      appointments = appointmentsData;
    } else if (appointmentsData.appointments && Array.isArray(appointmentsData.appointments)) {
      appointments = appointmentsData.appointments;
    } else if (appointmentsData.metadata && Array.isArray(appointmentsData.metadata)) {
      appointments = appointmentsData.metadata;
    }

    // Get doctors array from the response
    let doctors = [];
    if (doctorsData) {
      if (doctorsData?.data?.doctors && Array.isArray(doctorsData.data.doctors)) {
        doctors = doctorsData.data.doctors;
      } else if (Array.isArray(doctorsData)) {
        doctors = doctorsData;
      } else if (doctorsData.doctors && Array.isArray(doctorsData.doctors)) {
        doctors = doctorsData.doctors;
      } else if (doctorsData.metadata && Array.isArray(doctorsData.metadata)) {
        doctors = doctorsData.metadata;
      }
    }

    // Match appointments with doctors and add cancellation status
    const appointmentsWithDoctors = appointments.map(appointment => {
      const doctor = doctors.find(doc => doc.id === appointment.doctor_id);
      return {
        ...appointment,
        doctor: doctor,
        is_cancel: appointment.is_cancel || appointment.is_cancelled || false
      };
    });

    const now = new Date();
    const upcoming = [];
    const past = [];

    appointmentsWithDoctors.forEach((appointment) => {
      // Use appointment_datetime field from API response, or fallback to other date fields
      let appointmentDate;
      if (appointment.appointment_datetime) {
        appointmentDate = new Date(appointment.appointment_datetime);
      } else if (appointment.appointment_date && appointment.appointment_time) {
        // Combine date and time if separate
        const dateStr = appointment.appointment_date.split('T')[0]; // Get date part only
        appointmentDate = new Date(`${dateStr}T${appointment.appointment_time}`);
      } else {
        appointmentDate = new Date(appointment.scheduled_at || appointment.datetime || appointment.appointment_date);
      }
      
      if (appointmentDate >= now) {
        upcoming.push({...appointment, parsedDate: appointmentDate});
      } else {
        past.push({...appointment, parsedDate: appointmentDate});
      }
    });

    // Sort upcoming by date (earliest first)
    upcoming.sort((a, b) => a.parsedDate - b.parsedDate);

    // Sort past by date (most recent first)
    past.sort((a, b) => b.parsedDate - a.parsedDate);

    return { upcomingAppointments: upcoming, pastAppointments: past };
  }, [appointmentsData, doctorsData]);

  // Calculate counts excluding canceled appointments for display
  const activeUpcomingCount = upcomingAppointments.filter(apt => !apt.is_cancel).length;
  const activePastCount = pastAppointments.filter(apt => !apt.is_cancel).length;

  // Transform appointment data for the compact card format
  const transformAppointmentForCompactCard = (appointment) => {
    const { date, time } = formatDateTime(appointment);
    const doctorName = appointment.doctor 
      ? `Dr. ${appointment.doctor.first_name} ${appointment.doctor.last_name}`.trim()
      : (appointment.doctor_first_name 
          ? `Dr. ${appointment.doctor_first_name} ${appointment.doctor_last_name || ''}`.trim()
          : 'Doctor');
    
    return {
      id: appointment.id,
      doctorName: doctorName,
      specialty: appointment.doctor?.specialization || appointment.doctor_specialization || 'Chiropractic',
      date: date,
      time: time,
      duration: `${appointment.duration_minutes || appointment.duration || 30} minutes`,
      location: appointment.location || "Clinic",
      status: appointment.status,
      doctorImage: appointment.doctor?.profile_picture || "/avatars/1.png"
    };
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { variant: "default", label: "Scheduled", icon: Calendar },
      confirmed: { variant: "default", label: "Confirmed", icon: CheckCircle },
      completed: {
        variant: "secondary",
        label: "Completed",
        icon: CheckCircle,
      },
      cancelled: { variant: "destructive", label: "Cancelled", icon: XCircle },
      pending: { variant: "outline", label: "Pending", icon: AlertCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatDateTime = (appointment) => {
    // Use the parsedDate we created, or fall back to processing the appointment fields
    let date;
    if (appointment.parsedDate) {
      date = appointment.parsedDate;
    } else if (appointment.appointment_datetime) {
      date = new Date(appointment.appointment_datetime);
    } else if (appointment.appointment_date && appointment.appointment_time) {
      const dateStr = appointment.appointment_date.split('T')[0];
      date = new Date(`${dateStr}T${appointment.appointment_time}`);
    } else {
      date = new Date(appointment.scheduled_at || appointment.datetime || appointment.appointment_date);
    }
    
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await cancelAppointment(appointmentId).unwrap();
      toast.success("Appointment cancelled successfully");
      refetch();
    } catch (error) {
      console.error("Cancel appointment error:", error);
      toast.error("Failed to cancel appointment. Please try again.");
    }
  };

  const handleRescheduleAppointment = async (appointmentId, newDateTime) => {
    try {
      await updateAppointment({
        id: appointmentId,
        datetime: newDateTime,
      }).unwrap();
      toast.success("Appointment rescheduled successfully");
      refetch();
    } catch (error) {
      console.error("Reschedule appointment error:", error);
      toast.error("Failed to reschedule appointment. Please try again.");
    }
  };

  const openRescheduleModal = (appointment) => {
    setRescheduleModal({
      isOpen: true,
      appointment,
    });
  };

  const closeRescheduleModal = () => {
    setRescheduleModal({
      isOpen: false,
      appointment: null,
    });
  };

  const RescheduleForm = () => {
    const [formData, setFormData] = useState({
      date: "",
      time: "",
      reason: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const appointment = rescheduleModal.appointment;
    if (!appointment) return null;

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        // Combine date and time into a single datetime string
        const datetime = `${formData.date}T${formData.time}:00.000Z`;
        
        const rescheduleData = {
          id: appointment.id,
          scheduled_at: datetime,
          date: new Date(datetime).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          time: new Date(datetime).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
          reschedule_reason: formData.reason,
        };

        await rescheduleAppointment(rescheduleData).unwrap();
        toast.success("Appointment rescheduled successfully");
        closeRescheduleModal();
        refetch();
      } catch (error) {
        console.error("Reschedule appointment error:", error);
        toast.error(
          error?.data?.message || "Failed to reschedule appointment. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    // Get current date and time for minimum values
    const now = new Date();
    const minDate = now.toISOString().split("T")[0];
    const minTime = now.toTimeString().slice(0, 5);

    return (
      <Dialog open={rescheduleModal.isOpen} onOpenChange={closeRescheduleModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Change the date and time for your appointment. Please select a new date and time that works for you.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-info">Current Appointment</Label>
              <div className="p-3 bg-muted rounded-lg text-sm">
                <p><strong>Date:</strong> {appointment.date}</p>
                <p><strong>Time:</strong> {appointment.time}</p>
                <p><strong>Doctor:</strong> Dr. {appointment.doctor?.first_name} {appointment.doctor?.last_name}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-date">New Date</Label>
              <Input
                id="new-date"
                type="date"
                min={minDate}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-time">New Time</Label>
              <Input
                id="new-time"
                type="time"
                min={formData.date === minDate ? minTime : "00:00"}
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Rescheduling (Optional)</Label>
              <Input
                id="reason"
                type="text"
                placeholder="e.g., Schedule conflict, Emergency, etc."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeRescheduleModal}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Rescheduling..." : "Reschedule Appointment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  // Compact appointment card with actions
  const CompactAppointmentWithActions = ({ appointment, showActions = true }) => {
    const compactAppointment = transformAppointmentForCompactCard(appointment);
    const doctor = appointment.doctor;

    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20 hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              Appointment Details
            </CardTitle>
            {getStatusBadge(appointment.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <CompactAppointmentCard appointment={compactAppointment} />
          
          {appointment.reason_for_visit && (
            <div className="flex items-start gap-2 text-sm p-3 bg-muted/50 rounded-lg">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <span className="font-medium">Reason for visit:</span>
                <p className="text-muted-foreground mt-1">{appointment.reason_for_visit}</p>
              </div>
            </div>
          )}

          {appointment.additional_notes && (
            <div className="p-3 bg-muted/50 rounded-lg text-sm">
              <strong>Notes:</strong> {appointment.additional_notes}
            </div>
          )}
          
          {showActions &&
            appointment.status !== "cancelled" &&
            appointment.status !== "completed" && (
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCancelAppointment(appointment.id)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openRescheduleModal(appointment)}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Reschedule
                </Button>
                {doctor?.phone && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Phone className="h-3 w-3" />
                    Call
                  </Button>
                )}
              </div>
            )}
        </CardContent>
      </Card>
    );
  };

  const EmptyState = ({ type }) => (
    <div className="text-center py-12">
      <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
      <h3 className="text-lg font-semibold mb-2">No {type} appointments</h3>
      <p className="text-muted-foreground mb-4">
        {type === "upcoming"
          ? "You don't have any upcoming appointments scheduled."
          : "You don't have any past appointments to show."}
      </p>
      {type === "upcoming" && (
        <Button
          onClick={() => setActiveTab("book")}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Book New Appointment
        </Button>
      )}
    </div>
  );

  const LoadingState = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-muted rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded"></div>
                  <div className="h-3 w-24 bg-muted rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-48 bg-muted rounded"></div>
                <div className="h-3 w-32 bg-muted rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ErrorState = () => (
    <div className="text-center py-12">
      <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive opacity-50" />
      <h3 className="text-lg font-semibold mb-2">
        Unable to load appointments
      </h3>
      <p className="text-muted-foreground mb-4">
        There was an error loading your appointments. Please try again.
      </p>
      <Button onClick={refetch} variant="outline">
        Try Again
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <RescheduleForm />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="book" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Book New
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming ({activeUpcomingCount})
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Past ({activePastCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="book" className="mt-6">
          <DoctorBooking />
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState />
          ) : upcomingAppointments.length === 0 ? (
            <EmptyState type="upcoming" />
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <CompactAppointmentWithActions
                  key={appointment.id}
                  appointment={appointment}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState />
          ) : pastAppointments.length === 0 ? (
            <EmptyState type="past" />
          ) : (
            <div className="space-y-4">
              {pastAppointments.map((appointment) => (
                <CompactAppointmentWithActions
                  key={appointment.id}
                  appointment={appointment}
                  showActions={false}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
