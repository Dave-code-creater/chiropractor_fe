// Safe auth selectors with null checks
export const selectCurrentUser = (state) => state?.data?.auth?.user ?? null;
export const selectUserEmail = (state) => state?.data?.auth?.email ?? null;
export const selectUserName = (state) => state?.data?.auth?.username ?? null;
export const selectUserRole = (state) => state?.data?.auth?.role ?? null;
export const selectIsAuthenticated = (state) => state?.data?.auth?.isAuthenticated ?? false;
export const selectAuthToken = (state) => state?.data?.auth?.accessToken ?? null;
export const selectUserId = (state) => state?.data?.auth?.userID ?? null;
export const selectUsername = (state) => state?.data?.auth?.username ?? null;

export const selectUserDisplayName = (state) => {
  const user = state?.data?.auth?.user;
  const role = state?.data?.auth?.role;

  if (role === "admin" || role === "doctor") {
    if (user?.profile?.full_name) {
      return `Dr. ${user.profile.full_name}`;
    }
    if (user?.username) {
      return `Dr. ${user.username}`;
    }
    return "Dr. Admin";
  }

  // For patients and other roles
  if (user?.profile?.full_name) {
    return user.profile.full_name;
  }
  if (user?.username) {
    return user.username;
  }
  if (user?.email) {
    return user.email.split("@")[0];
  }
  return "Welcome Back";
}; 