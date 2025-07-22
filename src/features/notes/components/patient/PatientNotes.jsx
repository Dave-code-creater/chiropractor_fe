import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  FileText,
  Calendar,
  Clock,
  Search,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import { useNoteManagement, NOTE_TYPES, formatNoteDate } from "../../domain/noteService";

const PatientNotes = ({ userId }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [expandedNotes, setExpandedNotes] = useState(new Set());

  const {
    notes,
    incidents,
    isLoading,
    permissions
  } = useNoteManagement(userId, 'patient');

  // Filter notes based on search and type
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || note.type === filterType;
    return matchesSearch && matchesType;
  });

  const toggleNoteExpansion = (noteId) => {
    const newExpanded = new Set(expandedNotes);
    if (newExpanded.has(noteId)) {
      newExpanded.delete(noteId);
    } else {
      newExpanded.add(noteId);
    }
    setExpandedNotes(newExpanded);
  };

  const renderNoteContent = (note) => {
    const isExpanded = expandedNotes.has(note.id);

    switch (note.type) {
      case NOTE_TYPES.TREATMENT_PLAN:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm">Diagnosis</h4>
                <p className="text-sm text-muted-foreground">{note.diagnosis}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm">Overall Goal</h4>
                <p className="text-sm text-muted-foreground">{note.overall_goal}</p>
              </div>
            </div>
            
            {isExpanded && note.phases && (
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Treatment Phases</h4>
                <div className="space-y-2">
                  {note.phases.map((phase, index) => (
                    <Card key={phase.id || index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{phase.name}</h5>
                          <Badge variant="outline">
                            {phase.duration} weeks × {phase.appointments_per_week}/week
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{phase.description}</p>
                        {phase.goals && (
                          <div className="mt-2">
                            <strong className="text-sm">Goals:</strong>
                            <p className="text-sm text-muted-foreground">{phase.goals}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case NOTE_TYPES.SOAP:
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm">Subjective</h4>
              <p className="text-sm text-muted-foreground">{note.subjective}</p>
            </div>
            {isExpanded && (
              <>
                <div>
                  <h4 className="font-medium text-sm">Objective</h4>
                  <p className="text-sm text-muted-foreground">{note.objective}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Assessment</h4>
                  <p className="text-sm text-muted-foreground">{note.assessment}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Plan</h4>
                  <p className="text-sm text-muted-foreground">{note.plan}</p>
                </div>
              </>
            )}
          </div>
        );

      default:
        return (
          <div>
            <p className="text-sm text-muted-foreground">
              {isExpanded ? note.content : `${note.content?.slice(0, 200)}...`}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">My Clinical Notes</h2>
        <p className="text-muted-foreground">
          View your treatment history and progress
        </p>
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
            <Card key={note.id} className="cursor-pointer hover:border-primary/50 transition-colors">
              <CardHeader className="p-4" onClick={() => toggleNoteExpansion(note.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge>
                      {note.type.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <h3 className="font-semibold">{note.title}</h3>
                  </div>
                  {expandedNotes.has(note.id) ? (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {renderNoteContent(note)}
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatNoteDate(note.created_at)}
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
                  : "Your clinical notes will appear here after your appointments"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PatientNotes; 