"use client";

import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
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
import { selectUserRole, selectUserId } from "../state/data/authSlice";

const Navbar = () => {
  const { userID, role } = useSelector((state) => ({
    userID: selectUserId(state),
    role: selectUserRole(state)
  }));

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
              <DropdownMenuItem className="text-red-600">
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
