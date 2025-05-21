import React from "react";


function Setting() {
    return (
        <div>
            <div className="hidden space-y-6 p-10 pb-16 md:block">
                <div className="space-y-0.5">
                    <h2 className="text-2xl font-bold tracking-tight ">Settings</h2>
                    <p className="text-muted-foreground">
                        Manage your account settings and set e-mail preferences.
                    </p>
                </div>
                {/* <!-- Seperator --> */}
                <div className="shrink-0 bg-border h-[1px] w-full"></div>
                <div
                    className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0"
                >
                    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                        <a
                            className="inline-flex items-center rounded-md text-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 hover:bg-transparent hover:underline justify-start"
                            href="/examples/forms">Profile</a
                        ><a
                            className="inline-flex items-center rounded-md text-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 bg-muted hover:bg-muted justify-start"
                            href="/examples/forms/account">Account</a
                        ><a
                            className="inline-flex items-center rounded-md text-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 hover:bg-transparent hover:underline justify-start"
                            href="/examples/forms/appearance">Appearance</a
                        ><a
                            className="inline-flex items-center rounded-md text-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 hover:bg-transparent hover:underline justify-start"
                            href="/examples/forms/notifications">Notifications</a
                        ><a
                            className="inline-flex items-center rounded-md text-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 hover:bg-transparent hover:underline justify-start"
                            href="/examples/forms/display">Display</a
                        >
                    </nav>

                    <div className="flex-1 lg:max-w-2xl">
                        {/* <!-- About Page Content --> */}
                        <h2 className="text-lg font-bold tracking-tight">Account</h2>
                        <p className="text-lg text-muted-foreground font-3xl ">
                            Update your account settings. Set your preferred language and
                            timezone.
                        </p>
                        <div className="mt-2 bg-white shadow-sm rounded-lg divide-y divide-gray-200">
                            <dl className="grid grid-cols-3 gap-4 pb-4 pt-4">
                                {/*dl = definition list / dt = definition terms / dd = definition description  */}
                                <dt className="text-md font-3xl text-gray-900">Full name</dt>
                                <dd className="text-md font-3xl text-gray-900">Your name</dd>
                                <dd className="text-md font-3xl text-gray-900"><a href="#">Update</a></dd>

                                <dl className="text-md font-3xl text-gray-900">Email address</dl>
                                <dd className="text-md font-3xl text-gray-900">Your email</dd>
                                <dd className="text-md font-3xl text-gray-900"><a href="#">Update</a></dd>

                                <dl className="text-md font-3xl text-gray-900">Role</dl>
                                <dd className="text-md font-3xl text-gray-900">Your role</dd>
                                <dd className="text-md font-3xl text-gray-900"><a href="#">Update</a></dd>
                            </dl>
                        </div>
                        <h2 className="text-lg font-bold tracking-tight">Password</h2>
                        <p className="text-lg text-muted-foreground font-3xl">
                            Strengthen your account by ensuring your password is strong.
                        </p>
                        <div className="mt-2 bg-white shadow-sm rounded-lg divide-y divide-gray-200">
                            <dl className="grid grid-cols-2 gap-3 pb-4 pt-4">
                                <div className="mb-1 test-lg font-4xl">
                                    <label htmlForFor="user_old_password">Old password</label>
                                </div>
                                <input type="password" name="user[old_password" id="user_old_password"
                                    required="required" autoComplete="current-password" className="form-control pb-2 px-1 py-1 border border-gray-600 rounded-md" />

                                <div className="mb-1"><label htmlForfor="user_new_password">New password</label></div>
                                <input type="password" className="form-control pb-2 px-1 py-1 border border-gray-600 rounded-md" />

                                <div className="mb-1"><label htmlForfor="user_new_password">Confirm new password</label></div>
                                <input type="password" className="form-control pb-2 px-1 py-1 border border-gray-600 rounded-md" />
                                <div className="mt-6 flex items-center justify-between">
                                    {/* “Forgot password?” link */}
                                    <a
                                        href="/password_reset"
                                        className="text-sm text-gray hover:underline focus:outline-none focus:ring-1 focus:ring-gray-600"
                                    >
                                        I forgot my password
                                    </a>

                                    {/* Update button */}
                                    <button
                                        type="submit"
                                        className="
                                            px-4 py-2
                                            text-gray-600 text-sm font-medium
                                            rounded-md
                                            hover: dark
                                            focus:outline-none focus:ring-1 focus:ring-dark
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
export default Setting
