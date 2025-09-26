import { toast } from 'sonner';

const buildOptions = (options, defaultDuration) => {
    const baseOptions = { duration: defaultDuration };

    if (options === undefined || options === null) {
        return baseOptions;
    }

    if (typeof options === 'string') {
        return { ...baseOptions, description: options };
    }

    if (typeof options === 'object') {
        const { description, ...rest } = options;
        return {
            ...baseOptions,
            ...(description !== undefined ? { description } : {}),
            ...rest
        };
    }

    return baseOptions;
};

// Simple, clean toast notifications that actually work
export const enhancedToast = {
    success: (message, options) => {
        return toast.success(message, buildOptions(options, 4000));
    },

    error: (message, options) => {
        return toast.error(message, buildOptions(options, 6000));
    },

    warning: (message, options) => {
        return toast.warning(message, buildOptions(options, 5000));
    },

    info: (message, options) => {
        return toast.info(message, buildOptions(options, 4000));
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
