import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Bell,
  BellRing,
  Mail,
  MessageSquare,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Settings,
  Clock,
  User,
  FileText,
  Heart,
  Phone,
  Shield,
} from "lucide-react";

const NotificationSystem = ({ userId, userRole }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    appointmentReminders: true,
    systemAlerts: true,
    marketingEmails: false,
    criticalAlerts: true,
    weeklyReports: true,
  });

  // Sample notifications data
  const [sampleNotifications] = useState([
    {
      id: 1,
      type: "appointment",
      title: "Appointment Reminder",
      message: "You have an appointment with Dr. Smith tomorrow at 2:00 PM",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      priority: "high",
      actionRequired: true,
      icon: Calendar,
      color: "blue",
    },
    {
      id: 2,
      type: "system",
      title: "System Maintenance",
      message: "Scheduled maintenance will occur tonight from 11 PM - 1 AM",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: false,
      priority: "medium",
      actionRequired: false,
      icon: Settings,
      color: "yellow",
    },
    {
      id: 3,
      type: "clinical",
      title: "Lab Results Available",
      message:
        "Your recent lab results are now available in your patient portal",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      read: true,
      priority: "high",
      actionRequired: true,
      icon: FileText,
      color: "green",
    },
    {
      id: 4,
      type: "message",
      title: "New Message",
      message:
        "Dr. Johnson has sent you a message regarding your treatment plan",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      read: true,
      priority: "medium",
      actionRequired: true,
      icon: MessageSquare,
      color: "purple",
    },
    {
      id: 5,
      type: "alert",
      title: "Payment Due",
      message: "Your payment for the last appointment is due in 3 days",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: false,
      priority: "high",
      actionRequired: true,
      icon: AlertTriangle,
      color: "red",
    },
    {
      id: 6,
      type: "success",
      title: "Appointment Confirmed",
      message: "Your appointment for next Tuesday has been confirmed",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      read: true,
      priority: "low",
      actionRequired: false,
      icon: CheckCircle,
      color: "green",
    },
  ]);

  // Initialize notifications
  useEffect(() => {
    setNotifications(sampleNotifications);
    setUnreadCount(sampleNotifications.filter((n) => !n.read).length);
  }, [sampleNotifications]);

  // Real-time notification simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate receiving new notifications
      if (Math.random() > 0.8) {
        const newNotification = {
          id: Date.now(),
          type: ["appointment", "system", "message", "alert"][
            Math.floor(Math.random() * 4)
          ],
          title: "New Notification",
          message: "This is a real-time notification for testing",
          timestamp: new Date(),
          read: false,
          priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
          actionRequired: Math.random() > 0.5,
          icon: Bell,
          color: "blue",
        };

        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // Show toast notification
        toast.success("New notification received!", {
          description: newNotification.message,
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const markAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
    setUnreadCount(0);
  }, []);

  const deleteNotification = useCallback(
    (notificationId) => {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      const notification = notifications.find((n) => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    },
    [notifications],
  );

  const updateSettings = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    toast.success("Notification settings updated");
  }, []);

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "appointment":
        return Calendar;
      case "system":
        return Settings;
      case "clinical":
        return FileText;
      case "message":
        return MessageSquare;
      case "alert":
        return AlertTriangle;
      case "success":
        return CheckCircle;
      default:
        return Bell;
    }
  };

  const NotificationItem = ({ notification }) => {
    const IconComponent = notification.icon || getTypeIcon(notification.type);

    return (
      <div
        className={`p-4 border-l-4 ${
          notification.read
            ? "bg-gray-50 border-gray-200"
            : "bg-white border-blue-500"
        } hover:bg-gray-50 transition-colors cursor-pointer`}
        onClick={() => !notification.read && markAsRead(notification.id)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div
              className={`p-2 rounded-full ${
                notification.read ? "bg-gray-200" : "bg-blue-100"
              }`}
            >
              <IconComponent
                className={`h-4 w-4 ${
                  notification.read ? "text-gray-500" : "text-blue-600"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4
                  className={`text-sm font-medium ${
                    notification.read ? "text-gray-700" : "text-gray-900"
                  }`}
                >
                  {notification.title}
                </h4>
                <Badge
                  variant={getPriorityColor(notification.priority)}
                  size="sm"
                >
                  {notification.priority}
                </Badge>
                {notification.actionRequired && (
                  <Badge variant="outline" size="sm">
                    Action Required
                  </Badge>
                )}
              </div>
              <p
                className={`text-sm mt-1 ${
                  notification.read ? "text-gray-500" : "text-gray-600"
                }`}
              >
                {notification.message}
              </p>
              <div className="flex items-center mt-2 text-xs text-gray-400">
                <Clock className="h-3 w-3 mr-1" />
                {formatTimestamp(notification.timestamp)}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                deleteNotification(notification.id);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const filteredNotifications = {
    all: notifications,
    unread: notifications.filter((n) => !n.read),
    appointments: notifications.filter((n) => n.type === "appointment"),
    system: notifications.filter((n) => n.type === "system"),
    clinical: notifications.filter((n) => n.type === "clinical"),
    messages: notifications.filter((n) => n.type === "message"),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <BellRing className="h-8 w-8 text-blue-600" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
            <p className="text-sm text-gray-500">
              {unreadCount} unread of {notifications.length} total
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark All Read
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all" className="relative">
            All
            {notifications.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                {notifications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread" className="relative">
            Unread
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="clinical">Clinical</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        {Object.entries(filteredNotifications).map(
          ([key, notificationList]) => (
            <TabsContent key={key} value={key}>
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">
                    {key} Notifications
                  </CardTitle>
                  <CardDescription>
                    {notificationList.length} notification
                    {notificationList.length !== 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[600px]">
                    {notificationList.length > 0 ? (
                      <div className="divide-y">
                        {notificationList.map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No notifications in this category</p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          ),
        )}
      </Tabs>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Customize how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Delivery Methods</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Email Notifications</span>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      updateSettings("emailNotifications", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">SMS Notifications</span>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) =>
                      updateSettings("smsNotifications", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Push Notifications</span>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) =>
                      updateSettings("pushNotifications", checked)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Notification Types</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Appointment Reminders</span>
                  </div>
                  <Switch
                    checked={settings.appointmentReminders}
                    onCheckedChange={(checked) =>
                      updateSettings("appointmentReminders", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">System Alerts</span>
                  </div>
                  <Switch
                    checked={settings.systemAlerts}
                    onCheckedChange={(checked) =>
                      updateSettings("systemAlerts", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Critical Alerts</span>
                  </div>
                  <Switch
                    checked={settings.criticalAlerts}
                    onCheckedChange={(checked) =>
                      updateSettings("criticalAlerts", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Weekly Reports</span>
                  </div>
                  <Switch
                    checked={settings.weeklyReports}
                    onCheckedChange={(checked) =>
                      updateSettings("weeklyReports", checked)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">
                Marketing Communications
              </h4>
              <p className="text-sm text-gray-500">
                Receive updates about new features and health tips
              </p>
            </div>
            <Switch
              checked={settings.marketingEmails}
              onCheckedChange={(checked) =>
                updateSettings("marketingEmails", checked)
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSystem;
