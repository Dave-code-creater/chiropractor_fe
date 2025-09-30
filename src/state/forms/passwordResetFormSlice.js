import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  values: {
    email: "",
    password: "",
    confirmPassword: "",
    token: "",
  },
  errors: {
    email: "",
    password: "",
    confirmPassword: "",
    token: "",
  },
  status: {
    isEmailSent: false,
    isTokenValid: null,
    isResetSuccessful: false,
  },
};

const passwordResetFormSlice = createSlice({
  name: "passwordResetForm",
  initialState,
  reducers: {
    setEmail(state, action) {
      state.values.email = action.payload;
    },
    setEmailError(state, action) {
      state.errors.email = action.payload;
    },
    clearEmailError(state) {
      state.errors.email = "";
    },

    setPassword(state, action) {
      state.values.password = action.payload;
    },
    setPasswordError(state, action) {
      state.errors.password = action.payload;
    },
    clearPasswordError(state) {
      state.errors.password = "";
    },

    setConfirmPassword(state, action) {
      state.values.confirmPassword = action.payload;
    },
    setConfirmPasswordError(state, action) {
      state.errors.confirmPassword = action.payload;
    },
    clearConfirmPasswordError(state) {
      state.errors.confirmPassword = "";
    },

    setToken(state, action) {
      state.values.token = action.payload;
    },
    setTokenError(state, action) {
      state.errors.token = action.payload;
    },
    clearTokenError(state) {
      state.errors.token = "";
    },

    setEmailSent(state, action) {
      state.status.isEmailSent = action.payload;
    },
    setTokenValid(state, action) {
      state.status.isTokenValid = action.payload;
    },
    setResetSuccessful(state, action) {
      state.status.isResetSuccessful = action.payload;
    },

    clearAllErrors(state) {
      state.errors.email = "";
      state.errors.password = "";
      state.errors.confirmPassword = "";
      state.errors.token = "";
    },

    resetForm(_state) {
      return initialState;
    },
  },
});

export const {
  setEmail,
  setEmailError,
  clearEmailError,
  setPassword,
  setPasswordError,
  clearPasswordError,
  setConfirmPassword,
  setConfirmPasswordError,
  clearConfirmPasswordError,
  setToken,
  setTokenError,
  clearTokenError,
  setEmailSent,
  setTokenValid,
  setResetSuccessful,
  clearAllErrors,
  resetForm,
} = passwordResetFormSlice.actions;

export default passwordResetFormSlice.reducer;
