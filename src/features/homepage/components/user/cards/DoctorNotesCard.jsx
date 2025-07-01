import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotebookPen, AlertCircle, Eye } from "lucide-react";
import { useGetRecentClinicalNotesQuery } from "@/services/clinicalNotesApi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DoctorNotesCard() {
  const user = useSelector((state) => state?.auth);
  const userRole = user?.role || 'patient';
  
  // Get recent clinical notes for the current user
    const { 
    data: notesData, 
    isLoading, 
    error 
  } = useGetRecentClinicalNotesQuery({ 
    doctorId: userRole === 'doctor' ? user?.userID : undefined,
    limit: 5 
  });



  // Extract notes from API response
  const notes = React.useMemo(() => {
    if (!notesData) return [];
    
    let rawNotes = [];
    if (notesData?.data?.notes && Array.isArray(notesData.data.notes)) {
      rawNotes = notesData.data.notes;
    } else if (Array.isArray(notesData)) {
      rawNotes = notesData;
    } else if (notesData.notes && Array.isArray(notesData.notes)) {
      rawNotes = notesData.notes;
    }

    // Transform notes to match card format
    return rawNotes.map(note => ({
      id: note.id,
      avatar: note.doctorAvatar || "/avatars/doctor.png",
      fallback: note.doctorName?.split(' ').map(n => n[0]).join('') || 'DR',
      author: note.doctorName || `Dr. ${note.doctor_first_name} ${note.doctor_last_name}` || 'Doctor',
      date: new Date(note.createdAt || note.created_at).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short", 
        year: "numeric"
      }),
      text: note.content || note.note_content || note.summary || 'Clinical note updated',
      noteType: note.noteType || note.note_type || 'General',
      patientName: note.patientName || `${note.patient_first_name} ${note.patient_last_name}` || '',
      isRead: note.isRead || note.is_read || false
    }));
  }, [notesData]);

  const formatNoteText = (text, noteType) => {
    if (text.length > 120) {
      return text.substring(0, 120) + '...';
    }
    return text;
  };

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
        <CardContent className="h-full">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="p-4 rounded-full bg-red-50 mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-sm text-muted-foreground">
                Unable to load doctor notes
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Please try again later
              </p>
            </div>
          ) : notes.length > 0 ? (
            <div className="space-y-4">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border/50 hover:bg-background/70 transition-colors"
                >
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarImage src={note.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {note.fallback}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">
                        {note.author}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {note.date}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {formatNoteText(note.text, note.noteType)}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {note.noteType}
                      </Badge>
                      {userRole === 'doctor' && note.patientName && (
                        <span className="text-xs text-muted-foreground">
                          Patient: {note.patientName}
                        </span>
                      )}
                      {!note.isRead && (
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="p-4 rounded-full bg-muted/50 mb-4">
                <NotebookPen className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No doctor notes available.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Notes from your healthcare team will appear here
              </p>
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
      );
  }
