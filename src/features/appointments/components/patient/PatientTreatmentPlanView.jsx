import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Calendar,
    ClipboardList,
    Target,
    TrendingUp,
    CheckCircle,
    Clock,
    AlertCircle,
    Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetTreatmentPlanQuery } from "@/api";

/**
 * Patient Treatment Plan View Component
 * Displays the treatment plan created by the doctor and allows patients to book appointments
 */
const PatientTreatmentPlanView = ({ incidentId, patientId }) => {
    const navigate = useNavigate();
    const [selectedPhase, setSelectedPhase] = useState(null);

    const {
        data: treatmentPlanData,
        isLoading,
        error
    } = useGetTreatmentPlanQuery(incidentId, { skip: !incidentId });

    const treatmentPlan = treatmentPlanData?.data;

    const handleBookAppointment = (phaseIndex = null) => {
        // Navigate to appointment booking with context
        navigate('/appointments/book', {
            state: {
                treatmentPlanId: treatmentPlan?.id,
                phaseIndex,
                incidentId,
                patientId
            }
        });
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold text-muted-foreground">
                        Loading Treatment Plan...
                    </h3>
                </CardContent>
            </Card>
        );
    }

    if (error || !treatmentPlan) {
        return (
            <Card className="border-l-4 border-l-yellow-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-700">
                        <AlertCircle className="w-5 h-5" />
                        No Treatment Plan Yet
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        Your doctor hasn't created a treatment plan for this case yet. Once they review your
                        initial report and create a plan, you'll be able to book appointments based on their
                        recommendations.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        You can still book appointments, but having a treatment plan helps structure your
                        recovery journey.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const phases = treatmentPlan.phases || treatmentPlan.treatment_phases || [];
    const totalAppointments = treatmentPlan.total_appointments || 0;
    const completedAppointments = 0; // TODO: Get from actual appointment data
    const progress = totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0;

    return (
        <div className="space-y-6">
            {/* Treatment Plan Overview */}
            <Card className="border-l-4 border-l-primary">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardList className="w-5 h-5" />
                                Your Treatment Plan
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Created by your doctor to guide your recovery
                            </p>
                        </div>
                        <Badge variant="secondary" className="text-sm px-3 py-1">
                            {treatmentPlan.status?.toUpperCase() || 'ACTIVE'}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Diagnosis & Goal */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold text-sm text-muted-foreground mb-2">Diagnosis</h4>
                            <p className="text-sm">{treatmentPlan.diagnosis || 'N/A'}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm text-muted-foreground mb-2">Treatment Goal</h4>
                            <p className="text-sm">{treatmentPlan.overall_goal || treatmentPlan.treatment_goals || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Progress */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-sm text-muted-foreground">Overall Progress</h4>
                            <span className="text-sm font-medium">{completedAppointments} / {totalAppointments} Sessions</span>
                        </div>
                        <Progress value={progress} className="h-3" />
                        <p className="text-xs text-muted-foreground mt-2">
                            {totalAppointments - completedAppointments} sessions remaining
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div className="text-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-2">
                                <Calendar className="w-6 h-6 text-primary" />
                            </div>
                            <p className="text-lg font-bold">{treatmentPlan.total_duration || 0}</p>
                            <p className="text-xs text-muted-foreground">Weeks</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto mb-2">
                                <Target className="w-6 h-6 text-green-600" />
                            </div>
                            <p className="text-lg font-bold">{phases.length}</p>
                            <p className="text-xs text-muted-foreground">Phases</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mx-auto mb-2">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="text-lg font-bold">{totalAppointments}</p>
                            <p className="text-xs text-muted-foreground">Total Sessions</p>
                        </div>
                    </div>

                    {/* Book Appointment Button */}
                    <Button 
                        onClick={() => handleBookAppointment()}
                        className="w-full"
                        size="lg"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Book Next Appointment
                    </Button>
                </CardContent>
            </Card>

            {/* Treatment Phases */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Treatment Phases</h3>
                <div className="space-y-4">
                    {phases.map((phase, index) => {
                        const phaseWeeks = phase.duration || 0;
                        const appointmentsPerWeek = phase.appointments_per_week || phase.appointmentsPerWeek || 0;
                        const totalPhaseAppointments = phaseWeeks * appointmentsPerWeek;

                        return (
                            <Card 
                                key={index}
                                className="hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => setSelectedPhase(selectedPhase === index ? null : index)}
                            >
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <CardTitle className="text-base">{phase.name}</CardTitle>
                                                <p className="text-sm text-muted-foreground">
                                                    {phaseWeeks} weeks • {appointmentsPerWeek}x per week
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">
                                                {totalPhaseAppointments} sessions
                                            </Badge>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleBookAppointment(index);
                                                }}
                                            >
                                                <Calendar className="w-4 h-4 mr-1" />
                                                Book
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                {selectedPhase === index && (
                                    <CardContent className="space-y-4 border-t pt-4">
                                        {phase.description && (
                                            <div>
                                                <h5 className="font-semibold text-sm text-muted-foreground mb-1">Phase Focus</h5>
                                                <p className="text-sm">{phase.description}</p>
                                            </div>
                                        )}
                                        {phase.goals && (
                                            <div>
                                                <h5 className="font-semibold text-sm text-muted-foreground mb-1">Goals</h5>
                                                <p className="text-sm">{phase.goals}</p>
                                            </div>
                                        )}
                                        {phase.exercises && (
                                            <div>
                                                <h5 className="font-semibold text-sm text-muted-foreground mb-1">Recommended Exercises</h5>
                                                <p className="text-sm">{phase.exercises}</p>
                                            </div>
                                        )}
                                        {phase.notes && (
                                            <div>
                                                <h5 className="font-semibold text-sm text-muted-foreground mb-1">Additional Notes</h5>
                                                <p className="text-sm text-muted-foreground">{phase.notes}</p>
                                            </div>
                                        )}
                                        <div className="pt-2">
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleBookAppointment(index);
                                                }}
                                                variant="default"
                                                className="w-full"
                                            >
                                                <Calendar className="w-4 h-4 mr-2" />
                                                Book Appointment for Phase {index + 1}
                                            </Button>
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Additional Notes */}
            {treatmentPlan.notes && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            Doctor's Notes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{treatmentPlan.notes}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default PatientTreatmentPlanView;
