import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  FileText,
  Calendar,
  Clock,
  Search,
  Filter,
  ChevronLeft,
  Users,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { selectUserId } from "@/state/data/authSlice";

import TreatmentPlanForm from "../TreatmentPlanForm";
import DoctorPatientManagement from "./DoctorPatientManagement";
import { useNoteManagement, NOTE_TYPES, validateNoteData } from "../../domain/noteService";

const DoctorNotes = ({ patientId, patientName }) => {
  const [activeTab, setActiveTab] = useState("patients");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [selectedNoteType, setSelectedNoteType] = useState(null);

  // Get current user's ID to use as doctorId
  const currentUserId = useSelector(selectUserId);

  const {
    notes,
    incidents,
    isLoading,
    permissions,
    createNote,
    updateNote,
    deleteNote
  } = useNoteManagement(patientId, 'doctor');

  // Filter notes based on search and type
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || note.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleCreateNote = async (noteData) => {
    try {
      const { isValid, errors } = validateNoteData(noteData);
      
      if (!isValid) {
        const errorMessages = Object.values(errors).join(", ");
        toast.error(`Validation failed: ${errorMessages}`);
        return;
      }

      await createNote({
        patient_id: patientId,
        ...noteData
      });

      toast.success("Note created successfully");
      setIsAddingNote(false);
      setSelectedNoteType(null);
    } catch (error) {
      toast.error("Failed to create note");
      console.error("Note creation error:", error);
    }
  };

  const renderNoteForm = () => {
    switch (selectedNoteType) {
      case NOTE_TYPES.TREATMENT_PLAN:
        return (
          <TreatmentPlanForm
            patientId={patientId}
            patientName={patientName}
            onSubmit={handleCreateNote}
            onCancel={() => {
              setIsAddingNote(false);
              setSelectedNoteType(null);
            }}
          />
        );
      // Add other note type forms here
      default:
        return null;
    }
  };

  if (isAddingNote) {
    return renderNoteForm();
  }

  return (
    <div className="space-y-6">


      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="patients" className="space-y-6">
          <DoctorPatientManagement doctorId={currentUserId} />
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          {patientId ? (
            <>
              {/* Notes Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Clinical Notes</h3>
                  <p className="text-muted-foreground">
                    Manage clinical notes for {patientName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={selectedNoteType}
                    onValueChange={value => {
                      setSelectedNoteType(value);
                      setIsAddingNote(true);
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Create New Note" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(NOTE_TYPES).map(([key, value]) => (
                        <SelectItem key={value} value={value}>
                          {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                    prefix={<Search className="w-4 h-4 text-muted-foreground" />}
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {Object.entries(NOTE_TYPES).map(([key, value]) => (
                      <SelectItem key={value} value={value}>
                        {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes List */}
              <div className="space-y-4">
                {isLoading ? (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    </CardContent>
                  </Card>
                ) : filteredNotes.length > 0 ? (
                  filteredNotes.map(note => (
                    <Card key={note.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge>
                              {note.type.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <h3 className="font-semibold">{note.title}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {note.content}
                        </p>
                        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(note.created_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(note.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-muted-foreground">
                        No Notes Found
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {searchTerm || filterType !== "all"
                          ? "No notes match your search criteria"
                          : "Start by creating a new note"}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Stethoscope className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">
                  Select a Patient
                </h3>
                <p className="text-sm text-muted-foreground">
                  Choose a patient from the "My Patients" tab to view and manage their clinical notes
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorNotes; 