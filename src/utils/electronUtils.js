// Utility for opening external links in Electron desktop app
export const openExternalLink = (url) => {
    // Check if we're running in Electron
    if (window.electronAPI || window.require) {
        // In Electron, use shell.openExternal via IPC or require
        try {
            if (window.require) {
                const { shell } = window.require('electron');
                shell.openExternal(url);
                return;
            }
        } catch (error) {
            console.warn('Electron shell not available, falling back to window.open');
        }
    }

    // Fallback for web browsers or if Electron methods fail
    window.open(url, '_blank', 'noopener,noreferrer');
};

// Check if running in Electron
export const isElectron = () => {
    return !!(window.electronAPI || (window.process && window.process.type));
};

// Safe navigation for both web and Electron
export const safeNavigate = (url) => {
    // For external URLs (http/https), always open externally
    if (url.startsWith('http://') || url.startsWith('https://')) {
        openExternalLink(url);
    } else {
        // For internal navigation, use regular routing
        window.location.href = url;
    }
};
