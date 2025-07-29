import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  darkMode: false,
  theme: 'light', // 'light', 'dark', or 'system'
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
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

export const { toggleDarkMode, setTheme } = settingsSlice.actions;
export default settingsSlice.reducer;
