import { useState } from "react";

export default function Display() {
  const [language, setLanguage] = useState("vi");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [timeZone, setTimeZone] = useState("UTC+7");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [weightUnit, setWeightUnit] = useState("kg");

  return (
    <div className="w-full space-y-8">
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl p-8 border border-gray-200">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Display Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Customize how your data is presented across the platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <div className="space-y-2">
              {["vi", "en"].map((lang) => (
                <label key={lang} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="language"
                    value={lang}
                    checked={language === lang}
                    onChange={() => setLanguage(lang)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{lang === "vi" ? "Tiếng Việt" : "English"}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
            <div className="space-y-2">
              {["DD/MM/YYYY", "MM/DD/YYYY"].map((fmt) => (
                <label key={fmt} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="dateFormat"
                    value={fmt}
                    checked={dateFormat === fmt}
                    onChange={() => setDateFormat(fmt)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{fmt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Time Zone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
            <div className="space-y-2">
              {["UTC+7", "system"].map((tz) => (
                <label key={tz} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="timeZone"
                    value={tz}
                    checked={timeZone === tz}
                    onChange={() => setTimeZone(tz)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{tz === "system" ? "System Default" : tz}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Units */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Measurement Units</label>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-600">Height</span>
                <div className="flex space-x-4 mt-1">
                  {["cm", "ft-in"].map((h) => (
                    <label key={h} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="heightUnit"
                        value={h}
                        checked={heightUnit === h}
                        onChange={() => setHeightUnit(h)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">{h}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Weight</span>
                <div className="flex space-x-4 mt-1">
                  {["kg", "lb"].map((w) => (
                    <label key={w} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="weightUnit"
                        value={w}
                        checked={weightUnit === w}
                        onChange={() => setWeightUnit(w)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">{w}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Optional Save Button */}
        <div className="mt-8">
          <button
            onClick={() => alert("Preferences saved!")}
            className="px-6 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm font-medium transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}