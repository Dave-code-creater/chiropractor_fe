import { useState, useMemo } from "react";
import { useGetMyAppointmentsQuery } from "@/api/services/appointmentApi";
import { useSelector } from "react-redux";
import { extractList } from '@/utils/apiResponse';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { isFuture, isToday } from 'date-fns';
import AppointmentCardCompact from "@/components/AppointmentCardCompact";

export default function AppointmentsCard() {
  const [rescheduling, setRescheduling] = useState(false);
  const userID = useSelector((state) => state?.auth?.userID);
  const { data, isLoading, error } = useGetMyAppointmentsQuery(
    {
      status_not: 'cancelled',
      limit: 100
    },
    {
      skip: !userID,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }
  );

  const appointments = useMemo(() => {
    const rawAppointments = extractList(data, 'appointments');

    const now = new Date();

    const formatTime = (time) => {
      if (!time) return 'TBD';
      const str = String(time).trim();
      const ampm = str.match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/);
      if (ampm) {
        return `${ampm[1]}:${ampm[2]} ${ampm[3].toUpperCase()}`;
      }
      const hhmm = str.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
      if (hhmm) {
        let hours = parseInt(hhmm[1], 10);
        const minutes = hhmm[2];
        const suffix = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${suffix}`;
      }
      return str;
    };

    const parseTimeToMinutes = (time) => {
      if (!time) return 0;
      const str = String(time).trim();
      const hhmm = str.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
      if (hhmm) {
        const hours = parseInt(hhmm[1], 10);
        const minutes = parseInt(hhmm[2], 10);
        return hours * 60 + minutes;
      }
      const ampm = str.match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/);
      if (ampm) {
        let hours = parseInt(ampm[1], 10);
        const minutes = parseInt(ampm[2], 10);
        const isPM = ampm[3].toUpperCase() === 'PM';
        if (hours === 12) hours = 0;
        return (isPM ? hours + 12 : hours) * 60 + minutes;
      }
      return 0;
    };

    const todaysMinutes = now.getHours() * 60 + now.getMinutes();
    const allowedStatuses = new Set(['pending', 'confirmed', 'scheduled']);

    const normalizeStatus = (status) => (status || '').toString().trim().toLowerCase();

    const withinFutureWindow = (appointment) => {
      const appointmentDate = new Date(
        appointment.appointment_date || appointment.date || appointment.datetime
      );
      if (Number.isNaN(appointmentDate.getTime())) return false;

      if (isToday(appointmentDate)) {
        return parseTimeToMinutes(appointment.appointment_time) >= todaysMinutes;
      }

      return isFuture(appointmentDate);
    };

    const activeAppointments = rawAppointments.filter((appt) => {
      const normalizedStatus = normalizeStatus(appt.status);
      if (!allowedStatuses.has(normalizedStatus)) return false;
      if (appt.is_cancel || appt.is_cancelled || normalizedStatus === 'cancelled') return false;
      return withinFutureWindow(appt);
    });

    const toComparableTimestamp = (appt) => {
      const appointmentDate = new Date(
        appt.appointment_date || appt.date || appt.datetime
      );
      if (Number.isNaN(appointmentDate.getTime())) return Number.POSITIVE_INFINITY;
      const dayStart = new Date(appointmentDate);
      dayStart.setHours(0, 0, 0, 0);
      return dayStart.getTime() + parseTimeToMinutes(appt.appointment_time) * 60 * 1000;
    };

    const getDateValue = (appt) => appt.appointment_date || appt.date || appt.datetime;

    const upcomingSorted = [...activeAppointments].sort(
      (a, b) => toComparableTimestamp(a) - toComparableTimestamp(b)
    );

    return upcomingSorted.slice(0, 1).map(appt => ({
      id: appt.id,
      doctorName: appt.doctor
        ? `Dr. ${appt.doctor.first_name} ${appt.doctor.last_name}`
        : appt.doctor_name
          ? `Dr. ${appt.doctor_name}`
          : 'Dr. Unknown',
      specialty: appt.doctor?.specialization || appt.doctor_specialization || 'Chiropractic',
      date: new Date(getDateValue(appt)).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      }),
      time: formatTime(appt.appointment_time),
      duration: `${appt.duration_minutes || 30} minutes`,
      location: appt.location || appt.clinic_location || "Clinic",
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
          {/* Showing only the next appointment; omit count badge */}
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
                  <AppointmentCardCompact
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
