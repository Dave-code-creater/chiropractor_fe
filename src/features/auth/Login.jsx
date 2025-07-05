import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../services/authApi";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { validateEmail, validatePassword } from "../../components/forms/FormUtils";
import {
  setEmailError,
  clearEmailError,
  setPasswordError,
  clearPasswordError,
} from "../../state/forms/loginFormSlice";
import { useAuthReady } from "../../hooks/useAuthReady";
import { toast } from "sonner";

// Role-based redirect paths
const ROLE_REDIRECTS = {
  admin: (id) => `/dashboard/admin/${id}`,
  doctor: (id) => `/dashboard/doctor/${id}`,
  staff: (id) => `/dashboard/staff/${id}`,
  patient: (id) => `/dashboard/patient/${id}`,
};

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
      const good = validateEmail(email);
      dispatch(clearEmailError(good));
    } catch (err) {
      dispatch(setEmailError(err.message));
    }
  };

  const handlePwBlur = () => {
    try {
      const good = validatePassword(password);
      dispatch(clearPasswordError(good));
    } catch (err) {
      dispatch(setPasswordError(err.message));
    }
  };

  useEffect(() => {
    if (!isReady || !isAuthenticated || !userID || !role) {
      return; // Don't redirect if we don't have all required data
    }

    // Get the redirect function for the user's role
    const getRedirectPath = ROLE_REDIRECTS[role.toLowerCase()];
    
    if (!getRedirectPath) {
      console.error(`Unknown role: ${role}`);
      toast.error("Login successful but role configuration is invalid");
      return;
    }

    // Determine final redirect path
    const redirectPath = location.state?.from?.pathname || getRedirectPath(userID);

    // Validate the redirect path
    if (!redirectPath.startsWith('/dashboard')) {
      console.warn(`Invalid redirect path: ${redirectPath}`);
      navigate(getRedirectPath(userID), { replace: true });
      return;
    }

    navigate(redirectPath, { replace: true });
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
      
      // The API returns { token, refreshToken, user } directly
      if (!result?.user?.role) {
        throw new Error("Invalid response from server");
      }

      // Success toast - use first_name from the response if available
      toast.success(`Welcome back${result.user.first_name ? `, ${result.user.first_name}` : ''}! (Role: ${result.user.role})`);
      
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
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{" "}
          <Link
            to="/register"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
