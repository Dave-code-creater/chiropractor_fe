"use client";

import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Bell, MessageSquare, Search } from "lucide-react";
import stethoscopeLogo from "@/assets/images/stethoscope.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { selectUserRole, selectUserId, logOut } from "../state/data/authSlice";
import { useLogoutMutation } from "../api/services/authApi";

const Navbar = () => {
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  
  const { userID, role, currentUser } = useSelector((state) => ({
    userID: selectUserId(state),
    role: selectUserRole(state),
    currentUser: state?.auth?.user ?? null
  }));

  const handleLogout = async () => {
    try {
      // Step 1: Call backend logout and wait for confirmation
      const result = await logout(currentUser?.id).unwrap();
      
      // Only proceed if backend confirmed successful logout
      if (result && (result.success === true || result.message === "Logout successful")) {
        console.log("Backend logout successful, proceeding with cleanup");
        
        // Step 2: Set logout flag to prevent token refresh interference
        try {
                const { setLoggingOut } = await import('../api');
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
          const store = window.__REDUX_STORE__;
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
        
        // Step 7: Navigate to login
        window.location.href = '/login';
        
      } else {
        console.error("Backend logout failed - not proceeding with local cleanup");
        alert("Logout failed. Please try again.");
      }
      
    } catch (error) {
      console.error("Logout error:", error);
      
      // Show user-friendly error message
      const errorMessage = error?.data?.message || error?.message || "Logout failed. Please try again.";
      alert(`Logout failed: ${errorMessage}`);
      
      // Only do emergency cleanup if it's a network error or server is unreachable
      if (error?.status === undefined || error?.status >= 500) {
        console.warn("Server unreachable - performing emergency cleanup");
        
        try {
          dispatch(logOut());
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
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center md:pl-80 transition-all duration-300 ease-in-out">
        {/* Logo - only show on mobile */}
        <div className="md:hidden flex items-center gap-2 mr-4">
          <img src={stethoscopeLogo} alt="Logo" className="h-6 w-6" />
          <span className="font-semibold">Dr. Dieu Phan D.C</span>
        </div>

        {/* Search bar */}
        <div className="flex-1 md:flex-initial md:w-[300px] lg:w-[400px] hidden md:block">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-8 bg-muted/50" />
          </div>
        </div>

        {/* Right side navigation */}
        <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/messages">
              <MessageSquare className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                3
              </span>
              <span className="sr-only">Messages</span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                5
              </span>
              <span className="sr-only">Notifications</span>
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Avatar>
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userID}`}
                  />
                  <AvatarFallback>
                    {role === "admin" ? "AD" : `U${userID}`}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/appointments">Appointments</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
