import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import DoctorChat from "./components/doctor/DoctorChat";
import PatientChat from "./components/patient/PatientChat";
import AdminChat from "./components/admin/AdminChat";


const ChatRouter = () => {
  const userRole = useSelector((state) => state.auth.role);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      {userRole === "doctor" && (
        <Route path="/*" element={<DoctorChat />} />
      )}
      {userRole === "patient" && (
        <Route path="/*" element={<PatientChat />} />
      )}
      {userRole === "admin" && (
        <Route path="/*" element={<AdminChat />} />
      )}
      <Route path="*" element={<Navigate to="/unauthorized" replace />} />
    </Routes>
  );
};

export default ChatRouter; 
