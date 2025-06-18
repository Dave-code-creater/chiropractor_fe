import React from "react"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { Info } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { renderCalAge, renderDate } from "./renderUtilsFunc"

export function FormatLegend({ question }) {
    return (
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
    )
}

export function RenderQuesFuncs({ question, formData, setFormData, commonFieldsetClasses, errors = {} }) {
    return (
        <fieldset key={question.id} className={commonFieldsetClasses}>
            <FormatLegend question={question} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                {question.fields?.map((field) => {
                    if (
                        (field.id === "mentalWorkHours" && formData.mentalWork === "None") ||
                        (field.id === "physicalWorkHours" && formData.physicalWork === "None") ||
                        (field.id === "exerciseHours" && formData.exercise === "None") ||
                        (["packsPerDay", "smokingYears"].includes(field.id) && formData.smokingStatus === "None") ||
                        (["beerPerWeek", "liquorPerWeek", "winePerWeek", "alcoholYears"].includes(field.id) && (formData.drinkStatus === "none" || formData.drinkStatus === "no")) ||
                        (["workTimes", "workHoursPerDay", "workDaysPerWeek", "jobDescription"].includes(field.id) && (formData.currentlyWorking === "none" || formData.currentlyWorking === "no"))
                    ) {
                        return null;
                    }
                    const value = formData[field.id] || ""
                    return (
                        <div key={field.id} className="min-h-[100px]">
                            <div className="flex items-center gap-1">
                                <Label htmlFor={field.id}>{field.label}</Label>
                                {field.extra_info && (
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <Info size={14} className="text-muted-foreground cursor-pointer" />
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-72 text-sm">{field.extra_info}</HoverCardContent>
                                    </HoverCard>
                                )}
                            </div>
                            {field.type === "radio" ? (
                                <Select
                                    value={value}
                                    onValueChange={(val) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            [field.id]: val
                                        }))
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
                            ) : field.type === "date" ? (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Input
                                            id={field.id}
                                            placeholder="YYYY/MM/DD"
                                            value={value}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    [field.id]: e.target.value
                                                }))
                                            }
                                            onBlur={(e) => {
                                                const formatted = renderDate(e.target.value)
                                                let extra = {}
                                                if (formatted && field.id === "dob") {
                                                    extra.age = renderCalAge(formatted.slice(0, 4))
                                                }
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    [field.id]: formatted,
                                                    ...extra
                                                }))
                                            }}
                                            className="cursor-pointer"
                                        />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={value ? new Date(value) : undefined}
                                            onSelect={(date) => {
                                                let val = ""
                                                let extra = {}
                                                if (date) {
                                                    const y = date.getFullYear()
                                                    const m = String(date.getMonth() + 1).padStart(2, "0")
                                                    const d = String(date.getDate()).padStart(2, "0")
                                                    val = `${y}/${m}/${d}`
                                                    if (field.id === "dob") {
                                                        extra.age = renderCalAge(y)
                                                    }
                                                }
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    [field.id]: val,
                                                    ...extra
                                                }))
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <Input
                                    id={field.id}
                                    type={field.type === "number" ? "number" : field.type === "tel" ? "tel" : "text"}
                                    value={value}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            [field.id]: e.target.value
                                        }))
                                    }
                                />
                            )}
                            {errors[field.id] && (
                                <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
                            )}
                        </div>
                    )
                })}
            </div>
        </fieldset>
    )
}

export function RenderTextAreaQues({ question, formData, setFormData, commonFieldsetClasses, errors = {} }) {
    return (
        <fieldset key={question.id} className={commonFieldsetClasses}>
            <FormatLegend question={question} />
            <div>
                <Label htmlFor={question.id}>{question.label}</Label>
                <textarea
                    id={question.id}
                    className="w-full border rounded px-3 py-2 resize-y max-h-[300px] overflow-auto"
                    rows={4}
                    value={formData[question.id] || ""}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            [question.id]: e.target.value
                        }))
                    }
                />
                {errors[question.id] && (
                    <p className="text-red-500 text-sm mt-1">{errors[question.id]}</p>
                )}
            </div>
        </fieldset>
    )
}

export function RenderRadioQues({ question, formData, setFormData, commonFieldsetClasses, errors = {} }) {
    return (
        <fieldset key={question.id} className={commonFieldsetClasses}>
            <FormatLegend question={question} />
            <Select
                value={formData[question.id] || ""}
                onValueChange={(val) =>
                    setFormData((prev) => ({
                        ...prev,
                        [question.id]: val
                    }))
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
            {errors[question.id] && (
                <p className="text-red-500 text-sm mt-1">{errors[question.id]}</p>
            )}
        </fieldset>
    )
}

export function RenderCheckboxQues({ question, formData, setFormData, commonFieldsetClasses, errors = {} }) {
    return (
        <fieldset key={question.id} className={commonFieldsetClasses}>
            <FormatLegend question={question} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-4">
                {question.options.map((opt) => (
                    <div key={opt} className="flex items-center text-sm">
                        <Checkbox
                            id={`${question.id}-${opt}`}
                            checked={formData[question.id]?.includes(opt)}
                            onCheckedChange={(checked) => {
                                setFormData((prev) => {
                                    const currentValues = prev[question.id] || []
                                    if (checked) {
                                        return {
                                            ...prev,
                                            [question.id]: [...currentValues, opt]
                                        }
                                    } else {
                                        return {
                                            ...prev,
                                            [question.id]: currentValues.filter((v) => v !== opt)
                                        }
                                    }
                                })
                            }}
                        />
                        <Label htmlFor={`${question.id}-${opt}`} className="ml-2">
                            {opt}
                        </Label>
                    </div>
                ))}
            </div>
            {errors[question.id] && (
                <p className="text-red-500 text-sm mt-1">{errors[question.id]}</p>
            )}
        </fieldset>
    )
}

export function RenderOtherQues({ question, formData, setFormData, commonFieldsetClasses, errors = {} }) {
    return (
        <fieldset key={question.id} className={commonFieldsetClasses}>
            <FormatLegend question={question} />
            <div>
                <Label htmlFor={question.id}>{question.label}</Label>
                <Input
                    id={question.id}
                    type={question.type === "number" ? "number" : "text"}
                    value={formData[question.id] || ""}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            [question.id]: e.target.value
                        }))
                    }
                />
                {errors[question.id] && (
                    <p className="text-red-500 text-sm mt-1">{errors[question.id]}</p>
                )}
            </div>
        </fieldset>
    )
}