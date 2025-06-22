import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/data-table";
import { 
    Search, 
    Plus, 
    Filter, 
    MoreHorizontal, 
    Phone, 
    Mail, 
    Calendar, 
    FileText, 
    Edit,
    Eye,
    AlertCircle,
    CheckCircle,
    Clock,
    Users,
    TrendingUp
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock patient data
const mockPatients = [
    {
        id: "pt-001",
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@email.com",
        phone: "(555) 123-4567",
        dateOfBirth: "1985-03-15",
        lastVisit: "2024-01-15",
        nextAppointment: "2024-01-22",
        status: "active",
        condition: "Lower Back Pain",
        doctor: "Dr. Dieu Phan",
        totalVisits: 8,
        insurance: "Blue Cross Blue Shield",
        emergencyContact: "John Johnson - (555) 987-6543"
    },
    {
        id: "pt-002",
        firstName: "Michael",
        lastName: "Chen",
        email: "m.chen@email.com",
        phone: "(555) 234-5678",
        dateOfBirth: "1978-11-22",
        lastVisit: "2024-01-10",
        nextAppointment: null,
        status: "inactive",
        condition: "Neck Pain",
        doctor: "Dr. Dieu Phan",
        totalVisits: 12,
        insurance: "Aetna",
        emergencyContact: "Lisa Chen - (555) 876-5432"
    },
    {
        id: "pt-003",
        firstName: "Emma",
        lastName: "Davis",
        email: "emma.davis@email.com",
        phone: "(555) 345-6789",
        dateOfBirth: "1992-07-08",
        lastVisit: "2024-01-18",
        nextAppointment: "2024-01-25",
        status: "active",
        condition: "Sports Injury",
        doctor: "Dr. Dieu Phan",
        totalVisits: 5,
        insurance: "United Healthcare",
        emergencyContact: "Robert Davis - (555) 765-4321"
    },
    {
        id: "pt-004",
        firstName: "James",
        lastName: "Wilson",
        email: "james.wilson@email.com",
        phone: "(555) 456-7890",
        dateOfBirth: "1965-12-03",
        lastVisit: "2024-01-12",
        nextAppointment: "2024-01-24",
        status: "active",
        condition: "Chronic Pain",
        doctor: "Dr. Dieu Phan",
        totalVisits: 15,
        insurance: "Medicare",
        emergencyContact: "Mary Wilson - (555) 654-3210"
    }
];

export default function PatientManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedPatient, setSelectedPatient] = useState(null);

    const filteredPatients = mockPatients.filter(patient => {
        const matchesSearch = 
            patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = selectedStatus === "all" || patient.status === selectedStatus;
        
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-gray-100 text-gray-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not scheduled';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const calculateAge = (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const patientColumns = [
        {
            accessorKey: "name",
            header: "Patient",
            cell: ({ row }) => {
                const patient = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.id}`} />
                            <AvatarFallback>
                                {patient.firstName[0]}{patient.lastName[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium">{patient.firstName} {patient.lastName}</div>
                            <div className="text-sm text-muted-foreground">{patient.email}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "condition",
            header: "Condition",
            cell: ({ row }) => (
                <div className="text-sm">
                    <div className="font-medium">{row.original.condition}</div>
                    <div className="text-muted-foreground">{row.original.totalVisits} visits</div>
                </div>
            ),
        },
        {
            accessorKey: "lastVisit",
            header: "Last Visit",
            cell: ({ row }) => formatDate(row.original.lastVisit),
        },
        {
            accessorKey: "nextAppointment",
            header: "Next Appointment",
            cell: ({ row }) => (
                <div className="text-sm">
                    {row.original.nextAppointment ? (
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-green-600" />
                            {formatDate(row.original.nextAppointment)}
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            Not scheduled
                        </div>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge className={getStatusColor(row.original.status)}>
                    {row.original.status}
                </Badge>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedPatient(row.original)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Patient
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule Appointment
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Phone className="w-4 h-4 mr-2" />
                            Call Patient
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Message
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    const stats = [
        {
            title: "Total Patients",
            value: mockPatients.length,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Active Patients",
            value: mockPatients.filter(p => p.status === 'active').length,
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Upcoming Appointments",
            value: mockPatients.filter(p => p.nextAppointment).length,
            icon: Calendar,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
        {
            title: "Average Visits",
            value: Math.round(mockPatients.reduce((sum, p) => sum + p.totalVisits, 0) / mockPatients.length),
            icon: TrendingUp,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Patient Management</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage patient records, appointments, and treatment history
                        </p>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Patient
                    </Button>
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

                {/* Search and Filters */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search patients by name, email, or condition..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant={selectedStatus === "all" ? "default" : "outline"}
                                    onClick={() => setSelectedStatus("all")}
                                    size="sm"
                                >
                                    All
                                </Button>
                                <Button
                                    variant={selectedStatus === "active" ? "default" : "outline"}
                                    onClick={() => setSelectedStatus("active")}
                                    size="sm"
                                >
                                    Active
                                </Button>
                                <Button
                                    variant={selectedStatus === "inactive" ? "default" : "outline"}
                                    onClick={() => setSelectedStatus("inactive")}
                                    size="sm"
                                >
                                    Inactive
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Patient Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Patients ({filteredPatients.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable 
                            columns={patientColumns} 
                            data={filteredPatients} 
                        />
                    </CardContent>
                </Card>

                {/* Patient Detail Modal */}
                {selectedPatient && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPatient.id}`} />
                                        <AvatarFallback>
                                            {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="text-xl font-bold">
                                            {selectedPatient.firstName} {selectedPatient.lastName}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Patient ID: {selectedPatient.id}
                                        </div>
                                    </div>
                                </CardTitle>
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setSelectedPatient(null)}
                                >
                                    ×
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-semibold mb-3">Contact Information</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-muted-foreground" />
                                                {selectedPatient.email}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-muted-foreground" />
                                                {selectedPatient.phone}
                                            </div>
                                            <div>
                                                <strong>Age:</strong> {calculateAge(selectedPatient.dateOfBirth)} years old
                                            </div>
                                            <div>
                                                <strong>Emergency Contact:</strong> {selectedPatient.emergencyContact}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="font-semibold mb-3">Medical Information</h3>
                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <strong>Primary Condition:</strong> {selectedPatient.condition}
                                            </div>
                                            <div>
                                                <strong>Assigned Doctor:</strong> {selectedPatient.doctor}
                                            </div>
                                            <div>
                                                <strong>Total Visits:</strong> {selectedPatient.totalVisits}
                                            </div>
                                            <div>
                                                <strong>Insurance:</strong> {selectedPatient.insurance}
                                            </div>
                                            <div>
                                                <strong>Status:</strong> 
                                                <Badge className={`ml-2 ${getStatusColor(selectedPatient.status)}`}>
                                                    {selectedPatient.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="font-semibold mb-3">Appointment History</h3>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <strong>Last Visit:</strong> {formatDate(selectedPatient.lastVisit)}
                                        </div>
                                        <div>
                                            <strong>Next Appointment:</strong> {formatDate(selectedPatient.nextAppointment)}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button size="sm">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Patient
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Schedule Appointment
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <FileText className="w-4 h-4 mr-2" />
                                        View Records
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
} 