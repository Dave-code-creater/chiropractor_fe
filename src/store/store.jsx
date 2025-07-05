import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import authReducer from "../state/data/authSlice";
import userReducer from "../state/data/userSlice";
import entitiesReducer from "../state/data/entitiesSlice";
import settingsReducer from "../state/data/settingsSlice";
import uiStateReducer from "../state/data/uiStateSlice";

import loginFormReducer from "../state/forms/loginFormSlice";
import registerFormReducer from "../state/forms/registerFormSlice";
import passwordResetFormReducer from "../state/forms/passwordResetFormSlice";
import appointmentFormReducer from "../state/forms/appointmentFormSlice";
import patientsIntakeFormReducer from "../state/forms/patientsIntakeFormSlice";
import accidentsInsuranceReducer from "../state/forms/accidentsInsurance";

import loadingReducer from "../state/ui/loadingSlice";
import uiErrorsReducer from "../state/ui/errorsSlice";
import notificationsReducer from "../state/ui/notificationsSlice";
import modalsReducer from "../state/ui/modalsSlice";
import { authApi } from "../services/authApi";
import { reportApi } from "../services/reportApi";
import { blogApi } from "../services/blogApi";
import { appointmentApi } from "../services/appointmentApi";
import { chatApi } from "../services/chatApi";
import { clinicalNotesApi, vitalsApi } from "../api";
import { profileApi } from "../services/profileApi";
import { userApi } from "../services/userApi";

// Enhanced persist config for better performance
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["settings", "uiState"], // Only persist non-sensitive data
  version: 1,
  migrate: (state) => {
    return Promise.resolve(state);
  },
  throttle: 500, // Reduced throttle for better responsiveness
  serialize: true,
  writeFailHandler: (err) => {
    console.warn("Redux persist write failed:", err);
  },
};

// Separate persist config for auth
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["accessToken", "refreshToken"], // Only persist tokens
  version: 1,
  migrate: (state) => {
    return Promise.resolve(state);
  },
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  settings: settingsReducer,
  uiState: uiStateReducer,
  entities: combineReducers({
    user: userReducer,
    posts: entitiesReducer.posts || { byId: {}, allIds: [] },
    comments: entitiesReducer.comments || { byId: {}, allIds: [] },
  }),
  forms: combineReducers({
    loginForm: loginFormReducer,
    registerForm: registerFormReducer,
    passwordResetForm: passwordResetFormReducer,
    appointmentForm: appointmentFormReducer,
    patientsIntake: patientsIntakeFormReducer,
    accidentsInsurance: accidentsInsuranceReducer,
  }),
  ui: combineReducers({
    loading: loadingReducer,
    errors: uiErrorsReducer,
    notifications: notificationsReducer,
    modals: modalsReducer,
  }),
  [authApi.reducerPath]: authApi.reducer,
  [reportApi.reducerPath]: reportApi.reducer,
  [blogApi.reducerPath]: blogApi.reducer,
  [appointmentApi.reducerPath]: appointmentApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
  [clinicalNotesApi.reducerPath]: clinicalNotesApi.reducer,
  [vitalsApi.reducerPath]: vitalsApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Enhanced store configuration with performance monitoring
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Performance: Warn about large serialization times
        warnAfter: 64, // Reduced from 128ms for better monitoring
      },
      immutableCheck: {
        warnAfter: 64, // Reduced from 128ms for better monitoring
      },
    }).concat(
      authApi.middleware,
      reportApi.middleware,
      blogApi.middleware,
      appointmentApi.middleware,
      chatApi.middleware,
      clinicalNotesApi.middleware,
      vitalsApi.middleware,
      profileApi.middleware,
      userApi.middleware
    );

    return middleware;
  },
});

// Setup listeners for RTK Query
setupListeners(store.dispatch);

// Create persistor
export const persistor = persistStore(store);

// Make store globally accessible for token refresh
if (typeof window !== 'undefined') {
  window.__REDUX_STORE__ = store;
}

// Export for direct access in utilities
export default store;
