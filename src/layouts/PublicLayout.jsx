import React from "react";
import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";
import Footer from "./Footer";
import { Toaster } from "@/components/ui/sonner";
import NotificationProvider from "@/components/notifications/NotificationProvider";

const PublicLayout = () => {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Public Navbar */}
        <PublicNavbar />

        {/* Main content area - no sidebar for public pages */}
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />

        {/* Enhanced Toast Notifications */}
        <Toaster />
      </div>
    </NotificationProvider>
  );
};

export default PublicLayout;
