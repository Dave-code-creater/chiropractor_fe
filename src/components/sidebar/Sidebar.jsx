import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "@/api/services/authApi";
import { getNavigationByRole } from "@/constants/navigation";
import {
  selectCurrentUser,
  selectUserRole,
  selectUserId,
  selectIsAuthenticated,
  logOut,
} from "@/state/data/authSlice";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isMobile } = useSidebar();
  const [logout] = useLogoutMutation();

  const currentUser = useSelector(selectCurrentUser);
  const userRole = useSelector(selectUserRole);
  const userId = useSelector(selectUserId);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Get navigation based on role and user ID
  const navigation = React.useMemo(() => {
    if (userRole && userId) {
      return getNavigationByRole(userRole, userId);
    }
    return {};
  }, [userRole, userId]);

  const getUserDisplayName = () => {
    if (!currentUser) return "Welcome Back";

    if (userRole === "admin" || userRole === "doctor") {
      return currentUser.firstName && currentUser.lastName
        ? `Dr. ${currentUser.firstName} ${currentUser.lastName}`
        : currentUser.name
        ? `Dr. ${currentUser.name}`
        : "Dr. Admin";
    }

    return currentUser.firstName && currentUser.lastName
      ? `${currentUser.firstName} ${currentUser.lastName}`
      : currentUser.name
      ? currentUser.name
      : currentUser.email
      ? currentUser.email.split("@")[0]
      : "Welcome Back";
  };

  const getUserInitials = () => {
    if (!currentUser) return "U";
    
    if (currentUser.firstName && currentUser.lastName) {
      return `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase();
    }
    return currentUser.name
      ? currentUser.name.substring(0, 2).toUpperCase()
      : currentUser.email
      ? currentUser.email[0].toUpperCase()
      : "U";
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logOut());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Mobile Trigger - only show on mobile */}
      {isMobile && (
        <div className="fixed left-3 top-3 z-50 lg:hidden">
          <SidebarTrigger className="h-10 w-10 rounded-lg bg-background/80 backdrop-blur-sm border border-border shadow-lg" />
        </div>
      )}

      {/* Sidebar - shows on desktop, collapsible on mobile */}
      <Sidebar variant="sidebar" collapsible={isMobile ? "offcanvas" : "none"}>
        <SidebarHeader className="p-4 sm:p-6 border-b bg-gradient-to-br from-card to-muted/20">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="relative">
              <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-primary/20 shadow-lg">
                <AvatarImage
                  src={currentUser?.profileImage}
                  alt="Profile"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-semibold text-sm sm:text-base">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-green-500 border-2 border-background rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <h2 className="text-sm sm:text-lg font-semibold truncate">
                  {getUserDisplayName()}
                </h2>
                <Badge
                  variant="secondary"
                  className="ml-2 bg-primary/5 text-primary border-primary/20 text-xs sm:text-sm"
                >
                  {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {currentUser?.email}
              </p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <ScrollArea className="flex-1">
            <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
              {Object.entries(navigation).map(([key, section]) => (
                <div key={key} className="space-y-1 sm:space-y-2">
                  <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section.label}
                  </h3>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton
                          asChild
                          isActive={location.pathname === item.path}
                        >
                          <Link
                            to={item.path}
                            className={cn(
                              "flex items-center w-full gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg transition-colors text-sm sm:text-base",
                              location.pathname === item.path 
                                ? "bg-primary/10 text-primary border border-primary/20" 
                                : "hover:bg-accent"
                            )}
                          >
                            {item.icon && <item.icon className="h-4 w-4 flex-shrink-0" />}
                            <span className="font-medium truncate">{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </div>
              ))}
            </div>
          </ScrollArea>
        </SidebarContent>

        <SidebarFooter className="border-t bg-gradient-to-br from-card to-muted/20 p-3 sm:p-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 sm:gap-3 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all duration-200 text-sm sm:text-base"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="font-medium">Logout</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default AppSidebar; 