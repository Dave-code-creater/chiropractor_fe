import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    Bell,
    BellRing,
    X,
    Check,
    CheckCheck,
    Calendar,
    MessageSquare,
    Shield,
    Clock,
    AlertTriangle,
    Info,
    Settings,
    Filter,
    Archive,
    Star,
    Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NOTIFICATION_TYPES = {
    APPOINTMENT: 'appointment',
    MESSAGE: 'message',
    SYSTEM: 'system',
    SECURITY: 'security',
    REMINDER: 'reminder',
    UPDATE: 'update'
};

const PRIORITY_LEVELS = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
};

const NotificationCenter = ({
    isOpen,
    onClose,
    userId,
    className = "",
    maxHeight = "h-[600px]"
}) => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all');
    const [unreadCount, setUnreadCount] = useState(0);

    // Sample notifications - replace with real API data
    const sampleNotifications = [
        {
            id: 1,
            type: NOTIFICATION_TYPES.APPOINTMENT,
            title: 'Appointment Reminder',
            message: 'Your appointment with Dr. Smith is tomorrow at 2:00 PM',
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            read: false,
            priority: PRIORITY_LEVELS.HIGH,
            actions: [
                { label: 'Confirm', action: 'confirm', variant: 'default' },
                { label: 'Reschedule', action: 'reschedule', variant: 'outline' }
            ]
        },
        {
            id: 2,
            type: NOTIFICATION_TYPES.MESSAGE,
            title: 'New Message from Dr. Johnson',
            message: 'Your lab results are ready for review',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            read: false,
            priority: PRIORITY_LEVELS.MEDIUM,
            actions: [
                { label: 'View Message', action: 'view_message', variant: 'default' }
            ]
        },
        {
            id: 3,
            type: NOTIFICATION_TYPES.SYSTEM,
            title: 'System Maintenance',
            message: 'Scheduled maintenance tonight from 11 PM - 1 AM',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
            read: true,
            priority: PRIORITY_LEVELS.MEDIUM,
            actions: [
                { label: 'Learn More', action: 'learn_more', variant: 'outline' }
            ]
        },
        {
            id: 4,
            type: NOTIFICATION_TYPES.SECURITY,
            title: 'New Device Login',
            message: 'Someone signed in from Chrome on Windows',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
            read: true,
            priority: PRIORITY_LEVELS.HIGH,
            actions: [
                { label: 'Review', action: 'review_security', variant: 'default' },
                { label: 'Secure Account', action: 'secure', variant: 'outline' }
            ]
        }
    ];

    useEffect(() => {
        setNotifications(sampleNotifications);
        setUnreadCount(sampleNotifications.filter(n => !n.read).length);
    }, []);

    const getNotificationIcon = (type) => {
        switch (type) {
            case NOTIFICATION_TYPES.APPOINTMENT:
                return Calendar;
            case NOTIFICATION_TYPES.MESSAGE:
                return MessageSquare;
            case NOTIFICATION_TYPES.SYSTEM:
                return Settings;
            case NOTIFICATION_TYPES.SECURITY:
                return Shield;
            case NOTIFICATION_TYPES.REMINDER:
                return Bell;
            default:
                return Info;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case PRIORITY_LEVELS.CRITICAL:
                return 'border-red-500 bg-red-50';
            case PRIORITY_LEVELS.HIGH:
                return 'border-orange-500 bg-orange-50';
            case PRIORITY_LEVELS.MEDIUM:
                return 'border-blue-500 bg-blue-50';
            default:
                return 'border-gray-200 bg-gray-50';
        }
    };

    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const markAsRead = useCallback((notificationId) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === notificationId
                    ? { ...notification, read: true }
                    : notification
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
    }, []);

    const deleteNotification = useCallback((notificationId) => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        const notification = notifications.find(n => n.id === notificationId);
        if (notification && !notification.read) {
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    }, [notifications]);

    const handleAction = (notification, action) => {
        console.log(`Action ${action.action} for notification ${notification.id}`);

        // Mark as read when action is taken
        if (!notification.read) {
            markAsRead(notification.id);
        }

        // Handle specific actions
        switch (action.action) {
            case 'confirm':
                // Confirm appointment logic
                break;
            case 'reschedule':
                // Reschedule appointment logic
                break;
            case 'view_message':
                // Navigate to messages
                break;
            case 'learn_more':
                // Open maintenance info
                break;
            case 'review_security':
                // Navigate to security settings
                break;
            default:
                break;
        }
    };

    const filteredNotifications = filter === 'all'
        ? notifications
        : filter === 'unread'
            ? notifications.filter(n => !n.read)
            : notifications.filter(n => n.type === filter);

    const NotificationItem = ({ notification }) => {
        const IconComponent = getNotificationIcon(notification.type);

        return (
            <div
                className={cn(
                    "p-4 border-l-4 transition-all duration-200 hover:bg-gray-50",
                    notification.read
                        ? "bg-white border-gray-200"
                        : getPriorityColor(notification.priority)
                )}
            >
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={cn(
                        "p-2 rounded-full flex-shrink-0",
                        notification.read ? "bg-gray-100" : "bg-white"
                    )}>
                        <IconComponent className={cn(
                            "h-4 w-4",
                            notification.read ? "text-gray-500" : "text-blue-600"
                        )} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className={cn(
                                        "text-sm font-medium truncate",
                                        notification.read ? "text-gray-700" : "text-gray-900"
                                    )}>
                                        {notification.title}
                                    </h4>
                                    {notification.priority === PRIORITY_LEVELS.CRITICAL && (
                                        <Badge variant="destructive" className="h-5 text-xs">
                                            Critical
                                        </Badge>
                                    )}
                                    {notification.priority === PRIORITY_LEVELS.HIGH && (
                                        <Badge variant="default" className="h-5 text-xs bg-orange-500">
                                            High
                                        </Badge>
                                    )}
                                    {!notification.read && (
                                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                                    )}
                                </div>

                                <p className={cn(
                                    "text-sm",
                                    notification.read ? "text-gray-500" : "text-gray-600"
                                )}>
                                    {notification.message}
                                </p>

                                <div className="flex items-center gap-1 mt-2">
                                    <Clock className="h-3 w-3 text-gray-400" />
                                    <span className="text-xs text-gray-400">
                                        {formatTimestamp(notification.timestamp)}
                                    </span>
                                </div>

                                {/* Actions */}
                                {notification.actions && notification.actions.length > 0 && (
                                    <div className="flex gap-2 mt-3">
                                        {notification.actions.map((action, index) => (
                                            <Button
                                                key={index}
                                                size="sm"
                                                variant={action.variant || "outline"}
                                                onClick={() => handleAction(notification, action)}
                                                className="text-xs h-7"
                                            >
                                                {action.label}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Delete button */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="p-1 h-6 w-6 text-gray-400 hover:text-red-500"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/20" onClick={onClose}>
            <div
                className={cn(
                    "absolute right-4 top-16 bg-white border border-gray-200 rounded-lg shadow-xl w-[420px]",
                    maxHeight,
                    className
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <BellRing className="h-6 w-6 text-blue-600" />
                                {unreadCount > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                                    >
                                        {unreadCount}
                                    </Badge>
                                )}
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                                <p className="text-sm text-gray-500">
                                    {unreadCount} unread of {notifications.length} total
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="p-2 h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={markAllAsRead}
                            disabled={unreadCount === 0}
                            className="text-xs"
                        >
                            <CheckCheck className="h-3 w-3 mr-1" />
                            Mark All Read
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="p-3 border-b border-gray-100">
                    <div className="flex gap-1 overflow-x-auto">
                        {[
                            { key: 'all', label: 'All', count: notifications.length },
                            { key: 'unread', label: 'Unread', count: unreadCount },
                            { key: NOTIFICATION_TYPES.APPOINTMENT, label: 'Appointments', count: notifications.filter(n => n.type === NOTIFICATION_TYPES.APPOINTMENT).length },
                            { key: NOTIFICATION_TYPES.MESSAGE, label: 'Messages', count: notifications.filter(n => n.type === NOTIFICATION_TYPES.MESSAGE).length },
                            { key: NOTIFICATION_TYPES.SYSTEM, label: 'System', count: notifications.filter(n => n.type === NOTIFICATION_TYPES.SYSTEM).length }
                        ].map((filterOption) => (
                            <Button
                                key={filterOption.key}
                                variant={filter === filterOption.key ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setFilter(filterOption.key)}
                                className="text-xs whitespace-nowrap"
                            >
                                {filterOption.label}
                                {filterOption.count > 0 && (
                                    <Badge
                                        variant="secondary"
                                        className="ml-1 h-4 px-1 text-xs"
                                    >
                                        {filterOption.count}
                                    </Badge>
                                )}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Notifications List */}
                <ScrollArea className="flex-1">
                    {filteredNotifications.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {filteredNotifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No notifications</p>
                            <p className="text-sm text-gray-400">
                                {filter === 'all'
                                    ? "You're all caught up!"
                                    : `No ${filter === 'unread' ? 'unread' : filter} notifications`
                                }
                            </p>
                        </div>
                    )}
                </ScrollArea>

                {/* Footer */}
                <div className="p-3 border-t border-gray-100">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs text-gray-600"
                        onClick={() => {
                            // Navigate to full notifications page
                            console.log('Navigate to notification settings');
                        }}
                    >
                        <Settings className="h-3 w-3 mr-2" />
                        Notification Settings
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotificationCenter;
