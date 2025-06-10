// src/layouts/HomePageLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar/Sidebar";
import Footer from "../Footer";
import { Toaster } from "@/components/ui/sonner"

export default function HomePageLayout() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Mobile-first: sidebar on top, row layout kicks in at md */}
      <div className="flex flex-col md:flex-row flex-1">

        {/* Sidebar full-width on mobile, fixed-width on desktop */}
        <aside className="bg-gray-50">
          <div className="block md:hidden">
            {/* Render full sidebar at the top for small screens */}
            <Sidebar mobileAlwaysVisible />
          </div>
          <div className="hidden md:block">
            <Sidebar />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
          <Toaster richColors />
        </main>
      </div>

      {/* Footer always at the bottom */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
}