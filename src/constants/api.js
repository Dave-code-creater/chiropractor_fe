// src/config/api.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const API_URL = {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    getUser: `${API_BASE_URL}/user/profile`,
    updateProfile: `${API_BASE_URL}/user/update`,
    // Add more endpoints here
};