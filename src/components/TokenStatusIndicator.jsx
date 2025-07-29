import React from 'react';
import { useTokenStatus } from '../hooks/useTokenStatus';

/**
 * Development component to display token status information
 * Only shows in development mode for debugging purposes
 */
const TokenStatusIndicator = ({ showInProduction = false }) => {
  const tokenStatus = useTokenStatus();
  
  // Only show in development mode unless explicitly enabled
  const isDevelopment = import.meta.env.MODE === 'development';
  if (!isDevelopment && !showInProduction) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 9999,
      border: `2px solid ${tokenStatus.getStatusColor()}`,
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    }}>
      <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>
        Token Status: 
        <span style={{ color: tokenStatus.getStatusColor(), marginLeft: '4px' }}>
          {tokenStatus.getStatusText()}
        </span>
      </div>
      
      {tokenStatus.isValid && (
        <div>
          Expires in: {tokenStatus.getTimeUntilExpiryString()}
        </div>
      )}
      
      <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.7 }}>
        Refresh Token: {tokenStatus.hasRefreshToken ? '✓' : '✗'}
      </div>
      
      {tokenStatus.expirationDate && (
        <div style={{ fontSize: '10px', opacity: 0.7 }}>
          Expires: {tokenStatus.expirationDate.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default TokenStatusIndicator; 