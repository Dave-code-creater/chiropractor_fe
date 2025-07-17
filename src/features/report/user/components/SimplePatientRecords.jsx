import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  useGetIncidentsQuery,
} from '@/api';
import { useSelector } from 'react-redux';
import { selectUserId } from '@/state/data/authSlice';
import UnifiedPatientForm from './UnifiedPatientForm';

export default function SimplePatientRecords({ onBack }) {
  const [showSuccess, setShowSuccess] = useState(false);

  // Get current user ID
  const userId = useSelector(selectUserId);
  
  // API hooks - fetch incidents for this user
  const { data: userIncidents, isLoading } = useGetIncidentsQuery(userId, { skip: !userId });

  // No initialization needed - form will create incident on submission

  const handleFormComplete = () => {
    setShowSuccess(true);
    toast.success('All forms submitted successfully!');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your information...</p>
        </div>
      </div>
    );
  }

  // Success state
  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-green-700">
                Forms Submitted Successfully!
              </h2>
              <p className="text-muted-foreground">
                Your complete patient information has been submitted. Thank you for providing all the necessary details.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <Button onClick={onBack} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user ID is available
  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Please log in to access the form...</p>
        </div>
      </div>
    );
  }

  // Main form
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Unified Form */}
        <UnifiedPatientForm
          userId={userId}
          onComplete={handleFormComplete}
          onBack={onBack}
        />
      </div>
    </div>
  );
} 