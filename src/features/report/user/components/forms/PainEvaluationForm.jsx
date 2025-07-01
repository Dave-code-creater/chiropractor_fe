import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      const newData =
        typeof updater === "function" ? updater(curr.formData || {}) : updater;
      list[0] = { ...curr, formData: newData };
      return list;
    });
  };

  const handlePainMapChange = (updater) => {
    setPainEvaluations((prev) => {
      const list = [...prev];
      const curr = list[0] || { painMap: {}, formData: {} };
      const newMap =
        typeof updater === "function" ? updater(curr.painMap || {}) : updater;
      list[0] = { ...curr, painMap: newMap };
      return list;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(painEvaluations);
  };

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
