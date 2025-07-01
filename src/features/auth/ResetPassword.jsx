import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useResetPasswordMutation,
  useVerifyResetTokenQuery,
} from "../../services/authApi";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { renderPwRegister } from "../../utils/renderUtilsFunc";
import {
  setPasswordError,
  clearPasswordError,
  setConfirmPasswordError,
  clearConfirmPasswordError,
} from "../../state/forms/registerFormSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Lock,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);

  const pwError = useSelector(
    (state) => state.forms.registerForm.errors.password,
  );
  const confirmpwError = useSelector(
    (state) => state.forms.registerForm.errors.confirmPassword,
  );

  // Verify token on component mount
  const {
    data: tokenData,
    error: tokenError,
    isLoading: isVerifyingToken,
  } = useVerifyResetTokenQuery(token, {
    skip: !token,
  });

  const [resetPasswordMutation, { isLoading: isResetting, error: resetError }] =
    useResetPasswordMutation();

  useEffect(() => {
    // Redirect to forgot password if no token
    if (!token) {
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const handlePasswordBlur = () => {
    try {
      const validPassword = renderPwRegister(password);
      dispatch(clearPasswordError(validPassword));
    } catch (err) {
      dispatch(setPasswordError(err.message));
    }
  };

  const handleConfirmPasswordBlur = () => {
    if (confirmPassword !== password) {
      dispatch(setConfirmPasswordError("Passwords do not match"));
    } else {
      dispatch(clearConfirmPasswordError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearPasswordError());
    dispatch(clearConfirmPasswordError());

    // Validate password
    try {
      renderPwRegister(password);
    } catch (err) {
      dispatch(setPasswordError(err.message));
      return;
    }

    // Check password confirmation
    if (confirmPassword !== password) {
      dispatch(setConfirmPasswordError("Passwords do not match"));
      return;
    }

    try {
      await resetPasswordMutation({
        token,
        password,
        confirmPassword,
      }).unwrap();
      setIsResetSuccessful(true);
    } catch (error) {
      console.error("Reset password error:", error);
    }
  };

  // Loading state while verifying token
  if (isVerifyingToken) {
    return (
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-sm text-muted-foreground">
                Verifying reset token...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Invalid or expired token
  if (tokenError || !tokenData) {
    return (
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl text-red-800">
                Invalid or Expired Link
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-red-700">
                This password reset link is invalid or has expired. Reset links
                are only valid for 15 minutes.
              </p>
              <div className="space-y-3 pt-4">
                <Link to="/forgot-password">
                  <Button className="w-full">Request New Reset Link</Button>
                </Link>
                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Success state
  if (isResetSuccessful) {
    return (
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl text-green-800">
                Password Reset Successful
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-green-700">
                Your password has been successfully reset. You can now log in
                with your new password.
              </p>
              <div className="pt-4">
                <Link to="/login">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Continue to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Reset Your Password</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter your new password below. Make sure it's strong and secure.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={handlePasswordBlur}
                    placeholder="••••••••"
                    className={
                      pwError
                        ? "border-red-500 focus:border-red-500 pr-10"
                        : "pr-10"
                    }
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {pwError && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {pwError}
                  </p>
                )}
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Password must contain:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>At least 8 characters</li>
                    <li>One uppercase letter</li>
                    <li>One lowercase letter</li>
                    <li>One number</li>
                    <li>One special character</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={handleConfirmPasswordBlur}
                    placeholder="••••••••"
                    className={
                      confirmpwError
                        ? "border-red-500 focus:border-red-500 pr-10"
                        : "pr-10"
                    }
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {confirmpwError && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {confirmpwError}
                  </p>
                )}
              </div>

              {resetError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {resetError.data?.message ||
                      resetError.error ||
                      "Failed to reset password. Please try again."}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={
                  isResetting || !password.trim() || !confirmPassword.trim()
                }
                className="w-full"
              >
                {isResetting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
