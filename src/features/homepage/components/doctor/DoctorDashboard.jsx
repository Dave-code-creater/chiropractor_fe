import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Users,
  FileText,
  Activity,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Plus,
  ClipboardList,
  Search,
} from "lucide-react";
import { useGetAppointmentsQuery } from "@/api/services/appointmentApi";
import RecentChatMessages from "@/components/dashboard/RecentChatMessages";
import { Link } from "react-router-dom";
import { selectCurrentUser, selectUserId } from "../../../../state/data/authSlice";
import { useGetPatientsQuery } from '@/api/services/userApi';
import { useGetConversationsQuery } from '@/api/services/chatApi';
import { useGetBlogPostsQuery } from '@/api/services/blogApi';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { useCreateAppointmentMutation } from '@/api/services/appointmentApi';
import { useCreateConversationMutation } from '@/api/services/chatApi';
import { useCreateBlogPostMutation } from '@/api/services/blogApi';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function DoctorDashboard() {
  const user = useSelector(selectCurrentUser);
  const userID = useSelector(selectUserId);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch appointments with doctor_id filter
  const {
    data: appointmentsData,
    isLoading,
    error,
    refetch: refetchAppointments
  } = useGetAppointmentsQuery({ 
    doctor_id: userID,
    // Add other query parameters as needed
    limit: 100, // Adjust based on your needs
  });

  // Ensure appointments is always an array with comprehensive checks
  const appointments = React.useMemo(() => {
    if (isLoading || error) return [];

    // Check all possible response structures
    if (Array.isArray(appointmentsData?.data)) {
      return appointmentsData.data;
    }
    
    if (Array.isArray(appointmentsData?.metadata)) {
      return appointmentsData.metadata;
    }

    if (Array.isArray(appointmentsData)) {
      return appointmentsData;
    }

    return [];
  }, [appointmentsData, isLoading, error]);

  // Filter appointments for today
  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter(
    (apt) => {
      // Handle both date formats (date field or datetime field)
      const appointmentDate = apt.date || (apt.datetime && apt.datetime.split('T')[0]);
      const isToday = appointmentDate === today;
      
      // Filter out canceled appointments from today's overview
      const isNotCanceled = !apt.is_cancel && !apt.is_cancelled && apt.status !== 'cancelled';
      return isToday && isNotCanceled;
    }
  );

  const upcomingAppointments = appointments.filter(
    (apt) => {
      const appointmentDate = apt.date || (apt.datetime && apt.datetime.split('T')[0]);
      // Include appointments that are today or in the future
      const isUpcoming = appointmentDate >= today;
      const isActive = apt.status === "confirmed" || apt.status === "scheduled";
      return isUpcoming && isActive;
    }
  );

  // Patients
  const { data: patientsData, isLoading: isLoadingPatients } = useGetPatientsQuery();
  const patients = React.useMemo(() => {
    if (isLoadingPatients || !patientsData) return [];
    if (Array.isArray(patientsData?.data)) return patientsData.data;
    if (Array.isArray(patientsData)) return patientsData;
    return [];
  }, [patientsData, isLoadingPatients]);

  // Messages
  const { data: conversationsData, isLoading: isLoadingConversations } = useGetConversationsQuery({ 
    status: 'active' 
  });
  const conversations = React.useMemo(() => {
    if (isLoadingConversations || !conversationsData) return [];
    
    let conversationsArray = [];
    if (Array.isArray(conversationsData)) {
      conversationsArray = conversationsData;
    } else if (Array.isArray(conversationsData?.data)) {
      conversationsArray = conversationsData.data;
    }
    
    // Filter to only show active conversations
    return conversationsArray.filter(conv => conv.status === 'active');
  }, [conversationsData, isLoadingConversations]);

  // Blog
  const { data: blogData, isLoading: isLoadingBlog } = useGetBlogPostsQuery({ author: userID });
  const blogPosts = React.useMemo(() => {
    if (isLoadingBlog || !blogData) return [];
    if (Array.isArray(blogData?.data)) return blogData.data;
    if (Array.isArray(blogData)) return blogData;
    return [];
  }, [blogData, isLoadingBlog]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      title: "Today's Appointments",
      value: todayAppointments.length,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Reviews",
      value: appointments.filter(
        (apt) => apt.status === "completed" && !apt.reviewed,
      ).length,
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Active Patients",
      value: new Set(appointments.map((apt) => apt.patient_id)).size,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Upcoming Appointments",
      value: upcomingAppointments.length,
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const formatTime = (timeString) => {
    if (!timeString) return "Time TBD";
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
      case "scheduled":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Modal state
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showConversationModal, setShowConversationModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);

  // API hooks for creation
  const [createAppointment, { isLoading: isCreatingAppointment }] = useCreateAppointmentMutation();
  const [createConversation, { isLoading: isCreatingConversation }] = useCreateConversationMutation();
  const [createBlogPost, { isLoading: isCreatingBlog }] = useCreateBlogPostMutation();

  // Form state for modals
  const [appointmentForm, setAppointmentForm] = useState({ patientId: '', date: '', time: '', type: '', notes: '' });
  const [conversationForm, setConversationForm] = useState({ userId: '', title: '' });
  const [blogForm, setBlogForm] = useState({ title: '', content: '' });

  // Add state for patient search
  const [patientSearch, setPatientSearch] = useState("");
  const [openPatientSelect, setOpenPatientSelect] = useState(false);

  // Filter patients based on search
  const filteredPatients = patients.filter(patient => {
    const searchTerm = patientSearch.toLowerCase();
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const email = patient.email?.toLowerCase() || '';
    return fullName.includes(searchTerm) || email.includes(searchTerm);
  });

  // Handlers
  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    try {
      const selectedPatient = patients.find(p => p.id === appointmentForm.patientId);
      
      if (!selectedPatient) {
        toast.error("Please select a valid patient");
        return;
      }

      if (!appointmentForm.date || !appointmentForm.time) {
        toast.error("Please select both date and time");
        return;
      }

      // Format the appointment data according to your API specification
      const appointmentData = {
        patient_id: appointmentForm.patientId,
        patient_name: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        doctor_id: userID,
        appointment_date: appointmentForm.date,
        appointment_time: appointmentForm.time,
        type: appointmentForm.type || 'consultation',
        notes: appointmentForm.notes || '',
        status: 'scheduled',
        duration_minutes: 30, // Default duration in minutes
      };

      await createAppointment(appointmentData).unwrap();
      toast.success("Appointment scheduled successfully!");
      setShowAppointmentModal(false);
      setAppointmentForm({ patientId: '', date: '', time: '', type: '', notes: '' });
      
      // Refetch appointments to update the list
      refetchAppointments();
    } catch (error) {
      console.error('Failed to create appointment:', error);
      toast.error(error.data?.message || 'Failed to schedule appointment');
    }
  };
  const handleCreateConversation = async (e) => {
    e.preventDefault();
    await createConversation(conversationForm);
    setShowConversationModal(false);
    setConversationForm({ userId: '', title: '' });
  };
  const handleCreateBlogPost = async (e) => {
    e.preventDefault();
    await createBlogPost(blogForm);
    setShowBlogModal(false);
    setBlogForm({ title: '', content: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Good morning, Dr. {user?.lastName || user?.name || 'Doctor'}! 👨‍⚕️
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's your clinical overview for today
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/doctor/appointments/manage">
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Manage Appointments
              </Button>
            </Link>
            <Link to="/doctor/patients">
              <Button variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Patient Management
              </Button>
            </Link>
            <Button className="bg-white hover:bg-primary/90 text-black" onClick={() => setShowAppointmentModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Appointment
            </Button>
            <Button className="bg-white hover:bg-secondary/90 text-black" onClick={() => setShowConversationModal(true)}>
              <MessageSquare className="w-4 h-4 mr-2" />
              New Conversation
            </Button>
            <Button className="bg-white hover:bg-indigo-700 text-black" onClick={() => setShowBlogModal(true)}>
              <FileText className="w-4 h-4 mr-2" />
              Write Blog
            </Button>
          </div>
        </div>

        {/* Modals */}
        <Dialog open={showAppointmentModal} onOpenChange={setShowAppointmentModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>
                Fill in the appointment details below. All fields marked with * are required.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateAppointment} className="space-y-4">
              {/* Patient Selection with Search */}
              <div className="space-y-2">
                <Label>Select Patient</Label>
                <Popover open={openPatientSelect} onOpenChange={setOpenPatientSelect}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openPatientSelect}
                      className="w-full justify-between"
                    >
                      {appointmentForm.patientId ? (
                        patients.find(p => p.id === appointmentForm.patientId)
                          ? `${patients.find(p => p.id === appointmentForm.patientId).firstName} ${patients.find(p => p.id === appointmentForm.patientId).lastName}`
                          : "Select patient..."
                      ) : (
                        "Select patient..."
                      )}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search patients..."
                        value={patientSearch}
                        onValueChange={setPatientSearch}
                      />
                      <CommandEmpty>No patients found.</CommandEmpty>
                      <CommandGroup className="max-h-[300px] overflow-auto">
                        {filteredPatients.map(patient => (
                          <CommandItem
                            key={patient.id}
                            value={patient.id}
                            onSelect={() => {
                              setAppointmentForm(f => ({ ...f, patientId: patient.id }));
                              setOpenPatientSelect(false);
                            }}
                          >
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.id}`} />
                                <AvatarFallback>{patient.firstName[0]}{patient.lastName[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{patient.firstName} {patient.lastName}</div>
                                {patient.email && (
                                  <div className="text-xs text-muted-foreground">{patient.email}</div>
                                )}
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date and Time Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={appointmentForm.date}
                    onChange={(e) => setAppointmentForm(f => ({ ...f, date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Select 
                    value={appointmentForm.time}
                    onValueChange={(value) => setAppointmentForm(f => ({ ...f, time: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 18 }, (_, i) => {
                        const hour = Math.floor(i / 2) + 9;
                        const minute = i % 2 === 0 ? '00' : '30';
                        const time = `${hour.toString().padStart(2, '0')}:${minute}`;
                        return (
                          <SelectItem key={time} value={time}>
                            {new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Appointment Type */}
              <div className="space-y-2">
                <Label>Appointment Type</Label>
                <Select 
                  value={appointmentForm.type}
                  onValueChange={(value) => setAppointmentForm(f => ({ ...f, type: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="initial">Initial Consultation</SelectItem>
                    <SelectItem value="followup">Follow-up Visit</SelectItem>
                    <SelectItem value="adjustment">Chiropractic Adjustment</SelectItem>
                    <SelectItem value="therapy">Physical Therapy</SelectItem>
                    <SelectItem value="xray">X-Ray Review</SelectItem>
                    <SelectItem value="emergency">Emergency Visit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>Notes</Label>
                <textarea
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
                  placeholder="Add any notes about the appointment..."
                  value={appointmentForm.notes}
                  onChange={(e) => setAppointmentForm(f => ({ ...f, notes: e.target.value }))}
                />
              </div>

              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={isCreatingAppointment || !appointmentForm.patientId || !appointmentForm.date || !appointmentForm.time}
                >
                  {isCreatingAppointment ? "Scheduling..." : "Schedule Appointment"}
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={showConversationModal} onOpenChange={setShowConversationModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start New Conversation</DialogTitle>
              <DialogDescription>
                Select a patient and enter a conversation title to begin a new chat.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateConversation} className="space-y-4">
              <input className="input" placeholder="User ID" value={conversationForm.userId} onChange={e => setConversationForm(f => ({ ...f, userId: e.target.value }))} required />
              <input className="input" placeholder="Title" value={conversationForm.title} onChange={e => setConversationForm(f => ({ ...f, title: e.target.value }))} required />
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={isCreatingConversation || !conversationForm.userId || !conversationForm.title}
                >
                  {isCreatingConversation ? "Creating..." : "Start Conversation"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={showBlogModal} onOpenChange={setShowBlogModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Blog Post</DialogTitle>
              <DialogDescription>
                Share your medical insights and expertise with your patients and colleagues.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateBlogPost} className="space-y-4">
              <input className="input" placeholder="Title" value={blogForm.title} onChange={e => setBlogForm(f => ({ ...f, title: e.target.value }))} required />
              <textarea className="input" placeholder="Content" value={blogForm.content} onChange={e => setBlogForm(f => ({ ...f, content: e.target.value }))} required rows={6} />
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={isCreatingBlog || !blogForm.title || !blogForm.content}
                >
                  {isCreatingBlog ? "Publishing..." : "Publish Post"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link to="/doctor/appointments/manage">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold">Appointments</h3>
                <p className="text-sm text-muted-foreground">Manage Schedule</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/doctor/patients">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold">Patients</h3>
                <p className="text-sm text-muted-foreground">Patient Records</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/doctor/messages">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold">Messages</h3>
                <p className="text-sm text-muted-foreground">Chat & Support</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/doctor/blog">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <FileText className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <h3 className="font-semibold">Blog</h3>
                <p className="text-sm text-muted-foreground">Write & Manage</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <IconComponent className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Upcoming Appointments */}
          <Card className="col-span-1 xl:col-span-2">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div>Loading appointments...</div>
              ) : upcomingAppointments.length === 0 ? (
                <div>No upcoming appointments.</div>
              ) : (
                <ul className="divide-y">
                  {upcomingAppointments.slice(0, 5).map((apt) => (
                    <li key={apt.id} className="py-2 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{apt.patientName || apt.patientFullName || 'Patient'}</div>
                        <div className="text-xs text-muted-foreground">{apt.date} at {formatTime(apt.time || apt.datetime)}</div>
                      </div>
                      <Badge className={getStatusColor(apt.status)}>{apt.status}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* My Patients */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>My Patients</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingPatients ? (
                <div>Loading patients...</div>
              ) : patients.length === 0 ? (
                <div>No patients assigned.</div>
              ) : (
                <ul className="divide-y">
                  {patients.slice(0, 5).map((p) => (
                    <li key={p.id} className="py-2 flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={p.avatar} />
                        <AvatarFallback>{p.firstName?.[0]}{p.lastName?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{p.firstName} {p.lastName}</div>
                        <div className="text-xs text-muted-foreground">{p.email}</div>
                      </div>
                      <Button size="sm" variant="link" asChild>
                        <Link to={`/doctor/patients/${p.id}`}>View</Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingConversations ? (
                <div>Loading messages...</div>
              ) : conversations.length === 0 ? (
                <div>No conversations yet.</div>
              ) : (
                <ul className="divide-y">
                  {conversations.slice(0, 5).map((c) => (
                    <li key={c.id} className="py-2 flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={c.avatar} />
                        <AvatarFallback>{c.title?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{c.title || 'Conversation'}</div>
                        <div className="text-xs text-muted-foreground">{c.lastMessage || 'No messages yet'}</div>
                      </div>
                      <Button size="sm" variant="link" asChild>
                        <Link to={`/chat/${c.id}`}>Open</Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Blog */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>My Blog</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingBlog ? (
                <div>Loading blog posts...</div>
              ) : blogPosts.length === 0 ? (
                <div>No blog posts yet.</div>
              ) : (
                <ul className="divide-y">
                  {blogPosts.slice(0, 5).map((post) => (
                    <li key={post.id} className="py-2 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-indigo-600" />
                      <div>
                        <div className="font-medium">{post.title}</div>
                        <div className="text-xs text-muted-foreground">{post.published ? 'Published' : 'Draft'}</div>
                      </div>
                      <Button size="sm" variant="link" asChild>
                        <Link to={`/doctor/blog/${post.id}`}>Edit</Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
