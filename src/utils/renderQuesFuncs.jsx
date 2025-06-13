import React from "react"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { Info } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import PainChartSection from "../features/report/components/user/HumanBody"


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
    const userGender = formData["gender"]?.toLowerCase?.()

    // 🧼 Gender logic: skip if female-only section and user is male
    if (
        (question.id === "femaleOnly" || question.id === "femaleOnlyDetails") &&
        userGender === "male"
    ) {
        return null
    }

    return (
        <fieldset key={question.id} className={commonFieldsetClasses}>
            <FormatLegend question={question} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                {question.fields?.map((field) => {
                    const value = formData[field.id] || ""

                    // 💡 Conditional field visibility

                    // Smoking conditionals
                    if (
                        ["packsPerDay", "smokingYears"].includes(field.id) &&
                        (formData["smokingStatus"] === "None" || formData["smokingStatus"] === "Never" || !formData["smokingStatus"])
                    ) return null

                    // Alcohol conditionals
                    if (
                        ["beerPerWeek", "liquorPerWeek", "winePerWeek", "alcoholYears"].includes(field.id) &&
                        (!formData["beerPerWeek"] && !formData["liquorPerWeek"] && !formData["winePerWeek"])
                    ) return null

                    // Exercise conditionals
                    if (
                        field.id === "exerciseHours" &&
                        (formData["exercise"] === "None" || !formData["exercise"])
                    ) return null

                    // Mental work conditionals
                    if (
                        field.id === "mentalWorkHours" &&
                        (formData["mentalWork"] === "None" || !formData["mentalWork"])
                    ) return null

                    // Physical work conditionals
                    if (
                        field.id === "physicalWorkHours" &&
                        (formData["physicalWork"] === "None" || !formData["physicalWork"])
                    ) return null

                    // Occupational status conditionals
                    if (
                        ["workTimes", "workHoursPerDay", "workDaysPerWeek", "jobDescription"].includes(field.id) &&
                        (formData["currentlyWorking"] === "No" || !formData["currentlyWorking"])
                    ) return null

                    return (
                        <div key={field.id} className="min-h-[100px]">
                            <div className="flex items-center gap-1">
                                <Label htmlFor={field.id}>{field.label}</Label>
                                {field.extra_info && (
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <Info size={14} className="text-muted-foreground cursor-pointer" />
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-72 text-sm">
                                            {field.extra_info}
                                        </HoverCardContent>
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

export function PainChar({ question, painMap, setPainMap }) {
    return (
        <fieldset key={question.id} className="border rounded-md p-4 space-y-4 mb-4 bg-card shadow-sm">
            <legend className="text-sm font-medium text-muted-foreground px-2">
                {question.label}
            </legend>
            <PainChartSection painMap={painMap} setPainMap={setPainMap} />
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

export function renderQuestionByType({ question, formData, setFormData, commonFieldsetClasses, painMap, setPainMap }) {
    const typeMap = {
        group: RenderQuesFuncs,
        textarea: RenderTextAreaQues,
        radio: RenderRadioQues,
        checkbox: RenderCheckboxQues,
        other: RenderOtherQues,
        painChart: PainChar
    }

    if (question.type === "painChart") {
        return (
            <fieldset key={question.id} className={commonFieldsetClasses}>
                <legend className="text-sm font-medium text-muted-foreground px-2">
                    {question.label}
                </legend>
                <PainChartSection painMap={painMap} setPainMap={setPainMap} />
            </fieldset>
        )
    }

    const Component = typeMap[question.type]
    if (!Component) return null

    return (
        <Component
            key={question.id}
            question={question}
            formData={formData}
            setFormData={setFormData}
            commonFieldsetClasses={commonFieldsetClasses}
        />
    )
}