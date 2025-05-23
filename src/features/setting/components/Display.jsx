import { useState } from "react";

function Display() {
  const [language, setLanguage] = useState("vi");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [timeZone, setTimeZone] = useState("UTC+7");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [calendarView, setCalendarView] = useState("list");

  return (
    <div className="hidden space-y-6 w-full md:block">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <div className="flex-1 pb-2 lg:max-w-5xl mb-10">
          <h2 className="text-lg font-bold tracking-tight ">Display</h2>
          <p className="text-muted-foreground text-md size-3xl">
            Customize your display settings.
          </p>
          {/* Seperator */}
          <div className="rounded-lg divide-y divide-gray-200">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2 pt-4">
              {/* Language */}
              <div>
                <dt className="font-semibold">Language</dt>
                <dd className="mt-1 flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name="language"
                      value="vi"
                      checked={language === "vi"}
                      onChange={() => setLanguage("vi")}
                    />{" "}
                    Tiếng Việt
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="language"
                      value="en"
                      checked={language === "en"}
                      onChange={() => setLanguage("en")}
                    />{" "}
                    English
                  </label>
                </dd>
              </div>
              {/* Date format */}
              <div>
                <dt className="font-semibold">Date format</dt>
                <dd className="mt-1 flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name="dateFormat"
                      value="DD/MM/YYYY"
                      checked={dateFormat === "DD/MM/YYYY"}
                      onChange={() => setDateFormat("DD/MM/YYYY")}
                    />{" "}
                    DD/MM/YYYY
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="dateFormat"
                      value="MM/DD/YYYY"
                      checked={dateFormat === "MM/DD/YYYY"}
                      onChange={() => setDateFormat("MM/DD/YYYY")}
                    />{" "}
                    MM/DD/YYYY
                  </label>
                </dd>
              </div>
              {/* Time zone */}
              <div>
                <dt className="font-semibold">Time zone</dt>
                <dd className="mt-1 flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name="timeZone"
                      value="UTC+7"
                      checked={timeZone === "UTC+7"}
                      onChange={() => setTimeZone("UTC+7")}
                    />{" "}
                    UTC+7
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="timeZone"
                      value="system"
                      checked={timeZone === "system"}
                      onChange={() => setTimeZone("system")}
                    />{" "}
                    System default
                  </label>
                </dd>
              </div>
              {/* Units */}
              <div>
                <dt className="font-semibold">Units</dt>
                <dd className="mt-1">
                  <div className="flex gap-4 items-center">
                    <span>Height:</span>
                    <label>
                      <input
                        type="radio"
                        name="heightUnit"
                        value="cm"
                        checked={heightUnit === "cm"}
                        onChange={() => setHeightUnit("cm")}
                      />{" "}
                      cm
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="heightUnit"
                        value="ft-in"
                        checked={heightUnit === "ft-in"}
                        onChange={() => setHeightUnit("ft-in")}
                      />{" "}
                      ft-in
                    </label>
                  </div>
                  <div className="flex gap-4 items-center mt-2">
                    <span>Weight:</span>
                    <label>
                      <input
                        type="radio"
                        name="weightUnit"
                        value="kg"
                        checked={weightUnit === "kg"}
                        onChange={() => setWeightUnit("kg")}
                      />{" "}
                      kg
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="weightUnit"
                        value="lb"
                        checked={weightUnit === "lb"}
                        onChange={() => setWeightUnit("lb")}
                      />{" "}
                      lb
                    </label>
                  </div>
                </dd>
              </div>
              {/* Calendar view */}
              <div>
                <dt className="font-semibold">Calendar view</dt>
                <dd className="mt-1 flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name="calendarView"
                      value="list"
                      checked={calendarView === "list"}
                      onChange={() => setCalendarView("list")}
                    />{" "}
                    List
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="calendarView"
                      value="grid"
                      checked={calendarView === "grid"}
                      onChange={() => setCalendarView("grid")}
                    />{" "}
                    Grid
                  </label>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Display;