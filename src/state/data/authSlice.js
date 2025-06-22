import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const initialState = {
  user: null, // Store complete user object
  userID: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      
      // Store complete user object
      state.user = user;
      state.userID = user?.id || null;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken || null;
      state.role = user?.role || null;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    
    updateUserProfile: (state, action) => {
      // Update user profile data without affecting tokens
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    
    logOut: (state) => {
      state.user = null;
      state.userID = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.role = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
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
  logOut, 
  clearError, 
  setLoading 
} = authSlice.actions;

export default authSlice.reducer;

// Selectors for easy access to user data
export const selectCurrentUser = (state) => state.data.auth.user;
export const selectUserEmail = (state) => state.data.auth.user?.email;
export const selectUserName = (state) => {
  const user = state.data.auth.user;
  
  // Handle your server's response format with username
  if (user?.firstName && user?.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user?.username) {
    return user.username;
  }
  if (user?.email) {
    return user.email.split('@')[0]; // Use email prefix as fallback
  }
  return 'User';
};

export const selectUserDisplayName = (state) => {
  const user = state.data.auth.user;
  const role = state.data.auth.role;
  
  // Handle display name based on your data structure
  if (role === 'admin' || role === 'doctor') {
    if (user?.firstName && user?.lastName) {
      return `Dr. ${user.firstName} ${user.lastName}`;
    }
    if (user?.username) {
      return `Dr. ${user.username}`;
    }
    return 'Dr. Admin';
  }
  
  // For patients and other roles
  if (user?.firstName && user?.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user?.username) {
    return user.username;
  }
  if (user?.email) {
    return user.email.split('@')[0];
  }
  return 'Welcome Back';
};

export const selectUserRole = (state) => state.data.auth.role;
export const selectIsAuthenticated = (state) => state.data.auth.isAuthenticated;
export const selectAuthToken = (state) => state.data.auth.accessToken;
export const selectUserId = (state) => state.data.auth.userID;
export const selectUsername = (state) => state.data.auth.user?.username;
