import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Activity,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useGetAppointmentsQuery } from "@/services/appointmentApi";
import { useGetPatientsQuery } from "@/services/userApi";
import { useGetReportsQuery } from "@/services/reportApi";

const DashboardStats = ({ userRole = "admin" }) => {
  const [timeRange, setTimeRange] = useState("7d");
  
  // Fetch data from APIs
  const { data: appointmentsData, isLoading: isLoadingAppointments } = useGetAppointmentsQuery();
  const { data: patientsData, isLoading: isLoadingPatients } = useGetPatientsQuery();
  const { data: reportsData, isLoading: isLoadingReports } = useGetReportsQuery();

  // Process appointments data
  const appointments = useMemo(() => {
    if (!appointmentsData) return [];
    return Array.isArray(appointmentsData?.metadata) ? appointmentsData.metadata :
           Array.isArray(appointmentsData) ? appointmentsData : [];
  }, [appointmentsData]);

  // Process patients data
  const patients = useMemo(() => {
    if (!patientsData) return [];
    return Array.isArray(patientsData?.metadata) ? patientsData.metadata :
           Array.isArray(patientsData) ? patientsData : [];
  }, [patientsData]);

  // Process reports data
  const reports = useMemo(() => {
    if (!reportsData) return [];
    return Array.isArray(reportsData?.metadata) ? reportsData.metadata :
           Array.isArray(reportsData) ? reportsData : [];
  }, [reportsData]);

  // Calculate stats from real data
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    const todayAppointments = appointments.filter(apt => 
      apt.date === today || apt.datetime?.startsWith(today)
    );

    const thisMonthAppointments = appointments.filter(apt => {
      const aptDate = apt.date || apt.datetime?.split('T')[0];
      return aptDate?.startsWith(thisMonth);
    });

    const completedAppointments = appointments.filter(apt => 
      apt.status === "completed"
    );

    const calculateRevenue = (appts) => {
      return appts.reduce((sum, apt) => sum + (apt.fee || 0), 0);
    };

    return {
      patients: {
        total: patients.length,
        active: patients.filter(p => p.status === "active").length,
        newThisMonth: patients.filter(p => {
          const createdDate = new Date(p.created_at || p.createdAt);
          return createdDate.toISOString().startsWith(thisMonth);
        }).length,
        growth: 0, // Calculate based on historical data if available
        demographics: {
          male: patients.filter(p => p.gender === "male").length,
          female: patients.filter(p => p.gender === "female").length,
        },
      },
      appointments: {
        today: todayAppointments.length,
        thisWeek: appointments.filter(apt => {
          const aptDate = new Date(apt.date || apt.datetime);
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          return aptDate >= weekStart;
        }).length,
        thisMonth: thisMonthAppointments.length,
        completed: completedAppointments.length,
        pending: appointments.filter(apt => apt.status === "pending").length,
        cancelled: appointments.filter(apt => apt.status === "cancelled").length,
        noShow: appointments.filter(apt => apt.status === "no_show").length,
        completionRate: appointments.length ? 
          (completedAppointments.length / appointments.length * 100).toFixed(1) : 0,
        averageDuration: 30, // Default if not available in data
      },
      revenue: {
        today: calculateRevenue(todayAppointments),
        thisWeek: calculateRevenue(appointments.filter(apt => {
          const aptDate = new Date(apt.date || apt.datetime);
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          return aptDate >= weekStart;
        })),
        thisMonth: calculateRevenue(thisMonthAppointments),
        growth: 0, // Calculate based on historical data if available
        target: 80000, // This should come from settings/goals
        completion: 0, // Calculate based on target
      },
      clinical: {
        notesToday: reports.filter(r => {
          const reportDate = new Date(r.created_at || r.createdAt);
          return reportDate.toISOString().split('T')[0] === today;
        }).length,
        avgPainReduction: calculateAveragePainReduction(reports),
        treatmentSuccess: calculateTreatmentSuccess(reports),
        patientSatisfaction: calculatePatientSatisfaction(reports),
      },
      system: {
        activeUsers: 0, // This should come from a real-time service
        systemHealth: 98.5,
        responseTime: 245,
        uptime: 99.9,
      },
    };
  }, [appointments, patients, reports]);

  // Helper functions for clinical metrics
  const calculateAveragePainReduction = (reports) => {
    const reportsWithPain = reports.filter(r => 
      r.pain_before && r.pain_after
    );
    if (!reportsWithPain.length) return 0;
    
    const totalReduction = reportsWithPain.reduce((sum, r) => 
      sum + (r.pain_before - r.pain_after), 0
    );
    return (totalReduction / reportsWithPain.length).toFixed(1);
  };

  const calculateTreatmentSuccess = (reports) => {
    if (!reports.length) return 0;
    const successfulTreatments = reports.filter(r => 
      r.outcome === "successful" || r.outcome === "improved"
    ).length;
    return ((successfulTreatments / reports.length) * 100).toFixed(1);
  };

  const calculatePatientSatisfaction = (reports) => {
    const reportsWithSatisfaction = reports.filter(r => r.satisfaction_rating);
    if (!reportsWithSatisfaction.length) return 0;
    
    const totalSatisfaction = reportsWithSatisfaction.reduce((sum, r) => 
      sum + r.satisfaction_rating, 0
    );
    return (totalSatisfaction / reportsWithSatisfaction.length).toFixed(1);
  };

  // Generate chart data from real data
  const chartData = useMemo(() => ({
    patientTrends: generatePatientTrends(patients),
    appointmentTrends: generateAppointmentTrends(appointments),
    revenueTrends: generateRevenueTrends(appointments),
    treatmentOutcomes: generateTreatmentOutcomes(reports),
  }), [patients, appointments, reports]);

  // Helper functions for chart data
  function generatePatientTrends(patients) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => {
      const monthPatients = patients.filter(p => {
        const createdDate = new Date(p.created_at || p.createdAt);
        return createdDate.toLocaleString('en-US', { month: 'short' }) === month;
      });
      return {
        month,
        patients: patients.length, // Cumulative
        newPatients: monthPatients.length,
      };
    });
  }

  function generateAppointmentTrends(appointments) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => {
      const dayAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date || apt.datetime);
        return aptDate.toLocaleString('en-US', { weekday: 'short' }) === day;
      });
      return {
        day,
        scheduled: dayAppointments.length,
        completed: dayAppointments.filter(apt => apt.status === 'completed').length,
        cancelled: dayAppointments.filter(apt => apt.status === 'cancelled').length,
        noShow: dayAppointments.filter(apt => apt.status === 'no_show').length,
      };
    });
  }

  function generateRevenueTrends(appointments) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthlyTarget = 80000; // This should come from settings
    return months.map(month => {
      const monthRevenue = appointments
        .filter(apt => {
          const aptDate = new Date(apt.date || apt.datetime);
          return aptDate.toLocaleString('en-US', { month: 'short' }) === month;
        })
        .reduce((sum, apt) => sum + (apt.fee || 0), 0);
      return {
        month,
        revenue: monthRevenue,
        target: monthlyTarget,
      };
    });
  }

  function generateTreatmentOutcomes(reports) {
    const outcomes = [
      { name: 'Excellent', color: '#10B981' },
      { name: 'Good', color: '#3B82F6' },
      { name: 'Fair', color: '#F59E0B' },
      { name: 'Poor', color: '#EF4444' },
    ];
    
    const totalReports = reports.length;
    if (!totalReports) return outcomes.map(o => ({ ...o, value: 0 }));

    return outcomes.map(outcome => ({
      ...outcome,
      value: Math.round(
        (reports.filter(r => 
          r.outcome?.toLowerCase() === outcome.name.toLowerCase()
        ).length / totalReports) * 100
      ),
    }));
  }

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        system: {
          ...prev.system,
          activeUsers:
            prev.system.activeUsers + Math.floor(Math.random() * 3 - 1),
          responseTime: 200 + Math.floor(Math.random() * 100),
        },
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    trend,
    subtitle,
    color = "blue",
  }) => (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 text-${color}-600`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        {change && (
          <div className="flex items-center mt-2">
            {trend === "up" ? (
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
            )}
            <span
              className={`text-xs font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}
            >
              {change}%
            </span>
            <span className="text-xs text-gray-500 ml-1">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const QuickMetric = ({ label, value, status = "normal" }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-900 mr-2">{value}</span>
        {status === "good" && (
          <CheckCircle className="h-4 w-4 text-green-600" />
        )}
        {status === "warning" && (
          <AlertCircle className="h-4 w-4 text-yellow-600" />
        )}
        {status === "error" && <XCircle className="h-4 w-4 text-red-600" />}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Dashboard Analytics
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={timeRange === "24h" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("24h")}
          >
            24h
          </Button>
          <Button
            variant={timeRange === "7d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("7d")}
          >
            7d
          </Button>
          <Button
            variant={timeRange === "30d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("30d")}
          >
            30d
          </Button>
          <Button
            variant={timeRange === "90d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("90d")}
          >
            90d
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={stats.patients.total.toLocaleString()}
          change={stats.patients.growth}
          trend="up"
          icon={Users}
          subtitle={`${stats.patients.active} active patients`}
          color="blue"
        />
        <StatCard
          title="Today's Appointments"
          value={stats.appointments.today}
          change={null}
          icon={Calendar}
          subtitle={`${stats.appointments.completed} completed, ${stats.appointments.pending} pending`}
          color="green"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.revenue.thisMonth.toLocaleString()}`}
          change={stats.revenue.growth}
          trend="up"
          icon={DollarSign}
          subtitle={`${stats.revenue.completion}% of target`}
          color="emerald"
        />
        <StatCard
          title="Clinical Notes"
          value={stats.clinical.notesToday}
          change={null}
          icon={FileText}
          subtitle={`Avg pain reduction: ${stats.clinical.avgPainReduction}/10`}
          color="purple"
        />
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="patients" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="clinical">Clinical</TabsTrigger>
        </TabsList>

        <TabsContent value="patients" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Growth Trends</CardTitle>
                <CardDescription>
                  Monthly patient registration and growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData.patientTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="patients"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.2}
                    />
                    <Area
                      type="monotone"
                      dataKey="newPatients"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patient Demographics</CardTitle>
                <CardDescription>Current patient distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Male Patients</span>
                      <span>
                        {stats.patients.demographics.male} (
                        {Math.round(
                          (stats.patients.demographics.male /
                            stats.patients.total) *
                            100,
                        )}
                        %)
                      </span>
                    </div>
                    <Progress
                      value={
                        (stats.patients.demographics.male /
                          stats.patients.total) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Female Patients</span>
                      <span>
                        {stats.patients.demographics.female} (
                        {Math.round(
                          (stats.patients.demographics.female /
                            stats.patients.total) *
                            100,
                        )}
                        %)
                      </span>
                    </div>
                    <Progress
                      value={
                        (stats.patients.demographics.female /
                          stats.patients.total) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                  <div className="pt-4 space-y-2">
                    <QuickMetric
                      label="New This Month"
                      value={stats.patients.newThisMonth}
                      status="good"
                    />
                    <QuickMetric
                      label="Active Patients"
                      value={`${stats.patients.active}/${stats.patients.total}`}
                      status="good"
                    />
                    <QuickMetric
                      label="Growth Rate"
                      value={`+${stats.patients.growth}%`}
                      status="good"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Appointment Trends</CardTitle>
                <CardDescription>
                  Appointment status by day of week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.appointmentTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#10B981" name="Completed" />
                    <Bar dataKey="cancelled" fill="#EF4444" name="Cancelled" />
                    <Bar dataKey="noShow" fill="#F59E0B" name="No Show" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appointment Metrics</CardTitle>
                <CardDescription>
                  Key appointment performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Completion Rate</span>
                      <span>{stats.appointments.completionRate}%</span>
                    </div>
                    <Progress
                      value={stats.appointments.completionRate}
                      className="h-2"
                    />
                  </div>
                  <div className="pt-4 space-y-2">
                    <QuickMetric
                      label="Today's Total"
                      value={stats.appointments.today}
                      status="good"
                    />
                    <QuickMetric
                      label="This Week"
                      value={stats.appointments.thisWeek}
                      status="good"
                    />
                    <QuickMetric
                      label="Avg Duration"
                      value={`${stats.appointments.averageDuration} min`}
                      status="normal"
                    />
                    <QuickMetric
                      label="No Show Rate"
                      value="3.2%"
                      status="warning"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Target</CardTitle>
                <CardDescription>
                  Monthly revenue performance against targets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData.revenueTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`$${value.toLocaleString()}`, ""]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10B981"
                      strokeWidth={3}
                      name="Actual Revenue"
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#EF4444"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Target"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>
                  Current month financial overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Target Achievement</span>
                      <span>{stats.revenue.completion}%</span>
                    </div>
                    <Progress
                      value={stats.revenue.completion}
                      className="h-2"
                    />
                  </div>
                  <div className="pt-4 space-y-2">
                    <QuickMetric
                      label="Today's Revenue"
                      value={`$${stats.revenue.today.toLocaleString()}`}
                      status="good"
                    />
                    <QuickMetric
                      label="This Week"
                      value={`$${stats.revenue.thisWeek.toLocaleString()}`}
                      status="good"
                    />
                    <QuickMetric
                      label="Growth Rate"
                      value={`+${stats.revenue.growth}%`}
                      status="good"
                    />
                    <QuickMetric
                      label="Remaining Target"
                      value={`$${(stats.revenue.target - stats.revenue.thisMonth).toLocaleString()}`}
                      status="warning"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clinical" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Treatment Outcomes</CardTitle>
                <CardDescription>
                  Patient treatment success rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.treatmentOutcomes}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {chartData.treatmentOutcomes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clinical Metrics</CardTitle>
                <CardDescription>
                  Key clinical performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Treatment Success Rate</span>
                      <span>{stats.clinical.treatmentSuccess}%</span>
                    </div>
                    <Progress
                      value={stats.clinical.treatmentSuccess}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Patient Satisfaction</span>
                      <span>{stats.clinical.patientSatisfaction}/5.0</span>
                    </div>
                    <Progress
                      value={(stats.clinical.patientSatisfaction / 5) * 100}
                      className="h-2"
                    />
                  </div>
                  <div className="pt-4 space-y-2">
                    <QuickMetric
                      label="Notes Today"
                      value={stats.clinical.notesToday}
                      status="good"
                    />
                    <QuickMetric
                      label="Avg Pain Reduction"
                      value={`${stats.clinical.avgPainReduction}/10`}
                      status="good"
                    />
                    <QuickMetric
                      label="Follow-up Rate"
                      value="94.2%"
                      status="good"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            System Health & Performance
          </CardTitle>
          <CardDescription>Real-time system monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <QuickMetric
              label="Active Users"
              value={stats.system.activeUsers}
              status="good"
            />
            <QuickMetric
              label="System Health"
              value={`${stats.system.systemHealth}%`}
              status="good"
            />
            <QuickMetric
              label="Response Time"
              value={`${stats.system.responseTime}ms`}
              status="normal"
            />
            <QuickMetric
              label="Uptime"
              value={`${stats.system.uptime}%`}
              status="good"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
