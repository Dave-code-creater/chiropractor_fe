import axios from "axios";
import { API_URL } from "../../constants/api";

export const fetchUserData = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/users/${userId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Failed to fetch user data");
    }
}
    
export const updateUserData = async (userId, userData) => {
    try {
        const response = await axios.put(`${API_URL}/users/${userId}`, userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Failed to update user data");
    }
}
