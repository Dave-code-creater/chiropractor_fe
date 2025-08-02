import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation, useOauthLoginMutation } from "../../api/services/authApi";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { validateEmail, validatePassword } from "../../components/forms/FormUtils";
import PasswordInput from "../../components/forms/PasswordInput";
import OAuthLogin from "../../components/auth/OAuthLogin";
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
  const [oauthLoginMutation, { isLoading: isOAuthLoading }] = useOauthLoginMutation();
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

  // Handle OAuth login success
  const handleOAuthSuccess = async (userData) => {
    try {
      console.log('OAuth userData:', userData);

      const response = await oauthLoginMutation(userData).unwrap();

      // Validate response
      if (!response?.user?.id || !response?.user?.role) {
        console.error('Invalid OAuth login response:', response);
        enhancedToast.error(
          "OAuth login system error",
          {
            description: "There was a problem with the OAuth authentication system. Please try again.",
            duration: 8000
          }
        );
        return;
      }

      // Show success message
      enhancedToast.auth.success(`Successfully signed in with ${userData.provider} as ${response.user.role}`);

      // Navigate to the appropriate dashboard
      navigate(`/dashboard/${response.user.role.toLowerCase()}/${response.user.id}`);
    } catch (error) {
      console.error('OAuth login error:', error);

      // Handle OAuth-specific errors
      if (error?.status === 409) {
        enhancedToast.error(
          "Account already exists",
          {
            description: "An account with this email already exists. Please use regular login or contact support.",
            action: {
              label: "Try Regular Login",
              onClick: () => {
                // Focus on email input if the userData contains email
                if (userData.email) {
                  setEmail(userData.email);
                }
              }
            }
          }
        );
      } else if (error?.status === 422) {
        enhancedToast.error(
          "OAuth account incomplete",
          {
            description: "Your OAuth account is missing required information. Please complete your profile.",
            duration: 8000
          }
        );
      } else {
        enhancedToast.error(
          `${userData.provider} login failed`,
          {
            description: error?.data?.message || "An error occurred during OAuth authentication. Please try again.",
            duration: 6000
          }
        );
      }
    }
  };

  // Handle OAuth login error
  const handleOAuthError = (message, error) => {
    console.error('OAuth Error:', message, error);
    enhancedToast.error(
      "Authentication failed",
      {
        description: message || "OAuth login failed. Please try again.",
        duration: 5000
      }
    );
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

  // If already authenticated, show Facebook-like redirecting message
  if (isAuthenticated && userID && userRole) {
    return (
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="text-center">
          <div className="mb-4">
            <div className="text-4xl mb-4">👋</div>
            <div className="text-xl font-semibold text-gray-900 mb-2">
              Welcome back!
            </div>
            <div className="text-lg text-gray-600 mb-4">
              You're already signed in as {userRole}
            </div>
          </div>
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
          <div className="text-sm text-gray-500">
            Taking you to your dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Sign In to Your Account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email Address
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
              placeholder="Enter your email address"
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
                  Forgot Password?
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
              disabled={isLoading || isOAuthLoading}
              className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>



        {/* OAuth Login Component */}
        <div className="mt-6">
          <OAuthLogin
            onLoginSuccess={handleOAuthSuccess}
            onLoginError={handleOAuthError}
          />
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a Member?{" "}
          <Link
            to="/register"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
}
