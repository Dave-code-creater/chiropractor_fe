import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRegisterMutation } from "../authAPI";
import { useNavigate } from "react-router-dom";
import { renderPhoneNumber, renderGmailExprs, renderPwRegister } from "../../../utils/renderUtilsFunc";
import { setEmailError, clearEmailError, setPasswordError, clearPasswordError, setConfirmpassword, clearConfirmPwError, } from "../../../utils/formerrorSlice";

export default function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const errorEmail = useSelector(state => state.formError.email)
    const pwError = useSelector(state => state.formError.password)
    const confirmpwError = useSelector(state => state.formError.confirmPassword)

    // RTK Query mutation hook
    const [registerMutation, { isLoading, error: registerError }] = useRegisterMutation();

    useEffect(() => {
        if (isAuthenticated) {
            // After successful registration, navigate to the appropriate dashboard
            if (user.role.name === "admin") {
                navigate(`/admin/${user.id}`);
            } else {
                navigate(`/dashboard/${user.id}`);
            }
        }
    }, [isAuthenticated, navigate, user]);

    const handleEmailBlur = () => {
        try {
            const good = renderGmailExprs(email)
            dispatch(clearEmailError(good))
        } catch (err) {
            dispatch(setEmailError(err.message));
        }
    }

    const handlePwBlur = () => {
        try {
            const good = renderPwRegister(password)
            dispatch(clearPasswordError(good))
        } catch (err) {
            dispatch(setPasswordError(err.message))
        }
    }

    const handleConfirmPwBlur = () => {
        if (confirmPassword !== password) {
            dispatch(setConfirmpassword('Passwords do not match'));
        } else {
            dispatch(clearConfirmPwError());
        }
    }
    const handlePhoneBlur = () => {
        const formatted = renderPhoneNumber(phone);
        setPhone(formatted)
    }

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
    console.log(registerError)
    return (
        <section>
            <div className="flex justify-center items-center">
                <div className="w-full max-w-3xl p-12 lg:p-12 bg-white">
                    <div className="mx-auto h-10 w-auto" />
                    <h1 className="text-2xl font-semibold text-center text-gray-900">
                        Create your account
                    </h1>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Let’s get you all set up so you can start your journey with us.
                    </p>

                    <form noValidate onSubmit={handleRegister} className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="firstName" className="text-sm block mb-1">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="John"
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
                                placeholder="Doe"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="text-sm block mb-1">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                onBlur={handlePhoneBlur}
                                placeholder="123-456-7890"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
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
                                placeholder="you@example.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            {errorEmail && <p style={{ color: 'red' }}>{errorEmail}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="text-sm block mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={handlePwBlur}
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            {pwError && <p className="text-red-500">{pwError}</p>}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="text-sm block mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onBlur={handleConfirmPwBlur}
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            {confirmpwError && <p className="text-red-500">{confirmpwError}</p>}
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
                                {registerError.data?.message || registerError.error || "Login failed"}

                            </p>
                        )}

                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <a
                            href="/login"
                            className="text-blue-600 hover:underline"
                        >
                            Log in
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}
