export const openExternalLink = (url) => {
    if (window.electronAPI || window.require) {
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

    window.open(url, '_blank', 'noopener,noreferrer');
};

export const isElectron = () => {
    return !!(window.electronAPI || (window.process && window.process.type));
};

export const safeNavigate = (url) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        openExternalLink(url);
    } else {
        window.location.href = url;
    }
};
