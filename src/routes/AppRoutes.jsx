import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import DefaultLayout from '../layouts/DefaultLayout';
import PublicLayout from '../layouts/PublicLayout';
import HomePageLayout from '../layouts/user/HomePageLayout';
import AdminLayout from '../layouts/admin/HomePageLayout';
import DoctorLayout from '../layouts/doctor/HomePageLayout';
import StaffLayout from '../layouts/staff/HomePageLayout';

import LandingPage from '../pages/LandingPage';
import About from '../pages/About';
import Contact from '../pages/Contact';
import FAQ from '../pages/FAQ';
import NotFound from '../pages/NotFound';
import UnderDevelopment from '../pages/UnderDevelopment';
import Unauthorized from '../pages/Unauthorized';

import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import ForgotPassword from '../features/auth/ForgotPassword';
import ResetPassword from '../features/auth/ResetPassword';

import HomePage from '../features/homepage/components/user/HomePage';
import Setting from '../features/setting/components/Setting';
import Appointments from '../features/appointments/Appointments';
import Blog from '../features/blog/components/user/Blog';
import BlogPost from '../features/blog/components/user/BlogPost';
import Chat from '../features/chat/components/Chat';
import Profile from '../features/profile/components/Profile';
import Report from '../features/report/user/Report';
import Notes from '../features/notes/components/Notes';
import AdminDashboard from '../features/homepage/components/admin/Homepage';
import DoctorDashboard from '../features/homepage/components/doctor/DoctorDashboard';
import StaffDashboard from '../features/homepage/components/staff/StaffDashboard';
import ProfileUser from '../features/drreport/components/InitialDrReport';
import ProtectRoute from './ProtectRoute';
import TermOfService from '../pages/TermOfService';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import AppointmentManagement from '../features/appointments/components/AppointmentManagement';
import PatientManagement from '../features/patients/components/PatientManagement';
import QuickScheduler from '../features/appointments/components/QuickScheduler';

import { getRouteStatus, RouteStatus } from '../config/routes';

const RouteWrapper = ({ element: Element, ...props }) => {
  const location = useLocation();
  const routeStatus = getRouteStatus(location.pathname);

  // If route is under development or coming soon, show appropriate page
  if (routeStatus === RouteStatus.UNDER_DEVELOPMENT || routeStatus === RouteStatus.COMING_SOON) {
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
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

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

      {/* Protected user routes */}
      <Route element={<ProtectRoute />}>
        <Route element={<DefaultLayout />}>
          <Route path="/dashboard" element={<RouteWrapper element={HomePage} />} />
          <Route path="/dashboard/:id" element={<RouteWrapper element={HomePage} />} />
          <Route path="/settings" element={<RouteWrapper element={Setting} />} />
          <Route path="/appointments" element={<RouteWrapper element={Appointments} />} />
          <Route path="/blog" element={<RouteWrapper element={Blog} />} />
          <Route path="/blog/:slug" element={<RouteWrapper element={BlogPost} />} />
          <Route path="/chat" element={<RouteWrapper element={Chat} />} />
          <Route path="/profile" element={<RouteWrapper element={Profile} />} />
          <Route path="/report" element={<RouteWrapper element={Report} />} />
          
          {/* Routes under development */}
          <Route path="/notifications" element={<RouteWrapper element={NotFound} />} />
          <Route path="/medical-records" element={<RouteWrapper element={NotFound} />} />
          <Route path="/prescriptions" element={<RouteWrapper element={NotFound} />} />
          <Route path="/billing" element={<RouteWrapper element={NotFound} />} />
          
          {/* Coming soon routes */}
          <Route path="/telehealth" element={<RouteWrapper element={NotFound} />} />
          <Route path="/health-tracking" element={<RouteWrapper element={NotFound} />} />
          <Route path="/insurance" element={<RouteWrapper element={NotFound} />} />
          <Route path="/referrals" element={<RouteWrapper element={NotFound} />} />
        </Route>
      </Route>

      {/* Protected admin routes */}
      <Route element={<ProtectRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<RouteWrapper element={AdminDashboard} />} />
          <Route path="manage-users" element={<div>Manage Users</div>} />
          <Route path="analytics" element={<div>Analytics</div>} />
          <Route path="doctor-report" element={<ProfileUser />} />
          {/* Add more admin routes here */}
        </Route>
      </Route>

      {/* Protected doctor routes */}
      <Route element={<ProtectRoute allowedRoles={['doctor']} />}>
        <Route element={<DoctorLayout />}>
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/doctor/appointments" element={<Appointments />} />
          <Route path="/doctor/appointments/manage" element={<AppointmentManagement />} />
          <Route path="/doctor/patients" element={<PatientManagement />} />
          <Route path="/doctor/reports" element={<Report />} />
          <Route path="/doctor/notes" element={<Notes />} />
          <Route path="/doctor/messages" element={<Chat />} />
          <Route path="/doctor/profile" element={<Profile />} />
          <Route path="/doctor/settings" element={<Setting />} />
        </Route>
      </Route>

      {/* Protected staff routes */}
      <Route element={<ProtectRoute allowedRoles={['staff']} />}>
        <Route element={<StaffLayout />}>
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/staff/appointments" element={<Appointments />} />
          <Route path="/staff/appointments/manage" element={<AppointmentManagement />} />
          <Route path="/staff/appointments/quick" element={<QuickScheduler />} />
          <Route path="/staff/patients" element={<PatientManagement />} />
          <Route path="/staff/scheduling" element={<Appointments />} />
          <Route path="/staff/profile" element={<Profile />} />
          <Route path="/staff/settings" element={<Setting />} />
        </Route>
      </Route>

      {/* Catch all route - 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;