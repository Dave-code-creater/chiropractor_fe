import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../features/auth/authSlice";

// Base fetchBaseQuery configured to attach the access token and send HttpOnly refresh cookie
const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:3000/v1/api/2025",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = getState().data.auth.accessToken;
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
            { url: "/refresh", method: "POST" },
            api,
            extraOptions
        );

        if (refreshResult.data) {
            const metadata = refreshResult.data.metadata;
            const newUser = {
                id: metadata.profile_id ?? metadata.identity_id,
                role: {
                    id: metadata.role_id.id,
                    name: metadata.role_id.name,
                },
            };
            const newAccessToken = metadata.accessToken;
            // Store new credentials
            api.dispatch(setCredentials({ user: newUser, accessToken: newAccessToken }));
            // Retry original request
            result = await baseQuery(args, api, extraOptions);
        } else {
            // Refresh failed: log out
            api.dispatch(logOut());
        }
    }

    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    reducerPath: "api",
    tagTypes: ["User"],
    endpoints: () => ({}), 
});