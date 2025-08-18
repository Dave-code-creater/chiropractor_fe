import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import "./index.css";
import App from "./App.jsx";
import { store, persistor } from "./store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import SessionLoadingScreen from "./components/loading/SessionLoadingScreen";

// Loading component during rehydration - Enhanced version
const LoadingComponent = () => (
  <SessionLoadingScreen message="Loading your account..." />
);

// Conditional StrictMode wrapper - only in development
const AppWrapper = ({ children }) => {
  return import.meta.env.DEV ? (
    <StrictMode>{children}</StrictMode>
  ) : (
    children
  );
};

// Create root only once and store it
const container = document.getElementById("root");
let root = container._reactRoot;

if (!root) {
  root = createRoot(container);
  container._reactRoot = root;
}

// Render the app
root.render(
  <AppWrapper>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id'}>
      <BrowserRouter>
        <Provider store={store}>
          <PersistGate loading={<LoadingComponent />} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </AppWrapper>
);
