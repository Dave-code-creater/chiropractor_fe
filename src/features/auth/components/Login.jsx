import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLoginMutation } from "../../../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loginMutation, { isLoading, error: loginError }] = useLoginMutation();

    useEffect(() => {
        if (isAuthenticated) {
            if (user.role.name === "admin") {
                navigate(`/admin/${user.id}`);
            } else {
                navigate(`/dashboard/${user.id}`);
            }
        }
    }, [isAuthenticated, navigate, user]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await loginMutation({ email, password }).unwrap();
        } catch {
            // any error will be displayed below
        }
    };

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
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900">
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
                            className="mt-2 block w-full rounded-md border px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-indigo-600"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-2 block w-full rounded-md border px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-indigo-600"
                        />
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
                        <p className="text-sm text-red-600">
                            {loginError.data?.message || loginError.error || "Login failed"}
                        </p>
                    )}
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Not a member?{" "}
                    <a
                        href="/register"
                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                        Register with us
                    </a>
                </p>
            </div>
        </div>
    );
}