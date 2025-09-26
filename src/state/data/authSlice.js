import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";

const selectAuth = (state) => state.auth;

const initialState = {
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  userID: null,
  role: null,
  email: null,
  username: null,

  profile: {
    firstName: null,
    lastName: null,
    fullName: null,
    dateOfBirth: null,
    gender: null,
    marriageStatus: null,
    race: null,
    phoneNumber: null,
    isVerified: false,
    phoneVerified: false,
  },

  preferences: {
    theme: "light",
    notifications: true,
    language: "en",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, accessToken, refreshToken } = action.payload;

      if (user && (token || accessToken)) {
        state.accessToken = accessToken || token;
        state.refreshToken = refreshToken;
        state.userID = user.id;
        state.role = user.role;
        state.email = user.email;
        state.username = user.username;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;

        if (user.first_name)
          state.profile.firstName = user.first_name;
        if (user.last_name) state.profile.lastName = user.last_name;
        if (user.full_name) state.profile.fullName = user.full_name;
        if (user.phone_number) state.profile.phoneNumber = user.phone_number;
        if (user.date_of_birth) state.profile.dateOfBirth = user.date_of_birth;
        if (user.gender) state.profile.gender = user.gender;
        if (user.marriage_status) state.profile.marriageStatus = user.marriage_status;
        if (user.race) state.profile.race = user.race;
        if (user.is_verified !== undefined) state.profile.isVerified = user.is_verified;
        if (user.phone_verified !== undefined) state.profile.phoneVerified = user.phone_verified;
      }
    },

    updateUserProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },

    updateUserPreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },

    updateAuthIdentity: (state, action) => {
      const { email, username, role } = action.payload;
      if (email !== undefined) state.email = email;
      if (username !== undefined) state.username = username;
      if (role !== undefined) state.role = role;
    },

    logOut: (state) => {
      return initialState;
    },

    clearError: (state) => {
      state.error = null;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    restoreSession: (state, action) => {
      const { accessToken, refreshToken, userID, role, email, username, profile } = action.payload;

      if (accessToken && userID && role) {
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.userID = userID;
        state.role = role;
        state.email = email;
        state.username = username;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;

        if (profile) {
          state.profile = { ...state.profile, ...profile };
        }
      }
    },

    validateSession: (state) => {
      if (state.accessToken && state.userID && state.role) {
        state.isAuthenticated = true;
      } else {
        state.isAuthenticated = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.error?.data || action.error?.message;

          const isAuthAction =
            action.type.includes("auth/") ||
            action.type.includes("login") ||
            action.type.includes("refresh");

          if (isAuthAction) {
            state.isAuthenticated = false;
          }
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export const {
  setCredentials,
  updateUserProfile,
  updateUserPreferences,
  updateAuthIdentity,
  logOut,
  clearError,
  setLoading,
  restoreSession,
  validateSession,
} = authSlice.actions;

export const selectCurrentUser = createSelector(
  [selectAuth],
  (auth) => ({
    id: auth.userID,
    name: auth.username,
    email: auth.email,
    role: auth.role,
    firstName: auth.profile.firstName,
    lastName: auth.profile.lastName,
    fullName: auth.profile.fullName,
    phoneNumber: auth.profile.phoneNumber,
  })
);

export const selectUserId = createSelector(
  [selectAuth],
  (auth) => auth.userID
);

export const selectUserRole = createSelector(
  [selectAuth],
  (auth) => auth.role
);

export const selectIsAuthenticated = createSelector(
  [selectAuth],
  (auth) => auth.isAuthenticated
);

export const selectUserProfile = createSelector(
  [selectAuth],
  (auth) => auth.profile
);

export const selectUserPreferences = createSelector(
  [selectAuth],
  (auth) => auth.preferences
);

export const selectUserDisplayName = createSelector(
  [selectAuth],
  (auth) => {
    const { role, profile, username, email } = auth;

    if (!role)
      return "Welcome Back";

    if (profile.fullName && profile.fullName !== 'undefined undefined') {
      return role === "admin" || role === "doctor"
        ? `Dr. ${profile.fullName}`
        : profile.fullName;
    }

    if (profile.firstName && profile.lastName) {
      const fullName = `${profile.firstName} ${profile.lastName}`;
      return role === "admin" || role === "doctor"
        ? `Dr. ${fullName}`
        : fullName;
    }

    if (username) {
      return role === "admin" || role === "doctor"
        ? `Dr. ${username}`
        : username;
    }

    if (email) {
      const emailName = email.split("@")[0];
      return role === "admin" || role === "doctor"
        ? `Dr. ${emailName}`
        : emailName;
    }

    return "Welcome Back";
  }
);

export const selectUserInitials = createSelector(
  [selectAuth],
  (auth) => {
    const { profile, username, email } = auth;

    if (profile.fullName && profile.fullName !== 'undefined undefined') {
      const names = profile.fullName.split(' ').filter(n => n && n !== 'undefined');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      if (names.length === 1) {
        return names[0].substring(0, 2).toUpperCase();
      }
    }

    if (profile.firstName && profile.lastName) {
      return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
    }

    if (username) {
      return username.substring(0, 2).toUpperCase();
    }

    if (email) {
      return email.substring(0, 2).toUpperCase();
    }

    return "U";
  }
);

export const selectAuthLoading = (state) => state?.auth?.loading ?? false;
export const selectAuthError = (state) => state?.auth?.error ?? null;
export const selectUserEmail = (state) => state?.auth?.email;
export const selectUserPhoneNumber = (state) => state?.auth?.profile?.phoneNumber;
export const selectUserVerificationStatus = (state) => ({
  isVerified: state?.auth?.profile?.isVerified ?? false,
  phoneVerified: state?.auth?.profile?.phoneVerified ?? false,
});

export const selectUserRoleDisplay = (state) => {
  const role = state?.auth?.role;
  if (!role) return "User";

  const roleMap = {
    patient: "Patient",
    doctor: "Doctor",
    admin: "Administrator"
  };

  return roleMap[role] || role;
};

export default authSlice.reducer;
