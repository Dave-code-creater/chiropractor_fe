import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/data-table";
import {
  Calendar,
  Clock,
  Users,
  FileText,
  Phone,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Plus,
  UserCheck,
  ClipboardList,
  PhoneCall,
} from "lucide-react";
import { useGetAppointmentsQuery } from "@/api/services/appointmentApi";
import RecentChatMessages from "@/components/dashboard/RecentChatMessages";
import QuickScheduler from "../../../appointments/components/QuickScheduler";
import { Link } from "react-router-dom";
import { selectCurrentUser, selectUserId } from "../../../../state/data/authSlice";

export default function StaffDashboard() {
  const user = useSelector(selectCurrentUser);
  const userID = useSelector(selectUserId);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");

  const {
    data: appointmentsData,
    isLoading,
    error,
  } = useGetAppointmentsQuery();

  // Ensure appointments is always an array with comprehensive checks
  const appointments = React.useMemo(() => {
    if (isLoading || error) return [];

    let allAppointments = [];
    if (Array.isArray(appointmentsData?.metadata)) {
      allAppointments = appointmentsData.metadata;
    } else if (Array.isArray(appointmentsData)) {
      allAppointments = appointmentsData;
    } else {
      allAppointments = [];
    }

    // Filter out canceled appointments from staff overview
    return allAppointments.filter(apt => 
      !apt.is_cancel && !apt.is_cancelled && apt.status !== 'cancelled'
    );
  }, [appointmentsData, isLoading, error]);

  // Filter appointments for today
  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter(
    (apt) => apt.date === today || apt.datetime?.startsWith(today),
  );

  const pendingAppointments = appointments.filter(
    (apt) => apt.status === "pending" || apt.status === "requested",
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      title: "Today's Schedule",
      value: todayAppointments.length,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Appointments",
      value: pendingAppointments.length,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Active Patients",
      value: new Set(appointments.map((apt) => apt.patientId)).size,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Follow-up Calls",
      value: 8, // Mock data
      icon: PhoneCall,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

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
      case "requested":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const appointmentColumns = [
    {
      accessorKey: "time",
      header: "Time",
      cell: ({ row }) => formatTime(row.getValue("time")),
    },
    {
      accessorKey: "patientName",
      header: "Patient",
      cell: ({ row }) => {
        const name = row.getValue("patientName");
        return name || `Patient #${row.original.patientId}`;
      },
    },
    {
      accessorKey: "doctor",
      header: "Doctor",
      cell: ({ row }) => {
        const doctor = row.getValue("doctor");
        return doctor || "Dr. Smith";
      },
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <Badge className={getStatusColor(status)}>
            {status || "scheduled"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button variant="outline" size="sm">
            Contact
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Staff Operations Center 📋
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage appointments, patients, and daily operations
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/staff/appointments/manage">
                <Calendar className="w-4 h-4 mr-2" />
                Manage Appointments
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/staff/patients">
                <Users className="w-4 h-4 mr-2" />
                Patient Database
              </Link>
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Quick Schedule
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            asChild
          >
            <Link to="/staff/appointments/manage">
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold">Appointments</h3>
                <p className="text-sm text-muted-foreground">
                  Schedule & Manage
                </p>
              </CardContent>
            </Link>
          </Card>
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            asChild
          >
            <Link to="/staff/patients">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold">Patients</h3>
                <p className="text-sm text-muted-foreground">Patient Records</p>
              </CardContent>
            </Link>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <Phone className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold">Call Center</h3>
              <p className="text-sm text-muted-foreground">Patient Calls</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <FileText className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold">Insurance</h3>
              <p className="text-sm text-muted-foreground">Verify Coverage</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-8 h-8 text-pink-600 mx-auto mb-2" />
              <h3 className="font-semibold">Messages</h3>
              <p className="text-sm text-muted-foreground">
                Patient Communication
              </p>
            </CardContent>
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schedule">Quick Schedule</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Messages */}
              <div className="lg:col-span-1">
                <RecentChatMessages 
                  title="Patient Messages" 
                  limit={6} 
                  showViewAll={true}
                  height="h-[500px]"
                />
              </div>
              
              {/* Daily Summary */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Today's Priority Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm font-medium">Follow-up calls pending: {pendingAppointments.length}</span>
                        </div>
                        <Badge variant="destructive">Urgent</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm font-medium">Insurance verifications needed: 3</span>
                        </div>
                        <Badge variant="outline">Medium</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium">Today's appointments: {todayAppointments.length}</span>
                        </div>
                        <Badge variant="secondary">On Track</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                        <Phone className="w-5 h-5" />
                        <span className="text-sm">Make Call</span>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        <span className="text-sm">Schedule</span>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                        <FileText className="w-5 h-5" />
                        <span className="text-sm">Insurance</span>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        <span className="text-sm">Message</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <QuickScheduler />
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Today's Appointment Schedule ({todayAppointments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse flex items-center space-x-4"
                      >
                        <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : todayAppointments.length > 0 ? (
                  <DataTable
                    columns={appointmentColumns}
                    data={todayAppointments}
                  />
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground">
                      No appointments today
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      A quiet day at the clinic
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" />
                  Tasks & Follow-ups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-primary rounded"></div>
                      <div>
                        <h4 className="font-medium">
                          Call Mrs. Johnson for follow-up
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Post-treatment check-in
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">High Priority</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-primary rounded"></div>
                      <div>
                        <h4 className="font-medium">
                          Insurance verification for John Doe
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Verify coverage before appointment
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Medium</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <div>
                        <h4 className="font-medium text-muted-foreground">
                          Schedule equipment maintenance
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Monthly maintenance completed
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
