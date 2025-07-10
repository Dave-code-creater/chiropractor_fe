import {
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon,
  SettingsIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../api/services/authApi";
import { logOut, selectCurrentUser, selectUserRole, selectUserId } from "../state/data/authSlice";
import { toast } from "sonner";

export function NavUser() {
  const { isMobile } = useSidebar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  
  // Get current user, role, and ID from Redux state
  const currentUser = useSelector(selectCurrentUser);
  const userRole = useSelector(selectUserRole);
  const userId = useSelector(selectUserId);

  // Get user display info
  const userDisplayName = currentUser?.firstName && currentUser?.lastName 
    ? `${currentUser.firstName} ${curreentUser.lastName}`
    : currentUser?.name || currentUser?.email?.split('@')[0] || 'User';

  const userEmail = currentUser?.email || '';
  const userInitials = currentUser?.firstName && currentUser?.lastName
    ? `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase()
    : (currentUser?.name || 'U').substring(0, 2).toUpperCase();

  // Get role-specific paths
  const getBasePath = () => {
    if (!userRole || !userId) return '/dashboard';
    return `/dashboard/${userRole.toLowerCase()}/${userId}`;
  };

  const getProfilePath = () => `${getBasePath()}/profile`;
  const getSettingsPath = () => `${getBasePath()}/settings`;

  const handleLogout = async () => {
    try {
      // Show loading toast
      toast.loading("Logging out...");

      // Step 1: Call backend logout
      const result = await logout(currentUser?.id).unwrap();
      
      if (result && (result.success === true || result.message === "Logout successful")) {
        // Step 2: Set logout flag to prevent token refresh
        try {
                  const { setLoggingOut } = await import('../api');
        setLoggingOut(true);
        } catch (error) {
          console.warn("Could not set logging out flag:", error);
        }
        
        // Step 3: Clear storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Step 4: Clear cookies
        document.cookie.split(";").forEach((c) => {
          const eqPos = c.indexOf("=");
          const name = eqPos > -1 ? c.substr(0, eqPos) : c;
          document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        });
        
        // Step 5: Clear RTK Query cache
        try {
          const store = (window as any).__REDUX_STORE__;
          if (store) {
            store.dispatch({ type: 'api/util/resetApiState' });
          }
        } catch (error) {
          console.warn("Could not clear RTK Query cache:", error);
        }
        
        // Step 6: Stop token management
        try {
                  const { stopPeriodicTokenCheck } = await import('../api');
        stopPeriodicTokenCheck();
        } catch (error) {
          console.warn("Could not stop token management:", error);
        }

        // Show success toast
        toast.success("Logged out successfully");
        
        // Step 7: Navigate to login
        setTimeout(() => {
          window.location.href = '/login';
        }, 500);
        
      } else {
        toast.error("Logout failed. Please try again.");
      }
      
    } catch (error: any) {
      console.error("Logout error:", error);
      
      const errorMessage = error?.data?.message || error?.message || "Logout failed. Please try again.";
      toast.error(`Logout failed: ${errorMessage}`);
      
      // Emergency cleanup for severe errors
      if (error?.status === undefined || error?.status >= 500) {
        console.warn("Server unreachable - performing emergency cleanup");
        
        try {
          dispatch(logOut());
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = '/login';
        } catch (cleanupError) {
          console.error("Emergency cleanup failed:", cleanupError);
          window.location.reload();
        }
      }
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={currentUser?.avatar || ''} alt={userDisplayName} />
                <AvatarFallback className="rounded-lg bg-primary/10">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userDisplayName}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {userRole ? `${userRole} Account` : userEmail}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={currentUser?.avatar || ''} alt={userDisplayName} />
                  <AvatarFallback className="rounded-lg bg-primary/10">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userDisplayName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {userRole ? `${userRole} Account` : userEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate(getProfilePath())}>
                <UserCircleIcon className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(getSettingsPath())}>
                <SettingsIcon className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600"
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
