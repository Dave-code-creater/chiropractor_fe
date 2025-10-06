"use client";

import { useState, useEffect } from "react";
import { UserCog, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Account from "./Account";
import Notifications from "./Notifications";
import Display from "./Display";


const tabs = [
  {
    id: "account",
    label: "Account",
    icon: UserCog
  },
];

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  return isMobile;
}

export default function Setting() {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768 ? null : "account";
    }
    return "account";
  });

  const renderTab = () => {
    switch (tab) {
      case "account":
        return <Account />;
      case "notifications":
        return <Notifications />;
      case "display":
        return <Display />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      <div
        className={cn(
          "w-full md:w-1/3 lg:w-1/4 max-w-sm p-4",
          tab && isMobile && "hidden",
        )}
      >
        <h2 className="text-2xl font-semibold mb-4 px-1">Settings</h2>
        <ScrollArea className="space-y-3">
          {tabs.map(({ id, label, icon: Icon }) => (
            <Card
              key={id}
              className={cn(
                "cursor-pointer flex items-center gap-4 p-4 hover:bg-muted transition my-4",
                tab === id && "border-primary bg-muted",
              )}
              onClick={() => setTab(id)}
            >
              <Icon className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium">{label}</span>
            </Card>
          ))}
        </ScrollArea>
      </div>
      {tab && (
        <div className="flex-1 flex flex-col bg-white border-l md:border-t-0 border-t">
          <div className="flex items-center p-4 border-b gap-3">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setTab(null)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h2 className="text-lg font-semibold capitalize">{tab}</h2>
          </div>
          <div className="flex-1 overflow-auto p-4 pb-12">
            <ScrollArea className="h-full">{renderTab()}</ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}
