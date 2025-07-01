import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Sidebar from "../components/common/Sidebar/Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { ArrowUp, Loader2, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const DefaultLayout = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Show scroll to top button when scrolled down
  useEffect(() => {
    const handleScroll = (e) => {
      const scrollTop = e.target.scrollTop;
      setShowScrollTop(scrollTop > 300);
    };

    const scrollArea = document.querySelector(
      "[data-radix-scroll-area-viewport]",
    );
    scrollArea?.addEventListener("scroll", handleScroll);

    return () => scrollArea?.removeEventListener("scroll", handleScroll);
  }, []);

  // Loading state on route change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const scrollToTop = () => {
    const scrollArea = document.querySelector(
      "[data-radix-scroll-area-viewport]",
    );
    scrollArea?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get page title from route
  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      "/dashboard": "Dashboard",
      "/appointments": "Appointments",
      "/profile": "Profile",
      "/chat": "Messages",
      "/blog": "Blog",
      "/report": "Reports",
      "/settings": "Settings",
    };
    return titles[path] || "Dashboard";
  };

  const getPageDescription = () => {
    const path = location.pathname;
    const descriptions = {
      "/dashboard": "Overview of your health journey and upcoming appointments",
      "/appointments": "Schedule and manage your appointments",
      "/profile": "Manage your personal and medical information",
      "/chat": "Communicate with your healthcare providers",
      "/blog": "Read the latest health articles and updates",
      "/report": "View and manage your medical reports",
      "/settings": "Customize your account preferences",
    };
    return descriptions[path] || "Manage your healthcare experience";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Main layout with sidebar and content */}
      <div className="flex">
        {/* Desktop Sidebar - always visible on desktop */}
        <div className="hidden lg:block w-80 shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="w-80 p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Main content area */}
        <main className="flex-1 min-h-screen">
          <ScrollArea className="h-screen">
            {/* Mobile Header with Menu Button */}
            <div className="lg:hidden sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
              <div className="flex items-center justify-between px-4 py-3">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle sidebar</span>
                    </Button>
                  </SheetTrigger>
                </Sheet>
                <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
                <div className="w-10"></div> {/* Spacer for centering */}
              </div>
            </div>

            {/* Page Container */}
            <div className="container px-6 py-8 lg:px-12">
              {/* Content Wrapper */}
              <div className="mx-auto max-w-6xl space-y-8">
                {/* Page Header - hidden on mobile since it's in the mobile header */}
                <div className="animate-fade-in hidden lg:block">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                      {getPageTitle()}
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                      {getPageDescription()}
                    </p>
                  </div>
                </div>

                {/* Breadcrumb Navigation */}
                <div className="animate-slide-up">
                  <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span className="hover:text-foreground cursor-pointer transition-colors">
                      Home
                    </span>
                    <span>/</span>
                    <span className="text-foreground font-medium">
                      {getPageTitle()}
                    </span>
                  </nav>
                </div>

                {/* Main Content with Loading State */}
                <div className="animate-fade-in">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="flex items-center space-x-3">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="text-muted-foreground">
                          Loading...
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <Outlet />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <Footer />
          </ScrollArea>
        </main>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-8 right-8 z-50 shadow-lg hover:shadow-xl transition-all duration-200 animate-fade-in"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: "glass-effect",
        }}
      />
    </div>
  );
};

export default DefaultLayout;
