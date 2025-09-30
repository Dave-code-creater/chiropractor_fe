import {
  Home,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  Users,
  ClipboardList,
  BookOpen,
  UserCog,
  Stethoscope,
} from "lucide-react";

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
          name: "Patients",
          path: "/patients",
          icon: Users
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
        },
        {
          name: "Write Blog",
          path: "/blog/editor",
          icon: FileText
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

export const getNavigationByRole = (role, userId) => {
  if (!role || !navigationByRole[role]) {
    return {};
  }

  const roleNavigation = navigationByRole[role];

  const routeRole = role === 'staff' ? 'admin' : role;
  const baseDashboardPath = `/dashboard/${routeRole}/${userId}`;

  const filteredNavigation = {};

  Object.entries(roleNavigation).forEach(([key, section]) => {
    if (section.items && section.items.length > 0) {
      filteredNavigation[key] = {
        ...section,
        items: section.items.map(item => {
          let updatedPath = item.path;

          if (item.path === '/dashboard') {
            updatedPath = baseDashboardPath;
          } else if (item.path.startsWith('/')) {
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
