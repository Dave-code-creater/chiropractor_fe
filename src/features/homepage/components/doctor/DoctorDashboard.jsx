import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Users,
  FileText,
  MessageSquare,
  Plus,
  ArrowRight,
  Activity,
  CheckCircle,
} from "lucide-react";
import { useGetAppointmentsQuery } from "@/api/services/appointmentApi";
import { Link } from "react-router-dom";
import { selectCurrentUser, selectUserId } from "../../../../state/data/authSlice";
import { useGetPatientsQuery } from '@/api/services/userApi';
import { useGetConversationsQuery } from '@/api/services/chatApi';
import { useGetBlogPostsQuery } from '@/api/services/blogApi';

export default function DoctorDashboard() {
  const user = useSelector(selectCurrentUser);
  const userID = useSelector(selectUserId);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch appointments using the same API as other appointment components
  const {
    data: appointmentsData,
    isLoading: isLoadingAppointments,
    error,
  } = useGetAppointmentsQuery({
    status_not: 'cancelled', // Exclude cancelled appointments
    limit: 50,
  });

  // Fetch patients
  const { data: patientsData, isLoading: isLoadingPatients } = useGetPatientsQuery();

  // Fetch conversations
  const { data: conversationsData, isLoading: isLoadingConversations } = useGetConversationsQuery({
    status: 'active'
  });

  // Process appointments data - same logic as other appointment components
  const appointments = React.useMemo(() => {
    if (isLoadingAppointments || error || !appointmentsData) return [];

    // Based on your API structure: { data: { appointments: [...] } }
    if (appointmentsData.data && appointmentsData.data.appointments && Array.isArray(appointmentsData.data.appointments)) {
      return appointmentsData.data.appointments;
    }

    // Fallback: Handle if data is directly in data array
    if (appointmentsData.data && Array.isArray(appointmentsData.data)) {
      return appointmentsData.data;
    }

    // Fallback: Handle if appointments are at root level
    if (Array.isArray(appointmentsData)) {
      return appointmentsData;
    }

    return [];
  }, [appointmentsData, isLoadingAppointments, error]);

  // Process patients data
  const patients = React.useMemo(() => {
    if (isLoadingPatients || !patientsData) return [];
    if (Array.isArray(patientsData?.data)) return patientsData.data;
    if (Array.isArray(patientsData)) return patientsData;
    return [];
  }, [patientsData, isLoadingPatients]);

  // Process conversations data
  const conversations = React.useMemo(() => {
    if (isLoadingConversations || !conversationsData) return [];
    let conversationsArray = [];
    if (Array.isArray(conversationsData)) {
      conversationsArray = conversationsData;
    } else if (Array.isArray(conversationsData?.data)) {
      conversationsArray = conversationsData.data;
    }
    return conversationsArray.filter(conv => conv.status === 'active');
  }, [conversationsData, isLoadingConversations]);

  // Calculate key metrics
  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter(apt => {
    const appointmentDate = (apt.appointment_date || apt.date || apt.datetime)?.split('T')[0];
    return appointmentDate === today;
  });

  const upcomingAppointments = appointments.filter(apt => {
    const appointmentDate = apt.date || (apt.datetime && apt.datetime.split('T')[0]);
    return appointmentDate >= today && (apt.status === "confirmed" || apt.status === "scheduled");
  }).slice(0, 5);

  const activePatients = new Set(appointments.map(apt => apt.patient_id)).size;
  const unreadMessages = conversations.filter(conv => conv.unread_count > 0).length;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (timeString) => {
    if (!timeString) return "Time TBD";
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
      case "scheduled":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {getGreeting()}, Dr. {user?.lastName || user?.name || 'Doctor'}! 👨‍⚕️
            </h1>
            <p className="text-muted-foreground mt-1">
              {currentTime.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to={`/dashboard/doctor/${userID}/appointments`}>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                New Appointment
              </Button>
            </Link>
            <Link to={`/dashboard/doctor/${userID}/patients`}>
              <Button size="sm" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Patients
              </Button>
            </Link>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today</p>
                  <p className="text-2xl font-bold text-foreground">{todayAppointments.length}</p>
                  <p className="text-xs text-muted-foreground">Appointments</p>
                </div>
                <div className="p-2 rounded-full bg-blue-50">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-foreground">{activePatients}</p>
                  <p className="text-xs text-muted-foreground">Patients</p>
                </div>
                <div className="p-2 rounded-full bg-green-50">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unread</p>
                  <p className="text-2xl font-bold text-foreground">{unreadMessages}</p>
                  <p className="text-xs text-muted-foreground">Messages</p>
                </div>
                <div className="p-2 rounded-full bg-purple-50">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold text-foreground">{upcomingAppointments.length}</p>
                  <p className="text-xs text-muted-foreground">This Week</p>
                </div>
                <div className="p-2 rounded-full bg-orange-50">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">Today's Schedule</CardTitle>
              <Link to={`/dashboard/doctor/${userID}/appointments`}>
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoadingAppointments ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : todayAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No appointments scheduled for today</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayAppointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{formatTime(apt.time || apt.datetime)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{apt.patientName || apt.patientFullName || 'Patient'}</p>
                          <p className="text-sm text-muted-foreground">{apt.type || 'Consultation'}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(apt.status)}>{apt.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to={`/dashboard/doctor/${userID}/appointments`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Manage Appointments
                </Button>
              </Link>
              <Link to={`/dashboard/doctor/${userID}/patients`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Patient Records
                </Button>
              </Link>
              <Link to={`/dashboard/doctor/${userID}/chat`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Messages
                  {unreadMessages > 0 && (
                    <Badge className="ml-auto bg-red-500 text-white text-xs">
                      {unreadMessages}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Link to={`/dashboard/doctor/${userID}/blog/management`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Write Blog Post
                </Button>
              </Link>
              <Link to={`/dashboard/doctor/${userID}/notes`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="w-4 h-4 mr-2" />
                  Clinical Notes
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Patients */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">Recent Patients</CardTitle>
              <Link to={`/dashboard/doctor/${userID}/patients`}>
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoadingPatients ? (
                <div className="flex items-center justify-center h-24">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : patients.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No patients found</p>
              ) : (
                <div className="space-y-3">
                  {patients.slice(0, 3).map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={patient.avatar} />
                          <AvatarFallback>{patient.firstName?.[0]}{patient.lastName?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                          <p className="text-sm text-muted-foreground">{patient.email}</p>
                        </div>
                      </div>
                      <Link to={`/dashboard/doctor/${userID}/patients/${patient.id}`}>
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">Recent Messages</CardTitle>
              <Link to={`/dashboard/doctor/${userID}/chat`}>
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoadingConversations ? (
                <div className="flex items-center justify-center h-24">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : conversations.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No recent messages</p>
              ) : (
                <div className="space-y-3">
                  {conversations.slice(0, 3).map((conv) => (
                    <div key={conv.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={conv.avatar} />
                          <AvatarFallback>{conv.title?.[0] || 'C'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{conv.title || 'Conversation'}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {conv.lastMessage || 'No messages yet'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {conv.unread_count > 0 && (
                          <Badge className="bg-red-500 text-white text-xs">
                            {conv.unread_count}
                          </Badge>
                        )}
                        <Link to={`/dashboard/doctor/${userID}/chat/${conv.id}`}>
                          <Button size="sm" variant="ghost">
                            Open
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
