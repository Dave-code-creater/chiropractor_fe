import "./App.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import ThemeProvider from "./contexts/ThemeContext";
import AuthSessionManager from "./components/auth/AuthSessionManager";
import { attemptSessionRestore } from "./utils/sessionUtils";
import store from "./store/store";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Attempt to restore session when app loads
    // This runs after Redux persist has rehydrated the state
    const timer = setTimeout(() => {
      attemptSessionRestore(store);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <div className="App">
        <AuthSessionManager>
          <AppRoutes />
        </AuthSessionManager>
      </div>
    </ThemeProvider>
  );
};

export default App;
