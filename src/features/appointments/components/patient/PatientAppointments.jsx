import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  useGetUserAppointmentsQuery,
  useUpdateAppointmentMutation
} from '@/api/services/appointmentApi';
import { useSelector } from 'react-redux';
import { selectUserId } from '@/state/data/authSlice';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  MessageSquare,
  Star,
  Download,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import { format, isToday, isPast, isFuture } from 'date-fns';
import Booking from "../Booking";

export default function PatientAppointments() {
  const currentUserId = useSelector(selectUserId);
  const [activeTab, setActiveTab] = useState('book');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelModal, setCancelModal] = useState({ isOpen: false, appointment: null });
  const [rescheduleModal, setRescheduleModal] = useState({ isOpen: false, appointment: null });
  const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, appointment: null });

  // API queries - get current user's appointments
  const { data: appointmentsData, isLoading, error, refetch } = useGetUserAppointmentsQuery({
    status_not: 'cancelled', // Exclude cancelled appointments
    limit: 100 // Get more appointments to show full history
  });

  // Mutations
  const [updateAppointment] = useUpdateAppointmentMutation();

  // Process appointments data
  const appointments = useMemo(() => {
    if (!appointmentsData) return [];
    
    // Handle different response structures
    if (Array.isArray(appointmentsData)) {
      return appointmentsData;
    }
    
    if (appointmentsData.data && Array.isArray(appointmentsData.data)) {
      return appointmentsData.data;
    }
    
    if (appointmentsData.data && appointmentsData.data.appointments && Array.isArray(appointmentsData.data.appointments)) {
      return appointmentsData.data.appointments;
    }
    
    return [];
  }, [appointmentsData]);

  // Categorize appointments
  const categorizedAppointments = useMemo(() => {
    const today = new Date();
    
    return {
      upcoming: appointments.filter(apt => {
        const appointmentDate = new Date(apt.appointment_date || apt.date || apt.datetime);
        return isFuture(appointmentDate) && 
               ['pending', 'confirmed', 'scheduled'].includes(apt.status);
      }),
      past: appointments.filter(apt => {
        const appointmentDate = new Date(apt.appointment_date || apt.date || apt.datetime);
        return isPast(appointmentDate) || 
               ['completed', 'cancelled'].includes(apt.status);
      }),
      today: appointments.filter(apt => {
        const appointmentDate = new Date(apt.appointment_date || apt.date || apt.datetime);
        return isToday(appointmentDate) && 
               ['pending', 'confirmed', 'scheduled'].includes(apt.status);
      })
    };
  }, [appointments]);

  // Patient-specific stats
  const patientStats = useMemo(() => {
    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
    const upcomingAppointments = categorizedAppointments.upcoming.length;
    const todayAppointments = categorizedAppointments.today.length;

    return [
      {
        title: "Total Appointments",
        value: totalAppointments,
        icon: Calendar,
        color: "text-blue-600",
        bgColor: "bg-blue-50"
      },
      {
        title: "Completed",
        value: completedAppointments,
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50"
      },
      {
        title: "Upcoming",
        value: upcomingAppointments,
        icon: Clock,
        color: "text-orange-600",
        bgColor: "bg-orange-50"
      },
      {
        title: "Today",
        value: todayAppointments,
        icon: Calendar,
        color: "text-purple-600",
        bgColor: "bg-purple-50"
      }
    ];
  }, [appointments, categorizedAppointments]);

  // Handle appointment actions
  const handleCancelAppointment = async (appointmentId) => {
    try {
      await updateAppointment({
        id: appointmentId,
        status: 'cancelled'
      }).unwrap();
      toast.success('Appointment cancelled successfully');
      setCancelModal({ isOpen: false, appointment: null });
      refetch();
    } catch (error) {
      console.error('Cancel appointment error:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  const handleRescheduleRequest = async (appointmentId) => {
    try {
      await updateAppointment({
        id: appointmentId,
        status: 'reschedule_requested',
        notes: 'Patient requested reschedule'
      }).unwrap();
      toast.success('Reschedule request sent successfully');
      setRescheduleModal({ isOpen: false, appointment: null });
      refetch();
    } catch (error) {
      console.error('Reschedule request error:', error);
      toast.error('Failed to send reschedule request');
    }
  };

  // Format appointment time
  const formatTime = (time) => {
    if (!time) return 'TBD';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'reschedule_requested': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Appointment Card Component
  const AppointmentCard = ({ appointment, showActions = true }) => {
    const appointmentDate = new Date(appointment.appointment_date);
    const canCancel = ['pending', 'confirmed', 'scheduled'].includes(appointment.status) && 
                     isFuture(appointmentDate);
    const canReschedule = ['pending', 'confirmed'].includes(appointment.status) && 
                         isFuture(appointmentDate);

    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">
                    {appointment.doctor ? 
                      `Dr. ${appointment.doctor.first_name} ${appointment.doctor.last_name}` : 
                      'Dr. Unknown'
                    }
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {appointment.reason_for_visit}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                  {canCancel && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCancelModal({ isOpen: true, appointment })}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>{format(appointmentDate, 'EEEE, MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>{formatTime(appointment.appointment_time)}</span>
              </div>
              {appointment.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{appointment.location}</span>
                </div>
              )}
            </div>

           
          </div>

          {showActions && (
            <div className="flex gap-2 pt-2 border-t">
              {canReschedule && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setRescheduleModal({ isOpen: true, appointment })}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Reschedule
                </Button>
              )}
              {appointment.status === 'completed' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setFeedbackModal({ isOpen: true, appointment })}
                >
                  <Star className="h-4 w-4 mr-1" />
                  Feedback
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedAppointment(appointment)}
              >
                <FileText className="h-4 w-4 mr-1" />
                Details
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Appointments</h1>
        
      </div>

      {/* Patient Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {patientStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <IconComponent className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="book">Book Appointment</TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({categorizedAppointments.upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="today">
            Today ({categorizedAppointments.today.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            History ({categorizedAppointments.past.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="book" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Book New Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              <Booking />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {categorizedAppointments.upcoming.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No upcoming appointments</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => setActiveTab('book')}
                  >
                    Book Your First Appointment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {categorizedAppointments.upcoming.map((appointment) => (
                    <AppointmentCard 
                      key={appointment.id} 
                      appointment={appointment} 
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {categorizedAppointments.today.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No appointments today</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {categorizedAppointments.today.map((appointment) => (
                    <AppointmentCard 
                      key={appointment.id} 
                      appointment={appointment} 
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appointment History</CardTitle>
            </CardHeader>
            <CardContent>
              {categorizedAppointments.past.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No appointment history</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {categorizedAppointments.past.map((appointment) => (
                    <AppointmentCard 
                      key={appointment.id} 
                      appointment={appointment} 
                      showActions={false}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Cancel Appointment Modal */}
      <Dialog open={cancelModal.isOpen} onOpenChange={(open) => setCancelModal({ isOpen: open, appointment: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {cancelModal.appointment && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">
                      {format(new Date(cancelModal.appointment.appointment_date || cancelModal.appointment.date), 'EEEE, MMMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(cancelModal.appointment.appointment_time)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>
                      {cancelModal.appointment.doctor ? 
                        `Dr. ${cancelModal.appointment.doctor.first_name} ${cancelModal.appointment.doctor.last_name}` : 
                        'Dr. Unknown'
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please note that cancelling your appointment may affect your treatment schedule. 
                  If you need to reschedule, please book a new appointment as soon as possible.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setCancelModal({ isOpen: false, appointment: null })}
            >
              Keep Appointment
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleCancelAppointment(cancelModal.appointment.id)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel Appointment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reschedule Request Modal */}
      <Dialog open={rescheduleModal.isOpen} onOpenChange={(open) => setRescheduleModal({ isOpen: open, appointment: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Reschedule</DialogTitle>
            <DialogDescription>
              Request to reschedule your appointment. Our team will contact you to confirm a new time.
            </DialogDescription>
          </DialogHeader>
          
          {rescheduleModal.appointment && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">
                      {format(new Date(rescheduleModal.appointment.appointment_date || rescheduleModal.appointment.date), 'EEEE, MMMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(rescheduleModal.appointment.appointment_time)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>
                      {rescheduleModal.appointment.doctor ? 
                        `Dr. ${rescheduleModal.appointment.doctor.first_name} ${rescheduleModal.appointment.doctor.last_name}` : 
                        'Dr. Unknown'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setRescheduleModal({ isOpen: false, appointment: null })}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => handleRescheduleRequest(rescheduleModal.appointment.id)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Request Reschedule
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback Modal */}
      <Dialog open={feedbackModal.isOpen} onOpenChange={(open) => setFeedbackModal({ isOpen: open, appointment: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Your Appointment</DialogTitle>
            <DialogDescription>
              How was your experience with this appointment?
            </DialogDescription>
          </DialogHeader>
          
          {feedbackModal.appointment && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">
                      {format(new Date(feedbackModal.appointment.appointment_date || feedbackModal.appointment.date), 'EEEE, MMMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>
                      {feedbackModal.appointment.doctor ? 
                        `Dr. ${feedbackModal.appointment.doctor.first_name} ${feedbackModal.appointment.doctor.last_name}` : 
                        'Dr. Unknown'
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Rate your experience:</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      size="sm"
                      className="p-1"
                    >
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Additional comments (optional):</label>
                <textarea 
                  className="w-full p-2 border rounded-md resize-none"
                  rows={3}
                  placeholder="Share your feedback about the appointment..."
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setFeedbackModal({ isOpen: false, appointment: null })}
            >
              Skip
            </Button>
            <Button>
              <Star className="h-4 w-4 mr-2" />
              Submit Feedback
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 