import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpen: false,
  darkMode: false,
};

const uiStateSlice = createSlice({
  name: "uiState",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
    },
  },
});

export const { toggleSidebar, toggleDarkMode: toggleUiDarkMode } = uiStateSlice.actions;
export default uiStateSlice.reducer;
