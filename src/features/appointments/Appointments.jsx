import React from "react";
import { useSelector } from "react-redux";
import { selectUserRole } from "@/state/data/authSlice";
import DoctorAppointments from "./components/doctor/DoctorAppointments";
import PatientAppointments from "./components/patient/PatientAppointments";

import AdminAppointments from "./components/admin/AdminAppointments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function Appointments() {
  const userRole = useSelector(selectUserRole);

  if (!userRole) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading appointments...</p>
        </div>
      </div>
    );
  }

  switch (userRole) {
  case "admin":
    return <AdminAppointments />;
  case "doctor":
    return <DoctorAppointments />;
  case "patient":
  case "user":
    return <PatientAppointments />;
  default:
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your role ({userRole}) does not have access to the appointments system.
            Please contact your administrator for assistance.
          </p>
        </CardContent>
      </Card>
    );
  }
}
