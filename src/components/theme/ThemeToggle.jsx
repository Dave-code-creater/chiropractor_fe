import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ThemeToggle = ({ variant = 'default', size = 'default', showLabel = false }) => {
    const { theme, setTheme } = useTheme();

    const themes = [
        {
            name: 'Light',
            value: 'light',
            icon: Sun,
        },
        {
            name: 'Dark',
            value: 'dark',
            icon: Moon,
        },
        {
            name: 'System',
            value: 'system',
            icon: Monitor,
        },
    ];

    const currentTheme = themes.find(t => t.value === theme);
    const CurrentIcon = currentTheme?.icon || Sun;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={variant} size={size} className="relative">
                    <CurrentIcon className="h-4 w-4" />
                    {showLabel && <span className="ml-2">Theme</span>}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                {themes.map((themeOption) => {
                    const Icon = themeOption.icon;
                    return (
                        <DropdownMenuItem
                            key={themeOption.value}
                            onClick={() => setTheme(themeOption.value)}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <Icon className="h-4 w-4" />
                            <span>{themeOption.name}</span>
                            {theme === themeOption.value && (
                                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                            )}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ThemeToggle;
