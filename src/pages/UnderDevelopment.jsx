import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

const UnderDevelopment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CalendarDays className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Coming Soon!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">
              The feature at <span className="font-mono bg-muted px-2 py-1 rounded">{location.pathname}</span>
            </p>
            <p>is currently under development and will be available soon.</p>
          </div>
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">What to expect:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Enhanced user experience</li>
              <li>New features and functionality</li>
              <li>Improved performance</li>
              <li>Better integration with existing services</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2 mt-6">
            <Button 
              variant="default" 
              onClick={() => navigate(-1)}
              className="w-full"
            >
              Go Back
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Return to Home
            </Button>
          </div>

          <div className="mt-6 text-sm text-center text-muted-foreground">
            <p>Thank you for your patience while we improve your experience.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnderDevelopment; 