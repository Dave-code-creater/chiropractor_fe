import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRegisterMutation } from "../../api/services/authApi";
import { useNavigate } from "react-router-dom";
import {
  renderPhoneNumber,
  renderGmailExprs,
  renderPwRegister,
  validatePhoneNumber
} from "../../components/forms/FormUtils";
import {
  setPhoneError,
  clearPhoneError,
  setEmailError,
  clearEmailError,
  setPasswordError,
  clearPasswordError,
  setConfirmPasswordError,
  clearConfirmPasswordError,
} from "../../state/forms/registerFormSlice";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userID, role, isAuthenticated } = useSelector(
    (state) => state.auth,
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const phoneError = useSelector(
    (state) => state.forms.registerForm.errors.phone,
  );
  const errorEmail = useSelector(
    (state) => state.forms.registerForm.errors.email,
  );
  const pwError = useSelector(
    (state) => state.forms.registerForm.errors.password,
  );
  const confirmpwError = useSelector(
    (state) => state.forms.registerForm.errors.confirmPassword,
  );

  const [registerMutation, { isLoading, error: registerError }] =
    useRegisterMutation();

  useEffect(() => {
    if (isAuthenticated && userID && role) {
      const path = `/dashboard/${role.toLowerCase()}/${userID}`;
      navigate(path);
    }
  }, [isAuthenticated, navigate, role, userID]);

  const handlePhoneBlur = () => {
    try {
      const validatedPhone = validatePhoneNumber(phone);
      const formatted = renderPhoneNumber(validatedPhone);
      setPhone(formatted);
      dispatch(clearPhoneError());
    } catch (err) {
      dispatch(setPhoneError(err.message));
    }
  };

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
      const good = renderPwRegister(password);
      dispatch(clearPasswordError(good));
    } catch (err) {
      dispatch(setPasswordError(err.message));
    }
  };

  const handleConfirmPwBlur = () => {
    if (confirmPassword !== password) {
      dispatch(setConfirmPasswordError("Passwords do not match"));
    } else {
      dispatch(clearConfirmPasswordError());
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const userData = {
      first_name: firstName,
      last_name: lastName,
      phone_number: phone,
      email: email,
      password: password,
      confirm_password: confirmPassword,
    };

    try {
      await registerMutation(userData).unwrap();
    } catch {}
  };
  return (
    <section className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl p-6 sm:p-8 lg:p-12">
          <div className="mx-auto h-10 w-auto" />
          <h1 className="text-2xl font-semibold text-center text-foreground">
            Create Your Account
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Let's get you all set up so you can start your journey with us.
          </p>

          <form
            noValidate
            onSubmit={handleRegister}
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
          >
            <div>
              <label htmlFor="firstName" className="text-sm block mb-1 text-foreground">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                className="w-full px-3 py-2.5 sm:px-4 sm:py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring appointment-input"
                required
              />
            </div>

            <div>
              <label htmlFor="lastName" className="text-sm block mb-1 text-foreground">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                className="w-full px-3 py-2.5 sm:px-4 sm:py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring appointment-input"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="text-sm block mb-1 text-foreground">
                Phone Number
              </label>
              <FormattedInput
                type="phone"
                id="phone"
                value={phone}
                onChange={setPhone}
                onBlur={handlePhoneBlur}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring appointment-input"
                required
              />
              {phoneError && <p className="text-red-600 text-sm mt-1">{phoneError}</p>}
            </div>

            <div>
              <label htmlFor="email" className="text-sm block mb-1 text-foreground">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                placeholder="Enter your email address"
                className="w-full px-3 py-2.5 sm:px-4 sm:py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring appointment-input"
                required
              />
              {errorEmail && <p className="text-red-600 text-sm mt-1">{errorEmail}</p>}
            </div>

            <div>
              <label htmlFor="password" className="text-sm block mb-1 text-foreground">
                Password
              </label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={handlePwBlur}
                placeholder="Enter your password"
                className="w-full px-3 py-2.5 sm:px-4 sm:py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring appointment-input"
                required
              />
              {pwError && <p className="text-red-600 text-sm mt-1">{pwError}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-sm block mb-1 text-foreground">
                Confirm Password
              </label>
              <PasswordInput
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={handleConfirmPwBlur}
                placeholder="Confirm your password"
                className="w-full px-3 py-2.5 sm:px-4 sm:py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring appointment-input"
                required
              />
              {confirmpwError && <p className="text-red-600 text-sm mt-1">{confirmpwError}</p>}
            </div>

            <div className="col-span-1 sm:col-span-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-primary px-3 py-2.5 sm:py-1.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors appointment-button"
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            </div>

            {registerError && (
              <p className="text-sm text-red-600">
                {registerError.data?.message ||
                  registerError.error ||
                  "Login failed"}
              </p>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already Have an Account?{" "}
            <a href="/login" className="text-primary hover:underline hover:text-primary/80 transition-colors">
              Log In
            </a>
          </p>
      </div>
    </section>
  );
}
