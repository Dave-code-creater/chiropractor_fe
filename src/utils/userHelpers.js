/**
 * User data helper utilities
 * Provides convenient access to user information from auth and user entity slices
 */

/**
 * Get complete user data from state
 * @param {object} state - Redux state
 * @returns {object|null} - Complete user object or null
 */
export const getUserData = (state) => {
  return state?.auth?.user ?? null;
};

/**
 * Get user profile data
 * @param {object} state - Redux state
 * @returns {object|null} - User profile or null
 */
export const getUserProfile = (state) => {
  // Try auth slice first, then user entity slice
  return state?.auth?.user?.profile ?? state?.entities?.user?.profile ?? null;
};

/**
 * Get user details
 * @param {object} state - Redux state
 * @returns {object|null} - User details or null
 */
export const getUserDetails = (state) => {
  // Combine data from both slices
  const authUser = state?.auth?.user;
  const entityDetails = state?.entities?.user?.details;
  
  if (!authUser && !entityDetails) return null;
  
  return {
    ...entityDetails,
    ...authUser,
    // Ensure profile is included
    profile: getUserProfile(state)
  };
};

/**
 * Get user display name with role formatting
 * @param {object} state - Redux state
 * @returns {string} - Formatted display name
 */
export const getUserDisplayName = (state) => {
  const user = getUserData(state);
  const role = state?.auth?.role;

  if (!user) return "Welcome Back";

  // Check profile data first (most detailed)
  const profile = getUserProfile(state);
  if (profile?.full_name) {
    return role === "admin" || role === "doctor" 
      ? `Dr. ${profile.full_name}` 
      : profile.full_name;
  }

  // Check direct user fields
  if (user?.first_name && user?.last_name) {
    const fullName = `${user.first_name} ${user.last_name}`;
    return role === "admin" || role === "doctor" 
      ? `Dr. ${fullName}` 
      : fullName;
  }

  // Fallback to username or email
  if (user?.username) {
    return role === "admin" || role === "doctor" 
      ? `Dr. ${user.username}` 
      : user.username;
  }

  if (user?.email) {
    const emailName = user.email.split("@")[0];
    return role === "admin" || role === "doctor" 
      ? `Dr. ${emailName}` 
      : emailName;
  }

  return "Welcome Back";
};

/**
 * Get user initials for avatar
 * @param {object} state - Redux state
 * @returns {string} - User initials
 */
export const getUserInitials = (state) => {
  const user = getUserData(state);
  const profile = getUserProfile(state);
  
  if (profile?.full_name) {
    const names = profile.full_name.split(' ');
    return names.length >= 2 
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : names[0].substring(0, 2).toUpperCase();
  }
  
  if (user?.first_name && user?.last_name) {
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  }
  
  if (user?.username) {
    return user.username.substring(0, 2).toUpperCase();
  }
  
  if (user?.email) {
    return user.email.substring(0, 2).toUpperCase();
  }
  
  return "U";
};

/**
 * Check if user is verified
 * @param {object} state - Redux state
 * @returns {boolean} - Verification status
 */
export const isUserVerified = (state) => {
  const user = getUserData(state);
  const profile = getUserProfile(state);
  
  return user?.is_verified ?? profile?.is_verified ?? false;
};

/**
 * Get user contact information
 * @param {object} state - Redux state
 * @returns {object} - Contact info object
 */
export const getUserContactInfo = (state) => {
  const user = getUserData(state);
  const profile = getUserProfile(state);
  
  return {
    email: user?.email ?? profile?.email ?? null,
    phone: user?.phone ?? profile?.phone_number ?? null,
    address: profile?.home_address ?? null,
    zipCode: profile?.zip_code ?? null,
  };
};

/**
 * Get user role with display formatting
 * @param {object} state - Redux state
 * @returns {object} - Role info
 */
export const getUserRole = (state) => {
  const role = state?.auth?.role;
  
  const roleMap = {
    admin: { text: "Administrator", variant: "default", icon: "👑" },
    doctor: { text: "Doctor", variant: "secondary", icon: "👩‍⚕️" },
    staff: { text: "Staff", variant: "outline", icon: "👔" },
    patient: { text: "Patient", variant: "outline", icon: "👤" },
  };
  
  return roleMap[role] || { text: "User", variant: "outline", icon: "👤" };
};

/**
 * Check if user has specific role
 * @param {object} state - Redux state
 * @param {string|array} allowedRoles - Role(s) to check
 * @returns {boolean} - Whether user has the role
 */
export const userHasRole = (state, allowedRoles) => {
  const userRole = state?.auth?.role;
  if (!userRole) return false;
  
  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(userRole);
  }
  
  return userRole === allowedRoles;
};

/**
 * Get user preferences
 * @param {object} state - Redux state
 * @returns {object} - User preferences
 */
export const getUserPreferences = (state) => {
  return state?.entities?.user?.preferences ?? {
    theme: "light",
    notifications: true,
    language: "en",
  };
};

/**
 * Get current user with combined data from auth and entities
 */
export const getCurrentUser = (state) => {
  const authData = {
    id: state?.auth?.userID,
    role: state?.auth?.role,
    email: state?.auth?.email,
    username: state?.auth?.username,
  };
  
  const userDetails = state?.entities?.user?.details;
  const userProfile = state?.entities?.user?.profile;
  
  if (!authData.id) return null;
  
  return {
    ...authData,
    ...userDetails,
    profile: userProfile,
  };
};

/**
 * Get user display name with role prefix for medical staff
 */
export const getUserDisplayName = (state) => {
  const role = state?.auth?.role;
  const profile = state?.entities?.user?.profile;
  const details = state?.entities?.user?.details;
  const authEmail = state?.auth?.email;
  const authUsername = state?.auth?.username;

  if (!role) return "Welcome Back";

  // Check profile data first (most detailed)
  if (profile?.full_name && profile.full_name !== 'undefined undefined') {
    return role === "admin" || role === "doctor" 
      ? `Dr. ${profile.full_name}` 
      : profile.full_name;
  }

  // Check details for first/last name
  if (details?.first_name && details?.last_name) {
    const fullName = `${details.first_name} ${details.last_name}`;
    return role === "admin" || role === "doctor" 
      ? `Dr. ${fullName}` 
      : fullName;
  }

  // Fallback to auth username or email
  if (authUsername) {
    return role === "admin" || role === "doctor" 
      ? `Dr. ${authUsername}` 
      : authUsername;
  }

  if (authEmail) {
    const emailName = authEmail.split("@")[0];
    return role === "admin" || role === "doctor" 
      ? `Dr. ${emailName}` 
      : emailName;
  }

  return "Welcome Back";
};

/**
 * Get user initials for avatar display
 */
export const getUserInitials = (state) => {
  const profile = state?.entities?.user?.profile;
  const details = state?.entities?.user?.details;
  const authUsername = state?.auth?.username;
  const authEmail = state?.auth?.email;
  
  if (profile?.full_name && profile.full_name !== 'undefined undefined') {
    const names = profile.full_name.split(' ').filter(n => n && n !== 'undefined');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
  }
  
  if (details?.first_name && details?.last_name) {
    return `${details.first_name[0]}${details.last_name[0]}`.toUpperCase();
  }
  
  if (authUsername) {
    return authUsername.substring(0, 2).toUpperCase();
  }
  
  if (authEmail) {
    return authEmail.substring(0, 2).toUpperCase();
  }
  
  return "U";
};

/**
 * Get user role display information
 */
export const getUserRoleDisplay = (state) => {
  const role = state?.auth?.role;
  
  const roleMap = {
    admin: { text: "Administrator", variant: "default", icon: "👑" },
    doctor: { text: "Doctor", variant: "secondary", icon: "👩‍⚕️" },
    staff: { text: "Staff", variant: "outline", icon: "👔" },
    patient: { text: "Patient", variant: "outline", icon: "👤" },
  };
  
  return roleMap[role] || { text: "User", variant: "outline", icon: "👤" };
};

/**
 * Quick access functions for auth identity
 */
export const getUserId = (state) => state?.auth?.userID;
export const getUserRole = (state) => state?.auth?.role;
export const getUserEmail = (state) => state?.auth?.email;
export const getUsername = (state) => state?.auth?.username;
export const isAuthenticated = (state) => state?.auth?.isAuthenticated ?? false;

/**
 * User profile data access
 */
export const getUserProfile = (state) => state?.entities?.user?.profile;
export const getUserDetails = (state) => state?.entities?.user?.details;
export const getUserPreferences = (state) => 
  state?.entities?.user?.preferences ?? { theme: "light", notifications: true, language: "en" };

/**
 * Contact information helpers
 */
export const getUserContactInfo = (state) => {
  const profile = state?.entities?.user?.profile;
  const details = state?.entities?.user?.details;
  const authEmail = state?.auth?.email;
  
  return {
    email: authEmail || profile?.email || details?.email,
    phone: details?.phone_number || profile?.phone_number,
    address: profile?.address || details?.address,
  };
};

/**
 * Verification status helpers
 */
export const getUserVerificationStatus = (state) => {
  const details = state?.entities?.user?.details;
  const profile = state?.entities?.user?.profile;
  
  return {
    emailVerified: details?.is_verified ?? profile?.email_verified ?? false,
    phoneVerified: details?.phone_verified ?? profile?.phone_verified ?? false,
  };
};

/**
 * Check if user has complete profile
 */
export const hasCompleteProfile = (state) => {
  const profile = state?.entities?.user?.profile;
  const details = state?.entities?.user?.details;
  
  // Basic requirements for complete profile
  const hasBasicInfo = !!(
    (profile?.full_name && profile.full_name !== 'undefined undefined') ||
    (details?.first_name && details?.last_name)
  );
  
  const hasContactInfo = !!(
    state?.auth?.email || 
    profile?.email || 
    details?.email
  );
  
  return hasBasicInfo && hasContactInfo;
};

/**
 * Format user data for display in components
 */
export const formatUserForDisplay = (state) => {
  const authData = {
    id: state?.auth?.userID,
    role: state?.auth?.role,
    email: state?.auth?.email,
    username: state?.auth?.username,
  };
  
  const profile = state?.entities?.user?.profile;
  const details = state?.entities?.user?.details;
  
  if (!authData.id) return null;
  
  return {
    id: authData.id,
    displayName: getUserDisplayName(state),
    initials: getUserInitials(state),
    role: getUserRoleDisplay(state),
    email: authData.email,
    username: authData.username,
    avatar: profile?.avatar_url || details?.avatar_url,
    isVerified: getUserVerificationStatus(state).emailVerified,
    lastLogin: details?.last_login_at,
    memberSince: details?.created_at,
  };
};

/**
 * Helper for components that need to check user permissions
 */
export const hasRole = (state, requiredRole) => {
  const userRole = state?.auth?.role;
  
  // Role hierarchy
  const roleHierarchy = {
    admin: 4,
    doctor: 3,
    staff: 2,
    patient: 1,
  };
  
  if (!userRole) return false;
  
  return roleHierarchy[userRole] >= (roleHierarchy[requiredRole] || 0);
};

/**
 * Helper for checking multiple roles
 */
export const hasAnyRole = (state, roles = []) => {
  const userRole = state?.auth?.role;
  return roles.includes(userRole);
};

/**
 * Medical staff check
 */
export const isMedicalStaff = (state) => {
  return hasAnyRole(state, ['admin', 'doctor', 'staff']);
};

/**
 * Admin check
 */
export const isAdmin = (state) => {
  return hasRole(state, 'admin');
};

/**
 * Patient check
 */
export const isPatient = (state) => {
  return hasRole(state, 'patient') && !isMedicalStaff(state);
}; 