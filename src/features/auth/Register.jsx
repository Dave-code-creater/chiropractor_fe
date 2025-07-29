import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRegisterMutation } from "../../api/services/authApi";
import { useNavigate } from "react-router-dom";
import FormattedInput from "../../components/forms/FormattedInput";
import PasswordInput from "../../components/forms/PasswordInput";
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

  // RTK Query mutation hook
  const [registerMutation, { isLoading, error: registerError }] =
    useRegisterMutation();

  useEffect(() => {
    if (isAuthenticated && userID && role) {
      // After successful registration, navigate to the appropriate dashboard
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
      // On success, RTK Query's onQueryStarted will dispatch setCredentials
    } catch {
      // Validation or network errors will be shown below
    }
  };
  return (
    <section>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-3xl p-12 lg:p-12 bg-white">
          <div className="mx-auto h-10 w-auto" />
          <h1 className="text-2xl font-semibold text-center text-gray-900">
            Create Your Account
          </h1>
          <p className="mt-2 text-center text-sm text-gray-400">
            Let's get you all set up so you can start your journey with us.
          </p>

          <form
            noValidate
            onSubmit={handleRegister}
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            <div>
              <label htmlFor="firstName" className="text-sm block mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="lastName" className="text-sm block mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="text-sm block mb-1">
                Phone Number
              </label>
              <FormattedInput
                type="phone"
                id="phone"
                value={phone}
                onChange={setPhone}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {phoneError && <p style={{ color: "red" }}>{phoneError}</p>}
            </div>

            <div>
              <label htmlFor="email" className="text-sm block mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                placeholder="Enter your email address"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {errorEmail && <p style={{ color: "red" }}>{errorEmail}</p>}
            </div>

            <div>
              <label htmlFor="password" className="text-sm block mb-1">
                Password
              </label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={handlePwBlur}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {pwError && <p style={{ color: "red" }}>{pwError}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-sm block mb-1">
                Confirm Password
              </label>
              <PasswordInput
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={handleConfirmPwBlur}
                placeholder="Confirm your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {confirmpwError && <p style={{ color: "red" }}>{confirmpwError}</p>}
            </div>

            <div className="col-span-1 sm:col-span-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
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

          <p className="mt-6 text-center text-sm text-gray-600">
            Already Have an Account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
