// Examples of improved notification patterns for the Chiropractor app

import { enhancedToast } from '@/components/notifications/SimpleToast';

// ===== BEFORE & AFTER EXAMPLES =====

// 1. BASIC ERROR HANDLING
// Before: Basic error message
const oldErrorHandling = () => {
    toast.error("Failed to update schedule");
};

// After: Enhanced error with context and action
const newErrorHandling = (retryAction) => {
    enhancedToast.error(
        "Failed to update your schedule",
        {
            description: "There was a problem saving your availability. Your changes have not been saved.",
            action: retryAction,
            actionLabel: "Try Again",
            duration: 6000
        }
    );
};

// 2. APPOINTMENT MANAGEMENT
// Before: Generic success
const oldAppointmentSuccess = () => {
    toast.success("Appointment scheduled");
};

// After: Contextual success with details
const newAppointmentSuccess = (appointmentData) => {
    enhancedToast.appointment.scheduled({
        date: "Tomorrow",
        time: "2:00 PM",
        doctor: "Dr. Smith",
        id: "apt_123"
    });
};

// 3. FORM VALIDATION
// Before: Basic validation error
const oldValidation = () => {
    toast.error("Please fill in required fields");
};

// After: Specific field validation
const newValidation = (fieldName, requirement) => {
    enhancedToast.validation.invalid("Email address", "Please enter a valid email format");
};

// 4. FILE OPERATIONS
// Before: Basic success
const oldFileUpload = () => {
    toast.success("File uploaded");
};

// After: Enhanced with actions
const newFileUpload = (fileName) => {
    enhancedToast.file.uploaded(fileName);
    // Automatically shows "View" action button
};

// 5. LOADING OPERATIONS
// Before: No loading feedback
const oldAsyncOperation = async () => {
    const result = await api.saveData();
    if (result.success) {
        toast.success("Data saved");
    } else {
        toast.error("Failed to save");
    }
};

// After: Comprehensive loading feedback
const newAsyncOperation = async () => {
    const promise = api.saveData();

    enhancedToast.loading(
        "Saving your medical records...",
        promise,
        {
            successMessage: "Medical records saved successfully",
            errorMessage: "Failed to save medical records",
            retryAction: () => newAsyncOperation()
        }
    );
};

// ===== PRACTICAL IMPLEMENTATIONS =====

// Chat message handling
export const handleChatNotifications = {
    newMessage: (senderName, messagePreview) => {
        enhancedToast.chat.newMessage(senderName, messagePreview);
    },

    messageFailed: (retryAction) => {
        enhancedToast.error(
            "Message failed to send",
            {
                description: "Check your connection and try again",
                action: retryAction,
                actionLabel: "Resend"
            }
        );
    }
};

// Appointment notifications
export const handleAppointmentNotifications = {
    scheduled: (appointmentData) => {
        enhancedToast.appointment.scheduled(appointmentData);
    },

    cancelled: (reason) => {
        enhancedToast.appointment.cancelled(reason);
    },

    reminder: (appointmentData) => {
        enhancedToast.appointment.reminder(appointmentData);
    },

    rescheduled: (oldTime, newTime) => {
        enhancedToast.success(
            "Appointment rescheduled",
            {
                description: `Moved from ${oldTime} to ${newTime}`,
                action: {
                    label: "View Calendar",
                    onClick: () => window.location.href = '/appointments'
                }
            }
        );
    }
};

// Medical record notifications
export const handleMedicalRecordNotifications = {
    saved: (recordType) => {
        enhancedToast.success(
            `${recordType} saved successfully`,
            {
                description: "Your information has been securely stored",
                action: {
                    label: "View Records",
                    onClick: () => window.location.href = '/profile'
                }
            }
        );
    },

    validationError: (field, message) => {
        enhancedToast.validation.invalid(field, message);
    },

    uploadProgress: (filename, promise) => {
        enhancedToast.loading(
            `Uploading ${filename}...`,
            promise,
            {
                successMessage: "Medical document uploaded successfully",
                errorMessage: "Failed to upload document"
            }
        );
    }
};

// System notifications
export const handleSystemNotifications = {
    maintenance: (timeframe) => {
        enhancedToast.system.maintenance(timeframe);
    },

    sessionExpiring: () => {
        enhancedToast.warning(
            "Your session will expire soon",
            {
                description: "Please save your work and refresh the page",
                duration: 10000,
                action: {
                    label: "Refresh Now",
                    onClick: () => window.location.reload()
                }
            }
        );
    },

    backupComplete: () => {
        enhancedToast.success(
            "Data backup completed",
            {
                description: "Your medical records have been securely backed up",
                icon: <Shield className="h-5 w-5 text-green-600" />
            }
        );
    }
};

// Network status
export const handleNetworkNotifications = {
    offline: () => {
        enhancedToast.network.offline();
    },

    online: () => {
        enhancedToast.network.online();
    },

    slowConnection: () => {
        enhancedToast.warning(
            "Slow internet connection detected",
            {
                description: "Some features may load slowly",
                duration: 5000
            }
        );
    }
};

// Permission requests
export const handlePermissionNotifications = {
    locationNeeded: () => {
        enhancedToast.info(
            "Location access required",
            {
                description: "We need your location to find nearby clinics",
                action: {
                    label: "Enable Location",
                    onClick: () => navigator.geolocation.getCurrentPosition(() => {
                        enhancedToast.success("Location access granted");
                    })
                }
            }
        );
    },

    notificationsNeeded: () => {
        enhancedToast.info(
            "Enable notifications",
            {
                description: "Get appointment reminders and important updates",
                action: {
                    label: "Enable",
                    onClick: async () => {
                        const permission = await Notification.requestPermission();
                        if (permission === 'granted') {
                            enhancedToast.success("Notifications enabled");
                        }
                    }
                }
            }
        );
    }
};

// Export all handlers
export const notificationHandlers = {
    chat: handleChatNotifications,
    appointments: handleAppointmentNotifications,
    medicalRecords: handleMedicalRecordNotifications,
    system: handleSystemNotifications,
    network: handleNetworkNotifications,
    permissions: handlePermissionNotifications
};
