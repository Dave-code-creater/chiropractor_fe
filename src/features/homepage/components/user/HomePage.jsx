// src/features/homepage/components/user/HomePage.jsx
import React from "react";
import AppointmentsCard from "./cards/AppointmentsCard";
import DoctorNotesCard from "./cards/DoctorNotesCard";
import ConditionsCard from "./cards/ConditionsCard";
import MessagesCard from "./cards/MessagesCard";
import BlogCard from "./cards/BlogCard";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full grid-rows-[400px_400px] md:grid-rows-[400px_400px]">
        <Link to="/appointments" className="md:col-span-1 group h-full">
          <AppointmentsCard />
        </Link>
        <Link to="/notes" className="md:col-span-2 group h-full">
          <DoctorNotesCard />
        </Link>
        <Link to="/report" className="md:col-span-1 group h-full">
          <ConditionsCard />
        </Link>
        <Link to="/chat" className="md:col-span-1 group h-full">
          <MessagesCard />
        </Link>
        <Link to="/blog" className="md:col-span-1 group h-full">
          <BlogCard />
        </Link>
      </div>
    </div>
  );
}
