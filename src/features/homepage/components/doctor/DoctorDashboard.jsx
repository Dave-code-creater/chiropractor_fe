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
import { useGetDoctorPatientsQuery, useGetDoctorStatsQuery } from '@/api/services/doctorApi';
import { useGetConversationsQuery } from '@/api/services/chatApi';
import { useGetBlogPostsQuery } from '@/api/services/blogApi';
import { extractList } from '@/utils/apiResponse';

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

  // Fetch doctor's patients using doctor-specific API
  const { data: patientsData, isLoading: isLoadingPatients } = useGetDoctorPatientsQuery({
    doctorId: userID,
    limit: 50
  });

  // Fetch doctor's dashboard stats
  const { data: statsData, isLoading: isLoadingStats } = useGetDoctorStatsQuery({
    doctorId: userID,
    range: "last_30_days"
  });

  // Fetch conversations
  const { data: conversationsData, isLoading: isLoadingConversations } = useGetConversationsQuery({
    status: 'active'
  });

  // Process appointments data - same logic as other appointment components
  const appointments = React.useMemo(
    () => (isLoadingAppointments || error ? [] : extractList(appointmentsData, 'appointments')),
    [appointmentsData, isLoadingAppointments, error]
  );

  // Process patients data from doctor API
  const patients = React.useMemo(
    () => (isLoadingPatients ? [] : extractList(patientsData, 'patients')),
    [patientsData, isLoadingPatients]
  );

  // Process dashboard stats
  const stats = React.useMemo(() => {
    if (isLoadingStats || !statsData) return {
      total_patients: 0,
      active_patients: 0,
      total_incidents: 0,
      active_incidents: 0,
      total_appointments: 0,
      scheduled_appointments: 0,
      upcoming_appointments: 0,
      incidents_this_week: 0,
      appointments_this_week: 0
    };
    return statsData?.data || statsData;
  }, [statsData, isLoadingStats]);

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

  // Use stats from API instead of calculated values
  const activePatients = stats.active_patients || 0;
  const totalPatients = stats.total_patients || 0;
  const totalIncidents = stats.total_incidents || 0;
  const scheduledAppointments = stats.scheduled_appointments || 0;
  const upcomingAppointmentsCount = stats.upcoming_appointments || 0;
  const incidentsThisWeek = stats.incidents_this_week || 0;
  const appointmentsThisWeek = stats.appointments_this_week || 0;

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
        return "bg-earthfire-clay-100 text-earthfire-brick-700 border border-earthfire-clay-200";
      case "pending":
        return "bg-earthfire-brown-100 text-earthfire-brown-700 border border-earthfire-brown-200";
      case "completed":
        return "bg-earthfire-umber-100 text-earthfire-umber-700 border border-earthfire-umber-200";
      case "cancelled":
        return "bg-earthfire-brick-100 text-earthfire-brick-700 border border-earthfire-brick-200";
      default:
        return "bg-earthfire-brown-50 text-earthfire-brown-700 border border-earthfire-brown-200";
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-earthfire-clay-50 via-white to-earthfire-brown-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-6">
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
              <Button size="sm" className="bg-earthfire-brick-600 hover:bg-earthfire-brick-500">
                <Plus className="w-4 h-4 mr-2" />
                New Appointment
              </Button>
            </Link>
            <Link to={`/dashboard/doctor/${userID}/patients`}>
              <Button
                size="sm"
                variant="outline"
                className="border-earthfire-clay-200 text-earthfire-brown-700 hover:bg-earthfire-clay-50 hover:text-earthfire-brick-700"
              >
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
                <div className="p-2 rounded-full bg-earthfire-clay-100">
                  <Calendar className="w-5 h-5 text-earthfire-brick-600" />
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
                <div className="p-2 rounded-full bg-earthfire-brown-100">
                  <Users className="w-5 h-5 text-earthfire-brown-700" />
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
                <div className="p-2 rounded-full bg-earthfire-umber-100">
                  <MessageSquare className="w-5 h-5 text-earthfire-umber-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold text-foreground">{upcomingAppointmentsCount}</p>
                  <p className="text-xs text-muted-foreground">Upcoming</p>
                </div>
                <div className="p-2 rounded-full bg-earthfire-brick-100">
                  <Clock className="w-5 h-5 text-earthfire-brick-600" />
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
              <CardTitle className="text-xl font-semibold text-earthfire-brick-700">Today's Schedule</CardTitle>
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
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-earthfire-brick-600"></div>
                </div>
              ) : todayAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No appointments scheduled for today</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayAppointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-3 bg-earthfire-clay-50/80 rounded-lg border border-earthfire-clay-100">
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
              <CardTitle className="text-xl font-semibold text-earthfire-brick-700">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to={`/dashboard/doctor/${userID}/appointments`} className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start border-earthfire-clay-200 text-earthfire-brown-700 hover:bg-earthfire-clay-50 hover:text-earthfire-brick-700"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Manage Appointments
                </Button>
              </Link>
              <Link to={`/dashboard/doctor/${userID}/patients`} className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start border-earthfire-clay-200 text-earthfire-brown-700 hover:bg-earthfire-clay-50 hover:text-earthfire-brick-700"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Patient Records
                </Button>
              </Link>
              <Link to={`/dashboard/doctor/${userID}/chat`} className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start border-earthfire-clay-200 text-earthfire-brown-700 hover:bg-earthfire-clay-50 hover:text-earthfire-brick-700"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Messages
                  {unreadMessages > 0 && (
                    <Badge className="ml-auto bg-earthfire-brick-500 text-white text-xs">
                      {unreadMessages}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Link to={`/dashboard/doctor/${userID}/blog/management`} className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start border-earthfire-clay-200 text-earthfire-brown-700 hover:bg-earthfire-clay-50 hover:text-earthfire-brick-700"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Write Blog Post
                </Button>
              </Link>
              <Link to={`/dashboard/doctor/${userID}/notes`} className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start border-earthfire-clay-200 text-earthfire-brown-700 hover:bg-earthfire-clay-50 hover:text-earthfire-brick-700"
                >
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
              <CardTitle className="text-lg font-semibold text-earthfire-brick-700">Recent Patients</CardTitle>
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
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-earthfire-brick-600"></div>
                </div>
              ) : patients.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No patients found</p>
              ) : (
                <div className="space-y-3">
                  {patients.slice(0, 3).map((patient) => (
                    <div key={patient.patient_id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={patient.avatar} />
                          <AvatarFallback>{patient.first_name?.[0]}{patient.last_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.first_name} {patient.last_name}</p>
                          <p className="text-sm text-muted-foreground">{patient.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {patient.total_incidents} incidents | {patient.total_appointments} appointments
                          </p>
                        </div>
                      </div>
                      <Link to={`/dashboard/doctor/${userID}/patients/${patient.patient_id}`}>
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
              <CardTitle className="text-lg font-semibold text-earthfire-brick-700">Recent Messages</CardTitle>
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
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-earthfire-brick-600"></div>
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
                          <Badge className="bg-earthfire-brick-500 text-white text-xs">
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
