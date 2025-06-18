import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  global: null,
  login: null,
};

const errorsSlice = createSlice({
  name: "errors",
  initialState,
  reducers: {
    setGlobalError(state, action) {
      state.global = action.payload;
    },
    clearGlobalError(state) {
      state.global = null;
    },
    setLoginError(state, action) {
      state.login = action.payload;
    },
    clearLoginError(state) {
      state.login = null;
    },
  },
});

export const { setGlobalError, clearGlobalError, setLoginError, clearLoginError } = errorsSlice.actions;
export default errorsSlice.reducer;
