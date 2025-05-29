import { useState } from "react";

export default function Account() {
    const [username, setUsername] = useState("Huy Doan");
    const [email, setEmail] = useState("test@example.com");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <div className="w-full space-y-8">
            <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl p-8 border border-gray-200">

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your profile and security information.</p>
                </div>

                <div className="space-y-10">
                    {/* Profile Section */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Profile</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Password Section */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Password</h3>
                        <p className="text-sm text-gray-500 mb-4">Change your password to keep your account secure.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => alert("Password updated!")}
                                className="px-6 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm font-medium transition"
                            >
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}