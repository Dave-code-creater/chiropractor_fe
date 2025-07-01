// Safe auth selectors with null checks
export const selectSafeUser = (state) => state?.data?.auth?.user ?? null;
export const selectSafeEmail = (state) => state?.data?.auth?.email ?? null;
export const selectSafeUsername = (state) => state?.data?.auth?.username ?? null;
export const selectSafeRole = (state) => state?.auth?.role ?? null;
export const selectSafeIsAuthenticated = (state) => state?.auth?.isAuthenticated ?? false;
export const selectSafeAuthState = (state) => state?.data?.auth ?? null;
export const selectSafeUserId = (state) => state?.auth?.userID ?? null;
export const selectSafeAuthToken = (state) => state?.data?.auth?.accessToken ?? null;

export const selectSafeUserDisplayName = (state) => {
  const user = state?.data?.auth?.user;
  const role = state?.data?.auth?.role;

  if (!user) return "Welcome Back";

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