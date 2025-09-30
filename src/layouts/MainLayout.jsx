import { useLocation, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/state/data/authSlice";
import NotificationProvider from "@/components/notifications/NotificationProvider";
import { Toaster } from "@/components/ui/sonner";
import PublicNavbar from "@/layouts/PublicNavbar";
import Footer from "@/layouts/Footer";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/Sidebar";

const MainLayout = () => {
    const location = useLocation();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const publicRoutes = [
        '/',
        '/about',
        '/contact',
        '/faq',
        '/terms-of-service',
        '/privacy-policy',
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/unauthorized',
        '/blog'
    ];

    const isPublicRoute = publicRoutes.some(route =>
        location.pathname === route ||
        (route === '/blog' && location.pathname.startsWith('/blog'))
    ) || !isAuthenticated;

    if (isPublicRoute) {
        return (
            <NotificationProvider>
                <div className="min-h-screen bg-background flex flex-col">
                    <PublicNavbar />

                    <main className="flex-1">
                        <Outlet />
                    </main>

                    <Footer />

                    <Toaster />
                </div>
            </NotificationProvider>
        );
    }

    return (
        <NotificationProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="min-h-screen flex flex-col">
                    <main className="flex-1 p-3 sm:p-4 md:p-6 bg-background">
                        <div className="max-w-7xl mx-auto">
                            <Outlet />
                        </div>
                    </main>
                    <Footer />
                </SidebarInset>
                <Toaster />
            </SidebarProvider>
        </NotificationProvider>
    );
};

export default MainLayout;
