import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { thunk } from 'redux-thunk';

import authReducer from "../features/auth/authSlice";
import homepageReducer from "../features/homepage/homepageSlice";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth']
};

const rootReducer = combineReducers({
    auth: authReducer,
    homepage: homepageReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        })
});

export const persistor = persistStore(store);