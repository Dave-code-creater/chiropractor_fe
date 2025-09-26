import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpen: false,
  darkMode: false,
  theme: 'light',
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
      state.theme = state.darkMode ? 'dark' : 'light';
    },
    setTheme(state, action) {
      state.theme = action.payload;
      state.darkMode = action.payload === 'dark';
    },
  },
});

export const { toggleSidebar, toggleDarkMode: toggleUiDarkMode, setTheme } =
  uiStateSlice.actions;
export default uiStateSlice.reducer;
