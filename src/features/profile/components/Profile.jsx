"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, UserCircle, Mail, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import PersonalInfo from "./PersonalInfo";
import ContactInfo from "./ContactInfo";
import MedicalInfo from "./MedicalInfo";

const tabs = [
    { id: "profile", label: "Profile", icon: UserCircle },
    { id: "contact", label: "Contact", icon: Mail },
    { id: "medical", label: "Medical", icon: HeartPulse },
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

export default function Profile() {
    const isMobile = useIsMobile();
    const [tab, setTab] = useState(() => {
        // Default to "profile" for desktop, null for mobile
        if (typeof window !== "undefined") {
            return window.innerWidth < 768 ? null : "profile";
        }
        return "profile";
    });

    const renderTab = () => {
        switch (tab) {
            case "profile":
                return <PersonalInfo />;
            case "contact":
                return <ContactInfo />;
            case "medical":
                return <MedicalInfo />;
            default:
                return <PersonalInfo />;
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-background">
            {/* Sidebar */}
            <div
                className={cn(
                    "w-full md:w-1/3 lg:w-1/4 max-w-sm p-4",
                    tab && isMobile && "hidden"
                )}
            >
                <h2 className="text-2xl font-semibold mb-4 px-1">My Profile</h2>
                <ScrollArea className="space-y-3">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <Card
                            key={id}
                            className={cn(
                                "cursor-pointer flex items-center gap-4 p-4 my-4 hover:bg-muted transition",
                                tab === id && "border-primary bg-muted"
                            )}
                            onClick={() => setTab(id)}
                        >
                            <Icon className="w-5 h-5 text-muted-foreground" />
                            <span className="text-sm font-medium">{label}</span>
                        </Card>
                    ))}
                </ScrollArea>
            </div>

            {/* Main Content */}
            {tab && (
                <div className="flex-1 flex flex-col bg-white border-l md:border-t-0 border-t">
                    <div className="flex items-center p-4 border-b  gap-3">
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