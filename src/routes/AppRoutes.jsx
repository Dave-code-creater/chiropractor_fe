import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import DefaultLayout from "../layouts/DefaultLayout";
import PublicLayout from "../layouts/PublicLayout";
import HomePageLayout from "../layouts/user/HomePageLayout";
import AdminHomePageLayout from "../layouts/admin/HomePageLayout";
import DoctorHomePageLayout from "../layouts/doctor/HomePageLayout";
import StaffHomePageLayout from "../layouts/staff/HomePageLayout";
import RouteProvider from "./RouteProvider";

import LandingPage from "../pages/LandingPage";
import About from "../pages/About";
import Contact from "../pages/Contact";
import FAQ from "../pages/FAQ";
import NotFound from "../pages/NotFound";
import UnderDevelopment from "../pages/UnderDevelopment";
import Unauthorized from "../pages/Unauthorized";

import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import ForgotPassword from "../features/auth/ForgotPassword";
import ResetPassword from "../features/auth/ResetPassword";

import HomePage from "../features/homepage/components/user/HomePage";
import Setting from "../features/setting/components/Setting";
import Blog from "../features/blog/components/user/Blog";
import BlogPost from "../features/blog/components/user/BlogPost";
import NewChat from "../features/chat/components/NewChat";
import Profile from "../features/profile/components/Profile";
import Report from "../features/report/user/Report";
import Notes from "../features/notes/components/Notes";
import AdminDashboard from "../features/homepage/components/admin/Homepage";
import DoctorDashboard from "../features/homepage/components/doctor/DoctorDashboard";
import StaffDashboard from "../features/homepage/components/staff/StaffDashboard";
import ProfileUser from "../features/drreport/components/InitialDrReport";
import ProtectRoute from "./ProtectRoute";
import TermOfService from "../pages/TermOfService";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import AppointmentManagement from "../features/appointments/components/AppointmentManagement";
import PatientManagement from "../features/patients/components/PatientManagement";
import QuickScheduler from "../features/appointments/components/QuickScheduler";
import PatientAppointments from "../features/appointments/components/patient/PatientAppointments";

import { getRouteStatus, RouteStatus } from "../config/routes";

const RouteWrapper = ({ element: Element, ...props }) => {
  const location = useLocation();
  const routeStatus = getRouteStatus(location.pathname);

  // If route is under development or coming soon, show appropriate page
  if (
    routeStatus === RouteStatus.UNDER_DEVELOPMENT ||
    routeStatus === RouteStatus.COMING_SOON
  ) {
    return <UnderDevelopment />;
  }

  // If route is not found in our config, show 404
  if (routeStatus === null) {
    return <NotFound />;
  }

  // Otherwise, render the component
  return <Element {...props} />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes - no authentication required */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<RouteWrapper element={LandingPage} />} />
        <Route path="/about" element={<RouteWrapper element={About} />} />
        <Route path="/contact" element={<RouteWrapper element={Contact} />} />
        <Route path="/faq" element={<RouteWrapper element={FAQ} />} />
        <Route path="/terms-of-service" element={<RouteWrapper element={TermOfService} />} />
        <Route path="/privacy-policy" element={<RouteWrapper element={PrivacyPolicy} />} />
      </Route>

      {/* Auth routes - separate layout */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<RouteWrapper element={Login} />} />
        <Route path="/register" element={<RouteWrapper element={Register} />} />
        <Route path="/forgot-password" element={<RouteWrapper element={ForgotPassword} />} />
        <Route path="/reset-password" element={<RouteWrapper element={ResetPassword} />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* Patient/User Dashboard Routes */}
      <Route element={<ProtectRoute allowedRoles={["patient"]} />}>
        <Route element={<DefaultLayout />}>
          <Route element={<RouteProvider />}>
            <Route path="/dashboard/patient/:id">
              <Route index element={<HomePage />} />
              <Route path="appointments" element={<PatientAppointments />} />
              <Route path="appointments/book" element={<QuickScheduler />} />
              <Route path="reports" element={<Report />} />
              <Route path="notes" element={<Notes />} />
              <Route path="reports" element={<Report />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Setting />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="chat" element={<NewChat />} />
              <Route path="medical-records" element={<Report />} />
            </Route>
          </Route>
        </Route>
      </Route>

      {/* Doctor Dashboard Routes */}
      <Route element={<ProtectRoute allowedRoles={["doctor"]} />}>
        <Route element={<DoctorHomePageLayout />}>
          <Route element={<RouteProvider />}>
            <Route path="/dashboard/doctor/:id">
              <Route index element={<DoctorDashboard />} />
              <Route path="appointments" element={<AppointmentManagement />} />
              <Route path="patients" element={<PatientManagement />} />
              <Route path="notes" element={<Notes />} />
              <Route path="reports" element={<Report />} />
              <Route path="medical-records" element={<Report />} />
              <Route path="chat" element={<NewChat />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Setting />} />
            </Route>
          </Route>
        </Route>
      </Route>

      {/* Staff Dashboard Routes */}
      <Route element={<ProtectRoute allowedRoles={["staff"]} />}>
        <Route element={<StaffHomePageLayout />}>
          <Route element={<RouteProvider />}>
            <Route path="/dashboard/staff/:id">
              <Route index element={<StaffDashboard />} />
              <Route path="appointments" element={<AppointmentManagement />} />
              <Route path="patients" element={<PatientManagement />} />
              <Route path="notes" element={<Notes />} />
              <Route path="reports" element={<Report />} />
              <Route path="medical-records" element={<Report />} />
              <Route path="chat" element={<NewChat />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Setting />} />
            </Route>
          </Route>
        </Route>
      </Route>

      {/* Admin Dashboard Routes */}
      <Route element={<ProtectRoute allowedRoles={["admin"]} />}>
        <Route element={<AdminHomePageLayout />}>
          <Route element={<RouteProvider />}>
            <Route path="/dashboard/admin/:id">
              <Route index element={<AdminDashboard />} />
              <Route path="appointments" element={<AppointmentManagement />} />
              <Route path="patients" element={<PatientManagement />} />
              <Route path="notes" element={<Notes />} />
              <Route path="reports" element={<Report />} />
              <Route path="doctors" element={<PatientManagement />} />
              <Route path="staff" element={<PatientManagement />} />
              <Route path="settings" element={<Setting />} />
            </Route>
          </Route>
        </Route>
      </Route>

      {/* Catch all route - 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
