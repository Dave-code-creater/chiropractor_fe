import "./App.css";
import { useEffect } from "react";
import { attemptSessionRestore } from "./utils/sessionUtils";
import store from "./store/store";
import ThemeProvider from "./contexts/ThemeContext";
import AuthSessionManager from "./components/auth/AuthSessionManager";
import TokenExpirationMonitor from "./components/auth/TokenExpirationMonitor";
import AppRoutes from "./routes/AppRoutes";

const App = () => {

  useEffect(() => {
    const timer = setTimeout(() => {
      attemptSessionRestore(store);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <div className="App">
        <AuthSessionManager>
          <TokenExpirationMonitor />
          <AppRoutes />
        </AuthSessionManager>
      </div>
    </ThemeProvider>
  );
};

export default App;
