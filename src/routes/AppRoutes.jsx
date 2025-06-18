import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/DefaultLayout';
import HomepageLayout from '../layouts/user/HomepageLayout';
import AdminLayout from '../layouts/admin/HomepageLayout';

import LandingPage from '../pages/LandingPage';
import About from '../pages/About';
import Contact from '../pages/Contact';
import FAQ from '../pages/FAQ';

import Login from '../features/auth/components/Login';
import Register from '../features/auth/components/Register';

import Homepage from '../features/homepage/components/user/Homepage';
import Setting from '../features/setting/components/Setting';
import Appointments from '../features/appointments/components/Appointments';
import Blog from '../features/blog/components/user/Blog';
import Inbox from '../features/chat/components/Chat';
import Profile from '../features/profile/components/Profile';
import Report from '../features/report/components/user/Report';
import AdminDashboard from '../features/homepage/components/admin/Homepage';
import ProfileUser from '../features/drreport/components/InitialDrReport';
import ProtectRoute from './ProtectRoute';

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Layout */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<div>Services</div>} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/privacy-policy" element={<div>Privacy Policy</div>} />
                <Route path="/terms-of-service" element={<div>Terms of Service</div>} />
                <Route path="/reset-password" element={<div>Reset Password</div>} />
            </Route>

            {/* User Dashboard */}
            <Route path="/dashboard/:id" element={<ProtectRoute allowedRoles={['user']} />}>
                <Route element={<HomepageLayout />}>
                    <Route index element={<Homepage />} />
                    <Route path="services/profile" element={<Profile />} />
                    <Route path="services/settings" element={<Setting />} />
                    <Route path="services/blog" element={<Blog />} />
                    <Route path="services/inbox" element={<Inbox />} />
                    <Route path="services/physical-therapy" element={<div>Physical Therapy</div>} />
                    <Route path="services/chiropractic" element={<div>Chiropractic</div>} />
                    <Route path="services/appointments" element={<Appointments />} />
                    <Route path="services/doctor-notes" element={<div>Doctor Notes</div>} />
                    <Route path="services/initial-report" element={<Report />} />
                    <Route path="services/report" element={<div>Reporting</div>} />
                </Route>
            </Route>

            {/* Admin Portal */}
            <Route path="/admin/:id" element={<ProtectRoute allowedRoles={['admin']} />}>
                <Route element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="manage-users" element={<div>Manage Users</div>} />
                    <Route path="analytics" element={<div>Analytics</div>} />
                    <Route path="doctor-report" element={<ProfileUser/>} />
                    {/* Add more admin routes here */}
                </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    );
}