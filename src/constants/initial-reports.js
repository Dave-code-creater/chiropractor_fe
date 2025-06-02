const PATIENT_INFO = [
    {
        id: "1",
        title: "Patient Intake Form",
        questions: [
            {
                id: "patientName",
                label: "Patient Name",
                type: "group",
                fields: [
                    { id: "firstName", label: "First", type: "text" },
                    { id: "middleName", label: "Middle", type: "text" },
                    { id: "lastName", label: "Last", type: "text" }
                ]
            },
            { id: "ssn", label: "SSN", type: "text" },
            {
                id: "dobGender",
                label: "Date of Birth, Age & Gender",
                type: "group",
                fields: [
                    { id: "dobMonth", label: "Month", type: "number" },
                    { id: "dobDay", label: "Day", type: "number" },
                    { id: "dobYear", label: "Year", type: "number" },
                    {
                        id: "age",
                        label: "Age",
                        type: "number",
                        calculated: true,
                        extra_info: "Age will be automatically calculated from the date of birth."
                    },
                    {
                        id: "gender",
                        label: "Gender",
                        type: "radio",
                        options: ["Male", "Female", "Others"],
                        extra_info: "Select the gender you most identify with."
                    }
                ]
            },
            {
                id: "statusNationality",
                label: "Marital Status & Nationality",
                type: "group",
                fields: [
                    {
                        id: "status",
                        label: "Status",
                        type: "radio",
                        options: ["Single", "Married", "Widowed", "Divorced"],
                        extra_info: "Choose your current marital status."
                    },
                    {
                        id: "nationality",
                        label: "Nationality",
                        type: "radio",
                        options: ["Asian", "Black", "Caucasian", "Hispanic", "Other"],
                        extra_info: "Select the ethnicity or race you most closely identify with."
                    }
                ]
            },
            {
                id: "homeAddress",
                label: "Home Address",
                type: "group",
                fields: [
                    { id: "street", label: "Street", type: "text" },
                    { id: "city", label: "City", type: "text" },
                    { id: "state", label: "State", type: "text" },
                    { id: "zip", label: "Zip", type: "text" },
                    {
                        id: "homePhone",
                        label: "Home Phone",
                        type: "tel",
                        extra_info: "Include area code. Example: (123) 456-7890."
                    }
                ]
            },
            {
                id: "employmentInfo",
                label: "Employment & Occupation",
                type: "group",
                fields: [
                    { id: "employer", label: "Patient Employed By", type: "text" },
                    { id: "occupation", label: "Occupation", type: "text" },
                    { id: "workAddress", label: "Work Address", type: "text" },
                    {
                        id: "workPhone",
                        label: "Work Phone",
                        type: "tel",
                        extra_info: "Include area code. If none, leave blank."
                    }
                ]
            },
            {
                id: "spouseInfo",
                label: "Spouse Information",
                type: "group",
                fields: [
                    { id: "spouseFirst", label: "First", type: "text" },
                    { id: "spouseMiddle", label: "Middle", type: "text" },
                    { id: "spouseLast", label: "Last", type: "text" },
                    { id: "spouseSSN", label: "SSN", type: "text" },
                    { id: "spouseEmployer", label: "Employed By", type: "text" },
                    {
                        id: "spousePhone",
                        label: "Phone",
                        type: "tel",
                        extra_info: "Include area code if known."
                    },
                ]
            },
            {
                id: "emergencyContacts",
                label: "Emergency Contacts",
                type: "group",
                fields: [
                    {
                        id: "contact1",
                        label: "Contact Person Name",
                        type: "text",
                        extra_info: "Include full name of the contact person."
                    },
                    {
                        id: "contact1Phone",
                        label: "Phone",
                        type: "tel",
                        extra_info: "Include area code. Example: (123) 456-7890."
                    },
                    {
                        id: "contact1Relationship",
                        label: "Relationship",
                        type: "radio",
                        options: ["Spouse", "Parent", "Sibling", "Child", "Friend", "Other"],
                        extra_info: "Select the relationship of the contact person to you."

                    }],
                extra_info: "Include full name, relationship, and phone number. You may list more than one contact."
            }
        ]
    },
    {
        id: "2",
        title: "Accident & Insurance Details",
        questions: [
            {
                id: "mainComplaints",
                label: "What are your main problems (complaints / pains)?",
                type: "textarea"
            },
            {
                id: "previousHealthcare",
                label: "What other health care have you received for this problem(s)?",
                type: "textarea"
            },
            {
                id: "accidentDetails",
                label: "Accident or Illness Details",
                type: "group",
                fields: [
                    {
                        id: "accidentDate",
                        label: "Date of Accident / Beginning of Illness",
                        type: "text",
                        extra_info: "Use MM/DD/YYYY format."
                    },
                    {
                        id: "accidentTime",
                        label: "Time",
                        type: "text",
                        extra_info: "Include exact or approximate time of the event."
                    },
                    {
                        id: "accidentTimePeriod",
                        label: "AM / PM",
                        type: "radio",
                        options: ["AM", "PM"]
                    },
                    {
                        id: "accidentLocation",
                        label: "Location of Accident",
                        type: "text",
                        extra_info: "Provide the city, address, or general location where the accident occurred."
                    },
                    {
                        id: "accidentType",
                        label: "How did it occur?",
                        type: "radio",
                        options: ["Auto Collision", "On the job", "Other"],
                        extra_info: "Select the option that best describes how the injury occurred."
                    },
                    {
                        id: "accidentDescription",
                        label: "Please describe the circumstances",
                        type: "textarea",
                        extra_info: "Describe what happened in your own words. Be as specific as possible."
                    }
                ]
            },
            {
                id: "lostWork",
                label: "Have you lost time from work?",
                type: "group",
                fields: [
                    {
                        id: "lostWorkYesNo",
                        label: "Lost Time",
                        type: "radio",
                        options: ["Yes", "No"]
                    },
                    {
                        id: "lostWorkDates",
                        label: "Dates",
                        type: "text",
                        extra_info: "Indicate the dates you missed work, if applicable. Example: Jan 1–Jan 10."
                    }
                ]
            },
            {
                id: "femaleOnly",
                label: "Female Specific",
                type: "group",
                fields: [
                    {
                        id: "pregnant",
                        label: "Are you pregnant?",
                        type: "radio",
                        options: ["Yes", "No"],
                        extra_info: "Only answer if applicable."
                    },
                    {
                        id: "childrenInfo",
                        label: "Number & Ages of Children",
                        type: "text"
                    }
                ]
            },
            {
                id: "insuranceCoverage",
                label: "Is this case covered by insurance?",
                type: "group",
                fields: [
                    {
                        id: "covered",
                        label: "Covered by Insurance",
                        type: "radio",
                        options: ["Yes", "No"]
                    },
                    {
                        id: "insuranceType",
                        label: "Type of Insurance",
                        type: "radio",
                        options: [
                            "Group Insurance",
                            "Blue Cross / Blue Shield",
                            "Worker’s Compensation",
                            "Auto Insurance",
                            "Medicare",
                            "Personal Injury",
                            "Other Insurance"
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "3",
        title: "Pain & Symptom Evaluation",
        questions: [
            {
                id: "painChart",
                label: "Where do you feel pain?",
                type: "image-map",
                extra_info: "Click on the parts of the body that hurt. You can select multiple areas by clicking them one by one."
            },
            {
                id: "painIntensity",
                label: "How much does it hurt?",
                type: "group",
                fields: [
                    { id: "headache", label: "Headache", type: "slider", min: 0, max: 10 },
                    { id: "neck", label: "Neck", type: "slider", min: 0, max: 10 },
                    { id: "upperBack", label: "Upper Back", type: "slider", min: 0, max: 10 },
                    { id: "midBack", label: "Mid Back", type: "slider", min: 0, max: 10 },
                    { id: "lowerBack", label: "Lower Back", type: "slider", min: 0, max: 10 },
                    { id: "arms", label: "Arms", type: "slider", min: 0, max: 10 },
                    { id: "legs", label: "Legs", type: "slider", min: 0, max: 10 }
                ]
            },
            {
                id: "painType",
                label: "What kind of pain do you feel?",
                type: "checkbox",
                options: ["Sharp", "Dull", "Burning", "Aching", "Stabbing", "Muscle tension", "Numbness", "Pins & Needles"],
                extra_info: "Check all types of pain that apply to your condition."
            },
            {
                id: "painTiming",
                label: "How often is the pain present?",
                type: "radio",
                options: ["Constant", "Comes and goes", "Worse with activity", "Twice a day", "Once a day", "Daily", "Monthly"]
            },
            {
                id: "painChanges",
                label: "Is the pain better, worse, or the same today?",
                type: "radio",
                options: ["Same", "Better", "Worse"]
            },
            {
                id: "painTriggers",
                label: "What makes it worse?",
                type: "checkbox",
                options: ["Sitting", "Standing", "Working", "Lifting", "Sleeping", "Bending", "Twisting", "Other"],
                extra_info: "What actions or conditions worsen your pain? Select all that apply."
            },
            {
                id: "radiatingPain",
                label: "Does the pain travel or radiate?",
                type: "radio",
                options: ["Yes", "No"],
                extra_info: "Does the pain move from one area to another (e.g., from back to legs)?"
            }
        ]
    },
    {
        id: "4",
        title: "Detailed Symptom Description",
        questions: [
            {
                id: "symptomDetails",
                label: "Please describe your symptoms, history, and onset as best you can.",
                type: "textarea",
                extra_info: "Include when your symptoms began, how they have changed, and any previous treatments."
            }
        ]
    },
    {
        id: "5",
        title: "Recovery and Work Impact",
        questions: [
            {
                id: "workActivities",
                label: "Please describe your work activities and how your condition affects them.",
                type: "checkbox",
                options: ["Standing", "Sitting", "Walking", "Driving", "Typing", "Lifting", "Bending", "Twisting", "Stooping", "Operating Equipment", "Other"],
                extra_info: "Select the activities that are part of your work and are currently affected by your condition."
            }
        ]
    },
    {
        id: "6",
        title: "Extended Health History",
        questions: [
            {
                id: "pastMedicalHistory",
                label: "Past Medical History",
                type: "group",
                fields: [
                    {
                        id: "hasMedicalCondition",
                        label: "Do you have any past medical conditions?",
                        type: "radio",
                        options: ["No major medical history", "Yes, I do have a past medical condition(s)"]
                    },
                    {
                        id: "medicalConditionDetails",
                        label: "Describe your past medical condition(s)",
                        type: "textarea"
                    }
                ]
            },
            {
                id: "pastSurgicalHistory",
                label: "Past Surgical History",
                type: "group",
                fields: [
                    {
                        id: "hasSurgicalHistory",
                        label: "Do you have any past surgical history?",
                        type: "radio",
                        options: ["No major surgical history", "Yes, I do have a past surgical history"]
                    },
                    {
                        id: "surgicalHistoryDetails",
                        label: "Explain your surgical history",
                        type: "textarea"
                    }
                ]
            },
            {
                id: "medication",
                label: "Medication",
                type: "group",
                fields: [
                    {
                        id: "isTakingMedication",
                        label: "Are you currently taking any medication?",
                        type: "radio",
                        options: ["Not taking any medications", "Yes, I am currently taking a medication"]
                    },
                    {
                        id: "medicationNames",
                        label: "Name of medication(s)",
                        type: "textarea"
                    }
                ]
            },
            {
                id: "familyHistory",
                label: "Family History",
                type: "custom-table",
                columns: ["Relative", "Age if Living", "Age at Death", "Cause of Death", "Illnesses"],
                rows: ["Father", "Mother", "Brother(s)", "Sister(s)"],
                extra_info: "Please fill in as much as you can about your immediate family."
            },
            {
                id: "socialHistory",
                label: "Social History",
                type: "group",
                fields: [
                    { id: "currentWeight", label: "Current Weight", type: "text" },
                    { id: "recentWeightChange", label: "Have you recently lost or gained weight?", type: "text" },
                    {
                        id: "mentalWork",
                        label: "Mental work level",
                        type: "radio",
                        options: ["Heavy", "Moderate", "Light"]
                    },
                    { id: "mentalWorkHours", label: "Mental work hours/day", type: "text" },
                    {
                        id: "physicalWork",
                        label: "Physical work level",
                        type: "radio",
                        options: ["Heavy", "Moderate", "Light"]
                    },
                    { id: "physicalWorkHours", label: "Physical work hours/day", type: "text" },
                    {
                        id: "exercise",
                        label: "Exercise level",
                        type: "radio",
                        options: ["Heavy", "Moderate", "Light"]
                    },
                    { id: "exerciseHours", label: "Exercise hours/day", type: "text" },
                    {
                        id: "smokingStatus",
                        label: "Smoking status",
                        type: "radio",
                        options: ["Current", "Previous"]
                    },
                    { id: "packsPerDay", label: "Packs per day", type: "text" },
                    { id: "smokingYears", label: "Number of years smoking", type: "text" },
                    { id: "beerPerWeek", label: "Beer per week", type: "text" },
                    { id: "liquorPerWeek", label: "Liquor per week", type: "text" },
                    { id: "winePerWeek", label: "Wine per week", type: "text" },
                    { id: "alcoholYears", label: "Number of years drinking", type: "text" }
                ]
            },
            {
                id: "occupationalHistory",
                label: "Occupational History",
                type: "group",
                fields: [
                    {
                        id: "currentlyWorking",
                        label: "Are you currently working?",
                        type: "radio",
                        options: ["YES", "NO"]
                    },
                    {
                        id: "workTimes",
                        label: "Work Times",
                        type: "radio",
                        options: ["Full Time", "Part Time"]
                    },
                    { id: "workHoursPerDay", label: "Hours per day", type: "text" },
                    { id: "workDaysPerWeek", label: "Days per week", type: "text" },
                    {
                        id: "jobDescription",
                        label: "Describe your present job requirements",
                        type: "textarea"
                    }
                ]
            },
            {
                id: "femaleOnlyDetails",
                label: "Female Specific",
                type: "group",
                fields: [
                    {
                        id: "lastMenstrualPeriod",
                        label: "When was your last menstrual period?",
                        type: "text",
                        extra_info: "Weeks ago"
                    },
                    {
                        id: "isPregnantNow",
                        label: "Are you or could you be pregnant?",
                        type: "radio",
                        options: ["YES", "NO"]
                    },
                    {
                        id: "weeksPregnant",
                        label: "If yes, number of weeks",
                        type: "text"
                    }
                ]
            }
        ]
    }
];

export default PATIENT_INFO;