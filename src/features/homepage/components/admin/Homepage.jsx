import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  BarChart3,
  Users,
  Calendar,
  FileText,
  Shield,
  Package,
  Search,
  Bell,
  Settings,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  Plus,
} from "lucide-react";

// Import the new feature components
import DashboardStats from "@/components/dashboard/DashboardStats";
import GlobalSearch from "@/components/advanced-search/GlobalSearch";
import AdvancedPatientManagement from "@/features/patients/components/AdvancedPatientManagement";
import DoctorAvailabilitySystem from "@/features/doctors/components/DoctorAvailabilitySystem";
import PDFReportGenerator from "@/components/reports/PDFReportGenerator";
import BulkOperationsManager from "@/components/bulk-operations/BulkOperationsManager";
import SecurityManager from "@/components/security/SecurityManager";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardStats, setDashboardStats] = useState({
    totalPatients: 1250,
    activeAppointments: 28,
    monthlyRevenue: 75600,
    systemHealth: 98.5,
    pendingTasks: 12,
    unreadNotifications: 5,
    securityAlerts: 2,
    reportsGenerated: 45,
  });

  const [quickActions] = useState([
    {
      id: "add-patient",
      title: "Add New Patient",
      description: "Register a new patient in the system",
      icon: Users,
      color: "blue",
      action: () => { }, // TODO: Implement add patient functionality
    },
    {
      id: "schedule-appointment",
      title: "Schedule Appointment",
      description: "Book a new appointment",
      icon: Calendar,
      color: "green",
      action: () => { }, // TODO: Implement schedule appointment functionality
    }
  ]);

  const [recentActivities] = useState([
    {
      id: 1,
      type: "patient",
      title: "New patient registered",
      description: "Sarah Johnson completed registration",
      timestamp: "2 minutes ago",
      icon: Users,
      color: "blue",
    },
    {
      id: 2,
      type: "appointment",
      title: "Appointment confirmed",
      description: "John Smith - Tomorrow 2:00 PM",
      timestamp: "5 minutes ago",
      icon: Calendar,
      color: "green",
    },
    {
      id: 3,
      type: "security",
      title: "Security alert resolved",
      description: "Suspicious login attempt blocked",
      timestamp: "10 minutes ago",
      icon: Shield,
      color: "red",
    },
    {
      id: 4,
      type: "report",
      title: "Monthly report generated",
      description: "Patient analytics report completed",
      timestamp: "15 minutes ago",
      icon: FileText,
      color: "purple",
    },
  ]);

  const [systemAlerts] = useState([
    {
      id: 1,
      type: "warning",
      title: "System Maintenance Scheduled",
      description: "Scheduled maintenance tonight from 11 PM - 1 AM",
      severity: "medium",
    },
    {
      id: 2,
      type: "security",
      title: "Security Update Available",
      description: "New security patch available for installation",
      severity: "high",
    },
  ]);

  const QuickActionCard = ({ action }) => {
    const IconComponent = action.icon;

    return (
      <Card
        className="cursor-pointer hover:shadow-md transition-all"
        onClick={action.action}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div
              className={`p-3 rounded-lg ${action.color === "blue"
                  ? "bg-blue-100"
                  : action.color === "green"
                    ? "bg-green-100"
                    : action.color === "purple"
                      ? "bg-purple-100"
                      : action.color === "red"
                        ? "bg-red-100"
                        : "bg-gray-100"
                }`}
            >
              <IconComponent
                className={`h-6 w-6 ${action.color === "blue"
                    ? "text-blue-600"
                    : action.color === "green"
                      ? "text-green-600"
                      : action.color === "purple"
                        ? "text-purple-600"
                        : action.color === "red"
                          ? "text-red-600"
                          : "text-gray-600"
                  }`}
              />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const StatCard = ({ title, value, change, icon: Icon, color = "blue" }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <p
                className={`text-sm ${change > 0 ? "text-green-600" : "text-red-600"}`}
              >
                {change > 0 ? "+" : ""}
                {change}% from last month
              </p>
            )}
          </div>
          <div
            className={`p-3 rounded-lg ${color === "blue"
                ? "bg-blue-100"
                : color === "green"
                  ? "bg-green-100"
                  : color === "emerald"
                    ? "bg-emerald-100"
                    : color === "purple"
                      ? "bg-purple-100"
                      : "bg-gray-100"
              }`}
          >
            <Icon
              className={`h-6 w-6 ${color === "blue"
                  ? "text-blue-600"
                  : color === "green"
                    ? "text-green-600"
                    : color === "emerald"
                      ? "text-emerald-600"
                      : color === "purple"
                        ? "text-purple-600"
                        : "text-gray-600"
                }`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ActivityItem = ({ activity }) => {
    const IconComponent = activity.icon;

    return (
      <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
        <div
          className={`p-2 rounded-lg ${activity.color === "blue"
              ? "bg-blue-100"
              : activity.color === "green"
                ? "bg-green-100"
                : activity.color === "purple"
                  ? "bg-purple-100"
                  : activity.color === "red"
                    ? "bg-red-100"
                    : "bg-gray-100"
            }`}
        >
          <IconComponent
            className={`h-4 w-4 ${activity.color === "blue"
                ? "text-blue-600"
                : activity.color === "green"
                  ? "text-green-600"
                  : activity.color === "purple"
                    ? "text-purple-600"
                    : activity.color === "red"
                      ? "text-red-600"
                      : "text-gray-600"
              }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
          <p className="text-sm text-gray-600">{activity.description}</p>
          <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
        </div>
      </div>
    );
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* System Alerts */}
      {systemAlerts.length > 0 && (
        <div className="space-y-3">
          {systemAlerts.map((alert) => (
            <Alert
              key={alert.id}
              className={
                alert.severity === "high"
                  ? "border-red-200 bg-red-50"
                  : alert.severity === "medium"
                    ? "border-yellow-200 bg-yellow-50"
                    : "border-blue-200 bg-blue-50"
              }
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.description}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={dashboardStats.totalPatients.toLocaleString()}
          change={8.5}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Today's Appointments"
          value={dashboardStats.activeAppointments}
          change={12.3}
          icon={Calendar}
          color="green"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${dashboardStats.monthlyRevenue.toLocaleString()}`}
          change={15.8}
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="System Health"
          value={`${dashboardStats.systemHealth}%`}
          change={null}
          icon={Activity}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Frequently used administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <QuickActionCard key={action.id} action={action} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity and System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Activity
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </CardTitle>
            <CardDescription>
              Latest system activities and events
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px]">
              <div className="p-4 space-y-1">
                {recentActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Current system performance and health
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Server Status</span>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  Online
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database</span>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  Healthy
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Security Status</span>
                <Badge
                  variant="default"
                  className="bg-yellow-100 text-yellow-800"
                >
                  {dashboardStats.securityAlerts} Alert
                  {dashboardStats.securityAlerts !== 1 ? "s" : ""}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Backup Status</span>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  Up to Date
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Status</span>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  Operational
                </Badge>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span>Last System Check</span>
                <span className="text-gray-500">2 minutes ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Next Maintenance</span>
                <span className="text-gray-500">Tonight 11:00 PM</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Comprehensive system management and analytics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
            {dashboardStats.unreadNotifications > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
                {dashboardStats.unreadNotifications}
              </Badge>
            )}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="bulk-ops">Bulk Ops</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="analytics">
          <DashboardStats userRole="admin" />
        </TabsContent>

        <TabsContent value="patients">
          <AdvancedPatientManagement />
        </TabsContent>

        <TabsContent value="scheduling">
          <DoctorAvailabilitySystem />
        </TabsContent>

        <TabsContent value="reports">
          <PDFReportGenerator />
        </TabsContent>

        <TabsContent value="bulk-ops">
          <BulkOperationsManager />
        </TabsContent>

        <TabsContent value="security">
          <SecurityManager />
        </TabsContent>

        <TabsContent value="search">
          <div className="space-y-6">
            <GlobalSearch
              onResultSelect={(result) => console.log("Selected:", result)}
              userRole="admin"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
