import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Calendar, 
    Clock, 
    Users, 
    FileText, 
    Activity, 
    MessageSquare,
    TrendingUp,
    CheckCircle,
    AlertCircle,
    Plus,
    ClipboardList
} from 'lucide-react';
import { useListAppointmentsQuery } from '@/services/appointmentApi';
import { Link } from 'react-router-dom';

export default function DoctorDashboard() {
    const user = useSelector(state => state.data.auth.user);
    const userID = useSelector(state => state.data.auth.userID);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeTab, setActiveTab] = useState("overview");
    
    const { data: appointmentsData, isLoading, error } = useListAppointmentsQuery();
    
    // Ensure appointments is always an array with comprehensive checks
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
    
    // Filter appointments for today
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(apt => 
        apt.date === today || apt.datetime?.startsWith(today)
    );
    
    const upcomingAppointments = todayAppointments.filter(apt => 
        apt.status === 'confirmed' || apt.status === 'scheduled'
    );

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const stats = [
        {
            title: "Today's Appointments",
            value: todayAppointments.length,
            icon: Calendar,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Pending Reviews",
            value: appointments.filter(apt => apt.status === 'completed' && !apt.reviewed).length,
            icon: FileText,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
        {
            title: "Active Patients",
            value: new Set(appointments.map(apt => apt.patientId)).size,
            icon: Users,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Messages",
            value: 5, // Mock data
            icon: MessageSquare,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
    ];

    const formatTime = (timeString) => {
        if (!timeString) return 'Time TBD';
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Good morning, Dr. Phan! 👨‍⚕️
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Here's your clinical overview for today
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" asChild>
                            <Link to="/doctor/appointments/manage">
                                <Calendar className="w-4 h-4 mr-2" />
                                Manage Appointments
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link to="/doctor/patients">
                                <Users className="w-4 h-4 mr-2" />
                                Patient Management
                            </Link>
                        </Button>
                        <Button className="bg-primary hover:bg-primary/90">
                            <Plus className="w-4 h-4 mr-2" />
                            New Appointment
                        </Button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer" asChild>
                        <Link to="/doctor/appointments/manage">
                            <CardContent className="p-4 text-center">
                                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                <h3 className="font-semibold">Appointments</h3>
                                <p className="text-sm text-muted-foreground">Manage Schedule</p>
                            </CardContent>
                        </Link>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer" asChild>
                        <Link to="/doctor/patients">
                            <CardContent className="p-4 text-center">
                                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <h3 className="font-semibold">Patients</h3>
                                <p className="text-sm text-muted-foreground">Patient Records</p>
                            </CardContent>
                        </Link>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer" asChild>
                        <Link to="/doctor/notes">
                            <CardContent className="p-4 text-center">
                                <ClipboardList className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                                <h3 className="font-semibold">Clinical Notes</h3>
                                <p className="text-sm text-muted-foreground">Patient Cases</p>
                            </CardContent>
                        </Link>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer" asChild>
                        <Link to="/doctor/reports">
                            <CardContent className="p-4 text-center">
                                <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                <h3 className="font-semibold">Reports</h3>
                                <p className="text-sm text-muted-foreground">Treatment Reports</p>
                            </CardContent>
                        </Link>
                    </Card>
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

                {/* Main Content Tabs */}
                <Tabs defaultValue="appointments" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="appointments">Today's Schedule</TabsTrigger>
                        <TabsTrigger value="patients">Recent Patients</TabsTrigger>
                        <TabsTrigger value="reports">Reports & Notes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="appointments" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Today's Appointments ({todayAppointments.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="space-y-3">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="animate-pulse flex items-center space-x-4">
                                                <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : todayAppointments.length > 0 ? (
                                    <div className="space-y-4">
                                        {todayAppointments.map((appointment) => (
                                            <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-12 w-12">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${appointment.patientId}`} />
                                                        <AvatarFallback>
                                                            {appointment.patientName ? appointment.patientName.split(' ').map(n => n[0]).join('') : 'PT'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h4 className="font-semibold">
                                                            {appointment.patientName || `Patient #${appointment.patientId}`}
                                                        </h4>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Clock className="w-4 h-4" />
                                                            {formatTime(appointment.time)}
                                                            <span>•</span>
                                                            <span>{appointment.type || 'Consultation'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge className={getStatusColor(appointment.status)}>
                                                        {appointment.status || 'scheduled'}
                                                    </Badge>
                                                    <Button variant="outline" size="sm">
                                                        View Details
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-muted-foreground">No appointments today</h3>
                                        <p className="text-sm text-muted-foreground">Enjoy your free day!</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="patients" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Recent Patients
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-muted-foreground">Patient Management</h3>
                                    <p className="text-sm text-muted-foreground">View and manage your patient records</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="reports" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Reports & Clinical Notes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-muted-foreground">Clinical Documentation</h3>
                                    <p className="text-sm text-muted-foreground">Access patient reports and clinical notes</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
} 