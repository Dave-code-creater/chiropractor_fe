import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
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
  XCircle
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DashboardStats = ({ userRole = 'admin' }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [stats, setStats] = useState({
    patients: {
      total: 1250,
      active: 1180,
      newThisMonth: 45,
      growth: 8.5,
      demographics: {
        male: 580,
        female: 670
      }
    },
    appointments: {
      today: 28,
      thisWeek: 156,
      thisMonth: 680,
      completed: 24,
      pending: 4,
      cancelled: 2,
      noShow: 1,
      completionRate: 92.3,
      averageDuration: 42
    },
    revenue: {
      today: 3200,
      thisWeek: 18500,
      thisMonth: 75600,
      growth: 12.8,
      target: 80000,
      completion: 94.5
    },
    clinical: {
      notesToday: 22,
      avgPainReduction: 3.2,
      treatmentSuccess: 87.5,
      patientSatisfaction: 4.8
    },
    system: {
      activeUsers: 45,
      systemHealth: 98.5,
      responseTime: 245,
      uptime: 99.9
    }
  });

  const [chartData, setChartData] = useState({
    patientTrends: [
      { month: 'Jan', patients: 980, newPatients: 35 },
      { month: 'Feb', patients: 1020, newPatients: 42 },
      { month: 'Mar', patients: 1080, newPatients: 38 },
      { month: 'Apr', patients: 1150, newPatients: 45 },
      { month: 'May', patients: 1200, newPatients: 52 },
      { month: 'Jun', patients: 1250, newPatients: 48 }
    ],
    appointmentTrends: [
      { day: 'Mon', scheduled: 32, completed: 28, cancelled: 3, noShow: 1 },
      { day: 'Tue', scheduled: 35, completed: 32, cancelled: 2, noShow: 1 },
      { day: 'Wed', scheduled: 30, completed: 27, cancelled: 2, noShow: 1 },
      { day: 'Thu', scheduled: 33, completed: 30, cancelled: 2, noShow: 1 },
      { day: 'Fri', scheduled: 28, completed: 26, cancelled: 1, noShow: 1 },
      { day: 'Sat', scheduled: 15, completed: 14, cancelled: 1, noShow: 0 },
      { day: 'Sun', scheduled: 8, completed: 8, cancelled: 0, noShow: 0 }
    ],
    revenueTrends: [
      { month: 'Jan', revenue: 68000, target: 70000 },
      { month: 'Feb', revenue: 72000, target: 70000 },
      { month: 'Mar', revenue: 69500, target: 72000 },
      { month: 'Apr', revenue: 74000, target: 72000 },
      { month: 'May', revenue: 76500, target: 75000 },
      { month: 'Jun', revenue: 75600, target: 80000 }
    ],
    treatmentOutcomes: [
      { name: 'Excellent', value: 35, color: '#10B981' },
      { name: 'Good', value: 28, color: '#3B82F6' },
      { name: 'Fair', value: 18, color: '#F59E0B' },
      { name: 'Poor', value: 8, color: '#EF4444' }
    ]
  });

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        system: {
          ...prev.system,
          activeUsers: prev.system.activeUsers + Math.floor(Math.random() * 3 - 1),
          responseTime: 200 + Math.floor(Math.random() * 100)
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, change, icon: Icon, trend, subtitle, color = "blue" }) => (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-${color}-600`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        {change && (
          <div className="flex items-center mt-2">
            {trend === 'up' ? (
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
            )}
            <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {change}%
            </span>
            <span className="text-xs text-gray-500 ml-1">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const QuickMetric = ({ label, value, status = 'normal' }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-900 mr-2">{value}</span>
        {status === 'good' && <CheckCircle className="h-4 w-4 text-green-600" />}
        {status === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
        {status === 'error' && <XCircle className="h-4 w-4 text-red-600" />}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Analytics</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={timeRange === '24h' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('24h')}
          >
            24h
          </Button>
          <Button
            variant={timeRange === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('7d')}
          >
            7d
          </Button>
          <Button
            variant={timeRange === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('30d')}
          >
            30d
          </Button>
          <Button
            variant={timeRange === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('90d')}
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
                <CardDescription>Monthly patient registration and growth</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData.patientTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="patients" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="newPatients" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
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
                      <span>{stats.patients.demographics.male} ({Math.round((stats.patients.demographics.male / stats.patients.total) * 100)}%)</span>
                    </div>
                    <Progress value={(stats.patients.demographics.male / stats.patients.total) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Female Patients</span>
                      <span>{stats.patients.demographics.female} ({Math.round((stats.patients.demographics.female / stats.patients.total) * 100)}%)</span>
                    </div>
                    <Progress value={(stats.patients.demographics.female / stats.patients.total) * 100} className="h-2" />
                  </div>
                  <div className="pt-4 space-y-2">
                    <QuickMetric label="New This Month" value={stats.patients.newThisMonth} status="good" />
                    <QuickMetric label="Active Patients" value={`${stats.patients.active}/${stats.patients.total}`} status="good" />
                    <QuickMetric label="Growth Rate" value={`+${stats.patients.growth}%`} status="good" />
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
                <CardDescription>Appointment status by day of week</CardDescription>
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
                <CardDescription>Key appointment performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Completion Rate</span>
                      <span>{stats.appointments.completionRate}%</span>
                    </div>
                    <Progress value={stats.appointments.completionRate} className="h-2" />
                  </div>
                  <div className="pt-4 space-y-2">
                    <QuickMetric label="Today's Total" value={stats.appointments.today} status="good" />
                    <QuickMetric label="This Week" value={stats.appointments.thisWeek} status="good" />
                    <QuickMetric label="Avg Duration" value={`${stats.appointments.averageDuration} min`} status="normal" />
                    <QuickMetric label="No Show Rate" value="3.2%" status="warning" />
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
                <CardDescription>Monthly revenue performance against targets</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData.revenueTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Actual Revenue" />
                    <Line type="monotone" dataKey="target" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>Current month financial overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Target Achievement</span>
                      <span>{stats.revenue.completion}%</span>
                    </div>
                    <Progress value={stats.revenue.completion} className="h-2" />
                  </div>
                  <div className="pt-4 space-y-2">
                    <QuickMetric label="Today's Revenue" value={`$${stats.revenue.today.toLocaleString()}`} status="good" />
                    <QuickMetric label="This Week" value={`$${stats.revenue.thisWeek.toLocaleString()}`} status="good" />
                    <QuickMetric label="Growth Rate" value={`+${stats.revenue.growth}%`} status="good" />
                    <QuickMetric label="Remaining Target" value={`$${(stats.revenue.target - stats.revenue.thisMonth).toLocaleString()}`} status="warning" />
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
                <CardDescription>Patient treatment success rates</CardDescription>
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
                <CardDescription>Key clinical performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Treatment Success Rate</span>
                      <span>{stats.clinical.treatmentSuccess}%</span>
                    </div>
                    <Progress value={stats.clinical.treatmentSuccess} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Patient Satisfaction</span>
                      <span>{stats.clinical.patientSatisfaction}/5.0</span>
                    </div>
                    <Progress value={(stats.clinical.patientSatisfaction / 5) * 100} className="h-2" />
                  </div>
                  <div className="pt-4 space-y-2">
                    <QuickMetric label="Notes Today" value={stats.clinical.notesToday} status="good" />
                    <QuickMetric label="Avg Pain Reduction" value={`${stats.clinical.avgPainReduction}/10`} status="good" />
                    <QuickMetric label="Follow-up Rate" value="94.2%" status="good" />
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
            <QuickMetric label="Active Users" value={stats.system.activeUsers} status="good" />
            <QuickMetric label="System Health" value={`${stats.system.systemHealth}%`} status="good" />
            <QuickMetric label="Response Time" value={`${stats.system.responseTime}ms`} status="normal" />
            <QuickMetric label="Uptime" value={`${stats.system.uptime}%`} status="good" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats; 