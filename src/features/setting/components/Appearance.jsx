import { useState } from "react";

function Appearance() {
    const [theme, setTheme] = useState("light");
    const [fontSize, setFontSize] = useState("medium");
    const [colorScheme, setColorScheme] = useState("indigo");
    const [sidebarPosition, setSidebarPosition] = useState("left");
    const [buttonStyle, setButtonStyle] = useState("rounded");

    return (
        <div className="w-full space-y-8">
            <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl p-8 border border-gray-200">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Appearance</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Customize your appearance settings.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Theme */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                        <div className="space-y-2">
                            {["light", "dark"].map((option) => (
                                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="theme"
                                        value={option}
                                        checked={theme === option}
                                        onChange={() => setTheme(option)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700 capitalize">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Font Size */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                        <div className="space-y-2">
                            {["small", "medium", "large"].map((size) => (
                                <label key={size} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="fontSize"
                                        value={size}
                                        checked={fontSize === size}
                                        onChange={() => setFontSize(size)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700 capitalize">{size}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Color Scheme */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Color Scheme</label>
                        <div className="space-y-2">
                            {["indigo", "green", "red"].map((color) => (
                                <label key={color} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="colorScheme"
                                        value={color}
                                        checked={colorScheme === color}
                                        onChange={() => setColorScheme(color)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700 capitalize">{color}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Position */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sidebar Position</label>
                        <div className="space-y-2">
                            {["left", "right", "hidden"].map((position) => (
                                <label key={position} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="sidebarPosition"
                                        value={position}
                                        checked={sidebarPosition === position}
                                        onChange={() => setSidebarPosition(position)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700 capitalize">{position}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Button Style */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Button Style</label>
                        <div className="space-y-2">
                            {["rounded", "square", "outline"].map((style) => (
                                <label key={style} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="buttonStyle"
                                        value={style}
                                        checked={buttonStyle === style}
                                        onChange={() => setButtonStyle(style)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700 capitalize">{style}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="mt-8">
                    <button
                        onClick={() => alert("Appearance settings saved!")}
                        className="px-6 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm font-medium transition"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Appearance;