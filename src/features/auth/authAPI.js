import axios from "axios";
import { API_URL } from "../../constants/api";

export const loginUser = async (credentials) => {
    // try {
    //     const response = await axios.post(`${API_URL}/auth/login`, credentials);
    //     return response.data;
    // } catch (error) {
    //     throw new Error(error.response.data.message || "Login failed");
    // }
    try {
        // simulate delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // fake user data
        if (credentials.email === "test@example.com" && credentials.password === "123456") {
            return {
                user: {
                    id: 1,
                    name: "Test User",
                    email: "test@example.com",
                },
            };
        } else {
            throw new Error("Invalid email or password");
        }
    } catch (error) {
        throw new Error(error.message || "Login failed");
    }
}


export const registerUser = async (userData) => {
    // try {
    //     const response = await axios.post(`${API_URL}/auth/register`, userData);
    //     return response.data;
    // } catch (error) {
    //     throw new Error(error.response.data.message || "Registration failed");
    // }
    try {
        // simulate delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // strict credential match
        if (
            userData.firstName === "Dat" &&
            userData.lastName === "Ta" &&
            userData.phone === "6477787816" &&
            userData.email === "Linh@gmail.com" &&
            userData.password === "123123" &&
            userData.confirmPassword === "123123"
        ) {
            return {
                user: {
                    id: 1,
                    name: "Dat Ta",
                    email: "Linh@gmail.com",
                    phone: "6477787816",
                },
            };
        } else {
            throw new Error("Invalid registration details");
        }
    } catch (error) {
        throw new Error(error.message || "Registration failed");
    }
}

