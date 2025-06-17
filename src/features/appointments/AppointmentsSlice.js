import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  appointments: [],
  loading: false,
  error: null,
  message: "No appointment exist",
};

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { clearError } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
