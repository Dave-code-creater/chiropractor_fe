import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  User,
  Settings,
  Copy,
  RefreshCw,
  Filter,
  Search,
  MoreHorizontal,
  Eye,
  EyeOff,
  MapPin,
  Phone,
  Mail,
  Activity,
  TrendingUp,
  Users,
  FileText,
  Loader2,
} from "lucide-react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  isSameDay,
  parseISO,
  isWithinInterval,
} from "date-fns";
import {
  useGetDoctorProfilesQuery,
  useGetAllDoctorsScheduleQuery,
  useGetTimeOffRequestsQuery,
  useCreateTimeOffRequestMutation,
  useUpdateDoctorWorkingHoursMutation,
  useGetScheduleStatisticsQuery,
  useGetDoctorConflictsQuery,
} from "@/api/services/doctorScheduleApi";
import { useGetAppointmentsQuery } from "@/api/services/appointmentApi";

const DoctorAvailabilitySystem = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [viewMode, setViewMode] = useState("week"); // week, day, month
  const [showConflicts, setShowConflicts] = useState(true);
  const [editingSchedule, setEditingSchedule] = useState(null);

  // Calculate date range for queries
  const dateRange = useMemo(() => {
    const start = startOfWeek(selectedDate);
    const end = endOfWeek(selectedDate);
    return {
      startDate: format(start, "yyyy-MM-dd"),
      endDate: format(end, "yyyy-MM-dd"),
    };
  }, [selectedDate]);

  // API Queries
  const {
    data: doctorsData,
    isLoading: doctorsLoading,
    error: doctorsError,
  } = useGetDoctorProfilesQuery();

  const {
    data: scheduleData,
    isLoading: scheduleLoading,
    error: scheduleError,
  } = useGetAllDoctorsScheduleQuery({
    ...dateRange,
    doctor_ids: selectedDoctor !== "all" ? [selectedDoctor] : [],
  });

  const {
    data: appointmentsData,
    isLoading: appointmentsLoading,
    error: appointmentsError,
  } = useGetAppointmentsQuery({
    doctor_id: selectedDoctor !== "all" ? selectedDoctor : undefined,
  });

  const {
    data: timeOffData,
    isLoading: timeOffLoading,
    error: timeOffError,
  } = useGetTimeOffRequestsQuery({
    doctor_id: selectedDoctor !== "all" ? selectedDoctor : undefined,
    start_date: dateRange.startDate,
    end_date: dateRange.endDate,
  });

  const {
    data: statisticsData,
    isLoading: statisticsLoading,
  } = useGetScheduleStatisticsQuery({
    doctor_id: selectedDoctor !== "all" ? selectedDoctor : undefined,
    ...dateRange,
  });

  const {
    data: conflictsData,
    isLoading: conflictsLoading,
  } = useGetDoctorConflictsQuery(
    {
      doctor_id: selectedDoctor,
      start_date: dateRange.startDate,
      end_date: dateRange.endDate,
    },
    {
      skip: selectedDoctor === "all",
    }
  );

  // Mutations
  const [createTimeOffRequest] = useCreateTimeOffRequestMutation();
  const [updateWorkingHours] = useUpdateDoctorWorkingHoursMutation();

  // Transform API data
  const doctors = useMemo(() => {
    if (!doctorsData) return [];
    return doctorsData.data || doctorsData || [];
  }, [doctorsData]);

  const appointments = useMemo(() => {
    if (!appointmentsData) return [];
    return appointmentsData.data || appointmentsData || [];
  }, [appointmentsData]);

  const timeOffRequests = useMemo(() => {
    if (!timeOffData) return [];
    return timeOffData.data || timeOffData || [];
  }, [timeOffData]);

  const statistics = useMemo(() => {
    if (!statisticsData) {
      return {
        totalDoctors: doctors.length,
        activeDoctors: doctors.filter((doc) => doc.status === "active").length,
        todayAppointments: 0,
        availableSlots: 0,
        conflicts: 0,
      };
    }
    return statisticsData.data || statisticsData;
  }, [statisticsData, doctors]);

  // Generate time slots for a doctor on a specific date
  const generateTimeSlots = useCallback(
    (doctor, date) => {
      if (!doctor?.working_hours && !doctor?.workingHours) return [];
      
      const workingHours = doctor.working_hours || doctor.workingHours;
      const dayName = format(date, "EEEE").toLowerCase();
      const dayHours = workingHours[dayName];

      if (!dayHours?.enabled) return [];

      const slots = [];
      const startTime = parseISO(
        `${format(date, "yyyy-MM-dd")}T${dayHours.start}:00`,
      );
      const endTime = parseISO(
        `${format(date, "yyyy-MM-dd")}T${dayHours.end}:00`,
      );

      let currentTime = startTime;

      while (currentTime < endTime) {
        const slotEnd = new Date(currentTime.getTime() + 30 * 60000); // 30-minute slots

        // Check if this slot conflicts with existing appointments
        const conflict = appointments.find(
          (apt) =>
            apt.doctor_id === doctor.id &&
            apt.appointment_date === format(date, "yyyy-MM-dd") &&
            apt.appointment_time <= format(currentTime, "HH:mm") &&
            apt.appointment_time + apt.duration_minutes > format(currentTime, "HH:mm"),
        );

        // Check if this slot conflicts with time-off
        const timeOff = timeOffRequests.find(
          (to) =>
            to.doctor_id === doctor.id &&
            to.status === "approved" &&
            isWithinInterval(date, {
              start: parseISO(to.start_date),
              end: parseISO(to.end_date),
            }),
        );

        slots.push({
          time: format(currentTime, "HH:mm"),
          available: !conflict && !timeOff,
          appointment: conflict,
          timeOff: timeOff,
          slotEnd: format(slotEnd, "HH:mm"),
        });

        currentTime = slotEnd;
      }

      return slots;
    },
    [appointments, timeOffRequests],
  );

  // Get filtered doctors based on selection
  const filteredDoctors = useMemo(() => {
    if (selectedDoctor === "all") return doctors;
    return doctors.filter((doc) => doc.id === selectedDoctor);
  }, [doctors, selectedDoctor]);

  // Get week dates for week view
  const weekDates = useMemo(() => {
    const start = startOfWeek(selectedDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [selectedDate]);

  const handleScheduleUpdate = async (doctor_id, updates) => {
    try {
      await updateWorkingHours({ doctor_id, workingHours: updates }).unwrap();
      toast.success("Schedule updated successfully");
    } catch (error) {
      toast.error("Failed to update schedule");
    }
  };

  const handleTimeOffRequest = async (request) => {
    try {
      await createTimeOffRequest(request).unwrap();
      toast.success("Time-off request submitted");
    } catch (error) {
      toast.error("Failed to submit time-off request");
    }
  };

  // Loading state
  if (doctorsLoading || scheduleLoading || appointmentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading doctor availability...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (doctorsError || scheduleError || appointmentsError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Data</AlertTitle>
          <AlertDescription>
            Unable to load doctor availability information. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const DoctorCard = ({ doctor }) => (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={doctor.avatar || doctor.profile_image} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {doctor.first_name?.[0] || doctor.firstName?.[0]}
                {doctor.last_name?.[0] || doctor.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                Dr. {doctor.first_name || doctor.firstName}{" "}
                {doctor.last_name || doctor.lastName}
              </CardTitle>
              <CardDescription>
                {doctor.specialization || doctor.specializations?.primary}
              </CardDescription>
            </div>
          </div>
          <Badge variant={doctor.status === "active" ? "default" : "secondary"}>
            {doctor.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{doctor.phone || doctor.phone_number}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{doctor.email}</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Today's Schedule</h4>
            <div className="space-y-1">
              {generateTimeSlots(doctor, new Date())
                .slice(0, 5)
                .map((slot, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-xs"
                  >
                    <span>{slot.time}</span>
                    <Badge
                      variant={slot.available ? "secondary" : "default"}
                      className="text-xs"
                    >
                      {slot.available ? "Available" : "Booked"}
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const WeekView = () => (
    <div className="space-y-4">
      {filteredDoctors.map((doctor) => (
        <Card key={doctor.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={doctor.avatar || doctor.profile_image} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {doctor.first_name?.[0] || doctor.firstName?.[0]}
                    {doctor.last_name?.[0] || doctor.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">
                    Dr. {doctor.first_name || doctor.firstName}{" "}
                    {doctor.last_name || doctor.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {doctor.specialization}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Schedule
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {weekDates.map((date) => {
                const daySlots = generateTimeSlots(doctor, date);
                const dayName = format(date, "EEE");
                const dateNum = format(date, "d");
                const isToday = isSameDay(date, new Date());

                return (
                  <div
                    key={date.toISOString()}
                    className="border rounded-lg p-2"
                  >
                    <div className="text-center mb-2">
                      <div
                        className={`text-sm font-medium ${isToday ? "text-blue-600" : "text-gray-900"}`}
                      >
                        {dayName}
                      </div>
                      <div
                        className={`text-xs ${isToday ? "text-blue-600" : "text-gray-500"}`}
                      >
                        {dateNum}
                      </div>
                    </div>
                    <div className="space-y-1">
                      {daySlots.slice(0, 8).map((slot, index) => (
                        <div
                          key={index}
                          className={`text-xs p-1 rounded ${
                            slot.available
                              ? "bg-green-100 text-green-800"
                              : slot.appointment
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {slot.time}
                          {slot.appointment && (
                            <div className="truncate">
                              {slot.appointment.patient_name}
                            </div>
                          )}
                        </div>
                      ))}
                      {daySlots.length > 8 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{daySlots.length - 8} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const DayView = () => {
    const selectedDateStr = format(selectedDate, "yyyy-MM-dd");

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDoctors.map((doctor) => {
          const daySlots = generateTimeSlots(doctor, selectedDate);
          const dayAppointments = appointments.filter(
            (apt) => apt.doctor_id === doctor.id && apt.appointment_date === selectedDateStr,
          );

          return (
            <Card key={doctor.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={doctor.avatar || doctor.profile_image} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {doctor.first_name?.[0] || doctor.firstName?.[0]}
                        {doctor.last_name?.[0] || doctor.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        Dr. {doctor.first_name || doctor.firstName}{" "}
                        {doctor.last_name || doctor.lastName}
                      </CardTitle>
                      <CardDescription>
                        {format(selectedDate, "EEEE, MMMM d, yyyy")}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {dayAppointments.length} appointments
                    </div>
                    <div className="text-sm text-gray-600">
                      {daySlots.filter((slot) => slot.available).length}{" "}
                      available slots
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {daySlots.map((slot, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          slot.available
                            ? "border-green-200 bg-green-50"
                            : slot.appointment
                              ? "border-blue-200 bg-blue-50"
                              : "border-red-200 bg-red-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="font-medium">{slot.time}</div>
                            {slot.appointment && (
                              <div>
                                <div className="font-medium">
                                  {slot.appointment.patient_name}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {slot.appointment.type}
                                </div>
                              </div>
                            )}
                            {slot.timeOff && (
                              <div>
                                <div className="font-medium text-red-600">
                                  Time Off
                                </div>
                                <div className="text-sm text-red-500">
                                  {slot.timeOff.reason}
                                </div>
                              </div>
                            )}
                            {slot.available && (
                              <div className="text-green-600">Available</div>
                            )}
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const ConflictAlert = ({ conflicts }) => {
    if (!conflicts || conflicts.length === 0) return null;

    return (
      <Alert className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Schedule Conflicts Detected</AlertTitle>
        <AlertDescription>
          {conflicts.length} scheduling conflict(s) found. Please review and resolve.
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Doctor Availability & Scheduling
          </h2>
          <p className="text-gray-600">
            Manage doctor schedules, availability, and appointments
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Time Off
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Schedule Settings
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">
                  {statistics.totalDoctors}
                </div>
                <div className="text-sm text-gray-600">Total Doctors</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {statistics.activeDoctors}
                </div>
                <div className="text-sm text-gray-600">Active Doctors</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {statistics.todayAppointments}
                </div>
                <div className="text-sm text-gray-600">
                  Today's Appointments
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">
                  {statistics.availableSlots}
                </div>
                <div className="text-sm text-gray-600">Available Slots</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold">{statistics.conflicts}</div>
                <div className="text-sm text-gray-600">Conflicts</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conflicts Alert */}
      {showConflicts && conflictsData && (
        <ConflictAlert conflicts={conflictsData.data || conflictsData} />
      )}

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center space-x-4">
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Doctors</SelectItem>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      Dr. {doctor.first_name || doctor.firstName}{" "}
                      {doctor.last_name || doctor.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Tabs value={viewMode} onValueChange={setViewMode}>
                <TabsList>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="day">Day</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={showConflicts}
                  onCheckedChange={setShowConflicts}
                />
                <Label>Show Conflicts</Label>
              </div>

              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Views */}
      <Tabs value={viewMode} onValueChange={setViewMode}>
        <TabsContent value="week" className="mt-0">
          <WeekView />
        </TabsContent>
        <TabsContent value="day" className="mt-0">
          <DayView />
        </TabsContent>
        <TabsContent value="month" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Time Off Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Time Off Requests
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timeOffRequests.map((request) => {
              const doctor = doctors.find((d) => d.id === request.doctor_id);
              return (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={doctor?.avatar || doctor?.profile_image} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                        {doctor?.first_name?.[0] || doctor?.firstName?.[0]}
                        {doctor?.last_name?.[0] || doctor?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        Dr. {doctor?.first_name || doctor?.firstName}{" "}
                        {doctor?.last_name || doctor?.lastName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {request.start_date} - {request.end_date} •{" "}
                        {request.reason}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        request.status === "approved"
                          ? "default"
                          : request.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {request.status}
                    </Badge>
                    {request.status === "pending" && (
                      <div className="flex items-center space-x-1">
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorAvailabilitySystem;
