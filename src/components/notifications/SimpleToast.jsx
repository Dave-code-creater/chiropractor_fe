import { toast } from 'sonner';

// Simple, clean toast notifications that actually work
export const enhancedToast = {
    success: (message, description) => {
        return toast.success(message, {
            description: description,
            duration: 4000
        });
    },

    error: (message, description) => {
        return toast.error(message, {
            description: description,
            duration: 6000
        });
    },

    warning: (message, description) => {
        return toast.warning(message, {
            description: description,
            duration: 5000
        });
    },

    info: (message, description) => {
        return toast.info(message, {
            description: description,
            duration: 4000
        });
    },

    // Authentication specific
    auth: {
        success: (message) => enhancedToast.success("Login Successful", message),
        error: (message) => enhancedToast.error("Login Failed", message),
        invalid: (message) => enhancedToast.error("Invalid Credentials", message)
    },

    // Chat specific  
    chat: {
        sent: () => enhancedToast.success("Message Sent", "Your message was delivered successfully"),
        error: (message) => enhancedToast.error("Message Failed", message || "Could not send message")
    },

    // Validation specific
    validation: {
        invalid: (field, message) => enhancedToast.error(`${field} Invalid`, message),
        required: (field) => enhancedToast.warning("Required Field", `${field} is required`)
    }
};

export default enhancedToast;
