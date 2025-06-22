import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle } from "lucide-react";
import { useGetHealthConditionsQuery } from "@/services/reportApi";

export default function ConditionsCard() {
    const { data, isLoading } = useGetHealthConditionsQuery();
    const conditions = data?.metadata ?? data ?? [];
    return (
        <Card className="w-full h-full border-0 shadow-lg bg-gradient-to-br from-card to-muted/20 hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] backdrop-blur-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <AlertTriangle className="w-4 h-4 text-primary" />
                    </div>
                    Conditions
                </CardTitle>
            </CardHeader>
            <ScrollArea className="max-h-[300px] h-full">
                <CardContent className="h-full">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : conditions.length > 0 ? (
                        conditions.map((condition, idx) => (
                            <div key={idx} className="mb-4 p-4 rounded-lg bg-background/50 border border-border/50">
                                <div className="space-y-2">
                                    <h4 className="font-medium text-foreground">{condition.name || condition.title}</h4>
                                    {condition.description && (
                                        <p className="text-sm text-muted-foreground">{condition.description}</p>
                                    )}
                                    {condition.severity && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-muted-foreground">Severity:</span>
                                            <span className={`text-xs px-2 py-1 rounded ${
                                                condition.severity === 'high' ? 'bg-red-100 text-red-700' :
                                                condition.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                                {condition.severity}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <div className="p-4 rounded-full bg-muted/50 mb-4">
                                <AlertTriangle className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <p className="text-sm text-muted-foreground">No conditions recorded.</p>
                        </div>
                    )}
                </CardContent>
            </ScrollArea>
        </Card>
    );
}