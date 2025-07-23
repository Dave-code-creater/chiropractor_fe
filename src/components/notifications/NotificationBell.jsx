import React, { useState, useEffect } from 'react';
import { Bell, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NotificationCenter from './NotificationCenter';
import { cn } from '@/lib/utils';

const NotificationBell = ({
    userId,
    userRole,
    className = "",
    variant = "ghost",
    size = "sm"
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [hasNewNotification, setHasNewNotification] = useState(false);

    // Mock unread count - replace with real API
    useEffect(() => {
        // Simulate real-time updates
        const interval = setInterval(() => {
            // Random chance of new notification for demo
            if (Math.random() > 0.9) {
                setUnreadCount(prev => prev + 1);
                setHasNewNotification(true);

                // Reset animation after 2 seconds
                setTimeout(() => setHasNewNotification(false), 2000);
            }
        }, 10000);

        // Initial load
        setUnreadCount(3); // Mock initial count

        return () => clearInterval(interval);
    }, []);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        // Mark as viewed when opened
        if (!isOpen && hasNewNotification) {
            setHasNewNotification(false);
        }
    };

    return (
        <>
            <Button
                variant={variant}
                size={size}
                onClick={handleToggle}
                className={cn(
                    "relative",
                    hasNewNotification && "animate-pulse",
                    className
                )}
                aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
            >
                {hasNewNotification ? (
                    <BellRing className={cn(
                        "h-5 w-5",
                        hasNewNotification && "text-blue-600"
                    )} />
                ) : (
                    <Bell className="h-5 w-5" />
                )}

                {unreadCount > 0 && (
                    <Badge
                        variant="destructive"
                        className={cn(
                            "absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs font-medium",
                            hasNewNotification && "animate-bounce"
                        )}
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                )}
            </Button>

            <NotificationCenter
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                userId={userId}
                userRole={userRole}
            />
        </>
    );
};

export default NotificationBell;
