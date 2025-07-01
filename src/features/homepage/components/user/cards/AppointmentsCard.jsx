import React, { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, AlertCircle } from "lucide-react";
import { useGetUserAppointmentsQuery } from "@/services/appointmentApi";
import { useSelector } from "react-redux";
import CompactAppointmentCard from "@/components/CompactAppointmentCard";

export default function AppointmentsCard() {
  const [rescheduling, setRescheduling] = useState(false);
  const userID = useSelector((state) => state?.auth?.userID);
  const { data, isLoading, error } = useGetUserAppointmentsQuery(
    { status: 'scheduled', limit: 3 },
    { 
      skip: !userID,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }
  );



  // Extract appointments from the correct API response structure
  const appointments = useMemo(() => {
    if (!data) return [];
    
    let rawAppointments = [];
    if (data?.data?.appointments && Array.isArray(data.data.appointments)) {
      rawAppointments = data.data.appointments;
    } else if (Array.isArray(data)) {
      rawAppointments = data;
    } else if (data.appointments && Array.isArray(data.appointments)) {
      rawAppointments = data.appointments;
    }

    // Transform the appointment data to match the card format
    return rawAppointments.map(appt => ({
      id: appt.id,
      doctorName: `Dr. ${appt.doctor_first_name || appt.patient_first_name || 'Unknown'} ${appt.doctor_last_name || appt.patient_last_name || ''}`.trim(),
      specialty: appt.doctor_specialization || 'Chiropractic',
      date: new Date(appt.appointment_date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long", 
        day: "numeric",
        year: "numeric"
      }),
      time: new Date(`1970-01-01T${appt.appointment_time}`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      }),
      duration: `${appt.duration_minutes || 30} minutes`,
      location: appt.location || "Clinic",
      status: appt.status
    }));
  }, [data]);

  return (
    <Card className="h-full border-0 shadow-lg bg-gradient-to-br from-card to-muted/20 hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] backdrop-blur-sm flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <CalendarDays className="w-4 h-4 text-primary" />
          </div>
          Upcoming Appointment
          {appointments.length > 1 && (
            <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {appointments.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      {!rescheduling ? (
        <CardContent className="flex-1 flex flex-col overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="p-4 rounded-full bg-red-50 mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-sm text-muted-foreground">
                Unable to load appointments
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {error?.status === 500 ? 'Server temporarily unavailable' : 'Please try again later'}
              </p>
            </div>
          ) : appointments.length > 0 ? (
            <div className="space-y-4 overflow-y-auto flex-1 pr-2 -mr-2">
              {appointments.map((appt) => (
                <CompactAppointmentCard 
                  key={appt.id || appt.date} 
                  appointment={appt} 
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="p-4 rounded-full bg-muted/50 mb-4">
                <CalendarDays className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No appointment exist.
              </p>
            </div>
          )}
        </CardContent>
      ) : (
        <CardContent className="space-y-4">
          <Calendar />
          <div className="flex justify-between">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </button>
            <button
              onClick={() => setRescheduling(false)}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Back
            </button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
