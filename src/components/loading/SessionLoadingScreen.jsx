import React from 'react';

const SessionLoadingScreen = ({ message = "Restoring your session..." }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            zIndex: 9999
        }}>
            <div style={{
                marginBottom: '2rem',
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#4F46E5'
            }}>
                🩺 Chiropractor
            </div>
            <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid #E5E7EB',
                borderTop: '3px solid #4F46E5',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '1rem'
            }} />
            <div style={{
                fontSize: '16px',
                color: '#6B7280',
                textAlign: 'center',
                maxWidth: '300px'
            }}>
                {message}
            </div>
            <style>
                {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
            </style>
        </div>
    );
};

export default SessionLoadingScreen;
