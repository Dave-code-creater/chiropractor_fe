// Enhanced Notification System Exports
export { default as enhancedToast } from './SimpleToast';
export { default as NotificationCenter } from './NotificationCenter';
export { default as NotificationBell } from './NotificationBell';
export { default as NotificationProvider, useNotifications } from './NotificationProvider';
export { notificationHandlers } from './NotificationExamples';

// Utility functions
// SimpleToast doesn't export these functions, so removing them
// export { dismissAllToasts, dismissToast } from './SimpleToast';
