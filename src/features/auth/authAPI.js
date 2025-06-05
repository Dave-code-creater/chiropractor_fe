import axios from "axios";
import { API_URL, API_BASE_URL } from "../../constants/api";

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, credentials);
        const { metadata } = response.data;

        return {
            user: {
                id: metadata?.profile_id || metadata?.identity_id,
                role: metadata?.role_id,
            },
            accessToken: metadata?.accessToken,
            refreshToken: metadata?.refreshToken,
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

        return {
            user: {
                id: metadata?.profile_id || metadata?.identity_id,
                role: metadata?.role_id,
            },
            accessToken: metadata?.accessToken,
            refreshToken: metadata?.refreshToken,
        };
    } catch (error) {
        const message =
            error.response?.data?.message || error.message || "Registration failed";
        throw new Error(message);
    }
};

