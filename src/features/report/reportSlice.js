import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    report: null,
    loading: false,
    error: null,
};

const reportSlice = createSlice({
    name: "report",
    initialState,
    reducers: {
        setReport: (state, action) => {
            state.report = action.payload;
            state.loading = false;
            state.error = null;
        },
        clearReport: (state) => {
            state.report = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});
export const { setReport, clearReport, setLoading, setError } = reportSlice.actions;
export default reportSlice.reducer;