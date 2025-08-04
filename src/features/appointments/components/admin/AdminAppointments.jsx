import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  useGetAppointmentsQuery,
  useUpdateAppointmentMutation,
  useCreateAppointmentMutation,
  useCancelAppointmentMutation,
  useRescheduleAppointmentMutation,
  useGetAppointmentStatsQuery,
  useGetDoctorsQuery
} from '@/api/services/appointmentApi';
import { useGetPatientsQuery } from '@/api/services/userApi';
import {
  Calendar,
  Search,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Phone,
  Edit,
  Trash2,
  Filter,
  Download,
  RefreshCw,
  Mail,
  AlertCircle,
  FileText,
  UserCheck,
  PhoneCall,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Settings,
  Eye,
  MessageSquare,
  Star,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { format, isToday, isTomorrow, isYesterday, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

const AdminAppointments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('today');

  // Modal states
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState({ isOpen: false, appointment: null });
  const [bulkActionModal, setBulkActionModal] = useState({ isOpen: false, action: null });
  const [analyticsModal, setAnalyticsModal] = useState(false);

  // Query parameters based on active tab and filters
  const queryParams = useMemo(() => {
    const params = {};

    // Date range filtering
    if (dateRange === 'today') {
      params.date = selectedDate;
    } else if (dateRange === 'week') {
      params.date_from = startOfWeek(new Date()).toISOString().split('T')[0];
      params.date_to = endOfWeek(new Date()).toISOString().split('T')[0];
    } else if (dateRange === 'month') {
      params.date_from = startOfMonth(new Date()).toISOString().split('T')[0];
      params.date_to = endOfMonth(new Date()).toISOString().split('T')[0];
    }

    if (statusFilter !== 'all') {
      params.status = statusFilter;
    }

    if (doctorFilter !== 'all') {
      params.doctor_id = doctorFilter;
    }

    return params;
  }, [activeTab, selectedDate, statusFilter, doctorFilter, dateRange]);

  // API queries
  const { data: appointmentsData, isLoading, error, refetch } = useGetAppointmentsQuery(queryParams);
  const { data: doctorsData } = useGetDoctorsQuery();
  const { data: patientsData } = useGetPatientsQuery();

  // Mutations
  const [updateAppointment] = useUpdateAppointmentMutation();
  const [createAppointment] = useCreateAppointmentMutation();
  const [cancelAppointment] = useCancelAppointmentMutation();

  // Process data
  const appointments = useMemo(() => {
    if (!appointmentsData?.data) return [];
    return Array.isArray(appointmentsData.data) ? appointmentsData.data : [];
  }, [appointmentsData]);

  const doctors = useMemo(() => {
    if (!doctorsData?.data) return [];
    return Array.isArray(doctorsData.data) ? doctorsData.data : [];
  }, [doctorsData]);

  const patients = useMemo(() => {
    if (!patientsData?.data) return [];
    return Array.isArray(patientsData.data) ? patientsData.data : [];
  }, [patientsData]);

  // Admin-specific analytics
  const adminStats = useMemo(() => {
    const todayAppointments = appointments.filter(apt =>
      isToday(new Date(apt.appointment_date))
    );

    const pendingAppointments = appointments.filter(apt => apt.status === 'pending');
    const completedAppointments = appointments.filter(apt => apt.status === 'completed');
    const cancelledAppointments = appointments.filter(apt => apt.status === 'cancelled');
    const totalRevenue = completedAppointments.reduce((sum, apt) => sum + (apt.fee || 0), 0);
    const activeDoctors = new Set(appointments.map(apt => apt.doctor_id)).size;
    const activePatients = new Set(appointments.map(apt => apt.patient_id)).size;
    const noShowAppointments = appointments.filter(apt => apt.status === 'no-show');

    return [
      {
        title: "Today's Appointments",
        value: todayAppointments.length,
        icon: Calendar,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        trend: "+12%"
      },
      {
        title: "Pending Confirmations",
        value: pendingAppointments.length,
        icon: Clock,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        trend: "-5%"
      },
      {
        title: "Completed This Month",
        value: completedAppointments.length,
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
        trend: "+8%"
      },
      {
        title: "Active Doctors",
        value: activeDoctors,
        icon: UserCheck,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        trend: "stable"
      },
      {
        title: "Active Patients",
        value: activePatients,
        icon: Users,
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
        trend: "+15%"
      },
      {
        title: "No-Show Rate",
        value: `${appointments.length > 0 ? Math.round((noShowAppointments.length / appointments.length) * 100) : 0}%`,
        icon: AlertTriangle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        trend: "-3%"
      },
      {
        title: "Revenue (MTD)",
        value: `$${totalRevenue.toLocaleString()}`,
        icon: TrendingUp,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        trend: "+22%"
      },
      {
        title: "Cancellation Rate",
        value: `${appointments.length > 0 ? Math.round((cancelledAppointments.length / appointments.length) * 100) : 0}%`,
        icon: XCircle,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        trend: "+2%"
      }
    ];
  }, [appointments]);

  // Filter appointments based on search
  const filteredAppointments = useMemo(() => {
    if (!searchTerm) return appointments;

    return appointments.filter(appointment =>
      appointment.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reason_for_visit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [appointments, searchTerm]);

  // Handle actions
  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await updateAppointment({
        id: appointmentId,
        status: newStatus
      }).unwrap();
      toast.success(`Appointment ${newStatus} successfully`);
      refetch();
    } catch (error) {
      toast.error('Failed to update appointment status');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedAppointments.length === 0) {
      toast.error('Please select appointments first');
      return;
    }

    try {
      // Since we don't have a bulk update API, we'll update each appointment individually
      const updatePromises = selectedAppointments.map(appointmentId => {
        if (action === 'confirm') {
          return updateAppointment({ id: appointmentId, status: 'confirmed' }).unwrap();
        } else if (action === 'cancel') {
          return updateAppointment({ id: appointmentId, status: 'cancelled' }).unwrap();
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);
      toast.success(`Bulk ${action} completed successfully`);
      setSelectedAppointments([]);
      setBulkActionModal({ isOpen: false, action: null });
      refetch();
    } catch (error) {
      toast.error('Failed to perform bulk action');
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      await cancelAppointment({ id: appointmentId, reason: 'Cancelled by admin' }).unwrap();
      toast.success('Appointment cancelled successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  // Table columns for admin view
  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "appointment_date",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.original.appointment_date);
        return format(date, 'MMM d, yyyy');
      }
    },
    {
      accessorKey: "appointment_time",
      header: "Time",
      cell: ({ row }) => {
        const time = row.original.appointment_time;
        return time ? format(new Date(`2000-01-01T${time}`), 'h:mm a') : 'TBD';
      }
    },
    {
      accessorKey: "patient_name",
      header: "Patient",
      cell: ({ row }) => {
        const appointment = row.original;

        // Check if appointment has a patient object (patient API structure)
        const patientName = appointment.patient
          ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
          : appointment.patient_name || 'Unknown Patient';

        const patientEmail = appointment.patient?.email || appointment.patient_email;
        const patientPhone = appointment.patient?.phone || appointment.patient_phone;

        return (
          <div className="space-y-1">
            <div className="font-medium">{patientName}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              {patientEmail && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {patientEmail}
                </span>
              )}
              {patientPhone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {patientPhone}
                </span>
              )}
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "doctor_name",
      header: "Doctor",
      cell: ({ row }) => {
        const appointment = row.original;

        // Check if appointment has a doctor object (patient API structure)
        if (appointment.doctor) {
          return (
            <div className="space-y-1">
              <div className="font-medium">
                Dr. {appointment.doctor.first_name} {appointment.doctor.last_name}
              </div>
              <div className="text-sm text-muted-foreground">
                {appointment.doctor.specialization || 'Chiropractic Care'}
              </div>
            </div>
          );
        }

        // Fallback to admin API structure
        const doctor = doctors.find(d => d.id === appointment.doctor_id);
        return (
          <div className="space-y-1">
            <div className="font-medium">
              {doctor ? `Dr. ${doctor.first_name} ${doctor.last_name}` :
                appointment.doctor_name || 'Unknown Doctor'}
            </div>
            <div className="text-sm text-muted-foreground">
              {doctor?.specialization || 'Chiropractic Care'}
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.type || 'Consultation'}
        </Badge>
      )
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const getStatusColor = (status) => {
          switch (status) {
            case "confirmed": return "bg-green-100 text-green-800";
            case "pending": return "bg-yellow-100 text-yellow-800";
            case "completed": return "bg-blue-100 text-blue-800";
            case "cancelled": return "bg-red-100 text-red-800";
            case "no-show": return "bg-gray-100 text-gray-800";
            case "reschedule_requested": return "bg-purple-100 text-purple-800";
            default: return "bg-gray-100 text-gray-800";
          }
        };
        return <Badge className={getStatusColor(status)}>{status}</Badge>;
      }
    },
    {
      accessorKey: "fee",
      header: "Fee",
      cell: ({ row }) => {
        const fee = row.original.fee;
        return fee ? `$${fee}` : 'N/A';
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const appointment = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditModal({ isOpen: true, appointment })}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteAppointment(appointment.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  // Appointment Form for admin
  const AppointmentForm = ({ appointment, onClose }) => {
    const [formData, setFormData] = useState({
      patient_id: appointment?.patient_id || '',
      doctor_id: appointment?.doctor_id || '',
      appointment_date: appointment?.appointment_date || selectedDate,
      appointment_time: appointment?.appointment_time || '',
      type: appointment?.type || 'consultation',
      reason_for_visit: appointment?.reason_for_visit || '',
      duration_minutes: appointment?.duration_minutes || 30,
      status: appointment?.status || 'pending',
      fee: appointment?.fee || '',
      notes: appointment?.notes || ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (appointment) {
          await updateAppointment({ id: appointment.id, ...formData }).unwrap();
          toast.success('Appointment updated successfully');
        } else {
          await createAppointment(formData).unwrap();
          toast.success('Appointment created successfully');
        }
        onClose();
        refetch();
      } catch (error) {
        toast.error('Failed to save appointment');
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Patient</Label>
            <Select value={formData.patient_id} onValueChange={(value) => setFormData({ ...formData, patient_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name} - {patient.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctor">Doctor</Label>
            <Select value={formData.doctor_id} onValueChange={(value) => setFormData({ ...formData, doctor_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    Dr. {doctor.first_name} {doctor.last_name} - {doctor.specialization}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              type="date"
              value={formData.appointment_date}
              onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              type="time"
              value={formData.appointment_time}
              onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="treatment">Treatment</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="check-up">Check-up</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no-show">No Show</SelectItem>
                <SelectItem value="reschedule_requested">Reschedule Requested</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fee">Fee ($)</Label>
            <Input
              type="number"
              value={formData.fee}
              onChange={(e) => setFormData({ ...formData, fee: parseFloat(e.target.value) })}
              placeholder="0.00"
              step="0.01"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Visit</Label>
          <Input
            value={formData.reason_for_visit}
            onChange={(e) => setFormData({ ...formData, reason_for_visit: e.target.value })}
            placeholder="Brief description of the visit purpose"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Admin Notes</Label>
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Internal notes and observations"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {appointment ? 'Update' : 'Create'} Appointment
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">System Appointment Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setAnalyticsModal(true)}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.trend}</p>
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

      {/* Filters and Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          <Input
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>

        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="no-show">No Show</SelectItem>
          </SelectContent>
        </Select>

        <Select value={doctorFilter} onValueChange={setDoctorFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Doctor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Doctors</SelectItem>
            {doctors.map((doctor) => (
              <SelectItem key={doctor.id} value={doctor.id}>
                Dr. {doctor.first_name} {doctor.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedAppointments.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedAppointments.length} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBulkActionModal({ isOpen: true, action: 'confirm' })}
            >
              Bulk Confirm
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBulkActionModal({ isOpen: true, action: 'cancel' })}
            >
              Bulk Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredAppointments}
            onRowSelectionChange={setSelectedAppointments}
          />
        </CardContent>
      </Card>

      {/* Create Appointment Modal */}
      <Dialog open={createModal} onOpenChange={setCreateModal}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Create New Appointment</DialogTitle>
            <DialogDescription>
              Create a new appointment for any patient with any doctor.
            </DialogDescription>
          </DialogHeader>
          <AppointmentForm
            onClose={() => setCreateModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Appointment Modal */}
      <Dialog open={editModal.isOpen} onOpenChange={(open) => setEditModal({ isOpen: open, appointment: null })}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
            <DialogDescription>
              Update appointment details and status.
            </DialogDescription>
          </DialogHeader>
          <AppointmentForm
            appointment={editModal.appointment}
            onClose={() => setEditModal({ isOpen: false, appointment: null })}
          />
        </DialogContent>
      </Dialog>

      {/* Bulk Action Confirmation Modal */}
      <Dialog open={bulkActionModal.isOpen} onOpenChange={(open) => setBulkActionModal({ isOpen: open, action: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {bulkActionModal.action} {selectedAppointments.length} appointment(s)?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setBulkActionModal({ isOpen: false, action: null })}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleBulkAction(bulkActionModal.action)}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAppointments; 