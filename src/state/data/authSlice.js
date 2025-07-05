import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";

// Base selector
const selectAuth = (state) => state.auth;

// Memoized selectors
export const selectCurrentUser = createSelector(
  [selectAuth],
  (auth) => ({
    firstName: auth.firstName,
    lastName: auth.lastName,
    name: auth.username,
    email: auth.email,
    role: auth.role
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

const initialState = {
  // Authentication tokens
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  
  // Minimal user identity for quick access (no duplication)
  userID: null,
  role: null,
  email: null,
  username: null,
  firstName: null,
  lastName: null
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
      }
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
  updateAuthIdentity,
  logOut,
  clearError,
  setLoading,
} = authSlice.actions;

// Auth-focused selectors (minimal data only)
export const selectAuthLoading = (state) => state?.auth?.loading ?? false;
export const selectAuthError = (state) => state?.auth?.error ?? null;

// Combined selectors that access both auth and user entities
export const selectUserProfile = (state) => 
  state?.entities?.user?.profile ?? null;

export const selectUserDetails = (state) => 
  state?.entities?.user?.details ?? null;

export const selectUserPreferences = (state) => 
  state?.entities?.user?.preferences ?? { theme: "light", notifications: true, language: "en" };

// Enhanced display name selector using combined data
export const selectUserDisplayName = (state) => {
  const role = state?.auth?.role;
  const profile = state?.entities?.user?.profile;
  const details = state?.entities?.user?.details;
  const authEmail = state?.auth?.email;
  const authUsername = state?.auth?.username;

  if (!role) return "Welcome Back";

  // Check profile data first (most detailed)
  if (profile?.full_name && profile.full_name !== 'undefined undefined') {
    return role === "admin" || role === "doctor" 
      ? `Dr. ${profile.full_name}` 
      : profile.full_name;
  }

  // Check details for first/last name
  if (details?.first_name && details?.last_name) {
    const fullName = `${details.first_name} ${details.last_name}`;
    return role === "admin" || role === "doctor" 
      ? `Dr. ${fullName}` 
      : fullName;
  }

  // Fallback to auth username or email
  if (authUsername) {
    return role === "admin" || role === "doctor" 
      ? `Dr. ${authUsername}` 
      : authUsername;
  }

  if (authEmail) {
    const emailName = authEmail.split("@")[0];
    return role === "admin" || role === "doctor" 
      ? `Dr. ${emailName}` 
      : emailName;
  }

  return "Welcome Back";
};

// User initials selector
export const selectUserInitials = (state) => {
  const profile = state?.entities?.user?.profile;
  const details = state?.entities?.user?.details;
  const authUsername = state?.auth?.username;
  const authEmail = state?.auth?.email;
  
  if (profile?.full_name && profile.full_name !== 'undefined undefined') {
    const names = profile.full_name.split(' ').filter(n => n && n !== 'undefined');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
  }
  
  if (details?.first_name && details?.last_name) {
    return `${details.first_name[0]}${details.last_name[0]}`.toUpperCase();
  }
  
  if (authUsername) {
    return authUsername.substring(0, 2).toUpperCase();
  }
  
  if (authEmail) {
    return authEmail.substring(0, 2).toUpperCase();
  }
  
  return "U";
};

// Role display selector
export const selectUserRoleDisplay = (state) => {
  const role = state?.auth?.role;
  
  const roleMap = {
    admin: { text: "Administrator", variant: "default", icon: "👑" },
    doctor: { text: "Doctor", variant: "secondary", icon: "👩‍⚕️" },
    staff: { text: "Staff", variant: "outline", icon: "👔" },
    patient: { text: "Patient", variant: "outline", icon: "👤" },
  };
  
  return roleMap[role] || { text: "User", variant: "outline", icon: "👤" };
};

export default authSlice.reducer;
