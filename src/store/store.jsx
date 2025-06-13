import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../state/data/authSlice";
import entitiesReducer from "../state/data/entitiesSlice";
import settingsReducer from "../state/data/settingsSlice";
import uiStateReducer from "../state/data/uiStateSlice";

import loginFormReducer from "../state/forms/loginFormSlice";
import registerFormReducer from "../state/forms/registerFormSlice";
import appointmentFormReducer from "../state/forms/appointmentFormSlice";

import loadingReducer from "../state/ui/loadingSlice";
import uiErrorsReducer from "../state/ui/errorsSlice";
import notificationsReducer from "../state/ui/notificationsSlice";
import modalsReducer from "../state/ui/modalsSlice";
import { apiSlice } from "../services/api";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["data"],
};

const rootReducer = combineReducers({
  data: combineReducers({
    auth: authReducer,
    entities: entitiesReducer,
    settings: settingsReducer,
    uiState: uiStateReducer,
  }),
  forms: combineReducers({
    loginForm: loginFormReducer,
    registerForm: registerFormReducer,
    appointmentForm: appointmentFormReducer,
  }),
  ui: combineReducers({
    loading: loadingReducer,
    errors: uiErrorsReducer,
    notifications: notificationsReducer,
    modals: modalsReducer,
  }),
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
  
});

export const persistor = persistStore(store);
