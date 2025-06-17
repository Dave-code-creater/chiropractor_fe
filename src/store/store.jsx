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
import { authApi } from "../services/authApi";
import { reportApi } from "../services/reportApi";
import { blogApi } from "../services/blogApi";
import { appointmentApi } from "../services/appointmentApi";
import { chatApi } from "../services/chatApi";

import blogReducer from "../features/blog/blogSlice";
import appointmentsReducer from "../features/appointments/AppointmentsSlice";
import chatReducer from "../features/chat/chatSlice";

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
    blog: blogReducer,
    appointments: appointmentsReducer,
    chat: chatReducer,
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
  [authApi.reducerPath]: authApi.reducer,
  [reportApi.reducerPath]: reportApi.reducer,
  [blogApi.reducerPath]: blogApi.reducer,
  [appointmentApi.reducerPath]: appointmentApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      authApi.middleware,
      reportApi.middleware,
      blogApi.middleware,
      appointmentApi.middleware,
      chatApi.middleware
    ),
  
});

export const persistor = persistStore(store);
