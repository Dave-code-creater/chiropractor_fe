/**
 * Chat Role-Based Access Rules
 * These rules define who can chat with whom and what actions they can perform
 */

export const CHAT_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor', 
  ADMIN: 'admin'
};

export const ROLE_ACCESS_RULES = {
  [CHAT_ROLES.PATIENT]: {
    canChatWith: [CHAT_ROLES.DOCTOR, CHAT_ROLES.ADMIN],
    description: "Patients can only chat with doctors and admin"
  },
  [CHAT_ROLES.DOCTOR]: {
    canChatWith: [CHAT_ROLES.PATIENT, CHAT_ROLES.DOCTOR, CHAT_ROLES.ADMIN],
    description: "Doctors can chat with patients and colleagues"
  },

  [CHAT_ROLES.ADMIN]: {
    canChatWith: [CHAT_ROLES.PATIENT, CHAT_ROLES.DOCTOR, CHAT_ROLES.ADMIN],
    description: "Admin can chat with everyone (no restrictions)"
  }
};

export const CONVERSATION_TYPES = {
  CONSULTATION: 'consultation',
  GENERAL: 'general', 
  URGENT: 'urgent',
  FOLLOW_UP: 'follow-up'
};

export const PRIORITY_LEVELS = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  SYSTEM: 'system'
};

/**
 * Check if a user can start a conversation with another user based on their roles
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
 */
export const getRoleRestrictionError = (currentUserRole, targetUserRole) => {
  const normalizedCurrentRole = currentUserRole?.toLowerCase();
  const normalizedTargetRole = targetUserRole?.toLowerCase();

  if (normalizedCurrentRole === CHAT_ROLES.PATIENT && normalizedTargetRole === CHAT_ROLES.PATIENT) {
    return "Patients can only start conversations with doctors or administrators";
  }

  return "You are not authorized to start a conversation with this user";
};

/**
 * Format conversation type for display
 */
export const formatConversationType = (type) => {
  if (!type) return 'General';
  return type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ');
};

/**
 * Format priority level for display
 */
export const formatPriority = (priority) => {
  if (!priority) return 'Normal';
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

/**
 * Get role icon name for display
 */
export const getRoleIcon = (role) => {
  switch (role?.toLowerCase()) {
    case CHAT_ROLES.PATIENT:
      return 'user';
    case CHAT_ROLES.DOCTOR:
      return 'stethoscope';

    case CHAT_ROLES.ADMIN:
      return 'shield';
    default:
      return 'user';
  }
};

/**
 * Check if user can update conversation status
 */
export const canUpdateConversationStatus = (userRole) => {
  const normalizedRole = userRole?.toLowerCase();
  return [CHAT_ROLES.DOCTOR, CHAT_ROLES.ADMIN].includes(normalizedRole);
}; 