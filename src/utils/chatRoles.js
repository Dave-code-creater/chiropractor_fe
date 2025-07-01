// Chat Role-Based Access Rules
// Based on the API documentation provided

/**
 * Role-based access rules for chat system
 * These rules define who can chat with whom
 */
export const CHAT_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor', 
  STAFF: 'staff',
  ADMIN: 'admin'
};

/**
 * Role hierarchy and permissions
 */
export const ROLE_ACCESS_RULES = {
  [CHAT_ROLES.PATIENT]: {
    canChatWith: [CHAT_ROLES.DOCTOR, CHAT_ROLES.STAFF, CHAT_ROLES.ADMIN],
    description: "Patients can only chat with doctors, staff, and admin"
  },
  [CHAT_ROLES.DOCTOR]: {
    canChatWith: [CHAT_ROLES.PATIENT, CHAT_ROLES.DOCTOR, CHAT_ROLES.STAFF, CHAT_ROLES.ADMIN],
    description: "Doctors can chat with patients and colleagues"
  },
  [CHAT_ROLES.STAFF]: {
    canChatWith: [CHAT_ROLES.PATIENT, CHAT_ROLES.DOCTOR, CHAT_ROLES.STAFF, CHAT_ROLES.ADMIN],
    description: "Staff can chat with patients and colleagues"
  },
  [CHAT_ROLES.ADMIN]: {
    canChatWith: [CHAT_ROLES.PATIENT, CHAT_ROLES.DOCTOR, CHAT_ROLES.STAFF, CHAT_ROLES.ADMIN],
    description: "Admin can chat with everyone (no restrictions)"
  }
};

/**
 * Conversation types
 */
export const CONVERSATION_TYPES = {
  CONSULTATION: 'consultation',
  GENERAL: 'general', 
  URGENT: 'urgent',
  FOLLOW_UP: 'follow-up'
};

/**
 * Priority levels
 */
export const PRIORITY_LEVELS = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
};

/**
 * Message types
 */
export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  SYSTEM: 'system'
};

/**
 * Check if a user can start a conversation with another user based on their roles
 * @param {string} currentUserRole - Role of the current user
 * @param {string} targetUserRole - Role of the target user
 * @returns {boolean} - Whether the conversation is allowed
 */
export const canStartConversation = (currentUserRole, targetUserRole) => {
  if (!currentUserRole || !targetUserRole) {
    return false;
  }

  const normalizedCurrentRole = currentUserRole.toLowerCase();
  const normalizedTargetRole = targetUserRole.toLowerCase();

  const accessRules = ROLE_ACCESS_RULES[normalizedCurrentRole];
  
  if (!accessRules) {
    return false;
  }

  return accessRules.canChatWith.includes(normalizedTargetRole);
};

/**
 * Get allowed roles for a given user role
 * @param {string} userRole - Current user's role
 * @returns {string[]} - Array of roles the user can chat with
 */
export const getAllowedRoles = (userRole) => {
  if (!userRole) {
    return [];
  }

  const normalizedRole = userRole.toLowerCase();
  const accessRules = ROLE_ACCESS_RULES[normalizedRole];
  
  return accessRules ? accessRules.canChatWith : [];
};

/**
 * Get role description for display
 * @param {string} userRole - User's role
 * @returns {string} - Description of what the role can do
 */
export const getRoleDescription = (userRole) => {
  if (!userRole) {
    return "Unknown role";
  }

  const normalizedRole = userRole.toLowerCase();
  const accessRules = ROLE_ACCESS_RULES[normalizedRole];
  
  return accessRules ? accessRules.description : "Unknown role";
};

/**
 * Validate conversation data before sending to API
 * @param {Object} conversationData - Conversation data to validate
 * @returns {Object} - Validation result with isValid and errorMessage
 */
export const validateConversationData = (conversationData) => {
  const { target_user_id, subject, conversation_type, priority } = conversationData;

  if (!target_user_id) {
    return {
      isValid: false,
      errorMessage: "Target user is required"
    };
  }

  if (!subject || subject.trim().length === 0) {
    return {
      isValid: false,
      errorMessage: "Subject is required"
    };
  }

  if (subject.length > 200) {
    return {
      isValid: false,
      errorMessage: "Subject must be less than 200 characters"
    };
  }

  if (conversation_type && !Object.values(CONVERSATION_TYPES).includes(conversation_type)) {
    return {
      isValid: false,
      errorMessage: "Invalid conversation type"
    };
  }

  if (priority && !Object.values(PRIORITY_LEVELS).includes(priority)) {
    return {
      isValid: false,
      errorMessage: "Invalid priority level"
    };
  }

  return {
    isValid: true,
    errorMessage: null
  };
};

/**
 * Get error message for role restriction
 * @param {string} currentUserRole - Current user's role
 * @param {string} targetUserRole - Target user's role  
 * @returns {string} - Error message
 */
export const getRoleRestrictionError = (currentUserRole, targetUserRole) => {
  const normalizedCurrentRole = currentUserRole?.toLowerCase();
  const normalizedTargetRole = targetUserRole?.toLowerCase();

  if (normalizedCurrentRole === CHAT_ROLES.PATIENT && normalizedTargetRole === CHAT_ROLES.PATIENT) {
    return "Patients can only start conversations with doctors, staff, or administrators";
  }

  return "You are not authorized to start a conversation with this user";
};

/**
 * Format conversation type for display
 * @param {string} type - Conversation type
 * @returns {string} - Formatted type
 */
export const formatConversationType = (type) => {
  if (!type) return 'General';
  
  return type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ');
};

/**
 * Format priority for display
 * @param {string} priority - Priority level
 * @returns {string} - Formatted priority
 */
export const formatPriority = (priority) => {
  if (!priority) return 'Normal';
  
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

/**
 * Get role icon (for UI display)
 * @param {string} role - User role
 * @returns {string} - Icon name or emoji
 */
export const getRoleIcon = (role) => {
  const normalizedRole = role?.toLowerCase();
  
  switch (normalizedRole) {
    case CHAT_ROLES.DOCTOR:
      return '👨‍⚕️';
    case CHAT_ROLES.STAFF:
      return '👥';
    case CHAT_ROLES.ADMIN:
      return '⚙️';
    case CHAT_ROLES.PATIENT:
      return '👤';
    default:
      return '❓';
  }
};

/**
 * Check if user can update conversation status
 * @param {string} userRole - Current user's role
 * @returns {boolean} - Whether user can update status
 */
export const canUpdateConversationStatus = (userRole) => {
  const normalizedRole = userRole?.toLowerCase();
  return [CHAT_ROLES.DOCTOR, CHAT_ROLES.STAFF, CHAT_ROLES.ADMIN].includes(normalizedRole);
};

export default {
  CHAT_ROLES,
  ROLE_ACCESS_RULES,
  CONVERSATION_TYPES,
  PRIORITY_LEVELS,
  MESSAGE_TYPES,
  canStartConversation,
  getAllowedRoles,
  getRoleDescription,
  validateConversationData,
  getRoleRestrictionError,
  formatConversationType,
  formatPriority,
  getRoleIcon,
  canUpdateConversationStatus
}; 