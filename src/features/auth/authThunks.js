import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "./authAPI";

export const login = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await loginUser(credentials);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const register = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await registerUser(userData);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

