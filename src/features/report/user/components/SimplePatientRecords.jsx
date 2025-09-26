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

  const userId = useSelector(selectUserId);
  
  const { data: userIncidents, isLoading } = useGetIncidentsQuery(userId, { skip: !userId });

  const handleFormComplete = () => {
    setShowSuccess(true);
    toast.success('All forms submitted successfully!');
  };

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

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-earthfire-clay-200 bg-earthfire-clay-50 text-earthfire-brown-800">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 mx-auto text-earthfire-brick-500" />
              <h2 className="text-2xl font-bold text-earthfire-brick-700">
                Forms Submitted Successfully!
              </h2>
              <p className="text-earthfire-brown-600">
                Your complete patient information has been submitted. Thank you for providing all the necessary details.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="border-earthfire-brown-200 text-earthfire-brown-700 hover:bg-earthfire-clay-100 hover:text-earthfire-brown-800"
                >
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

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Please log in to access the form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <div className="mb-6 flex items-center justify-between">
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <UnifiedPatientForm
          userId={userId}
          onComplete={handleFormComplete}
          onBack={onBack}
        />
      </div>
    </div>
  );
} 
