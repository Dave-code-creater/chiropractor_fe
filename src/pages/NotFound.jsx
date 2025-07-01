import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            404 - Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">
              The page{" "}
              <span className="font-mono bg-muted px-2 py-1 rounded">
                {location.pathname}
              </span>
            </p>
            <p>is currently under development or doesn't exist.</p>
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
              onClick={() => navigate("/")}
              className="w-full"
            >
              Return to Home
            </Button>
          </div>

          <div className="mt-6 text-sm text-center text-muted-foreground">
            <p>If you believe this is an error, please contact support.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
