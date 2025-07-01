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

const DoctorAvailabilitySystem = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [viewMode, setViewMode] = useState("week"); // week, day, month
  const [showConflicts, setShowConflicts] = useState(true);
  const [editingSchedule, setEditingSchedule] = useState(null);

  // Sample doctors data
  const [doctors] = useState([
    {
      id: "DOC-001",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@clinic.com",
      phone: "+1-555-0101",
      specialization: "Chiropractic Medicine",
      licenseNumber: "CHR-12345",
      avatar: null,
      status: "active",
      workingHours: {
        monday: { start: "08:00", end: "17:00", enabled: true },
        tuesday: { start: "08:00", end: "17:00", enabled: true },
        wednesday: { start: "08:00", end: "17:00", enabled: true },
        thursday: { start: "08:00", end: "17:00", enabled: true },
        friday: { start: "08:00", end: "17:00", enabled: true },
        saturday: { start: "09:00", end: "13:00", enabled: true },
        sunday: { start: "00:00", end: "00:00", enabled: false },
      },
      appointmentTypes: [
        { type: "Initial Consultation", duration: 60, color: "#3B82F6" },
        { type: "Follow-up Visit", duration: 30, color: "#10B981" },
        { type: "Chiropractic Adjustment", duration: 30, color: "#F59E0B" },
        { type: "Physical Therapy", duration: 45, color: "#8B5CF6" },
      ],
      preferences: {
        bufferTime: 15, // minutes between appointments
        maxAppointmentsPerDay: 16,
        allowDoubleBooking: false,
        autoConfirmAppointments: true,
      },
    },
    {
      id: "DOC-002",
      firstName: "Michael",
      lastName: "Smith",
      email: "michael.smith@clinic.com",
      phone: "+1-555-0102",
      specialization: "Sports Medicine",
      licenseNumber: "CHR-67890",
      avatar: null,
      status: "active",
      workingHours: {
        monday: { start: "09:00", end: "18:00", enabled: true },
        tuesday: { start: "09:00", end: "18:00", enabled: true },
        wednesday: { start: "09:00", end: "18:00", enabled: true },
        thursday: { start: "09:00", end: "18:00", enabled: true },
        friday: { start: "09:00", end: "16:00", enabled: true },
        saturday: { start: "00:00", end: "00:00", enabled: false },
        sunday: { start: "00:00", end: "00:00", enabled: false },
      },
      appointmentTypes: [
        { type: "Sports Injury Consultation", duration: 45, color: "#EF4444" },
        { type: "Rehabilitation Session", duration: 60, color: "#06B6D4" },
        { type: "Performance Assessment", duration: 90, color: "#84CC16" },
      ],
      preferences: {
        bufferTime: 10,
        maxAppointmentsPerDay: 12,
        allowDoubleBooking: false,
        autoConfirmAppointments: false,
      },
    },
  ]);

  // Sample appointments data
  const [appointments, setAppointments] = useState([
    {
      id: "APT-001",
      doctorId: "DOC-001",
      patientId: "PAT-001",
      patientName: "John Smith",
      date: "2025-01-22",
      startTime: "09:00",
      endTime: "10:00",
      type: "Initial Consultation",
      status: "confirmed",
      notes: "First visit for back pain assessment",
      color: "#3B82F6",
    },
    {
      id: "APT-002",
      doctorId: "DOC-001",
      patientId: "PAT-002",
      patientName: "Sarah Wilson",
      date: "2025-01-22",
      startTime: "10:30",
      endTime: "11:00",
      type: "Follow-up Visit",
      status: "scheduled",
      notes: "Progress check",
      color: "#10B981",
    },
    {
      id: "APT-003",
      doctorId: "DOC-002",
      patientId: "PAT-003",
      patientName: "Mike Johnson",
      date: "2025-01-22",
      startTime: "14:00",
      endTime: "15:30",
      type: "Rehabilitation Session",
      status: "confirmed",
      notes: "Knee rehabilitation",
      color: "#06B6D4",
    },
  ]);

  // Sample time-off requests
  const [timeOffRequests, setTimeOffRequests] = useState([
    {
      id: "TO-001",
      doctorId: "DOC-001",
      startDate: "2025-01-25",
      endDate: "2025-01-26",
      reason: "Medical Conference",
      status: "approved",
      type: "conference",
    },
    {
      id: "TO-002",
      doctorId: "DOC-002",
      startDate: "2025-01-30",
      endDate: "2025-01-30",
      reason: "Personal Day",
      status: "pending",
      type: "personal",
    },
  ]);

  // Generate time slots for a doctor on a specific date
  const generateTimeSlots = useCallback(
    (doctor, date) => {
      const dayName = format(date, "EEEE").toLowerCase();
      const workingHours = doctor.workingHours[dayName];

      if (!workingHours.enabled) return [];

      const slots = [];
      const startTime = parseISO(
        `${format(date, "yyyy-MM-dd")}T${workingHours.start}:00`,
      );
      const endTime = parseISO(
        `${format(date, "yyyy-MM-dd")}T${workingHours.end}:00`,
      );

      let currentTime = startTime;

      while (currentTime < endTime) {
        const slotEnd = new Date(currentTime.getTime() + 30 * 60000); // 30-minute slots

        // Check if this slot conflicts with existing appointments
        const conflict = appointments.find(
          (apt) =>
            apt.doctorId === doctor.id &&
            apt.date === format(date, "yyyy-MM-dd") &&
            apt.startTime <= format(currentTime, "HH:mm") &&
            apt.endTime > format(currentTime, "HH:mm"),
        );

        // Check if this slot conflicts with time-off
        const timeOff = timeOffRequests.find(
          (to) =>
            to.doctorId === doctor.id &&
            to.status === "approved" &&
            isWithinInterval(date, {
              start: parseISO(to.startDate),
              end: parseISO(to.endDate),
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

  // Statistics calculation
  const statistics = useMemo(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    const todayAppointments = appointments.filter((apt) => apt.date === today);

    return {
      totalDoctors: doctors.length,
      activeDoctors: doctors.filter((doc) => doc.status === "active").length,
      todayAppointments: todayAppointments.length,
      availableSlots: filteredDoctors.reduce((total, doctor) => {
        const slots = generateTimeSlots(doctor, new Date());
        return total + slots.filter((slot) => slot.available).length;
      }, 0),
      conflicts: appointments.filter((apt) => {
        // Check for overlapping appointments
        return appointments.some(
          (otherApt) =>
            otherApt.id !== apt.id &&
            otherApt.doctorId === apt.doctorId &&
            otherApt.date === apt.date &&
            apt.startTime < otherApt.endTime &&
            apt.endTime > otherApt.startTime,
        );
      }).length,
    };
  }, [doctors, appointments, filteredDoctors, generateTimeSlots]);

  const handleScheduleUpdate = (doctorId, updates) => {
    // Update doctor schedule logic here
    toast.success("Schedule updated successfully");
  };

  const handleTimeOffRequest = (request) => {
    setTimeOffRequests((prev) => [
      ...prev,
      { ...request, id: `TO-${Date.now()}`, status: "pending" },
    ]);
    toast.success("Time-off request submitted");
  };

  const DoctorCard = ({ doctor }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={doctor.avatar} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {doctor.firstName[0]}
                {doctor.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                Dr. {doctor.firstName} {doctor.lastName}
              </CardTitle>
              <CardDescription>{doctor.specialization}</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant={doctor.status === "active" ? "default" : "secondary"}
            >
              {doctor.status}
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{doctor.phone}</span>
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
                  <AvatarImage src={doctor.avatar} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {doctor.firstName[0]}
                    {doctor.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">
                    Dr. {doctor.firstName} {doctor.lastName}
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
                              {slot.appointment.patientName}
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
            (apt) => apt.doctorId === doctor.id && apt.date === selectedDateStr,
          );

          return (
            <Card key={doctor.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={doctor.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {doctor.firstName[0]}
                        {doctor.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        Dr. {doctor.firstName} {doctor.lastName}
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
                                  {slot.appointment.patientName}
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
                          <div className="flex items-center space-x-2">
                            {slot.appointment && (
                              <Badge
                                variant={
                                  slot.appointment.status === "confirmed"
                                    ? "default"
                                    : slot.appointment.status === "scheduled"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {slot.appointment.status}
                              </Badge>
                            )}
                            {slot.available && (
                              <Button size="sm" variant="outline">
                                <Plus className="h-4 w-4 mr-1" />
                                Book
                              </Button>
                            )}
                          </div>
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
    if (conflicts.length === 0) return null;

    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Schedule Conflicts Detected</AlertTitle>
        <AlertDescription>
          {conflicts.length} scheduling conflict
          {conflicts.length !== 1 ? "s" : ""} found. Please review and resolve
          overlapping appointments.
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
      {showConflicts && statistics.conflicts > 0 && (
        <ConflictAlert conflicts={[]} />
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
                      Dr. {doctor.firstName} {doctor.lastName}
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Doctors</CardTitle>
              <CardDescription>
                {filteredDoctors.length} doctor
                {filteredDoctors.length !== 1 ? "s" : ""} shown
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="p-4">
                  {filteredDoctors.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {viewMode === "week" && <WeekView />}
          {viewMode === "day" && <DayView />}
          {viewMode === "month" && (
            <Card>
              <CardContent className="p-8 text-center">
                <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Month view coming soon</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

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
              const doctor = doctors.find((d) => d.id === request.doctorId);
              return (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={doctor?.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                        {doctor?.firstName[0]}
                        {doctor?.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        Dr. {doctor?.firstName} {doctor?.lastName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {request.startDate} - {request.endDate} •{" "}
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
