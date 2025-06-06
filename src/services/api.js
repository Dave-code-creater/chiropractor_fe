import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../features/auth/authSlice";

// Base fetchBaseQuery configured to attach the access token and send HttpOnly refresh cookie
const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:3000/v1/api/2025",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.accessToken;
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
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User"],
    endpoints: (builder) => ({
        // LOGIN
        login: builder.mutation({
            query: (credentials) => ({
                url: "/login",
                method: "POST",
                body: credentials,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const metadata = data.metadata;
                    const user = {
                        id: metadata.profile_id ?? metadata.identity_id,
                        role: {
                            id: metadata.role_id.id,
                            name: metadata.role_id.name,
                        },
                    };
                    const accessToken = metadata.accessToken;
                    dispatch(setCredentials({ user, accessToken }));
                } catch {
                    // Ignore errors here
                }
            },
        }),

        // REGISTER
        register: builder.mutation({
            query: (userData) => ({
                url: "/signup",
                method: "POST",
                body: userData,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const metadata = data.metadata;
                    const user = {
                        id: metadata.profile_id ?? metadata.identity_id,
                        role: {
                            id: metadata.role.id,
                            name: metadata.role.name,
                        },
                    };
                    const accessToken = metadata.accessToken;
                    dispatch(setCredentials({ user, accessToken }));
                } catch {
                    // Ignore errors
                }
            },
        }),

        // MANUAL REFRESH (optional)
        refreshToken: builder.mutation({
            query: () => ({
                url: "/refresh",
                method: "POST",
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const metadata = data.metadata;
                    const user = {
                        id: metadata.profile_id ?? metadata.identity_id,
                        role: {
                            id: metadata.role_id.id,
                            name: metadata.role_id.name,
                        },
                    };
                    const accessToken = metadata.accessToken;
                    dispatch(setCredentials({ user, accessToken }));
                } catch {
                    dispatch(logOut());
                }
            },
        }),

        // LOGOUT
        logout: builder.mutation({
            query: (userId) => ({
                url: "/logout",
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

// Export hooks for usage in functional components
export const {
    useLoginMutation,
    useRegisterMutation,
    useRefreshTokenMutation,
    useLogoutMutation,
} = apiSlice;