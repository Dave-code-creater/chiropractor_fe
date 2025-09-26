import React from "react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { renderCalAge, renderDate } from "./FormUtils";
import FormattedInput from "./FormattedInput";

export function FormatLegend({ question }) {
  return (
    <legend className="text-sm font-medium text-muted-foreground px-2 flex items-center gap-2">
      {question.label}
      {question.required && <span className="ml-1 text-red-500">*</span>}
      {question.extra_info && (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Info size={16} className="text-muted-foreground cursor-pointer" />
          </HoverCardTrigger>
          <HoverCardContent className="w-80 text-sm">
            {question.extra_info}
          </HoverCardContent>
        </HoverCard>
      )}
    </legend>
  );
}

export function RenderQuesFuncs({
  question,
  formData,
  setFormData,
  commonFieldsetClasses,
  errors = {},
}) {
  return (
    <fieldset key={question.id} className={commonFieldsetClasses}>
      <FormatLegend question={question} />
      <div className="grid gap-4">
        {question.fields.map((field) => {
          const value = formData[field.id] || "";
          const isReq = !!field.required;

          const isPhoneField = field.type === "tel" ||
            field.id.toLowerCase().includes("phone") ||
            field.placeholder?.includes("(") && field.placeholder?.includes(")");
          const isSSNField = field.id === "ssn" ||
            field.id.toLowerCase().includes("ssn") ||
            field.placeholder?.includes("-") && field.placeholder?.length <= 12;

          return (
            <div key={field.id}>
              <Label htmlFor={field.id} className="text-sm font-medium">
                {field.label} {isReq && <span className="text-red-500">*</span>}
              </Label>

              {field.type === "date" ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Input
                      id={field.id}
                      placeholder="YYYY/MM/DD"
                      value={value}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          [field.id]: e.target.value,
                        }))
                      }
                      onBlur={(e) => {
                        const f = renderDate(e.target.value);
                        let extra = {};
                        if (f && field.id === "dob") {
                          extra.age = renderCalAge(f.slice(0, 4));
                        }
                        setFormData((p) => ({ ...p, [field.id]: f, ...extra }));
                      }}
                      className="cursor-pointer w-full"
                      required={isReq}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="[min-width:var(--radix-popover-trigger-width)] ">
                    <Calendar
                      mode="single"
                      className="w-auto "
                      initialFocus
                      defaultMonth={value ? new Date(value) : undefined}
                      selected={value ? new Date(value) : undefined}
                      onSelect={(date) => {
                        let val = "";
                        let extra = {};
                        if (date) {
                          const y = date.getFullYear();
                          const m = String(date.getMonth() + 1).padStart(
                            2,
                            "0",
                          );
                          const d = String(date.getDate()).padStart(2, "0");
                          val = `${y}/${m}/${d}`;
                          if (field.id === "dob") extra.age = renderCalAge(y);
                        }
                        setFormData((p) => ({
                          ...p,
                          [field.id]: val,
                          ...extra,
                        }));
                      }}
                    />
                  </PopoverContent>
                </Popover>
              ) : isPhoneField ? (
                <FormattedInput
                  type="phone"
                  id={field.id}
                  placeholder={field.placeholder}
                  value={value}
                  onChange={(value) =>
                    setFormData((p) => ({ ...p, [field.id]: value }))
                  }
                  required={isReq}
                  className={errors[field.id] ? "border-red-500" : ""}
                />
              ) : isSSNField ? (
                <FormattedInput
                  type="ssn"
                  id={field.id}
                  placeholder={field.placeholder}
                  value={value}
                  onChange={(value) =>
                    setFormData((p) => ({ ...p, [field.id]: value }))
                  }
                  required={isReq}
                  className={errors[field.id] ? "border-red-500" : ""}
                />
              ) : (
                <Input
                  id={field.id}
                  type={field.type === "tel" ? "tel" : "text"}
                  placeholder={field.placeholder}
                  value={value}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, [field.id]: e.target.value }))
                  }
                  required={isReq}
                  className={errors[field.id] ? "border-red-500" : ""}
                />
              )}

              {errors[field.id] && (
                <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
              )}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

export function RenderTextAreaQues({
  question,
  formData,
  setFormData,
  commonFieldsetClasses,
  errors = {},
}) {
  const isReq = !!question.required;
  return (
    <fieldset key={question.id} className={commonFieldsetClasses}>
      <FormatLegend question={question} />
      <textarea
        id={question.id}
        required={isReq}
        className="w-full border rounded px-3 py-2 resize-y max-h-[300px]"
        rows={4}
        value={formData[question.id] || ""}
        onChange={(e) =>
          setFormData((p) => ({ ...p, [question.id]: e.target.value }))
        }
      />
      {errors[question.id] && (
        <p className="text-red-500 text-sm mt-1">{errors[question.id]}</p>
      )}
    </fieldset>
  );
}

export function RenderRadioQues({
  question,
  formData,
  setFormData,
  commonFieldsetClasses,
  errors = {},
}) {
  const getPlaceholder = () => {
    const label = question.label;
    if (label.length > 30) {
      return `Select ${label.substring(0, 20)}...`;
    }
    return `Select ${label}`;
  };

  return (
    <fieldset key={question.id} className={commonFieldsetClasses}>
      <FormatLegend question={question} />
      <Select
        value={formData[question.id] || ""}
        onValueChange={(val) =>
          setFormData((p) => ({ ...p, [question.id]: val }))
        }
        required={!!question.required}
      >
        <SelectTrigger className="h-12 text-base">
          <SelectValue placeholder={getPlaceholder()} />
        </SelectTrigger>
        <SelectContent>
          {question.options.map((opt) => (
            <SelectItem key={opt} value={opt} className="text-base py-3">
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors[question.id] && (
        <p className="text-red-500 text-sm mt-1">{errors[question.id]}</p>
      )}
    </fieldset>
  );
}

export function RenderCheckboxQues({
  question,
  formData,
  setFormData,
  commonFieldsetClasses,
  errors = {},
}) {
  return (
    <fieldset key={question.id} className={commonFieldsetClasses}>
      <FormatLegend question={question} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {question.options.map((opt) => (
          <div key={opt} className="flex items-center p-3 sm:p-2 hover:bg-muted/50 rounded-lg transition-colors border border-transparent hover:border-gray-200">
            <Checkbox
              id={`${question.id}-${opt}`}
              checked={formData[question.id]?.includes(opt)}
              onCheckedChange={(checked) =>
                setFormData((p) => {
                  const curr = p[question.id] || [];
                  return {
                    ...p,
                    [question.id]: checked
                      ? [...curr, opt]
                      : curr.filter((v) => v !== opt),
                  };
                })
              }
              required={!!question.required}
              className="flex-shrink-0 h-5 w-5"
            />
            <Label
              htmlFor={`${question.id}-${opt}`}
              className="ml-3 cursor-pointer leading-relaxed text-base sm:text-sm font-medium"
            >
              {opt}
            </Label>
          </div>
        ))}
      </div>
      {errors[question.id] && (
        <p className="text-red-500 text-sm mt-1">{errors[question.id]}</p>
      )}
    </fieldset>
  );
}

export function RenderOtherQues({
  question,
  formData,
  setFormData,
  commonFieldsetClasses,
  errors = {},
}) {
  return (
    <fieldset key={question.id} className={commonFieldsetClasses}>
      <FormatLegend question={question} />
      <Input
        id={question.id}
        type={question.type === "number" ? "number" : "text"}
        value={formData[question.id] || ""}
        onChange={(e) =>
          setFormData((p) => ({ ...p, [question.id]: e.target.value }))
        }
        required={!!question.required}
      />
      {errors[question.id] && (
        <p className="text-red-500 text-sm mt-1">{errors[question.id]}</p>
      )}
    </fieldset>
  );
} 