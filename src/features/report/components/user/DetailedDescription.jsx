import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PATIENT_INFO from "../../../../constants/initial-reports";;


export default function DetailedDescription({ formData, setFormData }) {

  const renderQuestion = (question) => {
    const commonFieldsetClasses = "border rounded-md p-4 space-y-4 mb-4";

    if (question.type === "group") {
      return (
        <fieldset key={question.id} className={commonFieldsetClasses}>
          <legend className="text-sm font-medium text-muted-foreground px-2 flex items-center gap-2">
            {question.label}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.fields.map((field) => {
              const value = formData[field.id] || "";

              // Radio fields
              if (field.type === "radio") {
                return (
                  <div key={field.id} className="mt-4">
                    <Label htmlFor={field.id}>{field.label}</Label>
                    <Select
                      value={value}
                      onValueChange={(val) =>
                        setFormData((prev) => ({ ...prev, [field.id]: val }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${field.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              }

              // Date fields
              if (field.type === "date") {
                const raw = formData[field.id] || "";
                // store as ISO “YYYY-MM-DD”
                const selected = raw ? new Date(raw) : undefined;

                return (
                  <div key={field.id} className="mt-4 w-full">
                    <Label htmlFor={field.id}>{field.label}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                          id={field.id}
                        >
                          {selected
                            ? selected.toLocaleDateString()
                            : field.placeholder || `Select ${field.label}`}
                          <CalendarIcon className="ml-2 h-4 w-4 opacity-60" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-2 bg-white border rounded-lg shadow-lg">
                        <Calendar
                          mode="single"
                          selected={selected}
                          onSelect={(date) => {
                            setFormData((prev) => ({
                              ...prev,
                              [field.id]: date
                                ? date.toISOString().slice(0, 10)
                                : "",
                            }));
                          }}
                          className="w-full"
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                );
              }

              // Default text/number/tel inputs
              return (
                <div key={field.id} className="mt-4">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input
                    id={field.id}
                    type={field.type === "number" ? "number" : "text"}
                    value={value}
                    placeholder={field.placeholder || field.label}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field.id]: e.target.value,
                      }))
                    }
                  />
                </div>
              );
            })}
          </div>
        </fieldset>
      );
    }

    // Textarea fields
    if (question.type === "textarea") {
      return (
        <fieldset key={question.id} className={commonFieldsetClasses}>
          <legend className="text-sm font-medium text-muted-foreground px-2 flex items-center gap-2">
            {question.label}
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
          <div className="mt-4">
            <Label htmlFor={question.id}>{question.label}</Label>
            <textarea
              id={question.id}
              placeholder={question.placeholder || question.label}
              className="w-full border rounded px-3 py-2"
              rows={4}
              value={formData[question.id] || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [question.id]: e.target.value,
                }))
              }
            />
          </div>
        </fieldset>
      );
    }

    // Pain chart special case
    if (question.id === "painChart") {
      return (
        <fieldset key={question.id} className={commonFieldsetClasses}>
          <legend className="text-sm font-medium text-muted-foreground px-2 flex items-center gap-2">
            {question.label}
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
          <PainChartSection painMap={painMap} setPainMap={setPainMap} />
        </fieldset>
      );
    }

    // Radio outside group
    if (question.type === "radio") {
      return (
        <fieldset key={question.id} className={commonFieldsetClasses}>
          <legend className="text-sm font-medium text-muted-foreground px-2 flex items-center gap-2">
            {question.label}
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
          <div className="mt-4">
            <Label>{question.label}</Label>
            <Select
              value={formData[question.id] || ""}
              onValueChange={(val) =>
                setFormData((prev) => ({ ...prev, [question.id]: val }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${question.label}`} />
              </SelectTrigger>
              <SelectContent>
                {question.options.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </fieldset>
      );
    }

    // Checkbox outside group
    if (question.type === "checkbox") {
      return (
        <fieldset key={question.id} className={commonFieldsetClasses}>
          <legend className="text-sm font-medium text-muted-foreground px-2 flex items-center gap-2">
            {question.label}
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
          <div className="space-y-2">
            {question.options.map((opt) => (
              <div key={opt} className="flex items-center mt-4">
                <Checkbox
                  id={`${question.id}-${opt}`}
                  checked={formData[question.id]?.includes(opt)}
                  onCheckedChange={(checked) => {
                    setFormData((prev) => {
                      const currentValues = prev[question.id] || [];
                      return {
                        ...prev,
                        [question.id]: checked ? [...currentValues, opt] : currentValues.filter((v) => v !== opt),
                      };
                    });
                  }}
                />
                <Label htmlFor={`${question.id}-${opt}`} className="ml-2">
                  {opt}
                </Label>
              </div>
            ))}
          </div>
        </fieldset>
      );
    }

    return null;
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{PATIENT_INFO.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {PATIENT_INFO.questions.map((q) => renderQuestion(q, formData, setFormData))}
      </CardContent>
    </Card>
  );
}