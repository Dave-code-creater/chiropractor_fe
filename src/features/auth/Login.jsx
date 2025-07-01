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


export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isReady, isAuthenticated, userID, role } = useAuthReady();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMutation, { isLoading, error: loginError }] = useLoginMutation();
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
    // Only redirect if auth state is ready, we're authenticated, AND currently on the login page
    if (isReady && isAuthenticated && location.pathname === '/login') {
      // Get intended destination from location state, or default based on role
      const intendedPath = location.state?.from?.pathname;
      
      let homePath;
      if (intendedPath && intendedPath !== '/login') {
        homePath = intendedPath;
      } else {
        // Route users based on their role
        switch (role) {
          case "admin":
            homePath = "/admin";
            break;
          case "doctor":
            homePath = "/doctor";
            break;
          case "staff":
            homePath = "/staff";
            break;
          case "patient":
          default:
            homePath = userID ? `/dashboard/${userID}` : "/dashboard";
            break;
        }
      }
      

      navigate(homePath, { replace: true });
    }
  }, [isReady, isAuthenticated, navigate, userID, role, location.pathname, location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(clearEmailError());
    dispatch(clearPasswordError());
    
    try {
      const result = await loginMutation({ email, password }).unwrap();
    } catch (error) {
      
      // any error will be displayed below
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

  // If already authenticated and not on login page, show redirecting message
  if (isAuthenticated && location.pathname !== '/login') {
    return (
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="text-center">
          <div className="text-lg text-gray-600">🚀 Redirecting...</div>
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
            {errorEmail && <p style={{ color: "red" }}>{errorEmail}</p>}
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
            {pwError && <p className="text-red-500">{pwError}</p>}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          {loginError && (
            <div>
              <p className="text-sm text-red-600">
                {loginError.data?.message || loginError.error || "Login failed"}
              </p>
            </div>
          )}
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
