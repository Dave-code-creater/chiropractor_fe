// src/features/accident/accidentSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    values: {
        // Form fields
        carType: "",
        dateOfAccident: "",
        timeOfAccident: "",
        timePeriod: "AM",

        accidentLocation: "",
        howItOccurred: "",
        circumstances: "",

        awareOfAccident: null,
        ambulanceOnScene: null,
        airbagsDeployed: null,
        seatbeltUsed: null,
        policeOnScene: null,
        pastAccidents: null,

        lostTimeFromWork: null,
        lostTimeDates: "",

        insuranceCovered: null,
        insuranceType: "",
    },
    errors: {}
};

const accidentSlice = createSlice({
    name: "accident",
    initialState,
    reducers: {
        setField: (state, action) => {
            const { field, value } = action.payload;
            state.values[field] = value;
        },
        resetForm: (state) => {
            state.values = initialState.values;
            state.errors = {};
        }
    }
});

// Exports
export const { setField, resetForm } = accidentSlice.actions;
export default accidentSlice.reducer;