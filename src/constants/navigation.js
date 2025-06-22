import {
    LayoutDashboard,
    Calendar,
    Users,
    FileText,
    MessageSquare,
    Settings,
    User,
    Activity,
    ClipboardList,
    Phone,
    Stethoscope,
    UserCheck,
    BarChart3,
    Shield,
    Database,
    Clock,
    Pill,
    CreditCard,
    Video,
    Bell
} from 'lucide-react';

// Patient Navigation
export const patientNavigation = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        items: [
            { 
                name: 'Dashboard', 
                path: '/dashboard', 
                icon: LayoutDashboard,
                description: 'Overview of your health information'
            },
            { 
                name: 'Appointments', 
                path: '/appointments', 
                icon: Calendar,
                description: 'Schedule and manage appointments'
            },
            { 
                name: 'Profile', 
                path: '/profile', 
                icon: User,
                description: 'Manage your personal information'
            },
        ],
    },
    {
        id: 'health',
        label: 'Health Management',
        items: [
            { 
                name: 'Medical Records', 
                path: '/medical-records', 
                icon: FileText,
                description: 'View your medical history'
            },
            { 
                name: 'Reports', 
                path: '/report', 
                icon: ClipboardList,
                description: 'Health reports and assessments'
            },
            { 
                name: 'Prescriptions', 
                path: '/prescriptions', 
                icon: Pill,
                description: 'Manage your prescriptions'
            },
        ],
    },
    {
        id: 'communication',
        label: 'Communication',
        items: [
            { 
                name: 'Messages', 
                path: '/chat', 
                icon: MessageSquare,
                description: 'Chat with healthcare providers'
            },
            { 
                name: 'Blog', 
                path: '/blog', 
                icon: FileText,
                description: 'Health tips and articles'
            },
        ],
    },
    {
        id: 'settings',
        label: 'Settings',
        items: [
            { 
                name: 'Settings', 
                path: '/settings', 
                icon: Settings,
                description: 'Account and app settings'
            },
        ],
    },
];

// Doctor Navigation
export const doctorNavigation = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        items: [
            { 
                name: 'Dashboard', 
                path: '/doctor/dashboard', 
                icon: LayoutDashboard,
                description: 'Clinical overview and summary'
            },
            { 
                name: 'Appointments', 
                path: '/doctor/appointments', 
                icon: Calendar,
                description: 'Patient appointments and schedule'
            },
        ],
    },
    {
        id: 'patient-care',
        label: 'Patient Care',
        items: [
            { 
                name: 'Patients', 
                path: '/doctor/patients', 
                icon: Users,
                description: 'Patient management and records'
            },
            { 
                name: 'Clinical Notes', 
                path: '/doctor/notes', 
                icon: ClipboardList,
                description: 'Patient cases and clinical documentation'
            },
            { 
                name: 'Clinical Reports', 
                path: '/doctor/reports', 
                icon: FileText,
                description: 'Patient reports and assessments'
            },
            { 
                name: 'Treatment Plans', 
                path: '/doctor/treatments', 
                icon: Stethoscope,
                description: 'Create and manage treatment plans'
            },
        ],
    },
    {
        id: 'communication',
        label: 'Communication',
        items: [
            { 
                name: 'Messages', 
                path: '/doctor/messages', 
                icon: MessageSquare,
                description: 'Patient communications'
            },
            { 
                name: 'Consultations', 
                path: '/doctor/consultations', 
                icon: Video,
                description: 'Virtual consultations'
            },
        ],
    },
    {
        id: 'settings',
        label: 'Settings',
        items: [
            { 
                name: 'Profile', 
                path: '/doctor/profile', 
                icon: User,
                description: 'Professional profile settings'
            },
            { 
                name: 'Settings', 
                path: '/doctor/settings', 
                icon: Settings,
                description: 'Account and app settings'
            },
        ],
    },
];

// Staff Navigation
export const staffNavigation = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        items: [
            { 
                name: 'Dashboard', 
                path: '/staff/dashboard', 
                icon: LayoutDashboard,
                description: 'Operations overview'
            },
            { 
                name: 'Appointments', 
                path: '/staff/appointments', 
                icon: Calendar,
                description: 'Appointment scheduling and management'
            },
        ],
    },
    {
        id: 'operations',
        label: 'Operations',
        items: [
            { 
                name: 'Patient Management', 
                path: '/staff/patients', 
                icon: Users,
                description: 'Patient database and information'
            },
            { 
                name: 'Scheduling', 
                path: '/staff/scheduling', 
                icon: Clock,
                description: 'Advanced scheduling tools'
            },
            { 
                name: 'Tasks', 
                path: '/staff/tasks', 
                icon: ClipboardList,
                description: 'Daily tasks and follow-ups'
            },
        ],
    },
    {
        id: 'communication',
        label: 'Communication',
        items: [
            { 
                name: 'Patient Calls', 
                path: '/staff/calls', 
                icon: Phone,
                description: 'Patient communication log'
            },
            { 
                name: 'Messages', 
                path: '/staff/messages', 
                icon: MessageSquare,
                description: 'Internal and patient messages'
            },
        ],
    },
    {
        id: 'settings',
        label: 'Settings',
        items: [
            { 
                name: 'Profile', 
                path: '/staff/profile', 
                icon: User,
                description: 'Staff profile settings'
            },
            { 
                name: 'Settings', 
                path: '/staff/settings', 
                icon: Settings,
                description: 'Account and app settings'
            },
        ],
    },
];

// Admin Navigation
export const adminNavigation = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        items: [
            { 
                name: 'Dashboard', 
                path: '/admin/dashboard', 
                icon: LayoutDashboard,
                description: 'System overview and analytics'
            },
            { 
                name: 'Analytics', 
                path: '/analytics', 
                icon: BarChart3,
                description: 'System analytics and reports'
            },
        ],
    },
    {
        id: 'user-management',
        label: 'User Management',
        items: [
            { 
                name: 'Users', 
                path: '/manage-users', 
                icon: Users,
                description: 'Manage system users'
            },
            { 
                name: 'Roles & Permissions', 
                path: '/admin/roles', 
                icon: Shield,
                description: 'Manage user roles and permissions'
            },
            { 
                name: 'Doctor Reports', 
                path: '/doctor-report', 
                icon: FileText,
                description: 'Doctor performance reports'
            },
        ],
    },
    {
        id: 'system',
        label: 'System Management',
        items: [
            { 
                name: 'Database', 
                path: '/admin/database', 
                icon: Database,
                description: 'Database management'
            },
            { 
                name: 'System Settings', 
                path: '/admin/system', 
                icon: Settings,
                description: 'System configuration'
            },
            { 
                name: 'Notifications', 
                path: '/admin/notifications', 
                icon: Bell,
                description: 'System notifications'
            },
        ],
    },
];

// Helper function to get navigation based on role
export const getNavigationByRole = (role) => {
    switch (role) {
        case 'admin':
            return adminNavigation;
        case 'doctor':
            return doctorNavigation;
        case 'staff':
            return staffNavigation;
        case 'patient':
        default:
            return patientNavigation;
    }
};

// Helper function to get default route by role
export const getDefaultRouteByRole = (role, userID) => {
    switch (role) {
        case 'admin':
            return '/admin';
        case 'doctor':
            return '/doctor';
        case 'staff':
            return '/staff';
        case 'patient':
        default:
            return `/dashboard/${userID}`;
    }
}; 