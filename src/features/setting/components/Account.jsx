function Account() {
    return (
        <div>
            <div className="hidden w-full space-y-6 md:block">
                {/* Separator */}
                <div className="flex flex-col lg:flex-row lg:space-x-12 lg:space-y-0 space-y-8">
                    <div className="flex-1 pb-2 mb-10 lg:max-w-2xl">
                        {/* About Page Content */}
                        <h2 className="text-lg font-bold tracking-tight">Profile</h2>
                        <p className="text-md text-muted-foreground size-3xl">
                            Update your account settings. Set your preferred language and timezone.
                        </p>
                        <div className="rounded-lg divide-y divide-gray-200">
                            <dl className="grid grid-cols-3 gap-4 pt-4 pb-2">
                                {/* Username */}
                                <dt className="text-md size-3xl text-gray-900">Username</dt>
                                <dd className="text-md size-3xl text-gray-900">Huy Doan</dd>
                                <dd className="mx-16">
                                    <a
                                        href="#"
                                        className="
                                            text-center px-4 text-sm text-2xl text-gray-900
                                            border border-gray-600 rounded-md
                                            hover:border-indigo-300
                                            focus:outline-none focus:ring-1 focus:ring-gray-600
                                            transition-colors duration-150
                                        "
                                    >
                                        Update
                                    </a>
                                </dd>
                                {/* Email */}
                                <dt className="text-md size-3xl text-gray-900">Email address</dt>
                                <dd className="text-md size-3xl text-gray-900">test@example.com</dd>
                                <dd className="mx-16">
                                    <a
                                        href="#"
                                        className="
                                            text-center px-4 text-sm text-2xl text-gray-900
                                            border border-gray-600 rounded-md
                                            hover:border-indigo-300
                                            focus:outline-none focus:ring-1 focus:ring-gray-600
                                            transition-colors duration-150
                                        "
                                    >
                                        Update
                                    </a>
                                </dd>
                                {/* Role */}
                                <dt className="text-md size-3xl text-gray-900">Role</dt>
                                <dd className="text-md size-3xl text-gray-900">User</dd>
                                <dd className="mx-16">
                                    <a
                                        href="#"
                                        className="
                                            text-center px-4 text-sm text-2xl text-gray-900
                                            border border-gray-600 rounded-md
                                            hover:border-indigo-300
                                            focus:outline-none focus:ring-1 focus:ring-gray-600
                                            transition-colors duration-150
                                        "
                                    >
                                        Update
                                    </a>
                                </dd>
                            </dl>
                        </div>

                        <h2 className="text-lg font-bold tracking-tight pt-12 pb-4">Password</h2>
                        <p className="text-md text-muted-foreground size-3xl">
                            Strengthen your account by ensuring your password is strong.
                        </p>
                        <div className="rounded-lg divide-y divide-gray-200">
                            <dl className="grid grid-cols-2 gap-3 pt-4 pb-4">
                                <div className="mb-1">
                                    <label htmlFor="user_new_password">New password</label>
                                </div>
                                <input
                                    type="password"
                                    className="form-control pb-2 px-1 py-1 border border-gray-600 rounded-md"
                                    id="user_new_password"
                                />

                                <div className="mb-1">
                                    <label htmlFor="user_confirm_password">Confirm new password</label>
                                </div>
                                <input
                                    type="password"
                                    className="form-control pb-2 px-1 py-1 border border-gray-600 rounded-md"
                                    id="user_confirm_password"
                                />

                                <div className="mt-6 w-full flex items-center justify-between"></div>
                                <div className="mb-1 mx-47 w-full flex items-center justify-between">
                                    <button
                                        type="submit"
                                        className="
                                            px-4 py-2
                                            border border-gray-600 text-gray-800 text-sm size-medium
                                            rounded-md
                                            hover:bg-gray-50
                                            focus:outline-none focus:ring-2 focus:ring-gray-400
                                        "
                                    >
                                        Update Password
                                    </button>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Account;