import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import SessionLoadingScreen from "./components/loading/SessionLoadingScreen";
import "./index.css";
import { store, persistor } from "./store/store";

const LoadingComponent = () => (
  <SessionLoadingScreen message="Loading your account..." />
);

const AppWrapper = ({ children }) => {
  return import.meta.env.DEV ? (
    <StrictMode>{children}</StrictMode>
  ) : (
    children
  );
};

const container = document.getElementById("root");
let root = container._reactRoot;

if (!root) {
  root = createRoot(container);
  container._reactRoot = root;
}

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
