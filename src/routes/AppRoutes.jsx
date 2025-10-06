import { Routes, Route, useLocation, useParams } from "react-router-dom";
import { lazy, Suspense } from "react";
import { getRouteStatus, RouteStatus } from "../config/routes";

// Immediate load components (used in layout/routing)
import MainLayout from "../layouts/MainLayout";
import RouteProvider from "./RouteProvider";
import ProtectRoute from "./ProtectRoute";
import ErrorBoundary from "../components/common/ErrorBoundary";

// Lazy load all page components
const Landing = lazy(() => import("../pages/Landing"));
const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/Contact"));
const FAQ = lazy(() => import("../pages/FAQ"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("../pages/TermsOfService"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Unauthorized = lazy(() => import("../pages/Unauthorized"));

// Lazy load auth components
const Login = lazy(() => import("../features/auth/Login"));
const Register = lazy(() => import("../features/auth/Register"));
const ForgotPassword = lazy(() => import("../features/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../features/auth/ResetPassword"));

// Lazy load feature routers
const BlogRouter = lazy(() => import("../features/blog/BlogRouter"));
const ChatRouter = lazy(() => import("../features/chat/ChatRouter"));

// Lazy load dashboard components
const HomePage = lazy(() => import("../features/homepage/components/user/HomePage"));
const PatientAppointments = lazy(() => import("../features/appointments/components/patient/PatientAppointments"));
const Report = lazy(() => import("../features/report/user/Report"));
const Notes = lazy(() => import("../features/notes/components/Notes"));
const Profile = lazy(() => import("../features/profile/components/Profile"));
const Settings = lazy(() => import("../features/settings/components/Settings"));
const DoctorDashboard = lazy(() => import("../features/homepage/components/doctor/DoctorDashboard"));
const Appointments = lazy(() => import("../features/appointments/Appointments"));
const PatientManagement = lazy(() => import("../features/patients/components/PatientManagement"));
const AdminDashboard = lazy(() => import("../features/homepage/components/admin/AdminDashboard"));
const DoctorPatientManagement = lazy(() => import("../features/notes/components/doctor/DoctorPatientManagement"));

// Loading fallback component
const RouteLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

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
    <ErrorBoundary>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route element={<MainLayout />}>
          <Route path="/" element={<RouteWrapper element={Landing} />} />
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
                <Route path="notes" element={<Notes />} />
                <Route path="reports" element={<Report />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
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
                <Route path="settings" element={<Settings />} />
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
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
