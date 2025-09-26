import React from "react";
import AppointmentsCard from "./cards/AppointmentsCard";
import DoctorNotesCard from "./cards/DoctorNotesCard";
import ConditionsCard from "./cards/ConditionsCard";
import MessagesCard from "./cards/MessagesCard";
import BlogCard from "./cards/BlogCard";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="appointments" className="group h-full sm:col-span-1">
          <AppointmentsCard />
        </Link>

        <Link to="reports" className="group h-full sm:col-span-2 lg:col-span-2">
          <DoctorNotesCard />
        </Link>

        <Link to="medical-records" className="group h-full sm:col-span-1">
          <ConditionsCard />
        </Link>

        <Link to="chat" className="group h-full sm:col-span-1">
          <MessagesCard />
        </Link>

        <div className="sm:col-span-1">
          <BlogCard />
        </div>
      </div>
    </div>
  );
}
