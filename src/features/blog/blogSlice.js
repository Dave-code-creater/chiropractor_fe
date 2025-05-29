import { createSlice } from "@reduxjs/toolkit";
import { fetchHomepage, updateHomepage } from "./blogThunks";

const initialState = {
    data: null,
    loading: false,
    error: null,
};

const homepageSlice = createSlice({
    name: "homepage",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHomepage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHomepage.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchHomepage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateHomepage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateHomepage.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(updateHomepage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});
export const { clearError } = homepageSlice.actions;
export default homepageSlice.reducer;