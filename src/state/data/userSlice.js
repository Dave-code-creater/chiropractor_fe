import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
  details: null,
  preferences: {
    theme: "light",
    notifications: true,
    language: "en",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = action.payload;
    },
    setUserDetails: (state, action) => {
      state.details = action.payload;
    },
    setUserPreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    updateUserProfile: (state, action) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    clearUserData: (state) => {
      return initialState;
    },
  },
});

export const {
  setUserProfile,
  setUserDetails,
  setUserPreferences,
  updateUserProfile,
  clearUserData,
} = userSlice.actions;

// Selectors
export const selectUserProfile = (state) => state.entities.user.profile;
export const selectUserDetails = (state) => state.entities.user.details;
export const selectUserPreferences = (state) => state.entities.user.preferences;
export const selectUserFullName = (state) => state.entities.user.profile?.full_name;
export const selectUserEmail = (state) => state.entities.user.profile?.email;
export const selectUserPhoneNumber = (state) => state.entities.user.profile?.phone_number;
export const selectUserVerificationStatus = (state) => ({
  isVerified: state.entities.user.profile?.is_verified ?? false,
  phoneVerified: state.entities.user.profile?.phone_verified ?? false,
});

export default userSlice.reducer; 