import { apiSlice } from "../../services/api";
import { setCredentials, logOut } from "./authSlice";

export const authApi = apiSlice.injectEndpoints({
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
                } catch { }
            },
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: "auth/signup",
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
                } catch { }
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