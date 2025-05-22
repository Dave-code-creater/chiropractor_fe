// src/layouts/HomepageLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar/Sidebar";
import Footer from "./Footer";

export default function HomepageLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* top of page could have a header if you want */}
      <div className="flex flex-1">
        {/* Sidebar takes its natural width */}
        <aside className="flex-shrink-0 hidden md:block">
          <Sidebar />
        </aside>
        {/* Main content (Outlet) fills remaining space */}
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Footer sticks to the bottom */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
