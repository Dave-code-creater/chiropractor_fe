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
import entitiesReducer from "../state/data/entitiesSlice";
import settingsReducer from "../state/data/settingsSlice";
import uiStateReducer from "../state/data/uiStateSlice";

import loginFormReducer from "../state/forms/loginFormSlice";
import registerFormReducer from "../state/forms/registerFormSlice";
import passwordResetFormReducer from "../state/forms/passwordResetFormSlice";
import appointmentFormReducer from "../state/forms/appointmentFormSlice";

import loadingReducer from "../state/ui/loadingSlice";
import uiErrorsReducer from "../state/ui/errorsSlice";
import modalsReducer from "../state/ui/modalsSlice";
import { authApi } from "../api/services/authApi";
import { reportApi } from "../api/services/reportApi";
import { blogApi } from "../api/services/blogApi";
import { appointmentApi } from "../api/services/appointmentApi";
import { chatApi } from "../api/services/chatApi";
import { clinicalNotesApi, doctorScheduleApi, doctorApi } from "../api";
import { userApi } from "../api/services/userApi";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["settings", "uiState"],
  version: 1,
  migrate: (state) => {
    return Promise.resolve(state);
  },
  throttle: 500,
  serialize: true,
  writeFailHandler: (err) => {
    console.warn("Redux persist write failed:", err);
  },
};

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["accessToken", "refreshToken", "userID", "role", "email", "username", "profile", "preferences"],
  version: 1,
  migrate: (state) => {
    return Promise.resolve(state);
  },
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  settings: settingsReducer,
  uiState: uiStateReducer,
  entities: entitiesReducer,
  forms: combineReducers({
    loginForm: loginFormReducer,
    registerForm: registerFormReducer,
    passwordResetForm: passwordResetFormReducer,
    appointmentForm: appointmentFormReducer,
  }),
  ui: combineReducers({
    loading: loadingReducer,
    errors: uiErrorsReducer,
    modals: modalsReducer,
  }),
  [authApi.reducerPath]: authApi.reducer,
  [reportApi.reducerPath]: reportApi.reducer,
  [blogApi.reducerPath]: blogApi.reducer,
  [appointmentApi.reducerPath]: appointmentApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
  [clinicalNotesApi.reducerPath]: clinicalNotesApi.reducer,
  [doctorScheduleApi.reducerPath]: doctorScheduleApi.reducer,
  [doctorApi.reducerPath]: doctorApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        warnAfter: 64,
      },
      immutableCheck: {
        warnAfter: 64,
      },
    }).concat(
      authApi.middleware,
      reportApi.middleware,
      blogApi.middleware,
      appointmentApi.middleware,
      chatApi.middleware,
      clinicalNotesApi.middleware,
      doctorScheduleApi.middleware,
      doctorApi.middleware,
      userApi.middleware
    );

    return middleware;
  },
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

if (typeof window !== 'undefined') {
  window.__REDUX_STORE__ = store;
}

export default store;
