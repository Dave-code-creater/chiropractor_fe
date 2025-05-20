import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import homepageReducer from "../features/homepage/homepageSlice";
export default configureStore({
    reducer: {
        auth: authReducer,
        homepage: homepageReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
    devTools: process.env.NODE_ENV !== "production",
});