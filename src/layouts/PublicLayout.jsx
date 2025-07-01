import React from "react";
import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";
import Footer from "./Footer";
import { Toaster } from "@/components/ui/sonner";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Public Navbar */}
      <PublicNavbar />

      {/* Main content area - no sidebar for public pages */}
      <main className="min-h-[calc(100vh-4rem)]">
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
