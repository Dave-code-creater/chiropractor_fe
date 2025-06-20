import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import PainChartSection from "../HumanBody";

export default function PainEvaluationForm({
  painEvaluations,
  setPainEvaluations,
  onSubmit,
  onBack,
  isLast = false,
}) {
  const evaluation = painEvaluations[0] || { painMap: {}, formData: {} };

  const handleFormDataChange = (updater) => {
    setPainEvaluations((prev) => {
      const list = [...prev];
      const curr = list[0] || { painMap: {}, formData: {} };
      const newData = typeof updater === "function" ? updater(curr.formData || {}) : updater;
      list[0] = { ...curr, formData: newData };
      return list;
    });
  };

  const handlePainMapChange = (updater) => {
    setPainEvaluations((prev) => {
      const list = [...prev];
      const curr = list[0] || { painMap: {}, formData: {} };
      const newMap = typeof updater === "function" ? updater(curr.painMap || {}) : updater;
      list[0] = { ...curr, painMap: newMap };
      return list;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(painEvaluations);
  };

  const painTypes = ["Sharp", "Dull", "Burning", "Aching"];

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Pain &amp; Symptom Evaluation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <PainChartSection
            gender={evaluation.formData.gender}
            painMap={evaluation.painMap}
            setPainMap={handlePainMapChange}
            formData={evaluation.formData}
            setFormData={handleFormDataChange}
          />

          <fieldset className="border rounded-md p-4 space-y-2">
            <legend className="text-sm font-medium text-muted-foreground px-2">Pain Type</legend>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {painTypes.map((opt) => (
                <div key={opt} className="flex items-center text-sm">
                  <Checkbox
                    id={`painType-${opt}`}
                    checked={evaluation.formData.painType?.includes(opt)}
                    onCheckedChange={(checked) =>
                      handleFormDataChange((p) => {
                        const curr = p.painType || [];
                        return {
                          ...p,
                          painType: checked ? [...curr, opt] : curr.filter((v) => v !== opt),
                        };
                      })
                    }
                  />
                  <Label htmlFor={`painType-${opt}`} className="ml-2">
                    {opt}
                  </Label>
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset className="border rounded-md p-4 space-y-2">
            <legend className="text-sm font-medium text-muted-foreground px-2">Pain Level</legend>
            <Select
              value={evaluation.formData.painLevel || ""}
              onValueChange={(val) => handleFormDataChange((p) => ({ ...p, painLevel: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {["Mild", "Moderate", "Severe"].map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </fieldset>

          <div className="flex justify-between pt-4">
            {onBack && (
              <Button type="button" variant="outline" onClick={onBack}>
                Previous
              </Button>
            )}
            <Button type="submit">{isLast ? "Save" : "Next"}</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
