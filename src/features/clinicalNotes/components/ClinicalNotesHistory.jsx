import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../components/ui/accordion';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Skeleton } from '../../../components/ui/skeleton';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Calendar, FileText, User, Clock, Activity, AlertCircle } from 'lucide-react';
import { useGetClinicalNotesByPatientQuery } from '../../../api';
import { format } from 'date-fns';

/**
 * Clinical Notes History Component
 * Displays paginated list of clinical notes for a patient
 * Doctor/Admin view only - patients cannot see this
 */
const ClinicalNotesHistory = ({ patientId, patientName }) => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useGetClinicalNotesByPatientQuery(
    { patientId, page, limit },
    { skip: !patientId }
  );

  const notes = data?.data || [];
  const pagination = data?.pagination || {};

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatVitals = (vitals) => {
    if (!vitals || typeof vitals !== 'object') return null;

    const vitalsArray = [];
    if (vitals.blood_pressure) vitalsArray.push(`BP: ${vitals.blood_pressure}`);
    if (vitals.pulse) vitalsArray.push(`Pulse: ${vitals.pulse}`);
    if (vitals.temperature) vitalsArray.push(`Temp: ${vitals.temperature}°F`);
    if (vitals.oxygen_saturation) vitalsArray.push(`O₂: ${vitals.oxygen_saturation}%`);

    return vitalsArray.length > 0 ? vitalsArray.join(' | ') : null;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load clinical notes: {error?.data?.message || 'Unknown error'}
        </AlertDescription>
      </Alert>
    );
  }

  if (notes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Clinical Notes History
          </CardTitle>
          <CardDescription>
            {patientName ? `Clinical notes for ${patientName}` : 'Patient clinical notes'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              No clinical notes found for this patient. Create the first note after an appointment.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Clinical Notes History
        </CardTitle>
        <CardDescription>
          {patientName ? `Clinical notes for ${patientName}` : 'Patient clinical notes'} ({pagination.total || 0} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {notes.map((note, index) => (
              <AccordionItem key={note.id} value={`note-${note.id}`} className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex flex-col items-start gap-2 text-left w-full pr-4">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          #{note.id}
                        </Badge>
                        <span className="font-semibold">
                          {note.appointment_date ? formatDate(note.appointment_date) : formatDate(note.created_at)}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {note.note_type || 'SOAP'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {note.doctor_name && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {note.doctor_name}
                        </div>
                      )}
                      {note.appointment_time && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {note.appointment_time}
                        </div>
                      )}
                      {note.visit_duration_minutes && (
                        <div className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          {note.visit_duration_minutes} min
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pt-4 space-y-4">
                  {/* SOAP Format */}
                  <div className="space-y-3">
                    {note.subjective && (
                      <div className="space-y-1">
                        <div className="font-semibold text-sm text-blue-600">S - Subjective</div>
                        <div className="text-sm bg-blue-50 p-3 rounded-md">{note.subjective}</div>
                      </div>
                    )}

                    {note.objective && (
                      <div className="space-y-1">
                        <div className="font-semibold text-sm text-green-600">O - Objective</div>
                        <div className="text-sm bg-green-50 p-3 rounded-md">{note.objective}</div>
                      </div>
                    )}

                    {note.assessment && (
                      <div className="space-y-1">
                        <div className="font-semibold text-sm text-orange-600">A - Assessment</div>
                        <div className="text-sm bg-orange-50 p-3 rounded-md">{note.assessment}</div>
                      </div>
                    )}

                    {note.plan && (
                      <div className="space-y-1">
                        <div className="font-semibold text-sm text-purple-600">P - Plan</div>
                        <div className="text-sm bg-purple-50 p-3 rounded-md">{note.plan}</div>
                      </div>
                    )}
                  </div>

                  {/* Treatment Performed */}
                  {note.treatment_performed && (
                    <div className="space-y-1">
                      <div className="font-semibold text-sm">Treatment Performed</div>
                      <div className="text-sm bg-gray-50 p-3 rounded-md">{note.treatment_performed}</div>
                    </div>
                  )}

                  {/* Techniques Used */}
                  {note.techniques_used && note.techniques_used.length > 0 && (
                    <div className="space-y-1">
                      <div className="font-semibold text-sm">Techniques Used</div>
                      <div className="flex flex-wrap gap-2">
                        {note.techniques_used.map((technique, idx) => (
                          <Badge key={idx} variant="outline">
                            {technique}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vitals */}
                  {formatVitals(note.vitals) && (
                    <div className="space-y-1">
                      <div className="font-semibold text-sm">Vitals</div>
                      <div className="text-sm bg-gray-50 p-3 rounded-md font-mono">
                        {formatVitals(note.vitals)}
                      </div>
                    </div>
                  )}

                  {/* Follow-up Notes */}
                  {note.follow_up_notes && (
                    <div className="space-y-1">
                      <div className="font-semibold text-sm">Follow-up Notes</div>
                      <div className="text-sm bg-yellow-50 p-3 rounded-md">{note.follow_up_notes}</div>
                    </div>
                  )}

                  {/* Next Appointment */}
                  {note.next_appointment_recommendation && (
                    <div className="space-y-1">
                      <div className="font-semibold text-sm">Next Appointment</div>
                      <Badge variant="secondary" className="text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        {note.next_appointment_recommendation}
                      </Badge>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="pt-3 border-t text-xs text-gray-500">
                    Created: {formatDate(note.created_at)}
                    {note.updated_at && note.updated_at !== note.created_at && (
                      <> • Updated: {formatDate(note.updated_at)}</>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!pagination.hasPrev}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={!pagination.hasNext}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClinicalNotesHistory;
