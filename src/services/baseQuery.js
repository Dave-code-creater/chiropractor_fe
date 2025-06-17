import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../state/data/authSlice";

export const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/v1/api/2025/",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().data?.auth?.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery({ url: "auth/refresh", method: "POST" }, api, extraOptions);
    if (refreshResult.data) {
      const { token, refreshToken } = refreshResult.data.metadata;
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      };
      api.dispatch(setCredentials({ user, accessToken: token, refreshToken }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }

  return result;
};
