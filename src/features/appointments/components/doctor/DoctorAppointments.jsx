import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  useGetUserAppointmentsQuery,
  useUpdateAppointmentMutation, 
  useCreateAppointmentMutation,
  useDeleteAppointmentMutation
} from '@/api/services/appointmentApi';
import { useGetPatientsQuery } from '@/api/services/userApi';
import { useSelector } from 'react-redux';
import { selectUserId, selectUserRole } from '@/state/data/authSlice';
import { 
  Calendar, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  User,
  Phone,
  Mail,
  Filter,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { toast } from 'sonner';
import { format, isToday, isPast, isFuture } from 'date-fns';

const DoctorAppointments = () => {
  const currentUserId = useSelector(selectUserId);
  const userRole = useSelector(selectUserRole);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('today');
  
  // Reset page when tab or search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, statusFilter]);
  const [selectedUserId, setSelectedUserId] = useState(''); // Placeholder for user selection
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Modal states
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState({ isOpen: false, appointment: null });

  // API queries - using the same API as patient appointments
  const { data: appointmentsData, isLoading, error, refetch } = useGetUserAppointmentsQuery({
    status_not: 'cancelled', // Exclude cancelled appointments like patient view
    limit: 100
  });

  const { data: patientsData } = useGetPatientsQuery();

  // Mutations
  const [updateAppointment] = useUpdateAppointmentMutation();
  const [createAppointment] = useCreateAppointmentMutation();
  const [deleteAppointment] = useDeleteAppointmentMutation();

  // Process appointments data - same logic as PatientAppointments
  const appointments = useMemo(() => {
    if (!appointmentsData) return [];
    
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
  }, [appointmentsData]);

  const patients = useMemo(() => {
    if (!patientsData) return [];
    return Array.isArray(patientsData?.data) ? patientsData.data :
           Array.isArray(patientsData) ? patientsData : [];
  }, [patientsData]);

  // Categorize appointments - same logic as PatientAppointments
  const categorizedAppointments = useMemo(() => {
    const result = {
      today: appointments.filter(apt => {
        const appointmentDate = new Date(apt.appointment_date || apt.date || apt.datetime);
        const isItToday = isToday(appointmentDate);
        const hasValidStatus = ['pending', 'confirmed', 'scheduled'].includes(apt.status);
        return isItToday && hasValidStatus;
      }),
      upcoming: appointments.filter(apt => {
        const appointmentDate = new Date(apt.appointment_date || apt.date || apt.datetime);
        const isItFuture = isFuture(appointmentDate);
        const hasValidStatus = ['pending', 'confirmed', 'scheduled'].includes(apt.status);
        return isItFuture && hasValidStatus;
      }),
      past: appointments.filter(apt => {
        const appointmentDate = new Date(apt.appointment_date || apt.date || apt.datetime);
        const isItPast = isPast(appointmentDate);
        const isPastStatus = ['completed', 'cancelled'].includes(apt.status);
        return isItPast || isPastStatus;
      }),
      all: appointments
    };
    
    return result;
  }, [appointments]);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    const currentAppointments = categorizedAppointments[activeTab] || [];
    
    const filtered = currentAppointments.filter(apt => {
      // If no search term, include all appointments
      if (!searchTerm.trim()) {
        const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
        return matchesStatus;
      }
      
      // If there's a search term, try to match against available fields
      const matchesSearch = 
        apt.patient?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patient?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patient?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.reason_for_visit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.status?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    return filtered;
  }, [categorizedAppointments, activeTab, searchTerm, statusFilter]);

  // Pagination logic
  const paginatedAppointments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAppointments.slice(startIndex, endIndex);
  }, [filteredAppointments, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  // Calculate stats - same logic as PatientAppointments
  const stats = useMemo(() => {
    const todayAppointments = categorizedAppointments.today.length;
    const upcomingAppointments = categorizedAppointments.upcoming.length;
    const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
    const totalPatients = new Set(appointments.map(apt => apt.patient?.id).filter(Boolean)).size;

    return [
      {
        title: "Today's Appointments",
        value: todayAppointments,
        icon: Calendar,
        color: "text-blue-600",
        bgColor: "bg-blue-50"
      },
      {
        title: "Upcoming",
        value: upcomingAppointments,
        icon: Clock,
        color: "text-orange-600",
        bgColor: "bg-orange-50"
      },
      {
        title: "Completed",
        value: completedAppointments,
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50"
      },
      {
        title: "Total Patients",
        value: totalPatients,
        icon: User,
        color: "text-purple-600",
        bgColor: "bg-purple-50"
      }
    ];
  }, [categorizedAppointments, appointments]);

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
      console.error('Update appointment error:', error);
      toast.error('Failed to update appointment status');
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedAppointments.length === 0) {
      toast.error('Please select appointments to update');
      return;
    }

    try {
      await Promise.all(
        selectedAppointments.map(id => 
          updateAppointment({ id, status }).unwrap()
        )
      );
      toast.success(`${selectedAppointments.length} appointments updated successfully`);
      setSelectedAppointments([]);
      refetch();
    } catch (error) {
      console.error('Bulk update error:', error);
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
      console.error('Delete appointment error:', error);
      toast.error('Failed to delete appointment');
    }
  };

  // Format time - same as PatientAppointments
  const formatTime = (time) => {
    if (!time) return 'TBD';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Get status color - same as PatientAppointments
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-cyan-100 text-cyan-800';
      case 'reschedule_requested': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Table columns


  // Create/Edit Appointment Form - simplified version
  const AppointmentForm = ({ appointment, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      patient_id: appointment?.patient?.id || '',
      appointment_date: appointment?.appointment_date || new Date().toISOString().split('T')[0],
      appointment_time: appointment?.appointment_time || '',
      reason_for_visit: appointment?.reason_for_visit || '',
      location: appointment?.location || 'Colorado (Denver)',
      status: appointment?.status || 'pending',
      additional_notes: appointment?.additional_notes || ''
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
        console.error('Save appointment error:', error);
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
            <Label htmlFor="location">Location</Label>
            <Select value={formData.location} onValueChange={(value) => setFormData({...formData, location: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Colorado (Denver)">Colorado (Denver)</SelectItem>
                <SelectItem value="Main Clinic">Main Clinic</SelectItem>
                <SelectItem value="Downtown Branch">Downtown Branch</SelectItem>
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

        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Visit</Label>
          <Input
            value={formData.reason_for_visit}
            onChange={(e) => setFormData({...formData, reason_for_visit: e.target.value})}
            placeholder="Brief description of the visit purpose"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            value={formData.additional_notes}
            onChange={(e) => setFormData({...formData, additional_notes: e.target.value})}
            placeholder="Additional notes or instructions"
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {userRole === 'admin' ? 'All Appointments' : 'My Appointments'}
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* User Selection Placeholder */}
      {userRole === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle>User Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="user-select">Select User to View Appointments For:</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a user (doctor/patient) to view their appointments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Users</SelectItem>
                    {/* This would be populated with actual users from API */}
                    <SelectItem value="placeholder-doctor-1">Dr. John Doe</SelectItem>
                    <SelectItem value="placeholder-patient-1">Patient Jane Smith</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" disabled>
                Apply Filter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <TabsTrigger value="today">
            Today ({categorizedAppointments.today.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({categorizedAppointments.upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({categorizedAppointments.past.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({categorizedAppointments.all.length})
          </TabsTrigger>
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
                        Confirm All
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleBulkStatusUpdate('completed')}
                      >
                        Complete All
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No appointments found</p>
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                                                     <TableHead className="w-[50px]">
                             <Checkbox
                               checked={paginatedAppointments.length > 0 && paginatedAppointments.every(apt => selectedAppointments.includes(apt.id))}
                               onCheckedChange={(checked) => {
                                 if (checked) {
                                   // Select all appointments on current page
                                   const newSelected = [...selectedAppointments, ...paginatedAppointments.map(apt => apt.id).filter(id => !selectedAppointments.includes(id))];
                                   setSelectedAppointments(newSelected);
                                 } else {
                                   // Deselect all appointments on current page
                                   const pageIds = paginatedAppointments.map(apt => apt.id);
                                   setSelectedAppointments(selectedAppointments.filter(id => !pageIds.includes(id)));
                                 }
                               }}
                             />
                           </TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                                                 {paginatedAppointments.map((appointment) => {
                          const patient = appointment.patient;
                          const isSelected = selectedAppointments.includes(appointment.id);
                          const canCancel = ['pending', 'confirmed', 'scheduled'].includes(appointment.status);
                          
                          return (
                            <TableRow key={appointment.id} className={isSelected ? "bg-muted/50" : ""}>
                              <TableCell>
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedAppointments([...selectedAppointments, appointment.id]);
                                    } else {
                                      setSelectedAppointments(selectedAppointments.filter(id => id !== appointment.id));
                                    }
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="font-medium">
                                    {patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient'}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {patient?.email || patient?.phone || 'No contact info'}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(appointment.status)}>
                                  {appointment.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {appointment.appointment_date ? 
                                  format(new Date(appointment.appointment_date), 'MMM d, yyyy') : 
                                  'Not set'
                                }
                              </TableCell>
                              <TableCell>
                                {appointment.appointment_time ? formatTime(appointment.appointment_time) : 'TBD'}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {canCancel && (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleStatusUpdate(appointment.id, "cancelled")}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <XCircle className="w-4 h-4 mr-1" />
                                      Cancel
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                                             </TableBody>
                     </Table>
                   </div>
                   
                   {/* Pagination Controls */}
                   {totalPages > 1 && (
                     <div className="flex items-center justify-between mt-4">
                       <div className="text-sm text-muted-foreground">
                         Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAppointments.length)} of {filteredAppointments.length} appointments
                       </div>
                       <div className="flex items-center space-x-2">
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => setCurrentPage(1)}
                           disabled={currentPage === 1}
                         >
                           <ChevronsLeft className="h-4 w-4" />
                         </Button>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => setCurrentPage(currentPage - 1)}
                           disabled={currentPage === 1}
                         >
                           <ChevronLeft className="h-4 w-4" />
                         </Button>
                         <span className="text-sm">
                           Page {currentPage} of {totalPages}
                         </span>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => setCurrentPage(currentPage + 1)}
                           disabled={currentPage === totalPages}
                         >
                           <ChevronRight className="h-4 w-4" />
                         </Button>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => setCurrentPage(totalPages)}
                           disabled={currentPage === totalPages}
                         >
                           <ChevronsRight className="h-4 w-4" />
                         </Button>
                       </div>
                     </div>
                   )}
                 </>
               )}
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
            onSave={() => setCreateModal(false)}
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
            onSave={() => setEditModal({ isOpen: false, appointment: null })}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorAppointments; 