import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Contact from '../pages/Contact';
import About from '../pages/About';
import FAQ from '../pages/FAQ';
import LandingPage from '../pages/LandingPage';
import Login from '../features/auth/components/Login';
import Register from '../features/auth/components/Register';
import ProtectRoute from './ProtectRoute';

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<About /> } />
                <Route path="/services" element={<div>Services</div>} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/guides" element={<div>Guides</div>} />
                <Route path="/privacy-policy" element={<div>Privacy Policy</div>} />
                <Route path="/terms-of-service" element={<div>Terms of Service</div>} />
                <Route path='/login' element={<Login />} />
                <Route path="/reset-password" element={<div>Reset Password</div>} />
                <Route path="/register" element={<Register />} />

                {/* protected routes */}
                <Route element={<ProtectRoute />}>
                    <Route path="/dashboard/:id" element={<div>Dashboard</div>} />
                    <Route path="/profile/:id" element={<div>Profile</div>} />
                    <Route path="/settings/:id" element={<div>Settings</div>} />
                    <Route path="/services/:id/physical-therapy" element={<div>Physical Therapy</div>} />
                    <Route path='/services/:id/chiropractic' element={<div>Chiropractic</div>} />
                    <Route path='/services/:id/booking' element={<div>Booking</div>} />
                </Route>
            </Route>
            {/* Fallback route for 404 */}

        </Routes>
    );
}