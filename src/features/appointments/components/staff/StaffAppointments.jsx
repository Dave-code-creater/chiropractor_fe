import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import { useGetAppointmentsQuery, useUpdateAppointmentMutation } from '@/services/appointmentApi';
import { Calendar, Search, Plus, Clock, CheckCircle, XCircle, Users, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StaffAppointments = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStatus, setSelectedStatus] = useState('all');

  const { data: appointmentsData, isLoading } = useGetAppointmentsQuery({ 
    date: selectedDate 
  });

  const [updateAppointment] = useUpdateAppointmentMutation();

  // Process appointments data
  const appointments = React.useMemo(() => {
    if (!appointmentsData) return [];
    return Array.isArray(appointmentsData?.metadata) ? appointmentsData.metadata :
           Array.isArray(appointmentsData) ? appointmentsData : [];
  }, [appointmentsData]);

  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || apt.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = [
    {
      title: "Today's Schedule",
      value: appointments.filter(apt => apt.date === selectedDate).length,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pending Confirmations",
      value: appointments.filter(apt => apt.status === "pending").length,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Active Patients",
      value: new Set(appointments.map(apt => apt.patientId)).size,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Follow-up Calls",
      value: appointments.filter(apt => 
        apt.status === "completed" && !apt.followUpCompleted
      ).length,
      icon: Phone,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await updateAppointment({
        id: appointmentId,
        status: newStatus
      }).unwrap();
      toast.success(`Appointment ${newStatus} successfully`);
    } catch (error) {
      console.error('Update appointment error:', error);
      toast.error('Failed to update appointment status');
    }
  };

  const columns = [
    {
      accessorKey: "time",
      header: "Time",
      cell: ({ row }) => {
        const time = row.original.time;
        return time ? new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }) : 'TBD';
      }
    },
    {
      accessorKey: "patientName",
      header: "Patient",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.patientName}</div>
          <div className="text-sm text-muted-foreground">{row.original.type || 'Consultation'}</div>
        </div>
      )
    },
    {
      accessorKey: "doctorName",
      header: "Doctor",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.doctorName}</div>
          <div className="text-sm text-muted-foreground">Chiropractic Care</div>
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
          <div className="flex gap-2">
            {appointment.status === "pending" && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleStatusUpdate(appointment.id, "confirmed")}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm
              </Button>
            )}
            {appointment.status !== "completed" && appointment.status !== "cancelled" && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleStatusUpdate(appointment.id, "cancelled")}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/appointments/edit/${appointment.id}`)}
            >
              Edit
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Appointment Management</h1>
        <Button onClick={() => navigate('/appointments/new')}>
          <Plus className="w-4 h-4 mr-2" />
          New Appointment
        </Button>
      </div>

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

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient, doctor, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Appointments ({filteredAppointments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <DataTable 
              columns={columns} 
              data={filteredAppointments}
              noResultsMessage="No appointments found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffAppointments; 