import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PATIENT_INFO from "../../../../constants/initial-reports";


export default function InsuranceDetails({ formData, setFormData }) {
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