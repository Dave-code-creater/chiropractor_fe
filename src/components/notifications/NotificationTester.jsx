import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { enhancedToast } from '@/components/notifications/EnhancedToast';

// Component to test notification visibility
export default function NotificationTester() {
    const testNotifications = () => {
        // Test different notification types with 2-second delays
        setTimeout(() => {
            enhancedToast.success("Test Success", {
                description: "This is a success notification with solid background"
            });
        }, 500);

        setTimeout(() => {
            enhancedToast.error("Test Error", {
                description: "This is an error notification with solid red background",
                action: () => alert("Retry clicked!"),
                actionLabel: "Retry"
            });
        }, 2000);

        setTimeout(() => {
            enhancedToast.warning("Test Warning", {
                description: "This is a warning notification with solid yellow background"
            });
        }, 3500);

        setTimeout(() => {
            enhancedToast.info("Test Info", {
                description: "This is an info notification with solid blue background"
            });
        }, 5000);

        setTimeout(() => {
            enhancedToast.appointment.scheduled({
                doctor: "Dr. Smith",
                date: "Tomorrow at 2:00 PM"
            });
        }, 6500);
    };

    return (
        <Card className="max-w-md mx-auto mt-8">
            <CardHeader>
                <CardTitle>Notification Visibility Test</CardTitle>
            </CardHeader>
            <CardContent>
                <Button
                    onClick={testNotifications}
                    className="w-full"
                >
                    Test Enhanced Notifications
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                    This will show multiple notifications with solid backgrounds for better visibility
                </p>
            </CardContent>
        </Card>
    );
}
