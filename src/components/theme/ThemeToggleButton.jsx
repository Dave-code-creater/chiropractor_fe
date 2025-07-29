import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const ThemeToggleButton = ({
    className,
    variant = 'ghost',
    size = 'icon',
    showTooltip = true
}) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant={variant}
            size={size}
            onClick={toggleTheme}
            className={cn("relative", className)}
            title={showTooltip ? `Switch to ${theme === 'light' ? 'dark' : 'light'} mode` : undefined}
        >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};

export default ThemeToggleButton;
