import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../services/authApi";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { renderGmailExprs, renderPassword } from "../../utils/renderUtilsFunc";
import {
  setEmailError,
  clearEmailError,
  setPasswordError,
  clearPasswordError,
} from "../../state/forms/loginFormSlice";
import { useAuthReady } from "../../hooks/useAuthReady";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isReady, isAuthenticated, userID, role } = useAuthReady();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMutation, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const errorEmail = useSelector((state) => state?.forms?.loginForm?.errors?.email);
  const pwError = useSelector((state) => state?.forms?.loginForm?.errors?.password);

  const handleEmailBlur = () => {
    try {
      const good = renderGmailExprs(email);
      dispatch(clearEmailError(good));
    } catch (err) {
      dispatch(setEmailError(err.message));
    }
  };

  const handlePwBlur = () => {
    try {
      const good = renderPassword(password);
      dispatch(clearPasswordError(good));
    } catch (err) {
      dispatch(setPasswordError(err.message));
    }
  };

  useEffect(() => {
    if (isReady && isAuthenticated) {
      // Get intended destination from location state
      const intendedPath = location.state?.from?.pathname;
      
      let redirectPath;
      if (intendedPath && intendedPath !== '/login') {
        redirectPath = intendedPath;
      } else {
        // Route users based on their role
        switch (role?.toLowerCase()) {
          case "admin":
            redirectPath = "/admin/dashboard";
            break;
          case "doctor":
            redirectPath = "/doctor/dashboard";
            break;
          case "staff":
            redirectPath = "/staff/dashboard";
            break;
          case "patient":
            redirectPath = userID ? `/dashboard/${userID}` : "/dashboard";
            break;
          default:
            redirectPath = "/dashboard";
        }
      }
      
      // Add a small delay to ensure state is properly updated
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 100);
    }
  }, [isReady, isAuthenticated, navigate, userID, role, location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Clear any existing errors
    dispatch(clearEmailError());
    dispatch(clearPasswordError());
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    try {
      const result = await loginMutation({ email, password }).unwrap();
      
      if (!result.data?.user?.role) {
        throw new Error("Invalid user role received");
      }

      // Success toast
      toast.success(`Welcome back${result.data.user.first_name ? `, ${result.data.user.first_name}` : ''}!`);
      
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error.data?.message || error.error || 'Invalid email or password';
      toast.error(errorMessage);
    }
  };

  // Show loading while auth state is being rehydrated
  if (!isReady) {
    return (
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="text-center">
          <div className="text-lg text-gray-600">🔄 Loading...</div>
          <div className="text-sm text-gray-500 mt-2">Checking your session</div>
        </div>
      </div>
    );
  }

  // If already authenticated, show redirecting message
  if (isAuthenticated) {
    return (
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="text-center">
          <div className="text-lg text-gray-600">🚀 Redirecting to your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleEmailBlur}
              placeholder="you@example.com"
              className="mt-2 block w-full rounded-md border px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-indigo-600"
            />
            {errorEmail && <p className="text-red-500 text-sm mt-1">{errorEmail}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={handlePwBlur}
              className="mt-2 block w-full rounded-md border px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-indigo-600"
            />
            {pwError && <p className="text-red-500 text-sm mt-1">{pwError}</p>}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{" "}
          <Link
            to="/register"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Register with us
          </Link>
        </p>
      </div>
    </div>
  );
}
