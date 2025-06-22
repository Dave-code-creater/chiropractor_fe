import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseApi";
import { setCredentials, logOut } from "../state/data/authSlice";

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
          const { token, refreshToken, user } = data.metadata;
          
          // Use server-provided user data from your specific response format
          if (user && token) {
            dispatch(setCredentials({ 
              user: {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName || user.username, // Use username as fallback for firstName
                lastName: user.lastName || "", // Empty if not provided
                role: user.role,
                profileImage: user.profileImage
              }, 
              accessToken: token, 
              refreshToken 
            }));
          } else {
            // Fallback: If server doesn't provide user data, decode JWT
            console.warn("Server didn't provide user data, falling back to JWT decoding");
            const decoded = JSON.parse(atob(token.split(".")[1]));
            const fallbackUser = {
              id: decoded.sub,
              email: decoded.email,
              role: decoded.role,
              username: decoded.username || decoded.email?.split('@')[0] || "",
              firstName: decoded.firstName || decoded.username || "",
              lastName: decoded.lastName || ""
            };
            dispatch(setCredentials({ user: fallbackUser, accessToken: token, refreshToken }));
          }
        } catch (error) {
          console.error("Login error:", error);
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
          const { token, refreshToken, user } = data.metadata;
          
          // Use server-provided user data from your specific response format
          if (user && token) {
            dispatch(setCredentials({ 
              user: {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName || user.username, // Use username as fallback for firstName
                lastName: user.lastName || "", // Empty if not provided
                role: user.role,
                profileImage: user.profileImage
              }, 
              accessToken: token, 
              refreshToken 
            }));
          } else {
            // Fallback for backward compatibility
            console.warn("Server didn't provide user data, falling back to JWT decoding");
            const decoded = JSON.parse(atob(token.split(".")[1]));
            const fallbackUser = {
              id: decoded.sub,
              email: decoded.email,
              role: decoded.role,
              username: decoded.username || decoded.email?.split('@')[0] || "",
              firstName: decoded.firstName || decoded.username || "",
              lastName: decoded.lastName || ""
            };
            dispatch(setCredentials({ user: fallbackUser, accessToken: token, refreshToken }));
          }
        } catch (error) {
          console.error("Registration error:", error);
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
          const { token, refreshToken, user } = data.metadata;
          
          // Use server-provided user data from your specific response format
          if (user && token) {
            dispatch(setCredentials({ 
              user: {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName || user.username, // Use username as fallback for firstName
                lastName: user.lastName || "", // Empty if not provided
                role: user.role,
                profileImage: user.profileImage
              }, 
              accessToken: token, 
              refreshToken 
            }));
          } else {
            // Fallback for backward compatibility
            console.warn("Server didn't provide user data, falling back to JWT decoding");
            const decoded = JSON.parse(atob(token.split(".")[1]));
            const fallbackUser = {
              id: decoded.sub,
              email: decoded.email,
              role: decoded.role,
              username: decoded.username || decoded.email?.split('@')[0] || "",
              firstName: decoded.firstName || decoded.username || "",
              lastName: decoded.lastName || ""
            };
            dispatch(setCredentials({ user: fallbackUser, accessToken: token, refreshToken }));
          }
        } catch (error) {
          console.error("Token refresh error:", error);
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
          await queryFulfilled;
        } finally {
          dispatch(logOut());
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
