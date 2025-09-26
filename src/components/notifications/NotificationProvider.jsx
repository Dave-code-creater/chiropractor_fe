import { useEffect } from "react";
import { enhancedToast } from "./SimpleToast";

const NotificationProvider = ({ children }) => {
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleOnline = () => {
      enhancedToast.success("Connection restored", "You're back online");
    };

    const handleOffline = () => {
      enhancedToast.warning("No internet", "Please check your connection");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return children;
};

export default NotificationProvider;
