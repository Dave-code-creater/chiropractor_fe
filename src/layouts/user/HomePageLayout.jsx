import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar/Sidebar";
import Footer from "../Footer";
import { Toaster } from "@/components/ui/sonner";

export default function HomePageLayout() {
  const [sidebarPosition, setSidebarPosition] = useState("left");

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-position") || "left";
    setSidebarPosition(stored);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const updated = localStorage.getItem("sidebar-position") || "left";
      setSidebarPosition(updated);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const showSidebar = sidebarPosition !== "hidden";

  return (
    <div className="flex flex-col min-h-screen">
      <div
        className={`flex flex-col flex-1 ${sidebarPosition === "right" ? "md:flex-row-reverse" : "md:flex-row"}`}
      >
        {showSidebar && (
          <aside className="transition-all duration-300">
            <Sidebar sidebarPosition={sidebarPosition} />
          </aside>
        )}

        <main className="flex-1 min-w-0 overflow-auto bg-gray-50 main-content">
          {" "}
          <Outlet />
          <Toaster richColors />
        </main>
      </div>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}
