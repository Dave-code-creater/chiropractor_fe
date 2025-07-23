import React, { createContext, useContext, useState, useEffect } from 'react';
import { enhancedToast } from './SimpleToast';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [notifications, setNotifications] = useState([]);

    // Network status monitoring
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            enhancedToast.success("Connection restored", "You're back online");
        };

        const handleOffline = () => {
            setIsOnline(false);
            enhancedToast.warning("No internet", "Please check your connection");
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Error boundary for API calls
    const handleApiError = (error, options = {}) => {
        console.error('API Error:', error);

        const {
            showToast = true,
            retryAction,
            customMessage,
            operation = 'Operation'
        } = options;

        if (!showToast) return;

        // Network errors
        if (!isOnline || error.name === 'NetworkError') {
            enhancedToast.network.offline();
            return;
        }

        // Server errors
        if (error.status >= 500) {
            enhancedToast.error(
                customMessage || `${operation} failed due to server error`,
                {
                    description: 'Our servers are experiencing issues. Please try again later.',
                    action: retryAction,
                    actionLabel: 'Retry'
                }
            );
            return;
        }

        // Client errors
        if (error.status >= 400 && error.status < 500) {
            const message = error.data?.message || error.message || 'Request failed';

            if (error.status === 401) {
                enhancedToast.error(
                    'Authentication required',
                    {
                        description: 'Please sign in to continue',
                        action: () => {
                            window.location.href = '/login';
                        },
                        actionLabel: 'Sign In'
                    }
                );
                return;
            }

            if (error.status === 403) {
                enhancedToast.error(
                    'Access denied',
                    {
                        description: 'You don\'t have permission to perform this action',
                        showSupport: false
                    }
                );
                return;
            }

            if (error.status === 404) {
                enhancedToast.error(
                    'Resource not found',
                    {
                        description: 'The requested resource could not be found',
                        showSupport: false
                    }
                );
                return;
            }

            enhancedToast.error(
                customMessage || `${operation} failed`,
                {
                    description: message,
                    action: retryAction,
                    actionLabel: 'Retry'
                }
            );
            return;
        }

        // Generic error
        enhancedToast.error(
            customMessage || `${operation} failed`,
            {
                description: 'An unexpected error occurred. Please try again.',
                action: retryAction,
                actionLabel: 'Retry'
            }
        );
    };

    // Success handler for API calls
    const handleApiSuccess = (message, options = {}) => {
        const {
            showToast = true,
            data,
            operation = 'Operation',
            action
        } = options;

        if (!showToast) return;

        enhancedToast.success(
            message || `${operation} completed successfully`,
            {
                action: action ? {
                    label: action.label,
                    onClick: action.onClick
                } : undefined
            }
        );
    };

    // Form validation helpers
    const validateField = (value, rules = {}) => {
        const { required, minLength, pattern, custom } = rules;

        if (required && (!value || value.toString().trim() === '')) {
            return { isValid: false, message: 'This field is required' };
        }

        if (minLength && value.length < minLength) {
            return {
                isValid: false,
                message: `Must be at least ${minLength} characters`
            };
        }

        if (pattern && !pattern.test(value)) {
            return {
                isValid: false,
                message: 'Please enter a valid format'
            };
        }

        if (custom && typeof custom === 'function') {
            const result = custom(value);
            if (result !== true) {
                return {
                    isValid: false,
                    message: result || 'Invalid value'
                };
            }
        }

        return { isValid: true };
    };

    const showValidationError = (fieldName, validation) => {
        enhancedToast.validation.invalid(fieldName, validation.message);
    };

    // Permission helpers
    const checkPermission = async (permission) => {
        if (!navigator.permissions) {
            return 'unsupported';
        }

        try {
            const result = await navigator.permissions.query({ name: permission });
            return result.state;
        } catch (error) {
            return 'unsupported';
        }
    };

    const requestPermission = async (permission) => {
        const status = await checkPermission(permission);

        if (status === 'denied') {
            enhancedToast.permission.denied(permission);
            return false;
        }

        if (status === 'granted') {
            return true;
        }

        // For permissions that require explicit request
        if (permission === 'notifications' && 'Notification' in window) {
            const result = await Notification.requestPermission();
            if (result === 'denied') {
                enhancedToast.permission.denied('Notification');
                return false;
            }
            return result === 'granted';
        }

        return true;
    };

    // Browser notification
    const showBrowserNotification = async (title, options = {}) => {
        const hasPermission = await requestPermission('notifications');

        if (!hasPermission) return;

        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(title, {
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                ...options
            });

            // Auto close after 5 seconds
            setTimeout(() => notification.close(), 5000);

            return notification;
        }
    };

    const value = {
        // State
        isOnline,
        notifications,

        // Toast helpers
        toast: enhancedToast,

        // API helpers
        handleApiError,
        handleApiSuccess,

        // Validation helpers
        validateField,
        showValidationError,

        // Permission helpers
        checkPermission,
        requestPermission,
        showBrowserNotification,

        // Utility functions
        copyToClipboard: async (text, label = 'Text') => {
            try {
                await navigator.clipboard.writeText(text);
                enhancedToast.copied(label);
                return true;
            } catch (error) {
                enhancedToast.error('Failed to copy to clipboard', {
                    description: 'Please try selecting and copying manually',
                    showSupport: false
                });
                return false;
            }
        },

        downloadFile: (url, filename) => {
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            enhancedToast.file.downloadReady(filename, url);
        }
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;
