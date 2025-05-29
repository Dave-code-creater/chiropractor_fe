import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserData } from "./blogAPI";

export const fetchHomepage = createAsyncThunk(
    "homepage/fetchHomepage",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await fetchUserData(userId);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateHomepage = createAsyncThunk(
    "homepage/updateHomepage",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await fetchHomepageData(userId);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);