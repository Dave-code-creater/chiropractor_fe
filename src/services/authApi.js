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
          const { token, refreshToken } = data.metadata;
          const decoded = JSON.parse(atob(token.split(".")[1]));
          const user = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role,
          };
          dispatch(setCredentials({ user, accessToken: token, refreshToken }));
        } catch {
          // ignore
        }
      },
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
          const { token, refreshToken } = data.metadata;
          const decoded = JSON.parse(atob(token.split(".")[1]));
          const user = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role,
          };
          dispatch(setCredentials({ user, accessToken: token, refreshToken }));
        } catch {
          // ignore
        }
      },
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "auth/refresh",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { token, refreshToken } = data.metadata;
          const decoded = JSON.parse(atob(token.split(".")[1]));
          const user = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role,
          };
          dispatch(setCredentials({ user, accessToken: token, refreshToken }));
        } catch {
          dispatch(logOut());
        }
      },
    }),
    logout: builder.mutation({
      query: (userId) => ({
        url: "auth/logout",
        method: "POST",
        headers: {
          "x-client-id": userId.toString(),
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
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;
