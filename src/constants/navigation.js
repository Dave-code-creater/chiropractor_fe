import {
  Home,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  Users,
  ClipboardList,
  BookOpen,
  Activity,
  UserCog,
  Shield,
  Building2,
  Stethoscope
} from "lucide-react";

// Base navigation items for different roles
const baseNavigation = {
  dashboard: {
    label: "Dashboard",
    items: []
  },
  clinical: {
    label: "Clinical",
    items: []
  },
  management: {
    label: "Management",
    items: []
  },
  communication: {
    label: "Communication",
    items: []
  },
  settings: {
    label: "Settings",
    items: []
  }
};

// Navigation items by role
const navigationByRole = {
  patient: {
    dashboard: {
      label: "Dashboard",
      items: [
        {
          name: "Home",
          path: "/dashboard",
          icon: Home
        }
      ]
    },
    clinical: {
      label: "My Health",
      items: [
        {
          name: "Appointments",
          path: "/appointments",
          icon: Calendar
        },
        {
          name: "Medical Reports",
          path: "/reports",
          icon: FileText
        },
        {
          name: "Notes",
          path: "/notes",
          icon: ClipboardList
        }
      ]
    },
    communication: {
      label: "Communication",
      items: [
        {
          name: "Messages",
          path: "/chat",
          icon: MessageSquare
        }
      ]
    },
    settings: {
      label: "Account",
      items: [
        {
          name: "Profile",
          path: "/profile",
          icon: UserCog
        },
        {
          name: "Settings",
          path: "/settings",
          icon: Settings
        }
      ]
    }
  },

  doctor: {
    dashboard: {
      label: "Dashboard",
      items: [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: Home
        }
      ]
    },
    clinical: {
      label: "Clinical Work",
      items: [
        {
          name: "Appointments",
          path: "/appointments",
          icon: Calendar
        },
        {
          name: "Patient Management",
          path: "/patients",
          icon: Users
        },
        {
          name: "Clinical Notes",
          path: "/notes",
          icon: ClipboardList
        },
        {
          name: "Reports",
          path: "/reports",
          icon: FileText
        }
      ]
    },
    communication: {
      label: "Communication",
      items: [
        {
          name: "Chat",
          path: "/chat",
          icon: MessageSquare
        },
        {
          name: "Blog",
          path: "/blog",
          icon: BookOpen
        }
      ]
    },
    settings: {
      label: "Account",
      items: [
        {
          name: "Profile",
          path: "/profile",
          icon: UserCog
        },
        {
          name: "Settings",
          path: "/settings",
          icon: Settings
        }
      ]
    }
  },

  admin: {
    dashboard: {
      label: "Dashboard",
      items: [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: Home
        }
      ]
    },
    clinical: {
      label: "Clinical Management",
      items: [
        {
          name: "Appointments",
          path: "/appointments",
          icon: Calendar
        },
        {
          name: "Patient Management",
          path: "/patients",
          icon: Users
        },
        {
          name: "Doctor Management",
          path: "/doctors",
          icon: Stethoscope
        },
        {
          name: "Clinical Notes",
          path: "/notes",
          icon: ClipboardList
        },
        {
          name: "Reports",
          path: "/reports",
          icon: FileText
        }
      ]
    },
    communication: {
      label: "Communication",
      items: [
        {
          name: "Chat",
          path: "/chat",
          icon: MessageSquare
        },
        {
          name: "Blog",
          path: "/blog",
          icon: BookOpen
        }
      ]
    },
    settings: {
      label: "Account",
      items: [
        {
          name: "Settings",
          path: "/settings",
          icon: Settings
        }
      ]
    }
  },

  staff: {
    dashboard: {
      label: "Dashboard",
      items: [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: Home
        }
      ]
    },
    clinical: {
      label: "Clinical Support",
      items: [
        {
          name: "Appointments",
          path: "/appointments",
          icon: Calendar
        },
        {
          name: "Patient Management",
          path: "/patients",
          icon: Users
        },
        {
          name: "Notes",
          path: "/notes",
          icon: ClipboardList
        }
      ]
    },
    communication: {
      label: "Communication",
      items: [
        {
          name: "Chat",
          path: "/chat",
          icon: MessageSquare
        }
      ]
    },
    settings: {
      label: "Account",
      items: [
        {
          name: "Profile",
          path: "/profile",
          icon: UserCog
        },
        {
          name: "Settings",
          path: "/settings",
          icon: Settings
        }
      ]
    }
  }
};

/**
 * Get navigation structure based on user role and ID
 * @param {string} role - User role (patient, doctor, admin, staff)
 * @param {string|number} userId - User ID for dynamic routes
 * @returns {object} Navigation structure for the role
 */
export const getNavigationByRole = (role, userId) => {
  if (!role || !navigationByRole[role]) {
    return {};
  }

  const roleNavigation = navigationByRole[role];

  // Build the base dashboard path based on role
  // Map staff to admin for routing purposes since staff routes don't exist
  const routeRole = role === 'staff' ? 'admin' : role;
  const baseDashboardPath = `/dashboard/${routeRole}/${userId}`;

  // Filter out empty sections and return only sections with items
  const filteredNavigation = {};

  Object.entries(roleNavigation).forEach(([key, section]) => {
    if (section.items && section.items.length > 0) {
      filteredNavigation[key] = {
        ...section,
        items: section.items.map(item => {
          let updatedPath = item.path;

          // Update paths based on role-specific routing structure
          if (item.path === '/dashboard') {
            updatedPath = baseDashboardPath;
          } else if (item.path.startsWith('/')) {
            // Remove leading slash and append to base dashboard path
            const relativePath = item.path.substring(1);
            updatedPath = `${baseDashboardPath}/${relativePath}`;
          }

          return {
            ...item,
            path: updatedPath
          };
        })
      };
    }
  });

  return filteredNavigation;
};

export default navigationByRole;