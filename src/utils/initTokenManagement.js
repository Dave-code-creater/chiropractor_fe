/**
 * Token Management Initialization Utility
 * 
 * This utility helps initialize automatic token management when the app starts,
 * especially important for users who are already logged in when they reload the page.
 */

import { initializeTokenManagement } from '../services/baseApi';

/**
 * Initialize token management system
 * Call this once when your app starts to set up automatic token refresh
 */
export const initTokenManagement = () => {
  // Get current auth state from localStorage or Redux
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (accessToken || refreshToken) {
    // User has tokens, initialize token management
    initializeTokenManagement();
  } else {
    // No tokens present, token management will start when user logs in
  }
};

/**
 * Initialize token management for authenticated users
 * Called after successful login or when app starts with existing tokens
 */
export const initAuthenticatedTokenManagement = () => {
  initializeTokenManagement();
};

/**
 * Reinitialize token management
 * Useful after login/logout or when debugging
 */
export const reinitTokenManagement = () => {
  initializeTokenManagement();
};

export default initTokenManagement; 