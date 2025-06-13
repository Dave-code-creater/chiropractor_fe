import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../state/data/authSlice";

// Base fetchBaseQuery configured to attach the access token and send HttpOnly refresh cookie
const baseQuery = fetchBaseQuery({
    // Replace baseUrl with your API endpoint
    baseUrl: "https://api.example.com",
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
            { url: "/refresh", method: "POST" },
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
                    const { token, refreshToken } = data.metadata;
                    const decoded = JSON.parse(atob(token.split(".")[1]));
                    const user = {
                        id: decoded.sub,
                        email: decoded.email,
                        role: decoded.role,
                    };
                    dispatch(setCredentials({ user, accessToken: token, refreshToken }));
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
                    const { token, refreshToken } = data.metadata;
                    const decoded = JSON.parse(atob(token.split(".")[1]));
                    const user = {
                        id: decoded.sub,
                        email: decoded.email,
                        role: decoded.role,
                    };
                    dispatch(setCredentials({ user, accessToken: token, refreshToken }));
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

        // REPORT SECTION SUBMISSIONS
        submitPatientIntake: builder.mutation({
            query: (data) => ({
                url: "/reports/section1",
                method: "POST",
                body: data,
            }),
        }),
        submitAccidentDetails: builder.mutation({
            query: (data) => ({
                url: "/reports/section2",
                method: "POST",
                body: data,
            }),
        }),
        submitPainEvaluation: builder.mutation({
            query: (data) => ({
                url: "/reports/section3",
                method: "POST",
                body: data,
            }),
        }),
        submitSymptomDescription: builder.mutation({
            query: (data) => ({
                url: "/reports/section4",
                method: "POST",
                body: data,
            }),
        }),
        submitRecoveryImpact: builder.mutation({
            query: (data) => ({
                url: "/reports/section5",
                method: "POST",
                body: data,
            }),
        }),
        submitHealthHistory: builder.mutation({
            query: (data) => ({
                url: "/reports/section6",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

// Export hooks for usage in functional components
export const {
    useLoginMutation,
    useRegisterMutation,
    useRefreshTokenMutation,
    useLogoutMutation,
    useSubmitPatientIntakeMutation,
    useSubmitAccidentDetailsMutation,
    useSubmitPainEvaluationMutation,
    useSubmitSymptomDescriptionMutation,
    useSubmitRecoveryImpactMutation,
    useSubmitHealthHistoryMutation,
} = apiSlice;
