import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";

function pad(n) {
  return String(n).padStart(2, "0");
}

function normalizeTime(val) {
  if (!val) return "";
  let v = val.trim().toLowerCase();
  // Accept formats: HH:mm, H:mm, HHmm, h:mm am/pm
  const ampm = v.endsWith("am") || v.endsWith("pm") ? v.slice(-2) : null;
  if (ampm) v = v.replace(/\s*(am|pm)$/i, "");

  if (/^\d{3,4}$/.test(v)) {
    // e.g., 930 or 0930
    const hh = v.length === 3 ? v.slice(0, 1) : v.slice(0, 2);
    const mm = v.slice(-2);
    v = `${hh}:${mm}`;
  }

  const m = v.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return "";
  let h = parseInt(m[1], 10);
  const minutes = parseInt(m[2], 10);
  if (Number.isNaN(h) || Number.isNaN(minutes) || minutes > 59) return "";
  if (ampm) {
    if (ampm === "am") {
      if (h === 12) h = 0;
    } else {
      if (h < 12) h += 12;
    }
  }
  if (h > 23) return "";
  return `${pad(h)}:${pad(minutes)}`;
}

function buildTimes(stepMinutes = 15) {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      times.push(`${pad(h)}:${pad(m)}`);
    }
  }
  return times;
}

export default function TimePickerInput({
  id,
  value,
  onChange,
  placeholder = "hh:mm",
  required,
  className = "",
  disabled,
  step = 15,
  min = "08:00",
  max = "18:00",
}) {
  const [open, setOpen] = React.useState(false);
  const times = React.useMemo(() => buildTimes(step), [step]);

  const withinBounds = (t) => {
    if (!t) return true;
    if (min && t < min) return false;
    if (max && t > max) return false;
    return true;
  };

  const handleSelect = (t) => {
    if (!withinBounds(t)) return;
    onChange?.(t);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            id={id}
            value={value || ""}
            placeholder={placeholder}
            onChange={(e) => onChange?.(e.target.value)}
            onBlur={(e) => {
              const n = normalizeTime(e.target.value);
              if (n && withinBounds(n)) onChange?.(n);
            }}
            required={required}
            disabled={disabled}
            className={`cursor-pointer pr-9 ${className}`}
          />
          <Clock className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[260px] max-h-72 overflow-auto">
        <div className="text-[11px] text-muted-foreground px-3 py-2 border-b">
          Open {min} — Close {max}
        </div>
        {(() => {
          // Only include times that are within bounds (open/close hours)
          const bounded = times.filter((t) => withinBounds(t));

          // Group by morning (<12:00), noon/afternoon (12:00–17:59), night (>=18:00)
          const groups = {
            Morning: [],
            Noon: [],
            Night: [],
          };

          bounded.forEach((t) => {
            const h = parseInt(t.slice(0, 2), 10);
            if (h < 12) groups.Morning.push(t);
            else if (h < 18) groups.Noon.push(t);
            else groups.Night.push(t);
          });

          const renderGroup = (label, list) =>
            list.length > 0 && (
              <div key={label} className="py-1">
                <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-xs text-muted-foreground px-3 py-1">
                  {label}
                </div>
                <div className="grid grid-cols-3 gap-0">
                  {list.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleSelect(t)}
                      className="text-sm px-3 py-2 hover:bg-accent hover:text-accent-foreground text-left"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            );

          return (
            <div>
              {renderGroup("Morning", groups.Morning)}
              {renderGroup("Noon", groups.Noon)}
              {renderGroup("Night", groups.Night)}
              {bounded.length === 0 && (
                <div className="text-sm text-muted-foreground px-3 py-2">No times available</div>
              )}
            </div>
          );
        })()}
      </PopoverContent>
    </Popover>
  );
}
