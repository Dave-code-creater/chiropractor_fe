import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  values: {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  errors: {
    email: "",
    password: "",
    confirmPassword: "",
  },
};

const registerFormSlice = createSlice({
  name: "registerForm",
  initialState,
  reducers: {
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
    setConfirmPasswordError(state, action) {
      state.errors.confirmPassword = action.payload;
    },
    clearConfirmPasswordError(state) {
      state.errors.confirmPassword = "";
    },
    clearAllErrors(state) {
      state.errors.email = "";
      state.errors.password = "";
      state.errors.confirmPassword = "";
    },
  },
});

export const {
  setEmailError,
  clearEmailError,
  setPasswordError,
  clearPasswordError,
  setConfirmPasswordError,
  clearConfirmPasswordError,
  clearAllErrors,
} = registerFormSlice.actions;

export default registerFormSlice.reducer;
