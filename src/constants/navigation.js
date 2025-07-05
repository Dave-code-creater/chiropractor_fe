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
  Bell,
} from "lucide-react";

// Helper function to create role-based paths
const createPath = (role, userId, path) => `/dashboard/${role}/${userId}${path}`;

// Patient Navigation
export const patientNavigation = (userId) => [
  {
    id: "dashboard",
    label: "Dashboard",
    items: [
      {
        name: "Dashboard",
        path: createPath('patient', userId, ''),
        icon: LayoutDashboard,
        description: "Overview of your health information",
      },
      {
        name: "Appointments",
        path: createPath('patient', userId, '/appointments'),
        icon: Calendar,
        description: "Schedule and manage appointments",
      },
      {
        name: "Profile",
        path: createPath('patient', userId, '/profile'),
        icon: User,
        description: "Manage your personal information",
      },
    ],
  },
  {
    id: "health",
    label: "Health Management",
    items: [
      {
        name: "Medical Records",
        path: createPath('patient', userId, '/medical-records'),
        icon: FileText,
        description: "View your medical history",
      },
      {
        name: "Reports",
        path: createPath('patient', userId, '/reports'),
        icon: ClipboardList,
        description: "Health reports and assessments",
      },
      {
        name: "Prescriptions",
        path: createPath('patient', userId, '/prescriptions'),
        icon: Pill,
        description: "Manage your prescriptions",
      },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    items: [
      {
        name: "Messages",
        path: createPath('patient', userId, '/chat'),
        icon: MessageSquare,
        description: "Chat with healthcare providers",
      },
      {
        name: "Blog",
        path: createPath('patient', userId, '/blog'),
        icon: FileText,
        description: "Health tips and articles",
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    items: [
      {
        name: "Settings",
        path: createPath('patient', userId, '/settings'),
        icon: Settings,
        description: "Account and app settings",
      },
    ],
  },
];

// Doctor Navigation
export const doctorNavigation = (userId) => [
  {
    id: "dashboard",
    label: "Dashboard",
    items: [
      {
        name: "Dashboard",
        path: createPath('doctor', userId, ''),
        icon: LayoutDashboard,
        description: "Clinical overview and summary",
      },
      {
        name: "Appointments",
        path: createPath('doctor', userId, '/appointments'),
        icon: Calendar,
        description: "Patient appointments and schedule",
      },
    ],
  },
  {
    id: "patient-care",
    label: "Patient Care",
    items: [
      {
        name: "Patients",
        path: createPath('doctor', userId, '/patients'),
        icon: Users,
        description: "Patient management and records",
      },
      {
        name: "Clinical Notes",
        path: createPath('doctor', userId, '/notes'),
        icon: ClipboardList,
        description: "Patient cases and clinical documentation",
      },
      {
        name: "Clinical Reports",
        path: createPath('doctor', userId, '/reports'),
        icon: FileText,
        description: "Patient reports and assessments",
      },
      {
        name: "Treatment Plans",
        path: createPath('doctor', userId, '/treatments'),
        icon: Stethoscope,
        description: "Create and manage treatment plans",
      },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    items: [
      {
        name: "Messages",
        path: createPath('doctor', userId, '/chat'),
        icon: MessageSquare,
        description: "Patient communications",
      },
      {
        name: "Consultations",
        path: createPath('doctor', userId, '/consultations'),
        icon: Video,
        description: "Virtual consultations",
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    items: [
      {
        name: "Profile",
        path: createPath('doctor', userId, '/profile'),
        icon: User,
        description: "Professional profile settings",
      },
      {
        name: "Settings",
        path: createPath('doctor', userId, '/settings'),
        icon: Settings,
        description: "Account and app settings",
      },
    ],
  },
];

// Staff Navigation
export const staffNavigation = (userId) => [
  {
    id: "dashboard",
    label: "Dashboard",
    items: [
      {
        name: "Dashboard",
        path: createPath('staff', userId, ''),
        icon: LayoutDashboard,
        description: "Staff dashboard overview",
      },
      {
        name: "Appointments",
        path: createPath('staff', userId, '/appointments'),
        icon: Calendar,
        description: "Manage appointments",
      },
      {
        name: "Patients",
        path: createPath('staff', userId, '/patients'),
        icon: Users,
        description: "Patient management",
      },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    items: [
      {
        name: "Messages",
        path: createPath('staff', userId, '/chat'),
        icon: MessageSquare,
        description: "Internal communications",
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    items: [
      {
        name: "Profile",
        path: createPath('staff', userId, '/profile'),
        icon: User,
        description: "Profile settings",
      },
      {
        name: "Settings",
        path: createPath('staff', userId, '/settings'),
        icon: Settings,
        description: "Account settings",
      },
    ],
  },
];

// Admin Navigation
export const adminNavigation = (userId) => [
  {
    id: "dashboard",
    label: "Dashboard",
    items: [
      {
        name: "Dashboard",
        path: createPath('admin', userId, ''),
        icon: LayoutDashboard,
        description: "Administrative overview",
      },
      {
        name: "Appointments",
        path: createPath('admin', userId, '/appointments'),
        icon: Calendar,
        description: "Appointment management",
      },
    ],
  },
  {
    id: "management",
    label: "Management",
    items: [
      {
        name: "Patients",
        path: createPath('admin', userId, '/patients'),
        icon: Users,
        description: "Patient management",
      },
      {
        name: "Doctors",
        path: createPath('admin', userId, '/doctors'),
        icon: Stethoscope,
        description: "Doctor management",
      },
      {
        name: "Staff",
        path: createPath('admin', userId, '/staff'),
        icon: UserCheck,
        description: "Staff management",
      },
    ],
  },
  {
    id: "reports",
    label: "Reports & Analytics",
    items: [
      {
        name: "Reports",
        path: createPath('admin', userId, '/reports'),
        icon: BarChart3,
        description: "System reports and analytics",
      },
      {
        name: "Audit Logs",
        path: createPath('admin', userId, '/audit'),
        icon: Shield,
        description: "System audit logs",
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    items: [
      {
        name: "Settings",
        path: createPath('admin', userId, '/settings'),
        icon: Settings,
        description: "System settings",
      },
    ],
  },
];

export const getNavigationByRole = (role, userId) => {
  switch (role) {
    case "patient":
      return patientNavigation(userId);
    case "doctor":
      return doctorNavigation(userId);
    case "staff":
      return staffNavigation(userId);
    case "admin":
      return adminNavigation(userId);
    default:
      return patientNavigation(userId);
  }
};

export const getDefaultRouteByRole = (role, userId) => {
  switch (role) {
    case "patient":
      return createPath('patient', userId, '');
    case "doctor":
      return createPath('doctor', userId, '');
    case "staff":
      return createPath('staff', userId, '');
    case "admin":
      return createPath('admin', userId, '');
    default:
      return "/";
  }
};
