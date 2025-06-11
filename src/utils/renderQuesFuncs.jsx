import React from "react"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { Info } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

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

export function RenderQuesFuncs({ question, formData, setFormData, commonFieldsetClasses }) {
    return (
        <fieldset key={question.id} className={commonFieldsetClasses}>
            <FormatLegend question={question} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                {question.fields?.map((field) => {
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
                            ) : (
                                <Input
                                    id={field.id}
                                    type={field.type === "number" ? "number" : "text"}
                                    value={value}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            [field.id]: e.target.value
                                        }))
                                    }
                                />
                            )}
                        </div>
                    )
                })}
            </div>
        </fieldset>
    )
}

export function RenderTextAreaQues({ question, formData, setFormData, commonFieldsetClasses }) {
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
            </div>
        </fieldset>
    )
}

export function RenderRadioQues({ question, formData, setFormData, commonFieldsetClasses }) {
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
        </fieldset>
    )
}

export function RenderCheckboxQues({ question, formData, setFormData, commonFieldsetClasses }) {
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
        </fieldset>
    )
}

export function RenderOtherQues({ question, formData, setFormData, commonFieldsetClasses }) {
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
            </div>
        </fieldset>
    )
}