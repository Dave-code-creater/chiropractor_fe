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
} from 'redux-persist';
import authReducer from "../state/data/authSlice";
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
import { clinicalNotesApi } from "../services/clinicalNotesApi";

// Enhanced persist config for better performance
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["data"],
  version: 1,
  migrate: (state) => {
    return Promise.resolve(state);
  },
  throttle: 500, // Reduced throttle for better responsiveness
  serialize: true,
  writeFailHandler: (err) => {
    console.warn('Redux persist write failed:', err);
  },
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
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types from Redux Persist
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          // Also ignore RTK Query actions
          "api/executeQuery/pending",
          "api/executeQuery/fulfilled", 
          "api/executeQuery/rejected",
          "api/executeMutation/pending",
          "api/executeMutation/fulfilled",
          "api/executeMutation/rejected",
          // Auth API specific actions
          "authApi/executeQuery/pending",
          "authApi/executeQuery/fulfilled",
          "authApi/executeQuery/rejected",
          "authApi/executeMutation/pending", 
          "authApi/executeMutation/fulfilled",
          "authApi/executeMutation/rejected",
        ],
        // Ignore these field paths in all actions
        ignoredActionsPaths: [
          'meta.arg', 
          'payload.timestamp',
          'register',
          'rehydrate'
        ],
        // Ignore these paths in the state
        ignoredPaths: [
          'items.dates',
          'register',
          'rehydrate'
        ],
        warnAfter: 64, // Reduced warning threshold for better monitoring
      },
      immutableCheck: {
        warnAfter: 64, // Reduced warning threshold
        // Ignore these paths for immutability checks
        ignoredPaths: ['register', 'rehydrate'],
      },
      // Enhanced timing configuration
      timing: {
        enabled: process.env.NODE_ENV === 'development',
        warnAfter: 32, // Warn after 32ms
      },
    })
    .concat(
      authApi.middleware,
      reportApi.middleware,
      blogApi.middleware,
      appointmentApi.middleware,
      chatApi.middleware,
      clinicalNotesApi.middleware
    ),
  devTools: process.env.NODE_ENV !== "production" && {
    name: "ChiroCare App",
    trace: true,
    traceLimit: 25,
    maxAge: 50,
    // Serialize state snapshots for better debugging
    serialize: {
      options: {
        undefined: true,
        function: true,
      },
    },
    // Enhanced action sanitization
    actionSanitizer: (action) => ({
      ...action,
      type: action.type,
      payload: action.payload && typeof action.payload === 'object' 
        ? { ...action.payload, timestamp: '[SANITIZED]' }
        : action.payload
    }),
    stateSanitizer: (state) => ({
      ...state,
      // Remove large objects from dev tools
      api: '[API_STATE_SANITIZED]',
    }),
  },
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers({
      autoBatch: { type: 'tick' },
    }),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

// Enhanced performance monitoring
if (process.env.NODE_ENV === 'development') {
  let lastTime = performance.now();
  let updateCount = 0;
  let slowUpdates = [];
  
  // Performance monitoring with better analytics
  const performanceMonitor = () => {
    const currentTime = performance.now();
    const timeDiff = currentTime - lastTime;
    updateCount++;
    
    // Track slow updates for analysis
    if (timeDiff > 32) { // Lowered threshold to 32ms for better monitoring
      slowUpdates.push({
        updateNumber: updateCount,
        duration: timeDiff,
        timestamp: new Date().toISOString()
      });
      
      console.warn(`⚠️ Slow state update #${updateCount}: ${timeDiff.toFixed(2)}ms`);
      
      // Keep only last 10 slow updates
      if (slowUpdates.length > 10) {
        slowUpdates = slowUpdates.slice(-10);
      }
    }
    
    // Log performance summary every 100 updates
    if (updateCount % 100 === 0) {
      const avgSlowUpdate = slowUpdates.length > 0 
        ? slowUpdates.reduce((sum, update) => sum + update.duration, 0) / slowUpdates.length
        : 0;
      
      console.log(`📊 Performance Summary (${updateCount} updates):`, {
        slowUpdates: slowUpdates.length,
        averageSlowUpdate: avgSlowUpdate.toFixed(2) + 'ms',
        lastSlowUpdate: slowUpdates[slowUpdates.length - 1]
      });
    }
    
    lastTime = currentTime;
  };
  
  // Debounced subscription to reduce overhead
  let timeoutId;
  store.subscribe(() => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(performanceMonitor, 5); // Reduced debounce time
  });
  
  // Expose performance utilities globally for debugging
  window.storePerformance = {
    getSlowUpdates: () => slowUpdates,
    resetMetrics: () => {
      slowUpdates = [];
      updateCount = 0;
      lastTime = performance.now();
    },
    getCacheStats: () => cacheActions.getCacheStats(),
    checkSerializability: () => cacheActions.checkSerializability(),
  };
}

export const cacheActions = {
  clearAllApiCache: () => {
    store.dispatch(authApi.util.resetApiState());
    store.dispatch(reportApi.util.resetApiState());
    store.dispatch(blogApi.util.resetApiState());
    store.dispatch(appointmentApi.util.resetApiState());
    store.dispatch(chatApi.util.resetApiState());
    store.dispatch(clinicalNotesApi.util.resetApiState());
  },
  
  prefetchCommonData: () => {
    // Prefetch critical data
    store.dispatch(authApi.endpoints.validateToken?.initiate?.() || { type: 'NOOP' });
    // Add other common data prefetching as needed
  },
  
  invalidateTag: (api, tag) => {
    store.dispatch(api.util.invalidateTags([tag]));
  },
  
  getCacheStats: () => {
    const state = store.getState();
    const stats = {};
    
    Object.keys(state).forEach(key => {
      if (key.endsWith('Api')) {
        const apiState = state[key];
        if (apiState.queries) {
          stats[key] = {
            queries: Object.keys(apiState.queries).length,
            mutations: Object.keys(apiState.mutations || {}).length,
          };
        }
      }
    });
    
    return stats;
  },
  
  // Enhanced serializability checker
  checkSerializability: () => {
    const state = store.getState();
    const nonSerializable = [];
    
    const checkValue = (value, path = '') => {
      if (typeof value === 'function') {
        nonSerializable.push(`Function at ${path}`);
      } else if (value instanceof Date) {
        nonSerializable.push(`Date at ${path}`);
      } else if (value instanceof RegExp) {
        nonSerializable.push(`RegExp at ${path}`);
      } else if (value && typeof value === 'object') {
        // Limit depth to prevent infinite recursion
        if (path.split('.').length < 10) {
          Object.keys(value).forEach(key => {
            checkValue(value[key], `${path}.${key}`);
          });
        }
      }
    };
    
    checkValue(state);
    return nonSerializable;
  },
  
  // New: Optimize state structure
  optimizeState: () => {
    const state = store.getState();
    const recommendations = [];
    
    // Check for large objects
    const checkSize = (obj, path = '') => {
      if (obj && typeof obj === 'object') {
        const size = JSON.stringify(obj).length;
        if (size > 50000) { // 50KB threshold
          recommendations.push(`Large object (${(size/1000).toFixed(1)}KB) at ${path}`);
        }
      }
    };
    
    Object.keys(state).forEach(key => {
      checkSize(state[key], key);
    });
    
    return recommendations;
  }
};

// Prefetch common data after initial load with retry logic
if (typeof window !== 'undefined') {
  const prefetchWithRetry = (retries = 3) => {
    try {
      cacheActions.prefetchCommonData();
    } catch (error) {
      if (retries > 0) {
        console.warn('Prefetch failed, retrying...', error);
        setTimeout(() => prefetchWithRetry(retries - 1), 1000);
      }
    }
  };
  
  setTimeout(prefetchWithRetry, 1000); // Reduced initial delay
}

export default store;
