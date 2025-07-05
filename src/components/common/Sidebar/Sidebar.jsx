import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useLogoutMutation } from "../../../services/authApi";
import { getNavigationByRole } from "../../../constants/navigation";
import {
  selectCurrentUser,
  selectUserRole,
  selectIsAuthenticated,
  logOut,
} from "../../../state/data/authSlice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, LogOut } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const currentUser = useSelector(selectCurrentUser);
  const userRole = useSelector(selectUserRole);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Get navigation items based on role
  const navigationItems = React.useMemo(() => getNavigationByRole(userRole), [userRole]);

  const getUserDisplayName = () => {
    if (!currentUser) return "Welcome Back";

    if (userRole === "admin" || userRole === "doctor") {
      if (currentUser.firstName && currentUser.lastName) {
        return `Dr. ${currentUser.firstName} ${currentUser.lastName}`;
      }
      if (currentUser.name) {
        return `Dr. ${currentUser.name}`;
      }
      return "Dr. Admin";
    }

    if (currentUser.firstName && currentUser.lastName) {
      return `${currentUser.firstName} ${currentUser.lastName}`;
    }
    if (currentUser.name) {
      return currentUser.name;
    }
    if (currentUser.email) {
      return currentUser.email.split("@")[0];
    }
    return "Welcome Back";
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

  const getUserInitials = () => {
    if (!currentUser) return "U";
    
    if (currentUser.firstName && currentUser.lastName) {
      return `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase();
    }
    if (currentUser.name) {
      return currentUser.name.substring(0, 2).toUpperCase();
    }
    if (currentUser.email) {
      return currentUser.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const NavLink = ({ item }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    const handleClick = (e) => {
      e.preventDefault();
      navigate(item.path);
    };

    return (
      <a
        href={item.path}
        onClick={handleClick}
        className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-all duration-200 hover:bg-accent/50 hover:scale-[1.02] ${
          isActive
            ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20 shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-1 rounded-lg transition-colors ${
              isActive ? "bg-primary/10" : "group-hover:bg-accent"
            }`}
          >
            {Icon && <Icon className="h-4 w-4" />}
          </div>
          <span className="font-medium">{item.name}</span>
        </div>
        {item.badge && (
          <Badge variant={item.badge.variant} className="ml-auto text-xs">
            {item.badge.text}
          </Badge>
        )}
      </a>
    );
  };

  const SidebarContent = () => {
    const displayName = getUserDisplayName();

    return (
      <div className="h-full flex flex-col">
        {/* Profile Section */}
        <div className="p-6 border-b bg-gradient-to-br from-card to-muted/20">
          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar className="h-14 w-14 border-2 border-primary/20 shadow-lg">
                <AvatarImage
                  src={currentUser?.profileImage}
                  alt="Profile"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-semibold">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 border-2 border-background rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold truncate">
                  {displayName}
                </h2>
                <Badge
                  variant="secondary"
                  className="ml-2 bg-primary/5 text-primary border-primary/20"
                >
                  {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {currentUser?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1 px-4">
            <div className="py-6 space-y-6">
              {navigationItems.map((section) => (
                <div key={section.id}>
                  <h3 className="mb-4 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section.label}
                  </h3>
                  <div className="space-y-2">
                    {section.items.map((item) => (
                      <NavLink key={item.path} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Logout Button */}
        <div className="mt-auto border-t bg-gradient-to-br from-card to-muted/20 p-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all duration-200 shadow-sm"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed left-4 top-3 z-40 lg:hidden glass-effect hover:bg-accent/50 transition-all duration-200 shadow-lg"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-80 p-0 border-r bg-gradient-to-b from-background to-muted/20"
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block bg-gradient-to-b from-background to-muted/20 border-r">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;
