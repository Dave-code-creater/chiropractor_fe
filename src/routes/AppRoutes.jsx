import { Routes, Route, useLocation, useParams } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import About from "../pages/About";
import Contact from "../pages/Contact";
import FAQ from "../pages/FAQ";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsOfService from "../pages/TermsOfService";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import ForgotPassword from "../features/auth/ForgotPassword";
import ResetPassword from "../features/auth/ResetPassword";
import NotFound from "../pages/NotFound";
import Unauthorized from "../pages/Unauthorized";
import MainLayout from "../layouts/MainLayout";
import RouteProvider from "./RouteProvider";
import ProtectRoute from "./ProtectRoute";
import BlogRouter from "../features/blog/BlogRouter";
import ChatRouter from "../features/chat/ChatRouter";
import HomePage from "../features/homepage/components/user/HomePage";
import PatientAppointments from "../features/appointments/components/patient/PatientAppointments";
import Report from "../features/report/user/Report";
import Notes from "../features/notes/components/Notes";
import Profile from "../features/profile/components/Profile";
import Setting from "../features/setting/components/Setting";
import DoctorDashboard from "../features/homepage/components/doctor/DoctorDashboard";
import Appointments from "../features/appointments/Appointments";
import PatientManagement from "../features/patients/components/PatientManagement";
import AdminDashboard from "../features/homepage/components/admin/AdminDashboard";
import DoctorPatientManagement from "../features/notes/components/doctor/DoctorPatientManagement";

import { getRouteStatus, RouteStatus } from "../config/routes";

const RouteWrapper = ({ element: Element, ...props }) => {
  const location = useLocation();
  const routeStatus = getRouteStatus(location.pathname);

  if (routeStatus === RouteStatus.UNDER_DEVELOPMENT ||
  routeStatus === RouteStatus.COMING_SOON ||
  routeStatus === null) {
    return <NotFound />;
  }

  return <Element {...props} />;
};

const DoctorPatientWrapper = () => {
  const { id: doctorId } = useParams();
  return <DoctorPatientManagement doctorId={doctorId} />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<RouteWrapper element={LandingPage} />} />
        <Route path="/about" element={<RouteWrapper element={About} />} />
        <Route path="/contact" element={<RouteWrapper element={Contact} />} />
        <Route path="/faq" element={<RouteWrapper element={FAQ} />} />
        <Route path="/terms-of-service" element={<RouteWrapper element={TermsOfService} />} />
        <Route path="/privacy-policy" element={<RouteWrapper element={PrivacyPolicy} />} />

        <Route path="blog/*" element={<BlogRouter />} />

        <Route path="/login" element={<RouteWrapper element={Login} />} />
        <Route path="/register" element={<RouteWrapper element={Register} />} />
        <Route path="/forgot-password" element={<RouteWrapper element={ForgotPassword} />} />
        <Route path="/reset-password" element={<RouteWrapper element={ResetPassword} />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

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

        <Route element={<ProtectRoute allowedRoles={["doctor"]} />}>
          <Route element={<RouteProvider />}>
            <Route path="/dashboard/doctor/:id">
              <Route index element={<DoctorDashboard />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="patients" element={<RouteWrapper element={DoctorPatientWrapper} />} />
              <Route path="notes" element={<Notes />} />
              <Route path="reports" element={<RouteWrapper element={DoctorPatientWrapper} />} />
              <Route path="medical-records" element={<RouteWrapper element={DoctorPatientWrapper} />} />
              <Route path="chat/*" element={<ChatRouter />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Setting />} />
              <Route path="blog/*" element={<BlogRouter />} />
            </Route>
          </Route>
        </Route>

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

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
