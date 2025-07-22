import {
  Home,
  Calendar,
  FileText,
  MessageSquare,
  Users,
  Settings,
  ClipboardList,
  Edit,
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
  // Create a deep copy to avoid mutating the original coreNavigation
  const navigation = {
    main: {
      ...coreNavigation.main,
      items: [...coreNavigation.main.items.map(item => ({ ...item }))]
    },
    clinical: {
      ...coreNavigation.clinical,
      items: [...coreNavigation.clinical.items.map(item => ({ ...item }))]
    },
    personal: {
      ...coreNavigation.personal,
      items: [...coreNavigation.personal.items.map(item => ({ ...item }))]
    }
  };

  // Customize blog navigation based on role
  if (role === 'doctor') {
    // For doctors, update the existing Blogs item and add Blog Management
    navigation.main.items = navigation.main.items.map(item => {
      if (item.name === 'Blogs') {
        return {
          ...item,
          name: 'Blogs',
          path: 'blog',
          description: 'Read and discover blog posts'
        };
      }
      return item;
    });

    // Find the index of the Blogs item and add Blog Management after it
    const blogsIndex = navigation.main.items.findIndex(item => item.name === 'Blogs');
    if (blogsIndex !== -1) {
      navigation.main.items.splice(blogsIndex + 1, 0, {
        name: "Blog Management",
        path: "blog/management",
        icon: Edit,
        description: "Create and manage your blog posts",
      });
    }

  } else {
    // For patients, just update the existing Blogs item
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