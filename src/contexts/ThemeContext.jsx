import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
    theme: 'light',
    toggleTheme: () => { },
    setTheme: () => { }
});

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    // Force light mode for now - disable dark mode temporarily
    const [theme, setTheme] = useState('light');

    // Function to get the actual theme to apply
    const getEffectiveTheme = (currentTheme) => {
        // Always return light mode for now
        return 'light';
    };

    useEffect(() => {
        const root = window.document.documentElement;

        // Always apply light mode
        root.classList.remove('light', 'dark');
        root.classList.add('light');

        // Save light theme to localStorage
        localStorage.setItem('theme', 'light');

        // Update meta theme-color for mobile browsers (light mode)
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', '#ffffff');
        } else {
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            meta.content = '#ffffff';
            document.getElementsByTagName('head')[0].appendChild(meta);
        }
    }, [theme]);

    // Listen for system theme changes - DISABLED for light mode only
    useEffect(() => {
        // Disabled - not listening to system theme changes
        // const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        // const handleChange = () => {
        //     // Only update if theme is set to system
        //     if (theme === 'system') {
        //         const root = window.document.documentElement;
        //         const effectiveTheme = getEffectiveTheme('system');

        //         root.classList.remove('light', 'dark');
        //         root.classList.add(effectiveTheme);

        //         const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        //         if (metaThemeColor) {
        //             metaThemeColor.setAttribute('content', effectiveTheme === 'dark' ? '#1a1a1a' : '#ffffff');
        //         }
        //     }
        // };

        // mediaQuery.addEventListener('change', handleChange);
        // return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const toggleTheme = () => {
        // Disabled for now - keeping light mode only
        // setTheme(prevTheme => {
        //     switch (prevTheme) {
        //         case 'light':
        //             return 'dark';
        //         case 'dark':
        //             return 'system';
        //         case 'system':
        //             return 'light';
        //         default:
        //             return 'light';
        //     }
        // });
    };

    const value = {
        theme,
        toggleTheme,
        setTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
