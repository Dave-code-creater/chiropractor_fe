import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import { useGetAppointmentsQuery, useUpdateAppointmentMutation } from '@/services/appointmentApi';
import { useSelector } from 'react-redux';
import { selectUserId } from '@/state/data/authSlice';
import { Calendar, Search, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const DoctorAppointments = () => {
  const doctorId = useSelector(selectUserId);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: appointmentsData, isLoading, error } = useGetAppointmentsQuery({ 
    doctor_id: doctorId,
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
                         apt.type?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Calculate stats
  const stats = [
    {
      title: "Today's Appointments",
      value: appointments.filter(apt => apt.date === selectedDate).length,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pending Reviews",
      value: appointments.filter(apt => apt.status === "completed" && !apt.reviewed).length,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Completed Today",
      value: appointments.filter(apt => 
        apt.status === "completed" && apt.date === selectedDate
      ).length,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Patient Load",
      value: new Set(appointments.map(apt => apt.patientId)).size,
      icon: TrendingUp,
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
            {appointment.status !== "completed" && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleStatusUpdate(appointment.id, "completed")}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete
              </Button>
            )}
            {appointment.status !== "cancelled" && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleStatusUpdate(appointment.id, "cancelled")}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Appointments</h1>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-auto"
        />
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

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Appointments</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">Error loading appointments</div>
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

export default DoctorAppointments; 