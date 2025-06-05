import axios from "axios";
import { API_URL, API_BASE_URL } from "../../constants/api";

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, credentials);
        const { metadata } = response.data;

        // store refresh token in cookie instead of state
        if (metadata?.refreshToken) {
            document.cookie = `refreshToken=${metadata.refreshToken}; path=/; secure; samesite=strict`;
        }

        return {
            user: {
                id: metadata?.profile_id || metadata?.identity_id,
                role: metadata?.role_id,
            },
            accessToken: metadata?.accessToken,
        };
    } catch (error) {
        const message =
            error.response?.data?.message || error.message || "Login failed";
        throw new Error(message);
    }
};


export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/signup`, userData);
        const { metadata } = response.data;

        if (metadata?.refreshToken) {
            document.cookie = `refreshToken=${metadata.refreshToken}; path=/; secure; samesite=strict`;
        }

        return {
            user: {
                id: metadata?.profile_id || metadata?.identity_id,
                role: metadata?.role_id,
            },
            accessToken: metadata?.accessToken,
        };
    } catch (error) {
        const message =
            error.response?.data?.message || error.message || "Registration failed";
        throw new Error(message);
    }
};

