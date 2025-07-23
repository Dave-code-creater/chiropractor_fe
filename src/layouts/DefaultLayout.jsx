import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import AppSidebar from "@/components/sidebar/Sidebar";
import Footer from "@/layouts/Footer";
import NotificationProvider from "@/components/notifications/NotificationProvider";

const DefaultLayout = () => {
  return (
    <NotificationProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="min-h-screen flex flex-col">
          <main className="flex-1 p-3 sm:p-4 md:p-6 bg-background">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
          <Footer />
        </SidebarInset>
        {/* Enhanced Toast Notifications */}
        <Toaster />
      </SidebarProvider>
    </NotificationProvider>
  );
};

export default DefaultLayout;
