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
  "/report": RouteStatus.ACTIVE,

  // Admin routes
  "/admin": RouteStatus.ACTIVE,
  "/admin/dashboard": RouteStatus.ACTIVE,
  "/doctor-report": RouteStatus.ACTIVE,

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

  // Staff routes
  "/staff": RouteStatus.ACTIVE,
  "/staff/dashboard": RouteStatus.ACTIVE,
  "/staff/appointments": RouteStatus.ACTIVE,
  "/staff/profile": RouteStatus.ACTIVE,
  "/staff/settings": RouteStatus.ACTIVE,
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
