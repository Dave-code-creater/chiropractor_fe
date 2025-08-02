# OAuth Setup Guide

This document explains how to set up OAuth authentication for Google, Facebook, and Apple in your Chiropractor application.

## Environment Configuration

Update your `.env` file with the following OAuth credentials:

```env
# OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_FACEBOOK_APP_ID=your_facebook_app_id_here
VITE_APPLE_CLIENT_ID=your_apple_client_id_here
VITE_APPLE_REDIRECT_URI=your_apple_redirect_uri_here

# Backend API URL
VITE_API_BASE_URL=http://localhost:3001
```

## Provider Setup Instructions

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"
5. Configure the OAuth consent screen if prompted
6. For "Application type", select "Web application"
7. Add authorized origins:
   - `http://localhost:5173` (for development)
   - `https://yourdomain.com` (for production)
8. Add authorized redirect URIs:
   - `http://localhost:5173/auth/callback` (for development)
   - `https://yourdomain.com/auth/callback` (for production)
9. Copy the Client ID and add it to your `.env` file as `VITE_GOOGLE_CLIENT_ID`

### 2. Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" > "Create App"
3. Choose "Consumer" and click "Continue"
4. Fill in your app details and create the app
5. In the dashboard, click "Add Product" and select "Facebook Login"
6. Choose "Web" platform
7. In Facebook Login settings:
   - Add valid OAuth redirect URIs:
     - `http://localhost:5173/` (for development)
     - `https://yourdomain.com/` (for production)
8. In "App Settings" > "Basic":
   - Copy the App ID and add it to your `.env` file as `VITE_FACEBOOK_APP_ID`
   - Add your domain to "App Domains"
9. Make sure your app is in "Live" mode for production

### 3. Apple Sign-In Setup

1. Go to [Apple Developer Portal](https://developer.apple.com/account/)
2. Navigate to "Certificates, Identifiers & Profiles"
3. Create a new App ID:
   - Description: Your app name
   - Bundle ID: com.yourcompany.yourapp
   - Enable "Sign In with Apple" capability
4. Create a Services ID:
   - Description: Your web service name
   - Identifier: com.yourcompany.yourapp.web
   - Enable "Sign In with Apple"
   - Configure domains and subdomains:
     - Primary Domain: yourdomain.com
     - Return URLs: https://yourdomain.com/auth/apple/callback
5. Create a Key for "Sign In with Apple":
   - Download the .p8 key file
   - Note the Key ID
6. Update your `.env` file:
   - `VITE_APPLE_CLIENT_ID` = Services ID identifier
   - `VITE_APPLE_REDIRECT_URI` = https://yourdomain.com/auth/apple/callback

## Backend API Requirements

Your backend needs to handle OAuth authentication. Create these endpoints:

### POST /auth/oauth

Expected request body:
```json
{
  "provider": "google|facebook|apple",
  "id": "provider_user_id",
  "email": "user@example.com",
  "name": "User Name",
  "picture": "https://profile-picture-url.com",
  "token": "oauth_access_token"
}
```

Expected response:
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "patient|doctor|admin",
    "profile": {
      "picture": "https://profile-picture-url.com"
    }
  },
  "accessToken": "jwt_token_here"
}
```

### Backend Implementation Example (Node.js/Express)

```javascript
app.post('/auth/oauth', async (req, res) => {
  try {
    const { provider, id, email, name, picture, token } = req.body;
    
    // Verify the OAuth token with the provider
    let verifiedUser;
    switch (provider) {
      case 'google':
        verifiedUser = await verifyGoogleToken(token);
        break;
      case 'facebook':
        verifiedUser = await verifyFacebookToken(token);
        break;
      case 'apple':
        verifiedUser = await verifyAppleToken(token);
        break;
      default:
        return res.status(400).json({ message: 'Invalid provider' });
    }
    
    // Check if user exists or create new user
    let user = await User.findOne({ 
      $or: [
        { email },
        { [`oauth.${provider}.id`]: id }
      ]
    });
    
    if (!user) {
      // Create new user
      user = new User({
        email,
        name,
        role: 'patient', // Default role
        oauth: {
          [provider]: {
            id,
            email,
            picture
          }
        },
        profile: {
          picture
        }
      });
      await user.save();
    } else {
      // Update existing user's OAuth info
      user.oauth = user.oauth || {};
      user.oauth[provider] = { id, email, picture };
      if (picture && !user.profile?.picture) {
        user.profile = user.profile || {};
        user.profile.picture = picture;
      }
      await user.save();
    }
    
    // Generate JWT token
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile: user.profile
      },
      accessToken
    });
  } catch (error) {
    console.error('OAuth login error:', error);
    res.status(500).json({ message: 'OAuth login failed' });
  }
});
```

## Testing OAuth Integration

1. Start your development server: `npm run dev`
2. Navigate to the login page
3. Click on the OAuth provider buttons
4. Complete the OAuth flow
5. Verify that users are created/logged in correctly

## Security Considerations

1. **Token Verification**: Always verify OAuth tokens on the backend
2. **HTTPS**: Use HTTPS in production for all OAuth redirects
3. **State Parameters**: Implement CSRF protection with state parameters
4. **Token Storage**: Store JWT tokens securely (httpOnly cookies recommended)
5. **Rate Limiting**: Implement rate limiting on OAuth endpoints
6. **Error Handling**: Don't expose sensitive error information to clients

## Troubleshooting

### Common Issues

1. **Google OAuth not working**: Check that your domain is added to authorized origins
2. **Facebook OAuth not working**: Ensure your app is in Live mode and domains are configured
3. **CORS errors**: Make sure your frontend domain is whitelisted in OAuth provider settings
4. **Token verification fails**: Check that you're using the correct client secrets on the backend

### Debug Tips

1. Check browser console for detailed error messages
2. Verify environment variables are loaded correctly
3. Test OAuth flows in provider developer consoles
4. Use network tab to inspect API requests/responses

## Production Deployment

1. Update all OAuth provider settings with production URLs
2. Set production environment variables
3. Enable HTTPS
4. Test all OAuth flows in production environment
5. Monitor OAuth success/failure rates

## Support

For additional help with OAuth setup, refer to:
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/)
- [Apple Sign-In Documentation](https://developer.apple.com/sign-in-with-apple/)
