import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { FileText, Shield } from 'lucide-react';
import { ClinicalNotesHistory } from './components';

/**
 * Clinical Notes Main Page
 * View for doctors to see patient clinical notes
 * Includes privacy notice and patient selection
 */
const ClinicalNotes = () => {
  const { patientId } = useParams();

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Clinical Notes
          </h1>
          <p className="text-gray-600 mt-1">SOAP format medical documentation</p>
        </div>
      </div>

      {/* Privacy Notice */}
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Confidential Medical Records</strong> - Clinical notes are private and only
          visible to authorized medical staff. They are never shared with patients.
        </AlertDescription>
      </Alert>

      {/* Clinical Notes History */}
      {patientId ? (
        <ClinicalNotesHistory patientId={patientId} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Select a Patient</CardTitle>
            <CardDescription>
              Choose a patient from your dashboard to view their clinical notes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                Navigate to a patient's record or appointment to view or create clinical notes.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClinicalNotes;
