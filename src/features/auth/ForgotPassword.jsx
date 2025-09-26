import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForgotPasswordMutation } from "../../api/services/authApi";
import { Link, useNavigate } from "react-router-dom";
import { renderGmailExprs, validateEmail } from "../../components/forms/FormUtils";
import {
  setEmailError,
  clearEmailError,
} from "../../state/forms/loginFormSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useDispatch();
  const errorEmail = useSelector((state) => state.forms.loginForm.errors.email);

  const [forgotPasswordMutation, { isLoading, error: forgotPasswordError }] =
    useForgotPasswordMutation();

  const handleEmailBlur = () => {
    try {
      const validEmail = renderGmailExprs(email);
      dispatch(clearEmailError(validEmail));
    } catch (err) {
      dispatch(setEmailError(err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearEmailError());

    try {
      renderGmailExprs(email);
    } catch (err) {
      dispatch(setEmailError(err.message));
      return;
    }

    try {
      await forgotPasswordMutation({ email }).unwrap();
      setIsSubmitted(true);
    } catch (error) {
      console.error("Forgot password error:", error);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl text-green-800">
                Check Your Email
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-green-700">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-xs text-green-600">
                If you don't see the email in your inbox, please check your spam
                folder. The link will expire in 15 minutes for security reasons.
              </p>
              <div className="space-y-3 pt-4">
                <Button
                  variant="outline"
                  className="w-full border-green-300 text-green-700 hover:bg-green-100"
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail("");
                  }}
                >
                  Send Another Email
                </Button>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="w-full text-green-700 hover:bg-green-100"
                  >
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

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Forgot Your Password?</CardTitle>
            <p className="text-sm text-muted-foreground">
              No worries! Enter your email address and we'll send you a link to
              reset your password.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                  placeholder="you@example.com"
                  className={
                    errorEmail ? "border-red-500 focus:border-red-500" : ""
                  }
                />
                {errorEmail && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errorEmail}
                  </p>
                )}
              </div>

              {forgotPasswordError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {forgotPasswordError.data?.message ||
                      forgotPasswordError.error ||
                      "Failed to send reset email. Please try again."}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending Reset Link...
                  </>
                ) : (
                  "Send Reset Link"
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

            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
