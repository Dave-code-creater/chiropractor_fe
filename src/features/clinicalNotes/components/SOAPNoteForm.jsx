import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Separator } from '../../../components/ui/separator';
import { Shield, FileText, Save, X, Plus } from 'lucide-react';
import { useCreateOrUpdateNoteForAppointmentMutation } from '../../../api';
import { toast } from 'sonner';

/**
 * SOAP Note Form Component
 * SOAP = Subjective, Objective, Assessment, Plan
 *
 * Used by doctors to create/update clinical notes for appointments
 * Privacy: These notes are NEVER visible to patients
 */
const SOAPNoteForm = ({ appointmentId, appointmentData, existingNote, onSuccess, onCancel }) => {
  const [createOrUpdateNote, { isLoading }] = useCreateOrUpdateNoteForAppointmentMutation();

  const [formData, setFormData] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    treatment_performed: '',
    techniques_used: [],
    vitals: {
      blood_pressure: '',
      pulse: '',
      temperature: '',
      respiratory_rate: '',
      oxygen_saturation: '',
      weight: '',
      height: ''
    },
    follow_up_notes: '',
    next_appointment_recommendation: '',
    visit_duration_minutes: ''
  });

  const [newTechnique, setNewTechnique] = useState('');

  // Load existing note data if editing
  useEffect(() => {
    if (existingNote) {
      setFormData({
        subjective: existingNote.subjective || '',
        objective: existingNote.objective || '',
        assessment: existingNote.assessment || '',
        plan: existingNote.plan || '',
        treatment_performed: existingNote.treatment_performed || '',
        techniques_used: existingNote.techniques_used || [],
        vitals: existingNote.vitals || {
          blood_pressure: '',
          pulse: '',
          temperature: '',
          respiratory_rate: '',
          oxygen_saturation: '',
          weight: '',
          height: ''
        },
        follow_up_notes: existingNote.follow_up_notes || '',
        next_appointment_recommendation: existingNote.next_appointment_recommendation || '',
        visit_duration_minutes: existingNote.visit_duration_minutes || ''
      });
    }
  }, [existingNote]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVitalsChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      vitals: { ...prev.vitals, [field]: value }
    }));
  };

  const addTechnique = () => {
    if (newTechnique.trim()) {
      setFormData(prev => ({
        ...prev,
        techniques_used: [...prev.techniques_used, newTechnique.trim()]
      }));
      setNewTechnique('');
    }
  };

  const removeTechnique = (index) => {
    setFormData(prev => ({
      ...prev,
      techniques_used: prev.techniques_used.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await createOrUpdateNote({
        appointmentId,
        ...formData
      }).unwrap();

      toast.success(
        existingNote ? 'Clinical note updated successfully' : 'Clinical note created successfully',
        {
          description: 'SOAP note has been saved securely'
        }
      );

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Failed to save clinical note:', error);
      toast.error('Failed to save clinical note', {
        description: error?.data?.message || 'Please try again'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Privacy Notice */}
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Confidential Medical Record</strong> - This clinical note is private and only
          visible to medical staff. It will never be shown to the patient.
        </AlertDescription>
      </Alert>

      {/* Appointment Info */}
      {appointmentData && (
        <Card className="bg-gray-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Appointment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div><strong>Patient:</strong> {appointmentData.patient_name || 'Unknown'}</div>
            <div><strong>Date:</strong> {appointmentData.appointment_date || 'N/A'}</div>
            <div><strong>Time:</strong> {appointmentData.appointment_time || 'N/A'}</div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="soap" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="soap">SOAP Note</TabsTrigger>
          <TabsTrigger value="treatment">Treatment</TabsTrigger>
          <TabsTrigger value="vitals">Vitals & Follow-up</TabsTrigger>
        </TabsList>

        {/* SOAP Format Tab */}
        <TabsContent value="soap" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="subjective" className="text-base font-semibold">
              S - Subjective <span className="text-sm font-normal text-gray-500">(Patient's Complaints)</span>
            </Label>
            <Textarea
              id="subjective"
              value={formData.subjective}
              onChange={(e) => handleInputChange('subjective', e.target.value)}
              placeholder="What the patient reports: symptoms, pain location, severity, history..."
              className="min-h-[100px]"
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="objective" className="text-base font-semibold">
              O - Objective <span className="text-sm font-normal text-gray-500">(Your Observations)</span>
            </Label>
            <Textarea
              id="objective"
              value={formData.objective}
              onChange={(e) => handleInputChange('objective', e.target.value)}
              placeholder="Physical findings, test results, observations, range of motion..."
              className="min-h-[100px]"
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="assessment" className="text-base font-semibold">
              A - Assessment <span className="text-sm font-normal text-gray-500">(Diagnosis)</span>
            </Label>
            <Textarea
              id="assessment"
              value={formData.assessment}
              onChange={(e) => handleInputChange('assessment', e.target.value)}
              placeholder="Your professional assessment, diagnosis, evaluation..."
              className="min-h-[80px]"
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="plan" className="text-base font-semibold">
              P - Plan <span className="text-sm font-normal text-gray-500">(Treatment Plan)</span>
            </Label>
            <Textarea
              id="plan"
              value={formData.plan}
              onChange={(e) => handleInputChange('plan', e.target.value)}
              placeholder="Treatment plan, recommendations, next steps, medications..."
              className="min-h-[80px]"
            />
          </div>
        </TabsContent>

        {/* Treatment Tab */}
        <TabsContent value="treatment" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="treatment_performed">Treatment Performed Today</Label>
            <Textarea
              id="treatment_performed"
              value={formData.treatment_performed}
              onChange={(e) => handleInputChange('treatment_performed', e.target.value)}
              placeholder="Specific treatments performed during this visit..."
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Techniques Used</Label>
            <div className="flex gap-2">
              <Input
                value={newTechnique}
                onChange={(e) => setNewTechnique(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnique())}
                placeholder="e.g., Spinal adjustment, Activator method..."
              />
              <Button type="button" onClick={addTechnique} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.techniques_used.map((technique, index) => (
                <Badge key={index} variant="secondary" className="pr-1">
                  {technique}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => removeTechnique(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="visit_duration">Visit Duration (minutes)</Label>
            <Input
              id="visit_duration"
              type="number"
              value={formData.visit_duration_minutes}
              onChange={(e) => handleInputChange('visit_duration_minutes', e.target.value)}
              placeholder="45"
              min="1"
              max="480"
            />
          </div>
        </TabsContent>

        {/* Vitals & Follow-up Tab */}
        <TabsContent value="vitals" className="space-y-4 mt-4">
          <div>
            <Label className="text-base font-semibold mb-3 block">Vital Signs</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label htmlFor="bp" className="text-sm">Blood Pressure</Label>
                <Input
                  id="bp"
                  value={formData.vitals.blood_pressure}
                  onChange={(e) => handleVitalsChange('blood_pressure', e.target.value)}
                  placeholder="120/80"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="pulse" className="text-sm">Pulse (bpm)</Label>
                <Input
                  id="pulse"
                  type="number"
                  value={formData.vitals.pulse}
                  onChange={(e) => handleVitalsChange('pulse', e.target.value)}
                  placeholder="72"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="temp" className="text-sm">Temperature (°F)</Label>
                <Input
                  id="temp"
                  type="number"
                  step="0.1"
                  value={formData.vitals.temperature}
                  onChange={(e) => handleVitalsChange('temperature', e.target.value)}
                  placeholder="98.6"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="resp" className="text-sm">Respiratory Rate</Label>
                <Input
                  id="resp"
                  type="number"
                  value={formData.vitals.respiratory_rate}
                  onChange={(e) => handleVitalsChange('respiratory_rate', e.target.value)}
                  placeholder="16"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="o2" className="text-sm">O₂ Saturation (%)</Label>
                <Input
                  id="o2"
                  type="number"
                  value={formData.vitals.oxygen_saturation}
                  onChange={(e) => handleVitalsChange('oxygen_saturation', e.target.value)}
                  placeholder="98"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="weight" className="text-sm">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.vitals.weight}
                  onChange={(e) => handleVitalsChange('weight', e.target.value)}
                  placeholder="150"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="follow_up_notes">Follow-up Notes (Internal)</Label>
            <Textarea
              id="follow_up_notes"
              value={formData.follow_up_notes}
              onChange={(e) => handleInputChange('follow_up_notes', e.target.value)}
              placeholder="Internal notes, things to remember for next visit..."
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="next_appointment">Next Appointment Recommendation</Label>
            <Input
              id="next_appointment"
              value={formData.next_appointment_recommendation}
              onChange={(e) => handleInputChange('next_appointment_recommendation', e.target.value)}
              placeholder="e.g., 1 week, 2 weeks, as needed..."
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Saving...' : existingNote ? 'Update Note' : 'Save Note'}
        </Button>
      </div>
    </form>
  );
};

export default SOAPNoteForm;
