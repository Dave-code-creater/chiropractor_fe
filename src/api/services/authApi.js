import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../core/baseApi";
import { setCredentials, logOut, updateUserProfile } from "../../state/data/authSlice";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));

          // Update user profile if additional data is available
          if (data.user) {
            dispatch(updateUserProfile({
              firstName: data.user.first_name,
              lastName: data.user.last_name,
              fullName: data.user.full_name,
              phoneNumber: data.user.phone_number,
              dateOfBirth: data.user.date_of_birth,
              gender: data.user.gender,
              marriageStatus: data.user.marriage_status,
              race: data.user.race,
              isVerified: data.user.is_verified,
              phoneVerified: data.user.phone_verified,
            }));
          }
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
      invalidatesTags: ["User"],
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.user && data.token) {
            dispatch(setCredentials(data));

            // Update user profile if additional data is available
            if (data.user) {
              dispatch(updateUserProfile({
                firstName: data.user.first_name,
                lastName: data.user.last_name,
                fullName: data.user.full_name,
                phoneNumber: data.user.phone_number,
                dateOfBirth: data.user.date_of_birth,
                gender: data.user.gender,
                marriageStatus: data.user.marriage_status,
                race: data.user.race,
                isVerified: data.user.is_verified,
                phoneVerified: data.user.phone_verified,
              }));
            }
          }
        } catch (error) {
          console.error("Registration failed:", error);
        }
      },
      invalidatesTags: ["User"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut());
        } catch (error) {
          // Even if logout fails on server, clear local state
          dispatch(logOut());
        }
      },
      invalidatesTags: ["User"],
    }),



    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { token, password },
      }),
    }),

    verifyResetToken: builder.query({
      query: (token) => ({
        url: `/auth/verify-reset-token?token=${encodeURIComponent(token)}`,
        method: "GET",
      }),
    }),

    // OAuth login endpoint
    oauthLogin: builder.mutation({
      query: (oauthData) => ({
        url: "/auth/oauth",
        method: "POST",
        body: oauthData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data?.accessToken && data?.user) {
            dispatch(
              setCredentials({
                user: data.user,
                token: data.accessToken,
              })
            );
          }
        } catch (error) {
          console.error("OAuth login failed:", error);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyResetTokenQuery,
  useOauthLoginMutation,
} = authApi;
