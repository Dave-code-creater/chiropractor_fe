import { format, isToday, isFuture, isPast, differenceInHours } from 'date-fns';

/**
 * Appointment Domain Service
 * Handles business logic and role-based permissions for appointments
 */
export class AppointmentService {
  constructor() {
    this.ROLES = {
      ADMIN: 'admin',
      DOCTOR: 'doctor',
      STAFF: 'staff',
      PATIENT: 'patient',
      USER: 'user'
    };

    this.APPOINTMENT_STATUSES = {
      PENDING: 'pending',
      CONFIRMED: 'confirmed',
      COMPLETED: 'completed',
      CANCELLED: 'cancelled',
      NO_SHOW: 'no-show',
      RESCHEDULE_REQUESTED: 'reschedule_requested'
    };

    this.APPOINTMENT_TYPES = {
      CONSULTATION: 'consultation',
      FOLLOW_UP: 'follow-up',
      TREATMENT: 'treatment',
      EMERGENCY: 'emergency',
      CHECK_UP: 'check-up'
    };
  }

  /**
   * Get permissions for a specific role
   */
  getPermissions(role) {
    const permissions = {
      [this.ROLES.ADMIN]: {
        canViewAll: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canChangeStatus: true,
        canViewAnalytics: true,
        canBulkUpdate: true,
        canViewRevenue: true,
        canManageSchedule: true,
        canContactPatients: true,
        canViewNotes: true,
        canExport: true
      },
      [this.ROLES.DOCTOR]: {
        canViewAll: false, // Only own appointments
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canChangeStatus: true,
        canViewAnalytics: false,
        canBulkUpdate: false,
        canViewRevenue: false,
        canManageSchedule: true,
        canContactPatients: true,
        canViewNotes: true,
        canExport: false
      },
      [this.ROLES.STAFF]: {
        canViewAll: true,
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canChangeStatus: true,
        canViewAnalytics: false,
        canBulkUpdate: true,
        canViewRevenue: false,
        canManageSchedule: true,
        canContactPatients: true,
        canViewNotes: false,
        canExport: true
      },
      [this.ROLES.PATIENT]: {
        canViewAll: false, // Only own appointments
        canCreate: true,
        canEdit: false,
        canDelete: false,
        canChangeStatus: false,
        canViewAnalytics: false,
        canBulkUpdate: false,
        canViewRevenue: false,
        canManageSchedule: false,
        canContactPatients: false,
        canViewNotes: false,
        canExport: false
      },
      [this.ROLES.USER]: {
        canViewAll: false, // Only own appointments
        canCreate: true,
        canEdit: false,
        canDelete: false,
        canChangeStatus: false,
        canViewAnalytics: false,
        canBulkUpdate: false,
        canViewRevenue: false,
        canManageSchedule: false,
        canContactPatients: false,
        canViewNotes: false,
        canExport: false
      }
    };

    return permissions[role] || permissions[this.ROLES.USER];
  }

  /**
   * Check if user can perform specific action
   */
  canPerformAction(userRole, action) {
    const permissions = this.getPermissions(userRole);
    return permissions[action] || false;
  }

  /**
   * Get available actions for an appointment based on user role and appointment state
   */
  getAvailableActions(appointment, userRole, currentUserId) {
    const permissions = this.getPermissions(userRole);
    const actions = [];
    const appointmentDate = new Date(appointment.appointment_date);
    const isOwner = appointment.patient_id === currentUserId || appointment.doctor_id === currentUserId;

    // Admin can do everything
    if (userRole === this.ROLES.ADMIN) {
      actions.push('view', 'edit', 'delete', 'changeStatus', 'contact', 'notes');
      return actions;
    }

    // Doctor actions
    if (userRole === this.ROLES.DOCTOR) {
      if (appointment.doctor_id === currentUserId) {
        actions.push('view', 'edit', 'changeStatus', 'contact', 'notes');
        if (appointment.status === this.APPOINTMENT_STATUSES.PENDING) {
          actions.push('confirm', 'cancel');
        }
        if (appointment.status === this.APPOINTMENT_STATUSES.CONFIRMED) {
          actions.push('complete', 'reschedule');
        }
      }
      return actions;
    }

    // Staff actions
    if (userRole === this.ROLES.STAFF) {
      actions.push('view', 'edit', 'changeStatus', 'contact');
      if (appointment.status === this.APPOINTMENT_STATUSES.PENDING) {
        actions.push('confirm', 'cancel');
      }
      if (appointment.status === this.APPOINTMENT_STATUSES.CONFIRMED) {
        actions.push('complete', 'reschedule');
      }
      return actions;
    }

    // Patient actions
    if (userRole === this.ROLES.PATIENT || userRole === this.ROLES.USER) {
      if (appointment.patient_id === currentUserId) {
        actions.push('view');
        
        // Can only cancel/reschedule future appointments
        if (isFuture(appointmentDate) && 
            [this.APPOINTMENT_STATUSES.PENDING, this.APPOINTMENT_STATUSES.CONFIRMED].includes(appointment.status)) {
          actions.push('cancel', 'reschedule');
        }
        
        // Can provide feedback for completed appointments
        if (appointment.status === this.APPOINTMENT_STATUSES.COMPLETED) {
          actions.push('feedback');
        }
      }
      return actions;
    }

    return actions;
  }

  /**
   * Validate appointment data
   */
  validateAppointment(appointmentData, userRole) {
    const errors = [];

    // Required fields
    if (!appointmentData.patient_id) {
      errors.push('Patient is required');
    }
    if (!appointmentData.doctor_id) {
      errors.push('Doctor is required');
    }
    if (!appointmentData.appointment_date) {
      errors.push('Appointment date is required');
    }
    if (!appointmentData.appointment_time) {
      errors.push('Appointment time is required');
    }

    // Date validation
    if (appointmentData.appointment_date) {
      const appointmentDate = new Date(appointmentData.appointment_date);
      if (isPast(appointmentDate) && !isToday(appointmentDate)) {
        errors.push('Cannot schedule appointments in the past');
      }
    }

    // Duration validation
    if (appointmentData.duration_minutes) {
      const duration = parseInt(appointmentData.duration_minutes);
      if (duration < 15 || duration > 240) {
        errors.push('Duration must be between 15 and 240 minutes');
      }
    }

    // Role-specific validations
    if (userRole === this.ROLES.PATIENT || userRole === this.ROLES.USER) {
      // Patients can only book for themselves
      // This would be handled by the API by setting patient_id automatically
    }

    return errors;
  }

  /**
   * Get appointment status color
   */
  getStatusColor(status) {
    const colors = {
      [this.APPOINTMENT_STATUSES.PENDING]: 'bg-yellow-100 text-yellow-800',
      [this.APPOINTMENT_STATUSES.CONFIRMED]: 'bg-green-100 text-green-800',
      [this.APPOINTMENT_STATUSES.COMPLETED]: 'bg-blue-100 text-blue-800',
      [this.APPOINTMENT_STATUSES.CANCELLED]: 'bg-red-100 text-red-800',
      [this.APPOINTMENT_STATUSES.NO_SHOW]: 'bg-gray-100 text-gray-800',
      [this.APPOINTMENT_STATUSES.RESCHEDULE_REQUESTED]: 'bg-purple-100 text-purple-800'
    };

    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  /**
   * Get appointment type display name
   */
  getTypeDisplayName(type) {
    const displayNames = {
      [this.APPOINTMENT_TYPES.CONSULTATION]: 'Consultation',
      [this.APPOINTMENT_TYPES.FOLLOW_UP]: 'Follow-up',
      [this.APPOINTMENT_TYPES.TREATMENT]: 'Treatment',
      [this.APPOINTMENT_TYPES.EMERGENCY]: 'Emergency',
      [this.APPOINTMENT_TYPES.CHECK_UP]: 'Check-up'
    };

    return displayNames[type] || 'Consultation';
  }

  /**
   * Check if appointment can be cancelled
   */
  canCancelAppointment(appointment, userRole, currentUserId) {
    const appointmentDate = new Date(appointment.appointment_date);
    const hoursUntilAppointment = differenceInHours(appointmentDate, new Date());

    // Admin can cancel anytime
    if (userRole === this.ROLES.ADMIN) {
      return { canCancel: true, reason: null };
    }

    // Check if appointment is in the future
    if (!isFuture(appointmentDate)) {
      return { canCancel: false, reason: 'Cannot cancel past appointments' };
    }

    // Check if appointment is already cancelled or completed
    if ([this.APPOINTMENT_STATUSES.CANCELLED, this.APPOINTMENT_STATUSES.COMPLETED].includes(appointment.status)) {
      return { canCancel: false, reason: 'Appointment is already cancelled or completed' };
    }

    // Check ownership for patients
    if ((userRole === this.ROLES.PATIENT || userRole === this.ROLES.USER) && 
        appointment.patient_id !== currentUserId) {
      return { canCancel: false, reason: 'Can only cancel your own appointments' };
    }

    // Check 24-hour cancellation policy for patients
    if ((userRole === this.ROLES.PATIENT || userRole === this.ROLES.USER) && 
        hoursUntilAppointment < 24) {
      return { canCancel: false, reason: 'Must cancel at least 24 hours in advance' };
    }

    return { canCancel: true, reason: null };
  }

  /**
   * Format appointment time for display
   */
  formatTime(time) {
    if (!time) return 'TBD';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  /**
   * Format appointment date for display
   */
  formatDate(date) {
    if (!date) return 'TBD';
    return format(new Date(date), 'EEEE, MMMM d, yyyy');
  }

  /**
   * Get appointment priority based on type and status
   */
  getAppointmentPriority(appointment) {
    const priorities = {
      [this.APPOINTMENT_TYPES.EMERGENCY]: 1,
      [this.APPOINTMENT_TYPES.TREATMENT]: 2,
      [this.APPOINTMENT_TYPES.FOLLOW_UP]: 3,
      [this.APPOINTMENT_TYPES.CONSULTATION]: 4,
      [this.APPOINTMENT_TYPES.CHECK_UP]: 5
    };

    return priorities[appointment.type] || 4;
  }

  /**
   * Filter appointments based on user role and permissions
   */
  filterAppointmentsByRole(appointments, userRole, currentUserId) {
    if (userRole === this.ROLES.ADMIN || userRole === this.ROLES.STAFF) {
      return appointments; // Can see all appointments
    }

    if (userRole === this.ROLES.DOCTOR) {
      return appointments.filter(apt => apt.doctor_id === currentUserId);
    }

    if (userRole === this.ROLES.PATIENT || userRole === this.ROLES.USER) {
      return appointments.filter(apt => apt.patient_id === currentUserId);
    }

    return [];
  }

  /**
   * Get role-specific tabs for appointment views
   */
  getRoleTabs(userRole) {
    const baseTabs = [
      { key: 'upcoming', label: 'Upcoming', icon: 'Calendar' },
      { key: 'today', label: 'Today', icon: 'Clock' },
      { key: 'history', label: 'History', icon: 'FileText' }
    ];

    if (userRole === this.ROLES.ADMIN) {
      return [
        { key: 'overview', label: 'Overview', icon: 'BarChart3' },
        { key: 'all', label: 'All Appointments', icon: 'Calendar' },
        { key: 'pending', label: 'Pending', icon: 'Clock' },
        { key: 'analytics', label: 'Analytics', icon: 'TrendingUp' }
      ];
    }

    if (userRole === this.ROLES.DOCTOR) {
      return [
        { key: 'today', label: 'Today', icon: 'Calendar' },
        { key: 'upcoming', label: 'Upcoming', icon: 'Clock' },
        { key: 'completed', label: 'Completed', icon: 'CheckCircle' },
        { key: 'schedule', label: 'Schedule', icon: 'Settings' }
      ];
    }

    if (userRole === this.ROLES.STAFF) {
      return [
        { key: 'today', label: 'Today', icon: 'Calendar' },
        { key: 'pending', label: 'Pending', icon: 'Clock' },
        { key: 'upcoming', label: 'Upcoming', icon: 'Calendar' },
        { key: 'all', label: 'All', icon: 'FileText' }
      ];
    }

    if (userRole === this.ROLES.PATIENT || userRole === this.ROLES.USER) {
      return [
        { key: 'book', label: 'Book Appointment', icon: 'Plus' },
        ...baseTabs
      ];
    }

    return baseTabs;
  }

  /**
   * Get default statistics for role
   */
  getDefaultStats(userRole) {
    if (userRole === this.ROLES.ADMIN) {
      return [
        { key: 'total_appointments', label: 'Total Appointments', icon: 'Calendar' },
        { key: 'pending_confirmations', label: 'Pending Confirmations', icon: 'Clock' },
        { key: 'completed_today', label: 'Completed Today', icon: 'CheckCircle' },
        { key: 'active_doctors', label: 'Active Doctors', icon: 'UserCheck' },
        { key: 'active_patients', label: 'Active Patients', icon: 'Users' },
        { key: 'revenue', label: 'Revenue', icon: 'TrendingUp' },
        { key: 'no_show_rate', label: 'No-Show Rate', icon: 'AlertTriangle' },
        { key: 'cancellation_rate', label: 'Cancellation Rate', icon: 'XCircle' }
      ];
    }

    if (userRole === this.ROLES.DOCTOR) {
      return [
        { key: 'today_appointments', label: "Today's Appointments", icon: 'Calendar' },
        { key: 'pending_reviews', label: 'Pending Reviews', icon: 'Clock' },
        { key: 'completed_today', label: 'Completed Today', icon: 'CheckCircle' },
        { key: 'total_patients', label: 'Total Patients', icon: 'Users' }
      ];
    }

    if (userRole === this.ROLES.STAFF) {
      return [
        { key: 'today_schedule', label: "Today's Schedule", icon: 'Calendar' },
        { key: 'pending_confirmations', label: 'Pending Confirmations', icon: 'Clock' },
        { key: 'confirmed_today', label: 'Confirmed Today', icon: 'CheckCircle' },
        { key: 'active_patients', label: 'Active Patients', icon: 'Users' },
        { key: 'followup_calls', label: 'Follow-up Calls', icon: 'PhoneCall' }
      ];
    }

    if (userRole === this.ROLES.PATIENT || userRole === this.ROLES.USER) {
      return [
        { key: 'total_appointments', label: 'Total Appointments', icon: 'Calendar' },
        { key: 'completed', label: 'Completed', icon: 'CheckCircle' },
        { key: 'upcoming', label: 'Upcoming', icon: 'Clock' },
        { key: 'today', label: 'Today', icon: 'Calendar' }
      ];
    }

    return [];
  }
}

// Export singleton instance
export const appointmentService = new AppointmentService(); 