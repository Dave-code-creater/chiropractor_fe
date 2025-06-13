import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  values: { email: "", password: "" },
  errors: { email: "", password: "" },
};

const loginFormSlice = createSlice({
  name: "loginForm",
  initialState,
  reducers: {
    setEmail(state, action) {
      state.values.email = action.payload;
    },
    setPassword(state, action) {
      state.values.password = action.payload;
    },
    setEmailError(state, action) {
      state.errors.email = action.payload;
    },
    clearEmailError(state) {
      state.errors.email = "";
    },
    setPasswordError(state, action) {
      state.errors.password = action.payload;
    },
    clearPasswordError(state) {
      state.errors.password = "";
    },
    clearAllErrors(state) {
      state.errors.email = "";
      state.errors.password = "";
    },
  },
});

export const {
  setEmail,
  setPassword,
  setEmailError,
  clearEmailError,
  setPasswordError,
  clearPasswordError,
  clearAllErrors,
} = loginFormSlice.actions;

export default loginFormSlice.reducer;
