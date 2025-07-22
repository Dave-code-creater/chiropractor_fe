import React from "react";
import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";
import Footer from "./Footer";
import { Toaster } from "@/components/ui/sonner";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Public Navbar */}
      <PublicNavbar />

      {/* Main content area - no sidebar for public pages */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: "glass-effect",
        }}
      />
    </div>
  );
};

export default PublicLayout;
