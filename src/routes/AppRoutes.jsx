import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ProtectRoute from "./ProtectRoute";
import RouteProvider from "./RouteProvider";
import DefaultLayout from "../layouts/DefaultLayout";
import AdminHomePageLayout from "../layouts/admin/HomePageLayout";
import DoctorHomePageLayout from "../layouts/doctor/HomePageLayout";
import UserHomePageLayout from "../layouts/user/HomePageLayout";
import PublicLayout from "../layouts/PublicLayout";

// Public Pages
import LandingPage from "../pages/LandingPage";
import About from "../pages/About";
import Contact from "../pages/Contact";
import FAQ from "../pages/FAQ";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermOfService from "../pages/TermOfService";
import NotFound from "../pages/NotFound";
import Unauthorized from "../pages/Unauthorized";
import UnderDevelopment from "../pages/UnderDevelopment";
import TutorialDemo from "../pages/TutorialDemo";
import ChatDemo from "../pages/ChatDemo";

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
import Blog from "../features/blog/components/user/Blog";
import BlogPost from "../features/blog/components/user/BlogPost";
import BlogRouter from "../features/blog/BlogRouter";
import BlogManagement from "../features/blog/components/doctor/BlogManagement";
import BlogEditor from "../features/blog/components/doctor/BlogEditor";
import BlogReader from "../features/blog/components/BlogReader";
import DoctorBlogReader from "../features/blog/components/doctor/DoctorBlogReader";
import ChatRouter from "../features/chat/ChatRouter";
import AppointmentManagement from "../features/appointments/components/AppointmentManagement";
import PatientAppointments from "../features/appointments/components/patient/PatientAppointments";
import PatientManagement from "../features/patients/components/PatientManagement";

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

        {/* Public Blog Routes - WordPress-like */}
        <Route path="/blog" element={<RouteWrapper element={BlogReader} />} />
        <Route path="/blog/:slug" element={<RouteWrapper element={BlogReader} />} />
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
              <Route path="reports" element={<Report />} />
              <Route path="notes" element={<Notes />} />
              <Route path="reports" element={<Report />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Setting />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="chat/*" element={<ChatRouter />} />
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
              <Route path="reports" element={<PatientManagement />} />
              <Route path="medical-records" element={<PatientManagement />} />
              <Route path="chat/*" element={<ChatRouter />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Setting />} />
              <Route path="blog" element={<DoctorBlogReader />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="blog/management" element={<BlogManagement />} />
              <Route path="blog/editor" element={<BlogEditor />} />
              <Route path="blog/editor/:postId" element={<BlogEditor />} />
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
              <Route path="chat/*" element={<ChatRouter />} />
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
