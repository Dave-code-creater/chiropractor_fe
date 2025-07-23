import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../api/services/authApi";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { validateEmail, validatePassword } from "../../components/forms/FormUtils";
import PasswordInput from "../../components/forms/PasswordInput";
import {
  setEmailError,
  clearEmailError,
  setPasswordError,
  clearPasswordError,
} from "../../state/forms/loginFormSlice";
import { useAuthReady } from "../../hooks/useAuthReady";
import { toast } from "sonner";
import { enhancedToast } from "@/components/notifications/SimpleToast";
import { selectUserId, selectUserRole } from "../../state/data/authSlice";

// Role-based redirect paths
const ROLE_REDIRECTS = {
  admin: (id) => `/dashboard/admin/${id}`,
  doctor: (id) => `/dashboard/doctor/${id}`,
  patient: (id) => `/dashboard/patient/${id}`,
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isReady, isAuthenticated, role } = useAuthReady();
  const userID = useSelector(selectUserId);
  const userRole = useSelector(selectUserRole);
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

  // Handle already authenticated users
  useEffect(() => {
    if (isReady && isAuthenticated && userID && userRole) {
      // Use setTimeout to prevent navigation during render
      const timer = setTimeout(() => {
        navigate(`/dashboard/${userRole.toLowerCase()}/${userID}`, { replace: true });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isReady, isAuthenticated, userID, userRole, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Clear any existing errors
    dispatch(clearEmailError());
    dispatch(clearPasswordError());

    if (!email || !password) {
      enhancedToast.validation.required(!email ? "Email address" : "Password");
      return;
    }

    try {
      const response = await loginMutation({ email, password }).unwrap();

      // Validate response
      if (!response?.user?.id || !response?.user?.role) {
        console.error('Invalid login response:', response);
        enhancedToast.error(
          "Login system error",
          {
            description: "There was a problem with the authentication system. Please try again.",
            action: () => handleLogin(event),
            actionLabel: "Retry Login"
          }
        );
        return;
      }

      // Show success message
      enhancedToast.auth.success(`Successfully signed in as ${response.user.role}`);

      // Navigate to the appropriate dashboard
      navigate(`/dashboard/${response.user.role.toLowerCase()}/${response.user.id}`);
    } catch (error) {
      console.error('Login error:', error);

      // Handle different types of authentication errors
      if (error?.status === 401 || error?.data?.message?.toLowerCase().includes('invalid')) {
        enhancedToast.auth.invalid("Please check your email and password and try again");
      } else if (error?.status === 403) {
        enhancedToast.error(
          "Account access restricted",
          {
            description: "Your account may be temporarily suspended or require verification.",
            action: {
              label: "Contact Support",
              onClick: () => navigate('/contact')
            }
          }
        );
      } else if (error?.status === 429) {
        enhancedToast.error(
          "Too many login attempts",
          {
            description: "Please wait a few minutes before trying again to protect your account.",
            showSupport: false,
            duration: 8000
          }
        );
      } else if (error?.status >= 500) {
        enhancedToast.error(
          "Server temporarily unavailable",
          {
            description: "Our servers are experiencing issues. Please try again in a few moments.",
            action: () => handleLogin(event),
            actionLabel: "Retry"
          }
        );
      } else if (!navigator.onLine) {
        enhancedToast.error(
          "No internet connection",
          {
            description: "Please check your internet connection and try again.",
            showSupport: false,
            duration: 5000
          }
        );
      } else {
        enhancedToast.error(
          "Login failed",
          {
            description: error?.data?.message || "An unexpected error occurred. Please try again.",
            action: () => handleLogin(event),
            actionLabel: "Try Again"
          }
        );
      }
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
            <div className="mt-2">
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={handlePwBlur}
                placeholder="Enter your password"
                className="block w-full rounded-md border px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-indigo-600"
                required
              />
            </div>
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
