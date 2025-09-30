import { useState } from "react";




import { toast } from "sonner";

const TreatmentPlanForm = ({ 
  patientId, 
  patientName, 
  onSubmit, 
  onCancel, 
  initialData = null,
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "Treatment Plan",
    diagnosis: initialData?.diagnosis || "",
    overallGoal: initialData?.overall_goal || "",
    totalDuration: initialData?.total_duration || "",
    totalAppointments: initialData?.total_appointments || 0,
    phases: initialData?.phases || [],
    notes: initialData?.notes || "",
    status: initialData?.status || "active"
  });

  const [currentPhase, setCurrentPhase] = useState({
    name: "",
    duration: "",
    appointmentsPerWeek: "",
    description: "",
    goals: "",
    exercises: "",
    notes: ""
  });

  const [errors, setErrors] = useState({});

  const totalWeeks = formData.phases.reduce((sum, phase) => sum + parseInt(phase.duration || 0), 0);
  const totalAppointmentsCalculated = formData.phases.reduce((sum, phase) => {
    const weeks = parseInt(phase.duration || 0);
    const perWeek = parseInt(phase.appointmentsPerWeek || 0);
    return sum + (weeks * perWeek);
  }, 0);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handlePhaseInputChange = (field, value) => {
    setCurrentPhase(prev => ({ ...prev, [field]: value }));
  };

  const addPhase = () => {
    if (!currentPhase.name || !currentPhase.duration || !currentPhase.appointmentsPerWeek) {
      toast.error("Please fill in all required phase fields");
      return;
    }

    const newPhase = {
      id: Date.now(),
      ...currentPhase,
      order: formData.phases.length + 1
    };

    setFormData(prev => ({
      ...prev,
      phases: [...prev.phases, newPhase]
    }));

    setCurrentPhase({
      name: "",
      duration: "",
      appointmentsPerWeek: "",
      description: "",
      goals: "",
      exercises: "",
      notes: ""
    });

    toast.success("Phase added successfully");
  };

  const removePhase = (phaseId) => {
    setFormData(prev => ({
      ...prev,
      phases: prev.phases.filter(phase => phase.id !== phaseId)
    }));
    toast.success("Phase removed");
  };

  const movePhase = (phaseId, direction) => {
    const phases = [...formData.phases];
    const index = phases.findIndex(phase => phase.id === phaseId);
    
    if (direction === 'up' && index > 0) {
      [phases[index], phases[index - 1]] = [phases[index - 1], phases[index]];
    } else if (direction === 'down' && index < phases.length - 1) {
      [phases[index], phases[index + 1]] = [phases[index + 1], phases[index]];
    }

    phases.forEach((phase, idx) => {
      phase.order = idx + 1;
    });

    setFormData(prev => ({ ...prev, phases }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.diagnosis.trim()) newErrors.diagnosis = "Diagnosis is required";
    if (!formData.overallGoal.trim()) newErrors.overallGoal = "Overall goal is required";
    if (formData.phases.length === 0) newErrors.phases = "At least one phase is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    const treatmentPlanData = {
      patient_id: patientId,
      type: "treatment_plan",
      title: formData.title,
      diagnosis: formData.diagnosis,
      overall_goal: formData.overallGoal,
      total_duration: totalWeeks,
      total_appointments: totalAppointmentsCalculated,
      phases: formData.phases.map(phase => ({
        name: phase.name,
        duration: parseInt(phase.duration),
        appointments_per_week: parseInt(phase.appointmentsPerWeek),
        description: phase.description,
        goals: phase.goals,
        exercises: phase.exercises,
        notes: phase.notes,
        order: phase.order
      })),
      notes: formData.notes,
      status: formData.status,
      created_at: new Date().toISOString()
    };

    onSubmit(treatmentPlanData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Treatment Plan</h2>
          <p className="text-muted-foreground">
            {isEditing ? "Edit" : "Create"} treatment plan for {patientName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? "Update" : "Create"} Plan
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Plan Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Lower Back Pain Treatment Plan"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="diagnosis">Diagnosis *</Label>
            <Textarea
              id="diagnosis"
              value={formData.diagnosis}
              onChange={(e) => handleInputChange("diagnosis", e.target.value)}
              placeholder="Primary diagnosis and any secondary conditions"
              rows={2}
              className={errors.diagnosis ? "border-red-500" : ""}
            />
            {errors.diagnosis && <p className="text-red-500 text-sm mt-1">{errors.diagnosis}</p>}
          </div>

          <div>
            <Label htmlFor="overallGoal">Overall Treatment Goal *</Label>
            <Textarea
              id="overallGoal"
              value={formData.overallGoal}
              onChange={(e) => handleInputChange("overallGoal", e.target.value)}
              placeholder="What is the main objective of this treatment plan?"
              rows={2}
              className={errors.overallGoal ? "border-red-500" : ""}
            />
            {errors.overallGoal && <p className="text-red-500 text-sm mt-1">{errors.overallGoal}</p>}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Treatment Phases
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Break down the treatment into phases with different appointment frequencies
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border rounded-lg p-4 bg-muted/20">
            <h4 className="font-semibold mb-4">Add New Phase</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="phaseName">Phase Name *</Label>
                <Input
                  id="phaseName"
                  value={currentPhase.name}
                  onChange={(e) => handlePhaseInputChange("name", e.target.value)}
                  placeholder="e.g., Acute Phase"
                />
              </div>
              <div>
                <Label htmlFor="phaseDuration">Duration (weeks) *</Label>
                <Input
                  id="phaseDuration"
                  type="number"
                  min="1"
                  value={currentPhase.duration}
                  onChange={(e) => handlePhaseInputChange("duration", e.target.value)}
                  placeholder="e.g., 4"
                />
              </div>
              <div>
                <Label htmlFor="appointmentsPerWeek">Appointments/Week *</Label>
                <Input
                  id="appointmentsPerWeek"
                  type="number"
                  min="1"
                  max="7"
                  value={currentPhase.appointmentsPerWeek}
                  onChange={(e) => handlePhaseInputChange("appointmentsPerWeek", e.target.value)}
                  placeholder="e.g., 3"
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="phaseDescription">Phase Description</Label>
              <Textarea
                id="phaseDescription"
                value={currentPhase.description}
                onChange={(e) => handlePhaseInputChange("description", e.target.value)}
                placeholder="Describe what this phase focuses on"
                rows={2}
              />
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phaseGoals">Phase Goals</Label>
                <Textarea
                  id="phaseGoals"
                  value={currentPhase.goals}
                  onChange={(e) => handlePhaseInputChange("goals", e.target.value)}
                  placeholder="Specific goals for this phase"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="phaseExercises">Exercises/Treatments</Label>
                <Textarea
                  id="phaseExercises"
                  value={currentPhase.exercises}
                  onChange={(e) => handlePhaseInputChange("exercises", e.target.value)}
                  placeholder="Exercises or treatments for this phase"
                  rows={2}
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="phaseNotes">Phase Notes</Label>
              <Textarea
                id="phaseNotes"
                value={currentPhase.notes}
                onChange={(e) => handlePhaseInputChange("notes", e.target.value)}
                placeholder="Additional notes for this phase"
                rows={2}
              />
            </div>
            <Button onClick={addPhase} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Add Phase
            </Button>
          </div>

          {formData.phases.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold">Treatment Phases ({formData.phases.length})</h4>
              {formData.phases.map((phase, index) => (
                <Card key={phase.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">Phase {phase.order}</Badge>
                        <h5 className="font-semibold">{phase.name}</h5>
                        <Badge variant="outline">
                          {phase.duration} weeks × {phase.appointmentsPerWeek}/week
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => movePhase(phase.id, 'up')}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => movePhase(phase.id, 'down')}
                          disabled={index === formData.phases.length - 1}
                        >
                          ↓
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePhase(phase.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {phase.description && (
                      <p className="text-sm text-muted-foreground mb-2">{phase.description}</p>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {phase.goals && (
                        <div>
                          <strong>Goals:</strong> {phase.goals}
                        </div>
                      )}
                      {phase.exercises && (
                        <div>
                          <strong>Exercises:</strong> {phase.exercises}
                        </div>
                      )}
                    </div>
                    
                    {phase.notes && (
                      <div className="mt-2 text-sm">
                        <strong>Notes:</strong> {phase.notes}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {errors.phases && <p className="text-red-500 text-sm">{errors.phases}</p>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Treatment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalWeeks}</div>
              <div className="text-sm text-blue-600">Total Weeks</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{totalAppointmentsCalculated}</div>
              <div className="text-sm text-green-600">Total Appointments</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{formData.phases.length}</div>
              <div className="text-sm text-purple-600">Treatment Phases</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            placeholder="Any additional notes, considerations, or special instructions for this treatment plan"
            rows={4}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TreatmentPlanForm; 
