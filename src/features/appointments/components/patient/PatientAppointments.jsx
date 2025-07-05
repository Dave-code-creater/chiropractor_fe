import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import { useGetAppointmentsQuery } from '@/services/appointmentApi';
import { useGetDoctorsQuery } from '@/services/appointmentApi';
import { useSelector } from 'react-redux';
import { selectUserId } from '@/state/data/authSlice';
import { Calendar, Search, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const PatientAppointments = () => {
  const patientId = useSelector(selectUserId);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: appointmentsData, isLoading: isLoadingAppointments } = useGetAppointmentsQuery({ 
    patient_id: patientId 
  });

  const { data: doctorsData, isLoading: isLoadingDoctors } = useGetDoctorsQuery();

  // Process appointments data
  const appointments = React.useMemo(() => {
    if (!appointmentsData) return [];
    return Array.isArray(appointmentsData?.metadata) ? appointmentsData.metadata :
           Array.isArray(appointmentsData) ? appointmentsData : [];
  }, [appointmentsData]);

  // Process doctors data
  const doctors = React.useMemo(() => {
    if (!doctorsData) return [];
    return Array.isArray(doctorsData?.metadata) ? doctorsData.metadata :
           Array.isArray(doctorsData) ? doctorsData : [];
  }, [doctorsData]);

  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    const doctorName = doctors.find(d => d.id === apt.doctorId)?.name || '';
    const matchesSearch = doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.type?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Calculate stats
  const stats = [
    {
      title: "Upcoming Appointments",
      value: appointments.filter(apt => 
        new Date(apt.date) >= new Date() && apt.status !== "cancelled"
      ).length,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pending Confirmation",
      value: appointments.filter(apt => apt.status === "pending").length,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Completed Sessions",
      value: appointments.filter(apt => apt.status === "completed").length,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    }
  ];

  const columns = [
    {
      accessorKey: "date",
      header: "Date & Time",
      cell: ({ row }) => {
        const { date, time } = row.original;
        const formattedDate = new Date(date).toLocaleDateString();
        const formattedTime = time ? new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }) : 'TBD';
        return (
          <div>
            <div className="font-medium">{formattedDate}</div>
            <div className="text-sm text-muted-foreground">{formattedTime}</div>
          </div>
        );
      }
    },
    {
      accessorKey: "doctorId",
      header: "Doctor",
      cell: ({ row }) => {
        const doctor = doctors.find(d => d.id === row.original.doctorId);
        return (
          <div>
            <div className="font-medium">
              {doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown Doctor'}
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
      cell: ({ row }) => row.original.type || 'Consultation'
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
        const canCancel = ["confirmed", "pending"].includes(appointment.status);
        const canReschedule = appointment.status !== "completed" && appointment.status !== "cancelled";
        
        return (
          <div className="flex gap-2">
            {canReschedule && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/appointments/reschedule/${appointment.id}`)}
              >
                Reschedule
              </Button>
            )}
            {canCancel && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // Handle cancellation
                  toast.info("Cancellation feature coming soon");
                }}
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
        <Button onClick={() => navigate('/appointments/book')}>
          <Plus className="w-4 h-4 mr-2" />
          Book Appointment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <CardTitle>Appointment History</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by doctor or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingAppointments || isLoadingDoctors ? (
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

export default PatientAppointments; 