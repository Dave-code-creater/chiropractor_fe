import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClipboardCheck, AlertCircle, Eye } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DoctorNotesCard() {
  const user = useSelector((state) => state?.auth);
  const userRole = user?.role || 'patient';
  
  return (
    <Card className="w-full h-[400px] border-0 shadow-lg bg-gradient-to-br from-card to-muted/20 hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] backdrop-blur-sm flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
          <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
            <ClipboardCheck className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
          </div>
          <span className="hidden sm:inline">Doctor Notes & Treatment Plans</span>
          <span className="sm:hidden">Doctor Notes</span>
        </CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1">
        <CardContent className="p-3 sm:p-6 flex flex-col items-center justify-center text-center py-8 sm:py-12">
          <div className="p-3 sm:p-4 rounded-full bg-muted/50 mb-3 sm:mb-4">
            <ClipboardCheck className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            No doctor notes available yet.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Doctor notes and treatment plans will appear here after your appointments.
          </p>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
