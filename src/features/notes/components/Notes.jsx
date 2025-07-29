import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";

// Import role-specific components
import DoctorNotes from "./doctor/DoctorNotes";
import DoctorNotesRevamped from "./doctor/DoctorNotesRevamped";
import DoctorInitialReportsView from "./DoctorInitialReportsView";
import PatientNotesView from "./PatientNotesView";

const Notes = () => {
  const auth = useSelector((state) => state.auth);
  const [activeView, setActiveView] = useState("notes");

  // Create user object from auth state
  const user = {
    id: auth.userID,
    role: auth.role,
    email: auth.email,
    username: auth.username,
    firstName: auth.profile?.firstName || auth.username, // fallback to username if firstName not available
    lastName: auth.profile?.lastName || '',
    profile: auth.profile
  };

  // If user is not loaded yet, show loading
  if (!user) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Loading...</h3>
          <p className="text-muted-foreground">
            Please wait while we load your profile.
          </p>
        </CardContent>
      </Card>
    );
  }

  // For admin demo purposes
  if (user?.role === "admin") {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Admin Notes Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">234</div>
                  <div className="text-sm text-muted-foreground">Total Notes</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">45</div>
                  <div className="text-sm text-muted-foreground">This Month</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-muted-foreground">Pending Review</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeView} onValueChange={setActiveView}>
          <TabsList>
            <TabsTrigger value="notes">All Notes</TabsTrigger>
            <TabsTrigger value="initial-reports">Initial Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="space-y-4">
            <DoctorNotes />
          </TabsContent>

          <TabsContent value="initial-reports" className="space-y-4">
            <DoctorInitialReportsView />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Doctor view
  if (user?.role === "doctor") {
    return <DoctorNotesRevamped doctorId={user.id} />;
  }

  // Patient view - make role check more robust
  if (user?.role === "patient" || user?.role?.toLowerCase() === "patient") {
    return <PatientNotesView />;
  }

  // If user exists but doesn't match any role, show restricted access
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
        <p className="text-muted-foreground">
          Please contact your administrator for access to clinical notes.
        </p>
      </CardContent>
    </Card>
  );
};

export default Notes;
