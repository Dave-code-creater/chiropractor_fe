import "./App.css";
import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import ThemeProvider from "./contexts/ThemeContext.jsx";
import AuthSessionManager from "./components/auth/AuthSessionManager";
import TokenExpirationMonitor from "./components/auth/TokenExpirationMonitor";
import { attemptSessionRestore } from "./utils/sessionUtils";
import store from "./store/store";

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
