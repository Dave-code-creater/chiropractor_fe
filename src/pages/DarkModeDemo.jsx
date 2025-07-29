import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/theme/ThemeToggle';
import ThemeToggleButton from '@/components/theme/ThemeToggleButton';
import { Sun, Moon, Monitor, Star, Heart, Zap } from 'lucide-react';

const DarkModeDemo = () => {
    const { theme } = useTheme();

    return (
        <div className="min-h-screen bg-background p-6 transition-colors duration-300">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-foreground">Dark Mode Demo</h1>
                    <p className="text-lg text-muted-foreground">
                        Experience your application in light, dark, or system theme
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Badge variant="outline" className="text-sm">
                            Current theme: {theme}
                        </Badge>
                        <ThemeToggle variant="outline" showLabel />
                        <ThemeToggleButton />
                    </div>
                </div>

                {/* Theme Showcase Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Cards Showcase */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sun className="h-5 w-5 text-primary" />
                                Light Theme
                            </CardTitle>
                            <CardDescription>
                                Clean and bright interface for daytime use
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Perfect for well-lit environments and users who prefer traditional interfaces.
                            </p>
                            <div className="flex gap-2">
                                <Badge>Popular</Badge>
                                <Badge variant="secondary">Default</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Moon className="h-5 w-5 text-primary" />
                                Dark Theme
                            </CardTitle>
                            <CardDescription>
                                Easy on the eyes for low-light environments
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Reduces eye strain and saves battery on OLED screens.
                            </p>
                            <div className="flex gap-2">
                                <Badge variant="outline">Modern</Badge>
                                <Badge variant="destructive">Power Saving</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Monitor className="h-5 w-5 text-primary" />
                                System Theme
                            </CardTitle>
                            <CardDescription>
                                Automatically matches your system preference
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Switches between light and dark based on your OS settings.
                            </p>
                            <div className="flex gap-2">
                                <Badge variant="secondary">Automatic</Badge>
                                <Badge>Smart</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Components Showcase */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Buttons */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Button Variants</CardTitle>
                            <CardDescription>See how buttons look in different themes</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <Button>Primary</Button>
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="outline">Outline</Button>
                                <Button variant="ghost">Ghost</Button>
                                <Button variant="destructive">Destructive</Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button size="sm">Small</Button>
                                <Button size="default">Default</Button>
                                <Button size="lg">Large</Button>
                                <Button size="icon">
                                    <Star className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Interactive Elements */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Interactive Elements</CardTitle>
                            <CardDescription>Hover and click to see theme adaptations</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <Badge>Default Badge</Badge>
                                <Badge variant="secondary">Secondary</Badge>
                                <Badge variant="outline">Outline</Badge>
                                <Badge variant="destructive">Destructive</Badge>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">
                                    This is a muted background area that adapts to the current theme.
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    <Heart className="h-4 w-4 mr-1" />
                                    Like
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Zap className="h-4 w-4 mr-1" />
                                    Quick Action
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Theme Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Theme Features</CardTitle>
                        <CardDescription>What makes our dark mode special</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center space-y-2">
                                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Sun className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">Auto-Detection</h3>
                                <p className="text-sm text-muted-foreground">
                                    Automatically detects your system preference and switches accordingly.
                                </p>
                            </div>
                            <div className="text-center space-y-2">
                                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Monitor className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">Persistent Storage</h3>
                                <p className="text-sm text-muted-foreground">
                                    Your theme preference is saved and restored across sessions.
                                </p>
                            </div>
                            <div className="text-center space-y-2">
                                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Zap className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">Smooth Transitions</h3>
                                <p className="text-sm text-muted-foreground">
                                    Seamless transitions between themes with CSS animations.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DarkModeDemo;
