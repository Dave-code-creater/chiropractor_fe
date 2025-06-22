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
    Trash2
} from "lucide-react";
import { 
    useListAppointmentsQuery, 
    useCancelAppointmentMutation,
    useUpdateAppointmentMutation
} from "@/services/appointmentApi";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import DoctorBooking from "./components/Booking";

export default function Appointments() {
    const [activeTab, setActiveTab] = useState("upcoming");
    const user = useSelector((state) => state.data.auth);
    
    // Fetch appointments with different filters
    const { 
        data: appointmentsData, 
        isLoading, 
        error,
        refetch
    } = useListAppointmentsQuery({
        patientId: user?.userID,
    });

    const [cancelAppointment] = useCancelAppointmentMutation();
    const [updateAppointment] = useUpdateAppointmentMutation();

    // Process and categorize appointments
    const { upcomingAppointments, pastAppointments } = useMemo(() => {
        if (!appointmentsData) {
            return { upcomingAppointments: [], pastAppointments: [] };
        }

        // Handle different response formats
        let appointments = [];
        if (Array.isArray(appointmentsData)) {
            appointments = appointmentsData;
        } else if (appointmentsData.appointments && Array.isArray(appointmentsData.appointments)) {
            appointments = appointmentsData.appointments;
        } else if (appointmentsData.metadata && Array.isArray(appointmentsData.metadata)) {
            appointments = appointmentsData.metadata;
        }

        const now = new Date();
        const upcoming = [];
        const past = [];

        appointments.forEach(appointment => {
            const appointmentDate = new Date(appointment.datetime);
            if (appointmentDate >= now) {
                upcoming.push(appointment);
            } else {
                past.push(appointment);
            }
        });

        // Sort upcoming by date (earliest first)
        upcoming.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
        
        // Sort past by date (most recent first)
        past.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

        return { upcomingAppointments: upcoming, pastAppointments: past };
    }, [appointmentsData]);

    const getStatusBadge = (status) => {
        const statusConfig = {
            scheduled: { variant: "default", label: "Scheduled", icon: Calendar },
            confirmed: { variant: "default", label: "Confirmed", icon: CheckCircle },
            completed: { variant: "secondary", label: "Completed", icon: CheckCircle },
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

    const formatDateTime = (datetime) => {
        const date = new Date(datetime);
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

    const AppointmentCard = ({ appointment, showActions = true }) => {
        const { date, time } = formatDateTime(appointment.datetime);
        const doctor = appointment.doctor;

        return (
            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={doctor?.profileImage} />
                                <AvatarFallback>
                                    {doctor?.name ? doctor.name.split(' ').map(n => n[0]).join('') : 'DR'}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-semibold">
                                    {doctor?.name || `Dr. ${doctor?.firstName} ${doctor?.lastName}` || 'Doctor'}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {doctor?.specialization || doctor?.specializations?.primary || 'Chiropractor'}
                                </p>
                            </div>
                        </div>
                        {getStatusBadge(appointment.status)}
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{date}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{time}</span>
                            <span className="text-muted-foreground">
                                ({appointment.duration || 30} minutes)
                            </span>
                        </div>

                        {appointment.location && (
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{appointment.location}</span>
                            </div>
                        )}

                        {appointment.reason && (
                            <div className="flex items-start gap-2 text-sm">
                                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <span>{appointment.reason}</span>
                            </div>
                        )}

                        {appointment.notes && (
                            <div className="p-3 bg-muted rounded-lg text-sm">
                                <strong>Notes:</strong> {appointment.notes}
                            </div>
                        )}
                    </div>

                    {showActions && appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                        <div className="flex gap-2 mt-4 pt-4 border-t">
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
            <h3 className="text-lg font-semibold mb-2">
                No {type} appointments
            </h3>
            <p className="text-muted-foreground mb-4">
                {type === 'upcoming' 
                    ? "You don't have any upcoming appointments scheduled."
                    : "You don't have any past appointments to show."
                }
            </p>
            {type === 'upcoming' && (
                <Button onClick={() => setActiveTab("book")} className="flex items-center gap-2">
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
            <h3 className="text-lg font-semibold mb-2">Unable to load appointments</h3>
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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="book" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Book New
                    </TabsTrigger>
                    <TabsTrigger value="upcoming" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Upcoming ({upcomingAppointments.length})
                    </TabsTrigger>
                    <TabsTrigger value="past" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Past ({pastAppointments.length})
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
                                <AppointmentCard
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
                                <AppointmentCard
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