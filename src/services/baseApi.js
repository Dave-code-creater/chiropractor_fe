import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../state/data/authSlice";

// Base fetchBaseQuery configured to attach the access token and send HttpOnly refresh cookie
const baseQuery = fetchBaseQuery({
    // Replace baseUrl with your API endpoint
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

// Wrapper to handle 401: attempt to refresh and retry once
const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // Attempt refresh
        const refreshResult = await baseQuery(
            { url: "auth/refresh", method: "POST" },
            api,
            extraOptions
        );

        if (refreshResult.data) {
            const { token, refreshToken } = refreshResult.data.metadata;
            const decoded = JSON.parse(atob(token.split(".")[1]));
            const newUser = {
                id: decoded.sub,
                email: decoded.email,
                role: decoded.role,
            };
            // Store new credentials
            api.dispatch(setCredentials({ user: newUser, accessToken: token, refreshToken }));
            // Retry original request
            result = await baseQuery(args, api, extraOptions);
        } else {
            // Refresh failed: log out
            api.dispatch(logOut());
        }
    }

    return result;
};

export { baseQueryWithReauth };
