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
import { 
  useGetAppointmentsQuery, 
  useUpdateAppointmentMutation, 
  useCreateAppointmentMutation,
  useDeleteAppointmentMutation,
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
  PhoneCall
} from 'lucide-react';
import { toast } from 'sonner';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';

const StaffAppointments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('today');
  
  // Modal states
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState({ isOpen: false, appointment: null });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, appointment: null });
  const [contactModal, setContactModal] = useState({ isOpen: false, appointment: null });

  // Query parameters based on active tab
  const queryParams = useMemo(() => {
    const params = {};
    
    if (activeTab === 'today') {
      params.date = selectedDate;
    } else if (activeTab === 'pending') {
      params.status = 'pending';
    } else if (activeTab === 'upcoming') {
      params.date_from = new Date().toISOString().split('T')[0];
      params.status_not = 'cancelled';
    } else if (activeTab === 'all') {
      // No additional filters for all appointments
    }
    
    if (statusFilter !== 'all') {
      params.status = statusFilter;
    }
    
    if (doctorFilter !== 'all') {
      params.doctor_id = doctorFilter;
    }
    
    return params;
  }, [activeTab, selectedDate, statusFilter, doctorFilter]);

  // API queries
  const { data: appointmentsData, isLoading, error, refetch } = useGetAppointmentsQuery(queryParams);
  const { data: doctorsData } = useGetDoctorsQuery();
  const { data: patientsData } = useGetPatientsQuery();

  // Mutations
  const [updateAppointment] = useUpdateAppointmentMutation();
  const [createAppointment] = useCreateAppointmentMutation();
  const [deleteAppointment] = useDeleteAppointmentMutation();

  // Process data
  const appointments = useMemo(() => {
    if (!appointmentsData) return [];
    return Array.isArray(appointmentsData?.metadata) ? appointmentsData.metadata :
           Array.isArray(appointmentsData?.data) ? appointmentsData.data :
           Array.isArray(appointmentsData) ? appointmentsData : [];
  }, [appointmentsData]);

  const doctors = useMemo(() => {
    if (!doctorsData) return [];
    return Array.isArray(doctorsData?.metadata) ? doctorsData.metadata :
           Array.isArray(doctorsData?.data) ? doctorsData.data :
           Array.isArray(doctorsData) ? doctorsData : [];
  }, [doctorsData]);

  const patients = useMemo(() => {
    if (!patientsData) return [];
    return Array.isArray(patientsData?.metadata) ? patientsData.metadata :
           Array.isArray(patientsData?.data) ? patientsData.data :
           Array.isArray(patientsData) ? patientsData : [];
  }, [patientsData]);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const matchesSearch = 
        apt.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patient_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.reason_for_visit?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [appointments, searchTerm]);

  // Calculate stats
  const stats = useMemo(() => {
    const todayAppointments = appointments.filter(apt => 
      isToday(new Date(apt.appointment_date))
    );
    
    const pendingAppointments = appointments.filter(apt => apt.status === 'pending');
    const confirmedToday = todayAppointments.filter(apt => apt.status === 'confirmed');
    const totalPatients = new Set(appointments.map(apt => apt.patient_id)).size;
    const followUpNeeded = appointments.filter(apt => 
      apt.status === 'completed' && !apt.follow_up_completed
    );

    return [
      {
        title: "Today's Schedule",
        value: todayAppointments.length,
        icon: Calendar,
        color: "text-blue-600",
        bgColor: "bg-blue-50"
      },
      {
        title: "Pending Confirmations",
        value: pendingAppointments.length,
        icon: Clock,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50"
      },
      {
        title: "Confirmed Today",
        value: confirmedToday.length,
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50"
      },
      {
        title: "Active Patients",
        value: totalPatients,
        icon: Users,
        color: "text-purple-600",
        bgColor: "bg-purple-50"
      },
      {
        title: "Follow-up Calls",
        value: followUpNeeded.length,
        icon: PhoneCall,
        color: "text-orange-600",
        bgColor: "bg-orange-50"
      }
    ];
  }, [appointments]);

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

  const handleBulkStatusUpdate = async (status) => {
    if (selectedAppointments.length === 0) {
      toast.error('Please select appointments to update');
      return;
    }

    try {
      // Since we don't have bulk update API yet, we'll update them one by one
      await Promise.all(
        selectedAppointments.map(id => 
          updateAppointment({ id, status }).unwrap()
        )
      );
      toast.success(`${selectedAppointments.length} appointments updated successfully`);
      setSelectedAppointments([]);
      refetch();
    } catch (error) {
      toast.error('Failed to update appointments');
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    try {
      await deleteAppointment(appointmentId).unwrap();
      toast.success('Appointment deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete appointment');
    }
  };

  const handleContactPatient = (appointment) => {
    setContactModal({ isOpen: true, appointment });
  };

  // Format date for display
  const formatAppointmentDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d, yyyy');
  };

  // Table columns
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
        const date = row.original.appointment_date;
        return (
          <div className="space-y-1">
            <div className="font-medium">{formatAppointmentDate(date)}</div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(date), 'EEEE')}
            </div>
          </div>
        );
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
        return (
          <div className="space-y-1">
            <div className="font-medium">{appointment.patient_name || 'Unknown Patient'}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              {appointment.patient_email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {appointment.patient_email}
                </span>
              )}
              {appointment.patient_phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {appointment.patient_phone}
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
      accessorKey: "reason_for_visit",
      header: "Reason",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate" title={row.original.reason_for_visit}>
          {row.original.reason_for_visit || 'Not specified'}
        </div>
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
            default: return "bg-gray-100 text-gray-800";
          }
        };
        return <Badge className={getStatusColor(status)}>{status}</Badge>;
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const appointment = row.original;
        return (
          <div className="flex items-center gap-2">
            {appointment.status === "pending" && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleStatusUpdate(appointment.id, "confirmed")}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Confirm
              </Button>
            )}
            {appointment.status === "confirmed" && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleStatusUpdate(appointment.id, "completed")}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Complete
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleContactPatient(appointment)}
            >
              <Phone className="w-4 h-4 mr-1" />
              Contact
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setEditModal({ isOpen: true, appointment })}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDeleteAppointment(appointment.id)}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        );
      }
    }
  ];

  // Create/Edit Appointment Form
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
            <Select value={formData.patient_id} onValueChange={(value) => setFormData({...formData, patient_id: value})}>
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
            <Select value={formData.doctor_id} onValueChange={(value) => setFormData({...formData, doctor_id: value})}>
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
              onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              type="time"
              value={formData.appointment_time}
              onChange={(e) => setFormData({...formData, appointment_time: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
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
            <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no-show">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Visit</Label>
          <Input
            value={formData.reason_for_visit}
            onChange={(e) => setFormData({...formData, reason_for_visit: e.target.value})}
            placeholder="Brief description of the visit purpose"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Staff Notes</Label>
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
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
        <h1 className="text-2xl font-bold">Appointment Management</h1>
        <div className="flex items-center gap-2">
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Filters and Actions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Appointments</CardTitle>
                <div className="flex items-center gap-2">
                  {selectedAppointments.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {selectedAppointments.length} selected
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleBulkStatusUpdate('confirmed')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Confirm All
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleBulkStatusUpdate('cancelled')}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Cancel All
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search appointments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by doctor" />
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
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
                {activeTab === 'today' && (
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-auto"
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={columns} 
                data={filteredAppointments}
                onRowSelectionChange={setSelectedAppointments}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Appointment Modal */}
      <Dialog open={createModal} onOpenChange={setCreateModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Appointment</DialogTitle>
            <DialogDescription>
              Schedule a new appointment for a patient.
            </DialogDescription>
          </DialogHeader>
          <AppointmentForm 
            onClose={() => setCreateModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Appointment Modal */}
      <Dialog open={editModal.isOpen} onOpenChange={(open) => setEditModal({ isOpen: open, appointment: null })}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
            <DialogDescription>
              Update the appointment details.
            </DialogDescription>
          </DialogHeader>
          <AppointmentForm 
            appointment={editModal.appointment}
            onClose={() => setEditModal({ isOpen: false, appointment: null })}
          />
        </DialogContent>
      </Dialog>

      {/* Contact Patient Modal */}
      <Dialog open={contactModal.isOpen} onOpenChange={(open) => setContactModal({ isOpen: open, appointment: null })}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Contact Patient</DialogTitle>
            <DialogDescription>
              Contact the patient regarding their appointment.
            </DialogDescription>
          </DialogHeader>
          {contactModal.appointment && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Patient Information</h4>
                <p><strong>Name:</strong> {contactModal.appointment.patient_name}</p>
                <p><strong>Email:</strong> {contactModal.appointment.patient_email}</p>
                <p><strong>Phone:</strong> {contactModal.appointment.patient_phone}</p>
                <p><strong>Appointment:</strong> {formatAppointmentDate(contactModal.appointment.appointment_date)} at {contactModal.appointment.appointment_time}</p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => window.open(`tel:${contactModal.appointment.patient_phone}`)}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Patient
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open(`mailto:${contactModal.appointment.patient_email}`)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Patient
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label>Quick Actions</Label>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      handleStatusUpdate(contactModal.appointment.id, 'confirmed');
                      setContactModal({ isOpen: false, appointment: null });
                    }}
                  >
                    Confirm Appointment
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setEditModal({ isOpen: true, appointment: contactModal.appointment });
                      setContactModal({ isOpen: false, appointment: null });
                    }}
                  >
                    Reschedule
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffAppointments; 