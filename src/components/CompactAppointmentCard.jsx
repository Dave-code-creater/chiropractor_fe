import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CompactAppointmentCard({ appointment, showLocation = true }) {
  return (
    <div className="space-y-3 p-4 rounded-lg bg-background/50 border border-border/50">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border-2 border-primary/20">
          <AvatarImage src={appointment.doctorImage || "/avatars/1.png"} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {appointment.doctorName ? appointment.doctorName[0] : "D"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-foreground">
            {appointment.doctorName || "Doctor"}
          </p>
          {appointment.specialty && (
            <p className="text-xs text-muted-foreground">
              {appointment.specialty}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-2 text-sm">
        {appointment.date && (
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">Date:</span>
            <span className="text-muted-foreground">{appointment.date}</span>
          </div>
        )}
        {appointment.time && (
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">Time:</span>
            <span className="text-muted-foreground">{appointment.time}</span>
            {appointment.duration && (
              <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                ⏱ {appointment.duration}
              </span>
            )}
          </div>
        )}
      </div>
      {showLocation && appointment.location && (
        <div className="pt-2 border-t border-border/50">
          <p className="text-xs font-medium text-muted-foreground mb-1">
            Location
          </p>
          <p className="text-sm text-foreground">{appointment.location}</p>
        </div>
      )}
    </div>
  );
} 