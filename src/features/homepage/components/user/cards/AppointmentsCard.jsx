import React, { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, AlertCircle } from "lucide-react";
import { useGetMyAppointmentsQuery } from "@/api/services/appointmentApi";
import { useSelector } from "react-redux";
import CompactAppointmentCard from "@/components/CompactAppointmentCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { extractList } from '@/utils/apiResponse';

export default function AppointmentsCard() {
  const [rescheduling, setRescheduling] = useState(false);
  const userID = useSelector((state) => state?.auth?.userID);
  const { data, isLoading, error } = useGetMyAppointmentsQuery(
    {
      status_not: 'cancelled', // Exclude cancelled appointments
      date_from: new Date().toISOString().split('T')[0], // Only upcoming appointments
      limit: 10
    },
    {
      skip: !userID,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }
  );

  // Extract appointments from the correct API response structure
  const appointments = useMemo(() => {
    const rawAppointments = extractList(data, 'appointments');

    const activeAppointments = rawAppointments.filter(appt => !appt.is_cancel && !appt.is_cancelled && appt.status !== 'cancelled');

    return activeAppointments.slice(0, 3).map(appt => ({
      id: appt.id,
      doctorName: appt.doctor
        ? `Dr. ${appt.doctor.first_name} ${appt.doctor.last_name}`
        : 'Dr. Unknown',
      specialty: appt.doctor?.specialization || 'Chiropractic',
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
      status: appt.status,
      is_cancel: appt.is_cancel || appt.is_cancelled || false
    }));
  }, [data]);

  return (
    <Card className="h-[400px] border-0 shadow-lg bg-gradient-to-br from-card to-muted/20 hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] backdrop-blur-sm flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
          <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
            <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
          </div>
          <span className="hidden sm:inline">Upcoming Appointment</span>
          <span className="sm:hidden">Appointments</span>
          {appointments.length > 1 && (
            <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              {appointments.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      {!rescheduling ? (
        <CardContent className="flex-1 flex flex-col p-3 sm:p-6 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-6 sm:py-8">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8 sm:py-12">
              <div className="p-3 sm:p-4 rounded-full bg-red-50 mb-3 sm:mb-4">
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Unable to load appointments
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {error?.status === 500 ? 'Server temporarily unavailable' : 'Please try again later'}
              </p>
            </div>
          ) : appointments.length > 0 ? (
            <ScrollArea className="flex-1">
              <div className="space-y-3 sm:space-y-4 pr-2">
                {appointments.map((appt) => (
                  <CompactAppointmentCard
                    key={appt.id || appt.date}
                    appointment={appt}
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-8 sm:py-12">
              <div className="p-3 sm:p-4 rounded-full bg-muted/50 mb-3 sm:mb-4">
                <CalendarDays className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                No upcoming appointments.
              </p>
            </div>
          )}
        </CardContent>
      ) : (
        <CardContent className="space-y-4 p-3 sm:p-6">
          <Calendar />
          <div className="flex justify-between">
            <button className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </button>
            <button
              onClick={() => setRescheduling(false)}
              className="text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Back
            </button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
