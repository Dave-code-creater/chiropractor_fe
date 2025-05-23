import { useState } from "react";

function Appearance() {
    const [theme, setTheme] = useState("light");
    const [fontSize, setFontSize] = useState("medium");
    const [colorScheme, setColorScheme] = useState("blue");
    const [sidebarPosition, setSidebarPosition] = useState("left");
    const [buttonStyle, setButtonStyle] = useState("rounded");

    return (
        <div className="hidden space-y-6 w-full md:block">
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <div className="flex-1 pb-2 lg:max-w-2xl mb-10">
                    <h2 className="text-lg font-bold tracking-tight ">Appearance</h2>
                    <p className="text-muted-foreground text-md size-3xl">
                        Customize your appearance settings.
                    </p>
                    <div className=" rounded-lg divide-y divide-gray-200">
                        <dl className="grid grid-cols-3 gap-4 pb-2 pt-4">
                            {/* Theme */}
                            <h2 className="text-md font-bold tracking-tight">Theme</h2>
                            <p className="text-muted-foreground text-md size-2xl">
                                Choose your preferred theme.
                            </p>
                            <div className="flex items-center space-x-4 mt-4">
                                <label className="text-md size-2xl">Light</label>
                                <input type="radio" name="theme" value="light" checked={theme === "light"} onChange={() => setTheme("light")} />
                                <label className="text-md size-2xl">Dark</label>
                                <input type="radio" name="theme" value="dark" checked={theme === "dark"} onChange={() => setTheme("dark")} />
                            </div>
                            {/* Font Size */}
                            <h2 className="text-md font-bold tracking-tight">Font Size</h2>
                            <p className="text-muted-foreground text-md size-2xl">
                                Choose your preferred font size.
                            </p>
                            <div className="flex items-center space-x-4 mt-4">
                                <label className="text-md size-2xl">Small</label>
                                <input type="radio" name="font-size" value="small" checked={fontSize === "small"} onChange={() => setFontSize("small")} />
                                <label className="text-md size-2xl">Medium</label>
                                <input type="radio" name="font-size" value="medium" checked={fontSize === "medium"} onChange={() => setFontSize("medium")} />
                                <label className="text-md size-2xl">Large</label>
                                <input type="radio" name="font-size" value="large" checked={fontSize === "large"} onChange={() => setFontSize("large")} />
                            </div>
                            {/* Color Scheme */}
                            <h2 className="text-md font-bold tracking-tight">Color Scheme</h2>
                            <p className="text-muted-foreground text-md size-2xl">
                                Choose your preferred color scheme.
                            </p>
                            <div className="flex items-center space-x-4 mt-4">
                                <label className="text-md size-2xl">Blue</label>
                                <input type="radio" name="color-scheme" value="blue" checked={colorScheme === "blue"} onChange={() => setColorScheme("blue")} />
                                <label className="text-md size-2xl">Green</label>
                                <input type="radio" name="color-scheme" value="green" checked={colorScheme === "green"} onChange={() => setColorScheme("green")} />
                                <label className="text-md size-2xl">Red</label>
                                <input type="radio" name="color-scheme" value="red" checked={colorScheme === "red"} onChange={() => setColorScheme("red")} />
                            </div>
                            {/* Sidebar Position */}
                            <h2 className="text-md font-bold tracking-tight">Sidebar Position</h2>
                            <p className="text-muted-foreground text-md size-2xl">
                                Choose your preferred sidebar position.
                            </p>
                            <div className="flex items-center space-x-4 mt-4">
                                <label className="text-md size-2xl">Left</label>
                                <input type="radio" name="sidebar-position" value="left" checked={sidebarPosition === "left"} onChange={() => setSidebarPosition("left")} />
                                <label className="text-md size-2xl">Right</label>
                                <input type="radio" name="sidebar-position" value="right" checked={sidebarPosition === "right"} onChange={() => setSidebarPosition("right")} />
                                <label className="text-md size-2xl">Hidden</label>
                                <input type="radio" name="sidebar-position" value="hidden" checked={sidebarPosition === "hidden"} onChange={() => setSidebarPosition("hidden")} />
                            </div>
                            {/* Button Style */}
                            <h2 className="text-md font-bold tracking-tight">Button Style</h2>
                            <p className="text-muted-foreground text-md size-2xl">
                                Choose your preferred button style.
                            </p>
                            <div className="flex items-center space-x-4 mt-4">
                                <label className="text-md size-2xl">Rounded</label>
                                <input type="radio" name="button-style" value="rounded" checked={buttonStyle === "rounded"} onChange={() => setButtonStyle("rounded")} />
                                <label className="text-md size-2xl">Square</label>
                                <input type="radio" name="button-style" value="square" checked={buttonStyle === "square"} onChange={() => setButtonStyle("square")} />
                                <label className="text-md size-2xl">Outline</label>
                                <input type="radio" name="button-style" value="outline" checked={buttonStyle === "outline"} onChange={() => setButtonStyle("outline")} />
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Appearance