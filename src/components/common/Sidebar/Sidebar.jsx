import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useLogoutMutation } from "../../../services/authApi";
import { USER_FEATURES } from "../../../constants/navbar";
import {
  selectCurrentUser,
  selectUserEmail,
  selectUsername,
  selectUserRole,
  selectIsAuthenticated,
  selectUserDisplayName,
  selectUserInitials,
  selectUserRoleDisplay,
  logOut,
} from "../../../state/data/authSlice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menu,
  HomeIcon,
  Calendar,
  MessageSquare,
  FileText,
  Settings,
  Bell,
  ClipboardList,
  Pill,
  CreditCard,
  Video,
  Activity,
  Shield,
  UserPlus,
  LogOut,
  BookOpen,
  CircleUserRound,
  Mail,
  User,
} from "lucide-react";

// Safe selectors
const selectSafeUser = (state) => state?.data?.auth?.user ?? null;
const selectSafeEmail = (state) => state?.data?.auth?.email ?? null;
const selectSafeUsername = (state) => state?.data?.auth?.username ?? null;
const selectSafeRole = (state) => state?.data?.auth?.role ?? null;
const selectSafeIsAuthenticated = (state) => state?.data?.auth?.isAuthenticated ?? false;
const selectSafeAuthState = (state) => state?.data?.auth ?? null;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  // Use secure selectors to get user data with null checks
  const currentUser = useSelector((state) => state?.auth?.user ?? null);
  const userEmail = useSelector((state) => state?.auth?.email ?? null);
  const username = useSelector((state) => state?.auth?.username ?? null);
  const userRole = useSelector((state) => state?.auth?.role ?? null);
  const isAuthenticated = useSelector((state) => state?.auth?.isAuthenticated ?? false);

  // Also get the raw auth state for fallback with null check
  const rawAuthState = useSelector((state) => state?.auth ?? null);

  // Generate display name
  const getUserDisplayName = () => {
    const user = currentUser || rawAuthState?.user;
    const role = userRole || rawAuthState?.role;

    if (!user) return "Welcome Back";

    if (role === "admin" || role === "doctor") {
      if (user?.profile?.full_name) {
        return `Dr. ${user.profile.full_name}`;
      }
      if (user?.username) {
        return `Dr. ${user.username}`;
      }
      return "Dr. Admin";
    }

    // For patients and other roles
    if (user?.profile?.full_name) {
      return user.profile.full_name;
    }
    if (user?.username) {
      return user.username;
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "Welcome Back";
  };

    const handleLogout = async () => {
    try {
      
      
      // Step 1: Try API logout first (non-blocking)
      logout(currentUser?.id).unwrap().catch(error => {

      });
      
      // Step 2: Set logout flag to prevent token refresh interference
      try {
        const { setLoggingOut } = await import('../../../services/baseApi');
        setLoggingOut(true);

      } catch (error) {
        
      }
      
      // Step 3: Clear Redux auth state and user entity
      dispatch(logOut());
      
      // Also clear user entity data
      try {
        const { clearUserData } = await import('../../../state/data/userSlice');
        dispatch(clearUserData());

      } catch (error) {
        
      }
      
      // Step 4: Clear ALL browser storage
      localStorage.clear();
      sessionStorage.clear();
      
      
      // Step 5: Clear all cookies
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      });
      
      
      // Step 6: Clear RTK Query cache
      try {
        const store = window.__REDUX_STORE__;
        if (store) {
          store.dispatch({ type: 'api/util/resetApiState' });
  
        }
      } catch (error) {
        
      }
      
      // Step 7: Stop token management
      try {
        const { stopPeriodicTokenCheck } = await import('../../../services/baseApi');
        stopPeriodicTokenCheck();

      } catch (error) {
        
      }
      
      // Step 8: Force page reload for completely clean state
      
      window.location.href = '/login';
      
    } catch (error) {
      
      
      // Nuclear fallback: clear everything and force reload
      try {
        dispatch(logOut());
      } catch (e) {
        
      }
      
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear cookies aggressively
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      });
      
      window.location.href = '/login';
    }
  };

  // Generate user initials for avatar fallback
  const getUserInitials = () => {
    const user = currentUser || rawAuthState?.user;
    
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    if (userEmail) {
      return userEmail.substring(0, 2).toUpperCase();
    }
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  // Get role badge text
  const getRoleBadge = () => {
    switch (userRole) {
      case "admin":
        return { text: "Admin", variant: "default" };
      case "doctor":
        return { text: "Doctor", variant: "secondary" };
      case "patient":
        return { text: "Patient", variant: "outline" };
      default:
        return { text: "User", variant: "outline" };
    }
  };

  // Map icons to feature names
  const getFeatureIcon = (name) => {
    const iconMap = {
      Dashboard: HomeIcon,
      Appointments: Calendar,
      Profile: CircleUserRound,
      Chat: MessageSquare,
      Blog: BookOpen,
      Report: FileText,
      Settings: Settings,
      Notifications: Bell,
      "Medical Records": ClipboardList,
      Prescriptions: Pill,
      Billing: CreditCard,
      Telehealth: Video,
      "Health Tracking": Activity,
      Insurance: Shield,
      Referrals: UserPlus,
    };
    const IconComponent = iconMap[name] || HomeIcon;
    return <IconComponent className="h-4 w-4" />;
  };

  const NavLink = ({ feature, badge }) => {
    const isActive = location.pathname === feature.href;
    return (
      <Link
        to={feature.href}
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
            {getFeatureIcon(feature.name)}
          </div>
          <span className="font-medium">{feature.name}</span>
        </div>
        {badge && (
          <Badge variant={badge.variant} className="ml-auto text-xs">
            {badge.text}
          </Badge>
        )}
      </Link>
    );
  };

  const SidebarContent = () => {
    const roleBadge = getRoleBadge();
    const displayName = getUserDisplayName();

    // Fallback values for robust display
    const displayEmail = userEmail || rawAuthState?.user?.email;
    const displayUsername = username || rawAuthState?.user?.username;

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
                  variant={roleBadge.variant}
                  className="ml-2 bg-primary/5 text-primary border-primary/20"
                >
                  {roleBadge.text}
                </Badge>
              </div>

              {/* Username display */}
              {displayUsername && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <User className="h-3 w-3" />
                  <span className="truncate" title={displayUsername}>
                    {displayUsername}
                  </span>
                </div>
              )}

              {/* Email display */}
              {displayEmail && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span className="truncate" title={displayEmail}>
                    {displayEmail}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation - This will take up remaining space */}
        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1 px-4">
            <div className="py-6">
              <div>
                <h3 className="mb-4 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Main Features
                </h3>
                <div className="space-y-2">
                  {USER_FEATURES.active.map((feature) => (
                    <NavLink key={feature.href} feature={feature} />
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Logout Button - Fixed at bottom */}
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

      {/* Desktop Sidebar Content */}
      <div className="bg-gradient-to-b from-background to-muted/20 border-r">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;
