import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
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
import {
  useSidebar,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import ThemeToggleButton from "@/components/theme/ThemeToggleButton";

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

  const navigation = React.useMemo(() => {
    if (userRole && userId) {
      return getNavigationByRole(userRole, userId);
    }
    return {};
  }, [userRole, userId]);

  const getUserDisplayName = () => {
    if (!currentUser) return "Welcome Back";

    let displayName = "";

    if (userRole === "admin" || userRole === "doctor") {
      if (currentUser.firstName && currentUser.lastName) {
        displayName = `${currentUser.firstName} ${currentUser.lastName}`;
      } else if (currentUser.name) {
        displayName = `${currentUser.name}`;
      } else {
        displayName = "Dr. Admin";
      }
    } else {
      if (currentUser.firstName && currentUser.lastName) {
        displayName = `${currentUser.firstName} ${currentUser.lastName}`;
      } else if (currentUser.name) {
        displayName = currentUser.name;
      } else {
        displayName = currentUser.email ? currentUser.email.split("@")[0] : "Welcome Back";
      }
    }

    if (displayName.length > 10) {
      return `${displayName.substring(0, 10)}...`;
    }

    return displayName;
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
      {isMobile && (
        <div className="fixed left-3 top-3 z-50 lg:hidden">
          <SidebarTrigger className="h-10 w-10 rounded-lg bg-background/80 backdrop-blur-sm border border-border shadow-lg" />
        </div>
      )}
      <Sidebar variant="sidebar" collapsible={isMobile ? "offcanvas" : "none"} className="sidebar-full-height">
        <SidebarHeader className="p-6 border-b bg-gradient-to-br from-card to-muted/20">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-lg">
                <AvatarImage
                  src={currentUser?.profileImage}
                  alt="Profile"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-semibold text-lg">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 border-2 border-background rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <h2 className="text-lg font-semibold leading-tight overflow-hidden text-ellipsis whitespace-nowrap">
                    {getUserDisplayName()}
                  </h2>
                  <Badge
                    variant="secondary"
                    className="flex-shrink-0 bg-primary/5 text-primary border-primary/20 text-sm whitespace-nowrap"
                  >
                    {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                  {currentUser?.email}
                </p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <ThemeToggleButton variant="ghost" size="sm" />
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-8">
              {Object.entries(navigation).map(([key, section]) => (
                <div key={key} className="space-y-3">
                  <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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
                              "flex items-center w-full gap-4 px-4 py-3 rounded-lg transition-colors text-base group",
                              location.pathname === item.path
                                ? "bg-primary/10 text-primary border border-primary/20"
                                : "hover:bg-accent"
                            )}
                          >
                            {item.icon && <item.icon className="h-5 w-5 flex-shrink-0" />}
                            <span className="font-medium truncate flex-1 min-w-0">{item.name}</span>
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

        <SidebarFooter className="border-t bg-gradient-to-br from-card to-muted/20 p-6">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all duration-200 text-base py-3"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default AppSidebar;
