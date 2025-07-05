import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseApi";
import { setCredentials, logOut } from "../state/data/authSlice";
import { setUserProfile, setUserDetails } from "../state/data/userSlice";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { token, refreshToken, user } = data;
          
          if (user && token) {
            dispatch(setCredentials({ user, token, refreshToken }));

            if (user.profile) {
              dispatch(setUserProfile(user.profile));
            }
            
            const userDetails = {
              id: user.id,
              email: user.email,
              username: user.username,
              role: user.role,
              first_name: user.first_name,
              last_name: user.last_name,
              phone: user.phone,
              is_verified: user.is_verified,
              created_at: user.created_at,
              updated_at: user.updated_at,
            };
            dispatch(setUserDetails(userDetails));
          }
        } catch (error) {
          // Login failed
        }
      },
      invalidatesTags: ["User"],
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: "auth/register",
        method: "POST",
        body: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { token, refreshToken, user } = data;
          
          if (user && token) {
            dispatch(setCredentials({ user, token, refreshToken }));

            if (user.profile) {
              dispatch(setUserProfile(user.profile));
            }
            
            const userDetails = {
              id: user.id,
              email: user.email,
              username: user.username,
              role: user.role,
              first_name: user.first_name,
              last_name: user.last_name,
              phone: user.phone,
              is_verified: user.is_verified,
              created_at: user.created_at,
              updated_at: user.updated_at,
            };
            dispatch(setUserDetails(userDetails));
          }
        } catch (error) {
          // Registration failed
        }
      },
      invalidatesTags: ["User"],
    }),

    refreshToken: builder.mutation({
      query: () => ({
        url: "auth/refresh",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { token, refreshToken, user } = data;
          
          if (user && token) {
            dispatch(setCredentials({ user, token, refreshToken }));

            if (user.profile) {
              dispatch(setUserProfile(user.profile));
            }
            
            const userDetails = {
              id: user.id,
              email: user.email,
              username: user.username,
              role: user.role,
              first_name: user.first_name,
              last_name: user.last_name,
              phone: user.phone,
              is_verified: user.is_verified,
              created_at: user.created_at,
              updated_at: user.updated_at,
            };
            dispatch(setUserDetails(userDetails));
          }
        } catch (error) {
          dispatch(logOut());
        }
      },
      invalidatesTags: ["User"],
    }),

    // Get current user profile (alternative secure approach)
    getCurrentUser: builder.query({
      query: () => ({
        url: "auth/me",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          if (data && data.user) {
            const { user } = data;
            
            if (user.profile) {
              dispatch(setUserProfile(user.profile));
            }
            
            const userDetails = {
              id: user.id,
              email: user.email,
              username: user.username,
              role: user.role,
              first_name: user.first_name,
              last_name: user.last_name,
              phone: user.phone,
              is_verified: user.is_verified,
              created_at: user.created_at,
              updated_at: user.updated_at,
            };
            dispatch(setUserDetails(userDetails));
          }
        } catch (error) {
          // Failed to get current user
        }
      },
      providesTags: ["User"],
    }),

    logout: builder.mutation({
      query: (userId) => ({
        url: "auth/logout",
        method: "POST",
        headers: {
          "x-client-id": userId?.toString() || "",
        },
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          // Only proceed with local logout if backend explicitly confirms success
          if (data && (data.success === true || data.message === "Logout successful")) {
            dispatch(logOut());
            const { clearUserData } = await import('../state/data/userSlice');
            dispatch(clearUserData());
            return { success: true, message: "Logout successful" };
          } else {
            // Backend didn't confirm successful logout
            throw new Error(data?.message || "Logout not confirmed by server");
          }
        } catch (error) {
          // Backend logout failed, don't clear local state
          console.error("Backend logout failed:", error);
          throw error;
        }
      },
      invalidatesTags: ["User"],
    }),

    // Forgot Password - Send reset email
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "auth/forgot-password",
        method: "POST",
        body: data, // { email }
      }),
    }),

    // Verify Reset Token - Check if token is valid
    verifyResetToken: builder.query({
      query: (token) => ({
        url: `auth/verify-reset-token?token=${encodeURIComponent(token)}`,
        method: "GET",
      }),
    }),

    // Reset Password - Set new password with token
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "auth/reset-password",
        method: "POST",
        body: data, // { token, password, confirmPassword }
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
  useForgotPasswordMutation,
  useVerifyResetTokenQuery,
  useResetPasswordMutation,
} = authApi;
