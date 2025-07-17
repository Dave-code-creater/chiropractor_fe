import {
  Home,
  Calendar,
  FileText,
  MessageSquare,
  Users,
  Settings,
  ClipboardList,
} from "lucide-react";

// Core features available to all users
const coreNavigation = {
  main: {
    label: "Main",
    items: [
      {
        name: "Dashboard",
        path: "", // Will be set dynamically to /dashboard/{role}/{id}
        icon: Home,
        description: "Overview of your health records and activities",
      },
      {
        name: "Appointments",
        path: "appointments",
        icon: Calendar,
        description: "Schedule and manage your appointments",
      },
      {
        name: "Blogs",
        path: "blog/management", // Updated path for blog management
        icon: FileText,
        description: "Manage and create blog posts",
      },
      {
        name: "Messages",
        path: "chat",
        icon: MessageSquare,
        description: "Communicate with your healthcare providers",
      },
    ],
  },
  clinical: {
    label: "Clinical",
    items: [
      {
        name: "Patient Records",
        path: "reports",
        icon: Users,
        description: "Access and manage patient records",
      },
      {
        name: "Clinical Notes",
        path: "notes",
        icon: ClipboardList,
        description: "Create and manage clinical notes",
      },
    ],
  },
  personal: {
    label: "Personal",
    items: [
      {
        name: "Settings",
        path: "settings",
        icon: Settings,
        description: "Customize your account settings",
      },
    ],
  },
};

// Function to build full path based on role and user ID
const buildPath = (basePath, role, userId) => {
  if (basePath === "") {
    // Dashboard root
    return `/dashboard/${role}/${userId}`;
  }
  return `/dashboard/${role}/${userId}/${basePath}`;
};

// Function to get navigation with proper paths based on role and user ID
export const getNavigationByRole = (role, userId) => {
  // All users get the same navigation structure now
  const navigation = { ...coreNavigation };

  // Customize blog path based on role
  if (role === 'doctor') {
    navigation.main.items = navigation.main.items.map(item => {
      if (item.name === 'Blogs') {
        return {
          ...item,
          path: 'blog/management',
          description: 'Manage and create blog posts'
        };
      }
      return item;
    });
  } else {
    navigation.main.items = navigation.main.items.map(item => {
      if (item.name === 'Blogs') {
        return {
          ...item,
          path: 'blog',
          description: 'View your recommended blogs'
        };
      }
      return item;
    });
  }

  // Build proper paths for all navigation items
  const navigationWithPaths = {};
  Object.keys(navigation).forEach(sectionKey => {
    navigationWithPaths[sectionKey] = {
      ...navigation[sectionKey],
      items: navigation[sectionKey].items.map(item => ({
        ...item,
        path: buildPath(item.path, role, userId)
      }))
    };
  });

  return navigationWithPaths;
};

// Export for direct access if needed
export { coreNavigation }; 