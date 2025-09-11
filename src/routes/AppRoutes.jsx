import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ProtectRoute from "./ProtectRoute";
import RouteProvider from "./RouteProvider";
import MainLayout from "../layouts/MainLayout";

// Public Pages
import LandingPage from "../pages/LandingPage";
import About from "../pages/About";
import Contact from "../pages/Contact";
import FAQ from "../pages/FAQ";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsOfService from "../pages/TermsOfService";
import NotFound from "../pages/NotFound";
import Unauthorized from "../pages/Unauthorized";
// Auth Pages
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import ForgotPassword from "../features/auth/ForgotPassword";
import ResetPassword from "../features/auth/ResetPassword";

// Dashboard Components
import AdminDashboard from "../features/homepage/components/admin/AdminDashboard";
import DoctorDashboard from "../features/homepage/components/doctor/DoctorDashboard";
import HomePage from "../features/homepage/components/user/HomePage";

// Feature Components
import Appointments from "../features/appointments/Appointments";
import Report from "../features/report/user/Report";
import Notes from "../features/notes/components/Notes";
import Profile from "../features/profile/components/Profile";
import Setting from "../features/setting/components/Setting";
import BlogRouter from "../features/blog/BlogRouter";
import ChatRouter from "../features/chat/ChatRouter";
import PatientAppointments from "../features/appointments/components/patient/PatientAppointments";
import PatientManagement from "../features/patients/components/PatientManagement";

import { getRouteStatus, RouteStatus } from "../config/routes";

const RouteWrapper = ({ element: Element, ...props }) => {
  const location = useLocation();
  const routeStatus = getRouteStatus(location.pathname);

  // If route is under development, coming soon, or not found, show 404
  if (
    routeStatus === RouteStatus.UNDER_DEVELOPMENT ||
    routeStatus === RouteStatus.COMING_SOON ||
    routeStatus === null
  ) {
    return <NotFound />;
  }

  // Otherwise, render the component
  return <Element {...props} />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* All routes use the MainLayout which intelligently switches between public and authenticated layouts */}
      <Route element={<MainLayout />}>
        {/* Public routes - no authentication required */}
        <Route path="/" element={<RouteWrapper element={LandingPage} />} />
        <Route path="/about" element={<RouteWrapper element={About} />} />
        <Route path="/contact" element={<RouteWrapper element={Contact} />} />
        <Route path="/faq" element={<RouteWrapper element={FAQ} />} />
        <Route path="/terms-of-service" element={<RouteWrapper element={TermsOfService} />} />
        <Route path="/privacy-policy" element={<RouteWrapper element={PrivacyPolicy} />} />

        {/* Public Blog Routes - WordPress-like */}
        <Route path="blog/*" element={<BlogRouter />} />

        {/* Auth routes */}
        <Route path="/login" element={<RouteWrapper element={Login} />} />
        <Route path="/register" element={<RouteWrapper element={Register} />} />
        <Route path="/forgot-password" element={<RouteWrapper element={ForgotPassword} />} />
        <Route path="/reset-password" element={<RouteWrapper element={ResetPassword} />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Patient/User Dashboard Routes */}
        <Route element={<ProtectRoute allowedRoles={["patient"]} />}>
          <Route element={<RouteProvider />}>
            <Route path="/dashboard/patient/:id">
              <Route index element={<HomePage />} />
              <Route path="appointments" element={<PatientAppointments />} />
              <Route path="reports" element={<Report />} />
              <Route path="notes" element={<Notes />} />
              <Route path="reports" element={<Report />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Setting />} />
              <Route path="blog/*" element={<BlogRouter />} />
              <Route path="chat/*" element={<ChatRouter />} />
              <Route path="medical-records" element={<Report />} />
            </Route>
          </Route>
        </Route>

        {/* Doctor Dashboard Routes */}
        <Route element={<ProtectRoute allowedRoles={["doctor"]} />}>
          <Route element={<RouteProvider />}>
            <Route path="/dashboard/doctor/:id">
              <Route index element={<DoctorDashboard />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="patients" element={<PatientManagement />} />
              <Route path="notes" element={<Notes />} />
              <Route path="reports" element={<PatientManagement />} />
              <Route path="medical-records" element={<PatientManagement />} />
              <Route path="chat/*" element={<ChatRouter />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Setting />} />
              <Route path="blog/*" element={<BlogRouter />} />
            </Route>
          </Route>
        </Route>

        {/* Admin Dashboard Routes */}
        <Route element={<ProtectRoute allowedRoles={["admin"]} />}>
          <Route element={<RouteProvider />}>
            <Route path="/dashboard/admin/:id">
              <Route index element={<AdminDashboard />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="patients" element={<PatientManagement />} />
              <Route path="notes" element={<Notes />} />
              <Route path="reports" element={<Report />} />
              <Route path="doctors" element={<PatientManagement />} />
              <Route path="chat/*" element={<ChatRouter />} />
              <Route path="settings" element={<Setting />} />
            </Route>
          </Route>
        </Route>

        {/* Catch all route - 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
