import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    values: {
        firstName: "",
        lastName: "",
        dayOfBirth: "",
        monthOfBirth: "",
        yearOfBirth: "",
        gender: "",
        mariedStatus: "",
        race: "",
        phoneNumber: "",
        address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            homePHone: "",
        },
        employer: {
            name: "",
            occupation: "",

        },
        medicalHistory: {
            allergies: "",
            medications: "",
            surgeries: ""
        }
    },
    errors: {}
};

const patientsIntakeFormSlice = createSlice({
    name: "patientsIntakeForm",
    initialState,
    reducers: {
        updateField: (state, action) => {
            const { field, value } = action.payload;
            state.values[field] = value;
        },
        setErrors: (state, action) => {
            state.errors = action.payload;
        },
        resetForm: (state) => {
            state.values = initialState.values;
            state.errors = {};
        }
    }
});
export const { updateField, setErrors, resetForm } = patientsIntakeFormSlice.actions;
export default patientsIntakeFormSlice.reducer;