import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, CACHE_TIMES } from "../core/baseApi";
import { setCredentials, logOut, updateUserProfile } from "../../state/data/authSlice";
import { startPeriodicTokenCheck, stopPeriodicTokenCheck, setLoggingOut } from "../core/tokenManager";

const normalizeAuthResponse = (response) => {
  if (!response) return {};

  const container = response.data ?? response;

  const user = container.user ?? container.profile ?? container.patient ?? null;
  const tokens = container.tokens ?? {
    accessToken: container.accessToken ?? response.accessToken ?? response.token ?? null,
    refreshToken: container.refreshToken ?? response.refreshToken ?? null,
  };

  return {
    success: response.success ?? container.success ?? null,
    message: response.message ?? container.message ?? null,
    user,
    tokens,
    profile: container.profile ?? container.patient ?? null,
    raw: response,
  };
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  keepUnusedDataFor: CACHE_TIMES.SHORT,
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: false,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response) => normalizeAuthResponse(response),
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;

          if (!data?.user) {
            console.error("normalizeAuthResponse returned no user", data);
            return;
          }

          dispatch(
            setCredentials({
              user: data.user,
              accessToken: data.tokens?.accessToken ?? data.token ?? null,
              refreshToken: data.tokens?.refreshToken ?? null,
            })
          );

          startPeriodicTokenCheck({ dispatch, getState });

          const profileSource = data.profile ?? data.user;

          if (profileSource) {
            dispatch(updateUserProfile({
              firstName: profileSource.first_name,
              lastName: profileSource.last_name,
              fullName: profileSource.full_name,
              phoneNumber: profileSource.phone_number,
              dateOfBirth: profileSource.date_of_birth,
              gender: profileSource.gender,
              marriageStatus: profileSource.marriage_status,
              race: profileSource.race,
              isVerified: profileSource.is_verified,
              phoneVerified: profileSource.phone_verified,
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
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          if (data.user && data.token) {
            dispatch(setCredentials(data));

            startPeriodicTokenCheck({ dispatch, getState });

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
          setLoggingOut(true);
          
          stopPeriodicTokenCheck();
          
          await queryFulfilled;
          dispatch(logOut());
        } catch {
          dispatch(logOut());
        } finally {
          setLoggingOut(false);
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
