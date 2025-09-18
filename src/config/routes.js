// Route status types
export const RouteStatus = {
  ACTIVE: "active",
  UNDER_DEVELOPMENT: "under_development",
  COMING_SOON: "coming_soon",
};

// Define routes and their current status
export const routeStatuses = {
  // Active routes
  "/": RouteStatus.ACTIVE,
  "/login": RouteStatus.ACTIVE,
  "/register": RouteStatus.ACTIVE,
  "/forgot-password": RouteStatus.ACTIVE,
  "/reset-password": RouteStatus.ACTIVE,
  "/unauthorized": RouteStatus.ACTIVE,
  "/about": RouteStatus.ACTIVE,
  "/contact": RouteStatus.ACTIVE,
  "/faq": RouteStatus.ACTIVE,
  "/privacy-policy": RouteStatus.ACTIVE,
  "/terms-of-service": RouteStatus.ACTIVE,

  // User dashboard routes
  "/dashboard": RouteStatus.ACTIVE,
  "/dashboard/:id": RouteStatus.ACTIVE,
  "/appointments": RouteStatus.ACTIVE,
  "/profile": RouteStatus.ACTIVE,
  "/settings": RouteStatus.ACTIVE,
  "/chat": RouteStatus.ACTIVE,
  "/blog": RouteStatus.ACTIVE,
  "/blog/:slug": RouteStatus.ACTIVE,
  "/theme-preview": RouteStatus.ACTIVE,
  "/report": RouteStatus.ACTIVE,

  // Patient dashboard routes with dynamic IDs
  "/dashboard/patient/:id": RouteStatus.ACTIVE,
  "/dashboard/patient/:id/appointments": RouteStatus.ACTIVE,
  "/dashboard/patient/:id/reports": RouteStatus.ACTIVE,
  "/dashboard/patient/:id/notes": RouteStatus.ACTIVE,
  "/dashboard/patient/:id/profile": RouteStatus.ACTIVE,
  "/dashboard/patient/:id/settings": RouteStatus.ACTIVE,
  "/dashboard/patient/:id/blog": RouteStatus.ACTIVE,
  "/dashboard/patient/:id/chat": RouteStatus.ACTIVE,
  "/dashboard/patient/:id/medical-records": RouteStatus.ACTIVE,

  // Admin routes
  "/admin": RouteStatus.ACTIVE,
  "/admin/dashboard": RouteStatus.ACTIVE,
  "/doctor-report": RouteStatus.ACTIVE,

  // Admin dashboard routes with dynamic IDs
  "/dashboard/admin/:id": RouteStatus.ACTIVE,
  "/dashboard/admin/:id/appointments": RouteStatus.ACTIVE,
  "/dashboard/admin/:id/patients": RouteStatus.ACTIVE,
  "/dashboard/admin/:id/notes": RouteStatus.ACTIVE,
  "/dashboard/admin/:id/reports": RouteStatus.ACTIVE,
  "/dashboard/admin/:id/doctors": RouteStatus.ACTIVE,
  "/dashboard/admin/:id/chat": RouteStatus.ACTIVE,
  "/dashboard/admin/:id/settings": RouteStatus.ACTIVE,

  // Doctor routes
  "/doctor": RouteStatus.ACTIVE,
  "/doctor/dashboard": RouteStatus.ACTIVE,
  "/doctor/appointments": RouteStatus.ACTIVE,
  "/doctor/appointments/manage": RouteStatus.ACTIVE,
  "/doctor/patients": RouteStatus.ACTIVE,
  "/doctor/notes": RouteStatus.ACTIVE,
  "/doctor/reports": RouteStatus.ACTIVE,
  "/doctor/profile": RouteStatus.ACTIVE,
  "/doctor/settings": RouteStatus.ACTIVE,

  // Doctor dashboard routes with dynamic IDs
  "/dashboard/doctor/:id": RouteStatus.ACTIVE,
  "/dashboard/doctor/:id/appointments": RouteStatus.ACTIVE,
  "/dashboard/doctor/:id/patients": RouteStatus.ACTIVE,
  "/dashboard/doctor/:id/notes": RouteStatus.ACTIVE,
  "/dashboard/doctor/:id/reports": RouteStatus.ACTIVE,
  "/dashboard/doctor/:id/medical-records": RouteStatus.ACTIVE,
  "/dashboard/doctor/:id/chat": RouteStatus.ACTIVE,
  "/dashboard/doctor/:id/profile": RouteStatus.ACTIVE,
  "/dashboard/doctor/:id/settings": RouteStatus.ACTIVE,
  "/dashboard/doctor/:id/blog": RouteStatus.ACTIVE,


};

// Helper function to check route status
export const getRouteStatus = (path) => {
  // First, check for exact match
  if (routeStatuses.hasOwnProperty(path)) {
    return routeStatuses[path];
  }

  // Then check for dynamic routes (routes with parameters)
  const pathParts = path.split("/");
  const possibleMatches = Object.keys(routeStatuses).filter((route) => {
    const routeParts = route.split("/");
    if (routeParts.length !== pathParts.length) return false;

    return routeParts.every((part, index) => {
      // If the route part starts with :, it's a parameter
      if (part.startsWith(":")) return true;
      return part === pathParts[index];
    });
  });

  if (possibleMatches.length > 0) {
    return routeStatuses[possibleMatches[0]];
  }

  // If no match found, return null
  return null;
};
