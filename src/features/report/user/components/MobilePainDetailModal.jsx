


const MobilePainDetailModal = ({
    isOpen,
    onClose,
    field,
    pendingLevel,
    setPendingLevel,
    painMap,
    setPainMap,
    openFieldId,
    objectHuman,
}) => {
    if (!isOpen || !field || !openFieldId) return null;

    const handleSliderChange = (value) => {
        setPendingLevel(value[0]);
    };

    const saveDialog = () => {
        if (!openFieldId) return;

        const currentData = painMap[openFieldId] || {};
        const bodyPartData = {
            ...currentData,
            "pain-level": pendingLevel,
            "selected-at": currentData["selected-at"] || new Date().toISOString(),
            "body-part": openFieldId
        };

        setPainMap((prev) => ({
            ...prev,
            [openFieldId]: bodyPartData,
        }));
        onClose();
    };

    const removeDialog = () => {
        if (!openFieldId) return;
        setPainMap((prev) => {
            const map = { ...prev };
            delete map[openFieldId];
            return map;
        });
        onClose();
    };

    const newrenderQuestion = (question) => {
        const commonFieldsetClasses = "border rounded-md p-4 space-y-4 bg-white";
        const currentBodyPartData = painMap[openFieldId] || {};

        const bodyPartFormData = {
            [question.id]: question.id === 'painType' ? currentBodyPartData['pain-types'] || [] :
                question.id === 'painLevel' ? currentBodyPartData['pain-severity'] || [] :
                    question.id === 'painTiming' ? currentBodyPartData['pain-timing'] || "" :
                        question.id === 'painChanges' ? currentBodyPartData['pain-changes'] || "" :
                            question.id === 'radiatingPain' ? currentBodyPartData['radiating-pain'] || "" :
                                currentBodyPartData[question.id] || (question.type === 'checkbox' ? [] : "")
        };

        const setBodyPartFormData = (updater) => {
            setPainMap((prev) => {
                const updated = typeof updater === 'function' ? updater(bodyPartFormData) : updater;
                const newBodyPartData = { ...currentBodyPartData };

                if (question.id === 'painType') {
                    newBodyPartData['pain-types'] = updated[question.id];
                } else if (question.id === 'painLevel') {
                    newBodyPartData['pain-severity'] = updated[question.id];
                } else if (question.id === 'painTiming') {
                    newBodyPartData['pain-timing'] = updated[question.id];
                } else if (question.id === 'painChanges') {
                    newBodyPartData['pain-changes'] = updated[question.id];
                } else if (question.id === 'radiatingPain') {
                    newBodyPartData['radiating-pain'] = updated[question.id];
                } else {
                    newBodyPartData[question.id] = updated[question.id];
                }

                return {
                    ...prev,
                    [openFieldId]: newBodyPartData
                };
            });
        };

        if (question.type === "group") {
            return (
                <RenderQuesFuncs
                    question={question}
                    formData={bodyPartFormData}
                    setFormData={setBodyPartFormData}
                    commonFieldsetClasses={commonFieldsetClasses}
                />
            );
        } else if (question.type === "textarea") {
            return (
                <RenderTextAreaQues
                    question={question}
                    formData={bodyPartFormData}
                    setFormData={setBodyPartFormData}
                    commonFieldsetClasses={commonFieldsetClasses}
                />
            );
        } else if (question.type === "radio") {
            return (
                <RenderRadioQues
                    question={question}
                    formData={bodyPartFormData}
                    setFormData={setBodyPartFormData}
                    commonFieldsetClasses={commonFieldsetClasses}
                />
            );
        } else if (question.type === "checkbox") {
            return (
                <RenderCheckboxQues
                    question={question}
                    formData={bodyPartFormData}
                    setFormData={setBodyPartFormData}
                    commonFieldsetClasses={commonFieldsetClasses}
                />
            );
        } else {
            return (
                <RenderOtherQues
                    question={question}
                    formData={bodyPartFormData}
                    setFormData={setBodyPartFormData}
                    commonFieldsetClasses={commonFieldsetClasses}
                />
            );
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="p-2"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-lg font-semibold truncate mx-2">
                    {field.label} Details
                </h2>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="p-2"
                >
                    <X className="h-5 w-5" />
                </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Pain Level</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center">
                            <Label className="font-semibold text-lg block mb-3">
                                {field.label}
                            </Label>
                            <div className="w-full space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium min-w-[20px]">1</span>
                                    <Slider
                                        min={1}
                                        max={10}
                                        step={1}
                                        value={[pendingLevel]}
                                        onValueChange={handleSliderChange}
                                        className="flex-1 h-8"
                                    />
                                    <span className="text-sm font-medium min-w-[20px]">10</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-600 px-1">
                                    <span>Minimal</span>
                                    <span>Maximum</span>
                                </div>
                                <div className="text-center">
                                    <div className="inline-block bg-blue-100 text-blue-800 font-bold text-xl py-3 px-6 rounded-lg">
                                        {pendingLevel} / 10
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                        Additional Information
                    </h3>
                    {objectHuman.questions.map((question) => (
                        <Card key={question.id} className="shadow-sm">
                            <CardContent className="p-4">
                                <div className="space-y-3">
                                    {newrenderQuestion(question)}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <div className="border-t bg-white p-4 space-y-3">
                {openFieldId && painMap[openFieldId] !== undefined && (
                    <Button
                        variant="destructive"
                        onClick={removeDialog}
                        className="w-full"
                        size="lg"
                    >
                        Remove This Area
                    </Button>
                )}
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                        size="lg"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={saveDialog}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        size="lg"
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MobilePainDetailModal;
