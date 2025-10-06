import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Skeleton } from '../../../components/ui/skeleton';
import { Badge } from '../../../components/ui/badge';
import { FileText, Activity, Stethoscope, ClipboardList, Calendar } from 'lucide-react';
import { useGetClinicalNoteByAppointmentQuery } from '../../../api';
import { format } from 'date-fns';

/**
 * Patient Clinical Note Component
 * Shows clinical note for a patient's appointment
 * Patient-friendly view showing treatment summary
 */
const PatientClinicalNote = ({ appointmentId, appointmentData }) => {
  const { data: noteData, isLoading, error } = useGetClinicalNoteByAppointmentQuery(appointmentId, {
    skip: !appointmentId
  });

  const clinicalNote = noteData?.data?.clinical_note;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error && error.status !== 404) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load visit notes: {error?.data?.message || 'Unknown error'}
        </AlertDescription>
      </Alert>
    );
  }

  // No clinical note yet
  if (!clinicalNote) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-5 w-5" />
            Visit Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Your doctor has not yet added notes for this visit. Notes will appear here after your appointment.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-5 w-5" />
            Visit Notes
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {clinicalNote.created_at ? format(new Date(clinicalNote.created_at), 'MMM d, yyyy') : 'Recent'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Your Symptoms */}
        {clinicalNote.subjective && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
              <Activity className="h-4 w-4" />
              Your Symptoms & Concerns
            </div>
            <div className="text-sm bg-blue-50 p-3 rounded-lg border border-blue-100">
              {clinicalNote.subjective}
            </div>
          </div>
        )}

        {/* Doctor's Findings */}
        {clinicalNote.objective && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
              <Stethoscope className="h-4 w-4" />
              Examination Findings
            </div>
            <div className="text-sm bg-green-50 p-3 rounded-lg border border-green-100">
              {clinicalNote.objective}
            </div>
          </div>
        )}

        {/* Diagnosis */}
        {clinicalNote.assessment && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-orange-600">
              <ClipboardList className="h-4 w-4" />
              Diagnosis
            </div>
            <div className="text-sm bg-orange-50 p-3 rounded-lg border border-orange-100">
              {clinicalNote.assessment}
            </div>
          </div>
        )}

        {/* Treatment Plan */}
        {clinicalNote.plan && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-purple-600">
              <Calendar className="h-4 w-4" />
              Treatment Plan
            </div>
            <div className="text-sm bg-purple-50 p-3 rounded-lg border border-purple-100">
              {clinicalNote.plan}
            </div>
          </div>
        )}

        {/* Treatment Details */}
        {clinicalNote.treatment_performed && (
          <div className="pt-3 border-t space-y-2">
            <div className="text-xs font-semibold text-gray-600 uppercase">Treatment Performed</div>
            <div className="text-sm text-gray-700">{clinicalNote.treatment_performed}</div>
          </div>
        )}

        {/* Techniques Used */}
        {clinicalNote.techniques_used && clinicalNote.techniques_used.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-600 uppercase">Techniques Used</div>
            <div className="flex flex-wrap gap-2">
              {clinicalNote.techniques_used.map((tech, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Vitals */}
        {clinicalNote.vitals && Object.keys(clinicalNote.vitals).length > 0 && (
          <div className="pt-3 border-t space-y-2">
            <div className="text-xs font-semibold text-gray-600 uppercase">Vital Signs</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {clinicalNote.vitals.blood_pressure && (
                <div>
                  <span className="text-gray-500">Blood Pressure:</span>{' '}
                  <span className="font-medium">{clinicalNote.vitals.blood_pressure}</span>
                </div>
              )}
              {clinicalNote.vitals.pulse && (
                <div>
                  <span className="text-gray-500">Pulse:</span>{' '}
                  <span className="font-medium">{clinicalNote.vitals.pulse} bpm</span>
                </div>
              )}
              {clinicalNote.vitals.temperature && (
                <div>
                  <span className="text-gray-500">Temperature:</span>{' '}
                  <span className="font-medium">{clinicalNote.vitals.temperature}°F</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Next Appointment Recommendation */}
        {clinicalNote.next_appointment_recommendation && (
          <Alert>
            <Calendar className="h-4 w-4" />
            <AlertDescription>
              <strong>Follow-up:</strong> {clinicalNote.next_appointment_recommendation}
            </AlertDescription>
          </Alert>
        )}

        {/* Visit Duration */}
        {clinicalNote.visit_duration_minutes && (
          <div className="text-xs text-gray-500 text-center pt-2 border-t">
            Visit Duration: {clinicalNote.visit_duration_minutes} minutes
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientClinicalNote;
