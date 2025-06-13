import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginModal: false,
  confirmDelete: false,
};

const modalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    openLogin(state) {
      state.loginModal = true;
    },
    closeLogin(state) {
      state.loginModal = false;
    },
    openConfirmDelete(state) {
      state.confirmDelete = true;
    },
    closeConfirmDelete(state) {
      state.confirmDelete = false;
    },
  },
});

export const { openLogin, closeLogin, openConfirmDelete, closeConfirmDelete } = modalsSlice.actions;
export default modalsSlice.reducer;
