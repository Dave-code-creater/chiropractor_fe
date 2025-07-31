import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    Calendar,
    Heart,
    Stethoscope,
    User,
    Phone,
    Mail,
    MapPin,
    Clock,
    Activity,
    FileText,
    AlertCircle,
    CheckCircle,
    Star,
    MessageSquare,
    Settings,
    Bell,
    ChevronRight,
    Plus,
    Save,
    Edit,
    Trash2,
    Info
} from 'lucide-react';

export default function ThemePreview() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [progress, setProgress] = useState(75);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className={`min-h-screen p-6 space-y-8 transition-colors duration-300`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-foreground">Earthfire Elegance Theme</h1>
                    <p className="text-muted-foreground mt-2">
                        Harmonious red and brown color palette for your chiropractor practice
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="theme-toggle">Dark Mode</Label>
                    <Switch
                        id="theme-toggle"
                        checked={isDarkMode}
                        onCheckedChange={toggleTheme}
                    />
                </div>
            </div>

            {/* Color Palette Display */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-primary rounded-full"></div>
                        Color Palette
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <div className="w-full h-16 bg-primary rounded-lg"></div>
                            <p className="text-sm font-medium">Primary (Brick Red)</p>
                            <p className="text-xs text-muted-foreground">Main CTA color</p>
                        </div>
                        <div className="space-y-2">
                            <div className="w-full h-16 bg-accent rounded-lg"></div>
                            <p className="text-sm font-medium">Accent (Warm Brown)</p>
                            <p className="text-xs text-muted-foreground">Highlights</p>
                        </div>
                        <div className="space-y-2">
                            <div className="w-full h-16 bg-secondary rounded-lg"></div>
                            <p className="text-sm font-medium">Secondary (Soft Clay)</p>
                            <p className="text-xs text-muted-foreground">Subtle backgrounds</p>
                        </div>
                        <div className="space-y-2">
                            <div className="w-full h-16 bg-muted rounded-lg"></div>
                            <p className="text-sm font-medium">Muted (Sandstone)</p>
                            <p className="text-xs text-muted-foreground">Neutral elements</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Component Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Buttons & Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Buttons & Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-3">
                            <Button>Book Appointment</Button>
                            <Button variant="secondary">View Records</Button>
                            <Button variant="outline">Cancel</Button>
                            <Button variant="destructive">Delete</Button>
                            <Button variant="ghost">Skip</Button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Patient
                            </Button>
                            <Button size="sm" variant="outline">
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                            <Button size="sm" variant="secondary">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Form Elements */}
                <Card>
                    <CardHeader>
                        <CardTitle>Form Elements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="patientName">Patient Name</Label>
                                <Input id="patientName" placeholder="John Doe" />
                            </div>
                            <div>
                                <Label htmlFor="appointment">Appointment Type</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="consultation">Consultation</SelectItem>
                                        <SelectItem value="followup">Follow-up</SelectItem>
                                        <SelectItem value="treatment">Treatment</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="notes">Treatment Notes</Label>
                            <Textarea id="notes" placeholder="Patient showing improvement..." rows={3} />
                        </div>
                    </CardContent>
                </Card>

                {/* Patient Dashboard Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Patient Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src="/placeholder-avatar.jpg" />
                                <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h3 className="font-semibold">John Doe</h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Phone className="w-3 h-3" />
                                        (555) 123-4567
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Mail className="w-3 h-3" />
                                        john@email.com
                                    </span>
                                </div>
                            </div>
                            <Badge variant="secondary">Active</Badge>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Last Visit</span>
                                <span>Oct 15, 2024</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Next Appointment</span>
                                <span>Oct 22, 2024</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Treatment Progress</Label>
                            <Progress value={progress} className="h-2" />
                            <p className="text-xs text-muted-foreground">{progress}% Complete</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Appointment Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Upcoming Appointments
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-48">
                            <div className="space-y-3">
                                {[
                                    { patient: "Sarah Wilson", time: "9:00 AM", type: "Initial Consultation", status: "confirmed" },
                                    { patient: "Mike Johnson", time: "10:30 AM", type: "Follow-up", status: "pending" },
                                    { patient: "Emma Davis", time: "2:00 PM", type: "Treatment", status: "confirmed" },
                                    { patient: "Robert Chen", time: "3:30 PM", type: "Consultation", status: "confirmed" }
                                ].map((apt, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                                            <div>
                                                <p className="font-medium">{apt.patient}</p>
                                                <p className="text-sm text-muted-foreground">{apt.type}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{apt.time}</p>
                                            <Badge
                                                variant={apt.status === 'confirmed' ? 'default' : 'secondary'}
                                                className="text-xs"
                                            >
                                                {apt.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Stats Cards */}
                <Card>
                    <CardHeader>
                        <CardTitle>Practice Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-earthfire-clay-100 rounded-lg">
                                <div className="text-2xl font-bold text-earthfire-brick-700">148</div>
                                <div className="text-sm text-earthfire-brown-600">Total Patients</div>
                            </div>
                            <div className="text-center p-4 bg-earthfire-brown-100 rounded-lg">
                                <div className="text-2xl font-bold text-earthfire-brick-700">23</div>
                                <div className="text-sm text-earthfire-brown-600">This Week</div>
                            </div>
                            <div className="text-center p-4 bg-earthfire-brick-50 rounded-lg">
                                <div className="text-2xl font-bold text-earthfire-brick-700">94%</div>
                                <div className="text-sm text-earthfire-brown-600">Satisfaction</div>
                            </div>
                            <div className="text-center p-4 bg-earthfire-umber-100 rounded-lg">
                                <div className="text-2xl font-bold text-earthfire-brick-700">$12.4k</div>
                                <div className="text-sm text-earthfire-brown-600">Revenue</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Alerts & Messages */}
                <Card>
                    <CardHeader>
                        <CardTitle>Alerts & Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>Information</AlertTitle>
                            <AlertDescription>
                                Patient records have been successfully updated.
                            </AlertDescription>
                        </Alert>

                        <Alert className="border-amber-200 bg-amber-50 text-amber-800">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Warning</AlertTitle>
                            <AlertDescription>
                                3 appointments need confirmation for tomorrow.
                            </AlertDescription>
                        </Alert>

                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                Failed to send appointment reminder. Please try again.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>

            </div>

            {/* Navigation Tabs Example */}
            <Card>
                <CardHeader>
                    <CardTitle>Navigation Tabs</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="patients" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="patients">Patients</TabsTrigger>
                            <TabsTrigger value="appointments">Appointments</TabsTrigger>
                            <TabsTrigger value="treatment">Treatment Plans</TabsTrigger>
                            <TabsTrigger value="reports">Reports</TabsTrigger>
                        </TabsList>
                        <TabsContent value="patients" className="mt-6">
                            <div className="text-center py-8">
                                <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Patient Management</h3>
                                <p className="text-muted-foreground">Manage patient records and medical history.</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="appointments" className="mt-6">
                            <div className="text-center py-8">
                                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Appointment Scheduling</h3>
                                <p className="text-muted-foreground">Schedule and manage patient appointments.</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="treatment" className="mt-6">
                            <div className="text-center py-8">
                                <Stethoscope className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Treatment Plans</h3>
                                <p className="text-muted-foreground">Create and monitor treatment progress.</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="reports" className="mt-6">
                            <div className="text-center py-8">
                                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Reports & Analytics</h3>
                                <p className="text-muted-foreground">View practice analytics and reports.</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center py-8 border-t border-border">
                <p className="text-muted-foreground">
                    Earthfire Elegance Theme • Harmonious red and brown color palette for healthcare
                </p>
            </div>
        </div>
    );
}
