
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";

function toYmd(date) {
  if (!date || Number.isNaN(date.getTime?.())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseInput(val) {
  if (!val) return undefined;
  // Accept yyyy-mm-dd or yyyy/mm/dd
  const normalized = val.replaceAll("/", "-");
  const m = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return undefined;
  const dt = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (Number.isNaN(dt.getTime())) return undefined;
  return dt;
}

export function DatePickerInput({
  id,
  value,
  onChange,
  placeholder = "yyyy-mm-dd",
  required,
  className = "",
  disabled,
  min,
  max,
}) {
  const selectedDate = parseInput(value);

  const handleSelect = (date) => {
    const formatted = toYmd(date);
    onChange?.(formatted);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            id={id}
            value={value || ""}
            placeholder={placeholder}
            onChange={(e) => onChange?.(e.target.value)}
            onBlur={(e) => {
              // Normalize to yyyy-mm-dd on blur if possible
              const dt = parseInput(e.target.value);
              if (dt) onChange?.(toYmd(dt));
            }}
            required={required}
            disabled={disabled}
            className={`cursor-pointer pr-9 ${className}`}
          />
          <CalendarIcon className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-2 w-auto">
        <Calendar
          mode="single"
          initialFocus
          selected={selectedDate}
          defaultMonth={selectedDate}
          onSelect={handleSelect}
          showOutsideDays={false}
          classNames={{
            months: "flex flex-col space-y-2 relative",
            month: "space-y-2",
            month_caption: "flex justify-center items-center py-1 relative",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            button_previous:
              "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 border border-input hover:bg-accent hover:text-accent-foreground absolute left-2 top-1 rounded-md",
            button_next:
              "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 border border-input hover:bg-accent hover:text-accent-foreground absolute right-2 top-1 rounded-md",
            month_grid: "w-full border-collapse",
            weekdays: "flex",
            weekday: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            week: "flex w-full mt-1",
            day: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
            day_button:
              "h-9 w-9 p-0 font-medium rounded-full hover:bg-accent hover:text-accent-foreground aria-selected:opacity-100",
            selected:
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow",
            today: "ring-1 ring-primary/60 text-foreground",
            outside: "text-muted-foreground opacity-0 pointer-events-none",
            disabled: "text-muted-foreground opacity-50",
            hidden: "invisible",
          }}
          disabled={(date) => {
            // Apply min/max if provided (yyyy-mm-dd)
            const minDt = parseInput(min);
            const maxDt = parseInput(max);
            if (minDt && date < new Date(minDt.getFullYear(), minDt.getMonth(), minDt.getDate())) return true;
            if (maxDt && date > new Date(maxDt.getFullYear(), maxDt.getMonth(), maxDt.getDate())) return true;
            return false;
          }}
          className="w-auto"
        />
      </PopoverContent>
    </Popover>
  );
}

export default DatePickerInput;
