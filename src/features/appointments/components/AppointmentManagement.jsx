import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import { 
    Calendar, 
    Clock, 
    Plus, 
    Search, 
    MoreHorizontal, 
    Phone, 
    Mail, 
    Edit,
    CheckCircle,
    XCircle,
    CalendarDays,
    TrendingUp
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useListAppointmentsQuery, useUpdateAppointmentMutation } from '@/services/appointmentApi';
import { toast } from 'sonner';

export default function AppointmentManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const { data: appointmentsData, isLoading, error, refetch } = useListAppointmentsQuery();
    const [updateAppointment] = useUpdateAppointmentMutation();

    // Ensure appointments is always an array
    const appointments = React.useMemo(() => {
        if (isLoading || error) return [];
        
        if (Array.isArray(appointmentsData?.metadata)) {
            return appointmentsData.metadata;
        }
        
        if (Array.isArray(appointmentsData)) {
            return appointmentsData;
        }
        
        return [];
    }, [appointmentsData, isLoading, error]);

    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch = 
            appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.doctor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.type?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = selectedStatus === "all" || appointment.status === selectedStatus;
        const matchesDate = !selectedDate || appointment.date === selectedDate;
        
        return matchesSearch && matchesStatus && matchesDate;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
            case 'scheduled':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'Time TBD';
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Date TBD';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            await updateAppointment({
                id: appointmentId,
                status: newStatus
            }).unwrap();
            toast.success(`Appointment ${newStatus} successfully`);
            refetch();
        } catch (error) {
            console.error("Update appointment error:", error);
            toast.error("Failed to update appointment status");
        }
    };

    const appointmentColumns = [
        {
            accessorKey: "time",
            header: "Time",
            cell: ({ row }) => (
                <div className="font-medium">
                    {formatTime(row.original.time)}
                </div>
            ),
        },
        {
            accessorKey: "patient",
            header: "Patient",
            cell: ({ row }) => {
                const appointment = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${appointment.patientId}`} />
                            <AvatarFallback>
                                {appointment.patientName ? appointment.patientName.split(' ').map(n => n[0]).join('') : 'PT'}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium">
                                {appointment.patientName || `Patient #${appointment.patientId}`}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {appointment.type || 'Consultation'}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "doctor",
            header: "Doctor",
            cell: ({ row }) => {
                const doctor = row.original.doctor;
                return (
                    <div className="text-sm">
                        <div className="font-medium">
                            {typeof doctor === 'object' ? `Dr. ${doctor.firstName} ${doctor.lastName}` : doctor || 'Dr. Dieu Phan'}
                        </div>
                        <div className="text-muted-foreground">
                            Chiropractic Care
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge className={getStatusColor(row.original.status)}>
                    {row.original.status || 'scheduled'}
                </Badge>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const appointment = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedAppointment(appointment)}>
                                <Edit className="w-4 h-4 mr-2" />
                                View Details
                            </DropdownMenuItem>
                            {appointment.status !== 'confirmed' && (
                                <DropdownMenuItem onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Confirm
                                </DropdownMenuItem>
                            )}
                            {appointment.status !== 'completed' && (
                                <DropdownMenuItem onClick={() => handleStatusUpdate(appointment.id, 'completed')}>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Mark Complete
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}>
                                <XCircle className="w-4 h-4 mr-2" />
                                Cancel
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const stats = [
        {
            title: "Today's Appointments",
            value: appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length,
            icon: CalendarDays,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Pending Confirmations",
            value: appointments.filter(apt => apt.status === 'pending').length,
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
        },
        {
            title: "Completed Today",
            value: appointments.filter(apt => 
                apt.status === 'completed' && 
                apt.date === new Date().toISOString().split('T')[0]
            ).length,
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Total This Week",
            value: appointments.filter(apt => {
                const aptDate = new Date(apt.date);
                const today = new Date();
                const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
                const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
                return aptDate >= weekStart && aptDate <= weekEnd;
            }).length,
            icon: TrendingUp,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Appointment Management
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Schedule, manage, and track patient appointments
                        </p>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" />
                        New Appointment
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <Card key={index} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                {stat.title}
                                            </p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {stat.value}
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                            <IconComponent className={`w-6 h-6 ${stat.color}`} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Filters and Search */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search appointments by patient, doctor, or type..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-auto"
                                />
                                <Button
                                    variant={selectedStatus === "all" ? "default" : "outline"}
                                    onClick={() => setSelectedStatus("all")}
                                    size="sm"
                                >
                                    All
                                </Button>
                                <Button
                                    variant={selectedStatus === "pending" ? "default" : "outline"}
                                    onClick={() => setSelectedStatus("pending")}
                                    size="sm"
                                >
                                    Pending
                                </Button>
                                <Button
                                    variant={selectedStatus === "confirmed" ? "default" : "outline"}
                                    onClick={() => setSelectedStatus("confirmed")}
                                    size="sm"
                                >
                                    Confirmed
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Appointments Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Appointments ({filteredAppointments.length})
                            {selectedDate && (
                                <span className="text-sm font-normal text-muted-foreground">
                                    for {formatDate(selectedDate)}
                                </span>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="animate-pulse flex items-center space-x-4">
                                        <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredAppointments.length > 0 ? (
                            <DataTable 
                                columns={appointmentColumns} 
                                data={filteredAppointments} 
                            />
                        ) : (
                            <div className="text-center py-8">
                                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-muted-foreground">No appointments found</h3>
                                <p className="text-sm text-muted-foreground">
                                    {searchTerm || selectedStatus !== "all" || selectedDate 
                                        ? "Try adjusting your filters" 
                                        : "No appointments scheduled"}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Appointment Detail Modal */}
                {selectedAppointment && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-3">
                                    <Calendar className="h-6 w-6 text-primary" />
                                    <div>
                                        <div className="text-xl font-bold">
                                            Appointment Details
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {formatDate(selectedAppointment.date)} at {formatTime(selectedAppointment.time)}
                                        </div>
                                    </div>
                                </CardTitle>
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setSelectedAppointment(null)}
                                >
                                    ×
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-semibold mb-3">Patient Information</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAppointment.patientId}`} />
                                                    <AvatarFallback>
                                                        {selectedAppointment.patientName ? selectedAppointment.patientName.split(' ').map(n => n[0]).join('') : 'PT'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">
                                                        {selectedAppointment.patientName || `Patient #${selectedAppointment.patientId}`}
                                                    </div>
                                                    <div className="text-muted-foreground">
                                                        ID: {selectedAppointment.patientId}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="font-semibold mb-3">Appointment Details</h3>
                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <strong>Type:</strong> {selectedAppointment.type || 'Consultation'}
                                            </div>
                                            <div>
                                                <strong>Duration:</strong> {selectedAppointment.duration || 30} minutes
                                            </div>
                                            <div>
                                                <strong>Status:</strong> 
                                                <Badge className={`ml-2 ${getStatusColor(selectedAppointment.status)}`}>
                                                    {selectedAppointment.status || 'scheduled'}
                                                </Badge>
                                            </div>
                                            <div>
                                                <strong>Doctor:</strong> Dr. Dieu Phan
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {selectedAppointment.reason && (
                                    <div>
                                        <h3 className="font-semibold mb-3">Reason for Visit</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedAppointment.reason}
                                        </p>
                                    </div>
                                )}

                                {selectedAppointment.notes && (
                                    <div>
                                        <h3 className="font-semibold mb-3">Notes</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedAppointment.notes}
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-2 pt-4">
                                    {selectedAppointment.status !== 'confirmed' && (
                                        <Button 
                                            size="sm"
                                            onClick={() => {
                                                handleStatusUpdate(selectedAppointment.id, 'confirmed');
                                                setSelectedAppointment(null);
                                            }}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Confirm
                                        </Button>
                                    )}
                                    {selectedAppointment.status !== 'completed' && (
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => {
                                                handleStatusUpdate(selectedAppointment.id, 'completed');
                                                setSelectedAppointment(null);
                                            }}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Mark Complete
                                        </Button>
                                    )}
                                    <Button variant="outline" size="sm">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Reschedule
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Phone className="w-4 h-4 mr-2" />
                                        Call Patient
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
} 