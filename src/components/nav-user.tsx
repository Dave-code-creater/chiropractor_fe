import {
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon,
} from "lucide-react";

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
import { useLogoutMutation } from "../services/authApi";
import { logOut, selectCurrentUser } from "../state/data/authSlice";

export function NavUser() {
  const { isMobile } = useSidebar();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  
  // Get current user from Redux state using memoized selector
  const currentUser = useSelector(selectCurrentUser);

  // Get user display info
  const userDisplayName = currentUser?.firstName && currentUser?.lastName 
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : currentUser?.name || currentUser?.email?.split('@')[0] || 'User';

  const userEmail = currentUser?.email || '';
  const userInitials = currentUser?.firstName && currentUser?.lastName
    ? `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase()
    : (currentUser?.name || 'U').substring(0, 2).toUpperCase();

  const handleLogout = async () => {
    try {
      // Step 1: Call backend logout and wait for confirmation
      const result = await logout(currentUser?.id).unwrap();
      
      // Only proceed if backend confirmed successful logout
      if (result && (result.success === true || result.message === "Logout successful")) {
        console.log("Backend logout successful, proceeding with cleanup");
        
        // Step 2: Set logout flag to prevent token refresh interference
        try {
          const { setLoggingOut } = await import('../services/baseApi');
          setLoggingOut(true);
        } catch (error) {
          console.warn("Could not set logging out flag:", error);
        }
        
        // Step 3: Clear ALL browser storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Step 4: Clear all cookies
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
          const { stopPeriodicTokenCheck } = await import('../services/baseApi');
          stopPeriodicTokenCheck();
        } catch (error) {
          console.warn("Could not stop token management:", error);
        }
        
        // Step 7: Navigate to login
        window.location.href = '/login';
        
      } else {
        console.error("Backend logout failed - not proceeding with local cleanup");
        alert("Logout failed. Please try again.");
      }
      
    } catch (error: any) {
      console.error("Logout error:", error);
      
      // Show user-friendly error message
      const errorMessage = error?.data?.message || error?.message || "Logout failed. Please try again.";
      alert(`Logout failed: ${errorMessage}`);
      
      // Only do emergency cleanup if it's a network error or server is unreachable
      if (error?.status === undefined || error?.status >= 500) {
        console.warn("Server unreachable - performing emergency cleanup");
        
        try {
          dispatch(logOut());
          const { clearUserData } = await import('../state/data/userSlice');
          dispatch(clearUserData());
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = '/login';
        } catch (cleanupError) {
          console.error("Emergency cleanup failed:", cleanupError);
          // Force page reload as last resort
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
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={currentUser?.avatar || ''} alt={userDisplayName} />
                <AvatarFallback className="rounded-lg">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userDisplayName}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {userEmail}
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
                  <AvatarFallback className="rounded-lg">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userDisplayName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {userEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserCircleIcon />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
