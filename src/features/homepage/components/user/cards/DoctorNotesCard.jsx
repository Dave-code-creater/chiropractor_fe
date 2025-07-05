import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotebookPen, AlertCircle, Eye } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DoctorNotesCard() {
  const user = useSelector((state) => state?.auth);
  const userRole = user?.role || 'patient';
  
  // Remove API call and notes logic
  // const { data: notesData, isLoading, error } = useGetRecentClinicalNotesQuery(...);
  // const notes = React.useMemo(() => { ... }, [notesData]);

  // Instead, show a placeholder message
  return (
    <Card className="w-full h-full border-0 shadow-lg bg-gradient-to-br from-card to-muted/20 hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <NotebookPen className="w-4 h-4 text-primary" />
          </div>
          Doctor Notes
        </CardTitle>
      </CardHeader>
      <ScrollArea className="max-h-[300px] h-full">
        <CardContent className="h-full flex flex-col items-center justify-center text-center py-12">
          <div className="p-4 rounded-full bg-muted/50 mb-4">
            <NotebookPen className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Doctor notes are not available in this build.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            This section will show recent notes from your healthcare team in the future.
          </p>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
