import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import AppSidebar from "@/components/sidebar/Sidebar";
import Footer from "@/layouts/Footer";
import PublicNavbar from "@/layouts/PublicNavbar";
import NotificationProvider from "@/components/notifications/NotificationProvider";
import { selectIsAuthenticated } from "@/state/data/authSlice";

const MainLayout = () => {
    const location = useLocation();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // Define public routes that should use the public navbar instead of sidebar
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

    // Check if current route is public or if user is not authenticated
    const isPublicRoute = publicRoutes.some(route =>
        location.pathname === route ||
        (route === '/blog' && location.pathname.startsWith('/blog'))
    ) || !isAuthenticated;

    if (isPublicRoute) {
        // Public Layout - Simple layout with public navbar
        return (
            <NotificationProvider>
                <div className="min-h-screen bg-background flex flex-col">
                    {/* Public Navbar */}
                    <PublicNavbar />

                    {/* Main content area - no sidebar for public pages */}
                    <main className="flex-1">
                        <Outlet />
                    </main>

                    {/* Footer */}
                    <Footer />

                    {/* Enhanced Toast Notifications */}
                    <Toaster />
                </div>
            </NotificationProvider>
        );
    }

    // Authenticated Layout - Layout with sidebar for dashboard pages
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
                {/* Enhanced Toast Notifications */}
                <Toaster />
            </SidebarProvider>
        </NotificationProvider>
    );
};

export default MainLayout;
