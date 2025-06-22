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
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
};

const registerFormSlice = createSlice({
  name: "registerForm",
  initialState,
  reducers: {
    setPhoneError(state, action) {
      state.errors.phone = action.payload;
    },
    clearPhoneError(state) {
      state.errors.phone = "";
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
    setConfirmPasswordError(state, action) {
      state.errors.confirmPassword = action.payload;
    },
    clearConfirmPasswordError(state) {
      state.errors.confirmPassword = "";
    },
    clearAllErrors(state) {
      state.errors.phone = "";
      state.errors.email = "";
      state.errors.password = "";
      state.errors.confirmPassword = "";
    },
  },
});

export const {
  setPhoneError,
  clearPhoneError,
  setEmailError,
  clearEmailError,
  setPasswordError,
  clearPasswordError,
  setConfirmPasswordError,
  clearConfirmPasswordError,
  clearAllErrors,
} = registerFormSlice.actions;

export default registerFormSlice.reducer;
