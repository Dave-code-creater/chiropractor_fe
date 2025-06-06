import { jwtDecode } from "jwt-decode";
import { store } from "../store/store";
import { refresh } from "../features/auth/authThunks";

/**
 * True when the JWT will expire within `buffer` seconds.
 * Default buffer is 60 s (one minute).
 */
export const willExpireSoon = (token, buffer = 60) => {
    try {
        const { exp } = jwtDecode(token);          // exp = seconds since epoch
        return exp - Date.now() / 1000 < buffer;
    } catch {
        // Bad token → treat as expired
        return true;
    }
};

/**
 * Call from a route‑change hook if you want proactive refreshes
 * outside Axios.  Usually the interceptor is enough.
 */
export const autoRefreshTokenIfNeeded = async () => {
    const { accessToken } = store.getState().auth;
    if (accessToken && willExpireSoon(accessToken)) {
        await store.dispatch(refresh()).unwrap();
    }
};