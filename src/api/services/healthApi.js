import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../core/baseApi";

export const healthApi = createApi({
  reducerPath: "healthApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Health check endpoint (no authentication required)
    getHealthStatus: builder.query({
      query: () => ({
        url: "health",
        method: "GET",
      }),
      // Health check should not use authentication
      extraOptions: {
        skipAuth: true,
      },
    }),
  }),
});

export const { useGetHealthStatusQuery } = healthApi; 