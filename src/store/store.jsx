// src/app/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "../features/auth/authSlice";
import formErrorReducer from "../utils/formerrorSlice";
import { apiSlice } from "../services/api";

// 1) Combine all your “local” slices under `data`
const dataReducer = combineReducers({
  auth: authReducer,
  formError: formErrorReducer,
  // later you can add users, posts, settings, etc.
});

// 2) Persist only the `auth` slice inside `data`
const dataPersistConfig = {
  key: "data",
  storage,
  whitelist: ["auth"],
};

const persistedDataReducer = persistReducer(dataPersistConfig, dataReducer);

// 3) Build your root reducer with RTK Query at the top
const rootReducer = combineReducers({
  data: persistedDataReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: gDM =>
    gDM({
      thunk: true,
      serializableCheck: {
        // avoid errors from redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);