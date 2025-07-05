import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function CompactAppointmentCard({ appointment, showLocation = true }) {
  const isCanceled = appointment.is_cancel || appointment.is_cancelled || appointment.status === 'cancelled';
  
  return (
    <div className={`space-y-3 p-4 rounded-lg border border-border/50 relative ${
      isCanceled 
        ? 'bg-muted/30 opacity-60' 
        : 'bg-background/50'
    }`}>
      {/* Small cancelled indicator - positioned subtly on the left */}
      {isCanceled && (
        <div className="absolute -left-1 top-3 bottom-3 w-1 bg-red-400 rounded-r-sm"></div>
      )}
      
      <div className="flex items-center gap-3">
        <Avatar className={`h-10 w-10 border-2 ${
          isCanceled ? 'border-muted grayscale' : 'border-primary/20'
        }`}>
          <AvatarImage src={appointment.doctorImage || "/avatars/1.png"} />
          <AvatarFallback className={`${
            isCanceled ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'
          }`}>
            {appointment.doctorName ? appointment.doctorName[0] : "D"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className={`font-medium ${
              isCanceled ? 'text-muted-foreground line-through' : 'text-foreground'
            }`}>
              {appointment.doctorName || "Doctor"}
            </p>
            {isCanceled && (
              <Badge variant="secondary" className="text-xs px-2 py-0 h-5 bg-red-100 text-red-700 border-red-200">
                Cancelled
              </Badge>
            )}
          </div>
          {appointment.specialty && (
            <p className={`text-xs ${
              isCanceled ? 'text-muted-foreground/70' : 'text-muted-foreground'
            }`}>
              {appointment.specialty}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-2 text-sm">
        {appointment.date && (
          <div className="flex items-center gap-2">
            <span className={`font-medium ${
              isCanceled ? 'text-muted-foreground' : 'text-foreground'
            }`}>Date:</span>
            <span className={`${
              isCanceled ? 'text-muted-foreground/70 line-through' : 'text-muted-foreground'
            }`}>{appointment.date}</span>
          </div>
        )}
        {appointment.time && (
          <div className="flex items-center gap-2">
            <span className={`font-medium ${
              isCanceled ? 'text-muted-foreground' : 'text-foreground'
            }`}>Time:</span>
            <span className={`${
              isCanceled ? 'text-muted-foreground/70 line-through' : 'text-muted-foreground'
            }`}>{appointment.time}</span>
            {appointment.duration && (
              <span className={`text-xs px-2 py-1 rounded ${
                isCanceled 
                  ? 'text-muted-foreground/70 bg-muted/50' 
                  : 'text-primary bg-primary/10'
              }`}>
                ⏱ {appointment.duration}
              </span>
            )}
          </div>
        )}
      </div>
      {showLocation && appointment.location && (
        <div className={`pt-2 border-t ${
          isCanceled ? 'border-muted/50' : 'border-border/50'
        }`}>
          <p className={`text-xs font-medium mb-1 ${
            isCanceled ? 'text-muted-foreground/70' : 'text-muted-foreground'
          }`}>
            Location
          </p>
          <p className={`text-sm ${
            isCanceled ? 'text-muted-foreground/70 line-through' : 'text-foreground'
          }`}>{appointment.location}</p>
        </div>
      )}
    </div>
  );
} 