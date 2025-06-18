import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle } from "lucide-react";
import { useGetHealthConditionsQuery } from "@/services/reportApi";

export default function ConditionsCard() {
    const { data, isLoading } = useGetHealthConditionsQuery();
    const conditions = data?.metadata ?? data ?? [];
    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-gray-500" />
                    Conditions
                </CardTitle>
            </CardHeader>
            <ScrollArea className="max-h-[300px] h-full">
                <CardContent className="space-y-4 h-full">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : conditions.length > 0 ? (
                        conditions.map(({ name, severityLabel, severityClass, description, primary }) => (
                            <div key={name} className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <p className="font-medium text-sm">{name}</p>
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${severityClass}`}>
                                        {severityLabel}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700">{description}</p>
                                <p className="text-xs text-gray-500">Primary: {primary}</p>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-sm text-muted-foreground text-center py-6">
                            <AlertTriangle className="w-6 h-6 mb-2 text-gray-400" />
                            No conditions recorded.
                        </div>
                    )}
                </CardContent>
            </ScrollArea>
        </Card>
    );
}