# Enhanced Notification System - Migration Guide

## Overview
The notification system has been completely overhauled to provide better user experience, contextual information, and actionable feedback.

## What's New

### 1. Enhanced Toast Messages
- **Contextual descriptions** - Messages now include helpful context
- **Action buttons** - Users can take immediate action from notifications
- **Better error handling** - More specific error messages with guidance
- **Improved styling** - Better visual hierarchy and theming
- **Loading states** - Progress feedback for async operations

### 2. Notification Center
- **Centralized notifications** - All notifications in one place
- **Filtering and categorization** - Easy to find specific notifications
- **Action buttons** - Take action directly from notifications
- **Read/unread states** - Clear visual indicators
- **Priority levels** - Critical, high, medium, low priorities

### 3. Smart Notification Bell
- **Real-time updates** - Live notification count
- **Visual indicators** - Animations for new notifications
- **Contextual popover** - Quick access to recent notifications

## Migration Steps

### Step 1: Replace Basic Toast Imports

**Before:**
```javascript
import { toast } from "sonner";

toast.error("Failed to save");
toast.success("Saved successfully");
```

**After:**
```javascript
import { enhancedToast } from "@/components/notifications/SimpleToast";

enhancedToast.error(
  "Failed to save your data",
  {
    description: "There was a problem connecting to the server",
    action: retryFunction,
    actionLabel: "Try Again"
  }
);

enhancedToast.success(
  "Data saved successfully",
  {
    description: "Your information has been securely stored",
    action: {
      label: "View Details",
      onClick: () => navigate('/details')
    }
  }
);
```

### Step 2: Use Context-Specific Notifications

**Appointments:**
```javascript
enhancedToast.appointment.scheduled({
  date: "Tomorrow",
  time: "2:00 PM", 
  doctor: "Dr. Smith",
  id: "apt_123"
});
```

**Form Validation:**
```javascript
enhancedToast.validation.invalid("Email", "Please enter a valid email address");
```

**File Operations:**
```javascript
enhancedToast.file.uploaded("medical-records.pdf");
```

### Step 3: Add NotificationProvider to Layouts

```javascript
import NotificationProvider from "@/components/notifications/NotificationProvider";

const Layout = () => {
  return (
    <NotificationProvider>
      {/* Your existing layout */}
      <Toaster />
    </NotificationProvider>
  );
};
```

### Step 4: Replace Notification Bell

```javascript
import NotificationBell from "@/components/notifications/NotificationBell";

// In your header/navbar
<NotificationBell 
  userId={userId} 
  userRole={userRole} 
  variant="ghost" 
  size="icon" 
/>
```

## New Features

### 1. Network Status Monitoring
```javascript
// Automatically shows offline/online notifications
import { useNotifications } from "@/components/notifications/NotificationProvider";

const { isOnline } = useNotifications();
```

### 2. API Error Handling
```javascript
const { handleApiError, handleApiSuccess } = useNotifications();

try {
  const result = await apiCall();
  handleApiSuccess("Operation completed successfully");
} catch (error) {
  handleApiError(error, {
    operation: "Data synchronization",
    retryAction: () => retryFunction()
  });
}
```

### 3. Form Validation Helpers
```javascript
const { validateField, showValidationError } = useNotifications();

const validation = validateField(email, {
  required: true,
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
});

if (!validation.isValid) {
  showValidationError("Email", validation);
}
```

### 4. Permission Requests
```javascript
const { requestPermission } = useNotifications();

const hasPermission = await requestPermission('notifications');
```

## Best Practices

### 1. Use Specific Message Types
```javascript
// ❌ Generic
toast.error("Error occurred");

// ✅ Specific
enhancedToast.error(
  "Failed to upload medical document",
  {
    description: "The file size exceeds the 10MB limit",
    action: () => showFileSizeInfo(),
    actionLabel: "Learn More"
  }
);
```

### 2. Provide Actionable Feedback
```javascript
// ❌ No action
toast.success("Profile updated");

// ✅ With action
enhancedToast.success(
  "Profile updated successfully",
  {
    description: "Your changes are now visible to your healthcare providers",
    action: {
      label: "View Profile",
      onClick: () => navigate('/profile')
    }
  }
);
```

### 3. Use Loading States
```javascript
// ❌ No feedback during operation
const result = await saveData();

// ✅ With loading feedback
enhancedToast.loading(
  "Saving your medical records...",
  saveData(),
  {
    successMessage: "Medical records saved successfully",
    errorMessage: "Failed to save medical records"
  }
);
```

### 4. Handle Network Errors Gracefully
```javascript
// ❌ Generic network error
toast.error("Network error");

// ✅ Helpful network guidance
enhancedToast.error(
  "Connection problem",
  {
    description: "Please check your internet connection and try again",
    action: retryFunction,
    actionLabel: "Retry"
  }
);
```

## File Structure

```
src/components/notifications/
├── EnhancedToast.jsx          # Enhanced toast utilities
├── NotificationCenter.jsx     # Centralized notification UI
├── NotificationBell.jsx       # Header notification bell
├── NotificationProvider.jsx   # Context provider
├── NotificationExamples.js    # Usage examples
└── README.md                  # This file
```

## Components API

### EnhancedToast
- `success(message, options)`
- `error(message, options)`
- `warning(message, options)`
- `info(message, options)`
- `loading(message, promise, options)`
- Context-specific: `appointment.*`, `chat.*`, `file.*`, etc.

### NotificationCenter
- Centralized notification management
- Filtering and search
- Action handling
- Read/unread states

### NotificationBell
- Real-time notification count
- Visual indicators
- Click to open NotificationCenter

### NotificationProvider
- Network status monitoring
- API error handling
- Form validation helpers
- Permission management

## Testing
- All components include proper accessibility
- Toast notifications work with screen readers
- Keyboard navigation supported
- Dark/light theme compatible

## Performance
- Notifications are optimized for performance
- Automatic cleanup of old notifications
- Debounced API calls
- Minimal re-renders
