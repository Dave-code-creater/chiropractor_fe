import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  values: {},
  errors: {},
};

const appointmentFormSlice = createSlice({
  name: "appointmentForm",
  initialState,
  reducers: {},
});

export default appointmentFormSlice.reducer;
