import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';

const OAuthLogin = ({ onLoginSuccess, onLoginError }) => {

    const handleGoogleSuccess = (credentialResponse) => {
        try {
            const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
            const userData = {
                provider: 'google',
                id: decoded.sub,
                email: decoded.email,
                name: decoded.name,
                picture: decoded.picture,
                token: credentialResponse.credential
            };
            onLoginSuccess(userData);
        } catch (error) {
            console.error('Google login error:', error);
            onLoginError('Google login failed', error);
        }
    };

    const handleGoogleError = () => {
        console.error('Google login failed');
        onLoginError('Google login failed');
    };

    const handleFacebookLogin = () => {
        toast.info('Facebook Sign-In coming soon!');
    };

    const handleAppleLogin = () => {
        toast.info('Apple Sign-In coming soon!');
    };

    return (
        <div className="oauth-login-container space-y-4">
            <div className="text-center text-sm text-gray-500 mb-4">
                Or continue with
            </div>
            <div className="oauth-buttons space-y-3">
                <div className="oauth-button w-full">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        theme="outline"
                        size="large"
                        text="continue_with"
                        shape="rectangular"
                        width="100%"
                        containerProps={{
                            style: { width: '100%' }
                        }}
                    />
                </div>

                <div className="oauth-button w-full">
                    <button
                        onClick={handleFacebookLogin}
                        className="w-full h-12 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Continue with Facebook
                    </button>
                </div>

                <div className="oauth-button w-full">
                    <button
                        onClick={handleAppleLogin}
                        className="w-full h-12 border border-black rounded-lg bg-black text-white font-medium flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path fill="white" d="M12.152,6.896c-0.948,0-2.415-1.078-3.96-1.04c-2.04,0.027-3.91,1.183-4.961,3.014c-2.117,3.675-0.546,9.103,1.519,12.09c1.013,1.454,2.208,3.09,3.792,3.039c1.52-0.065,2.09-0.987,3.935-0.987c1.831,0,2.35,0.987,3.96,0.948c1.637-0.026,2.676-1.48,3.676-2.948c1.156-1.688,1.636-3.325,1.662-3.415c-0.039-0.013-3.182-1.221-3.22-4.857c-0.026-3.04,2.48-4.494,2.597-4.559c-1.429-2.09-3.623-2.324-4.39-2.376C15.724,7.756,13.172,6.896,12.152,6.896z M15.132,4.729c0.93-1.107,1.558-2.63,1.387-4.153c-1.34,0.056-2.983,0.891-3.952,2.024c-0.87,1.005-1.636,2.616-1.432,4.14C12.602,6.753,14.2,5.84,15.132,4.729z" />
                        </svg>
                        Continue with Apple
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OAuthLogin;
