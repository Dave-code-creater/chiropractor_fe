import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Skeleton } from '../../../components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { FileText, Lock, Edit, Eye, Plus } from 'lucide-react';
import { useGetClinicalNoteByAppointmentQuery } from '../../../api';
import SOAPNoteForm from './SOAPNoteForm';
import { Badge } from '../../../components/ui/badge';

/**
 * Appointment Clinical Note Component
 * Shows clinical note for an appointment with edit capability
 * Only visible to doctors/admins
 */
const AppointmentClinicalNote = ({ appointmentId, appointmentData, userRole }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [mode, setMode] = useState('view'); // 'view' or 'edit'

  const { data: noteData, isLoading, error } = useGetClinicalNoteByAppointmentQuery(appointmentId, {
    skip: !appointmentId || !['doctor', 'admin'].includes(userRole)
  });

  const clinicalNote = noteData?.data?.clinical_note;

  // Don't show anything for patients
  if (!['doctor', 'admin'].includes(userRole)) {
    return null;
  }

  const handleSuccess = () => {
    setIsFormOpen(false);
    setMode('view');
  };

  const openForm = (editMode = false) => {
    setMode(editMode ? 'edit' : 'create');
    setIsFormOpen(true);
  };

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
          Failed to load clinical note: {error?.data?.message || 'Unknown error'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Clinical Note
          <Lock className="h-4 w-4 text-gray-400" title="Private - Doctor/Admin only" />
        </CardTitle>
        <div className="flex items-center gap-2">
          {clinicalNote ? (
            <>
              <Badge variant="secondary">SOAP Note</Badge>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => openForm(true)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Clinical Note</DialogTitle>
                  </DialogHeader>
                  <SOAPNoteForm
                    appointmentId={appointmentId}
                    appointmentData={appointmentData}
                    existingNote={clinicalNote}
                    onSuccess={handleSuccess}
                    onCancel={() => setIsFormOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={() => openForm(false)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Note
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Clinical Note</DialogTitle>
                </DialogHeader>
                <SOAPNoteForm
                  appointmentId={appointmentId}
                  appointmentData={appointmentData}
                  onSuccess={handleSuccess}
                  onCancel={() => setIsFormOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {clinicalNote ? (
          <div className="space-y-4">
            {/* SOAP Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clinicalNote.subjective && (
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-blue-600">SUBJECTIVE</div>
                  <div className="text-sm bg-blue-50 p-2 rounded line-clamp-3">
                    {clinicalNote.subjective}
                  </div>
                </div>
              )}
              {clinicalNote.objective && (
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-green-600">OBJECTIVE</div>
                  <div className="text-sm bg-green-50 p-2 rounded line-clamp-3">
                    {clinicalNote.objective}
                  </div>
                </div>
              )}
              {clinicalNote.assessment && (
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-orange-600">ASSESSMENT</div>
                  <div className="text-sm bg-orange-50 p-2 rounded line-clamp-3">
                    {clinicalNote.assessment}
                  </div>
                </div>
              )}
              {clinicalNote.plan && (
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-purple-600">PLAN</div>
                  <div className="text-sm bg-purple-50 p-2 rounded line-clamp-3">
                    {clinicalNote.plan}
                  </div>
                </div>
              )}
            </div>

            {/* Treatment & Techniques */}
            {(clinicalNote.treatment_performed || clinicalNote.techniques_used?.length > 0) && (
              <div className="pt-3 border-t space-y-2">
                {clinicalNote.treatment_performed && (
                  <div>
                    <div className="text-xs font-semibold text-gray-600">Treatment</div>
                    <div className="text-sm line-clamp-2">{clinicalNote.treatment_performed}</div>
                  </div>
                )}
                {clinicalNote.techniques_used?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {clinicalNote.techniques_used.map((tech, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* View Full Note Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="h-4 w-4 mr-1" />
                  View Full Note
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Clinical Note Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  {clinicalNote.subjective && (
                    <div>
                      <div className="font-semibold text-sm text-blue-600 mb-1">S - Subjective</div>
                      <div className="text-sm bg-blue-50 p-3 rounded">{clinicalNote.subjective}</div>
                    </div>
                  )}
                  {clinicalNote.objective && (
                    <div>
                      <div className="font-semibold text-sm text-green-600 mb-1">O - Objective</div>
                      <div className="text-sm bg-green-50 p-3 rounded">{clinicalNote.objective}</div>
                    </div>
                  )}
                  {clinicalNote.assessment && (
                    <div>
                      <div className="font-semibold text-sm text-orange-600 mb-1">A - Assessment</div>
                      <div className="text-sm bg-orange-50 p-3 rounded">{clinicalNote.assessment}</div>
                    </div>
                  )}
                  {clinicalNote.plan && (
                    <div>
                      <div className="font-semibold text-sm text-purple-600 mb-1">P - Plan</div>
                      <div className="text-sm bg-purple-50 p-3 rounded">{clinicalNote.plan}</div>
                    </div>
                  )}
                  {clinicalNote.treatment_performed && (
                    <div>
                      <div className="font-semibold text-sm mb-1">Treatment Performed</div>
                      <div className="text-sm bg-gray-50 p-3 rounded">{clinicalNote.treatment_performed}</div>
                    </div>
                  )}
                  {clinicalNote.follow_up_notes && (
                    <div>
                      <div className="font-semibold text-sm mb-1">Follow-up Notes</div>
                      <div className="text-sm bg-yellow-50 p-3 rounded">{clinicalNote.follow_up_notes}</div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              No clinical note created for this appointment yet. Click "Add Note" to create one.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentClinicalNote;
